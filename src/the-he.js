'use strict';

const { timNguoi } = require('./du-lieu');

/**
 * Một người có phải Thuỷ tổ không: người gốc họ mà không ghi cha lẫn mẹ.
 * @param {Object} nguoi
 * @returns {boolean}
 */
function laThuyTo(nguoi) {
  return nguoi.gocHo && nguoi.cha === null && nguoi.me === null;
}

/**
 * Tính đời (thế hệ) của một người, đếm từ Thuỷ tổ.
 * Dâu rể lấy theo đời của vợ/chồng.
 *
 * @param {string} id
 * @param {Array} dongHo danh sách người
 * @returns {number} số đời
 */
function tinhDoi(id, dongHo) {
  const p = timNguoi(id, dongHo);
  if (!p) throw new Error(`Không có người mã ${id}`);

  if (!p.gocHo) {
    if (p.voChong.length === 0) throw new Error(`${id} không gốc họ mà cũng không có vợ/chồng`);
    return tinhDoi(p.voChong[0], dongHo);
  }
  if (laThuyTo(p)) return 1;
  // con nuôi tính như con ruột, theo cha mẹ nuôi (quy ước 2.2.2)
  return tinhDoi(p.cha, dongHo) + 1;
}

/**
 * Đếm số người ở từng đời.
 * @param {Array} dongHo
 * @returns {Object} { doi: soNguoi }, ví dụ { 1: 1, 2: 3 }
 */
function demTheoDoi(dongHo) {
  const ket = {};
  for (const p of dongHo) {
    if (!p.gocHo) continue; // dâu rể không đếm vào số người mỗi đời (quy ước 2.2.3)
    const doi = tinhDoi(p.id, dongHo);
    ket[doi] = (ket[doi] || 0) + 1;
  }
  return ket;
}

/**
 * Đời cao nhất có trong gia phả.
 * @param {Array} dongHo
 * @returns {number}
 */
function doiCaoNhat(dongHo) {
  return Math.max(...dongHo.map((p) => tinhDoi(p.id, dongHo)));
}

module.exports = { laThuyTo, tinhDoi, demTheoDoi, doiCaoNhat };
