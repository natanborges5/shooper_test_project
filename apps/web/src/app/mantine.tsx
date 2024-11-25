"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { PropsWithChildren } from "react";

export const MantineThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <MantineProvider
      defaultColorScheme="light"
      theme={createTheme({
        primaryColor: "gray",
        fontFamily: "Work Sans, sans-serif",
        headings: { fontFamily: "Work Sans, sans-serif" },
        colors: {
          black: [
            "#000",
            "#000",
            "#000",
            "#000",
            "#000",
            "#000",
            "#000",
            "#000",
            "#000",
            "#000",
          ],
          gray: [
            "#F8F9FA",
            "#F1F3F5",
            "#E0E0E0",
            "#DEE2E6",
            "#CED4DA",
            "#ADB5BD",
            "#868E96",
            "#495057",
            "#343A40",
            "#212529",
          ],
        },
        defaultRadius: "lg",
        breakpoints: {
          xs: "22em",
          sm: "36em",
          md: "60em",
          lg: "70em",
          xl: "120em",
        },
        components: {
          Text: {
            defaultProps: {
              color: "white", // Define branco como padrão para o componente `Text`
            },
          },
        },
      })}
    >
      <DatesProvider
        settings={{
          locale: "pt",
          timezone: "America/Sao_Paulo",
        }}
      >
        <Notifications
          position="top-right"
          zIndex={2000}
          limit={1}
          autoClose={3000}
        />
        {children}
      </DatesProvider>
    </MantineProvider>
  );
};
