import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { localUsers } from "@db/schema";
import { getDb } from "./queries/connection";
import { createLocalToken, authenticateLocalRequest } from "./local-auth";
import { createRouter, publicQuery } from "./middleware";
import { TRPCError } from "@trpc/server";

export const localAuthRouter = createRouter({
  me: publicQuery.query(async ({ ctx }) => {
    const user = await authenticateLocalRequest(ctx.req.headers);
    if (!user) return null;
    return {
      id: user.id,
      name: user.displayName || user.username,
      email: user.email,
      role: user.role,
      authType: "local" as const,
    };
  }),

  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3).max(100),
        email: z.string().email().max(320),
        displayName: z.string().min(1).max(255).optional(),
        password: z.string().min(6).max(100),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // Check if username or email already exists
      const existingUsername = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username))
        .limit(1);

      if (existingUsername.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken",
        });
      }

      const existingEmail = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.email, input.email))
        .limit(1);

      if (existingEmail.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);

      const result = await db.insert(localUsers).values({
        username: input.username,
        email: input.email,
        displayName: input.displayName || input.username,
        passwordHash,
      });

      const insertedId = Number(result[0].insertId);

      const newUser = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.id, insertedId))
        .limit(1);

      const user = newUser[0];
      const token = await createLocalToken(user);

      return {
        token,
        user: {
          id: user.id,
          name: user.displayName || user.username,
          email: user.email,
          role: user.role,
          authType: "local" as const,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const users = await db
        .select()
        .from(localUsers)
        .where(eq(localUsers.username, input.username))
        .limit(1);

      const user = users[0];
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const validPassword = await bcrypt.compare(
        input.password,
        user.passwordHash
      );

      if (!validPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const token = await createLocalToken(user);

      return {
        token,
        user: {
          id: user.id,
          name: user.displayName || user.username,
          email: user.email,
          role: user.role,
          authType: "local" as const,
        },
      };
    }),
});
