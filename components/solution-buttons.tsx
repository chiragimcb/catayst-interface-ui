"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Video, FileText, Sparkles } from "lucide-react";

interface SolutionButtonsProps {
  isEnabled: boolean;
  onViewVideo: () => void;
  onViewDescriptive: () => void;
  onEvaluateWithAI: () => void;
}

export function SolutionButtons({
  isEnabled,
  onViewVideo,
  onViewDescriptive,
  onEvaluateWithAI,
}: SolutionButtonsProps) {
  const buttons = [
    {
      label: "View Video Solution",
      icon: Video,
      onClick: onViewVideo,
    },
    {
      label: "View Descriptive Answer",
      icon: FileText,
      onClick: onViewDescriptive,
    },
    {
      label: "Evaluate Reasoning with AI",
      icon: Sparkles,
      onClick: onEvaluateWithAI,
    },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      {buttons.map((button) => {
        const Icon = button.icon;

        if (!isEnabled) {
          return (
            <Tooltip key={button.label}>
              <TooltipTrigger asChild>
                <span className="inline-block w-full sm:w-auto">
                  <Button
                    variant="outline"
                    disabled
                    className="w-full cursor-not-allowed border-muted bg-muted/50 text-muted-foreground opacity-60 sm:w-auto"
                  >
                    <Icon className="h-4 w-4" />
                    {button.label}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8}>
                <p>Please enter your reasoning first.</p>
              </TooltipContent>
            </Tooltip>
          );
        }

        return (
          <Button
            key={button.label}
            variant="outline"
            onClick={button.onClick}
            className="w-full border-primary/30 bg-background text-foreground hover:border-primary hover:bg-primary/5 sm:w-auto"
          >
            <Icon className="h-4 w-4 text-primary" />
            {button.label}
          </Button>
        );
      })}
    </div>
  );
}
