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

// Check if we're on a static host without API (GitHub Pages)
const isStaticHost = typeof window !== "undefined" && 
  (window.location.hostname.includes("github.io") || 
   window.location.hostname === "unifiedfarmblm.com");

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: isStaticHost ? "" : "/api/trpc",
      transformer: superjson,
      headers() {
        const token = localStorage.getItem("local_auth_token");
        return token ? { "x-local-auth-token": token } : {};
      },
      fetch(input, init) {
        if (isStaticHost) {
          // Return empty tRPC response for static hosts
          return Promise.resolve(
            new Response(
              JSON.stringify([
                { result: { data: { json: null } } }
              ]),
              { status: 200, headers: { "content-type": "application/json" } }
            )
          );
        }
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        }).catch(() => 
          new Response(
            JSON.stringify([
              { result: { data: { json: null } } }
            ]),
            { status: 200, headers: { "content-type": "application/json" } }
          )
        );
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
