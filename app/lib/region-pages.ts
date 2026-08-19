import regionData from "@/data/generated/regions.json";
import regionServiceData from "@/data/generated/region-service-pages.json";

export type Region = {
  code: string;
  sido: string;
  sidoShort: string;
  sigungu: string;
  name: string;
  slug: string;
  fullName: string;
};

export type RegionService = {
  slug: string;
  keyword: string;
  intent: string;
  image: string;
};

export type RegionServicePage = {
  slug: string;
  regionSlug: string;
  serviceSlug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  region: Region;
  service: RegionService;
};

type RegionsData = {
  summary: {
    source: string;
    count: number;
    uniqueSlugCount: number;
  };
  regions: Region[];
};

type RegionServiceData = {
  source: string;
  regionCount: number;
  serviceCount: number;
  pageCount: number;
  services: RegionService[];
  pages: RegionServicePage[];
};

export const regionsSource = regionData as RegionsData;
export const regions = regionsSource.regions;
export const regionServiceSource = regionServiceData as RegionServiceData;
export const regionServices = regionServiceSource.services;
export const regionServicePages = regionServiceSource.pages;

export const regionMap = new Map(regions.map((region) => [region.slug, region]));
export const regionServiceMap = new Map(
  regionServicePages.map((page) => [`${page.regionSlug}/${page.serviceSlug}`, page]),
);

export function getRegion(regionSlug: string) {
  return regionMap.get(decodeURIComponent(regionSlug));
}

export function getRegionServicePage(regionSlug: string, serviceSlug: string) {
  return regionServiceMap.get(`${decodeURIComponent(regionSlug)}/${decodeURIComponent(serviceSlug)}`);
}

export function getRegionPages(regionSlug: string) {
  const decoded = decodeURIComponent(regionSlug);
  return regionServicePages.filter((page) => page.regionSlug === decoded);
}
