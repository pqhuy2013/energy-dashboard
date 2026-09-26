/* Kiem thu toan luong, Giai doan 6. Chay tren chinh ban da dong goi knk-quy-trinh/index.html.

   Chay:  NODE_PATH=$(npm root -g) node tests/toan_luong.test.js

   Mot nguoi dung lam tron mot ky kiem ke 2024-2025 tu ho so trong, chi qua giao dien:
   tra danh muc o Buoc 0, khai nguon, nhap so lieu hai nam, gan he so bang hop tra, chon
   GWP, lap bien ban kiem soat chat luong, danh gia do khong chac chan, tinh toan lai, roi
   xuat .docx, .xlsx, .json va nap lai. Nghiem thu Giai doan 6 cua ke hoach: di het 9 man
   hinh, xuat va nap file, bon phep kiem chung so hoc, chuyen ngu hai chieu, kho dien thoai
   khong tran ngang, khong loi console. Kem: ban dong goi khop src/ (build.py --kiem), chay
   duoc khi khong co mang, anh chup tung man hinh o hai kho de xem.
   So lieu la so gia dinh. Can nhu Giai doan 5: python3 co python-docx, openpyxl, pymupdf
   va LibreOffice Writer, Calc de mo file xuat. */
'use strict';
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-test6-'));
const SHOTS = process.env.QT_SHOTS || path.join(os.tmpdir(), 'qt-shots');
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  ĐẠT   ' + msg); } else { fail++; console.log('  TRƯỢT ' + msg); } }
function theoDoiLoi(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}
const MAN = ['dau', 'buoc-0', 'buoc-1', 'buoc-2', 'buoc-3', 'buoc-4', 'buoc-5', 'buoc-6', 'buoc-7', 'buoc-8'];
const doiHash = (page, h) => page.evaluate(x => { location.hash = x; }, h);
const txt = (page, sel) => page.textContent(sel);
const xongBuoc = (page, n) => page.evaluate(i => document.querySelectorAll('#qt-menu .qt-mi')[i].classList.contains('xong'), n);
const xongHet = page => page.evaluate(() => Array.from(document.querySelectorAll('#qt-menu .qt-mi')).map(b => b.classList.contains('xong')));
const vi = (v, d) => v.toLocaleString('vi-VN', { maximumFractionDigits: d });
const gan = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
const sub = s => s.replace(/[₀-₉]/g, c => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)));
function boThoiGian(o) { const c = JSON.parse(JSON.stringify(o)); delete c.ngayCapNhat; delete c.taoBoi; return c; }

async function themNguon(page, loai, truong) {
  await page.click(`[data-act="them|${loai}"]`);
  for (const [f, v] of Object.entries(truong)) {
    const sel = `#loai-${loai} tbody tr:last-child [data-b$="|${f}"]`;
    if (await page.$eval(sel, e => e.tagName) === 'SELECT') await page.selectOption(sel, v); else await page.fill(sel, v);
  }
}
async function dienSo(page, loai, truong) {
  const row = `#bang-${loai} tbody tr:not(.qt-tr-trace) >> nth=0`;
  for (const [f, v] of Object.entries(truong)) {
    const loc = page.locator(row).locator(`[data-b$="|${f}"]`);
    if (await loc.evaluate(e => e.tagName) === 'SELECT') await loc.selectOption(v); else { await loc.fill(v); await loc.press('Tab'); }
  }
}
async function dienVet(page, loai, truong) {
  const row = `#bang-${loai} tbody tr.qt-tr-trace >> nth=0`;
  for (const [f, v] of Object.entries(truong)) {
    const loc = page.locator(row).locator(`[data-b$="|${f}"]`);
    if (await loc.getAttribute('type') === 'checkbox') { if (v) await loc.check(); else await loc.uncheck(); }
    else await loc.fill(v);
  }
}
async function traChon(page, trigger, q, coChu) {
  await page.click(trigger);
  await page.waitForSelector('#qt-modal:not([hidden])');
  if (q != null) await page.fill('#tr-q', q);
  await page.locator('#tr-kq tbody tr', { hasText: coChu }).first().locator('button[data-act^="chonHs|"]').click();
  await page.waitForSelector('#qt-modal[hidden]', { state: 'attached' });
}
async function nhapHs(page, loai, khi, nam, v) {
  const b = `#hs-${loai} [data-b$="|${khi}|${nam}|`;
  for (const [f, x] of Object.entries(v)) {
    const sel = b + f + '"]';
    if (await page.$eval(sel, e => e.tagName) === 'SELECT') await page.selectOption(sel, x); else { await page.fill(sel, x); await page.press(sel, 'Tab'); }
  }
}
/* o cua dong ket qua Buoc 4: [#, nguon, diem, khi, AD, EF, luong, GWP, tCO2td] */
const dongKq = (page, id, muc, khi) => page.$$eval('#b4-chitiet tr[data-dong]', (rs, a) => {
  const r = rs.find(x => x.getAttribute('data-dong') === a.join('|'));
  return r ? [...r.children].map(c => c.innerText.trim()) : null;
}, [id, muc, khi]);
const idNguon = (page, loai) => page.$eval(`#loai-${loai} tbody tr:last-child [data-b^="n|"]`, e => e.getAttribute('data-b').split('|')[1]);
async function taiXuong(page, sel, ten) {
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(sel)]);
  const f = path.join(TMP, ten || dl.suggestedFilename()); await dl.saveAs(f); return f;
}
async function napFile(page, file) {
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#qt-load')]);
  await fc.setFiles(file);
  await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
}
/* Dua trang thai giao dien (khong luu vao file) ve mac dinh truoc khi so noi dung man hinh:
   o tra danh muc o Buoc 0 de trong, the nam dau tien o Buoc 2 va Buoc 4 */
