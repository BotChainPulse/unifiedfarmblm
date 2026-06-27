import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User, LocalUser } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { authenticateLocalRequest } from "./local-auth";

export type UnifiedUser = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  authType: "oauth" | "local";
};

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: UnifiedUser;
};

function unifyOAuthUser(user: User): UnifiedUser {
  return {
    id: user.id,
    name: user.name || "User",
    email: user.email || "",
    avatar: user.avatar || undefined,
    role: (user.role as "user" | "admin") || "user",
    authType: "oauth",
  };
}

function unifyLocalUser(user: LocalUser): UnifiedUser {
  return {
    id: user.id,
    name: user.displayName || user.username,
    email: user.email,
    role: (user.role as "user" | "admin") || "user",
    authType: "local",
  };
}

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first
  try {
    const oauthUser = await authenticateRequest(opts.req.headers);
    if (oauthUser) {
      ctx.user = unifyOAuthUser(oauthUser);
      return ctx;
    }
  } catch {
    // OAuth auth failed, try local
  }

  // Try local auth
  try {
    const localUser = await authenticateLocalRequest(opts.req.headers);
    if (localUser) {
      ctx.user = unifyLocalUser(localUser);
    }
  } catch {
    // Local auth also failed, user remains undefined (anonymous)
  }

  return ctx;
}
