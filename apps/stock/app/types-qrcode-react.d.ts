declare module "qrcode.react" {
  import type { ComponentType } from "react";

  type QRCodeProps = {
    id?: string;
    value: string;
    size?: number;
    level?: "L" | "M" | "Q" | "H";
    includeMargin?: boolean;
  };

  export const QRCodeCanvas: ComponentType<QRCodeProps>;
}
