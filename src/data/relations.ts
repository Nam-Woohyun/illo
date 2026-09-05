import type {
  KnowledgeGuide,
  KnowledgeRelation,
  KnowledgeSource,
} from "@/types/content";

export const knowledgeGuides = [
  // 근로계약서
  {
    knowledgeId: "knowledge-employment-contract",
    guideId: "guide-start-work",
    isPrimary: true,
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-employment-contract",
    guideId: "guide-problem",
    isPrimary: false,
    displayOrder: 4,
  },

  // 최저임금
  {
    knowledgeId: "knowledge-minimum-wage",
    guideId: "guide-pay",
    isPrimary: true,
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-minimum-wage",
    guideId: "guide-start-work",
    isPrimary: false,
    displayOrder: 2,
  },

  // 법정 근로시간
  {
    knowledgeId: "knowledge-statutory-working-hours",
    guideId: "guide-work-condition",
    isPrimary: true,
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-statutory-working-hours",
    guideId: "guide-pay",
    isPrimary: false,
    displayOrder: 3,
  },

  // 연차휴가 기본
  {
    knowledgeId: "knowledge-annual-leave-basics",
    guideId: "guide-work-condition",
    isPrimary: true,
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-annual-leave-basics",
    guideId: "guide-start-work",
    isPrimary: false,
    displayOrder: 3,
  },

  // 퇴직금
  {
    knowledgeId: "knowledge-severance-pay",
    guideId: "guide-leave-work",
    isPrimary: true,
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-severance-pay",
    guideId: "guide-pay",
    isPrimary: false,
    displayOrder: 4,
  },

  // 해고예고
  {
    knowledgeId: "knowledge-dismissal-notice",
    guideId: "guide-problem",
    isPrimary: true,
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-dismissal-notice",
    guideId: "guide-leave-work",
    isPrimary: false,
    displayOrder: 2,
  },

  // 임금체불 대응
  {
    knowledgeId: "knowledge-wage-arrears-response",
    guideId: "guide-problem",
    isPrimary: true,
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-wage-arrears-response",
    guideId: "guide-pay",
    isPrimary: false,
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-wage-arrears-response",
    guideId: "guide-leave-work",
    isPrimary: false,
    displayOrder: 3,
  },

  // 직장 내 괴롭힘
  {
    knowledgeId: "knowledge-workplace-harassment",
    guideId: "guide-problem",
    isPrimary: true,
    displayOrder: 3,
  },
] satisfies KnowledgeGuide[];

