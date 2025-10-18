"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.back()}
      className="gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">Back</span>
    </Button>
  );
}