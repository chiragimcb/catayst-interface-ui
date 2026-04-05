"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, ChevronRight } from "lucide-react";

interface ExamActionsProps {
  isMarkedForReview: boolean;
  onMarkForReview: () => void;
  onNextQuestion: () => void;
  isLastQuestion?: boolean;
}

export function ExamActions({
  isMarkedForReview,
  onMarkForReview,
  onNextQuestion,
  isLastQuestion = false,
}: ExamActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        variant={isMarkedForReview ? "secondary" : "outline"}
        onClick={onMarkForReview}
        className={`gap-2 ${
          isMarkedForReview
            ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : ""
        }`}
      >
        <Bookmark
          className={`h-4 w-4 ${isMarkedForReview ? "fill-current" : ""}`}
        />
        {isMarkedForReview ? "Marked for Review" : "Mark for Review"}
      </Button>

      <Button onClick={onNextQuestion} className="gap-2 px-6">
        {isLastQuestion ? "Submit" : "Next Question"}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
