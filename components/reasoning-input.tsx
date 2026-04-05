"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PenLine } from "lucide-react";

interface ReasoningInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReasoningInput({ value, onChange }: ReasoningInputProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
          <PenLine className="h-4 w-4 text-primary" />
          Log Your Methodology
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your methodology here. You must log your reasoning before viewing solutions..."
          className="min-h-[140px] resize-none text-sm"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Reflect on your approach before viewing the solution to strengthen
          your learning.
        </p>
      </CardContent>
    </Card>
  );
}
