"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ReviewQuestionCard } from "@/components/review-question-card";
import { ReviewAnalysis } from "@/components/review-analysis";
import { ReasoningInput } from "@/components/reasoning-input";
import { SolutionButtons } from "@/components/solution-buttons";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import "katex/dist/katex.min.css";

interface AnalysisData {
  critique: string;
  traditional: string;
  smart: string;
}

// The manifest structure we built in the Exam page
interface SessionResponse {
  id: number;
  text: string;
  options: any[];
  difficulty: "Easy" | "Medium" | "Tough";
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export default function ReviewPage() {
  const router = useRouter();

  // 1. Data States
  const [sessionResponses, setSessionResponses] = useState<SessionResponse[]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reasoning, setReasoning] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loggedType, setLoggedType] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // 2. Load Real Session Data
  useEffect(() => {
    const rawData = localStorage.getItem("cat_session_result");
    if (rawData) {
      const parsed = JSON.parse(rawData);
      setSessionResponses(parsed.responses);
    } else {
      router.push("/"); // Fallback if no exam found
    }
  }, [router]);

  const currentQuestion = sessionResponses[currentIndex];

  // 3. Reset UI when switching questions
  useEffect(() => {
    setReasoning("");
    setAnalysisData(null);
    setLoggedType(null);
  }, [currentIndex]);

  // 4. Grouping for Sidebar
  const grouped = useMemo(() => {
    return {
      Easy: sessionResponses.filter((r) => r.difficulty === "Easy"),
      Medium: sessionResponses.filter((r) => r.difficulty === "Medium"),
      Tough: sessionResponses.filter((r) => r.difficulty === "Tough"),
    };
  }, [sessionResponses]);

  // Handlers
  const handleEvaluateWithAI = useCallback(async () => {
    // Now we check if there is either text OR an image before proceeding
    if ((!reasoning.trim() && !imageBase64) || !currentQuestion) return;

    setIsAnalyzing(true);
    setAnalysisData(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.text,
          reasoning: reasoning,
          imageBase64: imageBase64, // Pass the image string here
          correctAnswer: currentQuestion.correctAnswer,
        }),
      });
      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [reasoning, imageBase64, currentQuestion]);

  if (!currentQuestion)
    return <div className="p-10 text-center">Loading Session...</div>;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold uppercase tracking-tight">
            Review Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Clock className="w-4 h-4" /> {currentQuestion.timeSpent}s spent
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            Exit
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Review Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30">
          <div className="mx-auto max-w-2xl px-4 py-8 space-y-6 pb-24">
            <ReviewQuestionCard
              questionNumber={currentIndex + 1}
              questionText={currentQuestion.text}
              options={currentQuestion.options}
              correctAnswer={currentQuestion.correctAnswer}
              userAnswer={currentQuestion.userAnswer} // New prop for visual comparison
            />

            <ReasoningInput
              value={reasoning}
              onChange={setReasoning}
              onImageUpload={(base64) => setImageBase64(base64)}
              imagePreview={imageBase64}
            />

            {(isAnalyzing || analysisData) && (
              <ReviewAnalysis
                studentExplanation={reasoning}
                analysisData={analysisData}
                isLoading={isAnalyzing}
                onLogEntry={(type) => setLoggedType(type)}
                loggedType={loggedType}
              />
            )}

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <SolutionButtons
                isEnabled={
                  (reasoning.trim().length > 0 || !!imageBase64) && !isAnalyzing
                }
                onEvaluateWithAI={handleEvaluateWithAI}
                onViewVideo={() => alert("Video coming soon")}
                onViewDescriptive={() => alert("Solution coming soon")}
              />
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-[320px] bg-background/90 backdrop-blur-md border-t px-8 py-4 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setCurrentIndex((i) => i - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            <div className="text-sm font-semibold text-slate-500">
              Question {currentIndex + 1} of {sessionResponses.length}
            </div>
            <Button
              variant="ghost"
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={currentIndex === sessionResponses.length - 1}
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </main>

        {/* Diagnostic Sidebar */}
        <aside className="w-80 border-l bg-card p-6 overflow-y-auto hidden md:block">
          <div className="flex items-center gap-2 mb-6 font-bold text-slate-800">
            <LayoutGrid className="w-4 h-4" /> Question Palette
          </div>

          {Object.entries(grouped).map(
            ([level, questions]) =>
              questions.length > 0 && (
                <div key={level} className="mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    {level} Level
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {questions.map((q) => {
                      const originalIdx = sessionResponses.findIndex(
                        (r) => r.id === q.id,
                      );
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(originalIdx)}
                          className={`h-9 w-9 rounded-md text-[11px] font-bold border transition-all
                          ${currentIndex === originalIdx ? "ring-2 ring-primary ring-offset-2" : ""}
                          ${
                            !q.userAnswer
                              ? "bg-slate-50 text-slate-400 border-slate-200"
                              : q.isCorrect
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200"
                          }
                        `}
                        >
                          {originalIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ),
          )}
        </aside>
      </div>
    </div>
  );
}
