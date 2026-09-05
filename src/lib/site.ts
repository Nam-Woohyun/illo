import "server-only";

export const SITE_NAME =
  "일로";

export const SITE_TITLE =
  "일로 | 일하다 궁금한 순간, 필요한 정보로";

export const SITE_DESCRIPTION =
  "사회초년생과 근로자가 자신의 상황에서 출발해 필요한 인사노무 정보와 공식 근거를 확인할 수 있도록 돕는 정보 서비스입니다.";

function createSiteUrl(): URL {
  const value =
    process.env.SITE_URL?.trim();

  if (!value) {
    throw new Error(
      "[Site] SITE_URL 환경변수가 없습니다.",
    );
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "[Site] SITE_URL은 유효한 절대 URL이어야 합니다.",
    );
  }

  if (url.protocol !== "https:") {
    throw new Error(
      "[Site] SITE_URL은 https:// URL이어야 합니다.",
    );
  }

  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "[Site] SITE_URL에는 인증정보, Query, Hash를 포함할 수 없습니다.",
    );
  }

  if (
    url.pathname !== "/" &&
    url.pathname !== ""
  ) {
    throw new Error(
      "[Site] SITE_URL에는 경로를 포함하지 마세요.",
    );
  }

  return new URL(url.origin);
}

const siteUrl =
  createSiteUrl();

export function getSiteUrl(): URL {
  return new URL(
    siteUrl.toString(),
  );
}

export function getAbsoluteUrl(
  path = "/",
): string {
  return new URL(
    path,
    siteUrl,
  ).toString();
}