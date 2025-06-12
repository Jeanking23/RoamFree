
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          RoamFree Minimal Test Page
        </h1>
        <p className="text-lg text-foreground/80 mb-8">
          This is a temporary minimal page to test server stability.
        </p>
        <Link href="/transport">
          <Button>Go to Transport Page (Test)</Button>
        </Link>
      </main>
    </div>
  );
}
