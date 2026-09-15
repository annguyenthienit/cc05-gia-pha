'use strict';

/**
 * Đổi lịch dương ⇄ lịch âm Việt Nam (múi giờ +7).
 * Thuật toán thiên văn của Hồ Ngọc Đức (2004), viết lại bằng tên tiếng Việt.
 * Chỉ dùng số học, không cần thư viện ngoài.
 */

const MUI_GIO = 7;
const DR = Math.PI / 180;

/** Số ngày Julius của một ngày dương lịch. */
function soNgayJulius(ngay, thang, nam) {
  const a = Math.floor((14 - thang) / 12);
  const y = nam + 4800 - a;
  const m = thang + 12 * a - 3;
  let jd = ngay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = ngay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

/** Ngược lại: từ số ngày Julius ra [ngày, tháng, năm] dương lịch. */
function tuSoNgayJulius(jd) {
  let a, b, c;
  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const ngay = e - Math.floor((153 * m + 2) / 5) + 1;
  const thang = m + 3 - 12 * Math.floor(m / 10);
  const nam = b * 100 + d - 4800 + Math.floor(m / 10);
  return [ngay, thang, nam];
}

/** Thời điểm sóc (trăng non) thứ k kể từ 01/01/1900, tính theo ngày Julius. */
function trangNon(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * DR);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * DR) + 0.0021 * Math.sin(2 * DR * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * DR) + 0.0161 * Math.sin(DR * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(DR * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(DR * 2 * F) - 0.0051 * Math.sin(DR * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(DR * (M - Mpr)) + 0.0004 * Math.sin(DR * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(DR * (2 * F - M)) - 0.0006 * Math.sin(DR * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(DR * (2 * F - Mpr)) + 0.0005 * Math.sin(DR * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return jd1 + C1 - deltat;
}

/** Kinh độ mặt trời (radian) tại một thời điểm Julius. */
function kinhDoMatTroi(jdn) {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(DR * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(DR * 2 * M) + 0.00029 * Math.sin(DR * 3 * M);
  let L = (L0 + DL) * DR;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return L;
}

/** Kinh độ mặt trời chia thành 12 cung (0..11) tại đầu ngày theo múi giờ. */
function cungMatTroi(soNgay) {
  return Math.floor((kinhDoMatTroi(soNgay - 0.5 - MUI_GIO / 24) / Math.PI) * 6);
}

/** Ngày Julius của sóc thứ k, theo múi giờ. */
function ngayTrangNon(k) {
  return Math.floor(trangNon(k) + 0.5 + MUI_GIO / 24);
}

/** Ngày bắt đầu tháng 11 âm lịch của một năm dương lịch (tháng chứa Đông chí). */
function thang11AmLich(nam) {
  const off = soNgayJulius(31, 12, nam) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = ngayTrangNon(k);
  if (cungMatTroi(nm) >= 9) nm = ngayTrangNon(k - 1);
  return nm;
}

/** Vị trí tháng nhuận trong một năm âm lịch có 13 tháng. */
function viTriThangNhuan(a11) {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = cungMatTroi(ngayTrangNon(k + i));
  do {
    last = arc;
    i++;
    arc = cungMatTroi(ngayTrangNon(k + i));
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Đổi ngày dương sang ngày âm.
 * @param {number} ngay
 * @param {number} thang
 * @param {number} nam
 * @returns {{ngay: number, thang: number, nam: number, nhuan: boolean}}
 */
function duongSangAm(ngay, thang, nam) {
  const soNgay = soNgayJulius(ngay, thang, nam);
  const k = Math.floor((soNgay - 2415021.076998695) / 29.530588853);
  let dauThang = ngayTrangNon(k + 1);
  if (dauThang > soNgay) dauThang = ngayTrangNon(k);
  let a11 = thang11AmLich(nam);
  let b11 = a11;
  let namAm;
  if (a11 >= dauThang) {
    namAm = nam;
    a11 = thang11AmLich(nam - 1);
  } else {
    namAm = nam + 1;
    b11 = thang11AmLich(nam + 1);
  }
  const ngayAm = soNgay - dauThang + 1;
  const diff = Math.floor((dauThang - a11) / 29);
  let nhuan = false;
  let thangAm = diff + 11;
  if (b11 - a11 > 365) {
    const viTri = viTriThangNhuan(a11);
    if (diff >= viTri) {
      thangAm = diff + 10;
      if (diff === viTri) nhuan = true;
    }
  }
  if (thangAm > 12) thangAm -= 12;
  if (thangAm >= 11 && diff < 4) namAm -= 1;
  return { ngay: ngayAm, thang: thangAm, nam: namAm, nhuan };
}

/**
 * Đổi ngày âm sang ngày dương.
 * @param {number} ngayAm
 * @param {number} thangAm
 * @param {number} namAm
 * @param {boolean} [nhuan=false] tháng nhuận hay không
 * @returns {{ngay: number, thang: number, nam: number}|null} null nếu tháng nhuận không tồn tại
 */
function amSangDuong(ngayAm, thangAm, namAm, nhuan = false) {
  let a11, b11;
  if (thangAm < 11) {
    a11 = thang11AmLich(namAm - 1);
    b11 = thang11AmLich(namAm);
  } else {
    a11 = thang11AmLich(namAm);
    b11 = thang11AmLich(namAm + 1);
  }
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = thangAm - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const viTri = viTriThangNhuan(a11);
    let thangNhuan = viTri - 2;
    if (thangNhuan < 0) thangNhuan += 12;
    if (nhuan && thangAm !== thangNhuan) return null;
    if (nhuan || off >= viTri) off += 1;
  } else if (nhuan) {
    return null;
  }
  const dauThang = ngayTrangNon(k + off);
  const [ngay, thang, nam] = tuSoNgayJulius(dauThang + ngayAm - 1);
  return { ngay, thang, nam };
}

/** "YYYY-MM-DD" từ object {ngay, thang, nam}. */
function chuoiNgay({ ngay, thang, nam }) {
  const p = (n) => String(n).padStart(2, '0');
  return `${nam}-${p(thang)}-${p(ngay)}`;
}

module.exports = { duongSangAm, amSangDuong, chuoiNgay };
