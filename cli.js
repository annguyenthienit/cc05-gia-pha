#!/usr/bin/env node
'use strict';

const { docDongHo, docSuKien, timNguoi } = require('./src/du-lieu');
const { veCay } = require('./src/cay');
const { demTheoDoi, doiCaoNhat } = require('./src/the-he');
const { demSongMat, gioTrongThang } = require('./src/bao-cao');

function bangCay(idGoc) {
  const dongHo = docDongHo();
  const goc = idGoc ? timNguoi(idGoc, dongHo) : dongHo.find((p) => p.gocHo && p.cha === null);
  console.log(`\n=== CÂY GIA PHẢ (từ ${goc.hoTen}) ===\n`);
  for (const d of veCay(goc.id, dongHo)) console.log('  ' + d);
}

function bangDoi(namHienTai) {
  const dongHo = docDongHo();
  const theoDoi = demTheoDoi(dongHo);
  const { conSong, daMat } = demSongMat(dongHo, namHienTai);
  console.log('\n=== SỐ NGƯỜI THEO ĐỜI ===');
  Object.keys(theoDoi)
    .sort((a, b) => a - b)
    .forEach((doi) => console.log(`  Đời ${String(doi).padStart(2)}   ${String(theoDoi[doi]).padStart(3)} người`));
  console.log(`  Cao nhất: đời ${doiCaoNhat(dongHo)}`);
  console.log(`  Còn sống ${conSong} · đã mất ${daMat} (tính tới ${namHienTai})`);
}

function bangGio(nam, thang) {
  const ds = gioTrongThang(docSuKien(), nam, thang);
  console.log(`\n=== GIỖ TRONG THÁNG ${String(thang).padStart(2, '0')}/${nam} ===`);
  console.log(`Tổng: ${ds.length} đám giỗ\n`);
  for (const g of ds) console.log(`  ${g.ngayDuong}  (âm ${g.ngayAm})  ${g.moTa}`);
}

function main() {
  const lenh = process.argv[2] || 'tat-ca';
  const thamSo = process.argv[3];
  const homNay = new Date();
  const nam = thamSo && /^\d{4}-\d{2}$/.test(thamSo) ? Number(thamSo.slice(0, 4)) : homNay.getFullYear();
  const thang = thamSo && /^\d{4}-\d{2}$/.test(thamSo) ? Number(thamSo.slice(5, 7)) : homNay.getMonth() + 1;

  if (lenh === 'cay' || lenh === 'tat-ca') bangCay(lenh === 'cay' ? thamSo : undefined);
  if (lenh === 'doi' || lenh === 'tat-ca') bangDoi(nam);
  if (lenh === 'gio' || lenh === 'tat-ca') bangGio(nam, thang);

  if (!['cay', 'doi', 'gio', 'tat-ca'].includes(lenh)) {
    console.log('Cách dùng: node cli.js [cay [maNguoi] | doi | gio [YYYY-MM] | tat-ca]');
    process.exitCode = 1;
  }
  console.log('');
}

main();
