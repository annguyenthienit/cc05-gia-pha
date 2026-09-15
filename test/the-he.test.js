'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { laThuyTo, tinhDoi, demTheoDoi } = require('../src/the-he');
const { docDongHo } = require('../src/du-lieu');

// Quy tắc tính đời đầy đủ: xem docs/quy-uoc-gia-pha.md mục 2.2
//
//   1. Thuỷ tổ là ĐỜI 1 (không phải đời 0). Con = đời cha/mẹ + 1.
//   2. Con nuôi tính đời NHƯ CON RUỘT, theo cha mẹ nuôi.
//   3. Dâu rể xếp cùng đời với vợ/chồng để vẽ cây, nhưng KHÔNG đếm vào số người mỗi đời.
//   4. Người không rõ năm mất mà đã sinh cách đây từ 100 năm thì xem như đã mất.

const dongHo = docDongHo();

test('laThuyTo: người gốc họ không có cha mẹ', () => {
  assert.strictEqual(laThuyTo(dongHo.find((p) => p.id === 'P01')), true);
  assert.strictEqual(laThuyTo(dongHo.find((p) => p.id === 'P02')), false); // dâu, không gốc họ
  assert.strictEqual(laThuyTo(dongHo.find((p) => p.id === 'P03')), false); // có cha
});

test('tinhDoi báo lỗi khi mã không tồn tại', () => {
  assert.throws(() => tinhDoi('P999', dongHo), /P999/);
});

test('thuỷ tổ là đời 1, con là đời 2, cháu là đời 3', () => {
  assert.strictEqual(tinhDoi('P01', dongHo), 1); // Nguyễn Văn Kính — Thuỷ tổ
  assert.strictEqual(tinhDoi('P03', dongHo), 2); // Nguyễn Văn Đức — con
  assert.strictEqual(tinhDoi('P09', dongHo), 3); // Nguyễn Văn Thành — cháu
  assert.strictEqual(tinhDoi('P41', dongHo), 6); // Nguyễn Thị Tường Vy — đời 6
});

test('con nuôi tính đời theo cha mẹ nuôi, như con ruột', () => {
  // P14 Nguyễn Văn Nam là con nuôi của P06 (đời 2) → đời 3.
  // Con của P14 là P27 → đời 4, cháu P38 → đời 5.
  assert.strictEqual(tinhDoi('P14', dongHo), 3);
  assert.strictEqual(tinhDoi('P27', dongHo), 4);
  assert.strictEqual(tinhDoi('P38', dongHo), 5);
});

test('demTheoDoi chỉ đếm người gốc họ, không đếm dâu rể', () => {
  // 25 người gốc họ chia 6 đời. 15 dâu rể không được tính.
  assert.deepStrictEqual(demTheoDoi(dongHo), { 1: 1, 2: 3, 3: 5, 4: 8, 5: 6, 6: 2 });
});
