type GenerateRawConciergeReplyArgs = {
  text: string;
};

export function generateRawConciergeReply({ text }: GenerateRawConciergeReplyArgs): string {
  const normalized = text.toLowerCase();

  if (/cost|price|fee|payment/.test(normalized)) {
    return [
      "Cost is determined after a focused clinical assessment.",
      "Most plans are quoted in ranges first, then narrowed once treatment scope is confirmed.",
      "Fees may vary with treatment complexity, material selection, and the number of sessions required.",
      "We can review financing paths after the clinical plan is finalized.",
    ].join(" ");
  }

  if (/process|step|timeline|recovery/.test(normalized)) {
    return [
      "The process follows a clear sequence from assessment to completion.",
      "We start with history and exam findings, then confirm candidacy and treatment design.",
      "Appointments are scheduled by clinical priority, with checkpoints for healing and response.",
      "Timeline may vary based on procedural depth and individual recovery speed.",
    ].join(" ");
  }

  if (/fear|anx|nervous|scared|pain/.test(normalized)) {
    return [
      "Anxiety around treatment is common and manageable.",
      "Comfort planning is built into the visit, including pacing, explanation, and anesthesia options where appropriate.",
      "The exact comfort strategy can vary based on prior experiences and sensitivity.",
      "We can define a stepwise plan before any treatment begins.",
    ].join(" ");
  }

  return [
    "Your question can be answered with a focused clinical plan.",
    "We align recommendations to findings, health history, and practical goals.",
    "If helpful, I can break this into options with expected timelines and tradeoffs.",
  ].join(" ");
}
