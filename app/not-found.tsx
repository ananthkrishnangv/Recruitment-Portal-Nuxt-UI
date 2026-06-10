"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/heroui";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-teams-gray/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teams-ocean/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <Card  className="w-full max-w-lg border border-teams-border/40 animate-fade-in-up">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-teams-ocean/10 border border-teams-ocean/20 mb-6">
            <FileQuestion size={48} className="text-teams-ocean" />
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-black text-teams-dark tracking-tighter">
            404
          </h1>

          {/* Title */}
          <h2 className="mt-4 text-2xl font-bold text-teams-dark">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="mt-4 text-base font-medium leading-relaxed text-foreground-500">
            The page you are looking for does not exist or may have been moved.
            Please check the URL or navigate back.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button 
               
              href="/" 
              variant="primary"
              className="font-bold bg-teams-ocean shadow-md w-full sm:w-auto px-6"
              icon={<Home size={18} />}
            >
              Go to Homepage
            </Button>
            <Button 
               
              href="/jobs" 
              variant="primary"
              className="font-bold bg-teams-ocean/10 text-teams-ocean w-full sm:w-auto px-6"
              icon={<ArrowLeft size={18} />}
            >
              View Vacancies
            </Button>
          </div>

          {/* Help text */}
          <div className="mt-10 pt-6 border-t border-teams-border/30">
            <p className="text-xs font-semibold text-foreground-400">
              If you believe this is an error, please contact the helpdesk at{" "}
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

