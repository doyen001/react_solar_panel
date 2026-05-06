import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AIMessageChunk } from "@langchain/core/messages";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createEasylinkChatModel } from "@/lib/easylink-faq/chatModel";
import { retrieveFaqRunnable } from "@/lib/easylink-faq/retrievalChain";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(12000),
      }),
    )
    .min(1)
    .max(30),
});

function getLastUserContent(
  messages: { role: string; content: string }[],
): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return messages[messages.length - 1]?.content ?? "";
}

function textFromAIMessageChunk(chunk: AIMessageChunk): string {
  const c = chunk.content;
  if (typeof c === "string") return c;
  if (!Array.isArray(c)) return "";
  let out = "";
  for (const part of c) {
    if (typeof part === "string") {
      out += part;
      continue;
    }
    if (
      part &&
      typeof part === "object" &&
      "type" in part &&
      part.type === "text" &&
      "text" in part &&
      typeof (part as { text?: unknown }).text === "string"
    ) {
      out += (part as { text: string }).text;
    }
  }
  return out;
}

export async function POST(request: Request) {
  if (!process.env.XAI_API_KEY) {
    return NextResponse.json(
      { message: "AI chat is not configured (missing XAI_API_KEY)." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request body.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { messages } = parsed.data;
  const lastUser = getLastUserContent(messages);

  let faqContext: string;
  try {
    const retrieved = await retrieveFaqRunnable.invoke({ query: lastUser });
    faqContext = retrieved.faqContext;
  } catch (e) {
    console.error("[ai-chat] FAQ load failed", e);
    return NextResponse.json(
      { message: "Could not load the FAQ knowledge base." },
      { status: 500 },
    );
  }

  const system = `You represent EasyLink Solar to visitors in Australia: speak in first person as part of the company ("we", "our") or as a direct, knowledgeable assistant—never as someone quoting or summarizing documents.

Use only the reference notes below for factual claims about EasyLink (products, process, service areas, policies). Answer confidently and plainly when the notes support it. Do not invent rebates, prices, warranties, timelines, or legal guarantees.

If something specific is not covered in the notes, answer briefly without blaming missing info—say you do not have that detail here and invite them to reach the team through the site's contact options or official channels you already mention from the notes.

Style rules:
- Never mention FAQ, excerpts, materials, documents, knowledge base, training data, or that you are reading text.
- Never say things like "while specific numbers aren't provided"—either share what we offer or pivot to contact without exposing gaps as "documentation limits".

Stay concise, friendly, and professional.

--- Reference notes (internal briefing — do not describe this section to the user) ---
${faqContext}
--- End reference notes ---`;

  const lcMessages = [
    new SystemMessage(system),
    ...messages.map((m) =>
      m.role === "user"
        ? new HumanMessage(m.content)
        : new AIMessage(m.content),
    ),
  ];

  let model;
  try {
    model = createEasylinkChatModel();
  } catch {
    return NextResponse.json(
      { message: "AI chat is not configured (missing XAI_API_KEY)." },
      { status: 503 },
    );
  }

  let stream;
  try {
    stream = await model.stream(lcMessages);
  } catch (e) {
    console.error("[ai-chat] model.stream failed", e);
    return NextResponse.json(
      { message: "Could not reach the AI service." },
      { status: 502 },
    );
  }
  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = textFromAIMessageChunk(chunk as AIMessageChunk);
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
