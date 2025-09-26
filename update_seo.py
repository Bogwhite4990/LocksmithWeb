import json
import re
from pathlib import Path

ROOT = Path('.').resolve()
BASE_URL = "https://lockersmith.co.uk/"
SITE_NAME = "Locker Smith"
PHONE_DISPLAY = "07757 666 691"
PHONE_LOCAL = "07757666691"
PHONE_INT = "+447757666691"
PHONE_TEL = PHONE_LOCAL
DEFAULT_IMAGE = f"{BASE_URL}images/locksmith-fixing-a-door.jpg"
DEFAULT_TWITTER_IMAGE = f"{BASE_URL}images/locksmiths-for-cars.jpg"
COMMON_KEYWORDS = [
    "Locker Smith",
    "London locksmith",
    "emergency locksmith",
    "car unlocking",
    "door unlocking",
    "lock replacement",
    "smart lock installation",
    "24 hour locksmith",
    "2025 locksmith services"
]

SPECIAL_TITLES = {
    "index.html": "Locker Smith Locksmiths London | 24/7 Emergency Experts 2025",
    "contact.html": "Contact Locker Smith | London Locksmith Support 24/7",
    "coverage.html": "Service Coverage | Locker Smith Locksmiths Across London",
    "coverage-area.html": "Coverage Areas | Locker Smith Mobile Locksmith Team",
    "services.html": "Locksmith Services | Locker Smith Security Solutions 2025",
    "privacy-policy.html": "Privacy Policy | Locker Smith Locksmiths London",
    "404.html": "404 - Locker Smith Locksmiths London"
}

SPECIAL_DESCRIPTIONS = {
    "index.html": (
        "Locker Smith delivers trusted 24/7 locksmith services across Greater London, "
        "helping residents, drivers and businesses gain fast, damage-free access and "
        "upgrade their security for 2025. Call our DBS-checked experts any time."
    ),
    "contact.html": (
        "Contact Locker Smith for emergency call-outs, quotes and expert locksmith "
        "advice across Greater London. Our support desk is available 24/7 by phone, "
        "email or callback request."
    ),
    "coverage.html": (
        "Explore Locker Smith's London locksmith coverage. We reach every borough in "
        "30 minutes with emergency unlocking, lock repairs and security upgrades."
    ),
    "coverage-area.html": (
        "Discover the Locker Smith service area across London and the Home Counties. "
        "Our 24/7 locksmiths attend homes, cars and businesses with rapid response."
    ),
    "services.html": (
        "Browse Locker Smith's full range of locksmith services for 2025, including "
        "emergency entry, lock replacements, car unlocking and smart security."
    ),
    "privacy-policy.html": (
        "Read Locker Smith's privacy policy to understand how we protect customer "
        "data across our London locksmith services."
    ),
    "404.html": (
        "The page you are looking for cannot be found. Discover Locker Smith's 24/7 "
        "locksmith services for London homes, cars and businesses."
    )
}


def slug_to_title(slug: str) -> str:
    words = slug.replace('-', ' ').replace('_', ' ').split()
    return ' '.join(word.capitalize() for word in words)


def extract_h1(text: str) -> str | None:
    match = re.search(r'<h1[^>]*>(.*?)</h1>', text, flags=re.S | re.I)
    if match:
        raw = re.sub(r'<[^>]+>', '', match.group(1))
        return ' '.join(raw.split())
    return None


def relative_canonical(path: Path) -> str:
    rel = path.relative_to(ROOT)
    if rel.name == 'index.html':
        return BASE_URL
    return f"{BASE_URL}{rel.as_posix()}"


def css_href_for(path: Path) -> str:
    return "css/style.css" if path.parent == ROOT else "../css/style.css"


