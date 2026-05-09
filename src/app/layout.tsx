import "./globals.css";
import { TopNavBar } from "components/TopNavBar";
import { AppProviders } from "components/AppProviders";
import { AIAssistantClient } from "components/AIAssistantClient";
import { AnalyticsLoader } from "components/AnalyticsLoader";
import { ErrorBoundary } from "components/ErrorBoundary";
import { DM_Sans, Syne, JetBrains_Mono } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "optional",
  variable: "--font-body",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "optional",
  variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "optional",
  variable: "--font-mono",
});

export const metadata = {
  title: "ResumeMaker - Free Open-source Resume Builder and Parser",
  description:
    "ResumeMaker is a free, open-source, and powerful resume builder that allows anyone to create a modern professional resume in 3 simple steps. For those who have an existing resume, ResumeMaker also provides a resume parser to help test and confirm its ATS readability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"} />
        <link rel="dns-prefetch" href="https://openrouter.ai" />
      </head>
      <body>
        <AppProviders>
          <TopNavBar />
          <ErrorBoundary label="Application crashed">
            {children}
          </ErrorBoundary>
          <AIAssistantClient />
          <AnalyticsLoader />
        </AppProviders>
      </body>
    </html>
  );
}
