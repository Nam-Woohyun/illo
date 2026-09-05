import "server-only";

import OpenAI from "openai";

const apiKey =
  process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "[OpenAI] OPENAI_API_KEY 환경변수가 없습니다.",
  );
}

export const AI_SEARCH_MODEL =
  "gpt-5.6-terra";

export const openai =
  new OpenAI({
    apiKey,
  });