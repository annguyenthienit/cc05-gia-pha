'use strict';

const fs = require('fs');
const path = require('path');

const THU_MUC = path.join(__dirname, '..', 'du-lieu');

function docJson(ten) {
  const p = path.join(THU_MUC, ten);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/** Danh sách mọi người trong gia phả (cả người gốc họ lẫn dâu rể). */
function docDongHo() {
  return docJson('dong-ho.json');
}

/** Sổ sự kiện của dòng họ: giỗ, sinh, cưới, họp họ, tảo mộ, việc họ. */
function docSuKien() {
  return docJson('su-kien.json');
}

/** Tìm một người theo mã. Trả về undefined nếu không có. */
function timNguoi(id, dongHo = docDongHo()) {
  return dongHo.find((p) => p.id === id);
}

module.exports = { docDongHo, docSuKien, timNguoi };
