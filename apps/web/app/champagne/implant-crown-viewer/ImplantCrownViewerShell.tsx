"use client";

import dynamic from "next/dynamic";

const ImplantCrownViewerClient = dynamic(
  () => import("./ImplantCrownViewerClient").then((m) => ({ default: m.ImplantCrownViewerClient })),
  { ssr: false },
);

type Props = {
  glbPath: string;
  fallbackJpegPath: string;
  assetId: string;
};

export function ImplantCrownViewerShell(props: Props) {
  return <ImplantCrownViewerClient {...props} />;
}
