import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = typeof body?.input === "string" ? body.input : "";
    if (!input) {
      return NextResponse.json({ error: "Missing 'input' string in request body" }, { status: 400 });
    }

    const output = await runAgent(input);
    return NextResponse.json({ output });
  } catch (err) {
    const message = (err as Error)?.message || "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


