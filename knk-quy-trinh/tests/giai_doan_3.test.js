/* Kiem thu nghiem thu Giai doan 3 (Buoc 4, tinh toan), chay tren ban da dong goi.

   Chay:  NODE_PATH=$(npm root -g) node tests/giai_doan_3.test.js

   Bon phep kiem chung cua ke hoach:
     10 TJ than antraxit × 98.300 kg CO2/TJ          -> 983 tCO2td
     1.000 MWh × 0,6592 tCO2/MWh                     -> 659,2 tCO2
     Doi AR4 sang AR5, cot GWP cua CH4                -> 25 doi thanh 28
     Them mot he so hieu chinh vao bang tinh          -> bi chan, co cau giai thich
   Kem cac phep thu de xuat o TT38_Phu_luc_II.md muc 6. So lieu la so gia dinh. */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-test3-'));
const SHOTS = process.env.QT_SHOTS || path.join(os.tmpdir(), 'qt-shots');
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  ĐẠT   ' + msg); } else { fail++; console.log('  TRƯỢT ' + msg); } }
function theoDoiLoi(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}
const doiHash = (page, h) => page.evaluate(x => { location.hash = x; }, h);
const txt = (page, sel) => page.textContent(sel);
const xongBuoc = (page, n) => page.evaluate(i => document.querySelectorAll('#qt-menu .qt-mi')[i].classList.contains('xong'), n);

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
/* o cua dong ket qua thu i co diem Muc 2 va khi cho truoc: [#, nguon, diem, khi, AD, EF, luong, GWP, tCO2td] */
const dongKq = (page, muc, khi, i = 0) => page.$$eval('#b4-chitiet tr[data-dong]', (rs, a) => {
  const m = rs.filter(r => { const p = r.getAttribute('data-dong').split('|'); return p[1] === a[0] && p[2] === a[1]; });
  return m[a[2]] ? [...m[a[2]].children].map(c => c.innerText.trim()) : null;
}, [muc, khi, i]);
const tongNam = (page, y, nhan) => page.$eval(`#b4-tong [data-tong="${y}|${nhan}"]`, e => e.childNodes[0].textContent.trim());
async function napFile(page, file) {
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#qt-open')]);
  await fc.setFiles(file);
  await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
}

