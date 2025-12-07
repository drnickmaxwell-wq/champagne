import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMH Dental – Web App Placeholder",
  description: "Placeholder shell for the web app in the champagne-core monorepo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // NOTE: This marketing-only shell; do not handle or store PHI here.
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}