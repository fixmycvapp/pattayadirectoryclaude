import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Event Not Found
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The event you're looking for doesn't exist or has been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Link href="/events">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-tropical"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-gray-600">
            <strong>Need help?</strong> Contact us at{" "}
            <a href="mailto:support@pattayadirectory.com" className="text-blue-600 hover:underline">
              support@pattayadirectory.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}