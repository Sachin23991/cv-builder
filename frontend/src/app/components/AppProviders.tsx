"use client";

import { Provider } from "react-redux";
import { makeStore, type AppStore } from "lib/redux/store";
import { useRef } from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
