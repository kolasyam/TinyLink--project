import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { InferModel } from "drizzle-orm";
import { links } from "./schema";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle(client);

export type Link = InferModel<typeof links>;