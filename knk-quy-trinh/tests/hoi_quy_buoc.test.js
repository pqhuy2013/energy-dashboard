/* Kiem thu hoi quy cac loi da sua o cac buoc 0 den 8 (dot soat xet sau Giai doan 6), chay tren ban da dong goi.

   Chay:  NODE_PATH=$(npm root -g) node tests/hoi_quy_buoc.test.js
   Chay tren ban khac (vd ban truoc khi sua):  QT_URL=file:///duong/dan/index.html NODE_PATH=$(npm root -g) node tests/hoi_quy_buoc.test.js

   Moi muc duoi day ung voi mot loi da xac nhan; kiem thu phai TRUOT tren ban truoc khi sua va DAT tren ban hien tai.
   1. Mo lo thien: o he so CO2 (diem 5.5) mac dinh don vi "m3 CO2/tan", diem 5.5 ra so.
   2. Phat tan "Khac" hoac khoang san khong phai than: dong khong co cong thuc nhu qua trinh cong nghiep,
      Buoc 3 khong bat buoc he so CH4, Buoc 4 hoan thanh duoc.
   3. Nhan "chua du" giong nhau o Buoc 4, Buoc 7, Buoc 8, tach theo truc tiep va gian tiep.
   4. Giao dien tieng Anh: don vi t, t/h, h, t steam o dong Buoc 4 va dong he so hoi Buoc 3.
   5. Buoc 7: tong ky truoc theo bo GWP dang chon, khong loi khi chon GWP sau khi nap file, doi ho so thi xoa hop.
   6. Buoc 3, tra Quyet dinh 2626 bang tieng Anh: 74,100 va "Tier 1".
   7. Buoc 6: bang U co ca dong chi co o nam thu hai.
   8. Buoc 0: co so ung voi nhieu dong Quyet dinh 699 liet ke du, khong tu dien ma so thue khi cac ma khac nhau.
   9. Buoc 0: goi y nhom cho nhiet dien, sat thep, xi mang khong co trong Quyet dinh 699 dan diem c, nhom B hoac A.
   10. Buoc 0: ky khong lien ke tu file bao thieu; ky lech chu ky cua nhom canh bao o #w-ky, Phan F muc 2 khong dat.
   11. Buoc 0 khong con noi tra danh muc "se co o ban sau".
   12. Buoc 4: the GWP dan khoan 3 Dieu 19 Thong tu 38, trich nguyen van. Cau "GWPi la he so ..." o khoan 3
       Dieu 19 (trang 8 ban quet) trung chu voi diem 1 Muc 2 Phu luc II, nen doi chieu voi TT38_Phu_luc_II.md.
   13. Buoc 2: hop con thieu ghi don vi san luong khai thac la "...: Don vi", khong lap san luong hai lan.
   Muc 5a co y gay lai loi trang cua ban cu (chon GWP sau khi nap file ky truoc): loi trang o muc do duoc
   kiem rieng, loi console con lai gop vao muc cuoi. So lieu la so gia dinh. */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = process.env.QT_URL || 'file://' + path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-hoiquy-buoc-'));
const SHOTS = process.env.QT_SHOTS || path.join(os.tmpdir(), 'qt-shots');
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  ĐẠT   ' + msg); } else { fail++; console.log('  TRƯỢT ' + msg); } }
function theoDoiLoi(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}
const vi = (v, d) => v.toLocaleString('vi-VN', { maximumFractionDigits: d });
const gon = s => (s || '').replace(/\s+/g, ' ').trim();
const xongHet = page => page.evaluate(() => Array.from(document.querySelectorAll('#qt-menu .qt-mi')).map(b => b.classList.contains('xong')));
const noiDung = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return e ? e.innerText : null; }, sel);
async function diToi(page, h) {
  await page.evaluate(x => { location.hash = x; }, h);
  if (h !== 'dau') await page.waitForFunction(x => { const p = document.getElementById('pane-' + x); return p && p.classList.contains('on'); }, h, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(50);
}
/* nap ho so qua nut #qt-load; neu ung dung hoi (ho so dang mo co sua doi) thi bam "Van nap file" */
async function nap(page, file) {
  await diToi(page, 'dau');
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#qt-load')]);
  await fc.setFiles(file);
  await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on') || !document.getElementById('qt-confirm').hidden);
  if (await page.isVisible('#qt-confirm')) {
    await page.click('#qt-confirm-acts button:has-text("Vẫn nạp file")');
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
  }
  await page.waitForTimeout(50);
}
async function napKy7(page, file) {
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('[data-act="napKy7"]')]);
  await fc.setFiles(file);
  await page.waitForSelector('#b7-file .qt-ct');
}
function ghi(ten, o) { const f = path.join(TMP, ten); fs.writeFileSync(f, JSON.stringify(o)); return f; }
/* o cua dong ket qua Buoc 4: [#, nguon, diem, khi, AD, EF, luong, GWP, tCO2td] */
const dongKq = (page, id, muc, khi) => page.$$eval('#b4-chitiet tr[data-dong]', (rs, a) => {
  const r = rs.find(x => x.getAttribute('data-dong') === a.join('|'));
  return r ? [...r.children].map(c => c.innerText.trim()) : null;
}, [id, muc, khi]);
/* nhan "chua du" o bang tong hop: Buoc 4 theo data-tong, Buoc 8 theo data-kq8 */
const chip4 = page => page.$$eval('#b4-tong td[data-tong]', ts => Object.fromEntries(ts.map(t => [t.getAttribute('data-tong'), !!t.querySelector('.qt-chip')])));
const chip8 = page => page.$$eval('#b8-ketqua td[data-kq8]', ts => Object.fromEntries(ts.map(t => [t.getAttribute('data-kq8'), !!t.querySelector('.qt-chip')])));

