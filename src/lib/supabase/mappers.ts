import "server-only";

import type {
  Category,
  CheckPoint,
  Example,
  GuideSituation,
  KeyPoint,
  Knowledge,
  KnowledgeGuide,
  KnowledgeRelation,
  KnowledgeSource,
  KnowledgeSourceRole,
  KnowledgeStatus,
  Source,
  SourceType,
} from "@/types/content";

type UnknownRecord =
  Record<string, unknown>;

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
}

export interface GuideSituationRow {
  id: string;
  name: string;
  slug: string;
}

export interface KnowledgeRow {
  id: string;
  title: string;
  slug: string;

  summary: string;
  easy_explanation: string;

  applies_to: string[];

  key_points: unknown;
  examples: unknown;
  check_points: unknown;

  category_id: string;

  keywords: string[];
  intents: string[];
  related_questions: string[];

  status: KnowledgeStatus;

  published_at: string | null;
  last_reviewed_at: string;
  updated_at: string;
}

export interface SourceRow {
  id: string;

  source_type: SourceType;

  organization: string;
  title: string;
  url: string;

  published_at: string | null;
  effective_date: string | null;

  law_name: string | null;
  article_reference: string | null;
  reference_number: string | null;

  last_verified_at: string;
}

export interface KnowledgeGuideRow {
  knowledge_id: string;
  guide_id: string;
  is_primary: boolean;
  display_order: number;
}

export interface KnowledgeSourceRow {
  knowledge_id: string;
  source_id: string;
  role: KnowledgeSourceRole;
  note: string | null;
  display_order: number;
}

export interface KnowledgeRelationRow {
  knowledge_id: string;
  related_knowledge_id: string;
  display_order: number;
}

function dataError(
  context: string,
  message: string,
): never {
  throw new Error(
    `[Supabase data] ${context}: ${message}`,
  );
}

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function requireRecord(
  value: unknown,
  context: string,
): UnknownRecord {
  if (!isRecord(value)) {
    return dataError(
      context,
      "객체 형태가 아닙니다.",
    );
  }

  return value;
}

function requireString(
  record: UnknownRecord,
  key: string,
  context: string,
): string {
  const value = record[key];

  if (typeof value !== "string") {
    return dataError(
      context,
      `${key}가 문자열이 아닙니다.`,
    );
  }

  return value;
}

function nullableString(
  record: UnknownRecord,
  key: string,
  context: string,
): string | null {
  const value = record[key];

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return dataError(
      context,
      `${key}가 문자열 또는 null이 아닙니다.`,
    );
  }

  return value;
}

function optionalString(
  record: UnknownRecord,
  key: string,
  context: string,
): string | undefined {
  const value = record[key];

  if (
    value === undefined ||
    value === null
  ) {
    return undefined;
  }

  if (typeof value !== "string") {
    return dataError(
      context,
      `${key}가 문자열이 아닙니다.`,
    );
  }

  return value;
}

function requireStringArray(
  record: UnknownRecord,
  key: string,
  context: string,
): string[] {
  const value = record[key];

  if (
    !Array.isArray(value) ||
    !value.every(
      (item) =>
        typeof item === "string",
    )
  ) {
    return dataError(
      context,
      `${key}가 string[] 형태가 아닙니다.`,
    );
  }

  return value;
}

function requireBoolean(
  record: UnknownRecord,
  key: string,
  context: string,
): boolean {
  const value = record[key];

  if (typeof value !== "boolean") {
    return dataError(
      context,
      `${key}가 boolean이 아닙니다.`,
    );
  }

  return value;
}

function requireInteger(
  record: UnknownRecord,
  key: string,
  context: string,
): number {
  const value = record[key];

  if (
    typeof value !== "number" ||
    !Number.isInteger(value)
  ) {
    return dataError(
      context,
      `${key}가 정수가 아닙니다.`,
    );
  }

  return value;
}

function isKnowledgeStatus(
  value: string,
): value is KnowledgeStatus {
  return (
    value === "draft" ||
    value === "published" ||
    value === "review_needed"
  );
}

function isSourceType(
  value: string,
): value is SourceType {
  return (
    value === "law" ||
    value === "government_guide" ||
    value === "case" ||
    value ===
      "administrative_interpretation" ||
    value === "public_institution"
  );
}

function isKnowledgeSourceRole(
  value: string,
): value is KnowledgeSourceRole {
  return (
    value === "legal_basis" ||
    value === "main_reference" ||
    value === "additional_reference"
  );
}

