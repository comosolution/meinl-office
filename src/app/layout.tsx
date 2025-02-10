import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { DatesProvider } from "@mantine/dates";
import "@mantine/dates/styles.css";
import "@mantine/spotlight/styles.css";
import "dayjs/locale/de";
import type { Metadata } from "next";
import App from "./components/app";
import { OfficeProvider } from "./context/officeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEINL Office",
  description: "",
};

const theme = createTheme({
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
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <MantineProvider theme={theme}>
          <DatesProvider settings={{ locale: "de" }}>
            <OfficeProvider>
              <App>{children}</App>
            </OfficeProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
