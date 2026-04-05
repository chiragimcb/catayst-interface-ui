import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Play, FileText, Calculator, Clock, CheckCircle, XCircle, MinusCircle } from "lucide-react";

export default function InstructionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <FileText className="h-4 w-4" />
              Read Carefully
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Exam Instructions
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Quant Sectional 1
            </p>
          </div>

          {/* Instructions Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" />
                Test Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Total Questions
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-foreground">22</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Time Limit
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-foreground">40 Minutes</p>
                </div>
              </div>
            </CardContent>

            <Separator />

            <CardHeader className="pb-4 pt-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" />
                Marking Scheme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Correct Answer</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-600">+3</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-900">Incorrect Answer</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">-1</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <MinusCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">Unattempted</span>
                  </div>
                  <span className="text-xl font-bold text-muted-foreground">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <div className="mt-8">
            <Link href="/exam" className="block">
              <Button
                size="lg"
                className="w-full gap-2 bg-slate-900 py-6 text-base font-medium text-white hover:bg-slate-800"
              >
                <Play className="h-5 w-5" />
                I Understand, Start the Timer
              </Button>
            </Link>
          </div>

          {/* Additional Note */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            The timer will start as soon as you click the button above.
          </p>
        </div>
      </main>
    </div>
  );
}