def determine_title(path: Path, h1_text: str | None) -> str:
    rel = path.relative_to(ROOT)
    rel_name = rel.name
    if rel_name in SPECIAL_TITLES:
        return SPECIAL_TITLES[rel_name]
    if rel.parts and rel.parts[0] == 'services':
        service_name = h1_text or slug_to_title(path.stem)
        return f"{service_name} in London | Locker Smith Locksmiths 2025"
    if rel.parts and rel.parts[0] == 'locations':
        area_title = slug_to_title(path.stem)
        return f"Locksmiths in {area_title} | Locker Smith Local Experts 2025"
    if h1_text:
        return f"{h1_text} | Locker Smith Locksmiths London 2025"
    return f"{SITE_NAME} Locksmiths London 2025"


def determine_description(path: Path, h1_text: str | None) -> str:
    rel = path.relative_to(ROOT)
    rel_name = rel.name
    if rel_name in SPECIAL_DESCRIPTIONS:
        return SPECIAL_DESCRIPTIONS[rel_name]
    if rel.parts and rel.parts[0] == 'services':
        service_name = h1_text or slug_to_title(path.stem)
        lowered = service_name.lower()
        return (
            f"Locker Smith's {lowered} service keeps London properties secure in 2025 "
            f"with rapid response specialists, British Standard hardware and smart "
            f"security upgrades available around the clock."
        )
    if rel.parts and rel.parts[0] == 'locations':
        area_title = slug_to_title(path.stem)
        return (
            f"Locker Smith provides 24/7 locksmiths in {area_title}, offering "
            f"emergency entry, lock repairs, security upgrades and car unlocking "
            f"with average arrival times of 30 minutes across the area."
        )
    if h1_text:
        lowered = h1_text.lower()
        return (
            f"Locker Smith offers {lowered} backed by DBS-checked locksmiths, "
            f"rapid response vans and 2025-ready security technology across Greater London."
        )
    return SPECIAL_DESCRIPTIONS.get('index.html')


def determine_keywords(path: Path, h1_text: str | None) -> list[str]:
    rel = path.relative_to(ROOT)
    keywords = list(COMMON_KEYWORDS)
    if rel.parts and rel.parts[0] == 'services':
        service_name = h1_text or slug_to_title(path.stem)
        base = service_name.lower()
        keywords.extend([
            f"{base}",
            f"{base} locksmith",
            f"{base} experts",
        ])
        if 'london' not in base:
            keywords.append(f"{base} london")
    elif rel.parts and rel.parts[0] == 'locations':
        area_title = slug_to_title(path.stem)
        base = area_title.lower()
        keywords.extend([
            f"locksmith {base}",
            f"{base} locksmith",
            f"emergency locksmith {base}",
            f"24/7 locksmith {base}"
        ])
    elif h1_text:
        base = h1_text.lower()
        keywords.append(base)
        if 'london' not in base:
            keywords.append(f"{base} london")
    seen = set()
    ordered = []
    for kw in keywords:
        if kw not in seen:
            ordered.append(kw)
            seen.add(kw)
    return ordered


def breadcrumbs_for(path: Path, h1_text: str | None, canonical: str):
    rel = path.relative_to(ROOT)
    crumbs = [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL}
    ]
    position = 2
    if rel.name != 'index.html':
        if rel.parts[0] == 'services':
            crumbs.append({
                "@type": "ListItem",
                "position": position,
                "name": "Services",
                "item": f"{BASE_URL}services.html"
            })
            position += 1
        elif rel.parts[0] == 'locations':
            crumbs.append({
                "@type": "ListItem",
                "position": position,
                "name": "Locations",
                "item": f"{BASE_URL}locations.html"
            })
            position += 1
        elif rel.name not in ('services.html', 'coverage.html', 'coverage-area.html', 'contact.html', 'privacy-policy.html'):
            # Additional generic sections for root-level supporting pages
            pass
        crumbs.append({
            "@type": "ListItem",
            "position": position,
            "name": h1_text or determine_title(path, h1_text),
            "item": canonical
        })
    return crumbs


