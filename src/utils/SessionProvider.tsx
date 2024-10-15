"use client";
// DataContext.tsx
import { createContext, useContext } from "react";
import { type SessionType } from "./getSession";

// Create a context with a default value
const DataContext = createContext<SessionType | null>(null);

// Helper hook to use the context easily
export function useSession() {
  return useContext(DataContext);
}

// Export the provider to wrap around components
export function SessionProvider({
  session,
  children,
}: {
  session: SessionType;
  children: React.ReactNode;
}) {
  return (
    <DataContext.Provider value={session}>{children}</DataContext.Provider>
  );
}
