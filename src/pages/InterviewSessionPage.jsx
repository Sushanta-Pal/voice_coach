import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { useAnalyzeAnswer } from '../hooks/useVoiceCoach';

// Import UI components and Icons
import Button  from '../components/common/Button';
import {Card, CardContent }from '../components/common/Card';
import Textarea from '../components/common/Textarea.jsx';
import { MicIcon, TypeIcon } from '../components/icons/index';
import LoadingSpinner from '../components/common/LoadingSpinner';

// This would be better managed in a constants file or fetched from an API
const questionBank = {
    Technical: [
        "Explain the difference between a process and a thread.",
        "What is a REST API? How is it different from SOAP?",
        "Describe the concept of Object-Oriented Programming.",
        "What is the purpose of a primary key in a database?",
        "Explain the difference between SQL and NoSQL databases."
    ],
    HR: [
        "Tell me about a time you had a conflict with a coworker and how you resolved it.",
        "What are your biggest strengths and weaknesses?",
        "Where do you see yourself in five years?",
        "Why do you want to work for this company?",
        "Describe a challenging situation you faced at work and how you handled it."
    ],
    English: [
        "What are your favorite hobbies and why do you enjoy them?",
        "If you could travel anywhere in the world, where would you go and why?",
        "Describe your ideal work environment.",
        "What is a skill you would like to learn and why?",
        "Tell me about a book you've read or a movie you've seen recently."
    ],
};

/**
 * The page where users practice answering interview questions.
 */
function InterviewSessionPage() {
    const navigate = useNavigate();
    const { sessionType, addSessionToHistory } = useSessions();
    const { mutate: analyzeAnswer, isPending, isError, error } = useAnalyzeAnswer();

    const [inputType, setInputType] = useState('audio');
    const [isRecording, setIsRecording] = useState(false);
    const [answerText, setAnswerText] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState('');

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Select a random question when the component mounts or sessionType changes
    useEffect(() => {
        const questions = questionBank[sessionType] || questionBank.English;
        const randomIndex = Math.floor(Math.random() * questions.length);
        setCurrentQuestion(questions[randomIndex]);
    }, [sessionType]);

    /**
     * Starts recording audio from the user's microphone.
     */
    const startRecording = async () => {
        setAnswerText('');
        setAudioBlob(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                // Stop all tracks on the stream to turn off the microphone indicator
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
            alert("Could not start recording. Please ensure microphone permissions are enabled in your browser settings.");
        }
    };

    /**
     * Stops the current audio recording.
     */
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    /**
     * Submits the user's answer (text or audio) for feedback analysis.
     */
    const handleFinish = () => {
        if ((inputType === 'text' && !answerText.trim()) || (inputType === 'audio' && !audioBlob)) {
            alert("Please provide an answer first.");
            return;
        }

        analyzeAnswer({ question: currentQuestion, answer: answerText, sessionType, audioBlob }, {
            onSuccess: (feedbackData) => {
                const newSession = addSessionToHistory({
                    type: sessionType,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    ...feedbackData
                });
                navigate(`/app/feedback/${newSession.id}`);
            },
            onError: (err) => {
                alert(`Analysis failed: ${err.message}`);
            }
        });
    };

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl text-center">
                <p className="text-blue-400 font-semibold mb-4">{sessionType} Interview Practice</p>
                <Card className="bg-slate-800 border-slate-700 mb-8">
                    <CardContent className="p-8"><h2 className="text-2xl md:text-3xl leading-snug">{currentQuestion}</h2></CardContent>
                </Card>

                {/* Input Type Switcher */}
                <div className="mb-6">
                    <div className="inline-flex rounded-md shadow-sm bg-slate-800 p-1">
                        <Button variant={inputType === 'audio' ? 'default' : 'ghost'} onClick={() => setInputType('audio')} className="px-4 py-2 text-sm font-medium">
                            <MicIcon className="mr-2 h-5 w-5" /> Audio Input
                        </Button>
                        <Button variant={inputType === 'text' ? 'default' : 'ghost'} onClick={() => setInputType('text')} className="px-4 py-2 text-sm font-medium">
                            <TypeIcon className="mr-2 h-5 w-5" /> Text Input
                        </Button>
                    </div>
                </div>

                {/* Input Area */}
                {inputType === 'audio' ? (
                    <div>
                        <div className="mt-8 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-4">
                                <Button size="lg" onClick={startRecording} disabled={isRecording || isPending}>
                                    <MicIcon className="mr-2 h-5 w-5" /> Start Recording
                                </Button>
                                <Button size="lg" variant="destructive" onClick={stopRecording} disabled={!isRecording || isPending}>
                                    <div className="w-5 h-5 mr-2 bg-white rounded-sm" /> Stop Recording
                                </Button>
                            </div>
                            <p className={`text-lg transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-50'}`}>
                                {isRecording ? '🔴 Recording...' : '⚫ Stopped'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <Textarea
                        placeholder="Type your answer here..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        rows={6}
                        disabled={isPending}
                    />
                )}

                {/* Submission Button */}
                <div className="mt-8 border-t border-slate-700 pt-8">
                    <Button size="lg" onClick={handleFinish} disabled={isPending || (inputType === 'audio' && !audioBlob && !isRecording) || (inputType === 'text' && answerText.trim() === '')}>
                        {isPending ? <LoadingSpinner /> : "Analyze My Answer"}
                    </Button>
                    {isError && <p className="text-red-500 mt-4">Error: {error.message}</p>}
                </div>
            </div>
        </div>
    );
}

export default InterviewSessionPage;
