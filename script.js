
// Configuration
const API_KEY = "cd08d6f9800a6ed26cb21a10590cbe07";
const MODEL_ID = "Qwen/Qwen3-4B-Instruct-2507";
const API_URL = `https://api.bytez.com/models/v2/${MODEL_ID}`;

// UI Function to switch sections
function showSection(sectionId) {
    const mainContent = document.getElementById('main-content');
    // Clear previous dynamic content but keep the output area
    const outputArea = document.getElementById('output-area');
    mainContent.innerHTML = '';

    // Create section container
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section active';
    sectionDiv.id = sectionId;

    let htmlContent = `<h2>${sectionId.replace(/-/g, ' ').toUpperCase()}</h2>`;

    switch(sectionId) {
        case 'title-analyzer':
            htmlContent += `
                <div class="input-group">
                    <label>Video Title:</label>
                    <input type="text" id="titleInput" placeholder="Enter video title">
                    <button onclick="analyzeTitle()">Analyze</button>
                </div>`;
            break;
        case 'tags-extractor':
            htmlContent += `
                <div class="input-group">
                    <label>Video Description or Topic:</label>
                    <textarea id="tagsInput" rows="4" placeholder="Enter topic or description"></textarea>
                    <button onclick="extractTags()">Extract Tags</button>
                </div>`;
            break;
        case 'keyword-difficulty':
            htmlContent += `
                <div class="input-group">
                    <label>Keyword:</label>
                    <input type="text" id="keywordInput" placeholder="Enter keyword">
                    <button onclick="checkKeywordDifficulty()">Check Difficulty</button>
                </div>`;
            break;
        case 'thumbnail-scanner':
            htmlContent += `
                <div class="input-group">
                    <label>Describe your Thumbnail:</label>
                    <textarea id="thumbInput" rows="4" placeholder="Describe colors, text, and imagery"></textarea>
                    <button onclick="scanThumbnail()">Scan Thumbnail</button>
                </div>`;
            break;
        case 'description-score':
             htmlContent += `
                <div class="input-group">
                    <label>Video Description:</label>
                    <textarea id="descInput" rows="6" placeholder="Paste your description here"></textarea>
                    <button onclick="scoreDescription()">Get Score</button>
                </div>`;
            break;
        case 'hashtag-optimizer':
            htmlContent += `
                <div class="input-group">
                    <label>Topic:</label>
                    <input type="text" id="hashInput" placeholder="Enter topic">
                    <button onclick="optimizeHashtags()">Get Hashtags</button>
                </div>`;
            break;
        case 'competitor-analysis':
            htmlContent += `
                <div class="input-group">
                    <label>Competitor Video Details:</label>
                    <textarea id="compInput" rows="4" placeholder="Paste stats or description of competitor video"></textarea>
                    <button onclick="analyzeCompetitor()">Analyze</button>
                </div>`;
            break;
        case 'seo-score':
            htmlContent += `
                <div class="input-group">
                    <label>Title:</label>
                    <input type="text" id="seoTitle" placeholder="Video Title">
                    <label>Description:</label>
                    <textarea id="seoDesc" rows="3" placeholder="Video Description"></textarea>
                    <label>Tags:</label>
                    <input type="text" id="seoTags" placeholder="Comma separated tags">
                    <button onclick="getSeoScore()">Calculate Score</button>
                </div>`;
            break;
        case 'video-health':
            htmlContent += `
                <div class="input-group">
                    <label>Current Stats (CTR, Watch Time, etc.):</label>
                    <textarea id="healthInput" rows="4" placeholder="e.g. CTR: 4%, Avg View Duration: 3:00"></textarea>
                    <button onclick="checkHealth()">Check Health</button>
                </div>`;
            break;
        case 'ab-test':
            htmlContent += `
                <div class="input-group">
                    <label>Title A:</label>
                    <input type="text" id="titleA" placeholder="First Title">
                    <label>Title B:</label>
                    <input type="text" id="titleB" placeholder="Second Title">
                    <button onclick="runAbTest()">Compare</button>
                </div>`;
            break;
        case 'keyword-gap':
            htmlContent += `
                <div class="input-group">
                    <label>Your Keywords:</label>
                    <textarea id="myKeywords" rows="3" placeholder="Your keywords"></textarea>
                    <label>Competitor Keywords:</label>
                    <textarea id="compKeywords" rows="3" placeholder="Competitor keywords"></textarea>
                    <button onclick="findGap()">Find Gap</button>
                </div>`;
            break;
        case 'auto-generate':
            htmlContent += `
                <div class="input-group">
                    <label>Niche:</label>
                    <input type="text" id="autoNiche" placeholder="e.g. Tech, Gaming">
                    <label>Topic:</label>
                    <input type="text" id="autoTopic" placeholder="Video Topic">
                    <button onclick="autoGenerate()">Generate SEO Data</button>
                </div>`;
            break;
        case 'trending':
            htmlContent += `
                <div class="input-group">
                    <label>Niche:</label>
                    <input type="text" id="trendNiche" placeholder="e.g. Cooking, Finance">
                    <button onclick="findTrending()">Find Trends</button>
                </div>`;
            break;
        case 'category-check':
            htmlContent += `
                <div class="input-group">
                    <label>Content Summary:</label>
                    <textarea id="catContent" rows="3"></textarea>
                    <label>Selected Category:</label>
                    <input type="text" id="catSelected">
                    <button onclick="checkCategory()">Check Category</button>
                </div>`;
            break;
        case 'rpm-estimator':
            htmlContent += `
                <div class="input-group">
                    <label>Audience Country:</label>
                    <input type="text" id="rpmCountry" placeholder="e.g. USA, India">
                    <label>Content Type:</label>
                    <input type="text" id="rpmType" placeholder="e.g. Finance, Vlog">
                    <button onclick="estimateRpm()">Estimate</button>
                </div>`;
            break;
        case 'algo-prediction':
            htmlContent += `
                <div class="input-group">
                    <label>Video Details:</label>
                    <textarea id="algoInput" rows="4"></textarea>
                    <button onclick="predictAlgo()">Predict</button>
                </div>`;
            break;
        default:
            htmlContent += `<p>Select a tool.</p>`;
    }

    sectionDiv.innerHTML = htmlContent;
    mainContent.appendChild(sectionDiv);
    mainContent.appendChild(outputArea);

    // Clear output
    document.getElementById('result-output').textContent = 'Waiting for input...';
}

