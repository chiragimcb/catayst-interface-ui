"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ReviewQuestionCard } from "@/components/review-question-card";
import { ReasoningInput } from "@/components/reasoning-input";
import { SolutionButtons } from "@/components/solution-buttons";
import { QuestionMetadata, type Difficulty } from "@/components/question-metadata";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // IMPORTANT: This provides the math styling

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
  const [isAnalyzing, setIsAnalyzing] = useState(false); 
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);  


  const hasReasoning = reasoning.trim().length > 0;

  const handleViewVideo = useCallback(() => {
    alert("Opening video solution...");
  }, []);

  const handleViewDescriptive = useCallback(() => {
    alert("Opening descriptive answer...");
  }, []);

  const handleEvaluateWithAI = useCallback(async () => {
    if (!reasoning.trim()) return;
    
    setIsAnalyzing(true);
    setAiFeedback(null); // Clear previous feedback

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: sampleQuestion.text,
          reasoning: reasoning,
          correctAnswer: sampleQuestion.correctAnswer,
        }),
      });

      const data = await response.json();
      setAiFeedback(data.analysis);
    } catch (error) {
      setAiFeedback("Ouch! I had trouble connecting to my brain. Try again?");
    } finally {
      setIsAnalyzing(false);
    }
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
          <Link href="/exam">
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

          {/* AI Feedback Card */}
          {(isAnalyzing || aiFeedback) && (
            <div className={`rounded-lg border p-5 shadow-sm transition-all duration-300 ${
              isAnalyzing ? "animate-pulse border-primary/30 bg-primary/5" : "border-primary/20 bg-primary/5"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm font-bold tracking-tight text-primary uppercase">
                  Socratic Coach
                </span>
              </div>
              
              {isAnalyzing ? (
                <p className="text-sm text-muted-foreground italic">Analyzing your logic...</p>
              ) : (
                <div className="prose prose-sm dark:prose-invert">
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                    {/* Inside your AI Feedback Card */}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {aiFeedback}
                      </ReactMarkdown>
                    </div>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Solution buttons */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <SolutionButtons
              isEnabled={hasReasoning && !isAnalyzing} 
              onViewVideo={handleViewVideo}
              onViewDescriptive={handleViewDescriptive}
              onEvaluateWithAI={handleEvaluateWithAI}
              // Pro-tip: Pass a "label" prop to SolutionButtons if you can, 
              // to change "Evaluate with AI" to "Refine with AI" once aiFeedback exists.
            />
            
            {isAnalyzing && (
              <p className="mt-3 text-center text-xs font-medium text-primary animate-pulse">
                Coach is thinking...
              </p>
            )}

            {!hasReasoning && !isAnalyzing && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Enter your reasoning above to unlock the Socratic Coach.
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