(async () => {
  const errors = [];
  let file1;
  console.log('Ảnh chụp: ' + SHOTS);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } });
  const page = await ctx.newPage(); theoDoiLoi(page, errors);
  await page.goto(URL);
  await page.click('#qt-new');

  console.log('\n1. Dựng hồ sơ thử');
  await page.check('input[name=nhom][value=A]');
  await page.selectOption('#f-ky', '2023-2024');
  await page.fill('#f-ten', 'Công ty Thử nghiệm tính toán');
  await page.fill('#f-diachi', 'Số 1 đường Thử, Hà Nội');
  await doiHash(page, 'buoc-1');
  await page.fill('[data-b="p|moTa.ranhGioi"]', 'Toàn bộ nhà máy.');
  await themNguon(page, 'codinh', { phanLoai: 'than antraxit', thietBi: 'Lò hơi than' });
  await themNguon(page, 'phattan', { phanLoai: 'Than', 'tt.congNghe': 'hamlo', thietBi: 'Khu mỏ A' });
  await themNguon(page, 'moichat', { thietBi: 'Máy lạnh trung tâm', phanLoai: 'R134a' });
  await themNguon(page, 'dien', { phanLoai: 'Điện lưới', thietBi: 'Công tơ tổng' });
  await themNguon(page, 'hoi', { thietBi: 'Công ty cấp hơi Đông Á' });
  for (const l of ['didong', 'congnghiep', 'chatthai']) await page.check(`[data-b="k|${l}"]`);
  await page.check('input[name=qt-bht][value=khong]');
  ok(await xongBuoc(page, 1), 'Bước 1 hoàn thành');
  await doiHash(page, 'buoc-2');
  for (const y of [2023, 2024]) {
    await page.click(`[data-act="nam|${y}"]`);
    await dienSo(page, 'codinh', { gioTri: '10', donVi: 'TJ' });
    await dienSo(page, 'phattan', { gioTri: '100.000', donVi: 'tấn', 'ct.ch4Dot': '1.000.000', 'ct.hieuSuatDot': '98' });
    await dienSo(page, 'moichat', { gioTri: '10' });
    await dienSo(page, 'dien', { gioTri: '1.000' });
    await dienSo(page, 'hoi', { 'ct.entanpi': '2.776', gioTri: '1.000' });
  }
  ok(await xongBuoc(page, 2), 'Bước 2 hoàn thành');
  await doiHash(page, 'buoc-3');
  for (const k of ['CO2', 'CH4', 'N2O'])
    await traChon(page, `#hs-codinh [data-act^="tra|"][data-act$="|${k}|-"]`, 'than antraxit', 'Công nghiệp sản xuất và xây dựng');
  await nhapHs(page, 'phattan', 'CH4', '-', { giaTri: '10', bac: 'ipcc', nguonGoc: 'Số giả định để kiểm thử' });
  ok((await page.inputValue('#hs-phattan [data-b$="|CH4|-|donVi"]')) === 'm³ CH₄/tấn', 'hệ số nhập tay lấy đơn vị chuẩn của ô: m³ CH₄/tấn');
  await nhapHs(page, 'moichat', 'GWP', '-', { giaTri: '1.430', nguonGoc: 'IPCC AR4, HFC-134a' });
  await page.click('#hs-dien [data-act^="luoi|"][data-act$="|CO2|2023"]');
  await nhapHs(page, 'dien', 'CO2', '2024', { giaTri: '0,6', nguonGoc: 'Số giả định để kiểm thử' });
  await page.check('#hs-hoi input[type=radio][value=congThuc]');
  await nhapHs(page, 'hoi', 'CO2', '-', { 'thamSo.hieuSuat': '85' });
  await traChon(page, '#hs-hoi [data-act^="traNL|"]', 'dau diesel', 'Công nghiệp sản xuất và xây dựng');
  ok((await page.inputValue('#hs-hoi [data-b$="|CO2|-|thamSo.efNhienLieu"]')) === '74.100', 'hệ số nhiên liệu lò hơi lấy từ QĐ 2626: 74.100 kg CO₂/TJ');
  const pv = await txt(page, '#hs-hoi [data-calc^="efhoi|"]');
  ok(pv.includes('= 0,242 tCO₂/tấn hơi') && pv.includes('÷ 0,85'), 'hệ số hơi tự tính: 2.776 ÷ 0,85 × 74.100 ÷ 10⁹ = 0,242, hiệu suất 85 % đã đổi ra 0,85');
  ok(await xongBuoc(page, 3), 'Bước 3 hoàn thành');

  console.log('\n2. Bước 4: chưa chọn bộ GWP');
  await doiHash(page, 'buoc-4');
  ok(!(await xongBuoc(page, 4)) && (await txt(page, '#pane-buoc-4 .qt-thieu')).includes('Chọn bộ GWP'), 'chưa chọn bộ GWP thì Bước 4 chưa xong');
  ok((await txt(page, '#b4-tong')).includes('Chọn bộ GWP'), 'bảng tổng hợp nhắc chọn bộ GWP');
  const co2Truoc = await dongKq(page, '1', 'CO2');
  ok(co2Truoc && co2Truoc[8] === '983', 'CO₂ không cần GWP nên vẫn tính: 983');
  const ch4Truoc = await dongKq(page, '1', 'CH4');
  ok(ch4Truoc && ch4Truoc[8] === '' && ch4Truoc[7] === '—', 'CH₄ chưa có GWP thì để trống, không tự lấy bộ nào');

  console.log('\n3. Bốn phép kiểm chứng của kế hoạch');
  await page.check('input[name=qt-gwp][value=AR4]');
  const c1 = await dongKq(page, '1', 'CO2');
  ok(c1[4].startsWith('10 TJ') && c1[5].startsWith('98.300 Kg CO2/TJ') && c1[8] === '983', 'phép thử 1: 10 TJ than antraxit × 98.300 kg CO₂/TJ = 983 tCO₂tđ');
  const d1 = await dongKq(page, '3', 'CO2');
  ok(d1[4] === '1.000 MWh' && d1[5].startsWith('0,6592') && d1[8] === '659,2', 'phép thử 2: 1.000 MWh × 0,6592 tCO₂/MWh = 659,2 tCO₂');
  const g4 = await page.$eval('[data-gwp="AR4|CH4"]', e => e.textContent), r4 = (await dongKq(page, '1', 'CH4'))[7];
  await page.check('input[name=qt-gwp][value=AR5]');
  const r5 = (await dongKq(page, '1', 'CH4'))[7], g5 = await page.$eval('[data-gwp="AR5|CH4"]', e => e.textContent);
  ok(g4 === '25' && r4 === '25' && g5 === '28' && r5 === '28', 'phép thử 3: đổi AR4 sang AR5, cột GWP của CH₄ từ 25 thành 28');
  await page.check('input[name=qt-gwp][value=AR4]');
  await doiHash(page, 'buoc-3');
  await page.click('#hs-codinh [data-act^="boChon|"][data-act$="|CO2|-"]');
  await page.click('#hs-codinh [data-act^="tra|"][data-act$="|CO2|-"]');
  await page.selectOption('#tr-lv', ''); await page.selectOption('#tr-nhom', ''); await page.fill('#tr-q', 'CaO');
  const hc = page.locator('#tr-kq tbody tr', { hasText: 'Hàm lượng CaO/clinker' });
  ok(await hc.count() === 1 && await hc.locator('button').count() === 0 && (await hc.textContent()).includes('không nhân trực tiếp với số liệu hoạt động'), 'phép thử 4a: hệ số hiệu chỉnh không có nút thêm, thay bằng câu giải thích');
  await page.fill('#tr-q', 'than antraxit'); await page.selectOption('#tr-nhom', 'Các hoạt động đốt nhiên liệu');
  await page.locator('#tr-kq tbody tr', { hasText: 'Công nghiệp sản xuất và xây dựng' }).first().locator('button').click();
  await doiHash(page, 'buoc-4');

  console.log('\n4. Các phép thử đề xuất ở TT38_Phu_luc_II.md');
  const h = await dongKq(page, '4', 'CO2');
  ok(h[4] === '1.000 tấn' && h[5].includes('0,242002') && h[8] === '242,002', 'hơi: 1.000 tấn × 0,242 tCO₂/tấn hơi = 242 tCO₂');
  const p1 = await dongKq(page, '5.1', 'CH4');
  ok(p1[6] === '670' && p1[7] === '25' && p1[8] === '16.750' && p1[5].includes('khối lượng riêng 0,67 kg/m³'), 'CH₄ hầm lò: 100.000 tấn × 10 m³/tấn × 0,67 kg/m³ = 670 tấn CH₄ = 16.750 tCO₂tđ theo AR4, ghi rõ khối lượng riêng');
  const p2 = await dongKq(page, '5.2', 'CO2'), p3 = await dongKq(page, '5.3', 'CH4');
  ok(p2[6] === '1.805,65' && p3[6] === '13,4', 'đốt CH₄ thu gom: 1.805,65 tấn CO₂; CH₄ không cháy hết 13,4 tấn');
  ok((await txt(page, '#pane-buoc-4')).includes('Thông tư 38 không nêu việc trừ lượng CH₄ thu gom'), 'nêu rõ Thông tư 38 không trừ CH₄ thu hồi, khác IPCC');
  const m = await dongKq(page, '2.1', 'HFC');
  ok(m[4] === '10 kg' && m[7].startsWith('1.430') && m[8] === '14,3', 'môi chất lạnh: 10 kg R134a × GWP 1.430 / 1000 = 14,3 tCO₂tđ');
  ok(await tongNam(page, 2023, 'Tổng phát thải') === '20.796,122', 'tổng năm 2023 khớp tổng tính tay: 989,97 + 659,2 + 242,002 + 16.750 + 1.805,65 + 335 + 14,3 = 20.796,122');
  ok(await tongNam(page, 2023, 'Phát thải gián tiếp') === '901,202', 'phát thải gián tiếp năm 2023: 659,2 + 242,002 = 901,202');
  await page.check('input[name=qt-gwp][value=AR5]');
  ok((await dongKq(page, '5.1', 'CH4'))[8] === '18.760', 'đổi sang AR5: CH₄ hầm lò thành 18.760 tCO₂tđ');
  await page.check('input[name=qt-gwp][value=AR4]');
  ok(await xongBuoc(page, 4), 'Bước 4 hoàn thành khi đã chọn GWP và mọi dòng đều tính được');
  await page.screenshot({ path: path.join(SHOTS, '31_buoc_4.png'), fullPage: true });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#qt-save')]);
  file1 = path.join(TMP, dl.suggestedFilename()); await dl.saveAs(file1);
  const j = JSON.parse(fs.readFileSync(file1, 'utf8'));
  ok(j.gwp === 'AR4' && !('ketQua' in j) && !JSON.stringify(j).includes('20796'), 'file lưu bộ GWP, không lưu kết quả tính');

  console.log('\n5. Nạp lại file, tính lại ra đúng số');
  await page.click('#qt-home'); await page.click('#qt-new');
  await page.click('#qt-confirm-acts button:has-text("Bắt đầu kỳ mới")');
  await napFile(page, file1);
  await doiHash(page, 'buoc-4');
  ok(await tongNam(page, 2023, 'Tổng phát thải') === '20.796,122' && await xongBuoc(page, 4), 'nạp lại file, tổng năm 2023 vẫn là 20.796,122 và Bước 4 vẫn xong');
  await page.click('#qt-en');
  ok(await tongNam(page, 2023, 'Total emissions') === '20,796.122', 'chuyển tiếng Anh, số hiện kiểu Anh: 20,796.122');
  await page.click('#qt-vi');

  console.log('\n6. Ba lớp bảo vệ với file sửa tay');
  const sua = JSON.parse(fs.readFileSync(file1, 'utf8'));
  const idCd = sua.nguon.find(n => n.loai === 'codinh').id;
  const hsCO2 = sua.heSo.find(x => x.nguonId === idCd && x.khi === 'CO2');
  Object.assign(hsCO2, { maHeSo: 'QĐ2626:II.1.2', tenHeSo: 'Hàm lượng CaO/clinker', giaTri: 65, donVi: '%', bac: 'qd2626' });
  const hsCH4 = sua.heSo.find(x => x.nguonId === idCd && x.khi === 'CH4');
  Object.assign(hsCH4, { maHeSo: '', giaTri: 1, donVi: 'kg N2O-N/TJ', bac: 'ipcc', nguonGoc: 'thử' });
  const hsN2O = sua.heSo.find(x => x.nguonId === idCd && x.khi === 'N2O');
  Object.assign(hsN2O, { maHeSo: '', giaTri: 1, donVi: 'kg N2O/tấn', bac: 'ipcc', nguonGoc: 'thử' });
  const f2 = path.join(TMP, 'sua_tay.json'); fs.writeFileSync(f2, JSON.stringify(sua));
  await napFile(page, f2);
  await doiHash(page, 'buoc-4');
  const b1 = await dongKq(page, '1', 'CO2'), b2 = await dongKq(page, '1', 'CH4'), b3 = await dongKq(page, '1', 'N2O');
  ok(b1.join(' ').includes('Hệ số hiệu chỉnh bị chặn') && !/\d/.test(b1.slice(4).join('')), 'phép thử 4b: file trỏ tới hệ số hiệu chỉnh thì dòng đó bị chặn, không ra số');
  ok(b2.join(' ').includes('Không tự tính') && b2.join(' ').includes('ni-tơ'), 'hệ số theo khối lượng ni-tơ (N₂O-N) thì báo thẳng, khuyên dùng công thức IPCC');
  ok(b3.join(' ').includes('không khớp'), 'hệ số khác đơn vị mẫu số (tấn thay cho TJ) thì báo không khớp');
  ok(!(await xongBuoc(page, 4)) && (await txt(page, '#b4-tong')).includes('chưa đủ'), 'còn dòng không tính được thì Bước 4 chưa xong, tổng gắn nhãn chưa đủ');
  await page.screenshot({ path: path.join(SHOTS, '32_buoc_4_bao_ve.png'), fullPage: true });
  await browser.close();

  console.log('\n7. Khổ điện thoại 375 px');
  {
    const b = await chromium.launch();
    const p = await (await b.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage();
    theoDoiLoi(p, errors);
    await p.goto(URL);
    const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#qt-load')]);
    await fc.setFiles(file1);
    await p.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
    const tran = [];
    for (const id of ['buoc-3', 'buoc-4']) {
      await doiHash(p, id); await p.waitForTimeout(80);
      const w = await p.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      if (w[0] > w[1]) tran.push(id + ' ' + w[0] + '>' + w[1]);
    }
    ok(tran.length === 0, 'Bước 3 và Bước 4 không tràn ngang' + (tran.length ? ': ' + tran.join(', ') : ''));
    await p.screenshot({ path: path.join(SHOTS, '33_dien_thoai_buoc_4.png'), fullPage: true });
    await b.close();
  }

  console.log('\n8. Lỗi console');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang' + (errors.length ? ': ' + errors.join(' | ') : ''));
  console.log('\nKết quả: ' + pass + ' đạt, ' + fail + ' trượt');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
