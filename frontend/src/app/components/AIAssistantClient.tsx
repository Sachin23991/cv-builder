"use client";

import dynamic from "next/dynamic";

const AIAssistant = dynamic(
  () => import("components/AIAssistant").then((mod) => mod.AIAssistant),
  { ssr: false }
);

export function AIAssistantClient() {
  return <AIAssistant />;
}
