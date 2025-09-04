import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { agentTools } from "@/lib/tools";
import fs from "fs/promises";
import path from "path";

const model = new ChatOpenAI({ model: "gpt-5-mini" }).bindTools(agentTools);

const toolNode = new ToolNode(agentTools);

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", async (state) => {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  })
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", toolsCondition)
  .addEdge("tools", "agent")
  .compile();

export async function runAgent(userInput: string): Promise<string> {
  const instructionPath = path.join(process.cwd(), "src", "prompts", "instruction.txt");
  const template = await fs.readFile(instructionPath, "utf8");
  const fullPrompt = template.replace(/\{\{\s*url\s*\}\}/gi, userInput);

  const result = await graph.invoke({ messages: [new HumanMessage(fullPrompt)] });
  const last = result.messages[result.messages.length - 1];
  const content = Array.isArray(last.content)
    ? (last.content as Array<{ text?: string }>)
        .map((p) => p.text ?? "")
        .join("\n")
    : typeof last.content === "string"
    ? last.content
    : "";
  return content;
}


