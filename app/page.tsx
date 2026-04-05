import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">
          {/* Title */}
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            CAT-alytic
          </h1>
          <p className="mt-2 text-lg font-medium text-primary sm:text-xl">
            Guided CAT Prep
          </p>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Measure your ability, log your logic, and build your CAT score with
            AI-powered analysis.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Link href="/exam">
              <Button
                size="lg"
                className="gap-2 bg-slate-900 px-8 py-6 text-base font-medium text-white hover:bg-slate-800"
              >
                Start Quant Sectional 1
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <p className="text-center text-xs text-muted-foreground">
          CAT-alytic — Your path to IIM
        </p>
      </footer>
    </div>
  );
}
