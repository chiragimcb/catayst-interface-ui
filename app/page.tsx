"use client";

import { useState, useEffect, useCallback } from "react";
import { ExamHeader } from "@/components/exam-header";
import { QuestionCard } from "@/components/question-card";
import { ExamActions } from "@/components/exam-actions";

const sampleQuestion = {
  id: 1,
  text: "If $x^2 + \\sqrt{y} = 25$ and $y = 16$, what is the value of $x$?",
  options: [
    { id: "a", label: "A", text: "$\\pm 3$" },
    { id: "b", label: "B", text: "$\\pm \\sqrt{21}$" },
    { id: "c", label: "C", text: "$\\pm 5$" },
    { id: "d", label: "D", text: "$\\pm 4$" },
  ],
};

const INITIAL_TIME = 40 * 60; // 40 minutes in seconds

export default function ExamPage() {
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);

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

  const handleSelectOption = useCallback((optionId: string) => {
    setSelectedOption(optionId);
  }, []);

  const handleMarkForReview = useCallback(() => {
    setIsMarkedForReview((prev) => !prev);
  }, []);

  const handleNextQuestion = useCallback(() => {
    // In a real app, this would navigate to the next question
    alert(
      `Selected answer: ${selectedOption || "None"}\nMarked for review: ${isMarkedForReview}`
    );
  }, [selectedOption, isMarkedForReview]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ExamHeader title="CAT Quant Sectional 1" timeRemaining={timeRemaining} />

      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          <QuestionCard
            questionNumber={1}
            questionText={sampleQuestion.text}
            options={sampleQuestion.options}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
          />

          <ExamActions
            isMarkedForReview={isMarkedForReview}
            onMarkForReview={handleMarkForReview}
            onNextQuestion={handleNextQuestion}
          />
        </div>
      </main>

      <footer className="border-t border-border bg-card px-6 py-3 text-center text-xs text-muted-foreground">
        Question 1 of 22
      </footer>
    </div>
  );
}
