import { NextResponse } from "next/server";
import { db } from "../../../../db/index";
import { links } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const found = await db.select().from(links).where(eq(links.code, code)).limit(1);
  if (!found || found.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(found[0]);
}

export async function DELETE(_req: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
    const existing = await db
    .select()
    .from(links)
    .where(eq(links.code, code))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await db.delete(links).where(eq(links.code, code));

  return NextResponse.json({ ok: true });
}
