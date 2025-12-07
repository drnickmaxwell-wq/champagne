import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Champagne Concierge UI – Placeholder",
  description: "Placeholder shell for the chat-ui app in the champagne-core monorepo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // NOTE: This UI-only shell for the Champagne Concierge; PHI and chat logs must be handled by the engine service.
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}