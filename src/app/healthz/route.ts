import { NextResponse } from "next/server";

const startTime = Date.now(); // app start timestamp

export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    ok: true,
    version: "1.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime_seconds: uptimeSeconds,
    uptime_human: formatUptime(uptimeSeconds),
    node_version: process.version,
    memory: process.memoryUsage(),
  });
}

// Helper to make uptime readable
function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}