def graph_for(path: Path, title: str, description: str, h1_text: str | None, canonical: str):
    rel = path.relative_to(ROOT)
    graph = []
    graph.append({
        "@type": "WebPage",
        "@id": f"{canonical}#webpage",
        "name": title,
        "url": canonical,
        "inLanguage": "en-GB",
        "description": description,
        "isPartOf": {
            "@type": "WebSite",
            "@id": f"{BASE_URL}#website",
            "name": SITE_NAME,
            "url": BASE_URL
        },
        "primaryImageOfPage": DEFAULT_IMAGE
    })
    crumbs = breadcrumbs_for(path, h1_text, canonical)
    if len(crumbs) > 1:
        graph.append({
            "@type": "BreadcrumbList",
            "@id": f"{canonical}#breadcrumbs",
            "itemListElement": crumbs
        })
    if rel.name == 'index.html':
        graph.append({
            "@type": "WebSite",
            "@id": f"{BASE_URL}#website",
            "url": BASE_URL,
            "name": SITE_NAME,
            "description": description,
            "potentialAction": {
                "@type": "SearchAction",
                "target": f"{BASE_URL}?s={{search_term_string}}",
                "query-input": "required name=search_term_string"
            }
        })
        graph.append({
            "@type": "LocalBusiness",
            "@id": f"{BASE_URL}#locksmith",
            "name": "Locker Smith Locksmiths",
            "image": DEFAULT_IMAGE,
            "url": BASE_URL,
            "telephone": PHONE_DISPLAY,
            "priceRange": "££",
            "areaServed": [
                "Greater London",
                "North London",
                "East London",
                "South London",
                "West London",
                "Hertfordshire",
                "Essex"
            ],
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "London",
                "addressRegion": "Greater London",
                "postalCode": "",
                "addressCountry": "GB"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
            }
        })
        graph.append({
            "@type": "FAQPage",
            "@id": f"{canonical}#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How quickly can Locker Smith reach me?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our mobile locksmiths are positioned across Greater London so we can reach most addresses within 30 minutes, day or night."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do you offer damage-free entry for cars and homes?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. We use dealer-approved and non-destructive techniques to unlock doors and vehicles without harming paintwork, glass or locking mechanisms."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can Locker Smith upgrade my locks to 2025 security standards?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "We install British Standard and smart locking solutions that meet 2025 insurance requirements, including anti-snap cylinders, smart locks and reinforced hardware."
                    }
                }
            ]
        })
    elif rel.parts[0] == 'services':
        service_name = h1_text or slug_to_title(path.stem)
        graph.append({
            "@type": "Service",
            "@id": f"{canonical}#service",
            "name": service_name,
            "serviceType": service_name,
            "provider": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": BASE_URL,
                "telephone": PHONE_DISPLAY
            },
            "areaServed": "Greater London",
            "availableChannel": [
                {
                    "@type": "ServiceChannel",
                    "serviceLocation": {
                        "@type": "Place",
                        "name": "Greater London"
                    }
                }
            ]
        })
    elif rel.parts[0] == 'locations':
        area_title = slug_to_title(path.stem)
        graph.append({
            "@type": "LocalBusiness",
            "@id": f"{canonical}#localbusiness",
            "name": f"Locker Smith Locksmiths - {area_title}",
            "url": canonical,
            "telephone": PHONE_DISPLAY,
            "image": DEFAULT_IMAGE,
            "priceRange": "££",
            "areaServed": area_title,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": area_title,
                "addressRegion": "Greater London",
                "addressCountry": "GB"
            }
        })
    return {
        "@context": "https://schema.org",
        "@graph": graph
    }


