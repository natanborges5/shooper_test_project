"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
    createContext,
    useContext,
    useMemo,
    type PropsWithChildren,
} from "react";
import { initialize } from "../lib/react-query";
import { SessionProvider } from "../lib/session.store";
import { http, reactQuery } from "../lib/clients";
export type ApiClients = {
    http: ReturnType<typeof axios.create>;
    reactQuery: ReturnType<typeof initialize>;
};

const apiClientContext = createContext({} as ApiClients);

export const ApiClientsProvider = ({ children }: PropsWithChildren) => {
    const queryClient = useMemo(() => new QueryClient(), []);
    return (
        <QueryClientProvider client={queryClient}>
            <apiClientContext.Provider
                value={useMemo(
                    () => ({
                        http,
                        reactQuery,
                    }),
                    [http, reactQuery],
                )}
            >
                <SessionProvider>
                    {children}
                </SessionProvider>
            </apiClientContext.Provider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export const useApiClients = () => useContext(apiClientContext);
