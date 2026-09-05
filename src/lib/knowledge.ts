import "server-only";

import {
  mapCategoryRow,
  mapGuideSituationRow,
  mapKnowledgeGuideRow,
  mapKnowledgeRelationRow,
  mapKnowledgeRow,
  mapKnowledgeSourceRow,
  mapSourceRow,
} from "@/lib/supabase/mappers";

import {
  supabase,
} from "@/lib/supabase/server";

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

interface SupabaseErrorLike {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

/*
 * 현재 DB Schema에는 display_order가 없는
 * 기본 Entity가 있으므로,
 * 기존 Local Data의 사용자 노출 순서를
 * 유지하기 위한 안정적인 slug 순서입니다.
 *
 * 콘텐츠 본문을 복제하는 값은 아닙니다.
 */
const CATEGORY_SLUG_ORDER = [
  "employment-contract",
  "wages-allowances",
  "working-hours-rest",
  "leave-holidays",
  "retirement-dismissal",
  "workplace-protection",
] as const;

const GUIDE_SLUG_ORDER = [
  "start-work",
  "work-condition",
  "pay",
  "problem",
  "leave-work",
] as const;

const KNOWLEDGE_SLUG_ORDER = [
  "employment-contract",
  "minimum-wage",
  "statutory-working-hours",
  "annual-leave-basics",
  "severance-pay",
  "dismissal-notice",
  "wage-arrears-response",
  "workplace-harassment",
] as const;

const CATEGORY_COLUMNS =
  "id, name, slug";

const GUIDE_COLUMNS =
  "id, name, slug";

const KNOWLEDGE_COLUMNS = [
  "id",
  "title",
  "slug",
  "summary",
  "easy_explanation",
  "applies_to",
  "key_points",
  "examples",
  "check_points",
  "category_id",
  "keywords",
  "intents",
  "related_questions",
  "status",
  "published_at",
  "last_reviewed_at",
  "updated_at",
].join(", ");

const SOURCE_COLUMNS = [
  "id",
  "source_type",
  "organization",
  "title",
  "url",
  "published_at",
  "effective_date",
  "law_name",
  "article_reference",
  "reference_number",
  "last_verified_at",
].join(", ");

function throwSupabaseError(
  context: string,
  error: SupabaseErrorLike | null,
): void {
  if (!error) {
    return;
  }

  console.error(
    `[Supabase] ${context}`,
    {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    },
  );

  throw new Error(
    `[Supabase] ${context} 실패`,
  );
}

function requireRows<T>(
  context: string,
  data: T[] | null,
): T[] {
  if (data === null) {
    throw new Error(
      `[Supabase] ${context}: 응답 data가 null입니다.`,
    );
  }

  return data;
}

function sortBySlugOrder<
  T extends {
    slug: string;
  },
>(
  items: T[],
  order: readonly string[],
): T[] {
  const orderMap = new Map(
    order.map(
      (slug, index) => [
        slug,
        index,
      ],
    ),
  );

  return [...items].sort(
    (a, b) => {
      const aOrder =
        orderMap.get(a.slug);

      const bOrder =
        orderMap.get(b.slug);

      if (
        aOrder !== undefined &&
        bOrder !== undefined
      ) {
        return aOrder - bOrder;
      }

      if (aOrder !== undefined) {
        return -1;
      }

      if (bOrder !== undefined) {
        return 1;
      }

      return a.slug.localeCompare(
        b.slug,
      );
    },
  );
}

function requireKnowledgeFromMap(
  knowledgeById: Map<
    string,
    Knowledge
  >,
  id: string,
  context: string,
): Knowledge {
  const item =
    knowledgeById.get(id);

  if (!item) {
    throw new Error(
      `[Supabase data] ${context}: 연결된 Knowledge ${id}를 찾을 수 없습니다.`,
    );
  }

  return item;
}

/*
 * Category
 */

export async function getAllCategories(): Promise<
  Category[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS);

  throwSupabaseError(
    "Category 목록 조회",
    error,
  );

  const rows =
    requireRows(
      "Category 목록 조회",
      data,
    );

  const categories =
    rows.map(mapCategoryRow);

  return sortBySlugOrder(
    categories,
    CATEGORY_SLUG_ORDER,
  );
}

export async function getCategoryById(
  id: string,
): Promise<Category | null> {
  const {
    data,
    error,
  } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  throwSupabaseError(
    "Category ID 조회",
    error,
  );

  if (!data) {
    return null;
  }

  return mapCategoryRow(data);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const {
    data,
    error,
  } = await supabase
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  throwSupabaseError(
    "Category slug 조회",
    error,
  );

  if (!data) {
    return null;
  }

  return mapCategoryRow(data);
}