function mapKeyPoints(
  value: unknown,
  context: string,
): KeyPoint[] {
  if (!Array.isArray(value)) {
    return dataError(
      context,
      "key_points가 배열이 아닙니다.",
    );
  }

  return value.map(
    (item, index) => {
      const itemContext =
        `${context}.key_points[${index}]`;

      const record =
        requireRecord(
          item,
          itemContext,
        );

      return {
        title: requireString(
          record,
          "title",
          itemContext,
        ),
        body: requireString(
          record,
          "body",
          itemContext,
        ),
      };
    },
  );
}

function mapExamples(
  value: unknown,
  context: string,
): Example[] {
  if (!Array.isArray(value)) {
    return dataError(
      context,
      "examples가 배열이 아닙니다.",
    );
  }

  return value.map(
    (item, index) => {
      const itemContext =
        `${context}.examples[${index}]`;

      const record =
        requireRecord(
          item,
          itemContext,
        );

      const title =
        optionalString(
          record,
          "title",
          itemContext,
        );

      const body =
        requireString(
          record,
          "body",
          itemContext,
        );

      if (title === undefined) {
        return {
          body,
        };
      }

      return {
        title,
        body,
      };
    },
  );
}

function mapCheckPoints(
  value: unknown,
  context: string,
): CheckPoint[] {
  if (!Array.isArray(value)) {
    return dataError(
      context,
      "check_points가 배열이 아닙니다.",
    );
  }

  return value.map(
    (item, index) => {
      const itemContext =
        `${context}.check_points[${index}]`;

      const record =
        requireRecord(
          item,
          itemContext,
        );

      const title =
        optionalString(
          record,
          "title",
          itemContext,
        );

      const body =
        requireString(
          record,
          "body",
          itemContext,
        );

      if (title === undefined) {
        return {
          body,
        };
      }

      return {
        title,
        body,
      };
    },
  );
}

export function mapCategoryRow(
  value: unknown,
): Category {
  const context = "categories";

  const record =
    requireRecord(
      value,
      context,
    );

  const row: CategoryRow = {
    id: requireString(
      record,
      "id",
      context,
    ),
    name: requireString(
      record,
      "name",
      context,
    ),
    slug: requireString(
      record,
      "slug",
      context,
    ),
  };

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}

export function mapGuideSituationRow(
  value: unknown,
): GuideSituation {
  const context =
    "guide_situations";

  const record =
    requireRecord(
      value,
      context,
    );

  const row: GuideSituationRow = {
    id: requireString(
      record,
      "id",
      context,
    ),
    name: requireString(
      record,
      "name",
      context,
    ),
    slug: requireString(
      record,
      "slug",
      context,
    ),
  };

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}

export function mapKnowledgeRow(
  value: unknown,
): Knowledge {
  const context = "knowledge";

  const record =
    requireRecord(
      value,
      context,
    );

  const statusValue =
    requireString(
      record,
      "status",
      context,
    );

  if (
    !isKnowledgeStatus(
      statusValue,
    )
  ) {
    return dataError(
      context,
      `허용되지 않은 status: ${statusValue}`,
    );
  }

  const row: KnowledgeRow = {
    id: requireString(
      record,
      "id",
      context,
    ),
    title: requireString(
      record,
      "title",
      context,
    ),
    slug: requireString(
      record,
      "slug",
      context,
    ),

    summary: requireString(
      record,
      "summary",
      context,
    ),
    easy_explanation:
      requireString(
        record,
        "easy_explanation",
        context,
      ),

    applies_to:
      requireStringArray(
        record,
        "applies_to",
        context,
      ),

    key_points:
      record.key_points,

    examples:
      record.examples,

    check_points:
      record.check_points,

    category_id:
      requireString(
        record,
        "category_id",
        context,
      ),

    keywords:
      requireStringArray(
        record,
        "keywords",
        context,
      ),

    intents:
      requireStringArray(
        record,
        "intents",
        context,
      ),

    related_questions:
      requireStringArray(
        record,
        "related_questions",
        context,
      ),

    status: statusValue,

    published_at:
      nullableString(
        record,
        "published_at",
        context,
      ),

    last_reviewed_at:
      requireString(
        record,
        "last_reviewed_at",
        context,
      ),

    updated_at:
      requireString(
        record,
        "updated_at",
        context,
      ),
  };

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,

    summary: row.summary,

    easyExplanation:
      row.easy_explanation,

    appliesTo:
      row.applies_to,

    keyPoints:
      mapKeyPoints(
        row.key_points,
        `knowledge.${row.slug}`,
      ),

    examples:
      mapExamples(
        row.examples,
        `knowledge.${row.slug}`,
      ),

    checkPoints:
      mapCheckPoints(
        row.check_points,
        `knowledge.${row.slug}`,
      ),

    categoryId:
      row.category_id,

    keywords:
      row.keywords,

    intents:
      row.intents,

    relatedQuestions:
      row.related_questions,

    status:
      row.status,

    publishedAt:
      row.published_at,

    lastReviewedAt:
      row.last_reviewed_at,

    updatedAt:
      row.updated_at,
  };
}

