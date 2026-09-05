-- =========================================================
-- ILLO Supabase Schema
-- Phase 10-A
-- =========================================================


-- =========================================================
-- 1. categories
-- =========================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique
);


-- =========================================================
-- 2. guide_situations
-- =========================================================

create table if not exists public.guide_situations (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique
);


-- =========================================================
-- 3. knowledge
-- =========================================================

create table if not exists public.knowledge (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text not null unique,

  summary text not null,
  easy_explanation text not null,

  applies_to text[] not null default array[]::text[],

  key_points jsonb not null default '[]'::jsonb,
  examples jsonb not null default '[]'::jsonb,
  check_points jsonb not null default '[]'::jsonb,

  category_id uuid not null
    references public.categories(id)
    on delete restrict,

  keywords text[] not null default array[]::text[],
  intents text[] not null default array[]::text[],
  related_questions text[] not null default array[]::text[],

  status text not null
    check (
      status in (
        'draft',
        'published',
        'review_needed'
      )
    ),

  published_at date,
  last_reviewed_at date not null,

  updated_at timestamptz not null default now(),

  constraint knowledge_key_points_array
    check (jsonb_typeof(key_points) = 'array'),

  constraint knowledge_examples_array
    check (jsonb_typeof(examples) = 'array'),

  constraint knowledge_check_points_array
    check (jsonb_typeof(check_points) = 'array')
);


-- =========================================================
-- 4. sources
-- =========================================================

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),

  source_type text not null
    check (
      source_type in (
        'law',
        'government_guide',
        'case',
        'administrative_interpretation',
        'public_institution'
      )
    ),

  organization text not null,
  title text not null,
  url text not null,

  published_at date,
  effective_date date,

  law_name text,
  article_reference text,
  reference_number text,

  last_verified_at date not null,

  constraint sources_organization_title_unique
    unique (organization, title)
);


-- =========================================================
-- 5. knowledge_guides
-- =========================================================

create table if not exists public.knowledge_guides (
  id uuid primary key default gen_random_uuid(),

  knowledge_id uuid not null
    references public.knowledge(id)
    on delete cascade,

  guide_id uuid not null
    references public.guide_situations(id)
    on delete cascade,

  is_primary boolean not null default false,

  display_order integer not null
    check (display_order >= 1),

  constraint knowledge_guides_unique
    unique (knowledge_id, guide_id)
);


-- =========================================================
-- 6. knowledge_sources
-- =========================================================

create table if not exists public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),

  knowledge_id uuid not null
    references public.knowledge(id)
    on delete cascade,

  source_id uuid not null
    references public.sources(id)
    on delete cascade,

  role text not null
    check (
      role in (
        'legal_basis',
        'main_reference',
        'additional_reference'
      )
    ),

  note text,

  display_order integer not null
    check (display_order >= 1),

  constraint knowledge_sources_unique
    unique (knowledge_id, source_id)
);


-- =========================================================
-- 7. knowledge_relations
-- =========================================================

create table if not exists public.knowledge_relations (
  id uuid primary key default gen_random_uuid(),

  knowledge_id uuid not null
    references public.knowledge(id)
    on delete cascade,

  related_knowledge_id uuid not null
    references public.knowledge(id)
    on delete cascade,

  display_order integer not null
    check (display_order >= 1),

  constraint knowledge_relations_unique
    unique (
      knowledge_id,
      related_knowledge_id
    ),

  constraint knowledge_relation_not_self
    check (
      knowledge_id <> related_knowledge_id
    )
);


-- =========================================================
-- Indexes
-- =========================================================

-- categories.slug, guide_situations.slug,
-- knowledge.slug는 UNIQUE가 이미 index를 생성하므로
-- 별도 index를 만들지 않는다.

create index if not exists knowledge_status_idx
  on public.knowledge(status);

create index if not exists knowledge_category_id_idx
  on public.knowledge(category_id);

-- getKnowledgeByGuide()는 guide_id로 관계를 찾는다.
create index if not exists knowledge_guides_guide_id_idx
  on public.knowledge_guides(guide_id);


-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.categories
  enable row level security;

alter table public.guide_situations
  enable row level security;

alter table public.knowledge
  enable row level security;

alter table public.sources
  enable row level security;

alter table public.knowledge_guides
  enable row level security;

alter table public.knowledge_sources
  enable row level security;

alter table public.knowledge_relations
  enable row level security;


-- =========================================================
-- Least-privilege grants
-- =========================================================

-- Supabase project defaults may differ.
-- 먼저 anon/authenticated의 권한을 제거하고
-- 필요한 SELECT만 다시 허용한다.

revoke all on table public.categories
  from anon, authenticated;

revoke all on table public.guide_situations
  from anon, authenticated;

revoke all on table public.knowledge
  from anon, authenticated;

revoke all on table public.sources
  from anon, authenticated;

revoke all on table public.knowledge_guides
  from anon, authenticated;

revoke all on table public.knowledge_sources
  from anon, authenticated;

revoke all on table public.knowledge_relations
  from anon, authenticated;


grant select on table public.categories
  to anon, authenticated;

grant select on table public.guide_situations
  to anon, authenticated;

grant select on table public.knowledge
  to anon, authenticated;

grant select on table public.sources
  to anon, authenticated;

grant select on table public.knowledge_guides
  to anon, authenticated;

grant select on table public.knowledge_sources
  to anon, authenticated;

grant select on table public.knowledge_relations
  to anon, authenticated;


-- =========================================================
-- Policies
-- =========================================================

drop policy if exists
  "Public can read categories"
  on public.categories;

create policy
  "Public can read categories"
on public.categories
for select
to anon, authenticated
using (true);


drop policy if exists
  "Public can read guide situations"
  on public.guide_situations;

create policy
  "Public can read guide situations"
on public.guide_situations
for select
to anon, authenticated
using (true);


-- Knowledge는 published만 Public Read
drop policy if exists
  "Public can read published knowledge"
  on public.knowledge;

create policy
  "Public can read published knowledge"
on public.knowledge
for select
to anon, authenticated
using (
  status = 'published'
);


-- Source 자체에는 개인정보나 비밀 데이터가 없다.
-- 단순 공식 자료 metadata이므로 Public Read 허용.
drop policy if exists
  "Public can read sources"
  on public.sources;

create policy
  "Public can read sources"
on public.sources
for select
to anon, authenticated
using (true);


-- Published Knowledge에 연결된 Guide 관계만 노출
drop policy if exists
  "Public can read published knowledge guides"
  on public.knowledge_guides;

create policy
  "Public can read published knowledge guides"
on public.knowledge_guides
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.knowledge k
    where
      k.id = knowledge_guides.knowledge_id
      and k.status = 'published'
  )
);


-- Published Knowledge의 Source 관계만 노출
drop policy if exists
  "Public can read published knowledge sources"
  on public.knowledge_sources;

create policy
  "Public can read published knowledge sources"
on public.knowledge_sources
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.knowledge k
    where
      k.id = knowledge_sources.knowledge_id
      and k.status = 'published'
  )
);


-- 양쪽 Knowledge가 모두 Published인 Related 관계만 노출
drop policy if exists
  "Public can read published knowledge relations"
  on public.knowledge_relations;

create policy
  "Public can read published knowledge relations"
on public.knowledge_relations
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.knowledge source_knowledge
    where
      source_knowledge.id =
        knowledge_relations.knowledge_id
      and source_knowledge.status =
        'published'
  )
  and
  exists (
    select 1
    from public.knowledge related_knowledge
    where
      related_knowledge.id =
        knowledge_relations.related_knowledge_id
      and related_knowledge.status =
        'published'
  )
);