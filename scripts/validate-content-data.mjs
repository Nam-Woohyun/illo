import { categories } from "../src/data/categories.ts";
import { guideSituations } from "../src/data/guides.ts";
import { knowledge } from "../src/data/knowledge.ts";
import {
  knowledgeGuides,
  knowledgeRelations,
  knowledgeSources,
} from "../src/data/relations.ts";
import { sources } from "../src/data/sources.ts";

function assertUnique(values, label) {
  const seen = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(
        `[중복 ${label}] ${value}`,
      );
    }

    seen.add(value);
  }
}

function assertExists(
  value,
  validValues,
  label,
) {
  if (!validValues.has(value)) {
    throw new Error(
      `[존재하지 않는 ${label}] ${value}`,
    );
  }
}

function validateContentData() {
  const categoryIds = new Set(
    categories.map((item) => item.id),
  );

  const guideIds = new Set(
    guideSituations.map((item) => item.id),
  );

  const knowledgeIds = new Set(
    knowledge.map((item) => item.id),
  );

  const sourceIds = new Set(
    sources.map((item) => item.id),
  );

  /*
   * Slug 중복
   */
  assertUnique(
    knowledge.map((item) => item.slug),
    "Knowledge slug",
  );

  assertUnique(
    categories.map((item) => item.slug),
    "Category slug",
  );

  assertUnique(
    guideSituations.map(
      (item) => item.slug,
    ),
    "Guide slug",
  );

  /*
   * Knowledge → Category
   */
  for (const item of knowledge) {
    assertExists(
      item.categoryId,
      categoryIds,
      `Category ID — Knowledge: ${item.title}`,
    );
  }

  /*
   * KnowledgeGuide
   */
  for (const relation of knowledgeGuides) {
    assertExists(
      relation.knowledgeId,
      knowledgeIds,
      "KnowledgeGuide knowledgeId",
    );

    assertExists(
      relation.guideId,
      guideIds,
      "KnowledgeGuide guideId",
    );
  }

  /*
   * KnowledgeSource
   */
  for (const relation of knowledgeSources) {
    assertExists(
      relation.knowledgeId,
      knowledgeIds,
      "KnowledgeSource knowledgeId",
    );

    assertExists(
      relation.sourceId,
      sourceIds,
      "KnowledgeSource sourceId",
    );
  }

  /*
   * KnowledgeRelation
   */
  for (const relation of knowledgeRelations) {
    assertExists(
      relation.knowledgeId,
      knowledgeIds,
      "KnowledgeRelation knowledgeId",
    );

    assertExists(
      relation.relatedKnowledgeId,
      knowledgeIds,
      "KnowledgeRelation relatedKnowledgeId",
    );

    if (
      relation.knowledgeId ===
      relation.relatedKnowledgeId
    ) {
      throw new Error(
        `[자기 자신을 Related로 연결] ${relation.knowledgeId}`,
      );
    }
  }

  /*
   * 관계 자체 중복
   */
  assertUnique(
    knowledgeGuides.map(
      (relation) =>
        `${relation.knowledgeId}::${relation.guideId}`,
    ),
    "KnowledgeGuide relation",
  );

  assertUnique(
    knowledgeSources.map(
      (relation) =>
        `${relation.knowledgeId}::${relation.sourceId}`,
    ),
    "KnowledgeSource relation",
  );

  assertUnique(
    knowledgeRelations.map(
      (relation) =>
        `${relation.knowledgeId}::${relation.relatedKnowledgeId}`,
    ),
    "KnowledgeRelation",
  );

  console.log("");
  console.log("ILLO Content Data Validation");
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
    "✓ 콘텐츠 데이터 무결성 검증 성공",
  );
  console.log("");
}

validateContentData();