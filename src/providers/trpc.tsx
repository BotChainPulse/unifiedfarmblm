import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
});

// Detect if running on static hosting without API backend
export const isStaticHost =
  typeof window !== "undefined" &&
  (window.location.hostname.includes("github.io") ||
    window.location.hostname === "unifiedfarmblm.com");

// Custom error for static host mode — components can catch this
export class StaticHostError extends Error {
  constructor() {
    super("This feature requires a server backend and is not available on static hosting.");
    this.name = "StaticHostError";
  }
}

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: isStaticHost ? "/api/trpc" : "/api/trpc",
      transformer: superjson,
      headers() {
        const token = localStorage.getItem("local_auth_token");
        return token ? { "x-local-auth-token": token } : {};
      },
      async fetch(input, init) {
        // On static hosts, immediately reject so useMutation onError fires
        if (isStaticHost) {
          throw new StaticHostError();
        }
        try {
          const res = await globalThis.fetch(input, {
            ...(init ?? {}),
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res;
        } catch {
          throw new StaticHostError();
        }
      },
    }),
  ],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
