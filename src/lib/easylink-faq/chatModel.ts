import { ChatXAI } from "@langchain/xai";

/**
 * xAI Grok chat model for EasyLink FAQ-grounded replies.
 * Requires `XAI_API_KEY`. Optional `XAI_MODEL` (defaults per {@link ChatXAI}).
 */
export function createEasylinkChatModel() {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing XAI_API_KEY");
  }
  return new ChatXAI({
    apiKey,
    model: process.env.XAI_MODEL ?? "grok-3",
    temperature: 0.35,
    maxTokens: 2048,
  });
}
