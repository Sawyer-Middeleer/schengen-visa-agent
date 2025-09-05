"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    
    // Add https:// if not present
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: processedUrl }),
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
      <Card>
        <CardHeader>
          <CardTitle>Interview Booker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Input
              type="text"
              placeholder="Enter a URL (e.g., example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading || !url.trim()}>
                {loading ? "Working..." : "Send"}
              </Button>
            </div>
          </form>
          {error && <div className="text-red-600 mt-4">{error}</div>}
          {output !== null && !error && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-1">Response</div>
              <pre className="whitespace-pre-wrap text-foreground bg-muted border rounded p-3">{output}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}