// AI Function
async function generateAIResponse(prompt) {
    const outputElem = document.getElementById('result-output');
    outputElem.textContent = 'Analyzing... please wait...';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errJson = await response.json();
            throw new Error(errJson.error || response.statusText);
        }

        const data = await response.json();
        const aiOutput = data.output;

        // Try to parse if it's JSON inside string, otherwise show string
        try {
           const parsed = JSON.parse(aiOutput);
           outputElem.textContent = JSON.stringify(parsed, null, 2);
        } catch (e) {
           outputElem.textContent = aiOutput;
        }

    } catch (error) {
        console.error("AI API Error:", error);
        outputElem.textContent = 'Error: ' + error.message;
    }
}

// Feature Functions (Calling AI directly)
function analyzeTitle() {
    const title = document.getElementById('titleInput').value;
    const prompt = `Analyze this YouTube video title: "${title}".
    Check length, keywords, CTR score, and clickbait score.
    Provide suggestions to boost CTR by 15%.
    Format the response as JSON with keys: "analysis", "suggestions".`;
    generateAIResponse(prompt);
}

function extractTags() {
    const input = document.getElementById('tagsInput').value;
    const prompt = `Generate a list of optimized YouTube tags for this topic or video description: "${input}".
    For each tag, estimate competition level (Low/Med/High) and SEO relevance score.
    Format as JSON.`;
    generateAIResponse(prompt);
}

function checkKeywordDifficulty() {
    const keyword = document.getElementById('keywordInput').value;
    const prompt = `Analyze this YouTube keyword: "${keyword}".
    Estimate competition (Low/Medium/High), estimated monthly search volume, and a Trending Score.
    Format as JSON.`;
    generateAIResponse(prompt);
}

