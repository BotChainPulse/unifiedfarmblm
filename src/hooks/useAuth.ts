import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

type UnifiedUser = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  authType: "oauth" | "local";
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: localAuthData,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !oauthUser,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const user: UnifiedUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        id: oauthUser.id,
        name: oauthUser.name || "User",
        email: oauthUser.email || "",
        avatar: oauthUser.avatar || undefined,
        role: (oauthUser.role as "user" | "admin") || "user",
        authType: "oauth" as const,
      };
    }
    if (localAuthData) {
      return {
        id: localAuthData.id,
        name: localAuthData.name || "User",
        email: localAuthData.email || "",
        role: (localAuthData.role as "user" | "admin") || "user",
        authType: "local" as const,
      };
    }
    return null;
  }, [oauthUser, localAuthData]);

  const isAdmin = user?.role === "admin";

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin,
      isLoading: oauthLoading || localLoading,
      logout,
    }),
    [user, isAdmin, oauthLoading, localLoading, logout]
  );
}
