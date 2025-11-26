export const getLLMMove = async (fen, apiKey, model = 'gemini-2.0-flash-exp') => {
    if (!apiKey) {
        throw new Error('API Key is missing');
    }

    const systemPrompt = "You are a world-class chess grandmaster. You will be given a FEN string representing the current board state. Your task is to return *only* the single best move in coordinate notation (e.g., 'e2e4', 'g1f3', 'e7e8q' for promotion). Do not include any other text, explanation, markdown, or chat.";
    const userPrompt = `FEN: ${fen}`;

    // Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{
                text: `${systemPrompt}\n\n${userPrompt}`
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch from LLM');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No response text from LLM');
        }

        // Parse the move (e.g., remove whitespace, find the move string)
        // We expect something like "e2e4"
        const move = text.trim().replace(/\s/g, '').toLowerCase();

        // Basic validation regex for coordinate notation
        // [a-h][1-8][a-h][1-8][qrbn]?
        const moveRegex = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

        // Sometimes LLM might output "Move: e2e4" or similar despite instructions.
        // Let's try to extract the move if it's not clean.
        const match = text.match(/([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (match) {
            return match[0];
        }

        if (moveRegex.test(move)) {
            return move;
        }

        throw new Error(`Invalid move format received: ${text}`);

    } catch (error) {
        console.error('LLM Service Error:', error);
        throw error;
    }
};
