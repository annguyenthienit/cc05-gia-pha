#!/usr/bin/env node
// Launcher MCP Redmine SKG (red.smartitsoft.com) — demo khóa CC05.
// Nạp .env cạnh file này rồi khởi động server.mjs (bản build @onozaty/redmine-mcp-server).
// Biến môi trường set sẵn từ ngoài được ưu tiên hơn .env.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

try {
  const raw = readFileSync(join(here, ".env"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  /* .env là tùy chọn */
}

const defaults = {
  REDMINE_URL: "https://red.smartitsoft.com",
  REDMINE_MCP_READ_ONLY: "true", // demo: chỉ đọc. Đổi "false" trong .env nếu cần tạo/sửa issue.
};
for (const [k, v] of Object.entries(defaults)) {
  if (process.env[k] === undefined) process.env[k] = v;
}

if (!process.env.REDMINE_API_KEY) {
  console.error("[redmine-mcp] Thiếu REDMINE_API_KEY — copy .env.example thành .env và điền key (Redmine → My account → API access key).");
  process.exit(1);
}

await import("./server.mjs");
