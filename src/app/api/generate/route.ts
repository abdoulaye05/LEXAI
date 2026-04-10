import { NextResponse, type NextRequest } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import {
  SYSTEM_PROMPTS,
  buildUserMessage,
  type ToolId,
} from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_TOOLS: ToolId[] = [
  "contrat",
  "analyse",
  "mise-en-demeure",
  "clause",
];

export async function POST(request: NextRequest) {
  // Auth guard
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { tool?: string; fields?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { tool, fields } = body;
  if (!tool || !VALID_TOOLS.includes(tool as ToolId)) {
    return NextResponse.json({ error: "invalid_tool" }, { status: 400 });
  }
  if (!fields || typeof fields !== "object") {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const toolId = tool as ToolId;
  const system = SYSTEM_PROMPTS[toolId];
  const userMessage = buildUserMessage(toolId, fields);

  // Stream the response as plain text chunks
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 4096,
          system,
          messages: [{ role: "user", content: userMessage }],
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "generation_error";
        controller.enqueue(
          encoder.encode(`\n\n[Erreur génération : ${message}]`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
