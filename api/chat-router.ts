import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { chatMessages } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery } from "./middleware";

const FARM_SYSTEM_PROMPT = `You are the Unifiedfarm BLM Farm Assistant, a friendly and knowledgeable AI helper for a family-run poultry farm in Mpigi, Uganda.

About Unifiedfarm BLM:
- Location: Mpigi District, Central Region, Uganda
- Products: Fresh organic eggs (UGX 15,000/tray), Day-old chicks (UGX 3,500 each), Brooded chicks 1-month (UGX 8,000 each), Mature layers (UGX 35,000 each), Organic chicken manure (UGX 50,000/ton), Farm consultation
- Phone: +256 708 813 419
- Email: ryglutwa0@gmail.com
- The farm also has: ShambaNi Marketplace (shambani-market.africa), PrintDrop, a Fiverr presence, and a Farm Blog

Your role:
- Help customers with product inquiries, pricing, and ordering
- Provide basic poultry farming advice
- Answer questions about delivery and availability
- Be warm, friendly, and professional
- If asked about something outside your knowledge, suggest contacting the farm directly at +256 708 813 419

Keep responses concise (2-3 sentences max) and warm. Use a conversational tone.`;

export const chatRouter = createRouter({
  send: publicQuery
    .input(
      z.object({
        sessionId: z.string().min(1),
        message: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Save user message
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "user",
        content: input.message,
      });

      // Get chat history for context
      const history = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(10);

      const messages = history.reverse().map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Call AI API
      let reply = "";
      try {
        const apiKey = process.env.OPENAI_API_KEY || "";
        const apiUrl =
          process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

        if (!apiKey) {
          reply =
            "Hello! I'm the farm assistant. For detailed help, please contact us directly at +256 708 813 419 or email ryglutwa0@gmail.com.";
        } else {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: FARM_SYSTEM_PROMPT },
                ...messages.map((m) => ({
                  role: m.role as string,
                  content: m.content,
                })),
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          });

          if (response.ok) {
            const data = (await response.json()) as {
              choices?: Array<{ message?: { content?: string } }>;
            };
            reply =
              data.choices?.[0]?.message?.content ||
              "I'm sorry, I didn't understand that. Could you please rephrase?";
          } else {
            reply =
              "Thanks for your message! Our team will get back to you. For urgent inquiries, please WhatsApp us at +256 708 813 419.";
          }
        }
      } catch {
        reply =
          "Thanks for reaching out! For immediate assistance, please call or WhatsApp +256 708 813 419.";
      }

      // Save assistant message
      await db.insert(chatMessages).values({
        sessionId: input.sessionId,
        role: "assistant",
        content: reply,
      });

      return { reply };
    }),

  history: publicQuery
    .input(z.object({ sessionId: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.sessionId))
        .orderBy(chatMessages.createdAt);
    }),
});
