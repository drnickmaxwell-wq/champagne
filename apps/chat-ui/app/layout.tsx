import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Champagne Concierge UI – Placeholder",
  description: "Placeholder shell for the Champagne-core application: chat-ui.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Concierge UI shell: PHI and chat logs must be handled by the backend engine.
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}