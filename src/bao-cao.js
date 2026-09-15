'use strict';

const { amSangDuong, chuoiNgay } = require('./am-lich');

/** Người sinh trước mốc này (tính theo năm) mà chưa ghi năm mất thì xem như đã mất. */
const TUOI_XEM_NHU_DA_MAT = 100;

/**
 * Một người còn sống hay không, tính tại một năm.
 * Có năm mất → đã mất. Không có năm mất nhưng sinh cách đây từ 100 năm → xem như đã mất.
 * @param {Object} nguoi
 * @param {number} namHienTai
 * @returns {boolean}
 */
function conSong(nguoi, namHienTai) {
  if (nguoi.namMat !== null) return false;
  return namHienTai - nguoi.namSinh < TUOI_XEM_NHU_DA_MAT;
}

/**
 * Đếm số người còn sống và đã mất trong gia phả.
 * @param {Array} dongHo
 * @param {number} namHienTai
 * @returns {{conSong: number, daMat: number}}
 */
function demSongMat(dongHo, namHienTai) {
  const song = dongHo.filter((p) => conSong(p, namHienTai)).length;
  return { conSong: song, daMat: dongHo.length - song };
}

/**
 * Các ngày giỗ rơi vào một tháng dương lịch của một năm.
 * Ngày giỗ ghi theo âm lịch "dd/mm", đổi sang dương lịch của năm đó rồi lọc theo tháng.
 *
 * @param {Array} suKien
 * @param {number} nam năm dương lịch
 * @param {number} thang 1..12
 * @returns {Array<{ngayDuong: string, ngayAm: string, moTa: string, nguoi: string[]}>} sắp theo ngày
 */
function gioTrongThang(suKien, nam, thang) {
  const ket = [];
  for (const e of suKien) {
    if (e.loai !== 'gio') continue;
    const [d, m] = e.ngayAm.split('/').map(Number);
    const duong = amSangDuong(d, m, nam);
    if (!duong || duong.thang !== thang) continue;
    ket.push({ ngayDuong: chuoiNgay(duong), ngayAm: e.ngayAm, moTa: e.moTa, nguoi: e.nguoi });
  }
  return ket.sort((a, b) => (a.ngayDuong < b.ngayDuong ? -1 : 1));
}

/**
 * Đếm sự kiện theo loại.
 * @param {Array} suKien
 * @returns {Object} { loai: soLuong }
 */
function demTheoLoai(suKien) {
  const ket = {};
  for (const e of suKien) ket[e.loai] = (ket[e.loai] || 0) + 1;
  return ket;
}

module.exports = { TUOI_XEM_NHU_DA_MAT, conSong, demSongMat, gioTrongThang, demTheoLoai };
