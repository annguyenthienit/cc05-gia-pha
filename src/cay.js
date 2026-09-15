'use strict';

const { timNguoi } = require('./du-lieu');
const { conCua } = require('./quan-he');

/** Nhãn một người: tên, năm sinh–mất, kèm vợ/chồng. */
function nhan(p, dongHo) {
  const nam = p.namMat ? `${p.namSinh}–${p.namMat}` : `${p.namSinh}–`;
  const vc = p.voChong
    .map((id) => timNguoi(id, dongHo))
    .filter(Boolean)
    .map((x) => x.hoTen)
    .join(', ');
  const nuoi = p.conNuoi ? ' (con nuôi)' : '';
  return `${p.hoTen} (${nam})${nuoi}${vc ? '  ⚭ ' + vc : ''}`;
}

/**
 * Vẽ cây gia phả dạng chữ, mỗi người một dòng, thụt lề theo đời.
 * @param {string} idGoc mã người làm gốc cây
 * @param {Array} dongHo
 * @returns {string[]} các dòng
 */
function veCay(idGoc, dongHo) {
  const dong = [];
  function di(p, tienTo, cuoi) {
    dong.push(tienTo + (tienTo ? (cuoi ? '└─ ' : '├─ ') : '') + nhan(p, dongHo));
    const con = conCua(p.id, dongHo);
    con.forEach((c, i) => di(c, tienTo + (tienTo ? (cuoi ? '   ' : '│  ') : '   '), i === con.length - 1));
  }
  const goc = timNguoi(idGoc, dongHo);
  if (!goc) throw new Error(`Không có người mã ${idGoc}`);
  di(goc, '', true);
  return dong;
}

module.exports = { veCay };
