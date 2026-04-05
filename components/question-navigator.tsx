"use client";

import { Button } from "@/components/ui/button";
import { Flag, PanelRightClose, PanelRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuestionStatus = "not-visited" | "attempted" | "marked-for-review";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  questionStatuses: QuestionStatus[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectQuestion: (questionNumber: number) => void;
  onSubmitTest: () => void;
}

function getStatusStyles(status: QuestionStatus, isActive: boolean): string {
  const baseStyles =
    "h-10 w-10 rounded-md text-sm font-medium transition-all flex items-center justify-center";

  if (isActive) {
    return cn(baseStyles, "ring-2 ring-primary ring-offset-2");
  }

  switch (status) {
    case "attempted":
      return cn(
        baseStyles,
        "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-600"
      );
    case "marked-for-review":
      return cn(
        baseStyles,
        "bg-purple-500 text-white hover:bg-purple-600 border-purple-600"
      );
    case "not-visited":
    default:
      return cn(
        baseStyles,
        "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
      );
  }
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestion,
  questionStatuses,
  isCollapsed,
  onToggleCollapse,
  onSelectQuestion,
  onSubmitTest,
}: QuestionNavigatorProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-l border-border bg-card transition-all duration-300",
        isCollapsed ? "w-14" : "w-64"
      )}
    >
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between border-b border-border px-3 py-3">
        {!isCollapsed && (
          <span className="text-sm font-medium text-foreground">
            Questions
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelRight className="h-4 w-4" />
          ) : (
            <PanelRightClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Question grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(
              (num) => (
                <button
                  key={num}
                  onClick={() => onSelectQuestion(num)}
                  className={getStatusStyles(
                    questionStatuses[num - 1],
                    currentQuestion === num
                  )}
                  aria-label={`Question ${num}`}
                >
                  {num}
                </button>
              )
            )}
          </div>
        ) : (
          <>
            {/* Legend */}
            <div className="mb-4 space-y-2 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded-sm bg-emerald-500" />
                <span className="text-muted-foreground">Attempted</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded-sm bg-purple-500" />
                <span className="text-muted-foreground">Marked for Review</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded-sm border border-border bg-muted" />
                <span className="text-muted-foreground">Not Visited</span>
              </div>
            </div>

            {/* Grid of question numbers */}
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => onSelectQuestion(num)}
                    className={getStatusStyles(
                      questionStatuses[num - 1],
                      currentQuestion === num
                    )}
                    aria-label={`Question ${num}`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* Submit Test Button */}
      <div className="border-t border-border p-3">
        <Button
          onClick={onSubmitTest}
          className={cn(
            "w-full gap-2 bg-slate-900 text-white hover:bg-slate-800",
            isCollapsed ? "px-2" : "px-4"
          )}
          size={isCollapsed ? "icon" : "default"}
        >
          <Flag className="h-4 w-4" />
          {!isCollapsed && <span>Submit Test</span>}
        </Button>
      </div>
    </aside>
  );
}
