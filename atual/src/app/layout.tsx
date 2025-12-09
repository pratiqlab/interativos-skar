import "./globals.css";
import 'katex/dist/katex.min.css';

import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SidebarLayout } from "@/components/custom/ui/NewNav/sidebar-layout";

const fontLogo = localFont({
  src: "../../public/fonts/UlmGroteskExtrabold.ttf",
  variable: "--font-logo"
});

export const metadata: Metadata = {
  title: "Template Interativos - Pratiqlab",
  description: "Template para criar exercícios interativos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${fontLogo.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarLayout>
            <div className="md:rounded-t-xl overflow-hidden">
              {children}
            </div>
          </SidebarLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
