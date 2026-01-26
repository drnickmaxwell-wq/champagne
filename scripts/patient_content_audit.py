import json
import os
import re
import hashlib
from pathlib import Path
from typing import Any, Dict, List, Tuple, Optional

ROOT = Path(__file__).resolve().parents[1]

MACHINE_MANIFEST_PATH = ROOT / "packages/champagne-manifests/data/champagne_machine_manifest_full.json"
BRAND_MANIFEST_PATH = ROOT / "packages/champagne-manifests/data/manifest.public.brand.json"
NAV_MANIFEST_PATH = ROOT / "packages/champagne-manifests/data/manifest.nav.main.json"
CTA_INTENTS_PATH = ROOT / "packages/champagne-manifests/data/sections/smh/cta_intents.json"
TREATMENT_JOURNEYS_PATH = ROOT / "packages/champagne-manifests/data/sections/smh/treatment_journeys.json"
SECTION_LAYOUT_DIR = ROOT / "packages/champagne-manifests/data/sections/smh"

HEADER_PATH = ROOT / "apps/web/app/components/layout/Header.tsx"
FOOTER_PATH = ROOT / "apps/web/app/components/layout/Footer.tsx"
PATIENT_PORTAL_PATH = ROOT / "apps/web/app/patient-portal/page.tsx"
PAGE_BUILDER_PATH = ROOT / "apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx"
LEGAL_PRIVACY_PATH = ROOT / "apps/web/app/(champagne)/legal/privacy/page.tsx"
ROUTE_REDIRECT_PATH = ROOT / "apps/web/app/dental-checkups-oral-cancer-screening/route.ts"
SITE_DYNAMIC_PATH = ROOT / "apps/web/app/(site)/[page]/page.tsx"
TREATMENT_DYNAMIC_PATH = ROOT / "apps/web/app/treatments/[slug]/page.tsx"
TEAM_DYNAMIC_PATH = ROOT / "apps/web/app/team/[slug]/page.tsx"
LEGAL_DYNAMIC_PATH = ROOT / "apps/web/app/(champagne)/legal/[slug]/page.tsx"

OUTPUT_DIR = ROOT / "reports/patient_content_audit"

TEXT_KEYS = {
    "label",
    "title",
    "eyebrow",
    "overline",
    "strapline",
    "subtitle",
    "body",
    "copy",
    "description",
    "summary",
    "intro",
    "tag",
    "heading",
    "headline",
    "text",
    "question",
    "answer",
    "note",
    "name",
}

ARRAY_TEXT_KEYS = {"items", "bullets", "faqs", "steps", "list", "questions"}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text())


def route_id_from_slug(slug: str) -> str:
    if not slug or slug == "/":
        return "home"
    normalized = slug.strip("/")
    if not normalized:
        return "home"
    return normalized.replace("/", ".")


def normalize_route(route: str) -> str:
    if not route:
        return "/"
    if not route.startswith("/"):
        route = "/" + route
    return route


def find_line_for_text(file_path: Path, text: str) -> Optional[int]:
    lines = file_path.read_text().splitlines()
    for i, line in enumerate(lines, start=1):
        if text in line:
            return i
    return None


def extract_alias_map() -> Dict[str, str]:
    helpers_path = ROOT / "packages/champagne-manifests/src/helpers.ts"
    content = helpers_path.read_text()
    match = re.search(r"const TREATMENT_PATH_ALIASES: Record<string, string> = \{([\s\S]*?)\n\};", content)
    if not match:
        return {}
    block = match.group(1)
    aliases = {}
    for key, value in re.findall(r'"([^"]+)"\s*:\s*"([^"]+)"', block):
        aliases[key] = value
    return aliases


def build_pointer(path_stack: List[str]) -> str:
    return "/" + "/".join(path_stack)


