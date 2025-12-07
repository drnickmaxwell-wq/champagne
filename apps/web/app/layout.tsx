import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMH Dental – Web App Placeholder",
  description: "Placeholder shell for the Champagne-core application: web.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Marketing-only shell: do not store PHI or clinical data here.
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}