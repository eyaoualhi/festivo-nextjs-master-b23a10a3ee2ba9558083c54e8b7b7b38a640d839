"use client";

import { RotateCw } from "lucide-react";
import Button from "@/components/ui/Button";

export default function RetryButton({ label }: { label: string }) {
  return (
    <Button onClick={() => window.location.reload()}>
      <RotateCw aria-hidden="true" className="size-4" />
      {label}
    </Button>
  );
}
