import "@mantine/core/styles.css";
//
import "@mantine/charts/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "dayjs/locale/de";
import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import App from "./components/app";
import { OfficeProvider } from "./context/officeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meinl Office",
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
      "#fdedf1",
      "#f4d7de",
      "#ecaaba",
      "#e67b94",
      "#e05574",
      "#dd3e60",
      "#dd3256",
      "#c42647",
      "#af1f3e",
      "#8c1230",
    ],
    yellow: [
      "#fff4e4",
      "#f8e7d4",
      "#eccfad",
      "#e1b483",
      "#d69d5e",
      "#d08f47",
      "#ce883a",
      "#b6752b",
      "#a36723",
      "#8e5717",
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
      <body className={`${titillium.className}`}>
        <MantineProvider theme={theme}>
          <OfficeProvider>
            <App>{children}</App>
          </OfficeProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
