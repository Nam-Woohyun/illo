import "server-only";

import type {
  Metadata,
} from "next";

import {
  SITE_NAME,
} from "@/lib/site";

interface CreatePageMetadataOptions {
  title: string;
  description: string;
  path: string;

  absoluteTitle?: boolean;
  canonical?: boolean;

  robots?:
    Metadata["robots"];
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  canonical = true,
  robots,
}: CreatePageMetadataOptions): Metadata {
  const socialTitle =
    absoluteTitle
      ? title
      : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle
      ? {
          absolute: title,
        }
      : title,

    description,

    alternates: canonical
      ? {
          canonical: path,
        }
      : undefined,

    robots,

    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName:
        SITE_NAME,
      title:
        socialTitle,
      description,
      url: path,
    },

    twitter: {
      card:
        "summary_large_image",
      title:
        socialTitle,
      description,
    },
  };
}