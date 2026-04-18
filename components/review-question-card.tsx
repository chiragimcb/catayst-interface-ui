"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, CircleSlash } from "lucide-react";

interface Option {
  id: string;
  label: string;
  text: string;
}

interface ReviewQuestionCardProps {
  questionNumber: number;
  questionText: string;
  options: Option[];
  correctAnswer: string;
  userAnswer: string | null; // Added for the manifest logic
}

function renderLatex(text: string): string {
  // Regex to catch:
  // 1. $...$ (Standard inline)
  // 2. \(...\) (Escaped inline - common in CAT banks)
  // 3. \[...\] (Display mode - for equations on new lines)
  const regex = /\$([^$]+)\$|\\\((.*?)\\\)|\\\[(.*?)\\\]/g;

  return text.replace(regex, (_, math1, math2, math3) => {
    // Determine which capture group matched
    const math = math1 || math2 || math3;
    const isDisplayMode = !!math3; // If it matched group 3, it's display math

    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: isDisplayMode,
      });
    } catch {
      return math;
    }
  });
}

function MathText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = renderLatex(text);
    }
  }, [text]);

  return <span ref={ref} />;
}

export function ReviewQuestionCard({
  questionNumber,
  questionText,
  options,
  correctAnswer,
  userAnswer,
}: ReviewQuestionCardProps) {
  const isCorrectAttempt = userAnswer === correctAnswer;
  const isSkipped = userAnswer === null;

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Question {questionNumber}
            </span>

            {/* Dynamic Status Badge */}
            {isSkipped ? (
              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 text-slate-600"
              >
                <CircleSlash className="mr-1 h-3 w-3" />
                Skipped
              </Badge>
            ) : isCorrectAttempt ? (
              <Badge
                variant="outline"
                className="border-emerald-300 bg-emerald-50 text-emerald-700"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Correct
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-red-300 bg-red-50 text-red-700"
              >
                <XCircle className="mr-1 h-3 w-3" />
                Incorrect
              </Badge>
            )}

            <span className="text-xs text-muted-foreground ml-auto">
              Correct Key: <span className="font-bold">{correctAnswer}</span>
            </span>
          </div>

          <p className="mt-3 text-base leading-relaxed text-foreground">
            <MathText text={questionText} />
          </p>
        </div>

        <div className="space-y-3">
          {options.map((option) => {
            const isCorrectOption = option.id === correctAnswer;
            const isUserChoice = option.id === userAnswer;

            // Visual logic for option container
            let containerStyles = "border-border bg-background";
            if (isCorrectOption)
              containerStyles =
                "border-emerald-300 bg-emerald-50/50 ring-1 ring-emerald-300";
            if (isUserChoice && !isCorrectAttempt)
              containerStyles = "border-red-300 bg-red-50/50";

            return (
              <div
                key={option.id}
                className={`flex items-start gap-3 rounded-lg border p-4 transition-all ${containerStyles}`}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                    isCorrectOption
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isUserChoice
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {option.label}
                </div>
                <span className="flex-1">
                  <span
                    className={
                      isCorrectOption
                        ? "text-emerald-900 font-medium"
                        : "text-foreground"
                    }
                  >
                    <MathText text={option.text} />
                  </span>
                  {isCorrectOption && (
                    <span className="ml-2 text-[10px] font-bold text-emerald-600 uppercase">
                      Correct Answer
                    </span>
                  )}
                  {isUserChoice && !isCorrectAttempt && (
                    <span className="ml-2 text-[10px] font-bold text-red-600 uppercase">
                      Your Choice
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
