"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Assuming you have shadcn Input

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
  if (!text) return "";
  
  // 1. Replace 2IIM/standard delimiters \( \) and $ $ with rendered KaTeX
  // This regex catches both $...$ and \(...\)
  let rendered = text.replace(/\$([^$]+)\$|\\\((.*?)\\\)/g, (_, group1, group2) => {
    const math = group1 || group2;
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return math;
    }
  });

  // 2. Handle block math \[ ... \] if present
  rendered = rendered.replace(/\\\[(.*?)\\\]/g, (_, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return math;
    }
  });

  return rendered;
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
  
  const isTITA = !options || options.length === 0;

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Question {questionNumber}
            </span>
            {isTITA && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border px-2 py-0.5 rounded">
                TITA (Type in Answer)
              </span>
            )}
          </div>
          <div className="mt-3 text-base leading-relaxed text-foreground">
            <MathText text={questionText} />
          </div>
        </div>

        <div className="space-y-3">
          {isTITA ? (
            /* TITA Input Field */
            <div className="pt-2">
              <Label className="text-xs text-muted-foreground mb-2 block">Your Answer:</Label>
              <Input
                type="text"
                placeholder="Enter numerical value..."
                value={selectedOption || ""}
                onChange={(e) => onSelectOption(e.target.value)}
                className="max-w-[200px] font-mono text-lg"
              />
            </div>
          ) : (
            /* MCQ Radio Options */
            options.map((option) => (
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
                  name={`answer-${questionNumber}`}
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => onSelectOption(option.id)}
                  className="mt-0.5 h-4 w-4 accent-primary"
                />
                <div className="flex items-baseline gap-2">
                  <Label className="font-medium text-muted-foreground cursor-pointer">
                    {option.label}.
                  </Label>
                  <span className="text-foreground">
                    <MathText text={option.text} />
                  </span>
                </div>
              </label>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}