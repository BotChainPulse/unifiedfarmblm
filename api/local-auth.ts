import { jwtVerify, SignJWT } from "jose";
import { eq } from "drizzle-orm";
import { localUsers } from "@db/schema";
import type { LocalUser } from "@db/schema";
import { getDb } from "./queries/connection";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "unifiedfarm-blm-local-auth-secret-key-2026"
);

export async function createLocalToken(user: LocalUser): Promise<string> {
  return new SignJWT({
    userId: user.id,
    username: user.username,
    role: user.role,
    authType: "local",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function authenticateLocalRequest(
  headers: Headers
): Promise<LocalUser | null> {
  const token =
    headers.get("x-local-auth-token") ||
    headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      clockTolerance: 60,
    });

    const userId = payload.userId as number;
    if (!userId) return null;

    const db = getDb();
    const users = await db
      .select()
      .from(localUsers)
      .where(eq(localUsers.id, userId))
      .limit(1);

    return users[0] || null;
  } catch {
    return null;
  }
}
