'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { demSongMat, gioTrongThang, demTheoLoai } = require('../src/bao-cao');
const { docDongHo, docSuKien } = require('../src/du-lieu');

const dongHo = docDongHo();
const suKien = docSuKien();

test('dữ liệu mẫu nạp đúng', () => {
  assert.strictEqual(dongHo.length, 40);
  assert.strictEqual(dongHo.filter((p) => p.gocHo).length, 25);
  assert.strictEqual(suKien.length, 120);
  assert.strictEqual(demTheoLoai(suKien).gio, 17);
});

test('demSongMat: người sinh cách đây từ 100 năm mà không rõ năm mất thì xem như đã mất', () => {
  // 17 người có năm mất, cộng bà Vũ Thị Thu (sinh 1924, không ghi năm mất) → 18 đã mất tính tới 2026.
  assert.deepStrictEqual(demSongMat(dongHo, 2026), { conSong: 22, daMat: 18 });
  // Lùi về 2020 thì bà mới 96 tuổi, vẫn tính là còn sống.
  assert.deepStrictEqual(demSongMat(dongHo, 2020), { conSong: 23, daMat: 17 });
  // Giỗ tháng 4/2026: 22/02 âm (09/04) và 14/03 âm (30/04).
  const gio = gioTrongThang(suKien, 2026, 4);
  assert.deepStrictEqual(gio.map((g) => g.ngayDuong), ['2026-04-09', '2026-04-30']);
});
