// backend/server.js

// -----------------------------------
// --- 1. SETUP AND DEPENDENCIES ---
// -----------------------------------

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import fetch from 'node-fetch'; // You'll need node-fetch to make requests

// --- 2. INITIALIZE THE APPLICATION ---

const app = express();
app.use(cors());

// Configure Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// --- 3. DEFINE THE API ENDPOINT ---

/**
 * @route   POST /api/transcribe
 * @desc    Receives an audio file, sends it to Fal AI for transcription, and returns the text.
 * @access  Public
 */
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file was uploaded." });
  }

  try {
    console.log("Sending audio to Fal AI for transcription...");

    // --- a. Read the audio file ---
    const audioBuffer = fs.readFileSync(req.file.path);

    // --- b. Call the Fal AI Speech Recognition API ---
    const response = await fetch('https://fal.run/fal-ai/wizper', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`, // Use your Fal AI key from .env
        'Content-Type': 'audio/webm', // Match the format from the frontend
      },
      body: audioBuffer,
    });

    if (!response.ok) {
      throw new Error(`Fal AI API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    const transcribedText = result.text;
    
    console.log(`Transcription received: "${transcribedText}"`);

    // --- c. Send the transcription back to the React frontend ---
    res.json({ text: transcribedText });

  } catch (error) {
    console.error("ERROR during transcription with Fal AI:", error);
    res.status(500).json({ error: "Failed to transcribe audio. Please check the backend console for details." });
  } finally {
    // --- d. Clean up: Delete the temporary file ---
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});


// -----------------------------------
// --- 4. START THE SERVER ---
// -----------------------------------

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server is running successfully on http://localhost:${PORT}`);
  console.log("Waiting for audio files to be uploaded to /api/transcribe...");
});
