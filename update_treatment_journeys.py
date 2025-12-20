import copy
import json
from pathlib import Path


def link(label: str, slug: str) -> dict:
    return {"label": label, "href": f"/treatments/{slug}"}


def contact(label: str) -> dict:
    return {"label": label, "href": "/contact"}


templates = {
    "aligner": {
        "journeys": {
            "upstream_referrers": [
                link("Routine check-ups and hygiene", "preventative-and-general-dentistry"),
                link("Orthodontic overview", "orthodontics"),
                link("Digital smile planning", "digital-smile-design"),
            ],
            "downstream_next_steps": [
                link("Retainer fitting after alignment", "dental-retainers"),
                link("Mouthguards to protect new alignment", "mouthguards-and-retainers"),
                link("Finishing with teeth whitening", "teeth-whitening"),
            ],
            "supportive_links": [
                link("Managing jaw comfort", "tmj-jaw-comfort"),
                link("Care for nervous patients", "nervous-patients"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book an aligner assessment"),
            "secondary_intent": link("Compare with fixed braces", "fixed-braces"),
            "reassurance_intent": link("See how retainers hold results", "dental-retainers"),
        },
    },
    "orthodontic": {
        "journeys": {
            "upstream_referrers": [
                link("Routine check-ups", "preventative-and-general-dentistry"),
                link("Children's dental reviews", "childrens-dentistry"),
                link("Smile design consult", "digital-smile-design"),
            ],
            "downstream_next_steps": [
                link("Retainer fitting", "dental-retainers"),
                link("Mouthguards during treatment", "mouthguards-and-retainers"),
                link("Post-straightening whitening", "teeth-whitening"),
            ],
            "supportive_links": [
                link("Alternatives with aligners", "aligners"),
                link("Sports mouthguard advice", "sports-mouthguards"),
                link("Support for nervous patients", "nervous-patients"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange an orthodontic consultation"),
            "secondary_intent": link("Review aligner options", "aligners"),
            "reassurance_intent": link("Understand retainer care", "dental-retainers"),
        },
    },
    "retainer": {
        "journeys": {
            "upstream_referrers": [
                link("Orthodontic treatment", "orthodontics"),
                link("Aligner therapy", "aligners"),
                link("Fixed brace care", "fixed-braces"),
            ],
            "downstream_next_steps": [
                link("Night guards for clenching", "night-guards-occlusal-splints"),
                link("Sports mouthguards", "sports-mouthguards"),
                link("Ongoing check-ups", "preventative-and-general-dentistry"),
            ],
            "supportive_links": [
                link("Protecting results", "mouthguards-and-retainers"),
                link("Whitening after alignment", "teeth-whitening"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Schedule a retainer review"),
            "secondary_intent": link("Discuss night guard options", "night-guards-occlusal-splints"),
            "reassurance_intent": link("Check retainer care guidance", "mouthguards-and-retainers"),
        },
    },
    "mouthguard": {
        "journeys": {
            "upstream_referrers": [
                link("Children's dentistry", "childrens-dentistry"),
                link("Orthodontic reviews", "orthodontics"),
                link("Fixed braces", "fixed-braces"),
            ],
            "downstream_next_steps": [
                link("Combined retainers and guards", "mouthguards-and-retainers"),
                link("Night guards for grinding", "night-guards-occlusal-splints"),
                link("Routine hygiene checks", "preventative-and-general-dentistry"),
            ],
            "supportive_links": [
                link("Support for jaw comfort", "tmj-jaw-comfort"),
                link("Nervous patient support", "nervous-patients"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange a sports mouthguard fitting"),
            "secondary_intent": link("Plan retainer protection", "dental-retainers"),
            "reassurance_intent": link("Read about guard care", "mouthguards-and-retainers"),
        },
    },
    "bruxism": {
        "journeys": {
            "upstream_referrers": [
                link("Routine examinations", "preventative-and-general-dentistry"),
                link("Gum and bite assessments", "periodontal-gum-care"),
            ],
            "downstream_next_steps": [
                link("Night guards and splints", "night-guards-occlusal-splints"),
                link("TMJ treatment pathways", "tmj-disorder-treatment"),
                link("Repairing tooth wear", "inlays-onlays"),
            ],
            "supportive_links": [
                link("Facial pain support", "facial-pain-and-headache"),
                link("Bite comfort guidance", "tmj-jaw-comfort"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a clenching and grinding review"),
            "secondary_intent": link("Explore TMJ treatment", "tmj-disorder-treatment"),
            "reassurance_intent": link("Learn about night guards", "night-guards-occlusal-splints"),
        },
    },
    "night_guard": {
        "journeys": {
            "upstream_referrers": [
                link("Bruxism assessment", "bruxism-and-jaw-clenching"),
                link("Jaw comfort reviews", "tmj-jaw-comfort"),
            ],
            "downstream_next_steps": [
                link("TMJ specialist care", "tmj-disorder-treatment"),
                link("Restoring worn teeth", "inlays-onlays"),
                link("Routine maintenance", "preventative-and-general-dentistry"),
            ],
            "supportive_links": [
                link("Relieving facial pain", "facial-pain-and-headache"),
                link("Retainer adjustments", "dental-retainers"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book an occlusal splint fitting"),
            "secondary_intent": link("Discuss TMJ therapy", "tmj-disorder-treatment"),
            "reassurance_intent": link("Read about comfort reviews", "tmj-jaw-comfort"),
        },
    },
    "tmj": {
        "journeys": {
            "upstream_referrers": [
                link("Facial pain investigations", "facial-pain-and-headache"),
                link("Grinding and clenching review", "bruxism-and-jaw-clenching"),
            ],
            "downstream_next_steps": [
                link("Occlusal splints", "night-guards-occlusal-splints"),
                link("Bite balancing orthodontics", "orthodontics"),
                link("Restoring worn teeth", "veneers"),
            ],
            "supportive_links": [
                link("Jaw comfort strategies", "tmj-jaw-comfort"),
                link("Support for anxious patients", "nervous-patients"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange a TMJ consultation"),
            "secondary_intent": link("Plan a splint fitting", "night-guards-occlusal-splints"),
            "reassurance_intent": link("Learn about jaw comfort care", "tmj-jaw-comfort"),
        },
    },
    "tmj_comfort": {
        "journeys": {
            "upstream_referrers": [
                link("Routine exams", "preventative-and-general-dentistry"),
                link("Grinding assessments", "bruxism-and-jaw-clenching"),
            ],
            "downstream_next_steps": [
                link("Occlusal splints", "night-guards-occlusal-splints"),
                link("TMJ disorder treatment", "tmj-disorder-treatment"),
                link("Orthodontic bite correction", "orthodontics"),
            ],
            "supportive_links": [
                link("Facial pain management", "facial-pain-and-headache"),
                link("Nervous patient pathway", "nervous-patients"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a jaw comfort review"),
            "secondary_intent": link("Explore TMJ therapy", "tmj-disorder-treatment"),
            "reassurance_intent": link("Understand splint options", "night-guards-occlusal-splints"),
        },
    },
    "facial_pain": {
        "journeys": {
            "upstream_referrers": [
                link("Routine dental review", "preventative-and-general-dentistry"),
                link("Clenching and grinding checks", "bruxism-and-jaw-clenching"),
            ],
            "downstream_next_steps": [
                link("TMJ disorder treatment", "tmj-disorder-treatment"),
                link("Occlusal splints", "night-guards-occlusal-splints"),
                link("Jaw comfort exercises", "tmj-jaw-comfort"),
            ],
            "supportive_links": [
                link("Sedation support", "sedation-dentistry"),
                link("Periodontal stability", "periodontal-gum-care"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange a facial pain consultation"),
            "secondary_intent": link("Plan TMJ support", "tmj-disorder-treatment"),
            "reassurance_intent": link("Read about splint therapy", "night-guards-occlusal-splints"),
        },
    },
    "preventative": {
        "journeys": {
            "upstream_referrers": [
                link("Treatment hub", "hub-directory"),
                link("Nervous patient pathway", "nervous-patients"),
            ],
            "downstream_next_steps": [
                link("Gum care", "periodontal-gum-care"),
                link("Orthodontic review", "orthodontics"),
                link("Teeth whitening", "teeth-whitening"),
            ],
            "supportive_links": [
                link("Senior smile care", "senior-mature-smile-care"),
                link("Children's dentistry", "childrens-dentistry"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a check-up"),
            "secondary_intent": link("Plan gum care", "periodontal-gum-care"),
            "reassurance_intent": link("Support for anxious visitors", "nervous-patients"),
        },
    },
    "childrens": {
        "journeys": {
            "upstream_referrers": [
                link("Family check-ups", "preventative-and-general-dentistry"),
                link("Treatment hub", "hub-directory"),
            ],
            "downstream_next_steps": [
                link("Orthodontic monitoring", "orthodontics"),
                link("Sports mouthguards", "sports-mouthguards"),
                link("Painless numbing support", "painless-numbing-the-wand"),
            ],
            "supportive_links": [
                link("Nervous patient care", "nervous-patients"),
                link("Preventive guidance", "preventative-and-general-dentistry"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange a children's check-up"),
            "secondary_intent": link("Plan orthodontic reviews", "orthodontics"),
            "reassurance_intent": link("Learn about painless numbing", "painless-numbing-the-wand"),
        },
    },
    "senior": {
        "journeys": {
            "upstream_referrers": [
                link("Routine dentistry", "preventative-and-general-dentistry"),
                link("Gum care", "periodontal-gum-care"),
            ],
            "downstream_next_steps": [
                link("Dentures and replacement teeth", "dentures"),
                link("Implant consultation", "implants-consultation"),
                link("Gum stability reviews", "periodontal-gum-care"),
            ],
            "supportive_links": [
                link("Aftercare and hygiene", "implants-aftercare"),
                link("Sedation support", "sedation-dentistry"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a mature smile review"),
            "secondary_intent": link("Discuss implant options", "implants-consultation"),
            "reassurance_intent": link("Explore denture pathways", "dentures"),
        },
    },
    "periodontal": {
        "journeys": {
            "upstream_referrers": [
                link("Routine check-ups", "preventative-and-general-dentistry"),
                link("Senior smile care", "senior-mature-smile-care"),
            ],
            "downstream_next_steps": [
                link("Implant suitability", "implants-consultation"),
                link("Oral surgery and extractions", "extractions-and-oral-surgery"),
                link("Maintenance hygiene", "implants-aftercare"),
            ],
            "supportive_links": [
                link("Sedation for deep cleaning", "sedation-dentistry"),
                link("Routine prevention", "preventative-and-general-dentistry"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a gum health review"),
            "secondary_intent": link("Plan implant assessments", "implants-consultation"),
            "reassurance_intent": link("Learn about maintenance care", "preventative-and-general-dentistry"),
        },
    },
    "nervous": {
        "journeys": {
            "upstream_referrers": [
                link("Routine examinations", "preventative-and-general-dentistry"),
                link("Treatment hub", "hub-directory"),
            ],
            "downstream_next_steps": [
                link("Sedation dentistry", "sedation-dentistry"),
                link("Comfort-first numbing", "painless-numbing-the-wand"),
                link("Implant sedation pathways", "implants-sedation"),
            ],
            "supportive_links": [
                link("Orthodontic care at your pace", "orthodontics"),
                link("Gentle gum care", "periodontal-gum-care"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Speak to us about dental anxiety"),
            "secondary_intent": link("Explore sedation options", "sedation-dentistry"),
            "reassurance_intent": link("Learn about gentle numbing", "painless-numbing-the-wand"),
        },
    },
    "sedation": {
        "journeys": {
            "upstream_referrers": [
                link("Nervous patient care", "nervous-patients"),
                link("Oral surgery planning", "extractions-and-oral-surgery"),
            ],
            "downstream_next_steps": [
                link("Implant treatments with sedation", "implants-sedation"),
                link("Teeth in a day pathways", "implants-teeth-in-a-day"),
                link("Gum therapy support", "periodontal-gum-care"),
            ],
            "supportive_links": [
                link("Comfort-first numbing", "painless-numbing-the-wand"),
                link("Aftercare planning", "implants-aftercare"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Discuss sedation dentistry"),
            "secondary_intent": link("Plan oral surgery", "extractions-and-oral-surgery"),
            "reassurance_intent": link("Understand implant sedation", "implants-sedation"),
        },
    },
    "painless": {
        "journeys": {
            "upstream_referrers": [
                link("Nervous patient pathway", "nervous-patients"),
                link("Routine dental visits", "preventative-and-general-dentistry"),
            ],
            "downstream_next_steps": [
                link("Sedation dentistry", "sedation-dentistry"),
                link("Gum treatment support", "periodontal-gum-care"),
                link("Oral surgery", "extractions-and-oral-surgery"),
            ],
            "supportive_links": [
                link("Gentle orthodontic care", "orthodontics"),
                link("Comfort during implants", "implants-sedation"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Talk about comfortable anaesthesia"),
            "secondary_intent": link("Explore sedation support", "sedation-dentistry"),
            "reassurance_intent": link("Read about anxiety care", "nervous-patients"),
        },
    },
    "extractions": {
        "journeys": {
            "upstream_referrers": [
                link("Gum health concerns", "periodontal-gum-care"),
                link("Routine examinations", "preventative-and-general-dentistry"),
            ],
            "downstream_next_steps": [
                link("Implant consultation", "implants-consultation"),
                link("Denture solutions", "dentures"),
                link("Bone grafting for implants", "implants-bone-grafting"),
            ],
            "supportive_links": [
                link("Sedation support", "sedation-dentistry"),
                link("Comfort-first numbing", "painless-numbing-the-wand"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book an oral surgery appointment"),
            "secondary_intent": link("Plan implant replacement", "implants-consultation"),
            "reassurance_intent": link("Review sedation options", "sedation-dentistry"),
        },
    },
    "crown": {
        "journeys": {
            "upstream_referrers": [
                link("Root canal therapy", "endodontics-root-canal"),
                link("Tooth wear repairs", "inlays-onlays"),
            ],
            "downstream_next_steps": [
                link("Routine maintenance", "preventative-and-general-dentistry"),
                link("Whitening after restoration", "teeth-whitening"),
                link("Night guards for protection", "night-guards-occlusal-splints"),
            ],
            "supportive_links": [
                link("Gum stability", "periodontal-gum-care"),
                link("Smile design planning", "digital-smile-design"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Plan a crown restoration"),
            "secondary_intent": link("Consider inlays or onlays", "inlays-onlays"),
            "reassurance_intent": link("Understand post-root-canal care", "endodontics-root-canal"),
        },
    },
    "bridge": {
        "journeys": {
            "upstream_referrers": [
                link("Oral surgery and extractions", "extractions-and-oral-surgery"),
                link("Implant consultation", "implants-consultation"),
            ],
            "downstream_next_steps": [
                link("Crown restoration", "dental-crowns"),
                link("Implant replacement options", "implants"),
                link("Hygiene maintenance", "preventative-and-general-dentistry"),
            ],
            "supportive_links": [
                link("Sedation and comfort", "sedation-dentistry"),
                link("Gum health support", "periodontal-gum-care"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Discuss bridge planning"),
            "secondary_intent": link("Review implant alternatives", "implants-consultation"),
            "reassurance_intent": link("Plan aftercare and hygiene", "preventative-and-general-dentistry"),
        },
    },
    "inlay": {
        "journeys": {
            "upstream_referrers": [
                link("Routine check-ups", "preventative-and-general-dentistry"),
                link("Bite and wear review", "bruxism-and-jaw-clenching"),
            ],
            "downstream_next_steps": [
                link("Crown restoration if needed", "dental-crowns"),
                link("Occlusal splint for protection", "night-guards-occlusal-splints"),
                link("Smile refinement", "veneers"),
            ],
            "supportive_links": [
                link("Gum health support", "periodontal-gum-care"),
                link("Digital smile planning", "digital-smile-design"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book an inlay/onlay consultation"),
            "secondary_intent": link("Protect repairs with a splint", "night-guards-occlusal-splints"),
            "reassurance_intent": link("Plan ongoing care", "preventative-and-general-dentistry"),
        },
    },
    "veneer": {
        "journeys": {
            "upstream_referrers": [
                link("Smile design planning", "digital-smile-design"),
                link("Orthodontic alignment", "orthodontics"),
            ],
            "downstream_next_steps": [
                link("Protect with night guards", "night-guards-occlusal-splints"),
                link("Finishing whitening", "whitening-top-ups"),
                link("Regular reviews", "preventative-and-general-dentistry"),
            ],
            "supportive_links": [
                link("Aligner refinements", "aligners"),
                link("Gum contouring and care", "periodontal-gum-care"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange a veneer consultation"),
            "secondary_intent": link("Explore digital smile previews", "digital-smile-design"),
            "reassurance_intent": link("Learn about protecting veneers", "night-guards-occlusal-splints"),
        },
    },
    "digital_smile": {
        "journeys": {
            "upstream_referrers": [
                link("Routine dental care", "preventative-and-general-dentistry"),
                link("Bite and wear concerns", "bruxism-and-jaw-clenching"),
            ],
            "downstream_next_steps": [
                link("Veneer planning", "veneers"),
                link("Orthodontic alignment", "orthodontics"),
                link("Crown and bridge design", "dental-crowns"),
            ],
            "supportive_links": [
                link("Digital dentistry and scanning", "3d-digital-dentistry"),
                link("Teeth whitening", "teeth-whitening"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a smile design consultation"),
            "secondary_intent": link("Review veneer options", "veneers"),
            "reassurance_intent": link("Understand orthodontic staging", "orthodontics"),
        },
    },
    "whitening": {
        "journeys": {
            "upstream_referrers": [
                link("Routine hygiene", "preventative-and-general-dentistry"),
                link("Aligner or brace completion", "orthodontics"),
            ],
            "downstream_next_steps": [
                link("Home whitening plans", "home-teeth-whitening"),
                link("Whitening top-ups", "whitening-top-ups"),
                link("Managing sensitivity", "whitening-sensitive-teeth"),
            ],
            "supportive_links": [
                link("Whitening FAQs", "teeth-whitening-faqs"),
                link("Smile makeovers", "digital-smile-design"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Plan a whitening assessment"),
            "secondary_intent": link("Start home whitening", "home-teeth-whitening"),
            "reassurance_intent": link("Read whitening FAQs", "teeth-whitening-faqs"),
        },
    },
    "home_whitening": {
        "journeys": {
            "upstream_referrers": [
                link("Routine dental check", "preventative-and-general-dentistry"),
                link("In-practice whitening discussions", "teeth-whitening"),
            ],
            "downstream_next_steps": [
                link("Whitening top-ups", "whitening-top-ups"),
                link("Sensitivity management", "whitening-sensitive-teeth"),
                link("Smile design", "digital-smile-design"),
            ],
            "supportive_links": [
                link("Whitening FAQs", "teeth-whitening-faqs"),
                link("Post-aligner finishing", "aligners"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Order home whitening trays"),
            "secondary_intent": link("Arrange in-surgery whitening", "teeth-whitening"),
            "reassurance_intent": link("Read sensitivity advice", "whitening-sensitive-teeth"),
        },
    },
    "whitening_topup": {
        "journeys": {
            "upstream_referrers": [
                link("In-practice whitening", "teeth-whitening"),
                link("Home whitening plans", "home-teeth-whitening"),
            ],
            "downstream_next_steps": [
                link("Routine hygiene and reviews", "preventative-and-general-dentistry"),
                link("Managing sensitivity", "whitening-sensitive-teeth"),
            ],
            "supportive_links": [
                link("Whitening FAQs", "teeth-whitening-faqs"),
                link("Smile design updates", "digital-smile-design"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Request whitening top-ups"),
            "secondary_intent": link("Book a review clean", "preventative-and-general-dentistry"),
            "reassurance_intent": link("Read sensitivity support", "whitening-sensitive-teeth"),
        },
    },
    "whitening_sensitive": {
        "journeys": {
            "upstream_referrers": [
                link("Whitening treatment", "teeth-whitening"),
                link("Routine dental care", "preventative-and-general-dentistry"),
            ],
            "downstream_next_steps": [
                link("Whitening top-ups", "whitening-top-ups"),
                link("Gum and tooth health review", "periodontal-gum-care"),
            ],
            "supportive_links": [
                link("Whitening FAQs", "teeth-whitening-faqs"),
                link("Home whitening guidance", "home-teeth-whitening"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Discuss whitening sensitivity"),
            "secondary_intent": link("Arrange a gum health check", "periodontal-gum-care"),
            "reassurance_intent": link("Review whitening advice", "teeth-whitening-faqs"),
        },
    },
    "whitening_faq": {
        "journeys": {
            "upstream_referrers": [
                link("Whitening planning", "teeth-whitening"),
                link("Home whitening", "home-teeth-whitening"),
            ],
            "downstream_next_steps": [
                link("Book whitening", "teeth-whitening"),
                link("Top-up arrangements", "whitening-top-ups"),
            ],
            "supportive_links": [
                link("Managing sensitivity", "whitening-sensitive-teeth"),
                link("Routine dental care", "preventative-and-general-dentistry"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Ask a whitening question"),
            "secondary_intent": link("Plan a whitening visit", "teeth-whitening"),
            "reassurance_intent": link("Review home whitening steps", "home-teeth-whitening"),
        },
    },
    "dentures": {
        "journeys": {
            "upstream_referrers": [
                link("Extractions and oral surgery", "extractions-and-oral-surgery"),
                link("Gum health management", "periodontal-gum-care"),
            ],
            "downstream_next_steps": [
                link("Implant-retained dentures", "implants-retained-dentures"),
                link("Implant consultation", "implants-consultation"),
                link("Aftercare and hygiene", "implants-aftercare"),
            ],
            "supportive_links": [
                link("Senior smile care", "senior-mature-smile-care"),
                link("Comfort sedation", "sedation-dentistry"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange a denture consultation"),
            "secondary_intent": link("Explore implant-retained options", "implants-retained-dentures"),
            "reassurance_intent": link("Plan hygiene reviews", "preventative-and-general-dentistry"),
        },
    },
    "implant_consult": {
        "journeys": {
            "upstream_referrers": [
                link("General and hygiene review", "preventative-and-general-dentistry"),
                link("Gum stabilisation", "periodontal-gum-care"),
                link("After extractions", "extractions-and-oral-surgery"),
            ],
            "downstream_next_steps": [
                link("CBCT and 3D planning", "cbct-3d-scanning"),
                link("Single tooth implants", "implants-single-tooth"),
                link("Multiple tooth implants", "implants-multiple-teeth"),
            ],
            "supportive_links": [
                link("Sedation options", "sedation-dentistry"),
                link("Comfort-focused implant care", "implants-sedation"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book an implant consultation"),
            "secondary_intent": link("Plan digital scans", "cbct-3d-scanning"),
            "reassurance_intent": link("Read about aftercare", "implants-aftercare"),
        },
    },
    "implant_core": {
        "journeys": {
            "upstream_referrers": [
                link("Extraction or failed tooth", "extractions-and-oral-surgery"),
                link("Gum health checks", "periodontal-gum-care"),
                link("Digital planning", "3d-digital-dentistry"),
            ],
            "downstream_next_steps": [
                link("CBCT planning", "cbct-3d-scanning"),
                link("Implant consultation", "implants-consultation"),
                link("Implant restorations", "3d-implant-restorations"),
            ],
            "supportive_links": [
                link("Sedation pathways", "implants-sedation"),
                link("Aftercare and hygiene", "implants-aftercare"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange an implant assessment"),
            "secondary_intent": link("Review digital planning", "cbct-3d-scanning"),
            "reassurance_intent": link("Understand aftercare", "implants-aftercare"),
        },
    },
    "implant_surgery": {
        "journeys": {
            "upstream_referrers": [
                link("Implant consultation", "implants-consultation"),
                link("CBCT 3D scanning", "cbct-3d-scanning"),
            ],
            "downstream_next_steps": [
                link("Implant restorations", "3d-implant-restorations"),
                link("Hygiene and aftercare", "implants-aftercare"),
                link("Retained denture options", "implants-retained-dentures"),
            ],
            "supportive_links": [
                link("Bone grafting", "implants-bone-grafting"),
                link("Sedation support", "implants-sedation"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Plan implant placement"),
            "secondary_intent": link("Confirm digital planning", "cbct-3d-scanning"),
            "reassurance_intent": link("Review aftercare steps", "implants-aftercare"),
        },
    },
    "implant_support": {
        "journeys": {
            "upstream_referrers": [
                link("Implant consultation", "implants-consultation"),
                link("3D scans", "cbct-3d-scanning"),
            ],
            "downstream_next_steps": [
                link("Implant placement", "implants"),
                link("Teeth in a day", "implants-teeth-in-a-day"),
                link("Implant restorations", "3d-implant-restorations"),
            ],
            "supportive_links": [
                link("Sedation dentistry", "sedation-dentistry"),
                link("Aftercare and hygiene", "implants-aftercare"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Discuss grafting and support procedures"),
            "secondary_intent": link("Plan implant timelines", "implants"),
            "reassurance_intent": link("Review sedation availability", "implants-sedation"),
        },
    },
    "implant_aftercare": {
        "journeys": {
            "upstream_referrers": [
                link("Implant placement", "implants"),
                link("Teeth in a day care", "implants-teeth-in-a-day"),
            ],
            "downstream_next_steps": [
                link("Gum maintenance", "periodontal-gum-care"),
                link("Night guard protection", "night-guards-occlusal-splints"),
                link("Implant restorations", "3d-implant-restorations"),
            ],
            "supportive_links": [
                link("Sedation for reviews", "implants-sedation"),
                link("Routine check-ups", "preventative-and-general-dentistry"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book an implant aftercare visit"),
            "secondary_intent": link("Plan hygiene support", "periodontal-gum-care"),
            "reassurance_intent": link("Review protection splints", "night-guards-occlusal-splints"),
        },
    },
    "implant_sedation": {
        "journeys": {
            "upstream_referrers": [
                link("Sedation dentistry", "sedation-dentistry"),
                link("Nervous patient care", "nervous-patients"),
            ],
            "downstream_next_steps": [
                link("Single tooth implants", "implants-single-tooth"),
                link("Full arch solutions", "implants-full-arch"),
                link("Aftercare planning", "implants-aftercare"),
            ],
            "supportive_links": [
                link("Comfort-first numbing", "painless-numbing-the-wand"),
                link("CBCT planning", "cbct-3d-scanning"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Talk about implant sedation"),
            "secondary_intent": link("Plan implant placement", "implants"),
            "reassurance_intent": link("Understand recovery and aftercare", "implants-aftercare"),
        },
    },
    "implant_restoration": {
        "journeys": {
            "upstream_referrers": [
                link("Implant placement", "implants"),
                link("Implant consultation", "implants-consultation"),
            ],
            "downstream_next_steps": [
                link("Crown and bridge fitting", "dental-crowns"),
                link("Hygiene and maintenance", "implants-aftercare"),
                link("Digital smile refinement", "digital-smile-design"),
            ],
            "supportive_links": [
                link("CBCT verification", "cbct-3d-scanning"),
                link("Sedation support", "implants-sedation"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Plan implant restoration work"),
            "secondary_intent": link("Arrange hygiene maintenance", "implants-aftercare"),
            "reassurance_intent": link("Review digital planning", "3d-digital-dentistry"),
        },
    },
    "cbct": {
        "journeys": {
            "upstream_referrers": [
                link("Implant consultation", "implants-consultation"),
                link("Oral surgery planning", "extractions-and-oral-surgery"),
            ],
            "downstream_next_steps": [
                link("Bone grafting", "implants-bone-grafting"),
                link("Sinus lift", "implants-sinus-lift"),
                link("Teeth in a day planning", "implants-teeth-in-a-day"),
            ],
            "supportive_links": [
                link("Digital dentistry", "3d-digital-dentistry"),
                link("Implant restorations", "3d-implant-restorations"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a CBCT scan"),
            "secondary_intent": link("Plan implant placement", "implants"),
            "reassurance_intent": link("Review surgical support", "implants-bone-grafting"),
        },
    },
    "digital3d": {
        "journeys": {
            "upstream_referrers": [
                link("Routine care", "preventative-and-general-dentistry"),
                link("Implant consultation", "implants-consultation"),
            ],
            "downstream_next_steps": [
                link("CBCT scanning", "cbct-3d-scanning"),
                link("Digital smile design", "digital-smile-design"),
                link("3D printing lab", "3d-printing-lab"),
            ],
            "supportive_links": [
                link("3D implant restorations", "3d-implant-restorations"),
                link("Aligner planning", "aligners"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a digital dentistry consult"),
            "secondary_intent": link("Plan CBCT imaging", "cbct-3d-scanning"),
            "reassurance_intent": link("Explore 3D printing support", "3d-printing-lab"),
        },
    },
    "printing_lab": {
        "journeys": {
            "upstream_referrers": [
                link("Digital smile design", "digital-smile-design"),
                link("3D dentistry and technology", "3d-dentistry-and-technology"),
            ],
            "downstream_next_steps": [
                link("3D printed dentures", "3d-printed-dentures"),
                link("3D printed veneers", "3d-printed-veneers"),
                link("Implant restorations", "3d-implant-restorations"),
            ],
            "supportive_links": [
                link("Digital implant planning", "3d-digital-dentistry"),
                link("Implant consultation", "implants-consultation"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Discuss 3D printing support"),
            "secondary_intent": link("Plan printed dentures", "3d-printed-dentures"),
            "reassurance_intent": link("Preview smile prototypes", "digital-smile-design"),
        },
    },
    "aesthetics_base": {
        "journeys": {
            "upstream_referrers": [
                link("Treatment hub", "hub-directory"),
                link("Routine dental care", "preventative-and-general-dentistry"),
            ],
            "downstream_next_steps": [
                link("Dermal fillers", "dermal-fillers"),
                link("Anti-wrinkle care", "anti-wrinkle-treatments"),
                link("Skin boosters", "skin-boosters"),
            ],
            "supportive_links": [
                link("Polynucleotides", "polynucleotides"),
                link("Therapeutic injectables", "therapeutic-facial-injectables"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a facial aesthetics consultation"),
            "secondary_intent": link("Explore dermal fillers", "dermal-fillers"),
            "reassurance_intent": link("Review treatment safety", "therapeutic-facial-injectables"),
        },
    },
    "aesthetics_sub": {
        "journeys": {
            "upstream_referrers": [
                link("Facial aesthetics consultation", "facial-aesthetics"),
                link("Routine skin health checks", "preventative-and-general-dentistry"),
            ],
            "downstream_next_steps": [
                link("Skin boosters", "skin-boosters"),
                link("Polynucleotides", "polynucleotides"),
                link("Therapeutic injectables", "therapeutic-facial-injectables"),
            ],
            "supportive_links": [
                link("Anti-wrinkle pathways", "anti-wrinkle-treatments"),
                link("Dermal fillers", "dermal-fillers"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a facial injectable review"),
            "secondary_intent": link("Plan skin booster sessions", "skin-boosters"),
            "reassurance_intent": link("Learn about treatment safety", "facial-aesthetics"),
        },
    },
    "facial_therapeutics": {
        "journeys": {
            "upstream_referrers": [
                link("Facial aesthetics consultation", "facial-aesthetics"),
                link("Facial pain assessment", "facial-pain-and-headache"),
            ],
            "downstream_next_steps": [
                link("Therapeutic injectables", "therapeutic-facial-injectables"),
                link("Skin boosters", "skin-boosters"),
                link("Polynucleotide therapy", "polynucleotides"),
            ],
            "supportive_links": [
                link("Anti-wrinkle treatments", "anti-wrinkle-treatments"),
                link("Dermal fillers", "dermal-fillers"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Arrange a facial therapeutics review"),
            "secondary_intent": link("Plan therapeutic injectables", "therapeutic-facial-injectables"),
            "reassurance_intent": link("Discuss supportive skin care", "skin-boosters"),
        },
    },
    "endodontics": {
        "journeys": {
            "upstream_referrers": [
                link("Emergency dental care", "extractions-and-oral-surgery"),
                link("Routine examinations", "preventative-and-general-dentistry"),
            ],
            "downstream_next_steps": [
                link("Crown restoration", "dental-crowns"),
                link("Inlay or onlay repair", "inlays-onlays"),
                link("Gum care follow-up", "periodontal-gum-care"),
            ],
            "supportive_links": [
                link("Sedation support", "sedation-dentistry"),
                link("Hygiene maintenance", "preventative-and-general-dentistry"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Book a root canal assessment"),
            "secondary_intent": link("Plan crown protection", "dental-crowns"),
            "reassurance_intent": link("Discuss comfort options", "sedation-dentistry"),
        },
    },
    "hub": {
        "journeys": {
            "upstream_referrers": [
                link("Routine check-ups", "preventative-and-general-dentistry"),
            ],
            "downstream_next_steps": [
                link("Implant treatments", "implants"),
                link("Orthodontic care", "orthodontics"),
                link("Facial aesthetics", "facial-aesthetics"),
            ],
            "supportive_links": [
                link("Nervous patient support", "nervous-patients"),
                link("Senior smile care", "senior-mature-smile-care"),
            ],
        },
        "cta_intents": {
            "primary_intent": contact("Find the right treatment"),
            "secondary_intent": link("Book a general consultation", "preventative-and-general-dentistry"),
            "reassurance_intent": link("Ask about anxiety support", "nervous-patients"),
        },
    },
}

base = Path("packages/champagne-manifests/data/sections/smh")

journey_map: dict[str, dict] = {}


def assign(slugs: list[str], template_key: str) -> None:
    template = templates[template_key]
    for slug in slugs:
        journey_map[slug] = template


assign(["aligners", "clear-aligners", "clear-aligners-spark"], "aligner")
assign(["orthodontics", "fixed-braces"], "orthodontic")
assign(["dental-retainers", "mouthguards-and-retainers"], "retainer")
assign(["sports-mouthguards"], "mouthguard")
assign(["bruxism-and-jaw-clenching"], "bruxism")
assign(["night-guards-occlusal-splints"], "night_guard")
assign(["tmj-disorder-treatment"], "tmj")
assign(["tmj-jaw-comfort"], "tmj_comfort")
assign(["facial-pain-and-headache"], "facial_pain")
assign(["preventative-and-general-dentistry"], "preventative")
assign(["childrens-dentistry"], "childrens")
assign(["senior-mature-smile-care"], "senior")
assign(["periodontal-gum-care"], "periodontal")
assign(["nervous-patients"], "nervous")
assign(["sedation-dentistry"], "sedation")
assign(["painless-numbing-the-wand"], "painless")
assign(["extractions-and-oral-surgery"], "extractions")
assign(["dental-crowns"], "crown")
assign(["dental-bridges"], "bridge")
assign(["inlays-onlays"], "inlay")
assign(["veneers", "3d-printed-veneers"], "veneer")
assign(["digital-smile-design"], "digital_smile")
assign(["teeth-whitening"], "whitening")
assign(["home-teeth-whitening"], "home_whitening")
assign(["whitening-top-ups"], "whitening_topup")
assign(["whitening-sensitive-teeth"], "whitening_sensitive")
assign(["teeth-whitening-faqs"], "whitening_faq")
assign(
    ["dentures", "acrylic-dentures", "chrome-dentures", "peek-partial-dentures", "3d-printed-dentures"],
    "dentures",
)
assign(["implants-consultation"], "implant_consult")
assign(["implants"], "implant_core")
assign(
    ["implants-single-tooth", "implants-multiple-teeth", "implants-full-arch", "implants-teeth-in-a-day", "implants-retained-dentures"],
    "implant_surgery",
)
assign(["implants-bone-grafting", "implants-sinus-lift", "implants-failed-replacement"], "implant_support")
assign(["implants-aftercare"], "implant_aftercare")
assign(["implants-sedation"], "implant_sedation")
assign(["3d-implant-restorations"], "implant_restoration")
assign(["cbct-3d-scanning"], "cbct")
assign(["3d-dentistry-and-technology", "3d-digital-dentistry"], "digital3d")
assign(["3d-printing-lab"], "printing_lab")
assign(["facial-aesthetics"], "aesthetics_base")
assign([
    "anti-wrinkle-treatments",
    "dermal-fillers",
    "polynucleotides",
    "skin-boosters",
    "therapeutic-facial-injectables",
], "aesthetics_sub")
assign(["facial-therapeutics"], "facial_therapeutics")
assign(["endodontics-root-canal"], "endodontics")
assign(["hub-directory"], "hub")

missing: list[str] = []

for path in sorted(base.glob("treatments.*.json")):
    slug = path.stem.replace("treatments.", "")
    mapping = journey_map.get(slug)
    if not mapping:
        missing.append(slug)
        continue

    data = json.loads(path.read_text())
    data["journeys"] = copy.deepcopy(mapping["journeys"])
    data["cta_intents"] = copy.deepcopy(mapping["cta_intents"])
    path.write_text(json.dumps(data, indent=2) + "\n")

if missing:
    raise SystemExit(f"Missing mappings for: {', '.join(missing)}")

