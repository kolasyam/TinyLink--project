import { NextResponse } from "next/server";
import { db } from "../../../db/index";
import { links } from "../../../db/schema";
import { v4 as uuidv4 } from "uuid";
import { generateCode } from "../../../lib/generateCode";
import { isValidUrl, CODE_REGEX } from "../../../lib/validators";
import { sql, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "3");
  const search = searchParams.get("search")?.trim().toLowerCase() || "";
  const offset = (page - 1) * limit;
  // Build query depending on search
  const filterQuery = search
    ? db
        .select()
        .from(links)
        .where(
          sql`LOWER(${links.code}) LIKE ${"%" + search + "%"} 
          OR LOWER(${links.url}) LIKE ${"%" + search + "%"}`
        )
    : db.select().from(links);
  // Get total rows after filtering
  const totalResult = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(links)
    .where(
      search
        ? sql`LOWER(${links.code}) LIKE ${"%" + search + "%"} 
          OR LOWER(${links.url}) LIKE ${"%" + search + "%"}`
        : sql`TRUE`
    );
  const total = totalResult[0].count;
  const totalPages = Math.ceil(total / limit);
  // Fetch paginated filtered results
  const data = await db
    .select()
    .from(links)
    .where(
      search
        ? sql`LOWER(${links.code}) LIKE ${"%" + search + "%"} 
          OR LOWER(${links.url}) LIKE ${"%" + search + "%"}`
        : sql`TRUE`
    )
    .orderBy(links.created_at)
    .limit(limit)
    .offset(offset);
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { url, code: requestedCode } = body;
  if (!url || typeof url !== "string" || !isValidUrl(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  let code = requestedCode && typeof requestedCode === "string" ? requestedCode.trim() : "";
  if (code) {
    if (!CODE_REGEX.test(code)) {
      return NextResponse.json({ error: "Code must match [A-Za-z0-9]{6,8}" }, { status: 400 });
    }
    // check exists
    const existing = await db.select().from(links).where(eq(links.code, code)).limit(1);
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }
  } else {
    // generate until unique (few tries)
    let attempts = 0;
    do {
      code = generateCode(6);
      const ex = await db.select().from(links).where(eq(links.code, code)).limit(1);
      if (!ex || ex.length === 0) break;
      attempts++;
    } while (attempts < 5);
    // if still conflict, generate 8 char
    if (!code) code = generateCode(8);
  }
  // insert
  await db.insert(links).values({
    code,
    url,
    clicks: 0,
    created_at: new Date()
  });
  const base = process.env.BASE_URL ?? "http://localhost:3000";
  return NextResponse.json({ code, shortUrl: `${base}/${code}`, url }, { status: 201 });
}
