"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

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
}

function renderLatex(text: string): string {
  return text.replace(/\$([^$]+)\$/g, (_, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
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
}: ReviewQuestionCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Question {questionNumber}
            </span>
            <Badge
              variant="outline"
              className="border-emerald-300 bg-emerald-50 text-emerald-700"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Correct Answer: {correctAnswer}
            </Badge>
          </div>
          <p className="mt-3 text-base leading-relaxed text-foreground">
            <MathText text={questionText} />
          </p>
        </div>

        <div className="space-y-3">
          {options.map((option) => {
            const isCorrect = option.label === correctAnswer;
            return (
              <div
                key={option.id}
                className={`flex items-start gap-3 rounded-lg border p-4 ${
                  isCorrect
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-border bg-background"
                }`}
              >
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                    isCorrect
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {option.label}
                </div>
                <span
                  className={isCorrect ? "text-emerald-900" : "text-foreground"}
                >
                  <MathText text={option.text} />
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
