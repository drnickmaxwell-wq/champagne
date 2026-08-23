import type { AtelierContentSection } from "./content-bundle-adapter";

const content = (
  id: string,
  label: string,
  job: string,
  title: string,
  copy: string,
  tone: AtelierContentSection["tone"],
  extra: Partial<AtelierContentSection> = {},
): AtelierContentSection => ({
  id, label, job, title, copy, tone,
  conciergeTopic: extra.conciergeTopic ?? id,
  searchIntent: job,
  contentState: "CONTENT_BUNDLE_V1_FACT_BLOCKED",
  reviewState: "fact_review",
  ...extra,
});

export const HOME_CONTENT_BUNDLE_V1: AtelierContentSection[] = [
  content("home.hero.v2", "Welcome", "Orient the visitor, establish the practice and locality, and offer two proportionate next actions without changing the Hero V2 visual contract.", "Advanced dentistry, planned with calm precision.", "At St Mary's House, everyday care and more complex treatment begin the same way: by listening, examining carefully and explaining what the next step would involve.", "persian", {
    locked: true,
    shortCopy: "Everyday and advanced dental care, approached with careful assessment and clear explanation.",
    extendedCopy: "At St Mary's House, everyday care and more complex treatment begin the same way: by listening, examining carefully and explaining what the next step would involve. You do not need to arrive knowing which treatment you need.",
    ctas: [{ label: "Contact the practice", href: "/contact", type: "human_contact" }, { label: "Explore treatments", href: "/treatments", type: "navigation" }],
    contentMediaSlotIds: ["MEDIA.HOME.HERO.V2"],
  }),
  content("home.practice.answer", "The practice", "Directly answer what kind of practice this is without becoming a catalogue.", "One practice for the simple, the complex and everything between.", "St Mary's House Dental Care is a private dental practice in Shoreham-by-Sea. We provide everyday dental care and help people consider restorative, implant, orthodontic and aesthetic treatment when something more involved is needed.\n\nThe common thread is not a particular procedure. It is a careful process: understand the concern, gather the right information, explain realistic options and plan with long-term health and maintainability in mind.", "porcelain", {
    shortCopy: "Private dentistry in Shoreham-by-Sea, from everyday oral health to carefully planned restorative, implant, orthodontic and aesthetic care.",
    extendedCopy: "St Mary's House Dental Care is a private dental practice in Shoreham-by-Sea. We provide everyday dental care and help people consider restorative, implant, orthodontic and aesthetic treatment when something more involved is needed. Some people come with a clear goal; others know only that something feels uncomfortable, looks different or has become difficult to manage. The common thread is a careful process: understand the concern, gather the right information, explain realistic options and plan with long-term health and maintainability in mind.",
    ctas: [{ label: "About St Mary's House", href: "/about", type: "navigation" }],
    contentMediaSlotIds: ["MEDIA.HOME.PRACTICE.EXTERIOR"],
  }),
  content("home.patient.pathways", "Find your starting point", "Route visitors by need to six live canonical owners.", "You do not need to know the treatment name.", "Start with what you would like help with. Each pathway opens a fuller explanation; an assessment is still needed before anyone can recommend what is right for you.", "porcelain", {
    pathways: [
      { label: "Look after my dental health", description: "Examinations, prevention and ongoing care.", href: "/treatments/preventative-and-general-dentistry" },
      { label: "Replace a missing tooth", description: "Understand dental implants and the factors that shape a plan.", href: "/treatments/implants" },
      { label: "Improve the shape of a smile", description: "Explore composite bonding and its limits.", href: "/treatments/composite-bonding" },
      { label: "Straighten my teeth", description: "Compare orthodontic pathways and planning.", href: "/treatments/orthodontics" },
      { label: "Feel calmer about dental care", description: "See how nervous-patient visits can be approached.", href: "/treatments/nervous-patients" },
      { label: "Get help with an urgent problem", description: "Find the practice's urgent-care contact pathway.", href: "/treatments/emergency-dentistry" },
    ],
    reviewState: "search_ia_approved_draft",
  }),
  content("home.complex-care", "Complex care", "Explain when coordinated planning may be useful without promising an outcome.", "When one decision affects the next, the plan matters more.", "Dental care can become complex when several teeth are involved, the bite has changed, teeth are worn or heavily restored, or different options need to be sequenced. In those situations, treating one problem in isolation can make the wider picture harder to see.\n\nWe step back first. The assessment may consider teeth, gums, bite, appearance, existing dentistry, general health and what you want day-to-day life to feel like. From there, options can be arranged in a sensible order—including the option to pause, monitor or do less where that is appropriate.", "persian", {
    ctas: [{ label: "Read about tooth wear and broken teeth", href: "/treatments/tooth-wear-broken-teeth", type: "navigation" }],
    contentMediaSlotIds: ["MEDIA.HOME.COMPLEX.PLANNING"], reviewState: "clinical_review",
  }),
  content("home.care-process", "How care begins", "Reduce uncertainty with a four-stage assessment-led process.", "A clear route from uncertainty to a decision.", "You are not expected to decide everything at the first visit. The first task is to understand what is happening and what matters to you.", "porcelain", {
    steps: [
      { label: "Listen", copy: "Tell us what has brought you in, what worries you and what you would like to change—or preserve." },
      { label: "Assess", copy: "We examine carefully and recommend only the records or investigations that would add useful information." },
      { label: "Explain", copy: "We set out the findings, realistic options, important limitations and likely next steps in plain language." },
      { label: "Agree and review", copy: "If you choose to proceed, the plan is agreed with you and reviewed as care develops." },
    ],
  }),
  content("home.founder-authority", "Clinical leadership", "Establish accountable Founder expertise using verified credentials, separately from team continuity.", "Care shaped by considered judgement.", "Dr Nick Maxwell is the Principal Dentist at St Mary's House Dental Care. He qualified from King's College London in 1998 and holds an MSc in Restorative & Aesthetic Dentistry and a PGDip in Orthodontics & Facial Orthopaedics.\n\nHis work brings together restorative, aesthetic, orthodontic and digital planning. Those qualifications support an accountable way of thinking: understand the whole problem, respect healthy tooth tissue and make decisions that remain maintainable over time.", "persian", {
    shortCopy: "Principal Dentist Dr Nick Maxwell combines restorative, aesthetic, orthodontic and digital planning with a careful, long-term view.",
    ctas: [{ label: "Meet Dr Nick Maxwell", href: "/team/nick-maxwell", type: "profile" }],
    contentMediaSlotIds: ["MEDIA.HOME.FOUNDER.PORTRAIT"],
  }),
  content("home.team-continuity", "The team around your care", "Explain continuity without publishing a stale roster or subordinating the team to the Founder.", "Good care should feel joined up.", "At St Mary's House, planning, treatment and follow-up are intended to remain connected. The person welcoming you, the clinician assessing you and the people supporting later visits should be working from the same understanding of what matters and what has been agreed.\n\nThat continuity is especially valuable when care takes place over time. It reduces repetition, keeps questions visible and gives you a clear human point of contact when something needs explaining.", "porcelain", {
    ctas: [{ label: "Meet the team", href: "/team", type: "navigation" }],
    contentMediaSlotIds: ["MEDIA.HOME.TEAM.GROUP"],
  }),
  content("home.technology-purpose", "Technology with a purpose", "Explain the purpose of technology without device theatre or universal-use claims.", "Use technology when it makes a decision clearer.", "Digital records, scans and planning tools can make it easier to examine detail, compare options and communicate a proposed plan. They are useful when they answer a real clinical question—not simply because the equipment exists.\n\nThe right tools depend on the person and the treatment being considered. Clinical judgement still decides what information is needed, what the technology can and cannot show, and whether a simpler approach would be enough.", "luminous", {
    ctas: [{ label: "Explore 3D dentistry and technology", href: "/treatments/3d-dentistry-and-technology", type: "navigation" }],
    contentMediaSlotIds: ["MEDIA.HOME.TECH.DIGITAL_PLANNING"], reviewState: "clinical_and_fact_review",
  }),
  content("home.heritage-story", "St Mary's House", "Make place and continuity distinctive using only verified identity-level facts until a heritage ledger exists.", "A practice with a house, not a shopfront.", "St Mary's House gives the practice more than its name. It gives it a sense of place: recognisable, human in scale and rooted in Shoreham-by-Sea.\n\nThe building is part of the welcome and part of the memory of a visit. Its character suits the way care is approached here: personal, considered and attentive to detail.", "persian", {
    ctas: [{ label: "Read about the practice", href: "/about", type: "navigation" }],
    contentMediaSlotIds: ["MEDIA.HOME.HERITAGE.EXTERIOR"], reviewState: "founder_fact_review",
  }),
  content("home.proof", "Patient evidence", "Project consented cases and reviews only when evidence capabilities pass.", "", "", "porcelain", { capabilityGate: "proof", reviewState: "deferred" }),
  content("home.visit", "Visit St Mary's House", "Provide a concise L1 location projection and route full practical detail to Contact.", "In Shoreham-by-Sea, with a clear next step.", "St Mary's House Dental Care is based in Shoreham-by-Sea, West Sussex. For current contact details, opening hours and practical information for your visit, please use the Contact page or speak with the team.", "porcelain", {
    ctas: [{ label: "Contact and visit information", href: "/contact", type: "human_contact" }],
    contentMediaSlotIds: ["MEDIA.HOME.VISIT.ENTRANCE"], reviewState: "fact_blocked",
  }),
  content("home.focused-faq", "Questions about choosing the practice", "Answer practice-selection questions owned by Home without duplicating treatment FAQs.", "A few useful questions before you contact us.", "", "porcelain", {
    faqs: [
      { question: "Do I need to know which treatment I need?", answer: "No. You can begin with the problem, change or concern you would like help with. A clinician can assess what is happening and explain suitable options; the website and Concierge cannot decide that for you." },
      { question: "Do you provide routine care as well as more complex treatment?", answer: "The practice provides everyday dental care and also supports restorative, implant, orthodontic and aesthetic care. The relevant treatment page explains each pathway in more detail, and availability for a particular need should be confirmed with the practice." },
      { question: "What if I feel nervous about dental visits?", answer: "Tell the team when you make contact. The visit can begin with conversation and clear explanations, and the nervous-patient page describes the available care pathway without promising a particular treatment or level of sedation." },
      { question: "Will I have to decide on treatment at the first visit?", answer: "No. An initial visit can be used to understand the concern, examine carefully and discuss options. You can ask questions before deciding whether or how to proceed." },
      { question: "Where is the practice?", answer: "St Mary's House Dental Care is in Shoreham-by-Sea, West Sussex. The Contact page is the owner for current contact, opening-hour and arrival information." },
    ], reviewState: "clinical_and_fact_review",
  }),
  content("home.closing-invitation", "Your next step", "Offer calm, non-coercive human contact and a navigation alternative.", "Begin with a conversation, not a commitment.", "If you would like to understand a concern, plan routine care or explore something more involved, contact the practice and tell us what you would like help with. We can guide you towards the most useful next step.", "persian", {
    ctas: [{ label: "Contact the practice", href: "/contact", type: "human_contact" }, { label: "Explore treatments", href: "/treatments", type: "navigation" }],
    contentMediaSlotIds: ["MEDIA.HOME.CLOSING.ARCHITECTURAL"], reviewState: "product_review",
  }),
];

export const HOME_CONTENT_BUNDLE_META = {
  bundleId: "smh:route:/:v1",
  schemaVersion: "CHAMPAGNE_CONTENT_BUNDLE_V1",
  contentVersion: "1.0.0-draft.1",
  status: "FACT_BLOCKED",
  route: "/",
  publicationBinding: false,
  visibleSectionCount: 12,
  omittedSectionIds: ["home.proof"],
} as const;
