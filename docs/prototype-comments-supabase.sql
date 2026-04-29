create table if not exists public.prototype_comments (
  "id" text primary key,
  "prototypeId" text not null,
  "screenId" text not null,
  "screenLabel" text not null,
  "x" double precision not null,
  "y" double precision not null,
  "xPercent" double precision not null,
  "yPercent" double precision not null,
  "viewportWidth" integer not null,
  "viewportHeight" integer not null,
  "elementLabel" text not null default '',
  "commentText" text not null,
  "status" text not null check ("status" in ('open', 'ai_task_draft', 'resolved')),
  "createdBy" text not null,
  "createdAt" timestamptz not null,
  "updatedAt" timestamptz not null
);

create index if not exists prototype_comments_prototype_screen_idx
  on public.prototype_comments ("prototypeId", "screenId", "createdAt");
