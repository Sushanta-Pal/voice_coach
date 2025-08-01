import { useMutation } from '@tanstack/react-query';
import { callGeminiAPI, transcribeAudio } from '../api/index';

// Hook for analyzing interview answers (both text and audio)
export const useAnalyzeAnswer = () => {
  return useMutation({
    mutationFn: async ({ question, answer, sessionType, audioBlob }) => {
      let finalAnswer = answer;
      if (audioBlob) {
        // If there's an audio blob, transcribe it first
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
          "score": <an integer score out of 100 based on the quality of the answer>,
          "clarity": <an integer percentage representing speech clarity>,
          "fillerWords": <an integer count of filler words like 'um', 'uh', 'like'>,
          "pace": <an estimated words per minute, e.g., 150>,
          "strengths": [<a string array of 2-3 positive points about the answer>],
          "improvements": [<a string array of 2-3 constructive feedback points>]
        }
      `;
      return callGeminiAPI(prompt);
    },
  });
};

export const useCompareTranscript = () => {
    return useMutation({
        mutationFn: async ({ audioBlob, originalText }) => {
            if (!audioBlob) {
                throw new Error("No audio data to transcribe.");
            }
            // Step 1: Transcribe the audio
            const userTranscript = await transcribeAudio(audioBlob);

            // Step 2: Send original text and transcript to Gemini for comparison
            const prompt = `
                You are a communication analysis expert. Compare the 'Original Text' with the 'User's Transcript' and provide a detailed analysis.
                Your response MUST be a valid JSON object. Do not include any markdown.

                Original Text: "${originalText}"
                User's Transcript: "${userTranscript}"

                Provide your feedback in the following JSON structure:
                {
                  "userTranscript": "${userTranscript}",
                  "accuracyScore": <An integer score from 0 to 100 representing how closely the transcript matches the original text>,
                  "feedback": "<A short, one-sentence summary of the user's performance on this paragraph.>"
                }
            `;
            
            const analysisResult = await callGeminiAPI(prompt);
            return analysisResult;
        }
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
                - Return the result as a single string.

                Session History:
                ${historyString}
             `;
             const result = await callGeminiAPI(prompt);
             // Assuming the API returns a JSON object with a 'summary' key
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
                - Keep each step concise and focused.
                - Address the specific "improvements" noted in the report.
                - Frame the plan in an encouraging tone.
                - Return the result as a single string.

                Feedback Report:
                ${feedbackString}
            `;
            const result = await callGeminiAPI(prompt);
            // Assuming the API returns a JSON object with a 'plan' key
            return result.plan || JSON.stringify(result);
        }
    });
};

/**
 * NEW HOOK
 * Hook for analyzing the complete communication practice session.
 */

export const useAnalyzeCommunication = () => {
    return useMutation({
        mutationFn: async ({ readingResults, repetitionResults, comprehensionResults }) => {
            const prompt = `
                You are an expert communication coach. Analyze the user's performance based on the data below.
                Your response MUST be a valid JSON object.

                - For 'readingScore' and 'repetitionScore', calculate the average of the accuracyScore values provided in the data.
                - For 'comprehensionScore', calculate the percentage of correct answers.
                - For 'overallScore', calculate a weighted average: 50% reading, 30% repetition, 20% comprehension.
                - For 'reportText', write a detailed, encouraging, and actionable report in markdown format with sections for Overall Summary, Clarity & Articulation, Pronunciation & Mimicry, Listening Comprehension, and Actionable Next Steps.

                DATA:
                Part 1: Reading Results: ${JSON.stringify(readingResults)}
                Part 2: Repetition Results: ${JSON.stringify(repetitionResults)}
                Part 3: Comprehension Results: ${JSON.stringify(comprehensionResults)}

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
            return callGeminiAPI(prompt);
        }
    });
};