def extract_text_blocks(
    data: Any,
    route: str,
    file_path: Path,
    pointer_stack: List[str],
    blocks: List[Dict[str, Any]],
    parent_key: Optional[str] = None,
):
    if isinstance(data, dict):
        for key, value in data.items():
            next_stack = pointer_stack + [key]
            if isinstance(value, str) and key in TEXT_KEYS:
                blocks.append(
                    {
                        "route": route,
                        "filePath": str(file_path.relative_to(ROOT)),
                        "pointer": build_pointer(next_stack),
                        "currentText": value,
                    }
                )
            else:
                extract_text_blocks(value, route, file_path, next_stack, blocks, parent_key=key)
    elif isinstance(data, list):
        for index, value in enumerate(data):
            next_stack = pointer_stack + [str(index)]
            if isinstance(value, str) and parent_key in ARRAY_TEXT_KEYS:
                blocks.append(
                    {
                        "route": route,
                        "filePath": str(file_path.relative_to(ROOT)),
                        "pointer": build_pointer(next_stack),
                        "currentText": value,
                    }
                )
            else:
                extract_text_blocks(value, route, file_path, next_stack, blocks, parent_key=parent_key)


def add_header_footer_blocks(route: str, blocks: List[Dict[str, Any]], nav_items: List[Dict[str, Any]]):
    # Header brand label
    header_brand = "St Mary's House Dental"
    header_line = find_line_for_text(HEADER_PATH, "St Mary")
    blocks.append(
        {
            "route": route,
            "filePath": str(HEADER_PATH.relative_to(ROOT)),
            "pointer": f"line:{header_line}" if header_line else "line:unknown",
            "currentText": header_brand,
        }
    )

    # Header nav labels (from manifest)
    for idx, item in enumerate(nav_items):
        label = item.get("label")
        if not isinstance(label, str):
            continue
        pointer = f"/items/{idx}/label"
        blocks.append(
            {
                "route": route,
                "filePath": str(NAV_MANIFEST_PATH.relative_to(ROOT)),
                "pointer": pointer,
                "currentText": label,
            }
        )

    # Footer static text
    footer_texts = [
        "Champagne finish",
        "Luxe ink gradient with soft particle bloom, tuned for calm reading and brand gold accents. Crafted for the Champagne ecosystem runtime shell.",
        "Explore",
        "Support",
        "Stay in sync",
        "Sign up to hear about new treatments and Champagne build milestones.",
        "Email address",
        "Join list",
        "Privacy policy",
        "Cookies policy",
        "Terms",
        "Accessibility",
        "Complaints policy",
        "Newsletter",
        "Downloads",
        "Contact us",
        "Patient portal",
        "View treatments",
    ]
    for text in footer_texts:
        line = find_line_for_text(FOOTER_PATH, text)
        blocks.append(
            {
                "route": route,
                "filePath": str(FOOTER_PATH.relative_to(ROOT)),
                "pointer": f"line:{line}" if line else "line:unknown",
                "currentText": text,
            }
        )

    # Footer dynamic year line
    year_line = find_line_for_text(FOOTER_PATH, "Champagne luxe footer promotion.")
    blocks.append(
        {
            "route": route,
            "filePath": str(FOOTER_PATH.relative_to(ROOT)),
            "pointer": f"line:{year_line}" if year_line else "line:unknown",
            "currentText": None,
            "extractionStatus": "dynamic_runtime_value",
            "note": "Rendered as: © {currentYear} St Mary’s House Dental. Champagne luxe footer promotion.",
        }
    )


