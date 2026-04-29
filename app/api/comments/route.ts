import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type PrototypeComment = {
  id: string;
  prototypeId: string;
  screenId: string;
  screenLabel: string;
  x: number;
  y: number;
  xPercent: number;
  yPercent: number;
  viewportWidth: number;
  viewportHeight: number;
  elementLabel: string;
  commentText: string;
  status: 'open' | 'ai_task_draft' | 'resolved';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const LOCAL_STORE = path.join(process.cwd(), '.data', 'prototype-comments.json');
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_COMMENTS_TABLE || 'prototype_comments';

function hasSupabase() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function cleanText(value: unknown, fallback = '') {
  return String(value ?? fallback).trim();
}

function cleanNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clampPercent(value: unknown) {
  return Math.max(0, Math.min(1, cleanNumber(value)));
}

async function readLocalComments(): Promise<PrototypeComment[]> {
  try {
    const raw = await fs.readFile(LOCAL_STORE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeLocalComments(comments: PrototypeComment[]) {
  await fs.mkdir(path.dirname(LOCAL_STORE), { recursive: true });
  await fs.writeFile(LOCAL_STORE, JSON.stringify(comments, null, 2));
}

async function supabaseRequest(pathname: string, init: RequestInit = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase comments request failed: ${message}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function listComments(prototypeId: string) {
  if (hasSupabase()) {
    const params = new URLSearchParams({
      prototypeId: `eq.${prototypeId}`,
      order: 'createdAt.asc',
    });
    return supabaseRequest(`${SUPABASE_TABLE}?${params.toString()}`);
  }

  const comments = await readLocalComments();
  return comments.filter((comment) => comment.prototypeId === prototypeId);
}

async function insertComment(comment: PrototypeComment) {
  if (hasSupabase()) {
    const created = await supabaseRequest(SUPABASE_TABLE, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
    return Array.isArray(created) ? created[0] : comment;
  }

  const comments = await readLocalComments();
  comments.push(comment);
  await writeLocalComments(comments);
  return comment;
}

async function updateComment(id: string, patch: Partial<PrototypeComment>) {
  if (hasSupabase()) {
    const updated = await supabaseRequest(`${SUPABASE_TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    return Array.isArray(updated) ? updated[0] : null;
  }

  const comments = await readLocalComments();
  const index = comments.findIndex((comment) => comment.id === id);
  if (index === -1) return null;
  comments[index] = { ...comments[index], ...patch };
  await writeLocalComments(comments);
  return comments[index];
}

export async function GET(request: NextRequest) {
  const prototypeId = request.nextUrl.searchParams.get('prototypeId') || 'sat-prep-v1';
  const comments = await listComments(prototypeId);
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const commentText = cleanText(body.commentText);

  if (!commentText) {
    return NextResponse.json({ error: 'commentText is required' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const viewportWidth = cleanNumber(body.viewportWidth, 1);
  const viewportHeight = cleanNumber(body.viewportHeight, 1);
  const comment: PrototypeComment = {
    id: randomUUID(),
    prototypeId: cleanText(body.prototypeId, 'sat-prep-v1'),
    screenId: cleanText(body.screenId, 'unknown'),
    screenLabel: cleanText(body.screenLabel, 'Unknown screen'),
    x: cleanNumber(body.x),
    y: cleanNumber(body.y),
    xPercent: clampPercent(body.xPercent),
    yPercent: clampPercent(body.yPercent),
    viewportWidth,
    viewportHeight,
    elementLabel: cleanText(body.elementLabel),
    commentText,
    status: body.status === 'ai_task_draft' ? 'ai_task_draft' : 'open',
    createdBy: cleanText(body.createdBy, 'Reviewer'),
    createdAt: now,
    updatedAt: now,
  };

  const created = await insertComment(comment);
  return NextResponse.json({ comment: created }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const id = cleanText(body.id);
  const status = cleanText(body.status);

  if (!id || !['open', 'ai_task_draft', 'resolved'].includes(status)) {
    return NextResponse.json({ error: 'Valid id and status are required' }, { status: 400 });
  }

  const updated = await updateComment(id, {
    status: status as PrototypeComment['status'],
    updatedAt: new Date().toISOString(),
  });

  if (!updated) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  return NextResponse.json({ comment: updated });
}
