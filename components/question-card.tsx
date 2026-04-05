"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Option {
  id: string;
  label: string;
  text: string;
}

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  options: Option[];
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
}

function renderLatex(text: string): string {
  // Replace inline math $...$ with rendered KaTeX
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

export function QuestionCard({
  questionNumber,
  questionText,
  options,
  selectedOption,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <span className="mb-2 inline-block rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
            Question {questionNumber}
          </span>
          <p className="mt-3 text-base leading-relaxed text-foreground">
            <MathText text={questionText} />
          </p>
        </div>

        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all ${
                selectedOption === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-muted-foreground/30 hover:bg-muted/50"
              }`}
            >
              <input
                type="radio"
                name="answer"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => onSelectOption(option.id)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <div className="flex items-baseline gap-2">
                <Label className="font-medium text-muted-foreground">
                  {option.label}.
                </Label>
                <span className="text-foreground">
                  <MathText text={option.text} />
                </span>
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
