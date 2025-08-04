import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalyzeCommunication } from '../hooks/useVoiceCoach';
import { useSessions } from '../hooks/useSessions';

// Import Components & Icons
import Button from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MicIcon, PlayIcon, CheckCircle, XCircle, ArrowRight, Volume2, Award, BookOpen, Repeat, BrainCircuit } from 'lucide-react';

// --- Expanded Mock Data ---
const readingParagraphs = [
    "The sun dipped below the horizon, painting the sky in shades of orange and purple. A gentle breeze rustled the leaves in the trees, creating a soft, whispering sound that seemed to tell stories of the day's end.",
    "Effective project management requires a delicate balance of clear communication, meticulous planning, and the flexibility to adapt to unforeseen challenges. A successful project manager must be a leader, a motivator, and a problem-solver all at once.",
    "The ancient library was a labyrinth of towering shelves, each one filled with books bound in leather and smelling of dust and time. Every volume held a different world, a different secret, waiting patiently to be discovered.",
    "Artificial intelligence is rapidly transforming industries across the globe, from healthcare and finance to transportation and entertainment. Its potential to solve complex problems is immense, but it also raises important ethical questions that we must address as a society.",
    "To achieve a state of flow, one must be fully immersed in an activity, feeling energized, focused, and enjoying the process. It's a state of deep concentration where productivity and creativity often peak, leading to a profound sense of accomplishment."
];

const repetitionTasks = [
    { text: "The report is due next Friday.", audioUrl: "/audio/report-due.mp3" },
    { text: "Can we reschedule the meeting?", audioUrl: "/audio/reschedule-meeting.mp3" },
    { text: "What are the key performance indicators?", audioUrl: "/audio/kpi.mp3" },
    { text: "Let's touch base tomorrow morning to review the project status.", audioUrl: "/audio/touch-base.mp3" },
    { text: "Could you please send over the updated presentation slides?", audioUrl: "/audio/updated-presentation.mp3" }
];

const storyData = [
    {
        storyAudioUrl: "/audio/story_fantasy.mp3",
        questions: [
            { question: "What was Elara's profession?", options: ["Blacksmith", "Librarian", "Baker", "Mayor"], correctAnswer: "Librarian" },
            { question: "What was unique about the book she discovered?", options: ["It had a golden cover", "It was written in an unknown language", "It whispered secrets to her", "It was completely empty"], correctAnswer: "It whispered secrets to her" },
            { question: "What did the book reveal a map to?", options: ["A hidden city", "A secret garden", "A lost treasure", "An ancient forest"], correctAnswer: "A hidden city" }
        ]
    },
    {
        storyAudioUrl: "/audio/story_email.mp3", 
        questions: [
            { question: "What was the initial problem with Anjali's email?", options: ["It lacked specific details", "It was sent to the wrong person", "It was too long and confusing", "It had several spelling mistakes"], correctAnswer: "It lacked specific details" },
            { question: "What information did Anjali include in her second email?", options: ["Her manager's contact number", "A screenshot of a different error", "The server's IP address and application name", "An apology for the inconvenience"], correctAnswer: "The server's IP address and application name" },
            { question: "What does the acronym 'ASAP' stand for?", options: ["All Systems Are Perfect", "Another Software Application Problem", "Always Submit After Proofreading", "As Soon As Possible"], correctAnswer: "As Soon As Possible" }
        ]
    }
];

