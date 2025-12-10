const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { generateAIResponse } = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 1. Video Title Analyzer
app.post('/api/analyze-title', async (req, res) => {
    const { title } = req.body;
    const prompt = `Analyze this YouTube video title: "${title}".
    Check length, keywords, CTR score, and clickbait score.
    Provide suggestions to boost CTR by 15%.
    Format the response as JSON with keys: "analysis", "suggestions".`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 2. Tags Extractor + Tag Strength Meter (Simulated with AI for now as we don't have direct YT API access for extraction without key, but can generate tags for a topic)
app.post('/api/extract-tags', async (req, res) => {
    const { input } = req.body; // link or topic
    const prompt = `Generate a list of optimized YouTube tags for this topic or video description: "${input}".
    For each tag, estimate competition level (Low/Med/High) and SEO relevance score.
    Format as JSON.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 3. Keyword Difficulty Checker
app.post('/api/keyword-difficulty', async (req, res) => {
    const { keyword } = req.body;
    const prompt = `Analyze this YouTube keyword: "${keyword}".
    Estimate competition (Low/Medium/High), estimated monthly search volume, and a Trending Score.
    Format as JSON.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 4. Thumbnail SEO Scanner (Text based advice)
app.post('/api/thumbnail-scan', async (req, res) => {
    const { description } = req.body; // Description of the thumbnail
    const prompt = `I have a YouTube thumbnail that looks like this: "${description}".
    Analyze it for CTR, color usage, text readability, and emotional trigger.
    Give specific improvement suggestions.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 5. Description Quality Score
app.post('/api/description-score', async (req, res) => {
    const { description } = req.body;
    const prompt = `Analyze this YouTube video description: "${description}".
    Check keyword placement, timestamp usage, and links.
    Give a score from 0-100 and improvement tips.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 6. Hashtag Optimizer
app.post('/api/hashtag-optimizer', async (req, res) => {
    const { topic } = req.body;
    const prompt = `Generate 15 best-performing YouTube hashtags for the topic: "${topic}".`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 7. Competitor Video Analysis (Simulated)
app.post('/api/competitor-analysis', async (req, res) => {
    const { videoDetails } = req.body; // User pastes details or text transcript
    const prompt = `Analyze this competitor video data: "${videoDetails}".
    Provide insights on Views vs Subscribers ratio, Growth, Keywords, Tags, and Engagement.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 8. Real-Time SEO Score
app.post('/api/seo-score', async (req, res) => {
    const { title, description, tags } = req.body;
    const prompt = `Calculate a comprehensive SEO score (0-100) for a YouTube video with:
    Title: "${title}"
    Description: "${description}"
    Tags: "${tags}"
    Explain the score based on engagement potential, retention signals, and CTR factors.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 9. Video Health Checker
app.post('/api/video-health', async (req, res) => {
    const { stats } = req.body; // e.g., "CTR 5%, Watch time 40%"
    const prompt = `Analyze these YouTube video stats: "${stats}".
    Provide a health check report covering CTR, retention, and velocity. Suggest SEO improvements.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 10. A/B Title Testing
app.post('/api/ab-test', async (req, res) => {
    const { title1, title2 } = req.body;
    const prompt = `Compare these two YouTube titles:
    1. "${title1}"
    2. "${title2}"
    Predict which one will perform better and why.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 11. Competitor Keyword Gap Finder
app.post('/api/keyword-gap', async (req, res) => {
    const { myKeywords, competitorKeywords } = req.body;
    const prompt = `Compare my keywords: "${myKeywords}" with competitor keywords: "${competitorKeywords}".
    Identify missing keywords and gaps.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 12. Auto-Generate SEO Title, Description, Tags
app.post('/api/auto-generate', async (req, res) => {
    const { niche, topic } = req.body;
    const prompt = `Generate a smart SEO Title, Description, and Tags for a YouTube video about "${topic}" in the niche "${niche}".`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 13. Trending Opportunities Finder
app.post('/api/trending', async (req, res) => {
    const { niche } = req.body;
    const prompt = `Identify upcoming "search blow-up" topics and trending opportunities in the "${niche}" niche on YouTube.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 14. Video Category Accuracy Checker
app.post('/api/category-check', async (req, res) => {
    const { contentSummary, category } = req.body;
    const prompt = `I have a video about: "${contentSummary}".
    I selected the category: "${category}".
    Is this the correct category? If not, what should it be? explain potential SEO impact.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// 15. RPM/CPM Estimator
app.post('/api/rpm-estimator', async (req, res) => {
    const { audienceCountry, contentType } = req.body;
    const prompt = `Estimate the YouTube RPM and CPM for a channel targeting "${audienceCountry}" with content type "${contentType}".`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

// Bonus: YT Algorithm Prediction
app.post('/api/algo-prediction', async (req, res) => {
    const { videoDetails } = req.body;
    const prompt = `Predict the ranking potential for this video: "${videoDetails}".
    Estimate chances for Suggested Feed placement and Search ranking.`;
    const response = await generateAIResponse(prompt);
    res.json({ result: response });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
