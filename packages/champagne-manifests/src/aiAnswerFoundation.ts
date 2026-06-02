import aiAnswerRegistryData from "../data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json";
import chatbotAnswerAlignmentData from "../data/seo-ai-answer-foundation/chatbot-answer-alignment.v1.smh.json";
import questionInventoryData from "../data/seo-ai-answer-foundation/question-inventory.v1.smh.json";
import treatmentFactRegistryData from "../data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json";
import voiceSearchPatternRegistryData from "../data/seo-ai-answer-foundation/voice-search-pattern-registry.v1.json";

export const AI_ANSWER_REGISTRY_VERSION = "AI_ANSWER_REGISTRY_V1" as const;
export const TREATMENT_FACT_REGISTRY_VERSION = "TREATMENT_FACT_REGISTRY_V1" as const;
export const QUESTION_INVENTORY_VERSION = "QUESTION_INVENTORY_V1" as const;
export const VOICE_SEARCH_PATTERN_REGISTRY_VERSION = "VOICE_SEARCH_PATTERN_REGISTRY_V1" as const;
export const CHATBOT_ANSWER_ALIGNMENT_VERSION = "CHATBOT_ANSWER_ALIGNMENT_V1" as const;

export type AiAnswerIntentType =
  | "informational"
  | "commercial"
  | "urgent"
  | "local"
  | "comparison"
  | "cost"
  | "anxiety";

export type AiAnswerRegistryEntry = {
  id: string;
  service: string;
  location_scope: string;
  intent_type: AiAnswerIntentType;
  question: string;
  short_answer: string;
  expanded_answer: string;
  evidence_source: string[];
  clinician_review_required: boolean;
  approved_for_ai: boolean;
  approved_for_voice: boolean;
  approved_for_chatbot: boolean;
  approved_for_schema: boolean;
};

export type AiAnswerRegistry = {
  version: typeof AI_ANSWER_REGISTRY_VERSION;
  tenantId: string;
  scope: string;
  status: string;
  governance: {
    singleSourceOfTruth: boolean;
    massContentGeneration: boolean;
    clinicalAdviceBoundary: string;
    approvedFactSources: string[];
  };
  entries: AiAnswerRegistryEntry[];
};

export type TreatmentFactRegistryEntry = {
  id: string;
  service: string;
  service_name: string;
  route_path: string;
  consultation_availability: string | null;
  treatment_category: string | null;
  treatment_location: string | null;
  clinician_types: string[] | null;
  typical_duration: string | null;
  recovery_category: string | null;
  alternatives_available: string | null;
  finance_availability: string | null;
  evidence_source: string[];
  clinical_review_required: boolean;
};

export type TreatmentFactRegistry = {
  version: typeof TREATMENT_FACT_REGISTRY_VERSION;
  tenantId: string;
  scope: string;
  status: string;
  unknownValuePolicy: string;
  entries: TreatmentFactRegistryEntry[];
};

export type QuestionInventoryEntry = {
  id: string;
  service: string;
  intent_type: AiAnswerIntentType;
  question: string;
  answer_registry_id: string | null;
  priority: "foundation_seed" | "future_build";
};

export type QuestionInventory = {
  version: typeof QUESTION_INVENTORY_VERSION;
  tenantId: string;
  scope: string;
  status: string;
  supportedIntentTypes: AiAnswerIntentType[];
  targetServices: string[];
  questions: QuestionInventoryEntry[];
};

export type VoiceSearchPattern = {
  id: string;
  pattern: string;
  intent_type: AiAnswerIntentType;
  answer_target: string;
};

export type VoiceSearchPatternRegistry = {
  version: typeof VOICE_SEARCH_PATTERN_REGISTRY_VERSION;
  scope: string;
  status: string;
  patterns: VoiceSearchPattern[];
};

export type ChatbotAnswerAlignmentMapping = {
  id: string;
  approved_fact_refs: string[];
  answer_registry_ids: string[];
  treatment_fact_ids: string[];
  drift_detection: string;
};

export type ChatbotAnswerAlignment = {
  version: typeof CHATBOT_ANSWER_ALIGNMENT_VERSION;
  tenantId: string;
  scope: string;
  status: string;
  runtimeMutation: boolean;
  mappings: ChatbotAnswerAlignmentMapping[];
};

export const aiAnswerRegistry = aiAnswerRegistryData as AiAnswerRegistry;
export const treatmentFactRegistry = treatmentFactRegistryData as TreatmentFactRegistry;
export const questionInventory = questionInventoryData as QuestionInventory;
export const voiceSearchPatternRegistry = voiceSearchPatternRegistryData as VoiceSearchPatternRegistry;
export const chatbotAnswerAlignment = chatbotAnswerAlignmentData as ChatbotAnswerAlignment;

export function getAiAnswerById(id: string) {
  return aiAnswerRegistry.entries.find((entry) => entry.id === id);
}

export function getAiAnswersForService(service: string) {
  return aiAnswerRegistry.entries.filter((entry) => entry.service === service || entry.service === "all-services");
}

export function getTreatmentFactsForService(service: string) {
  return treatmentFactRegistry.entries.filter((entry) => entry.service === service);
}

export function getQuestionsForService(service: string) {
  return questionInventory.questions.filter((entry) => entry.service === service);
}

export function getChatbotAlignmentForAnswer(answerId: string) {
  return chatbotAnswerAlignment.mappings.filter((mapping) => mapping.answer_registry_ids.includes(answerId));
}
