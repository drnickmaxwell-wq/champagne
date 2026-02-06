import type { ReactNode } from "react";

export const metadata = {
  title: "Champagne Stock",
  description: "Stock module stub application."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
