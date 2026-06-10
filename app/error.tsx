"use client";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/heroui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-teams-gray/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-danger/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <Card  className="w-full max-w-lg border border-danger/10 animate-fade-in-up">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-danger/10 border border-danger/20 mb-6">
            <AlertTriangle size={48} className="text-danger" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-teams-dark">
            Something Went Wrong
          </h1>

          {/* Description */}
          <p className="mt-4 text-base font-medium leading-relaxed text-foreground-500">
            An unexpected error occurred while loading this page. Please try again
            or return to the homepage.
          </p>

          {/* Error digest (for debugging) */}
          {error.digest && (
            <div className="mt-6 rounded-xl bg-teams-gray/10 border border-teams-border/40 p-3">
              <p className="text-xs font-bold text-foreground-400">
                Error Reference: <span className="font-mono text-danger-600 ml-2">{error.digest}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="primary"
              className="font-bold bg-teams-ocean shadow-md w-full sm:w-auto"
              onClick={reset}
              icon={<RotateCcw size={18} />}
            >
              Try Again
            </Button>
            <Button
              
              href="/"
              variant="primary"
              className="font-bold bg-teams-ocean/10 text-teams-ocean w-full sm:w-auto"
              icon={<Home size={18} />}
            >
              Go to Homepage
            </Button>
          </div>

          {/* Help text */}
          <div className="mt-10 pt-6 border-t border-teams-border/30">
            <p className="text-xs font-semibold text-foreground-400">
              If this problem persists, please contact the helpdesk at{" "}
              <a
                href="mailto:recruitment-helpdesk@serc.res.in"
                className="text-teams-ocean hover:underline font-bold"
              >
                recruitment-helpdesk@serc.res.in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