def add_patient_portal_blocks(route: str, blocks: List[Dict[str, Any]]):
    portal_texts = [
        "Sign in",
        "Access your patient records, appointments, and treatment updates.",
        "Video consultation",
        "Join or schedule a secure video consultation with the clinical team.",
        "Video visits are rolling out gradually. If you need help scheduling, please contact us.",
        "Finance",
        "Review payment options, manage instalments, and check your plan status.",
        "Finance access is being enabled for patients in phases.",
        "Upload documents",
        "Share medical histories, x-rays, and consent forms securely with the practice.",
        "Patient Portal",
        "What happens next?",
        "Continue to the patient portal using the intent below. If the online flow is not yet available",
        "Continue",
        "Contact",
        "Treatments",
        "Supported intents",
    ]

    for text in portal_texts:
        line = find_line_for_text(PATIENT_PORTAL_PATH, text)
        blocks.append(
            {
                "route": route,
                "filePath": str(PATIENT_PORTAL_PATH.relative_to(ROOT)),
                "pointer": f"line:{line}" if line else "line:unknown",
                "currentText": text,
            }
        )

    # Rendered heading prefix
    heading_prefix = "Patient Portal — "
    line = find_line_for_text(PATIENT_PORTAL_PATH, "Patient Portal —")
    blocks.append(
        {
            "route": route,
            "filePath": str(PATIENT_PORTAL_PATH.relative_to(ROOT)),
            "pointer": f"line:{line}" if line else "line:unknown",
            "currentText": heading_prefix,
        }
    )

    # Intent-specific composed headings
    intent_titles = ["Sign in", "Video consultation", "Finance", "Upload documents"]
    for title in intent_titles:
        blocks.append(
            {
                "route": route,
                "filePath": str(PATIENT_PORTAL_PATH.relative_to(ROOT)),
                "pointer": f"line:{line}" if line else "line:unknown",
                "currentText": f"Patient Portal — {title}",
                "renderCondition": "intent_specific_heading",
            }
        )


def add_treatment_breadcrumb_blocks(route: str, blocks: List[Dict[str, Any]]):
    for text in ["Home", "Treatments"]:
        line = find_line_for_text(PAGE_BUILDER_PATH, text)
        blocks.append(
            {
                "route": route,
                "filePath": str(PAGE_BUILDER_PATH.relative_to(ROOT)),
                "pointer": f"line:{line}" if line else "line:unknown",
                "currentText": text,
            }
        )


