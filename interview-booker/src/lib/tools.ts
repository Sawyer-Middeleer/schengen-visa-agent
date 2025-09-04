import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const fetchUrlTool = tool(
  async ({ url }) => {
    const res = await fetch(url);
    if (!res.ok) {
      return `Request failed (${res.status} ${res.statusText})`;
    }
    return await res.text();
  },
  {
    name: "fetch_url",
    description: "Fetch a URL via HTTP GET and return the response body as text.",
    schema: z.object({ url: z.string().url() }),
  }
);

export const agentTools = [fetchUrlTool];


