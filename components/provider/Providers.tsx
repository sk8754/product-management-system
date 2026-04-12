"use client";

import { SessionProvider } from "next-auth/react";

// NextAuthのproviderを使用してセッションを管理するためのコンポーネント
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
