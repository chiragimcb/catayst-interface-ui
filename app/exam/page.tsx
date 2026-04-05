"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExamHeader } from "@/components/exam-header";
import { QuestionCard } from "@/components/question-card";
import { ExamActions } from "@/components/exam-actions";
import {
  QuestionNavigator,
  type QuestionStatus,
} from "@/components/question-navigator";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const sampleQuestions = [
  {
    id: 1,
    text: "If $x^2 + \\sqrt{y} = 25$ and $y = 16$, what is the value of $x$?",
    options: [
      { id: "a", label: "A", text: "$\\pm 3$" },
      { id: "b", label: "B", text: "$\\pm \\sqrt{21}$" },
      { id: "c", label: "C", text: "$\\pm 5$" },
      { id: "d", label: "D", text: "$\\pm 4$" },
    ],
  },
  {
    id: 2,
    text: "What is the sum of the first 10 terms of the arithmetic progression $3, 7, 11, 15, ...$?",
    options: [
      { id: "a", label: "A", text: "$210$" },
      { id: "b", label: "B", text: "$200$" },
      { id: "c", label: "C", text: "$195$" },
      { id: "d", label: "D", text: "$180$" },
    ],
  },
  {
    id: 3,
    text: "If $\\log_2(x) + \\log_2(x-2) = 3$, find the value of $x$.",
    options: [
      { id: "a", label: "A", text: "$4$" },
      { id: "b", label: "B", text: "$6$" },
      { id: "c", label: "C", text: "$8$" },
      { id: "d", label: "D", text: "$2$" },
    ],
  },
];

const TOTAL_QUESTIONS = 22;
const INITIAL_TIME = 40 * 60; // 40 minutes in seconds

export default function ExamPage() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string | null>
  >({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(
    new Set()
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize question statuses
  const questionStatuses: QuestionStatus[] = Array.from(
    { length: TOTAL_QUESTIONS },
    (_, i) => {
      const questionNum = i + 1;
      if (markedForReview.has(questionNum)) {
        return "marked-for-review";
      }
      if (selectedOptions[questionNum]) {
        return "attempted";
      }
      return "not-visited";
    }
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [currentQuestion]: optionId,
      }));
    },
    [currentQuestion]
  );

  const handleMarkForReview = useCallback(() => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  }, [currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion]);

  const handleSelectQuestion = useCallback((questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleSubmitTest = useCallback(() => {
    const attempted = Object.keys(selectedOptions).length;
    const confirmSubmit = window.confirm(
      `Are you sure you want to submit?\n\nAttempted: ${attempted}/${TOTAL_QUESTIONS}\nMarked for Review: ${markedForReview.size}`
    );
    if (confirmSubmit) {
      router.push(`/submitted?attempted=${attempted}&total=${TOTAL_QUESTIONS}`);
    }
  }, [selectedOptions, markedForReview, router]);

  // Get current question data (cycle through sample questions for demo)
  const currentQuestionData =
    sampleQuestions[(currentQuestion - 1) % sampleQuestions.length];
  const selectedOption = selectedOptions[currentQuestion] || null;
  const isMarkedForReview = markedForReview.has(currentQuestion);

  return (
    <div className="flex h-screen flex-col bg-background">
      <ExamHeader title="CAT Quant Sectional 1" timeRemaining={timeRemaining} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <main className="flex flex-1 flex-col items-center px-4 py-8">
            <div className="w-full max-w-2xl space-y-6">
              <QuestionCard
                questionNumber={currentQuestion}
                questionText={currentQuestionData.text}
                options={currentQuestionData.options}
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
              />

              <ExamActions
                isMarkedForReview={isMarkedForReview}
                onMarkForReview={handleMarkForReview}
                onNextQuestion={handleNextQuestion}
                isLastQuestion={currentQuestion === TOTAL_QUESTIONS}
              />
            </div>
          </main>

          <footer className="border-t border-border bg-card px-6 py-3">
            <div className="flex items-center justify-center gap-4">
              <span className="text-xs text-muted-foreground">
                Question {currentQuestion} of {TOTAL_QUESTIONS}
              </span>
              <Link href="/review" prefetch={false}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <BookOpen className="h-3.5 w-3.5" />
                  Review Mode
                </Button>
              </Link>
            </div>
          </footer>
        </div>

        {/* Collapsible Sidebar - Right Side */}
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
