import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompareTranscript, useAnalyzeCommunication } from '../hooks/useVoiceCoach';

// Import Components & Icons
import Button from '../components/common/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { MicIcon, PlayIcon, CheckCircle, XCircle, ArrowRight, Volume2, Award, BookOpen, Repeat, BrainCircuit } from 'lucide-react';

// --- Mock Data ---
const readingParagraphs = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet.",
    "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
    "Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish.",
    "The journey of a thousand miles begins with a single step. Every great achievement starts with the decision to try.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts."
];
const repetitionTasks = [
    { text: "The report is due next Friday.", audioUrl: "/audio/report-due.mp3" },
    { text: "Can we reschedule the meeting?", audioUrl: "/audio/reschedule-meeting.mp3" },
    { text: "Let's touch base in the morning.", audioUrl: "/audio/touch-base.mp3" },
    { text: "What are the key performance indicators?", audioUrl: "/audio/kpi.mp3" },
    { text: "Please send me the updated presentation.", audioUrl: "/audio/updated-presentation.mp3" }
];
const storyData = {
    storyAudioUrl: "/audio/story_fantasy.mp3",
    questions: [
        { question: "What was Elara's job?", options: ["Blacksmith", "Librarian", "Baker", "Mayor"], correctAnswer: "Librarian" },
        { question: "What was unique about the book she found?", options: ["It had a map", "It was written in gold", "It whispered secrets", "It was empty"], correctAnswer: "It whispered secrets" },
        { question: "What did the whispering book tell Elara about?", options: ["A hidden treasure", "A secret passage", "A hidden key", "A forgotten spell"], correctAnswer: "A hidden key" }
    ]
};

// --- Main Page Component ---
function CommunicationPracticePage() {
    const [stage, setStage] = useState('reading');
    const [results, setResults] = useState({ reading: [], repetition: [], comprehension: [] });
    const [finalAnalysis, setFinalAnalysis] = useState(null);

    const handleStageComplete = (stageName, data) => {
        const newResults = { ...results, [stageName]: data };
        setResults(newResults);

        if (stageName === 'reading') setStage('repetition');
        else if (stageName === 'repetition') setStage('comprehension');
        else if (stageName === 'comprehension') setStage('scoreSummary');
    };
    
    const handleSummaryComplete = (analysis) => {
        setFinalAnalysis(analysis);
        setStage('results');
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-center text-4xl font-bold tracking-tight mb-4">Communication Coach</h1>
            <ProgressStepper currentStage={stage} />
            <div className="mt-8">
                {stage === 'reading' && <ReadingStage onComplete={(data) => handleStageComplete('reading', data)} />}
                {stage === 'repetition' && <RepetitionStage onComplete={(data) => handleStageComplete('repetition', data)} />}
                {stage === 'comprehension' && <ComprehensionStage onComplete={(data) => handleStageComplete('comprehension', data)} />}
                {stage === 'scoreSummary' && <ScoreSummaryStage allResults={results} onComplete={handleSummaryComplete} />}
                {stage === 'results' && <ResultsStage finalAnalysis={finalAnalysis} />}
            </div>
        </div>
    );
}

// --- Stage 1: Reading Aloud ---
function ReadingStage({ onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState('idle');
    const [readingResults, setReadingResults] = useState([]);
    const mediaRecorderRef = useRef(null);
    const timeoutRef = useRef(null);
    const { mutate: analyze, isPending } = useCompareTranscript();

    const handleNext = () => {
        if (currentIndex < readingParagraphs.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setStatus('idle');
        } else {
            onComplete(readingResults);
        }
    };

    useEffect(() => {
        if (!isPending && status === 'processing') {
            handleNext();
        }
    }, [isPending, status]);

    const stopRecording = () => {
        clearTimeout(timeoutRef.current);
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setStatus('processing');
    };

    const startRecording = async () => {
        setStatus('recording');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        const audioChunks = [];
        mediaRecorderRef.current.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop());
            if (audioBlob.size > 0) {
                analyze({ audioBlob, originalText: readingParagraphs[currentIndex] }, {
                    onSuccess: (res) => setReadingResults(prev => [...prev, res]),
                    onError: (err) => console.error("Analysis failed:", err)
                });
            }
        };
        mediaRecorderRef.current.start();
        timeoutRef.current = setTimeout(stopRecording, 5000);
    };

    return (
        <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
                <CardTitle>Stage 1: Reading Aloud ({currentIndex + 1}/{readingParagraphs.length})</CardTitle>
                <CardDescription>Read the paragraph below. Recording will start when you click the button and last for 5 seconds.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-md">{readingParagraphs[currentIndex]}</p>
                {status === 'recording' && <div className="text-red-500 mb-4 animate-pulse font-semibold">🔴 Recording...</div>}
                {(isPending || status === 'processing') && <div className="my-4"><LoadingSpinner /><p>Processing...</p></div>}
                <Button onClick={status === 'recording' ? stopRecording : startRecording} disabled={status === 'processing' || isPending} variant={status === 'recording' ? 'destructive' : 'default'} size="lg">
                    {status === 'recording' ? <><div className="w-4 h-4 mr-2 bg-white rounded-sm animate-pulse" /> Stop Recording</> : <><MicIcon className="mr-2" /> Start Recording</>}
                </Button>
            </CardContent>
        </Card>
    );
}

