# gia-pha — dự án mẫu khóa CC05 Claude Code In Action

Phần mềm dòng lệnh quản lý gia phả của một dòng họ: vẽ cây, tính đời, tra ngày
giỗ theo âm lịch. Đây là **sân tập dùng chung cho cả khóa CC05** — bạn sẽ chạy
Claude Code lên chính thư mục này ở gần như mọi bài thực hành.

> 📦 Repo này được **công khai** để học viên tải về. Không chứa thông tin cá nhân:
> dòng họ Nguyễn Văn làng An Phú và 40 nhân vật trong đây đều là hư cấu.

## Chạy thử trong 30 giây

Chỉ cần Node.js 18 trở lên. **Không phải cài gì thêm**, dự án không dùng thư viện ngoài.

```bash
node --version        # phải là v18 trở lên
node cli.js           # in cây gia phả, số người theo đời, giỗ trong tháng này
node cli.js gio 2026-04   # giỗ rơi vào tháng 4/2026
node --test           # chạy 14 test
```

Kết quả `node --test` lúc này: **11 xanh, 3 đỏ**. Ba test đỏ là có chủ đích,
đừng vội sửa — chúng là đề bài của Bài 1.3 và Bài 2.4.

## Có gì bên trong

| Thư mục / file | Nội dung |
|---|---|
| `cli.js` | Ba báo cáo: cây gia phả, số người theo đời, giỗ trong tháng |
| `src/am-lich.js` | Đổi lịch âm ⇄ dương (thuật toán Hồ Ngọc Đức, múi giờ +7) |
| `src/du-lieu.js` | Đọc hai file JSON trong `du-lieu/` |
| `src/the-he.js` | Tính đời, đếm người theo đời — **chỗ đang có lỗi** |
| `src/quan-he.js` | Con, anh chị em, tổ tiên, tổ tiên chung |
| `src/cay.js` | Vẽ cây gia phả dạng chữ |
| `src/bao-cao.js` | Thống kê còn sống / đã mất, giỗ trong tháng |
| `docs/quy-uoc-gia-pha.md` | Quy ước nghiệp vụ và quy ước code. Dùng để đính bối cảnh cho Claude Code |
| `du-lieu/dong-ho.json` | 40 người, 6 đời (25 người gốc họ + 15 dâu rể) |
| `du-lieu/su-kien.json` | 120 sự kiện: 17 giỗ, 40 sinh, 15 cưới, 27 họp họ, 11 tảo mộ, 10 việc họ |
| `test/` | 14 test, chạy bằng `node --test` |

## Vài con số để bạn tự đối chiếu

- 40 người · 6 đời · 25 người gốc họ · 2 con nuôi
- Tính tới 2026: **22 còn sống, 18 đã mất**
- Giỗ trong tháng 4/2026: **2 đám** (09/04 và 30/04)
- Test: **14 test, 11 xanh, 3 đỏ**

Nếu máy bạn ra số khác, nhiều khả năng bạn đã sửa dữ liệu. Tải lại bản gốc rồi làm tiếp.

## Lưu ý khi làm bài

1. **Làm trên bản sao của bạn.** Nếu học chung lớp, mỗi người tự chép thư mục
   `gia-pha` về máy mình.
2. **Chưa có `CLAUDE.md`.** Đó là chủ ý — Bài 2.2 sẽ dạy bạn tự sinh nó bằng `/init`.
3. **Chưa có `.claude/`.** Bài 2.6 và chương 3 sẽ tạo custom command và hook ở đó.
4. Muốn quay lại vạch xuất phát, chỉ cần chép lại thư mục gốc từ folder khóa học
   (hoặc `git checkout .` nếu bạn tải từ GitHub).

## Bước tiếp theo sau khóa học

Repo này cố tình nhỏ để học kỹ thuật tay. Bản sản phẩm thật của ý tưởng gia phả
(web, nhiều dòng họ, cây kéo thả, kho ảnh) được giới thiệu ở Bài 4.2 — sau khi
xong khóa, bạn có thể thay `du-lieu/dong-ho.json` bằng dòng họ của chính mình
và để Claude Code giúp bạn phát triển tiếp.
