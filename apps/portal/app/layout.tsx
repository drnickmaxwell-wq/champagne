import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patient Portal – Placeholder",
  description: "Placeholder shell for the Champagne-core application: portal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Patient portal UI shell: all sensitive operations go through the engine service.
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}