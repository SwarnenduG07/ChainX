import "./globals.css";
// import "@repo/ui/dist/index.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChainX",
  description: "No Code AUtomation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
        forcedTheme={undefined}
        >
            {children}
        </ThemeProvider>
        </body>
    </html>
  );
}
