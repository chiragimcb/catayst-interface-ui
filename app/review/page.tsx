"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ReviewQuestionCard } from "@/components/review-question-card";
import { ReasoningInput } from "@/components/reasoning-input";
import { SolutionButtons } from "@/components/solution-buttons";
import { QuestionMetadata, type Difficulty } from "@/components/question-metadata";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

const sampleQuestion = {
  id: 1,
  text: "If $x^2 + \\sqrt{y} = 25$ and $y = 16$, what is the value of $x$?",
  options: [
    { id: "a", label: "A", text: "$\\pm 3$" },
    { id: "b", label: "B", text: "$\\pm \\sqrt{21}$" },
    { id: "c", label: "C", text: "$\\pm 5$" },
    { id: "d", label: "D", text: "$\\pm 4$" },
  ],
  correctAnswer: "B",
  topic: "Algebra - Logarithms",
  difficulty: "hard" as Difficulty,
  timeSpent: "2:45 mins",
};

export default function ReviewPage() {
  const [reasoning, setReasoning] = useState("");

  const hasReasoning = reasoning.trim().length > 0;

  const handleViewVideo = useCallback(() => {
    alert("Opening video solution...");
  }, []);

  const handleViewDescriptive = useCallback(() => {
    alert("Opening descriptive answer...");
  }, []);

  const handleEvaluateWithAI = useCallback(() => {
    alert(`Evaluating your reasoning:\n\n"${reasoning}"`);
  }, [reasoning]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              Guided Review Session
            </h1>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back to Exam
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Question with correct answer highlighted */}
          <ReviewQuestionCard
            questionNumber={sampleQuestion.id}
            questionText={sampleQuestion.text}
            options={sampleQuestion.options}
            correctAnswer={sampleQuestion.correctAnswer}
          />

          {/* Reasoning input area */}
          <ReasoningInput value={reasoning} onChange={setReasoning} />

          {/* Question metadata badges */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <QuestionMetadata
              topic={sampleQuestion.topic}
              difficulty={sampleQuestion.difficulty}
              timeSpent={sampleQuestion.timeSpent}
            />
          </div>

          {/* Solution buttons */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <SolutionButtons
              isEnabled={hasReasoning}
              onViewVideo={handleViewVideo}
              onViewDescriptive={handleViewDescriptive}
              onEvaluateWithAI={handleEvaluateWithAI}
            />
            {!hasReasoning && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Enter your reasoning above to unlock solution options.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-3 text-center text-xs text-muted-foreground">
        Question 1 of 22 &middot; Review Mode
      </footer>
    </div>
  );
}