// --- Stage 2: Listen & Repeat ---
function RepetitionStage({ onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [status, setStatus] = useState('idle');
    const [repetitionResults, setRepetitionResults] = useState([]);
    const mediaRecorderRef = useRef(null);
    const timeoutRef = useRef(null);
    const { mutate: analyze, isPending } = useCompareTranscript();

    useEffect(() => {
        if (!isPending && status === 'processing') {
            if (currentIndex < repetitionTasks.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setStatus('idle');
            } else {
                onComplete(repetitionResults);
            }
        }
    }, [isPending, status]);

    const handleListen = () => {
        setStatus('playing');
        const audio = new Audio(repetitionTasks[currentIndex].audioUrl);
        audio.play();
        audio.onended = () => setStatus('ready_to_record');
    };

    const stopRecording = () => {
        clearTimeout(timeoutRef.current);
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setStatus('processing');
    };

    const startRecording = async () => {
        setStatus('recording');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        const audioChunks = [];
        mediaRecorderRef.current.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop());
            if (audioBlob.size > 0) {
                analyze({ audioBlob, originalText: repetitionTasks[currentIndex].text }, {
                    onSuccess: (res) => setRepetitionResults(prev => [...prev, res]),
                    onError: (err) => console.error("Analysis failed:", err)
                });
            }
        };
        mediaRecorderRef.current.start();
        timeoutRef.current = setTimeout(stopRecording, 4000);
    };

    return (
        <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
                <CardTitle>Stage 2: Listen & Repeat ({currentIndex + 1}/{repetitionTasks.length})</CardTitle>
                <CardDescription>Listen to the phrase, then record your repetition.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[150px] flex flex-col justify-center items-center">
                {status === 'idle' && <Button size="lg" onClick={handleListen}><Volume2 className="mr-2" /> Listen</Button>}
                {status === 'playing' && <p className="text-blue-500 font-semibold animate-pulse">🔊 Playing audio...</p>}
                {(status === 'ready_to_record' || status === 'recording') && (
                     <Button onClick={status === 'recording' ? stopRecording : startRecording} disabled={status === 'processing' || isPending} variant={status === 'recording' ? 'destructive' : 'default'} size="lg">
                        {status === 'recording' ? <><div className="w-4 h-4 mr-2 bg-white rounded-sm animate-pulse" /> Stop Recording</> : <><MicIcon className="mr-2" /> Record Now</>}
                    </Button>
                )}
                {status === 'recording' && <div className="mt-4 text-red-500 font-semibold animate-pulse">Recording...</div>}
                {(isPending || status === 'processing') && <div className="my-4"><LoadingSpinner /><p>Processing...</p></div>}
            </CardContent>
        </Card>
    );
}

