"use client";
import { AppShell, Box } from "@mantine/core";
import { PropsWithChildren } from "react";
import { AppHeader } from "./header";

export const BaseLayout = ({ children }: PropsWithChildren) => {
  return (
    <AppShell
      header={{ height: 80, offset: true }}
      footer={{ height: "auto", offset: false, collapsed: false }}
      // aside={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      withBorder={false}
      transitionDuration={500}
      transitionTimingFunction="ease"
    >
      <AppHeader />
      <AppShell.Main className="w-full flex items-center gap-4 flex-col bg-cyan-900">
        {children}
      </AppShell.Main>
    </AppShell>
  );
};
