'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { conCua, anhChiEm, toTien, toTienChung } = require('../src/quan-he');
const { docDongHo } = require('../src/du-lieu');

const dongHo = docDongHo();
const ma = (ds) => ds.map((p) => p.id);

test('conCua trả về các con theo thứ tự năm sinh, gồm cả con nuôi', () => {
  assert.deepStrictEqual(ma(conCua('P03', dongHo)), ['P09', 'P10', 'P11']);
  assert.deepStrictEqual(ma(conCua('P06', dongHo)), ['P13', 'P14']); // P14 là con nuôi
  assert.deepStrictEqual(ma(conCua('P41', dongHo)), []);
});

test('anhChiEm không tính chính mình, thuỷ tổ không có anh chị em', () => {
  assert.deepStrictEqual(ma(anhChiEm('P10', dongHo)), ['P09', 'P11']);
  assert.deepStrictEqual(ma(anhChiEm('P14', dongHo)), ['P13']);
  assert.deepStrictEqual(ma(anhChiEm('P01', dongHo)), []);
});

test('toTien đi theo dòng cha tới Thuỷ tổ; toTienChung tìm đúng tổ tiên chung gần nhất', () => {
  assert.deepStrictEqual(ma(toTien('P38', dongHo)), ['P27', 'P14', 'P06', 'P01']);
  assert.strictEqual(toTienChung('P33', 'P35', dongHo).id, 'P03'); // anh em họ, chung ông cố
  assert.strictEqual(toTienChung('P33', 'P38', dongHo).id, 'P01'); // chỉ chung Thuỷ tổ
  assert.strictEqual(toTienChung('P33', 'P02', dongHo), null); // dâu không có dòng cha trong họ
});
