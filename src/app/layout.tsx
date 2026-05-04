import "./globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import { AppProviders } from "components/AppProviders";
import { AIAssistantClient } from "components/AIAssistantClient";

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
    <html lang="en" className="scroll-smooth">
      <body>
        <AppProviders>
          <TopNavBar />
          {children}
          <AIAssistantClient />
          <Analytics />
        </AppProviders>
      </body>
    </html>
  );
}
