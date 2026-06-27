import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { comments } from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery, adminQuery } from "./middleware";

export const commentRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(320),
        comment: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(comments).values({
        name: input.name,
        email: input.email,
        comment: input.comment,
        approved: 0,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(comments)
      .where(eq(comments.approved, 1))
      .orderBy(desc(comments.createdAt));
  }),

  listAll: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(comments).orderBy(desc(comments.createdAt));
  }),

  approve: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(comments)
        .set({ approved: 1 })
        .where(eq(comments.id, input.id));
      return { success: true };
    }),

  reject: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(comments).where(eq(comments.id, input.id));
      return { success: true };
    }),
});
