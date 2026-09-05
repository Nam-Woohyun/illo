import type {
  MetadataRoute,
} from "next";

import {
  getAllGuideSituations,
  getPublishedKnowledge,
} from "@/lib/knowledge";

import {
  getAbsoluteUrl,
} from "@/lib/site";

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const [
    guides,
    knowledgeItems,
  ] = await Promise.all([
    getAllGuideSituations(),
    getPublishedKnowledge(),
  ]);

  const staticRoutes:
    MetadataRoute.Sitemap = [
      {
        url:
          getAbsoluteUrl(
            "/",
          ),
      },
      {
        url:
          getAbsoluteUrl(
            "/guide",
          ),
      },
      {
        url:
          getAbsoluteUrl(
            "/knowledge",
          ),
      },
      {
        url:
          getAbsoluteUrl(
            "/ai-search",
          ),
      },
      {
        url:
          getAbsoluteUrl(
            "/about",
          ),
      },
    ];

  const guideRoutes:
    MetadataRoute.Sitemap =
    guides.map(
      (guide) => ({
        url:
          getAbsoluteUrl(
            `/guide/${guide.slug}`,
          ),
      }),
    );

  const knowledgeRoutes:
    MetadataRoute.Sitemap =
    knowledgeItems.map(
      (item) => ({
        url:
          getAbsoluteUrl(
            `/knowledge/${item.slug}`,
          ),

        lastModified:
          item.updatedAt,
      }),
    );

  return [
    staticRoutes[0],
    staticRoutes[1],
    ...guideRoutes,
    staticRoutes[2],
    ...knowledgeRoutes,
    staticRoutes[3],
    staticRoutes[4],
  ];
}