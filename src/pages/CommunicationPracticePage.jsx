import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalyzeCommunication } from "../hooks/useVoiceCoach";
import { useSessions } from "../hooks/useSessions";

// Import Components & Icons
import Button from "../components/common/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  MicIcon,
  PlayIcon,
  CheckCircle,
  XCircle,
  ArrowRight,
  Volume2,
  Award,
  BookOpen,
  Repeat,
  BrainCircuit,
  Expand,
} from "lucide-react";

// --- Warning Message Component ---
const WarningMessage = () => (
  <div
    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
    role="alert"
  >
    <p className="font-bold">Proctored Session</p>
    <p>
      Please remain in full-screen mode. Exiting full-screen during the test
      will immediately end it and result in a score of 0.
    </p>
  </div>
);

// --- Main Page Component ---
function CommunicationPracticePage() {
  const [stage, setStage] = useState("ready");
  const [isTerminated, setIsTerminated] = useState(false); // State to track termination
  const [results, setResults] = useState({
    reading: [],
    repetition: [],
    comprehension: [],
  });
  const [finalAnalysis, setFinalAnalysis] = useState(null);
  const { addSessionToHistory } = useSessions();

  const [isLoading, setIsLoading] = useState(false); // Set initial loading to false
  const [practiceSet, setPracticeSet] = useState(null);
  const navigate = useNavigate();

  // --- NEW: Robust Fullscreen Proctoring & Session Management ---
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();

    // Handles leaving full-screen
    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement || document.webkitFullscreenElement;
      const proctoredStages = ["reading", "repetition", "comprehension"];

      // If fullscreen is exited AND the user is in a proctored stage
      if (!isFullscreen && proctoredStages.includes(stage)) {
        console.warn(
          "Fullscreen exited during a proctored stage. Terminating."
        );
        const terminationAnalysis = {
          scores: { reading: 0, repetition: 0, comprehension: 0, overall: 0 },
          reportText: `
                        <h2 style="color: red;">Session Terminated</h2>
                        <p>The session was ended because you exited fullscreen mode during the test. A score of 0 has been recorded.</p>
                        <p>Please ensure you remain in fullscreen for the entire duration of the assessment sections.</p>
                    `,
        };
        setFinalAnalysis(terminationAnalysis);
        addSessionToHistory({
          type: "Communication",
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          score: 0,
          feedback: terminationAnalysis,
        });
        setIsTerminated(true);
        setStage("results");
      }
    };

    // Handles closing the tab/browser
    const handleBeforeUnload = (e) => {
      const proctoredStages = [
        "loading",
        "reading",
        "repetition",
        "comprehension",
        "scoreSummary",
      ];
      if (proctoredStages.includes(stage)) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
      }
    };

    // Add all listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function to remove all listeners
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [stage, addSessionToHistory]);

  // --- Data Fetching Logic (Unchanged) ---
  useEffect(() => {
    if (stage === "loading") {
      const fetchPracticeSet = async () => {
        try {
          const response = await fetch("/communication-practice.json");
          const data = await response.json();
          if (response.ok) console.log("Question fetched successfully");
          const randomIndex = Math.floor(Math.random() * data.sets.length);
          setPracticeSet(data.sets[randomIndex]);
          setStage("reading");
        } catch (error) {
          console.error("Failed to load communication practice set:", error);
          alert("Could not load the practice set. Please try again later.");
          navigate("/app/dashboard");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPracticeSet();
    }
  }, [stage, navigate]);

  const handleStartSession = () => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(
        `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
      );
    });
    setIsLoading(true); // Show loader
    setStage("loading"); // Trigger data fetch
  };

  const handleStageComplete = (stageName, data) => {
    const newResults = { ...results, [stageName]: data };
    setResults(newResults);

    if (stageName === "reading") setStage("repetition");
    else if (stageName === "repetition") setStage("comprehension");
    else if (stageName === "comprehension") setStage("scoreSummary");
  };

  const handleSummaryComplete = (analysis) => {
    const sessionData = {
      type: "Communication",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      score: analysis.scores.overall,
      feedback: analysis,
    };
    addSessionToHistory(sessionData);
    setFinalAnalysis(analysis);
    setStage("results");

    // Exit fullscreen ONLY when results are shown
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      document
        .exitFullscreen()
        .catch((err) =>
          console.error("Could not exit fullscreen automatically:", err)
        );
    }
  };

  // --- Render Logic ---

  if (stage === "ready") {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-center p-4">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Communication Coach</CardTitle>
            <CardDescription className="text-lg pt-2">
              You are about to begin a proctored practice session. This will
              enter full-screen mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={handleStartSession}>
              <Expand className="mr-2 h-5 w-5" />
              Start Focused Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || (stage !== "results" && !practiceSet)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
        <p className="ml-4">Preparing your communication exercises...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Conditionally render the warning message */}
      {!isTerminated &&
        ["reading", "repetition", "comprehension"].includes(stage) && (
          <WarningMessage />
        )}

      <h1 className="text-center text-4xl font-bold tracking-tight mb-2">
        Communication Coach
      </h1>

      {/* Show practice set name if available and not terminated */}
      {!isTerminated && practiceSet && (
        <p className="text-center text-lg text-slate-500 mb-4">
          Practice Set: "{practiceSet.setName}"
        </p>
      )}

      {/* Show progress stepper if not terminated and not on ready screen */}
      {!isTerminated && stage !== "ready" && (
        <ProgressStepper currentStage={stage} />
      )}

      <div className="mt-8">
        {!isTerminated && stage === "reading" && (
          <ReadingStage
            paragraphs={practiceSet.reading}
            onComplete={(data) => handleStageComplete("reading", data)}
          />
        )}
        {!isTerminated && stage === "repetition" && (
          <RepetitionStage
            tasks={practiceSet.repetition}
            onComplete={(data) => handleStageComplete("repetition", data)}
          />
        )}
        {!isTerminated && stage === "comprehension" && (
          <ComprehensionStage
            stories={practiceSet.comprehension}
            onComplete={(data) => handleStageComplete("comprehension", data)}
          />
        )}
        {!isTerminated && stage === "scoreSummary" && (
          <ScoreSummaryStage
            allResults={results}
            onComplete={handleSummaryComplete}
          />
        )}
        {stage === "results" && <ResultsStage finalAnalysis={finalAnalysis} />}
      </div>
    </div>
  );
}

// --- Stage 1: Reading Aloud (Accepts 'paragraphs' prop) ---
function ReadingStage({ paragraphs, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState("idle");
  const [readingResults, setReadingResults] = useState([]);
  const mediaRecorderRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < paragraphs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setStatus("idle");
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
    setStatus("recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      const audioChunks = [];
      mediaRecorderRef.current.ondataavailable = (e) =>
        audioChunks.push(e.data);

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        if (audioBlob.size > 0) {
          const newResult = {
            originalText: paragraphs[currentIndex],
            audioBlob: audioBlob,
          };
          setReadingResults((prev) => [...prev, newResult]);
        }
        handleNext();
      };

      mediaRecorderRef.current.start();
      timeoutRef.current = setTimeout(stopRecording, 7000);
    } catch (err) {
      alert("Microphone permission is required for this exercise.");
      setStatus("idle");
    }
  };

  return (
    <Card className="max-w-3xl mx-auto text-center">
      <CardHeader>
        <CardTitle>
          Stage 1: Reading Aloud ({currentIndex + 1}/{paragraphs.length})
        </CardTitle>
        <CardDescription>
          Read the paragraph below. The recording will stop automatically after
          7 seconds.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
          {paragraphs[currentIndex]}
        </p>
        {status === "recording" && (
          <div className="text-red-500 mb-4 animate-pulse font-semibold">
            🔴 Recording...
          </div>
        )}
        <Button
          onClick={status === "recording" ? stopRecording : startRecording}
          variant={status === "recording" ? "destructive" : "default"}
          size="lg"
        >
          {status === "recording" ? (
            <>
              <div className="w-4 h-4 mr-2 bg-white rounded-sm" /> Stop
              Recording
            </>
          ) : (
            <>
              <MicIcon className="mr-2" /> Start Recording
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// --- Stage 2: Listen & Repeat (Accepts 'tasks' prop) ---
function RepetitionStage({ tasks, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState("idle");
  const [repetitionResults, setRepetitionResults] = useState([]);
  const mediaRecorderRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setStatus("idle");
    } else {
      onComplete(repetitionResults);
    }
  };

  const handleListen = () => {
    setStatus("playing");
    const audio = new Audio(tasks[currentIndex].audioUrl);
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
      setStatus("idle");
    });
    audio.onended = () => setStatus("ready_to_record");
  };

  const stopRecording = () => {
    clearTimeout(timeoutRef.current);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    setStatus("recording");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      const audioChunks = [];
      mediaRecorderRef.current.ondataavailable = (e) =>
        audioChunks.push(e.data);

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        if (audioBlob.size > 0) {
          const newResult = {
            originalText: tasks[currentIndex].text,
            audioBlob: audioBlob,
          };
          setRepetitionResults((prev) => [...prev, newResult]);
        }
        handleNext();
      };

      mediaRecorderRef.current.start();
      timeoutRef.current = setTimeout(stopRecording, 6000);
    } catch (err) {
      alert("Microphone permission is required for this exercise.");
      setStatus("ready_to_record");
    }
  };

  return (
    <Card className="max-w-3xl mx-auto text-center">
      <CardHeader>
        <CardTitle>
          Stage 2: Listen & Repeat ({currentIndex + 1}/{tasks.length})
        </CardTitle>
        <CardDescription>
          Listen to the phrase, then record your repetition.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px] flex flex-col justify-center items-center">
        {status === "idle" && (
          <Button size="lg" onClick={handleListen}>
            <Volume2 className="mr-2" /> Listen
          </Button>
        )}
        {status === "playing" && (
          <p className="text-blue-500 font-semibold animate-pulse">
            🔊 Playing audio...
          </p>
        )}
        {(status === "ready_to_record" || status === "recording") && (
          <Button
            onClick={status === "recording" ? stopRecording : startRecording}
            variant={status === "recording" ? "destructive" : "default"}
            size="lg"
          >
            {status === "recording" ? (
              <>
                <div className="w-4 h-4 mr-2 bg-white rounded-sm" /> Stop
                Recording
              </>
            ) : (
              <>
                <MicIcon className="mr-2" /> Record Now
              </>
            )}
          </Button>
        )}
        {status === "recording" && (
          <div className="mt-4 text-red-500 font-semibold animate-pulse">
            Recording...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Stage 3: Story Comprehension (Accepts 'stories' prop) ---
function ComprehensionStage({ stories, onComplete }) {
  const [status, setStatus] = useState("idle");
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [comprehensionResults, setComprehensionResults] = useState([]);

  const MARKS_CORRECT = 100;
  const MARKS_INCORRECT = 0;

  const currentStory = stories[currentStoryIndex];
  const currentQuestion = currentStory.questions[currentQuestionIndex];

  const handlePlayStory = () => {
    setStatus("playing");
    const audio = new Audio(currentStory.storyAudioUrl);
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
      setStatus("idle");
    });
    audio.onended = () => {
      setStatus("paused");
      setTimeout(() => setStatus("answering"), 1000);
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

      const isLastQuestionInStory =
        currentQuestionIndex === currentStory.questions.length - 1;
      const isLastStory = currentStoryIndex === stories.length - 1;

      if (isLastQuestionInStory) {
        if (isLastStory) {
          onComplete(updatedResults);
        } else {
          setCurrentStoryIndex((prev) => prev + 1);
          setCurrentQuestionIndex(0);
          setStatus("idle");
        }
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 1000);
  };

  return (
    <Card className="max-w-3xl mx-auto text-center">
      <CardHeader>
        <CardTitle>
          Stage 3: Listening Comprehension (Story {currentStoryIndex + 1}/
          {stories.length})
        </CardTitle>
        <CardDescription>
          {status === "answering"
            ? `Question ${currentQuestionIndex + 1} of ${
                currentStory.questions.length
              }`
            : "Listen to the story, then answer the questions."}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[250px] flex flex-col justify-center items-center">
        {status === "idle" && (
          <Button size="lg" onClick={handlePlayStory}>
            <PlayIcon className="mr-2" /> Play Story {currentStoryIndex + 1}
          </Button>
        )}
        {status === "playing" && (
          <p className="text-blue-500 font-semibold animate-pulse">
            🔊 Story is playing...
          </p>
        )}
        {status === "paused" && <LoadingSpinner />}
        {status === "answering" && (
          <div className="w-full text-left">
            <h3 className="text-xl font-semibold mb-4 text-center">
              {currentQuestion.question}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrectAnswer =
                  isSelected && option === currentQuestion.correctAnswer;
                const isIncorrectAnswer =
                  isSelected && option !== currentQuestion.correctAnswer;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={!!selectedOption}
                    className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all duration-300
                                            ${
                                              isCorrectAnswer
                                                ? "border-green-500 bg-green-500/10"
                                                : ""
                                            }
                                            ${
                                              isIncorrectAnswer
                                                ? "border-red-500 bg-red-500/10"
                                                : ""
                                            }
                                            ${
                                              !isSelected
                                                ? "border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-500/10"
                                                : ""
                                            }
                                        `}
                  >
                    <span className="font-medium">{option}</span>
                    {isCorrectAnswer && (
                      <CheckCircle className="text-green-500" />
                    )}
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
  const {
    mutate: analyzeSession,
    isPending,
    data: analysisPayload,
  } = useAnalyzeCommunication();

  useEffect(() => {
    if (
      allResults.reading.length > 0 &&
      allResults.repetition.length > 0 &&
      allResults.comprehension.length > 0
    ) {
      analyzeSession(allResults);
    }
  }, [allResults, analyzeSession]);

  if (isPending || !analysisPayload) {
    return (
      <Card className="max-w-3xl mx-auto text-center">
        <CardContent className="py-12">
          <LoadingSpinner />
          <p className="mt-4 font-semibold text-lg">
            Analyzing your entire session...
          </p>
          <p className="text-sm text-slate-500">
            This may take a moment as we process all your recordings.
          </p>
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
        <CardDescription>
          Here is a summary of your performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <ScoreCard
            icon={<BookOpen />}
            title="Reading"
            score={scores.reading}
          />
          <ScoreCard
            icon={<Repeat />}
            title="Repetition"
            score={scores.repetition}
          />
          <ScoreCard
            icon={<BrainCircuit />}
            title="Comprehension"
            score={scores.comprehension}
          />
        </div>
        <div className="pt-6">
          <p className="text-lg font-medium">Overall Performance Score</p>
          <p className="text-6xl font-bold text-blue-500">
            {scores.overall}
            <span className="text-3xl text-slate-400">/100</span>
          </p>
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
    <p className="text-4xl font-bold mt-2">
      {score}
      <span className="text-2xl text-slate-400">/100</span>
    </p>
  </div>
);

function ResultsStage({ finalAnalysis }) {
  const navigate = useNavigate();
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Your Detailed Communication Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {finalAnalysis ? (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: finalAnalysis.reportText }}
          />
        ) : (
          <div className="text-center py-8">
            <LoadingSpinner />
            <p>Loading report...</p>
          </div>
        )}
        <div className="text-center mt-8">
          <Button onClick={() => navigate("/app/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const ProgressStepper = ({ currentStage }) => {
  const stages = [
    "reading",
    "repetition",
    "comprehension",
    "scoreSummary",
    "results",
  ];
  const stageLabels = {
    reading: "Reading",
    repetition: "Repetition",
    comprehension: "Comprehension",
    scoreSummary: "Summary",
    results: "Report",
  };
  const currentIndex = stages.indexOf(currentStage);
  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
      {stages.map((stage, index) => (
        <React.Fragment key={stage}>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                index <= currentIndex
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            >
              {index < currentIndex ? <CheckCircle size={20} /> : index + 1}
            </div>
            <span
              className={`ml-2 font-medium capitalize whitespace-nowrap ${
                index <= currentIndex
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500"
              }`}
            >
              {stageLabels[stage] || stage}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div
              className={`flex-1 h-1 transition-all ${
                index < currentIndex
                  ? "bg-blue-600"
                  : "bg-slate-200 dark:bg-slate-700"
              } min-w-[20px]`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CommunicationPracticePage;