/* ---- ho so thu ---- */
const LOAI_K = ['codinh', 'didong', 'congnghiep', 'phattan', 'moichat', 'chatthai', 'hoi', 'dien'];
function hoSo(p) {
  const o = Object.assign({
    phienBan: 1,
    coSo: { ten: 'Công ty Thử nghiệm Hồi quy', diaChi: 'Số 1 đường Láng, Hà Nội', nhom: 'A', boQuanLy: 'Công Thương' },
    ky: { namBatDau: 2024, namKetThuc: 2025 }, gwp: 'AR5',
    moTa: { ranhGioi: 'Toàn bộ cơ sở.' }, beHapThu: { coHayKhong: false }, nguon: [], soLieu: [], heSo: []
  }, p);
  if (!o.loaiKhongCo) o.loaiKhongCo = LOAI_K.filter(k => !o.nguon.some(n => n.loai === k));
  return o;
}
const sl = (id, nam, gioTri, donVi, chiTiet) => ({ nguonId: id, nam, gioTri, donVi, nguonSoLieu: 'Hóa đơn', chungTu: 'HĐ-' + id + '-' + nam, nguoiCungCap: 'Phòng vật tư', chiTiet: chiTiet || {} });
/* lo hoi dot than: TJ va he so QD 2626 I.1.25 den I.1.27 */
function loThan(o, id, nam, tj) {
  o.nguon.push({ id, loai: 'codinh', phanLoai: 'than antraxit', thietBi: 'Lò hơi ' + id });
  nam.forEach((y, i) => { if (tj[i] != null) o.soLieu.push(sl(id, y, tj[i], 'TJ')); });
  [['CO2', 98300, 'I.1.25'], ['CH4', 10, 'I.1.26'], ['N2O', 1.5, 'I.1.27']].forEach(([k, v, ma]) =>
    o.heSo.push({ nguonId: id, khi: k, nam: null, maHeSo: 'QĐ2626:' + ma, giaTri: v, donVi: 'Kg ' + k + '/TJ', bac: 'qd2626', nguonGoc: 'Quyết định 2626/QĐ-BTNMT' }));
  return o;
}
function dienLuoi(o, id, nam, mwh, ef) {
  o.nguon.push({ id, loai: 'dien', phanLoai: 'Điện lưới', thietBi: 'Công tơ tổng' });
  nam.forEach((y, i) => {
    if (mwh[i] != null) o.soLieu.push(sl(id, y, mwh[i], 'MWh'));
    o.heSo.push({ nguonId: id, khi: 'CO2', nam: y, giaTri: ef, donVi: 'tCO₂/MWh', bac: 'muc2', nguonGoc: 'Số giả định để kiểm thử' });
  });
  loaiKhongCoLai(o);
  return o;
}
function loaiKhongCoLai(o) { o.loaiKhongCo = LOAI_K.filter(k => !o.nguon.some(n => n.loai === k)); }
/* mo than lo thien, 50.000 tan moi nam, he so CH4 du, o CO2 diem 5.5 de trong */
function moLoThien(nam) {
  const o = hoSo({ ky: { namBatDau: nam[0], namKetThuc: nam[1] } });
  o.nguon.push({ id: 'pt1', loai: 'phattan', phanLoai: 'Than', thietBi: 'Moong A', viTri: 'Quảng Ninh', thuocTinh: { congNghe: 'lothien' } });
  nam.forEach(y => o.soLieu.push(sl('pt1', y, 50000, 'tấn')));
  o.heSo.push({ nguonId: 'pt1', khi: 'CH4', nam: null, giaTri: 1.2, donVi: 'm³ CH₄/tấn', bac: 'ipcc', nguonGoc: 'IPCC 2006, Tập 2, Chương 4', thamSo: { cf: 0.67, cfNguon: 'IPCC 2006' } });
  loaiKhongCoLai(o);
  return o;
}
/* tong ky theo Muc 2 Phu luc II: lo than (diem 1) + dien luoi (diem 3) */
const GWP = { AR4: { CH4: 25, N2O: 298 }, AR5: { CH4: 28, N2O: 265 } };
const tongLoDien = (tj, mwh, ef, bo) => tj * 98300 / 1000 + tj * 10 / 1000 * GWP[bo].CH4 + tj * 1.5 / 1000 * GWP[bo].N2O + mwh * ef;

