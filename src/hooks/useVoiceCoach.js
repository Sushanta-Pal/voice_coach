import { useMutation } from '@tanstack/react-query';
import { callGeminiAPI, transcribeAudio } from '../api/index';

// Hook for analyzing interview answers (both text and audio)
export const useAnalyzeAnswer = () => {
    return useMutation({
        mutationFn: async ({ question, answer, sessionType, audioBlob }) => {
            let finalAnswer = answer;
            if (audioBlob) {
                finalAnswer = await transcribeAudio(audioBlob);
            }

            const prompt = `
                You are an expert interview coach for a platform called VoiceCoach.
                A user is practicing for a ${sessionType} interview.
                Analyze the user's answer to the provided question and generate a feedback report.
                Your response MUST be a valid JSON object. Do not include any markdown formatting like \`\`\`json.

                The question was: "${question}"
                The user's answer was: "${finalAnswer}"

                Provide your feedback in a JSON object with the following structure:
                {
                  "answer": "${finalAnswer.replace(/"/g, '\\"')}",
                  "score": <an integer score out of 100>,
                  "clarity": <an integer percentage>,
                  "fillerWords": <an integer count>,
                  "pace": <an estimated words per minute>,
                  "strengths": [<an array of strings>],
                  "improvements": [<an array of strings>]
                }
            `;
            return callGeminiAPI(prompt);
        },
    });
};

// Hook for comparing spoken text to original text
// Note: This hook is not used in the "collect then analyze" flow but is useful for other features.
export const useCompareTranscript = () => {
    return useMutation({
        mutationFn: async ({ audioBlob, originalText }) => {
            const transcribedText = await transcribeAudio(audioBlob);

            const prompt = `
                Analyze the following speech comparison for accuracy.
                Original Text: "${originalText}"
                User's Spoken Text: "${transcribedText}"

                Please return a JSON object with your analysis in the following format:
                {
                  "transcribedText": "${transcribedText.replace(/"/g, '\\"')}",
                  "correctness": <a number between 0 and 100 representing accuracy>,
                  "feedback": "A short feedback message."
                }
            `;
            const analysisResult = await callGeminiAPI(prompt);
            return { ...analysisResult, originalText };
        },
    });
};

// Hook for summarizing progress from session history
export const useSummarizeProgress = () => {
    return useMutation({
        mutationFn: async (sessionHistory) => {
            const historyString = JSON.stringify(sessionHistory, null, 2);
            const prompt = `
                You are an expert career coach. Analyze this user's interview session history and provide a concise, encouraging summary of their progress.
                - Highlight their average score.
                - Identify one key recurring strength and one primary area for improvement.
                - Keep the summary to about 3-4 short paragraphs.
                - Return the result as a single string inside a JSON object: { "summary": "Your text here." }
                
                Session History:
                ${historyString}
            `;
            const result = await callGeminiAPI(prompt);
            return result.summary || JSON.stringify(result);
        }
    });
};

// Hook for generating a study plan from feedback
export const useCreateStudyPlan = () => {
    return useMutation({
        mutationFn: async (feedbackData) => {
            const feedbackString = JSON.stringify(feedbackData, null, 2);
            const prompt = `
                You are an expert career coach. Based on this user's interview feedback report, generate a personalized, actionable 3-step study plan.
                - Keep each step concise and focused and use markdown for formatting.
                - Address the specific "improvements" noted in the report.
                - Return the result as a single string inside a JSON object: { "plan": "Your markdown plan here." }

                Feedback Report:
                ${feedbackString}
            `;
            const result = await callGeminiAPI(prompt);
            return result.plan || JSON.stringify(result);
        }
    });
};

/**
 * Hook for analyzing the entire communication practice session at once.
 * It first transcribes all audio, then sends all data to Gemini in a single call.
 */
export const useAnalyzeCommunication = () => {
    return useMutation({
        mutationFn: async (allResults) => {
            // 1. Concurrently transcribe all audio blobs from reading and repetition stages.
            const readingTranscriptionPromises = allResults.reading.map(result => transcribeAudio(result.audioBlob));
            const repetitionTranscriptionPromises = allResults.repetition.map(result => transcribeAudio(result.audioBlob));
            
            const allPromises = [...readingTranscriptionPromises, ...repetitionTranscriptionPromises];
            const allTranscripts = await Promise.all(allPromises);

            // 2. Map transcripts back to their original texts.
            const transcribedReadingResults = allResults.reading.map((result, index) => ({
                originalText: result.originalText,
                transcribedText: allTranscripts[index],
            }));

            const transcribedRepetitionResults = allResults.repetition.map((result, index) => ({
                originalText: result.originalText,
                transcribedText: allTranscripts[index + allResults.reading.length],
            }));
            
            // 3. Construct the single, large prompt for Gemini.
            const prompt = `
                You are an expert communication coach. Analyze the user's entire performance based on the data below.
                Your response MUST be a valid JSON object.

                - For each item in "readingResults" and "repetitionResults", provide a "correctness" score from 0-100 based on the similarity between originalText and transcribedText.
                - Calculate the average score for 'reading', 'repetition', and 'comprehension'. For comprehension, a correct answer is 100, incorrect is 0.
                - Calculate a weighted 'overall' score: 40% reading, 40% repetition, 20% comprehension.
                - Write a detailed, encouraging "reportText" in markdown format with sections for Overall Summary, Reading Clarity, Repetition Accuracy, Listening Comprehension, and Actionable Next Steps.

                DATA:
                Part 1: Reading Results: ${JSON.stringify(transcribedReadingResults)}
                Part 2: Repetition Results: ${JSON.stringify(transcribedRepetitionResults)}
                Part 3: Comprehension Results: ${JSON.stringify(allResults.comprehension)}

                Provide your full analysis in the following JSON structure:
                {
                  "scores": {
                    "reading": <calculated reading score as an integer>,
                    "repetition": <calculated repetition score as an integer>,
                    "comprehension": <calculated comprehension score as an integer>,
                    "overall": <calculated overall score as an integer>
                  },
                  "reportText": "<The full, detailed markdown report as a single string.>"
                }
            `;
            
            // 4. Make the single API call.
            return callGeminiAPI(prompt);
        }
    });
};