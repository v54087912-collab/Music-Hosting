import logging
import requests
import re
import io
import os
import asyncio
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, InputFile
from telegram.ext import ApplicationBuilder, CommandHandler, CallbackQueryHandler, ContextTypes

# Configuration
# Default to the provided token if env var not set (for ease of running in this sandbox)
# In production, this should strictly be from env vars.
DEFAULT_TOKEN = "8227611754:AAHQb4WwVJSgVKviRerm28x8q9RqiBktEWY"
BOT_TOKEN = os.getenv("BOT_TOKEN", DEFAULT_TOKEN)
INVIDIOUS_API_URL = "https://ashlynn-repo.vercel.app/search?q={}"
# New API: https://socialdown.itz-ashlynn.workers.dev/yt?url=...&format=mp3
DOWNLOAD_API_URL = "https://socialdown.itz-ashlynn.workers.dev/yt?url={}&format=mp3"

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
    await update.message.reply_text(
        "Welcome to the Music Bot! 🎵\n\n"
        "Use /song <query> to search for a song.\n"
        "Example: /song arijit singh"
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
        buttons = []

        text_response = "Select your song👇\n\n"

        for i, result in enumerate(top_results):
            title = result.get('title', 'Unknown Title')

            # Try to get videoId directly, fallback to URL parsing
            video_id = result.get('videoId')
            if not video_id:
                url = result.get('url', '')
                video_id_match = re.search(r'v=([^&]+)', url)
                if video_id_match:
                    video_id = video_id_match.group(1)

            if not video_id:
                continue

            # Create button
            buttons.append([InlineKeyboardButton(f"{i+1}️⃣ {title[:30]}", callback_data=f"vid:{video_id}")])
            text_response += f"{i+1}. {title}\n"

        if not buttons:
            await update.message.reply_text("❌ Could not extract video IDs from results.")
            return

        reply_markup = InlineKeyboardMarkup(buttons)
        await update.message.reply_text(text_response, reply_markup=reply_markup)

    except Exception as e:
        logger.error(f"Error in search_song: {e}")
        await update.message.reply_text("❌ An error occurred while searching.")

async def button_click(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    data = query.data
    if not data.startswith("vid:"):
        return

    video_id = data.split(":")[1]

    await query.edit_message_text(text=f"🔄 Fetching download link for Video ID: {video_id}...")

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
            await query.edit_message_text(text="❌ Error: The download API is currently unavailable (returned invalid data).")
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
             await query.edit_message_text(text="❌ Could not find download URL in response.")
             return

        # Take the first item in data list
        item = data['data'][0]
        download_url = item.get('downloadUrl')

        if not download_url:
            await query.edit_message_text(text="❌ Could not find download URL in response.")
            return

        title = item.get('title', 'Unknown Song')
        size = item.get('fileSize', 'Unknown Size')

        await query.edit_message_text(text=f"⬇️ Downloading {title} ({size})...")

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
            await query.edit_message_text(text=f"✅ {title} - File upload success.")
        else:
            await query.edit_message_text(text="❌ Failed to download the MP3 file.")

    except Exception as e:
        logger.error(f"Error in button_click: {e}")
        await query.edit_message_text(text="❌ An error occurred during download process.")

def main():
    application = ApplicationBuilder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("song", search_song))
    application.add_handler(CallbackQueryHandler(button_click))

    print("Bot is running...")
    application.run_polling()

if __name__ == '__main__':
    main()