def build_route_inventory(
    machine_manifest: Dict[str, Any],
    brand_manifest: Dict[str, Any],
    nav_manifest: Dict[str, Any],
    section_layouts: Dict[str, Dict[str, Any]],
    alias_map: Dict[str, str],
    footer_links: List[str],
) -> Tuple[Dict[str, Dict[str, Any]], List[Dict[str, Any]]]:
    route_data: Dict[str, Dict[str, Any]] = {}
    evidence_entries: List[Dict[str, Any]] = []

    def ensure_route(route: str) -> Dict[str, Any]:
        route = normalize_route(route)
        if route not in route_data:
            route_data[route] = {
                "route": route,
                "routeId": route_id_from_slug(route),
                "evidence": [],
            }
        return route_data[route]

    pages = machine_manifest.get("pages", {})
    treatments = machine_manifest.get("treatments", {})

    for key, entry in pages.items():
        path = entry.get("path")
        if not path:
            continue
        route_entry = ensure_route(path)
        route_entry["machineManifestPointer"] = f"/pages/{key}"
        route_entry["hasManifest"] = True
        route_entry["isTreatment"] = path.startswith("/treatments/")
        route_entry["evidence"].append(
            {
                "filePath": str(MACHINE_MANIFEST_PATH.relative_to(ROOT)),
                "pointer": f"/pages/{key}",
            }
        )

    for key, entry in treatments.items():
        path = entry.get("path")
        if not path:
            continue
        route_entry = ensure_route(path)
        route_entry["machineManifestPointer"] = f"/treatments/{key}"
        route_entry["hasManifest"] = True
        route_entry["isTreatment"] = True
        route_entry["evidence"].append(
            {
                "filePath": str(MACHINE_MANIFEST_PATH.relative_to(ROOT)),
                "pointer": f"/treatments/{key}",
            }
        )

    for index, entry in enumerate(brand_manifest.get("pages", [])):
        slug = entry.get("slug")
        if not slug:
            continue
        route_entry = ensure_route(slug)
        route_entry.setdefault("brandManifestPointer", f"/pages/{index}")
        route_entry["evidence"].append(
            {
                "filePath": str(BRAND_MANIFEST_PATH.relative_to(ROOT)),
                "pointer": f"/pages/{index}",
            }
        )

    # Routes from alias map
    helpers_path = ROOT / "packages/champagne-manifests/src/helpers.ts"
    for alias, target in alias_map.items():
        route_entry = ensure_route(alias)
        route_entry["aliasTarget"] = target
        route_entry["evidence"].append(
            {
                "filePath": str(helpers_path.relative_to(ROOT)),
                "pointer": "TREATMENT_PATH_ALIASES",
            }
        )

    # Redirect route
    redirect_route = "/dental-checkups-oral-cancer-screening"
    route_entry = ensure_route(redirect_route)
    route_entry["redirectOnly"] = True
    route_entry["evidence"].append(
        {
            "filePath": str(ROUTE_REDIRECT_PATH.relative_to(ROOT)),
            "pointer": "GET/HEAD",
        }
    )

    # Footer link routes (explicit links)
    for link in footer_links:
        route_entry = ensure_route(link)
        route_entry["evidence"].append(
            {
                "filePath": str(FOOTER_PATH.relative_to(ROOT)),
                "pointer": "Link",
            }
        )

    # Evidence for app routes
    static_route_files = {
        "/": "apps/web/app/page.tsx",
        "/treatments": "apps/web/app/treatments/page.tsx",
        "/contact": "apps/web/app/contact/page.tsx",
        "/fees": "apps/web/app/fees/page.tsx",
        "/blog": "apps/web/app/blog/page.tsx",
        "/patient-portal": "apps/web/app/patient-portal/page.tsx",
        "/team": "apps/web/app/team/page.tsx",
        "/smile-gallery": "apps/web/app/(champagne)/smile-gallery/page.tsx",
        "/about": "apps/web/app/(champagne)/about/page.tsx",
        "/legal/privacy": "apps/web/app/(champagne)/legal/privacy/page.tsx",
    }

    for route, rel_path in static_route_files.items():
        route_entry = ensure_route(route)
        route_entry["evidence"].append(
            {
                "filePath": rel_path,
                "pointer": "page.tsx",
            }
        )

    # Dynamic route evidence
    for route, data in route_data.items():
        if route.startswith("/treatments/") and route != "/treatments":
            data["evidence"].append(
                {
                    "filePath": str(TREATMENT_DYNAMIC_PATH.relative_to(ROOT)),
                    "pointer": "page.tsx",
                }
            )
        if route.startswith("/team/") and route != "/team":
            data["evidence"].append(
                {
                    "filePath": str(TEAM_DYNAMIC_PATH.relative_to(ROOT)),
                    "pointer": "page.tsx",
                }
            )
        if route.startswith("/legal/") and route != "/legal/privacy":
            data["evidence"].append(
                {
                    "filePath": str(LEGAL_DYNAMIC_PATH.relative_to(ROOT)),
                    "pointer": "page.tsx",
                }
            )

        # If route has no static route file and not treatment/team/legal dynamic, include site dynamic evidence
        if (
            route not in static_route_files
            and not route.startswith("/treatments/")
            and not route.startswith("/team/")
            and not route.startswith("/legal/")
            and not data.get("redirectOnly")
        ):
            data["evidence"].append(
                {
                    "filePath": str(SITE_DYNAMIC_PATH.relative_to(ROOT)),
                    "pointer": "page.tsx",
                }
            )

    return route_data, evidence_entries


