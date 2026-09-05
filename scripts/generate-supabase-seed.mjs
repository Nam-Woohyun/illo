import {
  mkdirSync,
  writeFileSync,
} from "node:fs";

import { categories } from "../src/data/categories.ts";
import { guideSituations } from "../src/data/guides.ts";
import { knowledge } from "../src/data/knowledge.ts";
import {
  knowledgeGuides,
  knowledgeRelations,
  knowledgeSources,
} from "../src/data/relations.ts";
import { sources } from "../src/data/sources.ts";

function sqlText(value) {
  return `'${String(value).replaceAll(
    "'",
    "''",
  )}'`;
}

function sqlNullableText(value) {
  if (value === null) {
    return "null";
  }

  return sqlText(value);
}

function sqlDate(value) {
  if (value === null) {
    return "null";
  }

  return `${sqlText(value)}::date`;
}

function sqlTimestamp(value) {
  if (value === null) {
    return "null";
  }

  return `${sqlText(
    value,
  )}::timestamptz`;
}

function sqlBoolean(value) {
  return value ? "true" : "false";
}

function sqlTextArray(values) {
  if (values.length === 0) {
    return "array[]::text[]";
  }

  return `array[${values
    .map((value) => sqlText(value))
    .join(", ")}]::text[]`;
}

function sqlJsonb(value) {
  return `${sqlText(
    JSON.stringify(value),
  )}::jsonb`;
}

function requireById(
  items,
  id,
  label,
) {
  const item = items.find(
    (candidate) =>
      candidate.id === id,
  );

  if (!item) {
    throw new Error(
      `[Seed 생성 실패] ${label}: ${id}`,
    );
  }

  return item;
}

const lines = [];

function line(value = "") {
  lines.push(value);
}

line("-- =========================================================");
line("-- ILLO Supabase Seed");
line("-- AUTO-GENERATED from src/data/*.ts");
line("--");
line("-- 직접 수정하지 말고:");
line("-- node scripts/generate-supabase-seed.mjs");
line("-- 를 다시 실행하세요.");
line("-- =========================================================");
line();
line("begin;");
line();


/*
 * Categories
 */
line("-- =========================================================");
line("-- Categories");
line("-- =========================================================");
line();

for (const category of categories) {
  line(`
insert into public.categories (
  name,
  slug
)
values (
  ${sqlText(category.name)},
  ${sqlText(category.slug)}
)
on conflict (slug)
do update set
  name = excluded.name;
`.trim());

  line();
}


/*
 * Guide Situations
 */
line("-- =========================================================");
line("-- Guide Situations");
line("-- =========================================================");
line();

for (const guide of guideSituations) {
  line(`
insert into public.guide_situations (
  name,
  slug
)
values (
  ${sqlText(guide.name)},
  ${sqlText(guide.slug)}
)
on conflict (slug)
do update set
  name = excluded.name;
`.trim());

  line();
}


/*
 * Sources
 */
line("-- =========================================================");
line("-- Sources");
line("-- =========================================================");
line();

for (const source of sources) {
  line(`
insert into public.sources (
  source_type,
  organization,
  title,
  url,
  published_at,
  effective_date,
  law_name,
  article_reference,
  reference_number,
  last_verified_at
)
values (
  ${sqlText(source.sourceType)},
  ${sqlText(source.organization)},
  ${sqlText(source.title)},
  ${sqlText(source.url)},
  ${sqlDate(source.publishedAt)},
  ${sqlDate(source.effectiveDate)},
  ${sqlNullableText(source.lawName)},
  ${sqlNullableText(source.articleReference)},
  ${sqlNullableText(source.referenceNumber)},
  ${sqlDate(source.lastVerifiedAt)}
)
on conflict (organization, title)
do update set
  source_type = excluded.source_type,
  url = excluded.url,
  published_at = excluded.published_at,
  effective_date = excluded.effective_date,
  law_name = excluded.law_name,
  article_reference = excluded.article_reference,
  reference_number = excluded.reference_number,
  last_verified_at = excluded.last_verified_at;
`.trim());

  line();
}


/*
 * Knowledge
 */
line("-- =========================================================");
line("-- Knowledge");
line("-- =========================================================");
line();

for (const item of knowledge) {
  const category = requireById(
    categories,
    item.categoryId,
    `Knowledge category — ${item.title}`,
  );

  line(`
insert into public.knowledge (
  title,
  slug,
  summary,
  easy_explanation,
  applies_to,
  key_points,
  examples,
  check_points,
  category_id,
  keywords,
  intents,
  related_questions,
  status,
  published_at,
  last_reviewed_at,
  updated_at
)
values (
  ${sqlText(item.title)},
  ${sqlText(item.slug)},
  ${sqlText(item.summary)},
  ${sqlText(item.easyExplanation)},
  ${sqlTextArray(item.appliesTo)},
  ${sqlJsonb(item.keyPoints)},
  ${sqlJsonb(item.examples)},
  ${sqlJsonb(item.checkPoints)},
  (
    select id
    from public.categories
    where slug = ${sqlText(category.slug)}
  ),
  ${sqlTextArray(item.keywords)},
  ${sqlTextArray(item.intents)},
  ${sqlTextArray(item.relatedQuestions)},
  ${sqlText(item.status)},
  ${sqlDate(item.publishedAt)},
  ${sqlDate(item.lastReviewedAt)},
  ${sqlTimestamp(item.updatedAt)}
)
on conflict (slug)
do update set
  title = excluded.title,
  summary = excluded.summary,
  easy_explanation = excluded.easy_explanation,
  applies_to = excluded.applies_to,
  key_points = excluded.key_points,
  examples = excluded.examples,
  check_points = excluded.check_points,
  category_id = excluded.category_id,
  keywords = excluded.keywords,
  intents = excluded.intents,
  related_questions = excluded.related_questions,
  status = excluded.status,
  published_at = excluded.published_at,
  last_reviewed_at = excluded.last_reviewed_at,
  updated_at = excluded.updated_at;
`.trim());

  line();
}