export const knowledgeSources = [
  // 근로계약서
  {
    knowledgeId: "knowledge-employment-contract",
    sourceId: "source-labor-standards-act",
    role: "legal_basis",
    note: "제17조, 제114조",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-employment-contract",
    sourceId: "source-labor-standards-decree",
    role: "legal_basis",
    note: "제8조",
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-employment-contract",
    sourceId: "source-fixed-term-part-time-act",
    role: "legal_basis",
    note: "제17조, 제24조",
    displayOrder: 3,
  },
  {
    knowledgeId: "knowledge-employment-contract",
    sourceId: "source-moel-standard-employment-contract-2025",
    role: "main_reference",
    note: null,
    displayOrder: 4,
  },
  {
    knowledgeId: "knowledge-employment-contract",
    sourceId: "source-moel-1350-employment-contract",
    role: "additional_reference",
    note: null,
    displayOrder: 5,
  },

  // 최저임금
  {
    knowledgeId: "knowledge-minimum-wage",
    sourceId: "source-minimum-wage-act",
    role: "legal_basis",
    note: "제3조, 제5조, 제6조, 제7조, 제10조",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-minimum-wage",
    sourceId: "source-minimum-wage-decree",
    role: "legal_basis",
    note: "제3조",
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-minimum-wage",
    sourceId: "source-minimum-wage-notice-2026",
    role: "main_reference",
    note: "2026년 적용 시간급 10,320원",
    displayOrder: 3,
  },
  {
    knowledgeId: "knowledge-minimum-wage",
    sourceId: "source-minimum-wage-committee-2026",
    role: "main_reference",
    note: "시간급·일급·월 환산액 확인",
    displayOrder: 4,
  },
  {
    knowledgeId: "knowledge-minimum-wage",
    sourceId: "source-moel-minimum-wage-2026",
    role: "main_reference",
    note: "2026년 최저임금 확정·고시 안내",
    displayOrder: 5,
  },
  {
    knowledgeId: "knowledge-minimum-wage",
    sourceId: "source-labor-portal-minimum-wage",
    role: "additional_reference",
    note: "수습근로자 등 제도 안내",
    displayOrder: 6,
  },

  // 법정 근로시간
  {
    knowledgeId: "knowledge-statutory-working-hours",
    sourceId: "source-labor-standards-act",
    role: "legal_basis",
    note: "제2조, 제11조, 제50조, 제53조, 제54조, 제63조, 제69조",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-statutory-working-hours",
    sourceId: "source-labor-standards-decree",
    role: "legal_basis",
    note: "제7조 및 별표 1",
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-statutory-working-hours",
    sourceId: "source-moel-1350-working-hours",
    role: "main_reference",
    note: "소정근로시간 안내",
    displayOrder: 3,
  },
  {
    knowledgeId: "knowledge-statutory-working-hours",
    sourceId: "source-labor-standards-future-amendment-2026",
    role: "additional_reference",
    note: "제54조 휴게시간 관련 향후 시행사항",
    displayOrder: 4,
  },

  // 연차휴가 기본
  {
    knowledgeId: "knowledge-annual-leave-basics",
    sourceId: "source-labor-standards-act",
    role: "legal_basis",
    note: "제11조, 제18조, 제60조, 제61조",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-annual-leave-basics",
    sourceId: "source-moel-1350-annual-leave",
    role: "main_reference",
    note: "연차유급휴가 발생 기준",
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-annual-leave-basics",
    sourceId: "source-moel-1350-annual-leave-small-workplace",
    role: "additional_reference",
    note: "5인 미만 사업장 적용 안내",
    displayOrder: 3,
  },
  {
    knowledgeId: "knowledge-annual-leave-basics",
    sourceId: "source-labor-standards-future-amendment-2026",
    role: "additional_reference",
    note: "연차 관련 2027년 시행 예정사항",
    displayOrder: 4,
  },

  // 퇴직금
  {
    knowledgeId: "knowledge-severance-pay",
    sourceId: "source-retirement-benefit-act",
    role: "legal_basis",
    note: "제4조, 제8조, 제9조",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-severance-pay",
    sourceId: "source-labor-standards-act",
    role: "legal_basis",
    note: "제2조 평균임금",
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-severance-pay",
    sourceId: "source-retirement-benefit-decree",
    role: "legal_basis",
    note: "퇴직금 지급 관련 시행령",
    displayOrder: 3,
  },
  {
    knowledgeId: "knowledge-severance-pay",
    sourceId: "source-moel-severance-faq",
    role: "main_reference",
    note: "퇴직금 및 평균임금 산정 안내",
    displayOrder: 4,
  },
  {
    knowledgeId: "knowledge-severance-pay",
    sourceId: "source-moel-1350-severance",
    role: "main_reference",
    note: "퇴직금 적용요건 및 지급기한 안내",
    displayOrder: 5,
  },

  // 해고예고
  {
    knowledgeId: "knowledge-dismissal-notice",
    sourceId: "source-labor-standards-act",
    role: "legal_basis",
    note: "제23조, 제26조, 제27조",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-dismissal-notice",
    sourceId: "source-labor-standards-rules",
    role: "legal_basis",
    note: "제4조 및 별표 1",
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-dismissal-notice",
    sourceId: "source-moel-dismissal-notice-faq",
    role: "main_reference",
    note: "30일 예고 및 해고예고수당 안내",
    displayOrder: 3,
  },
  {
    knowledgeId: "knowledge-dismissal-notice",
    sourceId: "source-moel-1350-dismissal-small-workplace",
    role: "main_reference",
    note: "5인 미만 사업장 해고예고 안내",
    displayOrder: 4,
  },

  // 임금체불 대응
  {
    knowledgeId: "knowledge-wage-arrears-response",
    sourceId: "source-labor-standards-act",
    role: "legal_basis",
    note: "제36조, 제43조, 제109조",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-wage-arrears-response",
    sourceId: "source-retirement-benefit-act",
    role: "legal_basis",
    note: "제9조",
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-wage-arrears-response",
    sourceId: "source-minimum-wage-act",
    role: "legal_basis",
    note: "제6조",
    displayOrder: 3,
  },
  {
    knowledgeId: "knowledge-wage-arrears-response",
    sourceId: "source-labor-portal-wage-arrears",
    role: "main_reference",
    note: "진정 및 체불임금 해결절차",
    displayOrder: 4,
  },
  {
    knowledgeId: "knowledge-wage-arrears-response",
    sourceId: "source-labor-portal-petition",
    role: "main_reference",
    note: "온라인 진정서 접수",
    displayOrder: 5,
  },
  {
    knowledgeId: "knowledge-wage-arrears-response",
    sourceId: "source-moel-1350-wage-arrears-evidence",
    role: "additional_reference",
    note: "사실관계 확인 및 증빙자료 안내",
    displayOrder: 6,
  },

  // 직장 내 괴롭힘
  {
    knowledgeId: "knowledge-workplace-harassment",
    sourceId: "source-labor-standards-act",
    role: "legal_basis",
    note: "제76조의2, 제76조의3, 제109조, 제116조",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-workplace-harassment",
    sourceId: "source-labor-standards-decree",
    role: "legal_basis",
    note: "상시 4명 이하 사업장 적용 규정",
    displayOrder: 2,
  },
  {
    knowledgeId: "knowledge-workplace-harassment",
    sourceId: "source-moel-workplace-harassment-manual-2026",
    role: "main_reference",
    note: "2026년 7월 예방·대응 매뉴얼",
    displayOrder: 3,
  },
  {
    knowledgeId: "knowledge-workplace-harassment",
    sourceId: "source-moel-1350-workplace-harassment-elements",
    role: "main_reference",
    note: "법적 판단요소 안내",
    displayOrder: 4,
  },
  {
    knowledgeId: "knowledge-workplace-harassment",
    sourceId: "source-moel-1350-workplace-harassment-evidence",
    role: "additional_reference",
    note: "증빙자료 안내",
    displayOrder: 5,
  },
  {
    knowledgeId: "knowledge-workplace-harassment",
    sourceId: "source-labor-portal-petition",
    role: "additional_reference",
    note: "직장 내 괴롭힘 관련 진정 접수",
    displayOrder: 6,
  },
] satisfies KnowledgeSource[];

