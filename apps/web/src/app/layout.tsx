import "./globals.css";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { MantineThemeProvider } from "./mantine";
import { ApiClientsProvider } from "./api-clients";
import { LoadingOverlayProvider } from "../lib/loading-overlay.store";

export const metadata: Metadata = {
  title: "Shooper Travel NMB",
  description: "Teste",
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <head>

      </head>
      <body className="w-full max-h-screen">
        <MantineThemeProvider>
          <LoadingOverlayProvider>
            <ApiClientsProvider>
              {children}
            </ApiClientsProvider>
          </LoadingOverlayProvider>
        </MantineThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