def build_content_blocks(
    routes: Dict[str, Dict[str, Any]],
    machine_manifest: Dict[str, Any],
    section_layouts: Dict[str, Dict[str, Any]],
    nav_manifest: Dict[str, Any],
    alias_map: Dict[str, str],
) -> List[Dict[str, Any]]:
    blocks: List[Dict[str, Any]] = []
    nav_items = nav_manifest.get("items", []) if isinstance(nav_manifest.get("items"), list) else []

    path_to_manifest_entry: Dict[str, Tuple[Dict[str, Any], str]] = {}
    for key, entry in (machine_manifest.get("pages", {}) or {}).items():
        path = entry.get("path")
        if path:
            path_to_manifest_entry[path] = (entry, f"/pages/{key}")
    for key, entry in (machine_manifest.get("treatments", {}) or {}).items():
        path = entry.get("path")
        if path:
            path_to_manifest_entry[path] = (entry, f"/treatments/{key}")

    # Shared content from header/footer
    for route, data in routes.items():
        if data.get("redirectOnly"):
            continue
        add_header_footer_blocks(route, blocks, nav_items)

    # Content from manifests/sections
    for route, data in routes.items():
        if data.get("redirectOnly"):
            continue

        resolved_route = route
        if route in alias_map:
            resolved_route = alias_map[route]

        route_id = route_id_from_slug(resolved_route)
        layout = section_layouts.get(route_id)
        if layout:
            extract_text_blocks(
                layout,
                route,
                layout["__filePath"],
                [],
                blocks,
            )
        else:
            manifest_entry = path_to_manifest_entry.get(resolved_route)
            if manifest_entry:
                entry, pointer = manifest_entry
                # Extract from manifest entry
                extract_text_blocks(entry, route, MACHINE_MANIFEST_PATH, pointer.strip("/").split("/"), blocks)
            else:
                blocks.append(
                    {
                        "route": route,
                        "filePath": str(MACHINE_MANIFEST_PATH.relative_to(ROOT)),
                        "pointer": "(missing manifest entry)",
                        "currentText": None,
                        "extractionStatus": "missing_manifest_entry",
                    }
                )

        # Treatment breadcrumb
        if route.startswith("/treatments/") and route != "/treatments":
            add_treatment_breadcrumb_blocks(route, blocks)

        # Patient portal custom content
        if route == "/patient-portal":
            add_patient_portal_blocks(route, blocks)

        # Legal privacy hero fallback
        if route == "/legal/privacy":
            line = find_line_for_text(LEGAL_PRIVACY_PATH, "Privacy surface")
            blocks.append(
                {
                    "route": route,
                    "filePath": str(LEGAL_PRIVACY_PATH.relative_to(ROOT)),
                    "pointer": f"line:{line}" if line else "line:unknown",
                    "currentText": "Privacy surface",
                    "renderCondition": "fallback_when_manifest_label_missing",
                }
            )

    return blocks


