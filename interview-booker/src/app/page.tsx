"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setOutput(data?.output ?? "");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Agent Demo</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <textarea
          className="border rounded p-2 min-h-[100px]"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {output !== null && !error && (
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-1">Response</div>
          <pre className="whitespace-pre-wrap text-black bg-gray-50 border rounded p-3">{output}</pre>
        </div>
      )}
    </div>
  );
}
