"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { ExamHeader } from "@/components/exam-header";
import { QuestionCard } from "@/components/question-card";
import { ExamActions } from "@/components/exam-actions";
import {
  QuestionNavigator,
  type QuestionStatus,
} from "@/components/question-navigator";
import { getQuestions } from "@/lib/questions";

const TOTAL_QUESTIONS = 22;
const INITIAL_TIME = 40 * 60; // 40 minutes

export default function ExamPage() {
  const router = useRouter();

  // 1. Data Initialization
  const allQuestions = useMemo(() => getQuestions(), []);

  // 2. States
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [currentQuestion, setCurrentQuestion] = useState(1); // 1-indexed for UI
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string | null>
  >({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(
    new Set(),
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 3. Time Tracking State (Professional Metric)
  const [timeSpentPerQuestion, setTimeSpentPerQuestion] = useState<
    Record<number, number>
  >({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 4. Timer Logic: Tracks total time AND per-question time
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));

      // Increment time for the current active question
      setTimeSpentPerQuestion((prev) => ({
        ...prev,
        [currentQuestion]: (prev[currentQuestion] || 0) + 1,
      }));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion]);

  // 5. Question Navigator Statuses
  const questionStatuses: QuestionStatus[] = Array.from(
    { length: TOTAL_QUESTIONS },
    (_, i) => {
      const qNum = i + 1;
      if (markedForReview.has(qNum)) return "marked-for-review";
      if (selectedOptions[qNum]) return "attempted";
      return "not-visited";
    },
  );

  // 6. Handlers
  const handleSelectOption = useCallback(
    (optionId: string) => {
      setSelectedOptions((prev) => ({ ...prev, [currentQuestion]: optionId }));
    },
    [currentQuestion],
  );

  const handleMarkForReview = useCallback(() => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      newSet.has(currentQuestion)
        ? newSet.delete(currentQuestion)
        : newSet.add(currentQuestion);
      return newSet;
    });
  }, [currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < TOTAL_QUESTIONS)
      setCurrentQuestion((prev) => prev + 1);
  }, [currentQuestion]);

  const handleSelectQuestion = useCallback(
    (num: number) => setCurrentQuestion(num),
    [],
  );
  const handleToggleSidebar = useCallback(
    () => setIsSidebarCollapsed((p) => !p),
    [],
  );

  // 7. THE MASTER SUBMIT FUNCTION: Compiles all data and navigates to review page
  const handleSubmitTest = useCallback(() => {
    const attemptedCount = Object.keys(selectedOptions).length;
    const confirmSubmit = window.confirm(
      `Submit Exam?\nAttempted: ${attemptedCount}/${TOTAL_QUESTIONS}`,
    );

    if (confirmSubmit) {
      const sessionManifest = {
        sessionId: `CAT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        totalQuestions: TOTAL_QUESTIONS,
        // We map from allQuestions (the source) and combine with user state
        responses: allQuestions.map((q) => {
          const userAns = selectedOptions[q.id] || null;
          return {
            id: q.id,
            text: q.text,
            options: q.options,
            difficulty: q.difficulty || "Medium",
            userAnswer: userAns,
            correctAnswer: q.answer, // Assumes your lib/questions has an 'answer' key
            isCorrect: userAns === q.answer,
            timeSpent: timeSpentPerQuestion[q.id] || 0,
          };
        }),
      };

      localStorage.setItem(
        "cat_session_result",
        JSON.stringify(sessionManifest),
      );
      router.push("/review");
    }
  }, [selectedOptions, allQuestions, timeSpentPerQuestion, router]);

  // Render Logic
  const currentQuestionData = allQuestions[currentQuestion - 1];
  if (!currentQuestionData)
    return <div className="p-10 text-center">Loading Questions...</div>;

  return (
    <div className="flex h-screen flex-col bg-background">
      <ExamHeader title="CAT Quant Sectional 1" timeRemaining={timeRemaining} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <main className="flex flex-1 flex-col items-center px-4 py-8">
            <div className="w-full max-w-2xl space-y-6">
              <QuestionCard
                questionNumber={currentQuestion}
                questionText={currentQuestionData.text}
                options={currentQuestionData.options}
                selectedOption={selectedOptions[currentQuestion] || null}
                onSelectOption={handleSelectOption}
              />

              <ExamActions
                isMarkedForReview={markedForReview.has(currentQuestion)}
                onMarkForReview={handleMarkForReview}
                onNextQuestion={handleNextQuestion}
                isLastQuestion={currentQuestion === TOTAL_QUESTIONS}
              />
            </div>
          </main>
          <footer className="border-t border-border bg-card px-6 py-3 text-center text-xs text-muted-foreground">
            Question {currentQuestion} of {TOTAL_QUESTIONS}
          </footer>
        </div>

        <QuestionNavigator
          totalQuestions={TOTAL_QUESTIONS}
          currentQuestion={currentQuestion}
          questionStatuses={questionStatuses}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          onSelectQuestion={handleSelectQuestion}
          onSubmitTest={handleSubmitTest}
        />
      </div>
    </div>
  );
}
