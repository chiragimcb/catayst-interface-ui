"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, BookOpen, User, AlertCircle, CheckCircle2} from "lucide-react";
import { MathText } from "@/components/question-card"; // Reuse your MathText for LaTeX

// Categories for the Error Log
const MISTAKE_TYPES = [
  { id: "silly", label: "Silly Error", color: "hover:bg-orange-100 text-orange-700 border-orange-200" },
  { id: "concept", label: "Concept Gap", color: "hover:bg-red-100 text-red-700 border-red-200" },
  { id: "logic", label: "Strategy/Logic", color: "hover:bg-purple-100 text-purple-700 border-purple-200" },
  { id: "time", label: "Time Pressure", color: "hover:bg-blue-100 text-blue-700 border-blue-200" },
];

interface ReviewAnalysisProps {
  studentExplanation: string;
  analysisData: {
    critique: string;
    traditional: string;
    smart: string;
  } | null;
  isLoading: boolean;
  onLogEntry: (type: string) => void;
  loggedType?: string | null;
}

export function ReviewAnalysis({
  studentExplanation,
  analysisData,
  isLoading,
  onLogEntry,
  loggedType
}: ReviewAnalysisProps) {
  
  if (isLoading) {
    return (
      <Card className="w-full mt-8 animate-pulse border-dashed">
        <CardContent className="p-12 flex flex-col items-center justify-center text-muted-foreground">
          <Brain className="w-8 h-8 mb-4 animate-bounce" />
          <p>Gemini is analyzing your reasoning...</p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) return null;

  return (
    <Card className="w-full mt-8 border-t-4 border-t-primary shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Deep Analysis & Methodologies
        </CardTitle>
        {loggedType && (
          <div className="flex items-center gap-1 text-xs font-bold text-green-600 uppercase">
            <CheckCircle2 className="w-4 h-4" /> Logged
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="ai-reasoning" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="ai-reasoning" className="gap-2">
              <User className="w-4 h-4" /> AI Evaluation
            </TabsTrigger>
            <TabsTrigger value="traditional" className="gap-2">
              <BookOpen className="w-4 h-4" /> Anchor Method
            </TabsTrigger>
            <TabsTrigger value="smart" className="gap-2">
              <Lightbulb className="w-4 h-4" /> Smart Shortcut
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: AI Reasoning & Student Critique */}
          <TabsContent value="ai-reasoning" className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="text-xs font-bold mb-2 text-muted-foreground uppercase tracking-wider">Your Logic:</h4>
              <p className="text-sm italic text-foreground/80">"{studentExplanation}"</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="text-xs font-bold mb-2 text-primary uppercase tracking-wider">AI Coach Critique:</h4>
              <div className="text-sm leading-relaxed">
                <MathText text={analysisData.critique} />
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Traditional Step-by-Step */}
          <TabsContent value="traditional" className="p-4 bg-muted/30 rounded-lg border min-h-[100px]">
            <h4 className="text-xs font-bold mb-3 uppercase tracking-wider text-muted-foreground">Formal Algebraic Solution:</h4>
            <div className="text-sm leading-relaxed">
              <MathText text={analysisData.traditional} />
            </div>
          </TabsContent>

          {/* Tab 3: The "Smart" Approach */}
          <TabsContent value="smart" className="p-4 bg-yellow-50/50 border border-yellow-200 rounded-lg min-h-[100px]">
            <h4 className="text-xs font-bold mb-3 text-yellow-800 uppercase flex items-center gap-2 tracking-wider">
              <Lightbulb className="w-4 h-4" /> The 60-Second Edge:
            </h4>
            <div className="text-yellow-900 leading-relaxed text-sm">
              <MathText text={analysisData.smart} />
            </div>
          </TabsContent>
        </Tabs>

        {/* --- ERROR LOGGING SECTION --- */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-foreground/70">
            <AlertCircle className="w-4 h-4" />
            Classify this attempt for your Error Log:
          </div>
          <div className="flex flex-wrap gap-2">
            {MISTAKE_TYPES.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                size="sm"
                onClick={() => onLogEntry(type.id)}
                className={`rounded-full text-xs transition-all ${type.color} ${
                  loggedType === type.id ? "ring-2 ring-primary ring-offset-2 bg-primary/10" : ""
                }`}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}