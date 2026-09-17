# MCP Redmine SKG — demo khóa CC05

MCP server nối Claude Code với Redmine của SKG: <https://red.smartitsoft.com>.
Engine là bản build `@onozaty/redmine-mcp-server` (copy từ `redmine-mcp-server/annt-redmine-mcp-splus-nodejs`),
phủ toàn bộ Redmine REST API (issues, projects, users, time entries, wiki, versions...).

| File | Vai trò |
| --- | --- |
| `server.mjs` | Engine MCP (bản build, không sửa tay) |
| `start.mjs` | Launcher: nạp `.env`, set URL SKG, kiểm tra API key rồi chạy `server.mjs` |
| `.env.example` | Mẫu cấu hình — copy thành `.env` (đã gitignore) |
| `../../.mcp.json` | Đăng ký server `redmine-skg` ở scope project cho Claude Code |

## Cài đặt

```bash
cd mcp/redmine
npm install                 # @modelcontextprotocol/sdk + zod
cp .env.example .env        # điền REDMINE_API_KEY (Redmine → My account → API access key)
```

Khởi động lại Claude Code trong thư mục `cc05-gia-pha`, chấp nhận `.mcp.json`, gõ `/mcp` để thấy `redmine-skg`.

## Chế độ

- `REDMINE_MCP_READ_ONLY=true` (mặc định): 42 tool chỉ đọc — an toàn khi demo.
- `REDMINE_MCP_READ_ONLY=false`: ~90 tool, thêm tạo/sửa/xóa issue, time entry, wiki...

## Kịch bản demo

- "Liệt kê project trên Redmine SKG"
- "Có bao nhiêu issue đang mở của project X, ai đang giữ nhiều nhất?"
- "Tóm tắt issue #123"
- (read-only=false) "Tạo issue 'Bổ sung giỗ tháng 10' vào project X, giao cho An"

## Chạy tay để kiểm tra

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n' | node start.mjs
```
