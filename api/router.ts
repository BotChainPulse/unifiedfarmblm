import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { contactRouter } from "./contact-router";
import { commentRouter } from "./comment-router";
import { orderRouter } from "./order-router";
import { dashboardRouter } from "./dashboard-router";
import { chatRouter } from "./chat-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  contact: contactRouter,
  comment: commentRouter,
  order: orderRouter,
  dashboard: dashboardRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
