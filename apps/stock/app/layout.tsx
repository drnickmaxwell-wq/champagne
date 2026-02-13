import type { ReactNode } from "react";
import "./styles/stock-ui.css";
import TenantBanner from "./components/ui/TenantBanner";

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
        <main><TenantBanner />{children}</main>
      </body>
    </html>
  );
}