export function mapSourceRow(
  value: unknown,
): Source {
  const context = "sources";

  const record =
    requireRecord(
      value,
      context,
    );

  const sourceTypeValue =
    requireString(
      record,
      "source_type",
      context,
    );

  if (
    !isSourceType(
      sourceTypeValue,
    )
  ) {
    return dataError(
      context,
      `허용되지 않은 source_type: ${sourceTypeValue}`,
    );
  }

  const row: SourceRow = {
    id: requireString(
      record,
      "id",
      context,
    ),

    source_type:
      sourceTypeValue,

    organization:
      requireString(
        record,
        "organization",
        context,
      ),

    title:
      requireString(
        record,
        "title",
        context,
      ),

    url:
      requireString(
        record,
        "url",
        context,
      ),

    published_at:
      nullableString(
        record,
        "published_at",
        context,
      ),

    effective_date:
      nullableString(
        record,
        "effective_date",
        context,
      ),

    law_name:
      nullableString(
        record,
        "law_name",
        context,
      ),

    article_reference:
      nullableString(
        record,
        "article_reference",
        context,
      ),

    reference_number:
      nullableString(
        record,
        "reference_number",
        context,
      ),

    last_verified_at:
      requireString(
        record,
        "last_verified_at",
        context,
      ),
  };

  return {
    id: row.id,

    sourceType:
      row.source_type,

    organization:
      row.organization,

    title:
      row.title,

    url:
      row.url,

    publishedAt:
      row.published_at,

    effectiveDate:
      row.effective_date,

    lawName:
      row.law_name,

    articleReference:
      row.article_reference,

    referenceNumber:
      row.reference_number,

    lastVerifiedAt:
      row.last_verified_at,
  };
}

export function mapKnowledgeGuideRow(
  value: unknown,
): KnowledgeGuide {
  const context =
    "knowledge_guides";

  const record =
    requireRecord(
      value,
      context,
    );

  const row: KnowledgeGuideRow = {
    knowledge_id:
      requireString(
        record,
        "knowledge_id",
        context,
      ),

    guide_id:
      requireString(
        record,
        "guide_id",
        context,
      ),

    is_primary:
      requireBoolean(
        record,
        "is_primary",
        context,
      ),

    display_order:
      requireInteger(
        record,
        "display_order",
        context,
      ),
  };

  return {
    knowledgeId:
      row.knowledge_id,

    guideId:
      row.guide_id,

    isPrimary:
      row.is_primary,

    displayOrder:
      row.display_order,
  };
}

export function mapKnowledgeSourceRow(
  value: unknown,
): KnowledgeSource {
  const context =
    "knowledge_sources";

  const record =
    requireRecord(
      value,
      context,
    );

  const roleValue =
    requireString(
      record,
      "role",
      context,
    );

  if (
    !isKnowledgeSourceRole(
      roleValue,
    )
  ) {
    return dataError(
      context,
      `허용되지 않은 role: ${roleValue}`,
    );
  }

  const row: KnowledgeSourceRow = {
    knowledge_id:
      requireString(
        record,
        "knowledge_id",
        context,
      ),

    source_id:
      requireString(
        record,
        "source_id",
        context,
      ),

    role:
      roleValue,

    note:
      nullableString(
        record,
        "note",
        context,
      ),

    display_order:
      requireInteger(
        record,
        "display_order",
        context,
      ),
  };

  return {
    knowledgeId:
      row.knowledge_id,

    sourceId:
      row.source_id,

    role:
      row.role,

    note:
      row.note,

    displayOrder:
      row.display_order,
  };
}

export function mapKnowledgeRelationRow(
  value: unknown,
): KnowledgeRelation {
  const context =
    "knowledge_relations";

  const record =
    requireRecord(
      value,
      context,
    );

  const row: KnowledgeRelationRow = {
    knowledge_id:
      requireString(
        record,
        "knowledge_id",
        context,
      ),

    related_knowledge_id:
      requireString(
        record,
        "related_knowledge_id",
        context,
      ),

    display_order:
      requireInteger(
        record,
        "display_order",
        context,
      ),
  };

  return {
    knowledgeId:
      row.knowledge_id,

    relatedKnowledgeId:
      row.related_knowledge_id,

    displayOrder:
      row.display_order,
  };
}