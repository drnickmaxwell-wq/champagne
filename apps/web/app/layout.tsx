import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";

export const metadata = {
  title: "St Mary's House Dental  Champagne Core",
  description: "Neutral skeleton for the Champagne Ecosystem marketing site.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const tokenInitScript = 
    const root = document.documentElement;
    root.style.setProperty('--brand-magenta', '#C2185B');
    root.style.setProperty('--brand-teal', '#40C4B4');
    root.style.setProperty('--brand-gold', '#D4AF37');
    root.style.setProperty('--ink', '#0B0D0F');
    root.style.setProperty('--brand-white', '#FFFFFF');
  ;

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: tokenInitScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-6 py-10">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
