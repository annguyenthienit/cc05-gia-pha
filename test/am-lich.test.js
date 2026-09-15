'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { duongSangAm, amSangDuong, chuoiNgay } = require('../src/am-lich');

test('mùng 1 Tết các năm gần đây đổi đúng sang dương lịch', () => {
  assert.strictEqual(chuoiNgay(amSangDuong(1, 1, 2024)), '2024-02-10');
  assert.strictEqual(chuoiNgay(amSangDuong(1, 1, 2025)), '2025-01-29');
  assert.strictEqual(chuoiNgay(amSangDuong(1, 1, 2026)), '2026-02-17');
  assert.strictEqual(chuoiNgay(amSangDuong(10, 3, 2026)), '2026-04-26'); // Giỗ Tổ Hùng Vương
});

test('dương sang âm rồi âm sang dương phải quay về ngày cũ', () => {
  const am = duongSangAm(17, 2, 2026);
  assert.deepStrictEqual(am, { ngay: 1, thang: 1, nam: 2026, nhuan: false });
  assert.strictEqual(chuoiNgay(amSangDuong(am.ngay, am.thang, am.nam, am.nhuan)), '2026-02-17');
});

test('tháng nhuận: 2025 nhuận tháng 6, 2026 không có tháng nhuận', () => {
  assert.strictEqual(chuoiNgay(amSangDuong(1, 6, 2025, true)), '2025-07-25');
  assert.strictEqual(duongSangAm(25, 7, 2025).nhuan, true);
  assert.strictEqual(amSangDuong(1, 6, 2026, true), null);
});