async function chuanManHinh(page, id) {
  if (id === 'buoc-0') { await page.fill('#tra-q', ''); await page.dispatchEvent('#tra-q', 'input'); }
  if (id === 'buoc-2') await page.click('[data-act="nam|2024"]');
  if (id === 'buoc-4') await page.click('[data-act="nam4|2024"]');
}
const khongTran = page => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

/* ---- so lieu cua ky va ket qua tinh doc lap theo Muc 2 Phu luc II Thong tu 38 ---- */
const NAM = [2024, 2025];
const SL = { codinh: [10, 12], didong: [5000, 5500], moichat: [10, 12], dien: [1000, 1100], hoi: [1000, 1100] };
const NT_DIESEL = 0.0000386, GWP_R410A = 1924, LUOI = 0.6592, ETA = 85, ENTANPI = 2776, EF_DIESEL = 74100;
function duKien(gwp) {
  const G = gwp === 'AR4' ? { CH4: 25, N2O: 298 } : { CH4: 28, N2O: 265 }, out = {};
  NAM.forEach((y, i) => {
    const r = [];
    const dot = (loai, tj, ef) => { r.push([loai, tj * ef[0] / 1000]); r.push([loai, tj * ef[1] / 1000 * G.CH4]); r.push([loai, tj * ef[2] / 1000 * G.N2O]); };
    dot('codinh', SL.codinh[i], [98300, 10, 1.5]);
    dot('didong', SL.didong[i] * NT_DIESEL, [74100, 3.9, 3.9]);
    r.push(['moichat', SL.moichat[i] / 1000 * GWP_R410A]);
    r.push(['dien', SL.dien[i] * LUOI]);
    r.push(['hoi', SL.hoi[i] * (ENTANPI / (ETA / 100) * EF_DIESEL / 1e9)]);
    const tt = r.filter(x => !['dien', 'hoi'].includes(x[0])).reduce((a, x) => a + x[1], 0), gt = r.filter(x => ['dien', 'hoi'].includes(x[0])).reduce((a, x) => a + x[1], 0);
    const e1 = r[0][1], e2 = r.find(x => x[0] === 'dien')[1], u1 = Math.hypot(5, 3), u2 = Math.hypot(2, 10);
    out[y] = { rows: r.map(x => x[1]), tt, gt, tong: tt + gt, u: Math.sqrt((u1 * e1) ** 2 + (u2 * e2) ** 2) / (e1 + e2) };
  });
  return out;
}
const DK = duKien('AR5');

