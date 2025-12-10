const Bytez = require("bytez.js");

const key = "cd08d6f9800a6ed26cb21a10590cbe07";
const sdk = new Bytez(key);
const model = sdk.model("Qwen/Qwen3-4B-Instruct-2507");

async function generateAIResponse(prompt) {
    try {
        const { error, output } = await model.run([
            {
                "role": "user",
                "content": prompt
            }
        ]);

        if (error) {
            console.error("AI Error:", error);
            return "An error occurred while generating the response.";
        }

        return output;
    } catch (e) {
        console.error("Exception in generateAIResponse:", e);
        return "Failed to process request.";
    }
}

module.exports = { generateAIResponse };
