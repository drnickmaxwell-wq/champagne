import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patient Portal – Placeholder",
  description: "Placeholder shell for the portal app in the champagne-core monorepo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // NOTE: This patient UI shell; all sensitive operations must go through the engine service.
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}