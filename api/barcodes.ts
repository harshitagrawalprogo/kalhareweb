import { neon } from "@neondatabase/serverless";

export const config = { runtime: "edge" };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

async function getDb() {
  const sql = neon(process.env.DATABASE_URL as string);
  await sql`
    CREATE TABLE IF NOT EXISTS barcodes (
      id SERIAL PRIMARY KEY,
      barcode_id VARCHAR(255) UNIQUE NOT NULL,
      drive_link TEXT NOT NULL,
      label VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  return sql;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  try {
    const sql = await getDb();
    const url = new URL(req.url);

    if (req.method === "GET") {
      const barcode = url.searchParams.get("barcode");
      if (barcode) {
        const rows = await sql`SELECT * FROM barcodes WHERE barcode_id = ${barcode} LIMIT 1`;
        if (rows.length === 0) {
          return Response.json({ error: "Not found" }, { status: 404, headers: CORS });
        }
        return Response.json(rows[0], { headers: CORS });
      }
      const rows = await sql`SELECT * FROM barcodes ORDER BY created_at DESC`;
      return Response.json(rows, { headers: CORS });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { barcode_id, drive_link, label = "" } = body;
      if (!barcode_id?.trim() || !drive_link?.trim()) {
        return Response.json({ error: "barcode_id and drive_link required" }, { status: 400, headers: CORS });
      }
      const rows = await sql`
        INSERT INTO barcodes (barcode_id, drive_link, label)
        VALUES (${barcode_id.trim()}, ${drive_link.trim()}, ${label.trim()})
        ON CONFLICT (barcode_id) DO UPDATE
          SET drive_link = EXCLUDED.drive_link, label = EXCLUDED.label
        RETURNING *
      `;
      return Response.json(rows[0], { status: 201, headers: CORS });
    }

    if (req.method === "DELETE") {
      const body = await req.json();
      const { barcode_id } = body;
      if (!barcode_id) {
        return Response.json({ error: "barcode_id required" }, { status: 400, headers: CORS });
      }
      await sql`DELETE FROM barcodes WHERE barcode_id = ${barcode_id}`;
      return Response.json({ success: true }, { headers: CORS });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405, headers: CORS });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return Response.json({ error: message }, { status: 500, headers: CORS });
  }
}