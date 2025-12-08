export type ChatUiManifest = {
  version: number;
  panel: { bg: string; glass: string; border: string };
  accent: { color: string; ring: string };
  gradient: { css: string };
  motion: { particles: { enabled: boolean }; glassShimmer: { enabled: boolean } };
};

export async function loadChatUiManifest(): Promise<ChatUiManifest> {
  const res = await fetch("/brand/chat-ui.json", { cache: "force-cache" });
  if (!res.ok) throw new Error("chat-ui manifest missing");
  return res.json();
}
