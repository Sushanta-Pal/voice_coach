const GEMINI_API_KEY = import.meta.env.VITE_API;
// Change "gemini-1.5-flash" to a newer model like "gemini-2.5-flash"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const TRANSCRIPTION_API_URL = 'https://itachixobito-deepgram-transcription-api.hf.space/transcribe';
const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Helper function to introduce a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const callGroqAPI = async (prompt, retries = 3, delay = 1000) => {
    const payload = {
        model: "llama-3.3-70b-versatile", // Using Llama 3 70B for high-quality analysis
        messages: [
            {
                role: "system",
                content: "You are an expert interview coach. Your output MUST be a valid JSON object. Do not include markdown formatting like ```json."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" } // Forces Groq to return valid JSON
    };

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if ((response.status === 429 || response.status === 503) && retries > 0) {
            console.warn(`Groq API returned ${response.status}. Retrying in ${delay}ms... (${retries} left)`);
            await sleep(delay);
            return callGroqAPI(prompt, retries - 1, delay * 2);
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq API call failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        if (result.choices && result.choices.length > 0) {
            // Groq returns the message content here
            const jsonText = result.choices[0].message.content.trim();
            return JSON.parse(jsonText);
        } else {
            console.error("Invalid response structure from Groq API:", result);
            throw new Error("Invalid response structure from Groq API");
        }
    } catch (error) {
        console.error("Error during Groq API call:", error);
        throw error;
    }
};
/**
 * Transcribes an audio blob using the official Deepgram API.
 * @param {Blob} audioBlob The audio data to transcribe.
 * @returns {Promise<object>} The transcribed text object { text: "..." }.
 */
export const transcribeAudio = async (audioBlob) => {
    if (!audioBlob) throw new Error("Audio blob is missing.");
    
    console.log("Transcribing audio blob with Deepgram:", audioBlob);

    try {
        const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${DEEPGRAM_API_KEY}`,
                'Content-Type': audioBlob.type || 'audio/webm',
            },
            body: audioBlob
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Deepgram API failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        // Extract the transcript from Deepgram's specific JSON response structure
        const transcript = result.results?.channels[0]?.alternatives[0]?.transcript || "";
        
        // Return it in the format your app expects { text: "..." }
        return { text: transcript };

    } catch (error) {
        console.error("Transcription API Error:", error);
        throw error;
    }
};