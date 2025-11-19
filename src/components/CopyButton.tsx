"use client";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copy failed");
    }
  }
  return (
    <button onClick={copy} className="px-2 py-1 border rounded text-sm">
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