function scanThumbnail() {
    const description = document.getElementById('thumbInput').value;
    const prompt = `I have a YouTube thumbnail that looks like this: "${description}".
    Analyze it for CTR, color usage, text readability, and emotional trigger.
    Give specific improvement suggestions.`;
    generateAIResponse(prompt);
}

function scoreDescription() {
    const description = document.getElementById('descInput').value;
    const prompt = `Analyze this YouTube video description: "${description}".
    Check keyword placement, timestamp usage, and links.
    Give a score from 0-100 and improvement tips.`;
    generateAIResponse(prompt);
}

function optimizeHashtags() {
    const topic = document.getElementById('hashInput').value;
    const prompt = `Generate 15 best-performing YouTube hashtags for the topic: "${topic}".`;
    generateAIResponse(prompt);
}

function analyzeCompetitor() {
    const videoDetails = document.getElementById('compInput').value;
    const prompt = `Analyze this competitor video data: "${videoDetails}".
    Provide insights on Views vs Subscribers ratio, Growth, Keywords, Tags, and Engagement.`;
    generateAIResponse(prompt);
}

function getSeoScore() {
    const title = document.getElementById('seoTitle').value;
    const description = document.getElementById('seoDesc').value;
    const tags = document.getElementById('seoTags').value;
    const prompt = `Calculate a comprehensive SEO score (0-100) for a YouTube video with:
    Title: "${title}"
    Description: "${description}"
    Tags: "${tags}"
    Explain the score based on engagement potential, retention signals, and CTR factors.`;
    generateAIResponse(prompt);
}

function checkHealth() {
    const stats = document.getElementById('healthInput').value;
    const prompt = `Analyze these YouTube video stats: "${stats}".
    Provide a health check report covering CTR, retention, and velocity. Suggest SEO improvements.`;
    generateAIResponse(prompt);
}

function runAbTest() {
    const title1 = document.getElementById('titleA').value;
    const title2 = document.getElementById('titleB').value;
    const prompt = `Compare these two YouTube titles:
    1. "${title1}"
    2. "${title2}"
    Predict which one will perform better and why.`;
    generateAIResponse(prompt);
}

function findGap() {
    const myKeywords = document.getElementById('myKeywords').value;
    const competitorKeywords = document.getElementById('compKeywords').value;
    const prompt = `Compare my keywords: "${myKeywords}" with competitor keywords: "${competitorKeywords}".
    Identify missing keywords and gaps.`;
    generateAIResponse(prompt);
}

function autoGenerate() {
    const niche = document.getElementById('autoNiche').value;
    const topic = document.getElementById('autoTopic').value;
    const prompt = `Generate a smart SEO Title, Description, and Tags for a YouTube video about "${topic}" in the niche "${niche}".`;
    generateAIResponse(prompt);
}

function findTrending() {
    const niche = document.getElementById('trendNiche').value;
    const prompt = `Identify upcoming "search blow-up" topics and trending opportunities in the "${niche}" niche on YouTube.`;
    generateAIResponse(prompt);
}

function checkCategory() {
    const contentSummary = document.getElementById('catContent').value;
    const category = document.getElementById('catSelected').value;
    const prompt = `I have a video about: "${contentSummary}".
    I selected the category: "${category}".
    Is this the correct category? If not, what should it be? explain potential SEO impact.`;
    generateAIResponse(prompt);
}

function estimateRpm() {
    const audienceCountry = document.getElementById('rpmCountry').value;
    const contentType = document.getElementById('rpmType').value;
    const prompt = `Estimate the YouTube RPM and CPM for a channel targeting "${audienceCountry}" with content type "${contentType}".`;
    generateAIResponse(prompt);
}

function predictAlgo() {
    const videoDetails = document.getElementById('algoInput').value;
    const prompt = `Predict the ranking potential for this video: "${videoDetails}".
    Estimate chances for Suggested Feed placement and Search ranking.`;
    generateAIResponse(prompt);
}

// Initial load
showSection('title-analyzer');
