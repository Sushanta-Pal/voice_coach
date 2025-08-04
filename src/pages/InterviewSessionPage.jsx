import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { useAnalyzeAnswer } from '../hooks/useVoiceCoach';

// UI Components
import Button from '../components/common/Button';
import { Card, CardContent } from '../components/common/Card';
import { MicIcon } from '../components/icons/index';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowRight } from 'lucide-react';

// --- Main Page Component: The State Machine ---
function InterviewSessionPage() {
    const navigate = useNavigate();
    const { sessionType, addSessionToHistory } = useSessions();
    const { mutateAsync: analyzeAnswer } = useAnalyzeAnswer();

    const [stage, setStage] = useState('introduction');
    const [isProcessingSession, setIsProcessingSession] = useState(false);

    // NEW: State to hold the selected question set and loading status
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
    const [questionSet, setQuestionSet] = useState(null);

    // NEW: State to hold the results from all stages
    const [sessionResults, setSessionResults] = useState({
        introduction: null,
        core: null,
        closing: null,
    });

    // NEW: useEffect to fetch questions from the JSON file
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Fetch the JSON file from the public folder
                const response = await fetch('/interview-questions.json');
                if (response.ok) {
                    console.log('[Frontend] 📥 Successfully fetched interview questions.');
                }
                
                const allQuestionSets = await response.json();
                
                // Get the array of sets for the current session type (e.g., 'Technical' or 'HR')
                const setsForType = allQuestionSets[sessionType];
                
                // Select one random set from the array
                const randomIndex = Math.floor(Math.random() * setsForType.length);
                const selectedSet = setsForType[randomIndex];

                setQuestionSet(selectedSet);
            } catch (error) {
                console.error("Failed to fetch interview questions:", error);
                // Handle error, maybe show a message to the user
            } finally {
                setIsLoadingQuestions(false);
            }
        };

        fetchQuestions();
    }, [sessionType]); // This effect re-runs if the sessionType changes

    // This effect now triggers the final analysis
    useEffect(() => {
        if (sessionResults.closing) {
            handleFinalAnalysis();
        }
    }, [sessionResults.closing]);

    const handleFinalAnalysis = async () => {
        setIsProcessingSession(true);
        try {
            const allTasks = [
                { question: questionSet.introduction, audioBlob: sessionResults.introduction.audioBlob },
                ...sessionResults.core,
                { question: questionSet.closing, audioBlob: sessionResults.closing.audioBlob }
            ];

            const analyzedResults = [];
            for (const task of allTasks) {
                const feedback = await analyzeAnswer({
                    question: task.question,
                    answer: '',
                    sessionType,
                    audioBlob: task.audioBlob,
                });
                analyzedResults.push({ question: task.question, ...feedback });
            }
            
            const totalScore = analyzedResults.reduce((acc, curr) => acc + (curr.score || 0), 0);
            const averageScore = Math.round(totalScore / analyzedResults.length);

            const newSession = await addSessionToHistory({
                type: sessionType,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                score: averageScore,
                questions: analyzedResults,
            });

            navigate(`/app/feedback/${newSession.id}`);

        } catch (err) {
            console.error("Failed to analyze or save the session:", err);
            alert(`An error occurred during session analysis: ${err.message}`);
        } finally {
            setIsProcessingSession(false);
        }
    };
    
    const handleStageComplete = (stageName, data) => {
        setSessionResults(prev => ({ ...prev, [stageName]: data }));

        if (stageName === 'introduction') setStage('core');
        else if (stageName === 'core') setStage('closing');
    };
    
    // NEW: Loading screen while fetching questions
    if (isLoadingQuestions || !questionSet) {
        return (
            <div className="min-h-screen w-full bg-slate-900 flex justify-center items-center">
                <LoadingSpinner />
                <p className="ml-4 text-white">Preparing your interview session...</p>
            </div>
        );
    }

    if (isProcessingSession) {
         return (
            <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4 gap-4">
                <LoadingSpinner />
                <h2 className="text-2xl font-bold">Analyzing your entire interview...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            {stage === 'introduction' && <SingleQuestionStage key="intro" title="Stage 1: The Introduction" question={questionSet.introduction} onComplete={(data) => handleStageComplete('introduction', data)} />}
            {stage === 'core' && <CoreInterviewStage key="core" questions={questionSet.core} onComplete={(data) => handleStageComplete('core', data)} />}
            {stage === 'closing' && <SingleQuestionStage key="closing" title="Stage 3: The Closing" question={questionSet.closing} onComplete={(data) => handleStageComplete('closing', data)} />}
        </div>
    );
}

