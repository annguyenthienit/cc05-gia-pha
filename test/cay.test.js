'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { veCay } = require('../src/cay');
const { docDongHo } = require('../src/du-lieu');

const dongHo = docDongHo();

test('veCay in mỗi người gốc họ một dòng, thụt lề theo đời', () => {
  const cay = veCay('P01', dongHo);
  assert.strictEqual(cay.length, 25); // 25 người gốc họ, dâu rể ghi cùng dòng với vợ/chồng
  assert.strictEqual(cay[0], 'Nguyễn Văn Kính (1868–1932)  ⚭ Trần Thị Lụa');
  const nhanh = veCay('P13', dongHo);
  assert.deepStrictEqual(nhanh, [
    'Nguyễn Văn Phúc (1930–2005)  ⚭ Ngô Thị Hương',
    '   ├─ Nguyễn Thị Ngọc (1958–)',
    '   └─ Nguyễn Văn Long (1962–)  ⚭ Mai Thị Hồng',
    '      └─ Nguyễn Thị Linh (1990–)',
  ]);
  assert.throws(() => veCay('P999', dongHo), /P999/);
});
