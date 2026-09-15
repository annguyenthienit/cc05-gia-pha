'use strict';

const { timNguoi } = require('./du-lieu');

/**
 * Các con của một người (cả con ruột lẫn con nuôi), theo thứ tự năm sinh.
 * @param {string} id
 * @param {Array} dongHo
 * @returns {Array} danh sách người
 */
function conCua(id, dongHo) {
  return dongHo
    .filter((p) => p.cha === id || p.me === id)
    .sort((a, b) => a.namSinh - b.namSinh);
}

/**
 * Anh chị em của một người: cùng cha hoặc cùng mẹ, không tính chính mình.
 * @param {string} id
 * @param {Array} dongHo
 * @returns {Array}
 */
function anhChiEm(id, dongHo) {
  const p = timNguoi(id, dongHo);
  if (!p || (p.cha === null && p.me === null)) return [];
  return dongHo
    .filter((x) => x.id !== id && ((p.cha !== null && x.cha === p.cha) || (p.me !== null && x.me === p.me)))
    .sort((a, b) => a.namSinh - b.namSinh);
}

/**
 * Chuỗi tổ tiên theo dòng cha, từ cha đẻ (hoặc cha nuôi) lên tới Thuỷ tổ.
 * @param {string} id
 * @param {Array} dongHo
 * @returns {Array} [cha, ông, cụ, ...]
 */
function toTien(id, dongHo) {
  const ket = [];
  let p = timNguoi(id, dongHo);
  while (p && p.cha !== null) {
    p = timNguoi(p.cha, dongHo);
    if (p) ket.push(p);
  }
  return ket;
}

/**
 * Hai người có chung tổ tiên gần nhất là ai (theo dòng cha).
 * @returns {Object|null} người là tổ tiên chung gần nhất, null nếu không có
 */
function toTienChung(idA, idB, dongHo) {
  const a = [timNguoi(idA, dongHo), ...toTien(idA, dongHo)].filter(Boolean);
  const bIds = new Set([idB, ...toTien(idB, dongHo).map((p) => p.id)]);
  return a.find((p) => bIds.has(p.id)) || null;
}

module.exports = { conCua, anhChiEm, toTien, toTienChung };
