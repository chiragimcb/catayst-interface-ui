"use client";

import { Clock } from "lucide-react";

interface ExamHeaderProps {
  title: string;
  timeRemaining: number; // in seconds
}

export function ExamHeader({ title, timeRemaining }: ExamHeaderProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLowTime = timeRemaining < 300; // less than 5 minutes

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4 shadow-sm">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div
        className={`flex items-center gap-2 rounded-md px-4 py-2 font-mono text-sm font-medium ${
          isLowTime
            ? "bg-red-50 text-red-600"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        <Clock className="h-4 w-4" />
        <span>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    </header>
  );
}
