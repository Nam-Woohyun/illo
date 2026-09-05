-- =========================================================
-- ILLO Supabase Validation
-- =========================================================


-- =========================================================
-- 1. 기본 Row Count
-- =========================================================

select
  (select count(*) from public.categories)
    as categories,

  (select count(*) from public.guide_situations)
    as guide_situations,

  (select count(*) from public.knowledge)
    as knowledge,

  (select count(*) from public.sources)
    as sources,

  (select count(*) from public.knowledge_guides)
    as knowledge_guides,

  (select count(*) from public.knowledge_sources)
    as knowledge_sources,

  (select count(*) from public.knowledge_relations)
    as knowledge_relations;


-- 기대:
-- categories       = 6
-- guide_situations = 5
-- knowledge        = 8


-- =========================================================
-- 2. Knowledge + Category 확인
-- =========================================================

select
  k.title,
  k.slug,
  k.status,
  c.name as category_name,
  c.slug as category_slug
from public.knowledge k
join public.categories c
  on c.id = k.category_id
order by k.title;


-- 정확히 8개가 나오고
-- 모든 Knowledge에 Category가 있어야 한다.


-- =========================================================
-- 3. 중복 Slug 확인
-- =========================================================

select
  slug,
  count(*)
from public.categories
group by slug
having count(*) > 1;

select
  slug,
  count(*)
from public.guide_situations
group by slug
having count(*) > 1;

select
  slug,
  count(*)
from public.knowledge
group by slug
having count(*) > 1;


-- 위 세 Query는 모두 0 rows가 정상.


-- =========================================================
-- 4. Guide 관계 확인
-- =========================================================

select
  g.name as guide,
  k.title as knowledge,
  kg.is_primary,
  kg.display_order
from public.knowledge_guides kg
join public.knowledge k
  on k.id = kg.knowledge_id
join public.guide_situations g
  on g.id = kg.guide_id
order by
  g.slug,
  kg.display_order;


-- =========================================================
-- 5. Source 관계 확인
-- =========================================================

select
  k.title as knowledge,
  ks.role,
  ks.display_order,
  s.organization,
  s.title as source,
  s.url
from public.knowledge_sources ks
join public.knowledge k
  on k.id = ks.knowledge_id
join public.sources s
  on s.id = ks.source_id
order by
  k.slug,
  ks.display_order;


-- =========================================================
-- 6. Related 관계 확인
-- =========================================================

select
  source_knowledge.title
    as knowledge,

  related_knowledge.title
    as related_knowledge,

  kr.display_order

from public.knowledge_relations kr

join public.knowledge source_knowledge
  on source_knowledge.id =
    kr.knowledge_id

join public.knowledge related_knowledge
  on related_knowledge.id =
    kr.related_knowledge_id

order by
  source_knowledge.slug,
  kr.display_order;


-- =========================================================
-- 7. Public Role 권한
-- =========================================================

select
  'knowledge' as table_name,

  has_table_privilege(
    'anon',
    'public.knowledge',
    'select'
  ) as anon_select,

  has_table_privilege(
    'anon',
    'public.knowledge',
    'insert'
  ) as anon_insert,

  has_table_privilege(
    'anon',
    'public.knowledge',
    'update'
  ) as anon_update,

  has_table_privilege(
    'anon',
    'public.knowledge',
    'delete'
  ) as anon_delete;


-- 기대:
--
-- anon_select = true
-- anon_insert = false
-- anon_update = false
-- anon_delete = false


-- =========================================================
-- 8. 모든 User-facing Table의 Public Write 검사
-- =========================================================

select
  table_name,

  has_table_privilege(
    'anon',
    format(
      'public.%I',
      table_name
    ),
    'select'
  ) as can_select,

  has_table_privilege(
    'anon',
    format(
      'public.%I',
      table_name
    ),
    'insert'
  ) as can_insert,

  has_table_privilege(
    'anon',
    format(
      'public.%I',
      table_name
    ),
    'update'
  ) as can_update,

  has_table_privilege(
    'anon',
    format(
      'public.%I',
      table_name
    ),
    'delete'
  ) as can_delete

from (
  values
    ('categories'),
    ('guide_situations'),
    ('knowledge'),
    ('sources'),
    ('knowledge_guides'),
    ('knowledge_sources'),
    ('knowledge_relations')
) as tables(table_name);


-- 모든 Row:
--
-- can_select = true
-- can_insert = false
-- can_update = false
-- can_delete = false


-- =========================================================
-- 9. RLS 활성화 확인
-- =========================================================

select
  relname as table_name,
  relrowsecurity as rls_enabled

from pg_class

where relname in (
  'categories',
  'guide_situations',
  'knowledge',
  'sources',
  'knowledge_guides',
  'knowledge_sources',
  'knowledge_relations'
)

order by relname;


-- 모든 테이블에서:
-- rls_enabled = true


-- =========================================================
-- 10. Published 상태 확인
-- =========================================================

select
  status,
  count(*)
from public.knowledge
group by status
order by status;