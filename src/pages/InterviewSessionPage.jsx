import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSessions } from "../hooks/useSessions";
import { useAnalyzeAnswer } from "../hooks/useVoiceCoach";

// UI Components
import Button from "../components/common/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  ArrowRight,
  Mic,
  Square,
  CheckCircle,
  BrainCircuit,
} from "lucide-react"; // Updated icons

// --- Main Page Component: The State Machine ---
function InterviewSessionPage() {
  const navigate = useNavigate();
  const { sessionType, addSessionToHistory } = useSessions();
  const { mutateAsync: analyzeAnswer } = useAnalyzeAnswer();

  const [stage, setStage] = useState("introduction");
  const [isProcessingSession, setIsProcessingSession] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionSet, setQuestionSet] = useState(null);
  const [sessionResults, setSessionResults] = useState({
    introduction: null,
    core: null,
    closing: null,
  });

  // Fetch questions from the JSON file (Logic Unchanged)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/interview-questions.json");
        if (response.ok) {
          console.log(
            "[Frontend] 📥 Successfully fetched interview questions."
          );
        }
        const allQuestionSets = await response.json();
        const setsForType = allQuestionSets[sessionType];
        const randomIndex = Math.floor(Math.random() * setsForType.length);
        const selectedSet = setsForType[randomIndex];
        setQuestionSet(selectedSet);
      } catch (error) {
        console.error("Failed to fetch interview questions:", error);
        alert("Failed to fetch interview questions. Please try again later.");
        navigate("/app/dashboard");
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [sessionType, navigate]);

  // Trigger final analysis (Logic Unchanged)
  useEffect(() => {
    if (sessionResults.closing) {
      handleFinalAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionResults.closing]);

  const handleFinalAnalysis = async () => {
    setIsProcessingSession(true);
    try {
      const allTasks = [
        {
          question: questionSet.introduction,
          audioBlob: sessionResults.introduction.audioBlob,
        },
        ...sessionResults.core,
        {
          question: questionSet.closing,
          audioBlob: sessionResults.closing.audioBlob,
        },
      ];

      const analyzedResults = [];
      for (const task of allTasks) {
        const feedback = await analyzeAnswer({
          question: task.question,
          answer: "",
          sessionType,
          audioBlob: task.audioBlob,
        });
        analyzedResults.push({ question: task.question, ...feedback });
      }

      const totalScore = analyzedResults.reduce(
        (acc, curr) => acc + (curr.score || 0),
        0
      );
      const averageScore = Math.round(totalScore / analyzedResults.length);

      const newSession = await addSessionToHistory({
        type: sessionType,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
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
    setSessionResults((prev) => ({ ...prev, [stageName]: data }));
    if (stageName === "introduction") setStage("core");
    else if (stageName === "core") setStage("closing");
  };

  // ENHANCED: Loading and Processing Screens
  if (isLoadingQuestions || !questionSet) {
    return (
      <AnimatedFeedbackScreen
        icon={<LoadingSpinner />}
        title="Preparing your interview..."
      />
    );
  }

  if (isProcessingSession) {
    return (
      <AnimatedFeedbackScreen
        icon={<BrainCircuit className="h-16 w-16 text-blue-400" />}
        title="Analyzing your entire interview..."
        subtitle="Our AI is crafting your detailed feedback. This may take a moment."
      />
    );
  }

  // ENHANCED: Main render with animated stage transitions
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-gray-900 text-white flex flex-col items-center justify-center p-4 transition-colors duration-500">
      <StageTransition key={stage}>
        {stage === "introduction" && (
          <SingleQuestionStage
            title="Stage 1: The Introduction"
            question={questionSet.introduction}
            onComplete={(data) => handleStageComplete("introduction", data)}
          />
        )}
        {stage === "core" && (
          <CoreInterviewStage
            questions={questionSet.core}
            onComplete={(data) => handleStageComplete("core", data)}
          />
        )}
        {stage === "closing" && (
          <SingleQuestionStage
            title="Stage 3: The Closing"
            question={questionSet.closing}
            onComplete={(data) => handleStageComplete("closing", data)}
          />
        )}
      </StageTransition>
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
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
    } catch (err) {
      console.error("Mic permission error:", err);
      alert("Could not start recording. Please grant microphone permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full max-w-3xl text-center flex flex-col items-center">
      <p className="text-blue-400 font-semibold mb-4 text-lg">{title}</p>
      <Card className="bg-slate-800/50 border-slate-700 mb-8 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
        <CardContent className="p-8">
          <h2 className="text-2xl md:text-3xl leading-relaxed font-medium">
            {question}
          </h2>
        </CardContent>
      </Card>

      <RecordingIndicator isRecording={isRecording} hasAudio={!!audioBlob} />

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={startRecording}
          disabled={isRecording}
          className="disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Mic className="mr-2 h-5 w-5" /> Start Recording
        </Button>
        <Button
          size="lg"
          variant="destructive"
          onClick={stopRecording}
          disabled={!isRecording}
          className="disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Square className="mr-2 h-5 w-5" /> Stop Recording
        </Button>
      </div>

      <div className="mt-12 w-full border-t border-slate-700 pt-8 flex justify-center">
        <Button
          size="lg"
          onClick={() => onComplete({ audioBlob })}
          disabled={!audioBlob}
          className="disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
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
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/webm" });
        setCurrentAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
    } catch (err) {
      console.error("Mic permission error:", err);
      alert("Could not start recording. Please grant microphone permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleNext = () => {
    const newAnswers = [
      ...answers,
      { question: questions[currentIndex], audioBlob: currentAudioBlob },
    ];

    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex((prev) => prev + 1);
      setCurrentAudioBlob(null);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="w-full max-w-3xl text-center flex flex-col items-center">
      <p className="text-blue-400 font-semibold mb-2 text-lg">
        Stage 2: Core Interview
      </p>
      <ProgressBar current={currentIndex + 1} total={questions.length} />

      <Card className="bg-slate-800/50 border-slate-700 mb-8 backdrop-blur-sm shadow-2xl shadow-blue-500/10 mt-6">
        <CardContent className="p-8">
          <h2 className="text-2xl md:text-3xl leading-relaxed font-medium">
            {questions[currentIndex]}
          </h2>
        </CardContent>
      </Card>

      <RecordingIndicator
        isRecording={isRecording}
        hasAudio={!!currentAudioBlob}
      />

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          size="lg"
          onClick={startRecording}
          disabled={isRecording}
          className="disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Mic className="mr-2 h-5 w-5" /> Start Recording
        </Button>
        <Button
          size="lg"
          variant="destructive"
          onClick={stopRecording}
          disabled={!isRecording}
          className="disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Square className="mr-2 h-5 w-5" /> Stop Recording
        </Button>
      </div>

      <div className="mt-12 w-full border-t border-slate-700 pt-8 flex justify-center">
        <Button
          size="lg"
          onClick={handleNext}
          disabled={!currentAudioBlob}
          className="disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {currentIndex < questions.length - 1
            ? "Next Question"
            : "Finish Core Section"}{" "}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

// ===============================================
// --- NEW UI ENHANCEMENT COMPONENTS ---
// ===============================================

// --- Component for Animated Stage Transitions ---
function StageTransition({ children }) {
  return (
    <div className="animate-fade-in w-full flex justify-center">{children}</div>
  );
}

// --- Component for a Visual Progress Bar ---
function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full max-w-md my-4">
      <div className="flex justify-between mb-1 text-slate-300">
        <span className="text-base font-medium">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// --- Component for Dynamic Recording Status ---
function RecordingIndicator({ isRecording, hasAudio }) {
  let content;
  if (isRecording) {
    content = (
      <div className="flex items-center gap-3 text-red-400">
        <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
        <span className="font-semibold text-lg">Recording in progress...</span>
      </div>
    );
  } else if (hasAudio) {
    content = (
      <div className="flex items-center gap-3 text-green-400">
        <CheckCircle className="h-6 w-6" />
        <span className="font-semibold text-lg">
          Answer Recorded Successfully
        </span>
      </div>
    );
  } else {
    content = (
      <div className="flex items-center gap-3 text-slate-400">
        <Mic className="h-6 w-6" />
        <span className="font-semibold text-lg">
          Ready to Record Your Answer
        </span>
      </div>
    );
  }
  return <div className="h-10 flex items-center justify-center">{content}</div>;
}

// --- Component for Full-Screen Feedback (Loading/Processing) ---
function AnimatedFeedbackScreen({ icon, title, subtitle }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-gray-900 text-white flex flex-col items-center justify-center p-4 gap-6 text-center animate-fade-in">
      {icon}
      <h2 className="text-3xl font-bold mt-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-slate-300 max-w-md">{subtitle}</p>
      )}
    </div>
  );
}

export default InterviewSessionPage;