(async () => {
  const errors = [];
  console.log('Ảnh chụp: ' + SHOTS);
  console.log('Địa chỉ: ' + URL);
  const browser = await chromium.launch();
  async function moTrang(bag) {
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } });
    const page = await ctx.newPage(); theoDoiLoi(page, bag || errors);
    await page.goto(URL);
    return page;
  }

  console.log('\n1. Mỏ lộ thiên: hệ số CO₂ điểm 5.5');
  {
    const page = await moTrang();
    await nap(page, ghi('lo_thien.json', moLoThien([2024, 2025])));
    await diToi(page, 'buoc-3');
    const o = '#hs-phattan [data-b$="|CO2|-|';
    const ph = await page.getAttribute(o + 'donVi"]', 'placeholder');
    ok(ph === 'm³ CO₂/tấn', 'ô đơn vị hệ số CO₂ của mỏ lộ thiên gợi ý m³ CO₂/tấn, không phải m³ CH₄/tấn: ' + ph);
    const go = async (s, v) => { await page.fill(s, v); await page.press(s, 'Tab'); };
    await go(o + 'giaTri"]', '0,5');
    await page.selectOption(o + 'bac"]', 'ipcc');
    await go(o + 'nguonGoc"]', 'IPCC 2006, giả định để kiểm thử');
    await go(o + 'thamSo.cf"]', '1,84');
    const dv = await page.inputValue(o + 'donVi"]');
    ok(dv === 'm³ CO₂/tấn', 'không gõ đơn vị thì hệ số CO₂ tự lấy m³ CO₂/tấn: ' + dv);
    await diToi(page, 'buoc-4');
    const r = await dongKq(page, 'pt1', '5.5', 'CO2');
    const xong = await xongHet(page);
    ok(r && r[6] === vi(50000 * 0.5 * 1.84 / 1000, 3) && r[8] === '46' && xong[4], 'điểm 5.5 ra 50.000 × 0,5 × 1,84 ÷ 1000 = 46 tCO₂, Bước 4 hoàn thành: ' + (r ? r.slice(4).join(' | ') : 'không có dòng 5.5'));
    await page.context().close();
  }

  console.log('\n2. Phát tán không có công thức trong Thông tư 38');
  {
    const page = await moTrang();
    const o = hoSo({});
    loThan(o, 'cd1', [2024, 2025], [10, 12]);
    dienLuoi(o, 'dn1', [2024, 2025], [1000, 1100], 0.6592);
    o.nguon.push({ id: 'pt1', loai: 'phattan', phanLoai: 'Than', thietBi: 'Khu máy nghiền', thuocTinh: { congNghe: 'khac' } });
    o.nguon.push({ id: 'pt2', loai: 'phattan', phanLoai: 'Đá vôi', thietBi: 'Mỏ đá', thuocTinh: { congNghe: 'lothien' } });
    [2024, 2025].forEach(y => { o.soLieu.push(sl('pt1', y, 100, 'tấn')); o.soLieu.push(sl('pt2', y, 5000, 'tấn')); });
    loaiKhongCoLai(o);
    await nap(page, ghi('phat_tan_khac.json', o));
    await diToi(page, 'buoc-3');
    const thieu3 = gon(await noiDung(page, '#pane-buoc-3 .qt-thieu'));
    const xong = await xongHet(page);
    ok(xong[3] && !/Phát tán/.test(thieu3), 'Bước 3 không bắt nhập hệ số CH₄ cho nguồn phát tán “Khác” và mỏ đá vôi, Bước 3 hoàn thành' + (thieu3 ? ': ' + thieu3.slice(0, 160) : ''));
    await diToi(page, 'buoc-4');
    /* dong khong co cong thuc: khi de trong, chu mau xanh (thong tin), khong phai dong loi mau do */
    const dd = await page.$$eval('#b4-chitiet tr[data-dong^="pt"]', rs => rs.map(r => [r.getAttribute('data-dong'), getComputedStyle(r.lastElementChild).color, r.lastElementChild.innerText.trim()]));
    ok(dd.map(x => x[0]).join() === 'pt1|5|-,pt2|5|-' && dd.every(x => x[1] === 'rgb(35, 69, 143)'),
      'hai nguồn ra dòng thông tin không có công thức như quá trình công nghiệp, không phải dòng lỗi: ' + dd.map(x => x[0] + ' ' + x[1]).join(' / '));
    const t4 = await noiDung(page, '#pane-buoc-4');
    ok(xong[4] && (await xongHet(page))[4] && !t4.includes('dòng chưa tính được') && t4.includes('không có công thức, chưa gồm trong tổng'),
      'Bước 4 hoàn thành được, tổng ghi rõ có nguồn không có công thức, không báo dòng chưa tính được');
    await page.context().close();
  }

  console.log('\n3. Nhãn “chưa đủ” ở Bước 4, 7, 8');
  let fTruocCN;
  {
    const page = await moTrang();
    const nay = hoSo({ tinhLai: { tinhTrang: 'coDoi', truongHop: ['a'], lyDo: 'Thay đổi phương pháp.' } });
    nay.nguon.push({ id: 'cn1', loai: 'congnghiep', phanLoai: 'Sản xuất clinker', thietBi: 'Lò nung' });
    [2024, 2025].forEach(y => nay.soLieu.push(sl('cn1', y, 250000, 'tấn')));
    dienLuoi(nay, 'dn1', [2024, 2025], [1000, 1000], 0.7);
    const truoc = hoSo({ ky: { namBatDau: 2022, namKetThuc: 2023 } });
    truoc.nguon.push({ id: 'cn1', loai: 'congnghiep', phanLoai: 'Sản xuất clinker', thietBi: 'Lò nung' });
    [2022, 2023].forEach(y => truoc.soLieu.push(sl('cn1', y, 250000, 'tấn')));
    dienLuoi(truoc, 'dn1', [2022, 2023], [1000, 1000], 0.6766);
    fTruocCN = ghi('ky_truoc_clinker.json', truoc);
    await nap(page, ghi('ky_nay_clinker.json', nay));
    await diToi(page, 'buoc-4');
    const c4 = await chip4(page);
    const k4 = y => [c4[y + '|Phát thải trực tiếp'], c4[y + '|Phát thải gián tiếp'], c4[y + '|Tổng phát thải']];
    ok([2024, 2025].every(y => k4(y).join() === 'true,false,true'), 'Bước 4: trực tiếp và tổng ghi chưa đủ vì clinker không có công thức, gián tiếp không ghi: ' + JSON.stringify(c4));
    await diToi(page, 'buoc-8');
    const c8 = await chip8(page);
    const k8 = y => [c8[y + '|tt'], c8[y + '|gt'], c8[y + '|tong']];
    ok([2024, 2025].every(y => k8(y).join() === 'true,false,true'), 'Bước 8: gián tiếp đã tính đủ nên không ghi chưa đủ, trực tiếp và tổng có ghi: ' + JSON.stringify(c8));
    ok([2024, 2025].every(y => k4(y).join() === k8(y).join()), 'cùng một tổng mang cùng nhãn ở Bước 4 và Bước 8');
    await diToi(page, 'buoc-7');
    await napKy7(page, fTruocCN);
    const hop = gon(await noiDung(page, '#b7-file .qt-ct'));
    ok(/năm 2022: chưa đủ/.test(hop) && /năm 2023: chưa đủ/.test(hop) && !hop.includes(vi(676.6, 3)), 'Bước 7: tổng file kỳ trước có nguồn không có công thức ghi chưa đủ, không hiện 676,6 như tổng đủ: ' + hop.slice(0, 200));
    await page.click('[data-act="dien7|cu"]');
    const cu = await page.$$eval('[data-b^="p|tinhLai.ketQuaCu."]', es => es.map(e => e.value));
    ok(cu.length === 2 && cu.every(v => v === ''), 'Bước 7: “Điền vào cột đã báo cáo” không điền tổng chưa đủ: ' + JSON.stringify(cu));
    await page.context().close();
  }

  console.log('\n4. Giao diện tiếng Anh: đơn vị ở Bước 4 và Bước 3');
  {
    const page = await moTrang();
    const o = hoSo({});
    o.nguon.push({ id: 'h2', loai: 'hoi', thietBi: 'Công ty Hơi B', phanLoai: 'Hơi quá nhiệt' });
    o.nguon.push({ id: 'pt1', loai: 'phattan', phanLoai: 'Than', thietBi: 'Mỏ than Khe Chàm', thuocTinh: { congNghe: 'hamlo' } });
    [2024, 2025].forEach(y => {
      o.soLieu.push(sl('h2', y, null, 'tấn', { khoiLuongGio: 2, soGio: 4000, entanpi: 2800, apSuat: '10 bar', nhietDo: 180 }));
      o.soLieu.push(sl('pt1', y, 100000, 'tấn'));
    });
    o.heSo.push({ nguonId: 'h2', khi: 'CO2', nam: null, giaTri: null, donVi: '', bac: 'muc2', nguonGoc: 'Tự tính theo điểm 4', thamSo: { cachTinh: 'congThuc', hieuSuat: 85, efNhienLieu: 94600, efNguon: 'Quyết định 2626/QĐ-BTNMT' } });
    o.heSo.push({ nguonId: 'pt1', khi: 'CH4', nam: null, giaTri: 10, donVi: 'm³ CH₄/tấn', bac: 'ipcc', nguonGoc: 'IPCC 2006', thamSo: { cf: 0.67, cfNguon: 'IPCC 2006' } });
    loaiKhongCoLai(o);
    await nap(page, ghi('hoi_mo_than.json', o));
    await diToi(page, 'buoc-4');
    const hVi = await dongKq(page, 'h2', '4', 'CO2');
    await page.click('#qt-en');
    await diToi(page, 'buoc-4');
    const h = await dongKq(page, 'h2', '4', 'CO2'), m = await dongKq(page, 'pt1', '5.1', 'CH4');
    ok(h && h[4] === '8,000 t = 2 t/h × 4,000 h' && hVi && hVi[4] === '8.000 tấn = 2 tấn/giờ × 4.000 giờ', 'Bước 4 tiếng Anh: AD của hơi ghi “8,000 t = 2 t/h × 4,000 h”, tiếng Việt vẫn “tấn/giờ × … giờ”: ' + (h && h[4]));
    ok(h && /tCO₂\/t steam/.test(h[5]) && !/tấn|giờ/.test(h.join(' ')), 'Bước 4 tiếng Anh: EF của hơi ghi tCO₂/t steam, cả dòng không còn “tấn”, “giờ”: ' + (h && h[5]));
    ok(m && m[4] === '100,000 t', 'Bước 4 tiếng Anh: AD khai thác than ghi 100,000 t: ' + (m && m[4]));
    await diToi(page, 'buoc-3');
    const e3 = gon(await noiDung(page, '[data-calc="efhoi|h2|2024"]'));
    ok(/tCO₂\/t steam$/.test(e3) && !e3.includes('tấn'), 'Bước 3 tiếng Anh: dòng EF_H,p kết thúc bằng tCO₂/t steam: ' + e3);
    await page.context().close();
  }

  console.log('\n5. Bước 7: tổng kỳ trước theo bộ GWP đang chọn');
  {
    const TJ = [10, 12], MWH = [1000, 1100], EF = 0.6592;
    const truoc = hoSo({ ky: { namBatDau: 2022, namKetThuc: 2023 }, gwp: 'AR4' });
    loThan(truoc, 'cd1', [2022, 2023], TJ); dienLuoi(truoc, 'dn1', [2022, 2023], MWH, EF);
    const fTruoc = ghi('ky_truoc_2022_2023.json', truoc);
    const tl = { tinhTrang: 'coDoi', truongHop: ['b'], lyDo: 'Đổi bộ GWP từ AR4 sang AR5.', kyTruoc: { namBatDau: 2022, namKetThuc: 2023 } };
    const nayNull = hoSo({ gwp: null, tinhLai: tl }); loThan(nayNull, 'cd1', [2024, 2025], [20, 22]); dienLuoi(nayNull, 'dn1', [2024, 2025], [2000, 2100], EF);
    const nayAR5 = JSON.parse(JSON.stringify(nayNull)); nayAR5.gwp = 'AR5';
    const khac = JSON.parse(JSON.stringify(nayAR5)); khac.coSo.ten = 'Công ty Khác';
    const dk = bo => [0, 1].map(i => vi(tongLoDien(TJ[i], MWH[i], EF, bo), 3));
    const dong = (hop, bo) => { const m = new RegExp('đang chọn \\(' + bo + '\\): năm 2022: ([\\d.,]+); năm 2023: ([\\d.,]+)').exec(hop); return m ? [m[1], m[2]] : null; };

    /* a) chua chon GWP khi nap file ky truoc, sau do moi chon AR5: ban cu vo trang */
    const loiA = [];
    const page = await moTrang(loiA);
    await nap(page, ghi('ky_nay_chua_gwp.json', nayNull));
    await diToi(page, 'buoc-7');
    await napKy7(page, fTruoc);
    await diToi(page, 'buoc-4');
    await page.check('input[name="qt-gwp"][value="AR5"]');
    await diToi(page, 'buoc-7');
    const moDuoc = await page.evaluate(() => document.getElementById('pane-buoc-7').classList.contains('on'));
    const hopA = gon(await noiDung(page, '#b7-file .qt-ct'));
    const loiTrang = loiA.filter(x => x.startsWith('pageerror'));
    ok(loiTrang.length === 0 && moDuoc, 'chọn GWP ở Bước 4 sau khi đã nạp file kỳ trước: Bước 7 vẫn mở, không lỗi trang' + (loiTrang.length ? ': ' + loiTrang.join(' | ') : ''));
    ok((dong(hopA, 'AR5') || []).join() === dk('AR5').join(), 'dòng “theo bộ GWP đang chọn (AR5)” tính lại bằng AR5: ' + dk('AR5').join('; ') + ' (màn hình: ' + (dong(hopA, 'AR5') || ['không có']).join('; ') + ')');
    errors.push(...loiA.filter(x => !x.startsWith('pageerror')));
    await page.context().close();

    /* b) nap file ky truoc khi dang AR5, doi sang AR4: so phai theo AR4, dien vao cot tinh lai cung theo AR4 */
    const pb = await moTrang();
    await nap(pb, ghi('ky_nay_ar5.json', nayAR5));
    await diToi(pb, 'buoc-7');
    await napKy7(pb, fTruoc);
    const truocDoi = dong(gon(await noiDung(pb, '#b7-file .qt-ct')), 'AR5');
    await diToi(pb, 'buoc-4');
    await pb.check('input[name="qt-gwp"][value="AR4"]');
    await diToi(pb, 'buoc-7');
    const hopB = gon(await noiDung(pb, '#b7-file .qt-ct'));
    ok((truocDoi || []).join() === dk('AR5').join() && (dong(hopB, 'AR4') || []).join() === dk('AR4').join(),
      'đổi AR5 sang AR4 sau khi nạp file: dòng “đang chọn (AR4)” đổi thành ' + dk('AR4').join('; ') + ' (màn hình: ' + (dong(hopB, 'AR4') || ['không có']).join('; ') + ')');
    await pb.click('[data-act="dien7|moi"]');
    const moi = await pb.$$eval('[data-b^="p|tinhLai.ketQuaMoi."]', es => es.map(e => e.value));
    ok(moi.join() === dk('AR4').join(), '“Điền vào cột tính lại” ghi tổng theo AR4 đang chọn: ' + moi.join('; '));
    await nap(pb, ghi('ho_so_khac.json', khac));
    await diToi(pb, 'buoc-7');
    const conHop = await pb.$('#b7-file .qt-ct');
    ok(!conHop && (await pb.$('#b7-file')) !== null, 'mở hồ sơ khác thì hộp file kỳ trước của hồ sơ cũ không còn ở Bước 7');
    await pb.context().close();
  }

  console.log('\n6. Bước 3: tra Quyết định 2626 bằng tiếng Anh');
  {
    const page = await moTrang();
    const o = hoSo({});
    o.nguon.push({ id: 'cd2', loai: 'codinh', phanLoai: 'Dầu DO', thietBi: 'Máy phát dự phòng' });
    [2024, 2025].forEach(y => o.soLieu.push(sl('cd2', y, 100, 'tấn', { nhietTri: 0.0433 })));
    loaiKhongCoLai(o);
    await nap(page, ghi('dau_do.json', o));
    await page.click('#qt-en');
    await diToi(page, 'buoc-3');
    await page.click('[data-act^="tra|cd2|CO2"]');
    await page.waitForSelector('#qt-modal:not([hidden])');
    await page.fill('#tr-q', 'diesel');
    await page.waitForTimeout(100);
    const rows = await page.$$eval('#tr-kq tbody tr', rs => rs.map(r => [...r.children].map(c => c.innerText.trim())));
    const r = rows.find(x => x[0] === 'I.1.10');
    ok(r && r[3] === '74,100', 'giá trị I.1.10 ghi 74,100 theo cách viết số tiếng Anh, không phải 74.100: ' + (r ? r[3] : 'không thấy dòng I.1.10'));
    ok(r && r[5] === 'Tier 1', 'cột bậc ghi “Tier 1”, không phải “Bậc 1”: ' + (r ? r[5] : ''));
    await page.context().close();
  }

  console.log('\n7. Bước 6: nguồn chỉ phát thải ở năm thứ hai');
  {
    const page = await moTrang();
    const o = hoSo({});
    loThan(o, 'cd1', [2024, 2025], [10, 12]);
    dienLuoi(o, 'dn1', [2024, 2025], [null, 1100], 0.6592);
    await nap(page, ghi('dien_nam_sau.json', o));
    await diToi(page, 'buoc-6');
    const co = await page.$('[data-calc="urow|dn1|3|CO2"]');
    const soDong = (await page.$$('[data-calc^="urow|"]')).length;
    ok(co !== null && soDong === 4, 'bảng U có dòng điện lưới chỉ có số liệu năm 2025, tổng 4 dòng: ' + soDong);
    await page.context().close();
  }

  console.log('\n8. Bước 0: cơ sở ứng với nhiều dòng Quyết định 699');
  {
    const page = await moTrang();
    await page.click('#qt-new');
    await diToi(page, 'buoc-0');
    await page.fill('#tra-q', 'thep hoa phat');
    await page.locator('#tra-kq button', { hasText: 'Công ty Cổ phần Thép Hòa Phát' }).filter({ hasNotText: 'Dung Quất' }).first().click();
    const ct = gon(await noiDung(page, '#tra-ct'));
    const li = await page.$$eval('#tra-ct li', ls => ls.map(l => l.innerText));
    ok(li.length === 2 && li.some(x => x.includes('0900629369') && x.includes('2.406')) && li.some(x => x.includes('0800384651') && x.includes('4.494.857')),
      'liệt kê cả hai dòng Quyết định 699 với mã số thuế và hạn ngạch của từng dòng: ' + (li.join(' / ') || ct.slice(0, 200)));
    await page.click('[data-act="traDien"]');
    const mst = await page.inputValue('#f-mst');
    ok(mst === '' && (await page.inputValue('#f-ten')) === 'Công ty Cổ phần Thép Hòa Phát', 'hai mã số thuế khác nhau nên không tự điền mã số thuế, vẫn điền tên cơ sở: “' + mst + '”');
    await page.context().close();
  }

  console.log('\n9. Bước 0: gợi ý nhóm cho nhiệt điện, sắt thép, xi măng ngoài Quyết định 699');
  {
    const page = await moTrang();
    await page.click('#qt-new');
    await diToi(page, 'buoc-0');
    await page.fill('#tra-q', 'thep viet nga');
    await page.click('#tra-kq button >> nth=0');
    const ct = gon(await noiDung(page, '#tra-ct'));
    const nut = await page.$$eval('#tra-ct [data-act^="traNhom|"]', bs => bs.map(b => b.getAttribute('data-act')));
    ok(ct.includes('Gợi ý: nhóm B hoặc nhóm A.') && ct.includes('Điểm c khoản 4 Điều 11') && nut.join() === 'traNhom|B,traNhom|A',
      'gợi ý nhóm B hoặc nhóm A, dẫn điểm c khoản 4 Điều 11, có nút áp dụng cả hai nhóm: ' + nut.join(', '));
    ok(!/thì thuộc nhóm C/.test(ct) && !/Gợi ý: nhóm A\./.test(ct), 'không nói cơ sở được phân bổ hạn ngạch từ 2027 thì thuộc nhóm C');
    const cd = gon(await noiDung(page, '[data-i="nhomCd"]'));
    ok(cd.startsWith('Cơ sở không thuộc điểm c (nhiệt điện, sắt thép, xi măng)'), 'thẻ nhóm C nêu loại trừ cơ sở thuộc điểm c: ' + cd.slice(0, 80));
    await page.context().close();
  }

  console.log('\n10. Bước 0: kỳ báo cáo');
  {
    const p0 = await moTrang();
    await nap(p0, ghi('ky_khong_lien_ke.json', hoSo({ coSo: { ten: 'Nhà máy nhiệt điện thử', diaChi: 'Hà Nội', nhom: 'B', boQuanLy: 'Công Thương' }, ky: { namBatDau: 2023, namKetThuc: 2026 } })));
    const miss = gon(await noiDung(p0, '#qt-b0-miss'));
    ok(miss.includes('Kỳ báo cáo phải gồm hai năm liền kề') && !(await p0.isVisible('#qt-b0-ok')) && !(await xongHet(p0))[0],
      'kỳ 2023–2026 nạp từ file bị ghi thiếu ở Bước 0, Bước 0 chưa xong: ' + miss.slice(0, 160));
    await p0.context().close();
    const page = await moTrang();
    await page.click('#qt-new');
    await diToi(page, 'buoc-0');
    const wKy = () => page.evaluate(() => { const e = document.getElementById('w-ky'); return e ? e.textContent : null; });
    const chon = async (g, ky) => { await page.check('#qt-nhom input[value="' + g + '"]'); await page.selectOption('#f-ky', ky); return wKy(); };
    const aLech = await chon('A', '2025-2026'), bTruoc = await chon('B', '2024-2025'), aDung = await chon('A', '2024-2025');
    ok(/lệch chu kỳ/.test(aLech || '') && /2024–2025, 2026–2027/.test(aLech || ''), 'nhóm A kỳ 2025–2026: #w-ky cảnh báo lệch chu kỳ 2024–2025, 2026–2027: ' + aLech);
    ok(/Nhóm B có kỳ số liệu đầu tiên cho năm 2026/.test(bTruoc || '') && aDung === '', 'nhóm B kỳ 2024–2025: cảnh báo trước năm đầu 2026; nhóm A kỳ 2024–2025 không cảnh báo: ' + bTruoc);
    await page.context().close();

    const p2 = await moTrang();
    await nap(p2, ghi('dung_ky.json', moLoThien([2024, 2025])));
    await diToi(p2, 'buoc-8');
    const f2Dung = gon(await p2.$eval('#b8-phanf tr[data-f="2"]', r => r.lastElementChild.innerText));
    await nap(p2, ghi('lech_ky.json', moLoThien([2025, 2026])));
    await diToi(p2, 'buoc-8');
    const f2Lech = gon(await p2.$eval('#b8-phanf tr[data-f="2"]', r => r.lastElementChild.innerText));
    ok(f2Dung.startsWith('Đạt') && f2Lech.startsWith('Chưa đạt') && /lệch chu kỳ/.test(f2Lech), 'Phần F mục 2: kỳ 2024–2025 của nhóm A đạt, kỳ 2025–2026 lệch chu kỳ thì chưa đạt: ' + f2Lech.slice(0, 120));
    await p2.context().close();
  }

  console.log('\n11. Bước 0: đoạn giới thiệu nhóm');
  {
    const page = await moTrang();
    await page.click('#qt-new');
    await diToi(page, 'buoc-0');
    const pVi = gon(await noiDung(page, '[data-i="nhomp"]'));
    await page.click('#qt-en');
    const pEn = gon(await noiDung(page, '[data-i="nhomp"]'));
    await page.click('#qt-vi');
    ok(!pVi.includes('sẽ có ở bản sau') && pVi.includes('ô tra danh mục') && pVi.includes('ở trên'), 'tiếng Việt: chỉ tới ô tra danh mục ở trên, không nói “sẽ có ở bản sau”: ' + pVi);
    ok(!pEn.includes('later version') && pEn.includes('above'), 'tiếng Anh: không nói “will come in a later version”: ' + pEn);
    await page.context().close();
  }

  console.log('\n12. Bước 4: căn cứ bộ GWP');
  {
    const md = fs.readFileSync(path.join(ROOT, 'TT38_Phu_luc_II.md'), 'utf8');
    const dongMd = md.split('\n').find(l => /GWP_i là hệ số tiềm năng nóng lên toàn cầu của KNK i/.test(l));
    const trich = dongMd ? dongMd.replace(/^>\s*-\s*/, '').replace('GWP_i', 'GWPi').trim() : '';
    const page = await moTrang();
    await nap(page, ghi('gwp.json', moLoThien([2024, 2025])));
    await diToi(page, 'buoc-4');
    const the = await page.evaluate(() => { const i = document.querySelector('input[name="qt-gwp"]'); const c = i && i.closest('.qt-card'); return c ? c.innerText : ''; });
    ok(trich.length > 40 && gon(the).includes('Tiềm năng nóng lên toàn cầu, khoản 3 Điều 19 Thông tư 38/2023/TT-BCT'), 'thẻ Bộ GWP ghi căn cứ khoản 3 Điều 19 Thông tư 38/2023/TT-BCT');
    ok(gon(the).includes('“' + trich + '”'), 'thẻ Bộ GWP trích nguyên văn: “' + trich + '”');
    ok(!gon(the).includes('Nghị định chỉ quy định dùng hướng dẫn của IPCC'), 'không còn nói văn bản chỉ quy định dùng hướng dẫn IPCC mà không nêu gì thêm');
    await page.context().close();
  }

  console.log('\n13. Bước 2: hộp còn thiếu của khai thác than');
  {
    const page = await moTrang();
    const o = hoSo({});
    o.nguon.push({ id: 'pt1', loai: 'phattan', phanLoai: 'Than', thietBi: 'Mỏ than Khe Chàm', thuocTinh: { congNghe: 'hamlo' } });
    loaiKhongCoLai(o);
    await nap(page, ghi('mo_chua_so.json', o));
    await diToi(page, 'buoc-2');
    const muc = () => page.$$eval('#pane-buoc-2 .qt-thieu li', ls => ls.map(l => l.innerText.trim()));
    const truoc = await muc();
    const nam24 = truoc.filter(x => x.includes('2024'));
    const trung = nam24.length !== new Set(nam24).size;
    ok(!trung && nam24.some(x => /: Đơn vị$/.test(x)), 'năm 2024: sản lượng và đơn vị là hai mục khác nhau, mục đơn vị ghi “…: Đơn vị”, không trùng: ' + nam24.join(' / '));
    await page.fill('[data-b$="|2024|gioTri"]', '1000'); await page.press('[data-b$="|2024|gioTri"]', 'Tab');
    const sau = (await muc()).filter(x => x.includes('2024'));
    ok(sau.length === 1 && /: Đơn vị$/.test(sau[0]), 'nhập sản lượng 1000 thì năm 2024 chỉ còn thiếu đơn vị: ' + sau.join(' / '));
    await page.screenshot({ path: path.join(SHOTS, 'hq_buoc_2_thieu.png'), fullPage: false });
    await page.context().close();
  }

  await browser.close();
  console.log('\n14. Lỗi console');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang' + (errors.length ? ': ' + errors.slice(0, 5).join(' | ') : ''));
  console.log('\nKết quả: ' + pass + ' đạt, ' + fail + ' trượt');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