/*
 * Guide Situation
 */

export async function getAllGuideSituations(): Promise<
  GuideSituation[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("guide_situations")
    .select(GUIDE_COLUMNS);

  throwSupabaseError(
    "Guide 목록 조회",
    error,
  );

  const rows =
    requireRows(
      "Guide 목록 조회",
      data,
    );

  const guides =
    rows.map(
      mapGuideSituationRow,
    );

  return sortBySlugOrder(
    guides,
    GUIDE_SLUG_ORDER,
  );
}

export async function getGuideSituationBySlug(
  slug: string,
): Promise<GuideSituation | null> {
  const {
    data,
    error,
  } = await supabase
    .from("guide_situations")
    .select(GUIDE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  throwSupabaseError(
    "Guide slug 조회",
    error,
  );

  if (!data) {
    return null;
  }

  return mapGuideSituationRow(
    data,
  );
}

/*
 * Knowledge
 */

/*
 * Public App 호환용 API.
 *
 * Publishable Key + RLS에서는
 * draft / review_needed를 읽을 수 없으므로
 * 이 함수도 Public에 보이는 Knowledge만
 * 반환합니다.
 *
 * 관리자용 "모든 상태 조회" API가 아닙니다.
 */
export async function getAllKnowledge(): Promise<
  Knowledge[]
> {
  return getPublishedKnowledge();
}

export async function getPublishedKnowledge(): Promise<
  Knowledge[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("knowledge")
    .select(KNOWLEDGE_COLUMNS)
    .eq(
      "status",
      "published",
    );

  throwSupabaseError(
    "Published Knowledge 목록 조회",
    error,
  );

  const rows =
    requireRows(
      "Published Knowledge 목록 조회",
      data,
    );

  const items =
    rows.map(mapKnowledgeRow);

  return sortBySlugOrder(
    items,
    KNOWLEDGE_SLUG_ORDER,
  );
}

export async function getKnowledgeBySlug(
  slug: string,
): Promise<Knowledge | null> {
  const {
    data,
    error,
  } = await supabase
    .from("knowledge")
    .select(KNOWLEDGE_COLUMNS)
    .eq("slug", slug)
    .eq(
      "status",
      "published",
    )
    .maybeSingle();

  throwSupabaseError(
    "Knowledge slug 조회",
    error,
  );

  if (!data) {
    return null;
  }

  return mapKnowledgeRow(data);
}

export async function getKnowledgeByCategory(
  categorySlug: string,
): Promise<Knowledge[]> {
  const category =
    await getCategoryBySlug(
      categorySlug,
    );

  if (!category) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("knowledge")
    .select(KNOWLEDGE_COLUMNS)
    .eq(
      "category_id",
      category.id,
    )
    .eq(
      "status",
      "published",
    );

  throwSupabaseError(
    "Category별 Knowledge 조회",
    error,
  );

  const rows =
    requireRows(
      "Category별 Knowledge 조회",
      data,
    );

  const items =
    rows.map(mapKnowledgeRow);

  return sortBySlugOrder(
    items,
    KNOWLEDGE_SLUG_ORDER,
  );
}

/*
 * Guide Relation
 */

export async function getKnowledgeByGuide(
  guideSlug: string,
): Promise<KnowledgeForGuide[]> {
  const guide =
    await getGuideSituationBySlug(
      guideSlug,
    );

  if (!guide) {
    return [];
  }

  const {
    data: relationData,
    error: relationError,
  } = await supabase
    .from("knowledge_guides")
    .select(
      [
        "knowledge_id",
        "guide_id",
        "is_primary",
        "display_order",
      ].join(", "),
    )
    .eq(
      "guide_id",
      guide.id,
    )
    .order(
      "display_order",
      {
        ascending: true,
      },
    );

  throwSupabaseError(
    "Guide Knowledge 관계 조회",
    relationError,
  );

  const relationRows =
    requireRows(
      "Guide Knowledge 관계 조회",
      relationData,
    );

  const relations =
    relationRows.map(
      mapKnowledgeGuideRow,
    );

  if (relations.length === 0) {
    return [];
  }

  const knowledgeIds = [
    ...new Set(
      relations.map(
        (relation) =>
          relation.knowledgeId,
      ),
    ),
  ];

  const {
    data: knowledgeData,
    error: knowledgeError,
  } = await supabase
    .from("knowledge")
    .select(KNOWLEDGE_COLUMNS)
    .in(
      "id",
      knowledgeIds,
    )
    .eq(
      "status",
      "published",
    );

  throwSupabaseError(
    "Guide 연결 Knowledge 조회",
    knowledgeError,
  );

  const knowledgeRows =
    requireRows(
      "Guide 연결 Knowledge 조회",
      knowledgeData,
    );

  const knowledgeItems =
    knowledgeRows.map(
      mapKnowledgeRow,
    );

  const knowledgeById =
    new Map(
      knowledgeItems.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  const result:
    KnowledgeForGuide[] = [];

  for (const relation of relations) {
    const item =
      requireKnowledgeFromMap(
        knowledgeById,
        relation.knowledgeId,
        "Guide Knowledge 관계",
      );

    result.push({
      knowledge: item,
      isPrimary:
        relation.isPrimary,
      displayOrder:
        relation.displayOrder,
    });
  }

  return result;
}

/*
 * Related Knowledge
 */

export async function getRelatedKnowledge(
  knowledgeId: string,
): Promise<Knowledge[]> {
  const {
    data: relationData,
    error: relationError,
  } = await supabase
    .from(
      "knowledge_relations",
    )
    .select(
      [
        "knowledge_id",
        "related_knowledge_id",
        "display_order",
      ].join(", "),
    )
    .eq(
      "knowledge_id",
      knowledgeId,
    )
    .order(
      "display_order",
      {
        ascending: true,
      },
    );

  throwSupabaseError(
    "Related Knowledge 관계 조회",
    relationError,
  );

  const relationRows =
    requireRows(
      "Related Knowledge 관계 조회",
      relationData,
    );

  const relations =
    relationRows.map(
      mapKnowledgeRelationRow,
    );

  if (relations.length === 0) {
    return [];
  }

  const relatedIds = [
    ...new Set(
      relations.map(
        (relation) =>
          relation.relatedKnowledgeId,
      ),
    ),
  ];

  const {
    data: knowledgeData,
    error: knowledgeError,
  } = await supabase
    .from("knowledge")
    .select(KNOWLEDGE_COLUMNS)
    .in(
      "id",
      relatedIds,
    )
    .eq(
      "status",
      "published",
    );

  throwSupabaseError(
    "Related Knowledge 본문 조회",
    knowledgeError,
  );

  const knowledgeRows =
    requireRows(
      "Related Knowledge 본문 조회",
      knowledgeData,
    );

  const knowledgeItems =
    knowledgeRows.map(
      mapKnowledgeRow,
    );

  const knowledgeById =
    new Map(
      knowledgeItems.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  const result: Knowledge[] = [];

  for (const relation of relations) {
    const item =
      requireKnowledgeFromMap(
        knowledgeById,
        relation.relatedKnowledgeId,
        "Related Knowledge 관계",
      );

    result.push(item);
  }

  return result;
}

/*
 * Sources
 */

export async function getSourcesForKnowledge(
  knowledgeId: string,
): Promise<SourceForKnowledge[]> {
  const {
    data: relationData,
    error: relationError,
  } = await supabase
    .from(
      "knowledge_sources",
    )
    .select(
      [
        "knowledge_id",
        "source_id",
        "role",
        "note",
        "display_order",
      ].join(", "),
    )
    .eq(
      "knowledge_id",
      knowledgeId,
    )
    .order(
      "display_order",
      {
        ascending: true,
      },
    );

  throwSupabaseError(
    "Knowledge Source 관계 조회",
    relationError,
  );

  const relationRows =
    requireRows(
      "Knowledge Source 관계 조회",
      relationData,
    );

  const relations =
    relationRows.map(
      mapKnowledgeSourceRow,
    );

  if (relations.length === 0) {
    return [];
  }

  const sourceIds = [
    ...new Set(
      relations.map(
        (relation) =>
          relation.sourceId,
      ),
    ),
  ];

  const {
    data: sourceData,
    error: sourceError,
  } = await supabase
    .from("sources")
    .select(SOURCE_COLUMNS)
    .in(
      "id",
      sourceIds,
    );

  throwSupabaseError(
    "Source 본문 조회",
    sourceError,
  );

  const sourceRows =
    requireRows(
      "Source 본문 조회",
      sourceData,
    );

  const sourceItems =
    sourceRows.map(
      mapSourceRow,
    );

  const sourceById =
    new Map(
      sourceItems.map(
        (source) => [
          source.id,
          source,
        ],
      ),
    );

  const result:
    SourceForKnowledge[] = [];

  for (const relation of relations) {
    const source =
      sourceById.get(
        relation.sourceId,
      );

    if (!source) {
      throw new Error(
        `[Supabase data] Knowledge Source 관계: Source ${relation.sourceId}를 찾을 수 없습니다.`,
      );
    }

    result.push({
      source,
      role:
        relation.role,
      note:
        relation.note,
      displayOrder:
        relation.displayOrder,
    });
  }

  return result;
}