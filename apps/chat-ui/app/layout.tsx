import type { Metadata } from "next";
import "./globals.css";
import "../styles/chat-preview.css";

export const metadata: Metadata = {
  title: "Champagne Concierge UI – Luxury",
  description: "Luxury concierge UI for the chat-ui app in the champagne-core monorepo.",
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