def build_head(path: Path, original_head: str, h1_text: str | None) -> str:
    title = determine_title(path, h1_text)
    description = determine_description(path, h1_text)
    canonical = relative_canonical(path)
    keywords = ', '.join(determine_keywords(path, h1_text))
    og_type = 'website' if path.name == 'index.html' else 'article'
    css_href = css_href_for(path)

    style_match = re.search(r'<style[\s\S]*?</style>', original_head, flags=re.I)
    style_block = f"\n    {style_match.group(0)}" if style_match else ''

    structured_data = graph_for(path, title, description, h1_text, canonical)
    structured_json = json.dumps(structured_data, indent=2)

    base_tag = '\n    <base href="./">' if path.name == 'index.html' else ''

    head_lines = f"""
    <meta charset=\"UTF-8\">
    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>{title}</title>
    <meta name=\"description\" content=\"{description}\">
    <meta name=\"robots\" content=\"index, follow\">
    <meta name=\"author\" content=\"{SITE_NAME}\">
    <meta name=\"keywords\" content=\"{keywords}\">
    <link rel=\"canonical\" href=\"{canonical}\">
    <meta property=\"og:title\" content=\"{title}\">
    <meta property=\"og:description\" content=\"{description}\">
    <meta property=\"og:type\" content=\"{og_type}\">
    <meta property=\"og:url\" content=\"{canonical}\">
    <meta property=\"og:site_name\" content=\"{SITE_NAME}\">
    <meta property=\"og:image\" content=\"{DEFAULT_IMAGE}\">
    <meta property=\"og:locale\" content=\"en_GB\">
    <meta name=\"twitter:card\" content=\"summary_large_image\">
    <meta name=\"twitter:title\" content=\"{title}\">
    <meta name=\"twitter:description\" content=\"{description}\">
    <meta name=\"twitter:image\" content=\"{DEFAULT_TWITTER_IMAGE}\">{base_tag}
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
    <link href=\"https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Roboto:wght@400;500&display=swap\" rel=\"stylesheet\">
    <link rel=\"stylesheet\" href=\"{css_href}\">{style_block}
    <script type=\"application/ld+json\">
{structured_json}
    </script>
    """
    return head_lines.strip('\n')


def update_telephone_references(text: str) -> str:
    text = text.replace('href="tel:"', f'href="tel:{PHONE_TEL}"')
    text = text.replace('href="tel:+44 7757 666 691"', f'href="tel:{PHONE_TEL}"')
    text = text.replace('href="tel:+447757666691"', f'href="tel:{PHONE_TEL}"')
    text = text.replace('href="tel:07757666691"', f'href="tel:{PHONE_TEL}"')
    text = re.sub(r'Call Now:\s*</a>', f'Call Now: {PHONE_DISPLAY}</a>', text)
    text = re.sub(r'Call Now:\s*</strong>', f'Call Now: {PHONE_DISPLAY}</strong>', text)
    text = re.sub(r'<a href="tel:"></a>', f'<a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>', text)
    text = re.sub(r'<a href="tel:(?:\+447757666691|07757666691)">.*?</a>', f'<a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>', text)
    text = re.sub(r'<a href="tel:\">(.*?)</a>', f'<a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>', text)
    text = text.replace('Call Us: <a href="tel:">', f'Call Us: <a href="tel:{PHONE_TEL}">')
    text = re.sub(r'Call Us: <a href="tel:[^"]*">\s*</a>', f'Call Us: <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>', text)
    text = re.sub(r'Call Us: <a href="tel:{PHONE_TEL}">\s*</a>', f'Call Us: <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>', text)
    text = re.sub(r'Call Us:\s*<a href="tel:{PHONE_TEL}">([^<]*)</a>', lambda m: f'Call Us: <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>', text)
    text = re.sub(r'<a href="tel:{PHONE_TEL}">\s*</a>', f'<a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>', text)
    text = text.replace('tel:+447757666691', f'tel:{PHONE_TEL}')
    text = text.replace('tel:07757666691', f'tel:{PHONE_TEL}')
    return text


def main():
    html_files = [p for p in ROOT.glob('**/*.html') if 'node_modules' not in p.parts]
    for path in html_files:
        text = path.read_text(encoding='utf-8')
        if '<head' in text.lower():
            head_match = re.search(r'<head[^>]*>([\s\S]*?)</head>', text, flags=re.I)
            if head_match:
                head_inner = head_match.group(1)
                h1_text = extract_h1(text)
                new_head_inner = build_head(path, head_inner, h1_text)
                text = text.replace(head_match.group(0), f"<head>\n{new_head_inner}\n</head>", 1)
        text = update_telephone_references(text)
        path.write_text(text, encoding='utf-8')


if __name__ == '__main__':
    main()
