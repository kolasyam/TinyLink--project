"use client";

import { useState, useEffect } from "react";
import { isValidUrl, CODE_REGEX } from "../lib/validators";
import { Loader2, Link2, Hash, CheckCircle, XCircle } from "lucide-react";

export default function AddLinkForm() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
    useEffect(() => {
    if (!msg && !error) return;

    const timer = setTimeout(() => {
      setMsg(null);
      setError(null);
    }, 3000); // hide after 3 secs

    return () => clearTimeout(timer);
  }, [msg, error]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!isValidUrl(url)) {
      setError("Enter a valid URL (must include http:// or https://)");
      return;
    }

    if (code && !CODE_REGEX.test(code)) {
      setError("Custom code must match [A-Za-z0-9]{6,8}");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
      });

      const data = await res.json();
      if (!res.ok && data?.error) {
        setError(data.error);
      } else {
        setMsg(`Short link created successfully: ${data.shortUrl}`);
        setUrl("");
        setCode("");

        window.dispatchEvent(new CustomEvent("tinylink:created"));
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Long URL</label>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm bg-white">
          <Link2 className="w-4 h-4 text-gray-500" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full outline-none"
            placeholder="https://example.com/very/long/url"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Custom code (optional)
        </label>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm bg-white w-full sm:w-60">
          <Hash className="w-4 h-4 text-gray-500" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full outline-none"
            placeholder="abc123"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="
          flex items-center justify-center gap-2 px-5 py-2.5 
          bg-blue-600 text-white font-medium rounded-lg
          hover:bg-blue-700 hover:shadow-lg transition-all
          active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed
          cursor-pointer
        "
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Short Link"
        )}
      </button>
      {msg && (
        <div className="flex items-center gap-2 text-green-600 bg-green-100 border border-green-300 px-3 py-2 rounded-md">
          <CheckCircle className="w-5 h-5" />
          <span>{msg}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 px-3 py-2 rounded-md">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
