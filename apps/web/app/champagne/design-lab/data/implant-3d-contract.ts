export const IMPLANT_3D_CONTRACT = {
  assetId: "CD3D-IMPLANT-EDU-V1",
  status: "FROZEN_V1_PRE_EXECUTION",
  evidence: "SYNTHETIC_FIXTURE",
  states: ["NATURAL_TOOTH_CONTEXT", "MISSING_TOOTH_CONTEXT", "FIXTURE_CONCEPT", "HEALING_CONCEPT", "ABUTMENT_CONCEPT", "RESTORED_CONCEPT", "COMPONENT_EXPLODED", "BONE_CUTAWAY", "STATIC_OVERVIEW"],
  cameras: ["CAM_OVERVIEW", "CAM_NATURAL_TOOTH", "CAM_MISSING_SITE", "CAM_FIXTURE", "CAM_HEALING", "CAM_ABUTMENT", "CAM_CROWN", "CAM_EXPLODED", "CAM_BONE_CUTAWAY", "CAM_MOBILE_OVERVIEW", "CAM_STATIC_POSTER"],
  components: [
    { id: "fixture", label: "Implant fixture", explanation: "A manufactured component placed in the jaw bone. This generic model explains relationships; it cannot assess suitability." },
    { id: "abutment", label: "Abutment", explanation: "The connecting component between the implant fixture and the visible restoration." },
    { id: "crown", label: "Crown", explanation: "The visible restoration designed to replace the missing tooth above the gum." },
  ],
  disclaimer: "Synthetic educational fixture. Not patient-specific, diagnostic or a prediction of treatment outcome.",
  replacementRule: "The final GLB replaces the proxy without changing layout, controls, labels, states, accessibility or Concierge actions.",
} as const;