// --- Main Page Component ---
function CommunicationPracticePage() {
    const [stage, setStage] = useState('reading');
    const [results, setResults] = useState({ reading: [], repetition: [], comprehension: [] });
    const [finalAnalysis, setFinalAnalysis] = useState(null);
    const { addSessionToHistory } = useSessions();

    const handleStageComplete = (stageName, data) => {
        console.log(`--- Data collected for stage: ${stageName.toUpperCase()} ---`, data);
        const newResults = { ...results, [stageName]: data };
        setResults(newResults);

        if (stageName === 'reading') setStage('repetition');
        else if (stageName === 'repetition') setStage('comprehension');
        else if (stageName === 'comprehension') setStage('scoreSummary');
    };
    
    const handleSummaryComplete = (analysis) => {
        const sessionData = {
            type: 'Communication',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            score: analysis.scores.overall,
            feedback: analysis 
        };
        addSessionToHistory(sessionData);
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

    const handleNext = () => {
        if (currentIndex < readingParagraphs.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setStatus('idle');
        } else {
            onComplete(readingResults);
        }
    };

    const stopRecording = () => {
        clearTimeout(timeoutRef.current);
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
        }
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
                const newResult = {
                    originalText: readingParagraphs[currentIndex],
                    audioBlob: audioBlob,
                };
                setReadingResults(prev => [...prev, newResult]);
            }
            handleNext();
        };

        mediaRecorderRef.current.start();
        // MODIFIED: Increased recording time to 7 seconds
        timeoutRef.current = setTimeout(stopRecording, 7000);
    };

    return (
        <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
                <CardTitle>Stage 1: Reading Aloud ({currentIndex + 1}/{readingParagraphs.length})</CardTitle>
                <CardDescription>Read the paragraph below. The recording will stop automatically after 7 seconds.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-lg mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-md">{readingParagraphs[currentIndex]}</p>
                {status === 'recording' && <div className="text-red-500 mb-4 animate-pulse font-semibold">🔴 Recording...</div>}
                <Button onClick={status === 'recording' ? stopRecording : startRecording} variant={status === 'recording' ? 'destructive' : 'default'} size="lg">
                    {status === 'recording' ? <><div className="w-4 h-4 mr-2 bg-white rounded-sm" /> Stop Recording</> : <><MicIcon className="mr-2" /> Start Recording</>}
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

    const handleNext = () => {
        if (currentIndex < repetitionTasks.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setStatus('idle');
        } else {
            onComplete(repetitionResults);
        }
    };

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
                const newResult = {
                    originalText: repetitionTasks[currentIndex].text,
                    audioBlob: audioBlob,
                };
                setRepetitionResults(prev => [...prev, newResult]);
            }
            handleNext();
        };

        mediaRecorderRef.current.start();
        // MODIFIED: Increased recording time to 6 seconds
        timeoutRef.current = setTimeout(stopRecording, 6000);
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
                    <Button onClick={status === 'recording' ? stopRecording : startRecording} variant={status === 'recording' ? 'destructive' : 'default'} size="lg">
                        {status === 'recording' ? <><div className="w-4 h-4 mr-2 bg-white rounded-sm" /> Stop Recording</> : <><MicIcon className="mr-2" /> Record Now</>}
                    </Button>
                )}
                {status === 'recording' && <div className="mt-4 text-red-500 font-semibold animate-pulse">Recording...</div>}
            </CardContent>
        </Card>
    );
}

