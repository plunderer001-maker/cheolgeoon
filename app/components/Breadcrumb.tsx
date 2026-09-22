import Link from "next/link";

export type Crumb = {
  name: string;
  href?: string;
};

const SITE_URL = "https://cheolgeoon.netlify.app";

/**
 * 화면용 브레드크럼 + BreadcrumbList JSON-LD.
 * 마지막 항목은 현재 페이지라 링크를 걸지 않는다.
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <nav className="seo-breadcrumb" aria-label="현재 위치">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            {item.href && index < items.length - 1 ? (
              <Link href={item.href}>{item.name}</Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
