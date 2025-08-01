const GEMINI_API_KEY = import.meta.env.VITE_API;

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const TRANSCRIPTION_API_URL = 'https://itachixobito-deepgram-transcription-api.hf.space/transcribe';

export const callGeminiAPI = async (prompt) => {
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API call failed with status: ${response.status}`);
  }

  const result = await response.json();
  if (result.candidates && result.candidates.length > 0) {
    // Clean the string to remove markdown fences before parsing
    const cleanedJsonText = result.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedJsonText);
  } else {
    console.error("Invalid response structure from Gemini API:", result);
    throw new Error("Invalid response structure from Gemini API");
  }
};

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
    return result.transcript;
};