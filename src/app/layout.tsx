import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { DatesProvider } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "dayjs/locale/de";
import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import App from "./components/app";
import { OfficeProvider } from "./context/officeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEINL Office",
  description: "",
};

const titillium = Titillium_Web({
  weight: ["200", "400", "600", "700"],
  subsets: ["latin"],
});

const theme = createTheme({
  fontFamily: "Titillium Web",
  primaryColor: "red",
  colors: {
    red: [
      "#ffe8ec",
      "#ffd1d7",
      "#fba1ac",
      "#f66e7f",
      "#f14359",
      "#ef2840",
      "#ef1733",
      "#d50626",
      "#bf0021",
      "#a7001a",
    ],
  },
  defaultRadius: "0",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <meta name="theme-color" content="#ef233c" />
      </head>
      <body className={`${titillium.className}`}>
        <MantineProvider theme={theme}>
          <DatesProvider settings={{ locale: "de" }}>
            <OfficeProvider>
              <App>{children}</App>
              <Notifications position="top-center" />
            </OfficeProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
