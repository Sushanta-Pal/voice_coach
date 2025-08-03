const GEMINI_API_KEY = import.meta.env.VITE_API;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const TRANSCRIPTION_API_URL = 'https://itachixobito-deepgram-transcription-api.hf.space/transcribe';

// Helper function to introduce a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calls the Gemini API with a given prompt, including robust retry logic.
 * This function now automatically handles rate-limiting (429 errors) by retrying.
 * @param {string} prompt The prompt to send to the Gemini API.
 * @param {number} retries The number of remaining retries.
 * @param {number} delay The delay in ms before the next retry.
 * @returns {Promise<object>} The parsed JSON response from the API.
 */
// MODIFIED: Renamed the function as requested
export const callGeminiAPI = async (prompt, retries = 3, delay = 1000) => {
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // If rate limited and we still have retries left, wait and try again.
        if (response.status === 429 && retries > 0) {
            console.warn(`API rate limit hit. Retrying in ${delay}ms... (${retries} left)`);
            await sleep(delay);
            // MODIFIED: Updated the recursive call to match the new function name
            return callGeminiAPI(prompt, retries - 1, delay * 2);
        }

        if (!response.ok) {
            throw new Error(`Gemini API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0) {
            const jsonText = result.candidates[0].content.parts[0].text
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            return JSON.parse(jsonText);
        } else {
            console.error("Invalid response structure from Gemini API:", result);
            throw new Error("Invalid response structure from Gemini API");
        }
    } catch (error) {
        console.error("Error during Gemini API call:", error);
        // Re-throw the error so React Query can handle it
        throw error;
    }
};

/**
 * Transcribes an audio blob using a specified transcription service.
 * @param {Blob} audioBlob The audio data to transcribe.
 * @returns {Promise<string>} The transcribed text.
 */
export const transcribeAudio = async (audioBlob) => {
    if (!audioBlob) throw new Error("Audio blob is missing.");
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    const response = await fetch(TRANSCRIPTION_API_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
};