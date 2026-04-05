"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  BookOpen,
  PenLine,
  Sparkles,
  BarChart3,
} from "lucide-react";

function SubmissionContent() {
  const searchParams = useSearchParams();

  const attempted = parseInt(searchParams.get("attempted") || "0", 10);
  const totalQuestions = parseInt(searchParams.get("total") || "22", 10);
  const unattempted = totalQuestions - attempted;

  const steps = [
    {
      number: 1,
      icon: PenLine,
      title: "Log your reasoning",
      description: "Write down your thought process for each question.",
    },
    {
      number: 2,
      icon: Sparkles,
      title: "Unlock AI analysis and video solutions",
      description:
        "Get personalized feedback and watch expert explanations.",
    },
    {
      number: 3,
      icon: BarChart3,
      title: "View your final topic-wise strength report",
      description:
        "Identify your strengths and areas for improvement.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Success Icon and Heading */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Section Submitted Successfully!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Great job completing the CAT Quant Sectional 1
          </p>
        </div>

        {/* Summary Card */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <h2 className="mb-4 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Your Summary
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {totalQuestions}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Total Questions
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {attempted}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Attempted
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-400">
                  {unattempted}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Unattempted
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Review Button */}
        <Link href="/review" className="block">
          <Button
            size="lg"
            className="w-full gap-2 bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <BookOpen className="h-5 w-5" />
            Start Guided Review Session
          </Button>
        </Link>

        {/* How to Review Guide */}
        <div className="space-y-4">
          <h3 className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            How to Review
          </h3>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <step.icon className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {step.title}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubmittedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SubmissionContent />
    </Suspense>
  );
}