// --- Stage 3: Story Comprehension (ENHANCED UI) ---
function ComprehensionStage({ onComplete }) {
    const [status, setStatus] = useState('idle');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [comprehensionResults, setComprehensionResults] = useState([]);
    
    const currentQuestion = storyData.questions[currentQuestionIndex];

    const handlePlayStory = () => {
        setStatus('playing');
        const audio = new Audio(storyData.storyAudioUrl);
        audio.play();
        audio.onended = () => {
            setStatus('paused');
            setTimeout(() => setStatus('answering'), 2000);
        };
    };

    const handleSelectAnswer = (option) => {
        if (selectedOption) return;
        setSelectedOption(option);
        const isCorrect = option === currentQuestion.correctAnswer;
        const newResult = { question: currentQuestion.question, selected: option, isCorrect };
        
        setTimeout(() => {
            const updatedResults = [...comprehensionResults, newResult];
            setComprehensionResults(updatedResults);
            setSelectedOption(null);
            if (currentQuestionIndex < storyData.questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                onComplete(updatedResults);
            }
        }, 1000);
    };

    return (
        <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
                <CardTitle>Stage 3: Listening Comprehension</CardTitle>
                <CardDescription>
                    {status === 'answering' ? `Question ${currentQuestionIndex + 1} of ${storyData.questions.length}` : "Listen to the story once, then answer the questions."}
                </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[250px] flex flex-col justify-center items-center">
                {status === 'idle' && <Button size="lg" onClick={handlePlayStory}><PlayIcon className="mr-2" /> Play Story</Button>}
                {status === 'playing' && <p className="text-blue-500 font-semibold animate-pulse">🔊 Story is playing...</p>}
                {status === 'paused' && <LoadingSpinner />}
                {status === 'answering' && (
                    <div className="w-full text-left">
                        <h3 className="text-xl font-semibold mb-4 text-center">{currentQuestion.question}</h3>
                        <div className="space-y-3">
                            {currentQuestion.options.map(option => {
                                const isSelected = selectedOption === option;
                                const isCorrect = isSelected && option === currentQuestion.correctAnswer;
                                const isIncorrect = isSelected && option !== currentQuestion.correctAnswer;
                                return (
                                    <button key={option} onClick={() => handleSelectAnswer(option)} disabled={!!selectedOption}
                                        className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all duration-300
                                            ${isCorrect ? 'border-green-500 bg-green-500/10' : ''}
                                            ${isIncorrect ? 'border-red-500 bg-red-500/10' : ''}
                                            ${!isSelected ? 'border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-500/10' : ''}
                                        `}>
                                        <span className="font-medium">{option}</span>
                                        {isCorrect && <CheckCircle className="text-green-500" />}
                                        {isIncorrect && <XCircle className="text-red-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- NEW STAGE: Score Summary ---
function ScoreSummaryStage({ allResults, onComplete }) {
    const { data: analysis, isPending, mutate } = useAnalyzeCommunication();

    useEffect(() => {
        if (allResults.reading.length > 0 && allResults.repetition.length > 0 && allResults.comprehension.length > 0) {
            mutate(allResults);
        }
    }, [allResults, mutate]);

    if (isPending || !analysis) {
        return (
            <Card className="max-w-3xl mx-auto text-center">
                <CardContent className="py-12">
                    <LoadingSpinner />
                    <p className="mt-4 font-semibold">Calculating your scores...</p>
                    <p className="text-sm text-slate-500">Our AI is analyzing your performance across all stages.</p>
                </CardContent>
            </Card>
        );
    }
    
    const { scores } = analysis;

    return (
        <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
                <Award className="mx-auto h-12 w-12 text-yellow-500" />
                <CardTitle className="mt-4">Practice Complete!</CardTitle>
                <CardDescription>Here is a summary of your performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <ScoreCard icon={<BookOpen />} title="Reading" score={scores.reading} />
                    <ScoreCard icon={<Repeat />} title="Repetition" score={scores.repetition} />
                    <ScoreCard icon={<BrainCircuit />} title="Comprehension" score={scores.comprehension} />
                </div>
                <div className="pt-6">
                    <p className="text-lg font-medium">Overall Performance</p>
                    <p className="text-6xl font-bold text-blue-500">{scores.overall}<span className="text-3xl text-slate-400">/100</span></p>
                </div>
                <Button size="lg" onClick={() => onComplete(analysis)}>
                    View Detailed Report <ArrowRight className="ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}

const ScoreCard = ({ icon, title, score }) => (
    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
            {icon}
            <h4 className="font-semibold">{title}</h4>
        </div>
        <p className="text-4xl font-bold mt-2">{score}<span className="text-2xl text-slate-400">/100</span></p>
    </div>
);

// --- Final Results Stage ---
function ResultsStage({ finalAnalysis }) {
    const navigate = useNavigate();

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader><CardTitle className="text-center">Your Detailed Communication Report</CardTitle></CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
                {finalAnalysis ? (
                    <div dangerouslySetInnerHTML={{ __html: finalAnalysis.reportText.replace(/\n/g, '<br />') }} />
                ) : (
                    <div className="text-center py-8"><LoadingSpinner /><p>Loading report...</p></div>
                )}
                <div className="text-center mt-8">
                    <Button onClick={() => navigate('/app/dashboard')}>Back to Dashboard</Button>
                </div>
            </CardContent>
        </Card>
    );
}

// --- Progress Stepper Component ---
const ProgressStepper = ({ currentStage }) => {
    const stages = ['reading', 'repetition', 'comprehension', 'scoreSummary', 'results'];
    const currentIndex = stages.indexOf(currentStage);
    return (
        <div className="flex justify-center items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {stages.map((stage, index) => (
                <React.Fragment key={stage}>
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${index <= currentIndex ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            {index < currentIndex ? <CheckCircle size={20} /> : index + 1}
                        </div>
                        <span className={`ml-2 font-medium capitalize whitespace-nowrap ${index <= currentIndex ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>{stage === 'scoreSummary' ? 'Summary' : stage}</span>
                    </div>
                    {index < stages.length - 1 && <div className={`flex-1 h-1 transition-all ${index < currentIndex ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'} min-w-[20px]`}></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default CommunicationPracticePage;