// --- Stage 3: Story Comprehension ---
function ComprehensionStage({ onComplete }) {
    const [status, setStatus] = useState('idle');
    // MODIFIED: State to track which story we are on
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [comprehensionResults, setComprehensionResults] = useState([]);
    
    const MARKS_CORRECT = 100;
    const MARKS_INCORRECT = 0;

    // MODIFIED: Get the current story and question from the data array
    const currentStory = storyData[currentStoryIndex];
    const currentQuestion = currentStory.questions[currentQuestionIndex];

    const handlePlayStory = () => {
        setStatus('playing');
        const audio = new Audio(currentStory.storyAudioUrl);
        audio.play();
        audio.onended = () => {
            setStatus('paused');
            setTimeout(() => setStatus('answering'), 1000);
        };
    };

    const handleSelectAnswer = (option) => {
        if (selectedOption) return;
        setSelectedOption(option);
        const isCorrect = option === currentQuestion.correctAnswer;
        const newResult = {
            question: currentQuestion.question,
            selected: option,
            isCorrect: isCorrect,
            score: isCorrect ? MARKS_CORRECT : MARKS_INCORRECT,
        };

        setTimeout(() => {
            const updatedResults = [...comprehensionResults, newResult];
            setComprehensionResults(updatedResults);
            setSelectedOption(null);

            // MODIFIED: Logic to move to the next question or next story
            const isLastQuestionInStory = currentQuestionIndex === currentStory.questions.length - 1;
            const isLastStory = currentStoryIndex === storyData.length - 1;

            if (isLastQuestionInStory) {
                if (isLastStory) {
                    // Finished all questions in all stories
                    onComplete(updatedResults);
                } else {
                    // Move to the next story
                    setCurrentStoryIndex(prev => prev + 1);
                    setCurrentQuestionIndex(0);
                    setStatus('idle'); // Go back to the 'Play Story' screen for the new story
                }
            } else {
                // Move to the next question in the current story
                setCurrentQuestionIndex(prev => prev + 1);
            }
        }, 1000);
    };

    return (
        <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
                {/* MODIFIED: Updated title to show story progress */}
                <CardTitle>Stage 3: Listening Comprehension (Story {currentStoryIndex + 1}/{storyData.length})</CardTitle>
                <CardDescription>
                    {status === 'answering' ? `Question ${currentQuestionIndex + 1} of ${currentStory.questions.length}` : "Listen to the story, then answer the questions."}
                </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[250px] flex flex-col justify-center items-center">
                {status === 'idle' && <Button size="lg" onClick={handlePlayStory}><PlayIcon className="mr-2" /> Play Story {currentStoryIndex + 1}</Button>}
                {status === 'playing' && <p className="text-blue-500 font-semibold animate-pulse">🔊 Story is playing...</p>}
                {status === 'paused' && <LoadingSpinner />}
                {status === 'answering' && (
                    <div className="w-full text-left">
                        <h3 className="text-xl font-semibold mb-4 text-center">{currentQuestion.question}</h3>
                        <div className="space-y-3">
                            {currentQuestion.options.map(option => {
                                const isSelected = selectedOption === option;
                                const isCorrectAnswer = isSelected && option === currentQuestion.correctAnswer;
                                const isIncorrectAnswer = isSelected && option !== currentQuestion.correctAnswer;
                                return (
                                    <button 
                                        key={option} 
                                        onClick={() => handleSelectAnswer(option)} 
                                        disabled={!!selectedOption}
                                        className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all duration-300
                                            ${isCorrectAnswer ? 'border-green-500 bg-green-500/10' : ''}
                                            ${isIncorrectAnswer ? 'border-red-500 bg-red-500/10' : ''}
                                            ${!isSelected ? 'border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-500/10' : ''}
                                        `}>
                                        <span className="font-medium">{option}</span>
                                        {isCorrectAnswer && <CheckCircle className="text-green-500" />}
                                        {isIncorrectAnswer && <XCircle className="text-red-500" />}
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

// --- Score Summary Stage ---
function ScoreSummaryStage({ allResults, onComplete }) {
    const { mutate: analyzeSession, isPending, data: analysisPayload } = useAnalyzeCommunication();

    useEffect(() => {
        if (allResults.reading.length > 0 && allResults.repetition.length > 0 && allResults.comprehension.length > 0) {
            analyzeSession(allResults);
        }
    }, [allResults, analyzeSession]);

    if (isPending || !analysisPayload) {
        return (
            <Card className="max-w-3xl mx-auto text-center">
                <CardContent className="py-12">
                    <LoadingSpinner />
                    <p className="mt-4 font-semibold text-lg">Analyzing your entire session...</p>
                    <p className="text-sm text-slate-500">This may take a moment as we process all your recordings.</p>
                </CardContent>
            </Card>
        );
    }

    const { scores } = analysisPayload;
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
                    <p className="text-lg font-medium">Overall Performance Score</p>
                    <p className="text-6xl font-bold text-blue-500">{scores.overall}<span className="text-3xl text-slate-400">/100</span></p>
                </div>
                <Button size="lg" onClick={() => onComplete(analysisPayload)}>
                    View Detailed Report <ArrowRight className="ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}

// --- Other components ---
const ScoreCard = ({ icon, title, score }) => (
    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
            {icon}
            <h4 className="font-semibold">{title}</h4>
        </div>
        <p className="text-4xl font-bold mt-2">{score}<span className="text-2xl text-slate-400">/100</span></p>
    </div>
);

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