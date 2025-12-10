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

async function callApi(endpoint, data) {
    const output = document.getElementById('result-output');
    output.textContent = 'Analyzing... please wait...';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        // Handle if result is an object or string
        let display = result.result;
        if (typeof display === 'object') {
            display = JSON.stringify(display, null, 2);
        }
        output.textContent = display;
    } catch (error) {
        output.textContent = 'Error: ' + error.message;
    }
}

// Feature Functions
function analyzeTitle() {
    const title = document.getElementById('titleInput').value;
    callApi('/api/analyze-title', { title });
}

function extractTags() {
    const input = document.getElementById('tagsInput').value;
    callApi('/api/extract-tags', { input });
}

function checkKeywordDifficulty() {
    const keyword = document.getElementById('keywordInput').value;
    callApi('/api/keyword-difficulty', { keyword });
}

function scanThumbnail() {
    const description = document.getElementById('thumbInput').value;
    callApi('/api/thumbnail-scan', { description });
}

function scoreDescription() {
    const description = document.getElementById('descInput').value;
    callApi('/api/description-score', { description });
}

function optimizeHashtags() {
    const topic = document.getElementById('hashInput').value;
    callApi('/api/hashtag-optimizer', { topic });
}

function analyzeCompetitor() {
    const videoDetails = document.getElementById('compInput').value;
    callApi('/api/competitor-analysis', { videoDetails });
}

function getSeoScore() {
    const title = document.getElementById('seoTitle').value;
    const description = document.getElementById('seoDesc').value;
    const tags = document.getElementById('seoTags').value;
    callApi('/api/seo-score', { title, description, tags });
}

function checkHealth() {
    const stats = document.getElementById('healthInput').value;
    callApi('/api/video-health', { stats });
}

function runAbTest() {
    const title1 = document.getElementById('titleA').value;
    const title2 = document.getElementById('titleB').value;
    callApi('/api/ab-test', { title1, title2 });
}

function findGap() {
    const myKeywords = document.getElementById('myKeywords').value;
    const competitorKeywords = document.getElementById('compKeywords').value;
    callApi('/api/keyword-gap', { myKeywords, competitorKeywords });
}

function autoGenerate() {
    const niche = document.getElementById('autoNiche').value;
    const topic = document.getElementById('autoTopic').value;
    callApi('/api/auto-generate', { niche, topic });
}

function findTrending() {
    const niche = document.getElementById('trendNiche').value;
    callApi('/api/trending', { niche });
}

function checkCategory() {
    const contentSummary = document.getElementById('catContent').value;
    const category = document.getElementById('catSelected').value;
    callApi('/api/category-check', { contentSummary, category });
}

function estimateRpm() {
    const audienceCountry = document.getElementById('rpmCountry').value;
    const contentType = document.getElementById('rpmType').value;
    callApi('/api/rpm-estimator', { audienceCountry, contentType });
}

function predictAlgo() {
    const videoDetails = document.getElementById('algoInput').value;
    callApi('/api/algo-prediction', { videoDetails });
}

// Initial load
showSection('title-analyzer');