/*
 * Knowledge ↔ Guide
 */
line("-- =========================================================");
line("-- Knowledge Guides");
line("-- =========================================================");
line();

for (const relation of knowledgeGuides) {
  const knowledgeItem = requireById(
    knowledge,
    relation.knowledgeId,
    "KnowledgeGuide knowledge",
  );

  const guide = requireById(
    guideSituations,
    relation.guideId,
    "KnowledgeGuide guide",
  );

  line(`
insert into public.knowledge_guides (
  knowledge_id,
  guide_id,
  is_primary,
  display_order
)
select
  k.id,
  g.id,
  ${sqlBoolean(relation.isPrimary)},
  ${relation.displayOrder}
from
  public.knowledge k,
  public.guide_situations g
where
  k.slug = ${sqlText(knowledgeItem.slug)}
  and g.slug = ${sqlText(guide.slug)}
on conflict (knowledge_id, guide_id)
do update set
  is_primary = excluded.is_primary,
  display_order = excluded.display_order;
`.trim());

  line();
}


/*
 * Knowledge ↔ Source
 */
line("-- =========================================================");
line("-- Knowledge Sources");
line("-- =========================================================");
line();

for (const relation of knowledgeSources) {
  const knowledgeItem = requireById(
    knowledge,
    relation.knowledgeId,
    "KnowledgeSource knowledge",
  );

  const source = requireById(
    sources,
    relation.sourceId,
    "KnowledgeSource source",
  );

  line(`
insert into public.knowledge_sources (
  knowledge_id,
  source_id,
  role,
  note,
  display_order
)
select
  k.id,
  s.id,
  ${sqlText(relation.role)},
  ${sqlNullableText(relation.note)},
  ${relation.displayOrder}
from
  public.knowledge k,
  public.sources s
where
  k.slug = ${sqlText(knowledgeItem.slug)}
  and s.organization = ${sqlText(source.organization)}
  and s.title = ${sqlText(source.title)}
on conflict (knowledge_id, source_id)
do update set
  role = excluded.role,
  note = excluded.note,
  display_order = excluded.display_order;
`.trim());

  line();
}


/*
 * Knowledge ↔ Related Knowledge
 */
line("-- =========================================================");
line("-- Knowledge Relations");
line("-- =========================================================");
line();

for (const relation of knowledgeRelations) {
  const sourceKnowledge =
    requireById(
      knowledge,
      relation.knowledgeId,
      "KnowledgeRelation source",
    );

  const relatedKnowledge =
    requireById(
      knowledge,
      relation.relatedKnowledgeId,
      "KnowledgeRelation related",
    );

  line(`
insert into public.knowledge_relations (
  knowledge_id,
  related_knowledge_id,
  display_order
)
select
  source_knowledge.id,
  related_knowledge.id,
  ${relation.displayOrder}
from
  public.knowledge source_knowledge,
  public.knowledge related_knowledge
where
  source_knowledge.slug =
    ${sqlText(sourceKnowledge.slug)}
  and related_knowledge.slug =
    ${sqlText(relatedKnowledge.slug)}
on conflict (
  knowledge_id,
  related_knowledge_id
)
do update set
  display_order = excluded.display_order;
`.trim());

  line();
}

line("commit;");
line();

mkdirSync(
  new URL("../supabase/", import.meta.url),
  {
    recursive: true,
  },
);

const outputUrl = new URL(
  "../supabase/seed.sql",
  import.meta.url,
);

writeFileSync(
  outputUrl,
  `${lines.join("\n")}\n`,
  "utf8",
);

console.log("");
console.log("ILLO Supabase Seed Generator");
console.log("----------------------------");
console.log(
  `Categories: ${categories.length}`,
);
console.log(
  `Guides: ${guideSituations.length}`,
);
console.log(
  `Knowledge: ${knowledge.length}`,
);
console.log(
  `Sources: ${sources.length}`,
);
console.log(
  `KnowledgeGuide relations: ${knowledgeGuides.length}`,
);
console.log(
  `KnowledgeSource relations: ${knowledgeSources.length}`,
);
console.log(
  `KnowledgeRelation relations: ${knowledgeRelations.length}`,
);
console.log("");
console.log(
  "✓ supabase/seed.sql 생성 완료",
);
console.log("");