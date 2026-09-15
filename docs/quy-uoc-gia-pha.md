# Quy ước dự án `gia-pha`

> File này tồn tại để bạn luyện **đính bối cảnh** cho Claude Code (Bài 2.3).
> Khi hỏi về nghiệp vụ, hãy đính nó vào bằng `@docs/quy-uoc-gia-pha.md` thay vì
> mô tả lại bằng lời — bạn sẽ thấy câu trả lời khác hẳn.

## 1. Bối cảnh

Gia phả dòng họ Nguyễn Văn ở làng An Phú, 6 đời tính từ Thuỷ tổ, 40 người kể cả
dâu rể. Phần mềm này chỉ chạy dòng lệnh, dữ liệu để trong hai file JSON, không có
cơ sở dữ liệu. Nó là bước đầu tiên của việc số hoá gia phả cho dòng họ.

## 2. Quy tắc nghiệp vụ

### 2.1 Người trong gia phả

- Mỗi người có một mã `Pxx`. Trường `gocHo: true` là **người gốc họ** (con cháu
  Thuỷ tổ, kể cả con gái và con nuôi). `gocHo: false` là **dâu, rể** — người
  kết hôn vào họ.
- Dâu rể không ghi cha mẹ (`cha`, `me` đều `null`), chỉ ghi `voChong`.
- Con nuôi ghi `conNuoi: true`; cột `cha`, `me` của con nuôi là **cha mẹ nuôi**.
  Gia phả không ghi cha mẹ đẻ của con nuôi.
- Người đã mất có `namMat` và `ngayMatAm` (ngày giỗ, âm lịch, dạng `"dd/mm"`).

### 2.2 Tính đời (thế hệ)

Đây là phần dễ tính sai nhất, đọc kỹ bốn ý:

1. **Thuỷ tổ là đời 1**, không phải đời 0. Con = đời cha/mẹ + 1.
   Ông Nguyễn Văn Kính đời 1, con ông đời 2, cháu đời 3.
2. **Con nuôi tính đời như con ruột**, theo cha mẹ nuôi. Con nuôi của người
   đời 2 là đời 3, con của người đó là đời 4. Không có ngoại lệ.
3. **Dâu rể xếp cùng đời với vợ/chồng** để vẽ cây và xếp thứ bậc xưng hô,
   nhưng **không đếm vào số người mỗi đời**. "Đời 2 có 3 người" nghĩa là 3
   người gốc họ, dù có thêm 3 dâu rể.
4. Khi thống kê còn sống / đã mất: người **không ghi năm mất** mà đã sinh cách
   năm thống kê **từ 100 năm** thì xem như đã mất. Gia phả cũ hay bỏ sót năm mất
   của các cụ.

### 2.3 Sự kiện và ngày giỗ

- Ngày giỗ ghi theo **âm lịch**, lặp lại hằng năm. Muốn biết giỗ rơi vào ngày
  dương nào của một năm thì đổi bằng `src/am-lich.js`.
- Sự kiện có ngày dương (`ngayDuong`) là sự kiện xảy ra một lần: sinh, cưới,
  việc họ. Sự kiện có `ngayAm` là sự kiện theo lịch âm: giỗ, họp họ, tảo mộ.
- `gioTrongThang(suKien, nam, thang)` chỉ lấy loại `gio`, sắp theo ngày dương.

## 3. Quy ước code

- Node.js thuần, **không cài thư viện ngoài**. Chạy test bằng `node --test`.
- CommonJS (`require`/`module.exports`), không dùng `import`.
- Mọi phép đổi lịch âm dương nằm trong `src/am-lich.js`, múi giờ +7. Đừng
  viết thêm hàm đổi lịch ở chỗ khác.
- Đặt tên hàm và biến bằng **tiếng Việt không dấu**, viết theo kiểu camelCase
  (`tinhDoi`, `demTheoDoi`, `gioTrongThang`). Đây là quy ước của nhóm, đừng đổi
  sang tiếng Anh.
- Mỗi hàm public có một khối JSDoc ngắn nói rõ tham số và giá trị trả về.

## 4. Cấu trúc thư mục

```
gia-pha/
├── cli.js                   báo cáo dòng lệnh: cây, đời, giỗ
├── package.json
├── docs/quy-uoc-gia-pha.md  file bạn đang đọc
├── du-lieu/
│   ├── dong-ho.json         40 người, 6 đời
│   └── su-kien.json         120 sự kiện: giỗ, sinh, cưới, họp họ, tảo mộ, việc họ
├── src/
│   ├── am-lich.js           đổi lịch âm ⇄ dương
│   ├── du-lieu.js           đọc file JSON
│   ├── the-he.js            tính đời, đếm người theo đời — chỗ đang có lỗi
│   ├── quan-he.js           con, anh chị em, tổ tiên
│   ├── cay.js               vẽ cây gia phả dạng chữ
│   └── bao-cao.js           thống kê sống mất, giỗ trong tháng
└── test/                    14 test, chạy bằng: node --test
```

## 5. Việc đang tồn đọng

Bộ test hiện có **3 test đỏ** ở `test/the-he.test.js`. Test viết đúng theo
mục 2.2, phần sai nằm ở code. Đây chính là việc bạn sẽ giao cho Claude Code.
