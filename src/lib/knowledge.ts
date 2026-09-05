import { categories } from "@/data/categories";
import { guideSituations } from "@/data/guides";
import { knowledge } from "@/data/knowledge";
import {
  knowledgeGuides,
  knowledgeRelations,
  knowledgeSources,
} from "@/data/relations";
import { sources } from "@/data/sources";

import type {
  Category,
  GuideSituation,
  Knowledge,
  KnowledgeSourceRole,
  Source,
} from "@/types/content";

export interface KnowledgeForGuide {
  knowledge: Knowledge;
  isPrimary: boolean;
  displayOrder: number;
}

export interface SourceForKnowledge {
  source: Source;
  role: KnowledgeSourceRole;
  note: string | null;
  displayOrder: number;
}

export async function getAllCategories(): Promise<
  Category[]
> {
  return [...categories];
}

export async function getCategoryById(
  id: string,
): Promise<Category | null> {
  const category = categories.find(
    (item) => item.id === id,
  );

  return category ?? null;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const category = categories.find(
    (item) => item.slug === slug,
  );

  return category ?? null;
}

export async function getAllGuideSituations(): Promise<
  GuideSituation[]
> {
  return [...guideSituations];
}

export async function getGuideSituationBySlug(
  slug: string,
): Promise<GuideSituation | null> {
  const guide = guideSituations.find(
    (item) => item.slug === slug,
  );

  return guide ?? null;
}

export async function getAllKnowledge(): Promise<
  Knowledge[]
> {
  return [...knowledge];
}

export async function getPublishedKnowledge(): Promise<
  Knowledge[]
> {
  return knowledge.filter(
    (item) => item.status === "published",
  );
}

export async function getKnowledgeBySlug(
  slug: string,
): Promise<Knowledge | null> {
  const item = knowledge.find(
    (knowledgeItem) =>
      knowledgeItem.slug === slug,
  );

  return item ?? null;
}

export async function getKnowledgeByCategory(
  categorySlug: string,
): Promise<Knowledge[]> {
  const category = categories.find(
    (item) => item.slug === categorySlug,
  );

  if (!category) {
    return [];
  }

  return knowledge.filter(
    (item) =>
      item.categoryId === category.id &&
      item.status === "published",
  );
}

export async function getKnowledgeByGuide(
  guideSlug: string,
): Promise<KnowledgeForGuide[]> {
  const guide = guideSituations.find(
    (item) => item.slug === guideSlug,
  );

  if (!guide) {
    return [];
  }

  const relations = knowledgeGuides
    .filter(
      (relation) =>
        relation.guideId === guide.id,
    )
    .sort(
      (a, b) =>
        a.displayOrder - b.displayOrder,
    );

  const result: KnowledgeForGuide[] = [];

  for (const relation of relations) {
    const item = knowledge.find(
      (knowledgeItem) =>
        knowledgeItem.id ===
        relation.knowledgeId,
    );

    if (
      !item ||
      item.status !== "published"
    ) {
      continue;
    }

    result.push({
      knowledge: item,
      isPrimary: relation.isPrimary,
      displayOrder:
        relation.displayOrder,
    });
  }

  return result;
}

export async function getRelatedKnowledge(
  knowledgeId: string,
): Promise<Knowledge[]> {
  const relations = knowledgeRelations
    .filter(
      (relation) =>
        relation.knowledgeId === knowledgeId,
    )
    .sort(
      (a, b) =>
        a.displayOrder - b.displayOrder,
    );

  const result: Knowledge[] = [];

  for (const relation of relations) {
    const item = knowledge.find(
      (knowledgeItem) =>
        knowledgeItem.id ===
        relation.relatedKnowledgeId,
    );

    if (
      !item ||
      item.status !== "published"
    ) {
      continue;
    }

    result.push(item);
  }

  return result;
}

export async function getSourcesForKnowledge(
  knowledgeId: string,
): Promise<SourceForKnowledge[]> {
  const relations = knowledgeSources
    .filter(
      (relation) =>
        relation.knowledgeId === knowledgeId,
    )
    .sort(
      (a, b) =>
        a.displayOrder - b.displayOrder,
    );

  const result: SourceForKnowledge[] = [];

  for (const relation of relations) {
    const source = sources.find(
      (sourceItem) =>
        sourceItem.id === relation.sourceId,
    );

    if (!source) {
      continue;
    }

    result.push({
      source,
      role: relation.role,
      note: relation.note,
      displayOrder:
        relation.displayOrder,
    });
  }

  return result;
}