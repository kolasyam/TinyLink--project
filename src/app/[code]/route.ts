import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { db } from "../../db/index";
import { eq } from "drizzle-orm";
import { links } from "../../db/schema";

export async function GET(_req: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const found = await db.select().from(links).where(eq(links.code, code)).limit(1);
  if (!found || found.length === 0) {
    return notFound();
  }
  const link = found[0];
  await db
    .update(links)
    .set({ clicks: (link.clicks ?? 0) + 1, last_clicked: new Date() })
    .where(eq(links.code, code));
  return NextResponse.redirect(link.url, 302);
}