def build_classification(routes: Dict[str, Dict[str, Any]], section_layouts: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
    classifications = []
    for route, data in routes.items():
        source_type = "unknown"
        evidence = data.get("evidence", [])
        route_id = route_id_from_slug(route)

        if data.get("redirectOnly"):
            source_type = "redirect_only"
        elif route.startswith("/treatments/") and route != "/treatments":
            source_type = "smh_treatment_layout_resolved" if route_id in section_layouts else "dynamic_route_builder_resolved"
        elif any("manifest.public.brand.json" in e.get("filePath", "") for e in evidence) and not data.get("hasManifest"):
            source_type = "brand_manifest_only"
        elif route_id in section_layouts:
            source_type = "machine_manifest_sectionJsonPaths"
        elif data.get("hasManifest"):
            source_type = "machine_manifest_inline"
        elif any("(site)" in e.get("filePath", "") for e in evidence):
            source_type = "dynamic_route_builder_resolved"

        classifications.append(
            {
                "route": route,
                "routeId": data.get("routeId"),
                "sourceType": source_type,
                "evidence": evidence,
            }
        )

    return classifications


def build_shared_content_analysis(blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
    exact_map: Dict[str, Dict[str, Any]] = {}
    normalized_map: Dict[str, Dict[str, Any]] = {}

    for block in blocks:
        text = block.get("currentText")
        if not isinstance(text, str):
            continue
        route = block.get("route")
        exact_hash = hashlib.sha256(text.encode("utf-8")).hexdigest()
        normalized = " ".join(text.lower().split())
        normalized_hash = hashlib.sha256(normalized.encode("utf-8")).hexdigest()

        exact_entry = exact_map.setdefault(exact_hash, {"fingerprint": exact_hash, "text": text, "routes": set()})
        exact_entry["routes"].add(route)

        normalized_entry = normalized_map.setdefault(
            normalized_hash,
            {"fingerprint": normalized_hash, "normalizedText": normalized, "exampleText": text, "routes": set()},
        )
        normalized_entry["routes"].add(route)

    exact_shared = [
        {"fingerprint": entry["fingerprint"], "text": entry["text"], "routes": sorted(entry["routes"])}
        for entry in exact_map.values()
        if len(entry["routes"]) > 1
    ]

    near_shared = [
        {
            "fingerprint": entry["fingerprint"],
            "normalizedText": entry["normalizedText"],
            "exampleText": entry["exampleText"],
            "routes": sorted(entry["routes"]),
        }
        for entry in normalized_map.values()
        if len(entry["routes"]) > 1
    ]

    return {
        "exactMatches": sorted(exact_shared, key=lambda x: x["fingerprint"]),
        "nearMatches": sorted(near_shared, key=lambda x: x["fingerprint"]),
    }


def build_duplication_summary(routes: Dict[str, Dict[str, Any]], blocks: List[Dict[str, Any]], shared_analysis: Dict[str, Any]) -> Dict[str, Any]:
    total_routes = len(routes)
    total_blocks = len([block for block in blocks if block.get("currentText") is not None])
    shared_blocks = len(shared_analysis.get("exactMatches", []))
    # Unique blocks are those not in shared exact matches
    shared_texts = set()
    for entry in shared_analysis.get("exactMatches", []):
        shared_texts.add(entry["text"])
    unique_blocks = len([block for block in blocks if block.get("currentText") not in shared_texts])

    return {
        "totalPublicRoutes": total_routes,
        "totalPatientFacingTextBlocks": total_blocks,
        "numberOfSharedBlocks": shared_blocks,
        "numberOfUniqueBlocks": unique_blocks,
    }


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    machine_manifest = load_json(MACHINE_MANIFEST_PATH)
    brand_manifest = load_json(BRAND_MANIFEST_PATH)
    nav_manifest = load_json(NAV_MANIFEST_PATH)

    # Load section layouts
    section_layouts: Dict[str, Dict[str, Any]] = {}
    for path in SECTION_LAYOUT_DIR.glob("treatments.*.json"):
        data = load_json(path)
        route_id = data.get("routeId")
        if route_id:
            data["__filePath"] = path
            section_layouts[route_id] = data

    alias_map = extract_alias_map()

    # Footer links (explicit)
    footer_links = [
        "/legal/privacy",
        "/legal/cookies",
        "/legal/terms",
        "/legal/accessibility",
        "/legal/complaints",
        "/newsletter",
        "/downloads",
    ]

    routes, _ = build_route_inventory(
        machine_manifest,
        brand_manifest,
        nav_manifest,
        section_layouts,
        alias_map,
        footer_links,
    )

    # Build route inventory output
    route_inventory = [
        {
            "route": data["route"],
            "routeId": data.get("routeId"),
            "evidence": data.get("evidence", []),
        }
        for data in sorted(routes.values(), key=lambda x: x["route"])
    ]

    content_blocks = build_content_blocks(routes, machine_manifest, section_layouts, nav_manifest, alias_map)

    content_truth_map = {
        "blocks": content_blocks,
    }

    classification = build_classification(routes, section_layouts)

    shared_analysis = build_shared_content_analysis(content_blocks)

    duplication_summary = build_duplication_summary(routes, content_blocks, shared_analysis)

    (OUTPUT_DIR / "route_inventory.json").write_text(json.dumps(route_inventory, indent=2))
    (OUTPUT_DIR / "content_truth_map.json").write_text(json.dumps(content_truth_map, indent=2))
    (OUTPUT_DIR / "content_source_classification.json").write_text(json.dumps(classification, indent=2))
    (OUTPUT_DIR / "shared_content_analysis.json").write_text(json.dumps(shared_analysis, indent=2))
    (OUTPUT_DIR / "duplication_summary.json").write_text(json.dumps(duplication_summary, indent=2))


if __name__ == "__main__":
    main()