(async () => {
  const errors = [];
  console.log('Ảnh chụp: ' + SHOTS);

  console.log('\n0. Bản đóng gói');
  let kiem = '';
  try { kiem = execFileSync('python3', [path.join(ROOT, 'build.py'), '--kiem']).toString(); } catch (e) { kiem = String(e.stdout || '') + String(e.stderr || ''); }
  ok(kiem.startsWith('index.html khop ban dung tu src/'), 'index.html đúng là bản dựng từ src/ hiện tại: ' + kiem.trim());
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  ok(!/<(script|link|img|iframe)\b[^>]*\b(src|href)=["']?(https?:)?\/\//i.test(html), 'file tự chứa, không tải script, stylesheet hay ảnh từ ngoài');
  ok(/window\.__QT_BUILD__="\d{4}-\d{2}-\d{2}"/.test(html), 'ngày dựng gắn vào hằng số __QT_BUILD__');

  let fJson, fDocx, fXlsx, man = {}, tong8 = {};
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } });
    const mang = [];
    await ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith('file:') || u.startsWith('data:') || u.startsWith('blob:')) r.continue(); else { mang.push(u); r.abort(); } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);

    console.log('\n1. Màn hình mở');
    ok((await page.$$('#qt-steplist li')).length === 9 && (await page.$$('#qt-menu .qt-mi')).length === 9, 'màn hình mở liệt kê 9 màn hình của quy trình');
    await page.screenshot({ path: path.join(SHOTS, '60_dau.png'), fullPage: true });
    await page.click('#qt-new');
    ok(await page.$eval('#pane-buoc-0', e => e.classList.contains('on')), 'bắt đầu kỳ mới thì vào Bước 0');

    console.log('\n2. Bước 0: tra danh mục, thông tin cơ sở');
    const D = await page.evaluate(() => window.__QT_DATA__);
    const iCs = D.cs.findIndex((r, i) => D.bo[r[1]][0] === 'Công Thương' && !D.hqmap[String(i)] && !r[7] && r[3].length > 25 && D.cs.filter(x => x[3] === r[3]).length === 1);
    const cs = D.cs[iCs];
    await page.fill('#tra-q', cs[3]);
    await page.click('#tra-kq button:first-child');
    ok((await txt(page, '#tra-ct')).includes('Gợi ý: nhóm A'), 'tra được cơ sở trong danh mục, gợi ý nhóm A: ' + cs[3]);
    await page.click('[data-act="traDien"]');
    await page.click('[data-act="traNhom|A"]');
    ok((await page.inputValue('#f-ten')) === cs[3] && (await page.inputValue('#f-pl')) === String(cs[0]) && (await page.inputValue('#f-stt')) === String(cs[2]), 'điền tên, phụ lục, số thứ tự từ danh mục');
    await page.selectOption('#f-ky', '2024-2025');
    if (!(await page.inputValue('#f-diachi'))) await page.fill('#f-diachi', 'Khu công nghiệp Thử, Hà Nội');
    await page.fill('#f-mst', '0109876543');
    await page.fill('#f-gpso', '0109876543');
    await page.fill('#f-gpngay', '2015-03-12');
    await page.fill('#f-gpnoi', 'Sở Kế hoạch và Đầu tư');
    await page.fill('#f-dd', 'Lê Thị Bình');
    await page.fill('#f-cv', 'Giám đốc');
    await page.fill('#f-lv', 'Sản xuất sản phẩm cơ khí.');
    ok(await xongBuoc(page, 0), 'Bước 0 xong');

    console.log('\n3. Bước 1: phạm vi và nguồn');
    await doiHash(page, 'buoc-1');
    await page.fill('[data-b="p|moTa.ranhGioi"]', 'Toàn bộ nhà máy trong hàng rào.');
    await page.fill('[data-b="p|moTa.haTang"]', 'Một lò hơi than, một xe tải, hệ thống điều hòa, nhận hơi từ khu công nghiệp.');
    await themNguon(page, 'codinh', { phanLoai: 'than antraxit', thietBi: 'Lò hơi than' });
    await themNguon(page, 'didong', { 'tt.loaiPhuongTien': 'Ô tô', thietBi: 'Xe tải 29C-11111', phanLoai: 'Dầu diesel' });
    await themNguon(page, 'moichat', { thietBi: 'Điều hòa Daikin', viTri: 'Văn phòng', phanLoai: 'R410A' });
    await themNguon(page, 'dien', { phanLoai: 'Điện lưới', thietBi: 'Công tơ tổng' });
    await themNguon(page, 'hoi', { thietBi: 'Công ty cấp hơi khu công nghiệp' });
    const ID = {};
    for (const l of ['codinh', 'didong', 'moichat', 'dien', 'hoi']) ID[l] = await idNguon(page, l);
    for (const l of ['congnghiep', 'phattan', 'chatthai']) await page.check(`[data-b="k|${l}"]`);
    await page.check('input[name=qt-bht][value=khong]');
    ok(await xongBuoc(page, 1), 'Bước 1 xong: 5 loại có nguồn, 3 loại đánh dấu không có, trả lời bể hấp thụ');

    console.log('\n4. Bước 2: số liệu hai năm');
    await doiHash(page, 'buoc-2');
    for (const [i, y] of NAM.entries()) {
      await page.click(`[data-act="nam|${y}"]`);
      await dienSo(page, 'codinh', { gioTri: vi(SL.codinh[i]), donVi: 'TJ' });
      await dienSo(page, 'didong', { gioTri: vi(SL.didong[i]), 'ct.quangDuong': '20.000', 'ct.nhietTri': vi(NT_DIESEL, 10) });
      await dienSo(page, 'moichat', { gioTri: vi(SL.moichat[i]) });
      await dienSo(page, 'dien', { gioTri: vi(SL.dien[i]) });
      await dienSo(page, 'hoi', { 'ct.entanpi': vi(ENTANPI), gioTri: vi(SL.hoi[i]) });
      for (const l of ['codinh', 'didong', 'moichat', 'dien', 'hoi'])
        await dienVet(page, l, { nguonSoLieu: 'Hóa đơn', chungTu: 'HĐ-' + l + '-' + y, nguoiCungCap: 'Phòng kế toán' });
    }
    await dienVet(page, 'didong', { laUocTinh: true });
    await dienVet(page, 'didong', { cachUocTinh: 'Ước theo quãng đường' });
    await page.fill('[data-b="p|moTa.heThongDuLieu"]', 'Phòng kế toán lưu hóa đơn; số liệu nhiên liệu xe tải năm 2025 là ước tính.');
    ok(await xongBuoc(page, 2), 'Bước 2 xong');

    console.log('\n5. Bước 3: hệ số');
    await doiHash(page, 'buoc-3');
    for (const k of ['CO2', 'CH4', 'N2O'])
      await traChon(page, `#hs-codinh [data-act^="tra|"][data-act$="|${k}|-"]`, 'than antraxit', 'Công nghiệp sản xuất và xây dựng');
    for (const [k, v] of [['CO2', '74.100'], ['CH4', '3,9'], ['N2O', '3,9']])
      await nhapHs(page, 'didong', k, '-', { giaTri: v, bac: 'ipcc', nguonGoc: 'IPCC 2006, Tập 2, Bảng 3.2.1 và 3.2.2' });
    await nhapHs(page, 'moichat', 'GWP', '-', { giaTri: vi(GWP_R410A), nguonGoc: 'IPCC AR5, R410A' });
    for (const y of NAM) await nhapHs(page, 'dien', 'CO2', String(y), { giaTri: vi(LUOI, 4), nguonGoc: 'Số giả định để kiểm thử' });
    await page.check('#hs-hoi input[type=radio][value=congThuc]');
    await nhapHs(page, 'hoi', 'CO2', '-', { 'thamSo.hieuSuat': String(ETA) });
    await traChon(page, '#hs-hoi [data-act^="traNL|"]', 'dau diesel', 'Công nghiệp sản xuất và xây dựng');
    ok(await xongBuoc(page, 3), 'Bước 3 xong');

    console.log('\n6. Bước 4: bốn phép kiểm chứng số học');
    await doiHash(page, 'buoc-4');
    await page.check('input[name=qt-gwp][value=AR4]');
    const c1 = await dongKq(page, ID.codinh, '1', 'CO2');
    ok(c1 && c1[4].startsWith('10 TJ') && c1[5].startsWith('98.300') && c1[8] === '983', 'phép kiểm chứng 1: 10 TJ than antraxit × 98.300 kg CO₂/TJ = 983 tCO₂tđ');
    const d1 = await dongKq(page, ID.dien, '3', 'CO2');
    ok(d1 && d1[4] === '1.000 MWh' && d1[5].startsWith('0,6592') && d1[8] === '659,2', 'phép kiểm chứng 2: 1.000 MWh × 0,6592 tCO₂/MWh = 659,2 tCO₂');
    const g4 = (await dongKq(page, ID.codinh, '1', 'CH4'))[7];
    await page.check('input[name=qt-gwp][value=AR5]');
    const g5 = (await dongKq(page, ID.codinh, '1', 'CH4'))[7];
    ok(g4 === '25' && g5 === '28', 'phép kiểm chứng 3: đổi AR4 sang AR5, cột GWP của CH₄ từ 25 thành 28');
    await doiHash(page, 'buoc-3');
    await page.click('#hs-codinh [data-act^="boChon|"][data-act$="|CO2|-"]');
    await page.click('#hs-codinh [data-act^="tra|"][data-act$="|CO2|-"]');
    await page.selectOption('#tr-lv', ''); await page.selectOption('#tr-nhom', ''); await page.fill('#tr-q', 'CaO');
    const hc = page.locator('#tr-kq tbody tr', { hasText: 'Hàm lượng CaO/clinker' });
    ok(await hc.count() === 1 && await hc.locator('button').count() === 0 && (await hc.textContent()).includes('không nhân trực tiếp với số liệu hoạt động'),
      'phép kiểm chứng 4: hệ số hiệu chỉnh không thêm được vào bảng tính, có câu giải thích');
    await page.fill('#tr-q', 'than antraxit'); await page.selectOption('#tr-nhom', 'Các hoạt động đốt nhiên liệu');
    await page.locator('#tr-kq tbody tr', { hasText: 'Công nghiệp sản xuất và xây dựng' }).first().locator('button').click();
    await doiHash(page, 'buoc-4');
    ok((await dongKq(page, ID.codinh, '1', 'CO2'))[8] === '983', 'chọn lại hệ số CO₂ của than antraxit, dòng CO₂ về lại 983');
    await page.fill('[data-b="p|moTa.phuongPhap"]', 'Bậc 1 theo IPCC; dùng bộ GWP AR5 như kiểm kê quốc gia.');
    for (const y of NAM) {
      const t = (await txt(page, `#b4-tong [data-tong="${y}|Tổng phát thải"]`)).trim();
      ok(t === vi(DK[y].tong, 3), `tổng năm ${y} trên Bước 4 khớp tính tay: ${t}`);
    }
    ok(await xongBuoc(page, 4), 'Bước 4 xong');

    console.log('\n7. Bước 5 đến Bước 7');
    await doiHash(page, 'buoc-5');
    await page.click('[data-act="qc4"]');
    for (let i = 0; i < 4; i++) {
      await page.fill(`[data-b="p|qc.${i}.nguoiKiem"]`, 'Phạm Văn Kiểm');
      await page.fill(`[data-b="p|qc.${i}.ngay"]`, '2026-02-0' + (i + 2));
      await page.selectOption(`[data-b="p|qc.${i}.ketQua"]`, 'dat');
    }
    ok(await xongBuoc(page, 5), 'Bước 5 xong: biên bản đủ 4 nội dung tối thiểu');
    await doiHash(page, 'buoc-6');
    for (const k of ['a', 'b', 'c', 'd', 'dd', 'e']) await page.fill(`[data-b="p|khongChacChan.dinhTinh.${k}"]`, 'Nhận xét của cơ sở về nội dung ' + k + '.');
    for (const [id, m, a, e] of [[ID.codinh, '1', '5', '3'], [ID.dien, '3', '2', '10']]) {
      await page.fill(`[data-b="u|${id}|${m}|CO2|uAd"]`, a); await page.press(`[data-b="u|${id}|${m}|CO2|uAd"]`, 'Tab');
      await page.fill(`[data-b="u|${id}|${m}|CO2|uEf"]`, e); await page.press(`[data-b="u|${id}|${m}|CO2|uEf"]`, 'Tab');
    }
    ok(await xongBuoc(page, 6), 'Bước 6 xong');
    ok((await txt(page, '#pane-buoc-6')).includes('Năm 2024: độ không chắc chắn của tổng phát thải ±' + vi(DK[2024].u, 1) + ' %'), 'độ không chắc chắn năm 2024 theo phương trình 3.2: ±' + vi(DK[2024].u, 1) + ' %');
    await doiHash(page, 'buoc-7');
    await page.check('input[data-b="p|tinhLai.tinhTrang"][value="kyDau"]');
    ok(await xongBuoc(page, 7), 'Bước 7 xong: kỳ báo cáo đầu tiên');

    console.log('\n8. Bước 8: kết quả, xuất file');
    await doiHash(page, 'buoc-8');
    ok((await xongHet(page)).every(Boolean), 'cả 9 màn hình có dấu xong');
    for (const y of NAM) for (const k of ['tt', 'gt', 'tong']) tong8[y + '|' + k] = (await txt(page, `[data-kq8="${y}|${k}"]`)).trim();
    ok(NAM.every(y => tong8[y + '|tong'] === vi(DK[y].tong, 3) && tong8[y + '|tt'] === vi(DK[y].tt, 3) && tong8[y + '|gt'] === vi(DK[y].gt, 3)),
      'kết quả Bước 8 khớp tính tay: 2024 ' + tong8['2024|tong'] + ', 2025 ' + tong8['2025|tong']);
    const pf = await page.$$eval('#b8-phanf tr[data-f]', rs => rs.map(r => r.lastElementChild.textContent));
    ok(pf.slice(0, 12).every(x => x.startsWith('Đạt')) && pf.slice(12).every(x => x.startsWith('Tự kiểm')), 'bảng kiểm trước khi nộp: 12 mục đạt, 3 mục tự kiểm');
    fDocx = await taiXuong(page, '[data-act="xuatDocx"]', 'mau06.docx');
    fXlsx = await taiXuong(page, '[data-act="xuatXlsx"]', 'bang_tinh.xlsx');
    fJson = await taiXuong(page, '[data-act="xuatJson"]', 'ho_so.json');
    ok(fs.statSync(fDocx).size > 20000 && fs.statSync(fXlsx).size > 20000, 'tải được .docx và .xlsx');

    console.log('\n9. Ảnh chụp từng màn hình, khổ 1360 px');
    for (const [i, id] of MAN.entries()) {
      await doiHash(page, id); await chuanManHinh(page, id); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(60);
      man[id] = await page.innerText('#pane-' + id);
      await page.screenshot({ path: path.join(SHOTS, `6${i}_${id.replace('-', '_')}.png`), fullPage: true });
    }
    ok(Object.keys(man).length === 10, 'đã chụp đủ 10 màn hình');

    console.log('\n10. Chuyển ngữ hai chiều trên từng màn hình');
    const loiNgu = [];
    for (const id of MAN) {
      await doiHash(page, id);
      const v1 = await page.innerText('#pane-' + id), t1 = await txt(page, '#qt-title');
      await page.click('#qt-en');
      const e = await page.innerText('#pane-' + id), te = await txt(page, '#qt-title');
      if (e === v1) loiNgu.push(id + ': tiếng Anh giống hệt tiếng Việt');
      if (id !== 'dau' && !/^Step \d\. /.test(te)) loiNgu.push(id + ': tiêu đề tiếng Anh ' + te);
      if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(e)) loiNgu.push(id + ': chữ lỗi trong bản tiếng Anh');
      await page.click('#qt-vi');
      const v2 = await page.innerText('#pane-' + id), t2 = await txt(page, '#qt-title');
      if (v2 !== v1 || t2 !== t1) loiNgu.push(id + ': về tiếng Việt không giống ban đầu');
    }
    ok(loiNgu.length === 0, 'VI sang EN rồi về VI trên cả 10 màn hình, nội dung trở về đúng như cũ' + (loiNgu.length ? ': ' + loiNgu.join('; ') : ''));
    ok(mang.length === 0, 'chạy trọn luồng không gửi yêu cầu mạng nào ra ngoài' + (mang.length ? ': ' + mang.slice(0, 3).join(', ') : ''));
    await browser.close();
  }

  console.log('\n11. File xuất');
  const K = JSON.parse(execFileSync('python3', [path.join(__dirname, 'kiem_file.py'), fDocx, fXlsx, SHOTS, 'toan_luong'], { maxBuffer: 64 << 20, timeout: 600000 }).toString('utf8'));
  const P = K.docx.paras;
  ok(K.docx.pdf && K.docx.pdf.pages >= 5, 'LibreOffice mở được .docx, ' + (K.docx.pdf && K.docx.pdf.pages) + ' trang');
  ok(K.docx.highlights.length === 0, 'hồ sơ đầy đủ thì bản thảo không còn chỗ [Chưa nhập]' + (K.docx.highlights.length ? ': ' + K.docx.highlights.slice(0, 5).join(' | ') : ''));
  ok(P.includes('Kết quả kiểm kê khí nhà kính cho năm 2024 và năm 2025'), 'tiêu đề ghi cả hai năm');
  const bangKQ = K.docx.tables.filter(t => t[0].length === 9 && t[0][8].startsWith('Phát thải'));
  ok(bangKQ.length === 2 && NAM.every((y, i) => bangKQ[i][bangKQ[i].length - 1].slice(-1)[0] === tong8[y + '|tong']), 'tổng cộng từng năm trong .docx khớp màn hình Bước 8');
  ok(NAM.every((y, i) => bangKQ[i].slice(1, -1).filter(r => r.length === 9).map(r => r[8]).sort().join(';') === DK[y].rows.map(v => vi(v, 3)).sort().join(';')), 'từng dòng phát thải trong .docx khớp tính tay');
  ok(P.some(p => p.startsWith('- Năm 2024: độ không chắc chắn của phần phát thải có đủ số liệu') && p.endsWith('là ±' + vi(DK[2024].u, 1) + ' %.')), 'III.4 có độ không chắc chắn năm 2024, nói rõ chỉ tính trên phần có số liệu');
  ok(P.some(p => p.includes('đây là kỳ báo cáo đầu tiên của cơ sở')), 'III.3 ghi đây là kỳ báo cáo đầu tiên');
  const X = K.xlsx;
  ok(X.calc !== null, 'LibreOffice mở được .xlsx và tính lại công thức');
  let lech = 0, soCT = 0;
  for (const sh of X.sheets) for (const [ref, c] of Object.entries(X.cells[sh])) {
    if (!('f' in c)) continue; soCT++;
    const m = X.calc[sh][ref];
    if (!((typeof c.v === 'number' && typeof m === 'number') ? gan(m, c.v) : ((c.v == null || c.v === '') && (m == null || m === '')))) lech++;
  }
  ok(soCT > 50 && lech === 0, soCT + ' ô công thức tính lại khớp giá trị ứng dụng');
  const th = X.cells['Tổng hợp'], thc = X.calc['Tổng hợp'];
  const rT = Object.keys(th).find(r => /^A\d+$/.test(r) && th[r].v === 'Tổng phát thải').slice(1);
  ok(gan(thc['B' + rT], DK[2024].tong) && gan(thc['C' + rT], DK[2025].tong), 'tổng hợp .xlsx khớp tính tay');

  console.log('\n12. Trình duyệt mới: nạp file .json, không mất gì');
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await napFile(page, fJson);
    ok((await xongHet(page)).every(Boolean), 'nạp lại: cả 9 màn hình vẫn xong');
    const khac = [];
    for (const id of MAN.slice(1)) {
      await doiHash(page, id); await chuanManHinh(page, id);
      const t = await page.innerText('#pane-' + id);
      if (t !== man[id]) { khac.push(id); fs.writeFileSync(path.join(TMP, 'khac_' + id + '_truoc.txt'), man[id]); fs.writeFileSync(path.join(TMP, 'khac_' + id + '_sau.txt'), t); }
    }
    ok(khac.length === 0, 'nạp lại: nội dung 9 màn hình giống hệt trước khi xuất' + (khac.length ? ': ' + khac.join(', ') : ''));
    const f2 = await taiXuong(page, '#qt-save', 'ho_so_lan2.json');
    ok(JSON.stringify(boThoiGian(JSON.parse(fs.readFileSync(fJson, 'utf8')))) === JSON.stringify(boThoiGian(JSON.parse(fs.readFileSync(f2, 'utf8')))), 'xuất lại sau khi nạp: trùng khớp file gốc, trừ dấu thời gian');
    await browser.close();
  }

  console.log('\n13. Khổ điện thoại 375 px');
  {
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await napFile(page, fJson);
    const tran = [];
    for (const [i, id] of MAN.entries()) {
      for (const ngu of ['#qt-vi', '#qt-en']) {
        await page.click(ngu); await doiHash(page, id); await page.waitForTimeout(60);
        if (!(await khongTran(page))) tran.push(id + (ngu === '#qt-en' ? ' EN' : ''));
      }
      await page.click('#qt-vi'); await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: path.join(SHOTS, `7${i}_dien_thoai_${id.replace('-', '_')}.png`), fullPage: true });
    }
    ok(tran.length === 0, 'cả 10 màn hình, hai ngôn ngữ, không tràn ngang' + (tran.length ? ': ' + tran.join(', ') : ''));
    await browser.close();
  }

  console.log('\n14. Lỗi console');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang trong cả luồng' + (errors.length ? ': ' + errors.slice(0, 5).join(' | ') : ''));
  console.log('\nKết quả: ' + pass + ' đạt, ' + fail + ' trượt');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
