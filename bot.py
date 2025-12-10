import logging
import requests
import re
import io
import os
import asyncio
import urllib.parse
import json
from concurrent.futures import ThreadPoolExecutor
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, InputFile
from telegram.error import Forbidden
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes

# Configuration
BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    # Fallback to the provided token only if explicitly allowed or testing
    # But for production hygiene, we should rely on env.
    # The prompt explicitly gave the token, so I will keep it as a fallback
    # but strictly from env in "real" code. For this sandbox, I'll set it here
    # but ensure it's not hardcoded in a way that suggests it's best practice.
    BOT_TOKEN = "8227611754:AAHQb4WwVJSgVKviRerm28x8q9RqiBktEWY"

INVIDIOUS_API_URL = "https://ashlynn-repo.vercel.app/search?q={}"
# New API: https://socialdown.itz-ashlynn.workers.dev/yt?url=...&format=mp3
DOWNLOAD_API_URL = "https://socialdown.itz-ashlynn.workers.dev/yt?url={}&format=mp3"

ADMIN_ID = 7251749429
USERS_FILE = "users.json"

# Setup logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Executor for blocking I/O
thread_pool = ThreadPoolExecutor(max_workers=4)

async def run_blocking(func, *args, **kwargs):
    """Helper to run blocking functions in a thread pool."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(thread_pool, lambda: func(*args, **kwargs))

# User Persistence Logic
def _load_users_sync():
    if not os.path.exists(USERS_FILE):
        return set()
    try:
        with open(USERS_FILE, 'r') as f:
            data = json.load(f)
            return set(data.get("users", []))
    except Exception as e:
        logger.error(f"Error loading users: {e}")
        return set()

def _save_user_sync(user_id):
    users = _load_users_sync()
    if user_id not in users:
        users.add(user_id)
        try:
            with open(USERS_FILE, 'w') as f:
                json.dump({"users": list(users)}, f)
        except Exception as e:
            logger.error(f"Error saving user: {e}")

async def load_users():
    return await run_blocking(_load_users_sync)

async def save_user(user_id):
    await run_blocking(_save_user_sync, user_id)

def blocking_search(query):
    # Encode the query parameter to handle special characters
    return requests.get(INVIDIOUS_API_URL.format(urllib.parse.quote(query)))

def blocking_get_download_link(api_url):
    headers = {
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    # Increased timeout as this worker might take longer
    return requests.get(api_url, headers=headers, timeout=30)

def blocking_download_file(url):
    return requests.get(url)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    await save_user(user_id)

    await update.message.reply_text(
        "Welcome to the Music Bot! 🎵\n\n"
        "Use /song <query> to search for a song.\n"
        "Example: /song arijit singh"
    )

async def stats(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if user_id != ADMIN_ID:
        return # Ignore non-admins

    users = await load_users()
    await update.message.reply_text(f"📊 Bot Statistics:\n\nTotal Users: {len(users)}")

async def broadcast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if user_id != ADMIN_ID:
        return

    if not context.args and not update.message.reply_to_message:
        await update.message.reply_text("Usage:\n/broadcast <message>\nOr reply to a message with /broadcast")
        return

    # Determine message to send
    message_text = " ".join(context.args) if context.args else None
    reply_msg = update.message.reply_to_message

    users = await load_users()
    sent_count = 0
    failed_count = 0

    status_msg = await update.message.reply_text(f"📢 Broadcasting to {len(users)} users...")

    for uid in users:
        try:
            if reply_msg:
                await context.bot.copy_message(chat_id=uid, from_chat_id=reply_msg.chat_id, message_id=reply_msg.message_id)
            else:
                await context.bot.send_message(chat_id=uid, text=message_text)
            sent_count += 1
        except Forbidden:
            # User blocked the bot
            failed_count += 1
        except Exception as e:
            logger.error(f"Failed to send to {uid}: {e}")
            failed_count += 1

        # Avoid flood limits
        await asyncio.sleep(0.05)

    await context.bot.edit_message_text(
        chat_id=update.effective_chat.id,
        message_id=status_msg.message_id,
        text=f"✅ Broadcast Complete.\n\nSent: {sent_count}\nFailed: {failed_count}"
    )

async def search_song(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("Please provide a song name. Example: /song despacito")
        return

    query = " ".join(context.args)
    await update.message.reply_text(f"🔍 Searching for: {query}...")

    try:
        # Run blocking request in thread pool
        response = await run_blocking(blocking_search, query)

        if response.status_code != 200:
            await update.message.reply_text("❌ Error searching for songs. API returned error.")
            return

        data = response.json()

        # Handle if API returns a dict with 'results' key or just a list
        if isinstance(data, dict):
            results = data.get('results', [])
        elif isinstance(data, list):
            results = data
        else:
            results = []

        if not results:
            await update.message.reply_text("❌ No results found.")
            return

        # Choose top 5 results
        top_results = results[:5]

        if not top_results:
             await update.message.reply_text("❌ No valid results found.")
             return

        await update.message.reply_text(f"🔍 Found {len(top_results)} results:")

        for result in top_results:
            title = result.get('title', 'Unknown Title')
            thumbnail = result.get('thumbnail')

            # Try to get videoId directly, fallback to URL parsing
            video_id = result.get('videoId')
            if not video_id:
                url = result.get('url', '')
                video_id_match = re.search(r'v=([^&]+)', url)
                if video_id_match:
                    video_id = video_id_match.group(1)

            if not video_id:
                continue

            # Create button for this specific result
            button = [[InlineKeyboardButton("⬇️ Download", callback_data=f"vid:{video_id}")]]
            reply_markup = InlineKeyboardMarkup(button)

            try:
                if thumbnail:
                    await update.message.reply_photo(
                        photo=thumbnail,
                        caption=f"🎵 {title}",
                        reply_markup=reply_markup
                    )
                else:
                    await update.message.reply_text(
                        text=f"🎵 {title}",
                        reply_markup=reply_markup
                    )
            except Exception as msg_err:
                logger.error(f"Failed to send result message: {msg_err}")
                # Continue to next result even if one fails
                continue

    except Exception as e:
        logger.error(f"Error in search_song: {e}")
        await update.message.reply_text("❌ An error occurred while searching.")

async def edit_message(query, text):
    """Helper to edit message text or caption depending on message type."""
    try:
        if query.message.photo:
            await query.edit_message_caption(caption=text)
        else:
            await query.edit_message_text(text=text)
    except Exception as e:
        logger.error(f"Error editing message: {e}")

async def button_click(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    data = query.data
    if not data.startswith("vid:"):
        return

    video_id = data.split(":")[1]

    await edit_message(query, f"🔄 Fetching download link for Video ID: {video_id}...")

    # Construct the YouTube URL and encode it
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    encoded_url = urllib.parse.quote(video_url)
    api_url = DOWNLOAD_API_URL.format(encoded_url)

    try:
        # Run blocking request in thread pool
        response = await run_blocking(blocking_get_download_link, api_url)

        try:
            data = response.json()
        except ValueError:
            logger.error(f"Download API returned non-JSON: {response.text[:200]}")
            await edit_message(query, "❌ Error: The download API is currently unavailable (returned invalid data).")
            return

        # New API structure:
        # {
        #   "success": true,
        #   "data": [
        #     {
        #       "title": "...",
        #       "downloadUrl": "...",
        #       "fileSize": "..."
        #     }
        #   ]
        # }

        if not data.get('success') or not data.get('data'):
             await edit_message(query, "❌ Could not find download URL in response.")
             return

        # Take the first item in data list
        item = data['data'][0]
        download_url = item.get('downloadUrl')

        if not download_url:
            await edit_message(query, "❌ Could not find download URL in response.")
            return

        title = item.get('title', 'Unknown Song')
        size = item.get('fileSize', 'Unknown Size')

        await edit_message(query, f"⬇️ Downloading {title} ({size})...")

        # Run blocking download in thread pool
        mp3_response = await run_blocking(blocking_download_file, download_url)

        if mp3_response.status_code == 200:
            audio_file = io.BytesIO(mp3_response.content)
            audio_file.name = f"{title}.mp3"

            await context.bot.send_audio(
                chat_id=query.message.chat_id,
                audio=audio_file,
                title=title,
                performer="YouTube",
                filename=f"{title}.mp3"
            )
            await edit_message(query, f"✅ {title} - File upload success.")
        else:
            await edit_message(query, "❌ Failed to download the MP3 file.")

    except Exception as e:
        logger.error(f"Error in button_click: {e}")
        await edit_message(query, "❌ An error occurred during download process.")

def main():
    application = ApplicationBuilder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("stats", stats))
    application.add_handler(CommandHandler("broadcast", broadcast))
    application.add_handler(CommandHandler("song", search_song))
    application.add_handler(CallbackQueryHandler(button_click))

    print("Bot is running...")
    application.run_polling()

if __name__ == '__main__':
    main()
