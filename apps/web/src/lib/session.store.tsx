"use client";
import { useApiClients, ApiClients } from "@web/src/app/api-clients";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { SessionDTO } from "./react-query";
import { useRouter } from "next/navigation";
import { BaseLayout } from "../components/base.layout";

type SessionContext = {
  session?: SessionDTO;
  authenticated: boolean;
  logout: () => Promise<void>;
  query: ReturnType<ApiClients["reactQuery"]["queries"]["useSession"]>;
  isLoading: boolean;
};

const sessionContext = createContext<SessionContext>({} as SessionContext);

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { reactQuery } = useApiClients();

  const sessionQuery = reactQuery.queries.useSession({
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const router = useRouter();
  const authenticated = useMemo(
    () => sessionQuery.isSuccess,
    [sessionQuery.isSuccess],
  );
  const isLoading = sessionQuery.isLoading;
  const logoutMutation = reactQuery.mutations.useLogout();
  const logout = async () => {
    await logoutMutation.mutateAsync({});
    await sessionQuery.refetch();
    router.push("/");
    router.refresh();
  };
  const session = useMemo(() => sessionQuery.data, [sessionQuery.data]);
  return (
    <sessionContext.Provider
      value={{
        query: sessionQuery,
        session,
        authenticated,
        logout,
        isLoading,
      }}
    >
      <BaseLayout>
        {children}
      </BaseLayout>
    </sessionContext.Provider>
  );
};

export const useSession = () => useContext(sessionContext);
