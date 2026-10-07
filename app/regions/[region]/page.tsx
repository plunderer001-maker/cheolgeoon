import { notFound, permanentRedirect } from "next/navigation";
import { getRegion, regions, regionTopicPath, topics } from "@/app/lib/region-pages";

// 시군구 안내 페이지는 2026-10-07 폐지. 정적 사이트에서는 _redirects 의 301 이 처리하고,
// 개발 서버에서도 같은 주소로 보낸다.
type PageProps = {
  params: Promise<{ region: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return regions.map((region) => ({ region: region.slug }));
}

export default async function RegionHubRedirect({ params }: PageProps) {
  const { region: regionSlug } = await params;
  const region = getRegion(regionSlug);
  const topic = topics[0];
  if (!region || !topic) notFound();
  permanentRedirect(regionTopicPath(region, topic));
}
