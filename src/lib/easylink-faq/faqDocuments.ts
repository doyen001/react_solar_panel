import { readFile } from "node:fs/promises";
import path from "node:path";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const FAQ_PDF = path.join(process.cwd(), "data", "easylink-solar-faq.pdf");

let cachedDocs: Document[] | null = null;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function scoreDocuments(query: string, docs: Document[]): number[] {
  const terms = tokenize(query);
  if (terms.length === 0) return docs.map(() => 0);
  return docs.map((doc) => {
    const body = doc.pageContent.toLowerCase();
    let score = 0;
    for (const term of terms) {
      let idx = 0;
      while (idx < body.length) {
        const found = body.indexOf(term, idx);
        if (found === -1) break;
        score += 1;
        idx = found + term.length;
      }
    }
    return score;
  });
}

async function loadPdfText(): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const buf = await readFile(FAQ_PDF);
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  try {
    const result = await parser.getText();
    const text = result.text?.trim() ?? "";
    if (!text.length) {
      throw new Error("FAQ PDF contained no extractable text.");
    }
    return text;
  } finally {
    await parser.destroy();
  }
}

/**
 * Loads the Easylink FAQ PDF once, splits it with LangChain, caches {@link Document} chunks.
 */
export async function getFaqDocuments(): Promise<Document[]> {
  if (cachedDocs) return cachedDocs;
  const raw = await loadPdfText();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1200,
    chunkOverlap: 150,
    separators: ["\n\n", "\n", ". ", " ", ""],
  });
  cachedDocs = await splitter.createDocuments([raw], [
    { source: "easylink-solar-faq.pdf" },
  ]);
  return cachedDocs;
}

/**
 * Retrieves the most relevant FAQ chunks for the user query (keyword overlap; no embedding API required).
 */
export async function retrieveFaqContext(
  query: string,
  options?: { maxChunks?: number; maxChars?: number },
): Promise<string> {
  const maxChunks = options?.maxChunks ?? 10;
  const maxChars = options?.maxChars ?? 14_000;

  const docs = await getFaqDocuments();
  const scores = scoreDocuments(query, docs);
  const hasSignal = scores.some((s) => s > 0);

  const ranked = hasSignal
    ? docs
        .map((doc, i) => ({ doc, score: scores[i] }))
        .sort((a, b) => b.score - a.score)
    : docs.map((doc) => ({ doc, score: 0 }));

  const picked: Document[] = [];
  let chars = 0;
  for (const item of ranked) {
    if (picked.length >= maxChunks) break;
    const nextLen = item.doc.pageContent.length;
    if (chars + nextLen > maxChars && picked.length > 0) break;
    picked.push(item.doc);
    chars += nextLen;
  }

  if (picked.length === 0 && docs[0]) {
    picked.push(docs[0]);
  }

  return picked
    .map((d, idx) => `### Excerpt ${idx + 1}\n${d.pageContent}`)
    .join("\n\n");
}