export const knowledgeRelations = [
  // 근로계약서
  {
    knowledgeId: "knowledge-employment-contract",
    relatedKnowledgeId: "knowledge-minimum-wage",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-employment-contract",
    relatedKnowledgeId: "knowledge-statutory-working-hours",
    displayOrder: 2,
  },

  // 최저임금
  {
    knowledgeId: "knowledge-minimum-wage",
    relatedKnowledgeId: "knowledge-employment-contract",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-minimum-wage",
    relatedKnowledgeId: "knowledge-wage-arrears-response",
    displayOrder: 2,
  },

  // 법정 근로시간
  {
    knowledgeId: "knowledge-statutory-working-hours",
    relatedKnowledgeId: "knowledge-employment-contract",
    displayOrder: 1,
  },

  // 연차휴가 기본
  {
    knowledgeId: "knowledge-annual-leave-basics",
    relatedKnowledgeId: "knowledge-employment-contract",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-annual-leave-basics",
    relatedKnowledgeId: "knowledge-statutory-working-hours",
    displayOrder: 2,
  },

  // 퇴직금
  {
    knowledgeId: "knowledge-severance-pay",
    relatedKnowledgeId: "knowledge-wage-arrears-response",
    displayOrder: 1,
  },

  // 해고예고
  {
    knowledgeId: "knowledge-dismissal-notice",
    relatedKnowledgeId: "knowledge-wage-arrears-response",
    displayOrder: 1,
  },

  // 임금체불 대응
  {
    knowledgeId: "knowledge-wage-arrears-response",
    relatedKnowledgeId: "knowledge-severance-pay",
    displayOrder: 1,
  },
  {
    knowledgeId: "knowledge-wage-arrears-response",
    relatedKnowledgeId: "knowledge-minimum-wage",
    displayOrder: 2,
  },
] satisfies KnowledgeRelation[];