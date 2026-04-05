"use client";

import { Badge } from "@/components/ui/badge";
import { BookText, Gauge, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type Difficulty = "easy" | "medium" | "hard";

interface QuestionMetadataProps {
  topic: string;
  difficulty: Difficulty;
  timeSpent: string;
}

const difficultyConfig: Record<
  Difficulty,
  { label: string; className: string }
> = {
  easy: {
    label: "Easy",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  hard: {
    label: "Hard",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export function QuestionMetadata({
  topic,
  difficulty,
  timeSpent,
}: QuestionMetadataProps) {
  const diffConfig = difficultyConfig[difficulty];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Topic Badge */}
      <Badge
        variant="outline"
        className="gap-1.5 bg-secondary/50 px-2.5 py-1 text-xs font-medium"
      >
        <BookText className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">Topic:</span>
        <span className="text-foreground">{topic}</span>
      </Badge>

      {/* Difficulty Badge - Color-coded */}
      <Badge
        variant="outline"
        className={cn("gap-1.5 px-2.5 py-1 text-xs font-medium", diffConfig.className)}
      >
        <Gauge className="h-3 w-3" />
        <span className="opacity-80">Difficulty:</span>
        <span className="font-semibold">{diffConfig.label}</span>
      </Badge>

      {/* Time Spent Badge */}
      <Badge
        variant="outline"
        className="gap-1.5 bg-secondary/50 px-2.5 py-1 text-xs font-medium"
      >
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">Time Spent:</span>
        <span className="text-foreground">{timeSpent}</span>
      </Badge>
    </div>
  );
}
