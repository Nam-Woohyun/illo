export type KnowledgeStatus =
  | "draft"
  | "published"
  | "review_needed";

export type SourceType =
  | "law"
  | "government_guide"
  | "case"
  | "administrative_interpretation"
  | "public_institution";

export type KnowledgeSourceRole =
  | "legal_basis"
  | "main_reference"
  | "additional_reference";

export interface KeyPoint {
  title: string;
  body: string;
}

export interface Example {
  title?: string;
  body: string;
}

export interface CheckPoint {
  title?: string;
  body: string;
}

export interface Knowledge {
  id: string;
  title: string;
  slug: string;

  summary: string;
  easyExplanation: string;

  appliesTo: string[];
  keyPoints: KeyPoint[];
  examples: Example[];
  checkPoints: CheckPoint[];

  categoryId: string;

  keywords: string[];
  intents: string[];
  relatedQuestions: string[];

  status: KnowledgeStatus;

  publishedAt: string | null;
  lastReviewedAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface GuideSituation {
  id: string;
  name: string;
  slug: string;
}

export interface KnowledgeGuide {
  knowledgeId: string;
  guideId: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Source {
  id: string;
  sourceType: SourceType;

  organization: string;
  title: string;
  url: string;

  publishedAt: string | null;
  effectiveDate: string | null;

  lawName: string | null;
  articleReference: string | null;
  referenceNumber: string | null;

  lastVerifiedAt: string;
}

export interface KnowledgeSource {
  knowledgeId: string;
  sourceId: string;

  role: KnowledgeSourceRole;

  note: string | null;
  displayOrder: number;
}

export interface KnowledgeRelation {
  knowledgeId: string;
  relatedKnowledgeId: string;
  displayOrder: number;
}