// --- Reusable Component for Single-Question Stages ---
function SingleQuestionStage({ title, question, onComplete }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);

    const startRecording = async () => {
        setAudioBlob(null);
        setIsRecording(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            const audioChunks = [];
            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
        } catch (err) {
            console.error("Mic permission error:", err);
            alert("Could not start recording. Please grant microphone permissions.");
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="w-full max-w-3xl text-center">
            <p className="text-blue-400 font-semibold mb-4">{title}</p>
            <Card className="bg-slate-800 border-slate-700 mb-8">
                <CardContent className="p-8"><h2 className="text-2xl md:text-3xl leading-snug">{question}</h2></CardContent>
            </Card>
            <div className="mt-8 flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                    <Button size="lg" onClick={startRecording} disabled={isRecording}><MicIcon className="mr-2 h-5 w-5" /> Start Recording</Button>
                    <Button size="lg" variant="destructive" onClick={stopRecording} disabled={!isRecording}><div className="w-5 h-5 mr-2 bg-white rounded-sm" /> Stop Recording</Button>
                </div>
                <p className="text-lg">{isRecording ? '🔴 Recording...' : (audioBlob ? '✅ Answer Recorded' : '⚫ Waiting to Record')}</p>
            </div>
            <div className="mt-8 border-t border-slate-700 pt-8">
                <Button size="lg" onClick={() => onComplete({ audioBlob })} disabled={!audioBlob}>
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

// --- Component for the Core Q&A Stage ---
function CoreInterviewStage({ questions, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [currentAudioBlob, setCurrentAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    
    const startRecording = async () => {
        setCurrentAudioBlob(null);
        setIsRecording(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            const audioChunks = [];
            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                setCurrentAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
        } catch (err) {
            console.error("Mic permission error:", err);
            alert("Could not start recording. Please grant microphone permissions.");
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleNext = () => {
        const newAnswers = [...answers, { question: questions[currentIndex], audioBlob: currentAudioBlob }];
        
        if (currentIndex < questions.length - 1) {
            setAnswers(newAnswers);
            setCurrentIndex(prev => prev + 1);
            setCurrentAudioBlob(null);
        } else {
            onComplete(newAnswers);
        }
    };

    return (
        <div className="w-full max-w-3xl text-center">
            <p className="text-blue-400 font-semibold mb-2">Stage 2: Core Interview</p>
            <p className="text-slate-300 mb-4 font-bold">Question {currentIndex + 1} of {questions.length}</p>
            <Card className="bg-slate-800 border-slate-700 mb-8">
                <CardContent className="p-8"><h2 className="text-2xl md:text-3xl leading-snug">{questions[currentIndex]}</h2></CardContent>
            </Card>
            <div className="mt-8 flex flex-col items-center gap-6">
                 <div className="flex items-center gap-4">
                    <Button size="lg" onClick={startRecording} disabled={isRecording}><MicIcon className="mr-2 h-5 w-5" /> Start Recording</Button>
                    <Button size="lg" variant="destructive" onClick={stopRecording} disabled={!isRecording}><div className="w-5 h-5 mr-2 bg-white rounded-sm" /> Stop Recording</Button>
                </div>
                <p className="text-lg">{isRecording ? '🔴 Recording...' : (currentAudioBlob ? '✅ Answer Recorded' : '⚫ Waiting to Record')}</p>
            </div>
            <div className="mt-8 border-t border-slate-700 pt-8">
                <Button size="lg" onClick={handleNext} disabled={!currentAudioBlob}>
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Core Section'}
                </Button>
            </div>
        </div>
    );
}

export default InterviewSessionPage;
