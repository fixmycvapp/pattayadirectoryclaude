"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Event page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Something Went Wrong
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          We encountered an error while loading this event. Please try again.
        </p>

        {error.message && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 max-w-md mx-auto">
            <p className="text-sm text-red-700 font-mono">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <a href="/">
              <Home className="w-4 h-4" />
              Go Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}