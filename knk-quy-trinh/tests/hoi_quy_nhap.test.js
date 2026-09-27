/* Kiem thu hoi quy: nhap so, nhap ngay, nap file .json sua tay, luu tam va xoa nguon.
   Chay tren ban da dong goi knk-quy-trinh/index.html.

   Chay:  NODE_PATH=$(npm root -g) node tests/hoi_quy_nhap.test.js
   Chay tren ban khac (vd ban truoc khi sua):  QT_URL=file:///duong/dan/index.html NODE_PATH=$(npm root -g) node tests/hoi_quy_nhap.test.js

   Moi muc giu mot loi da sua khong quay lai:
   1. Doc so: "0.681" (giao dien tieng Viet) va "0,681" (tieng Anh) la so thap phan 0,681,
      khong phai 681; "0.043" o o nhiet tri la 0,043.
   2. Go so sai giua chung: go tung phim "3.86E-05" luu 3,86e-5 (nhan dang luy thua nhu Excel),
      go "12abc" thi de trong va bao thieu, khong giu 12 cua phan da go.
   3. Go ngay bang ban phim o Buoc 1, Buoc 2 (bang 2.2) va Buoc 5 luu dung ngay da go,
      man hinh khong dung lai giua chung lam con tro nhay ve dau o.
   4. File .json sua tay co so dang chuoi trong chiTiet, thamSo, thuocTinh: doc nhu o nhap
      ("0,0258" la 0,0258), tong giong het file ghi so; chuoi khong doc duoc thi de trong,
      Buoc 2 bao thieu, Buoc 4 chua xong.
   5. File .json co ngay khong dung dang YYYY-MM-DD hoac ngay dang so: de trong khi nap,
      Buoc 2, Buoc 8 khong loi trang, ban xem truoc, .docx, .xlsx khong co "NaN".
   6. Ky bao cao trung nam (2024-2024) hoac dao nguoc (2025-2024) trong file: bo ky, bao khi
      nap, khong tinh mot nam hai lan, .xlsx khong co hai trang tinh trung ten.
   7. Nguon co loai "constructor", "__proto__", "toString": bi bo, khong loi trang, mo lai
      trang van dung duoc; nguon co id "constructor" van giu.
   8. Hai nguon trung id: nguon sau duoc cap id moi, thong bao nap noi ro.
   9. Luu tam khong ghi duoc (bo nho day): chan trang bao loi, khong ghi "Lan cuoi".
   10. Sua xong tai lai trang ngay (trong 400 ms): phan sua van duoc luu tam (pagehide).
   11. Xoa nguon o Buoc 1 xoa luon dong do khong chac chan (bangU) cua nguon do.
   Ho so thu nho, so gia dinh. Khong can LibreOffice: .docx, .xlsx doc thang bang python3 zipfile. */
'use strict';
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = process.env.QT_URL || 'file://' + path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-hoiquy-'));
const SHOTS = process.env.QT_SHOTS || path.join(os.tmpdir(), 'qt-shots');
fs.mkdirSync(SHOTS, { recursive: true });
const KEY = 'knk-quy-trinh/v1', KEY_META = 'knk-quy-trinh/v1/meta';

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  ĐẠT   ' + msg); } else { fail++; console.log('  TRƯỢT ' + msg); } }
function theoDoiLoi(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}
const doiHash = (page, h) => page.evaluate(x => { location.hash = x; }, h);
const txt = (page, sel) => page.textContent(sel);
const cho = ms => new Promise(r => setTimeout(r, ms));
const gan = (a, b) => typeof a === 'number' && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
const xongHet = page => page.evaluate(() => Array.from(document.querySelectorAll('#qt-menu .qt-mi')).map(b => b.classList.contains('xong')));
const luuTam = page => page.evaluate(k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, KEY);
const toast = page => page.textContent('#qt-toast');
/* bam nut; khong co nut (ban loi dung giua chung) thi bo qua, cac kiem tra sau se truot */
const bam = (page, sel) => page.click(sel, { timeout: 3000 }).catch(() => {});
const giaTriO = (page, sel) => page.$$eval(sel + ' input', es => es.map(e => e.value).join(' | ')).catch(() => '');
/* nap file qua nut #qt-load; tra ve false neu khong toi Buoc 0 (ban loi trang) */
async function nap(page, file, han) {
  await doiHash(page, 'dau'); await page.waitForSelector('#qt-load', { state: 'visible' });
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#qt-load')]);
  await fc.setFiles(file);
  try {
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on') || !document.getElementById('qt-confirm').hidden, null, { timeout: han || 10000 });
    /* ho so dang mo co thay doi chua tai ve: xac nhan nap de */
    if (await page.isVisible('#qt-confirm')) {
      await page.click('#qt-confirm-acts button.qt-pri');
      await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'), null, { timeout: han || 10000 });
    }
    return true;
  } catch (e) { return false; }
}
/* tai file; tra ve null neu khong co file tai ve trong thoi han (ban loi) */
async function taiXuong(page, sel, ten, han) {
  try {
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: han || 8000 }), page.click(sel)]);
    const f = path.join(TMP, ten || dl.suggestedFilename()); await dl.saveAs(f); return f;
  } catch (e) { return null; }
}
/* doc toan bo XML trong .docx/.xlsx va ten cac trang tinh, khong can LibreOffice */
function docZip(f) {
  const py = 'import json,re,sys,zipfile\nz=zipfile.ZipFile(sys.argv[1])\n' +
    'x="".join(z.read(n).decode("utf8","replace") for n in z.namelist() if n.endswith(".xml"))\n' +
    'w=z.read("xl/workbook.xml").decode("utf8") if "xl/workbook.xml" in z.namelist() else ""\n' +
    'print(json.dumps({"chu":re.sub(r"<[^>]+>"," ",x),"trang":re.findall(r"<sheet [^>]*name=\\"([^\\"]*)\\"",w)}))';
  return JSON.parse(execFileSync('python3', ['-c', py, f]).toString('utf8'));
}
/* go tung phim vao o (xoa truoc), roi Tab */
async function goPhim(page, sel, s) {
  const loc = page.locator(sel);
  await loc.fill(''); await loc.click(); await page.keyboard.type(s, { delay: 20 }); await page.keyboard.press('Tab');
}
async function dienTab(page, sel, s) { const loc = page.locator(sel); await loc.fill(s); await loc.press('Tab'); }
/* go ngay 15/3/2019 vao o date theo thu tu thang, ngay, nam (locale en-US), bam vao o dau */
async function goNgay(page, sel) {
  const loc = page.locator(sel); await loc.scrollIntoViewIfNeeded();
  const bx = await loc.boundingBox();
  await page.mouse.click(bx.x + 10, bx.y + bx.height / 2);
  for (const ch of '03152019') { await page.keyboard.type(ch); await cho(60); }
  await page.keyboard.press('Tab'); await cho(150);
}

/* ---- ho so thu: than dot tai lo hoi, dien luoi, dieu hoa, mo than ham lo ---- */
function hoSo() {
  const NAM = [2024, 2025];
  const sl = [], hs = [];
  const hsQd = (id, k, v, dv) => hs.push({ nguonId: id, khi: k, nam: null, giaTri: v, donVi: dv, bac: 'ipcc', nguonGoc: 'IPCC 2006, Tập 2, Bảng 2.2' });
  hsQd('cd1', 'CO2', 98300, 'kg CO2/TJ'); hsQd('cd1', 'CH4', 10, 'kg CH4/TJ'); hsQd('cd1', 'N2O', 1.5, 'kg N2O/TJ');
  NAM.forEach(y => hs.push({ nguonId: 'dn1', khi: 'CO2', nam: y, giaTri: 0.6592, donVi: 'tCO₂/MWh', bac: 'muc2', nguonGoc: 'Số giả định để kiểm thử' }));
  hs.push({ nguonId: 'mc1', khi: 'GWP', nam: null, giaTri: 1924, donVi: '', bac: 'muc2', nguonGoc: 'IPCC AR5, giả định' });
  hs.push({ nguonId: 'pt1', khi: 'CH4', nam: null, giaTri: 10, donVi: 'm³ CH₄/tấn', bac: 'ipcc', nguonGoc: 'IPCC 2006, Tập 2, Chương 4', thamSo: { cf: 0.67 } });
  NAM.forEach((y, i) => {
    const so = (id, gioTri, donVi, ct) => sl.push({ nguonId: id, nam: y, gioTri, donVi, nguonSoLieu: 'Hóa đơn', chungTu: 'HĐ-' + id + '-' + y, nguoiCungCap: 'Phòng vật tư', chiTiet: ct || {} });
    so('cd1', [1000, 1100][i], 'tấn', { nhietTri: 0.0258 });
    so('dn1', [1000, 1100][i], 'MWh');
    so('mc1', [10, 12][i], 'kg', { luongNapGanNhat: 2, thoiGianNapGanNhat: y + '-06-10' });
    so('pt1', [10000, 11000][i], 'tấn', { ch4Dot: 1000000, hieuSuatDot: 98 });
  });
  return {
    phienBan: 1,
    coSo: { ten: 'Công ty Thử nghiệm Hồi quy', diaChi: 'Số 1 đường Láng, Hà Nội', tinh: 'Thành phố Hà Nội', maSoThue: '0101234567', nhom: 'A',
      giayPhep: { so: '0101234567', ngayCap: '2010-05-20', noiCap: 'Sở Kế hoạch và Đầu tư Hà Nội' }, daiDien: { hoTen: 'Nguyễn Văn An', chucVu: 'Giám đốc' } },
    ky: { namBatDau: 2024, namKetThuc: 2025 }, gwp: 'AR5',
    nguon: [
      { id: 'cd1', loai: 'codinh', phanLoai: 'than antraxit', thietBi: 'Lò hơi 1' },
      { id: 'dn1', loai: 'dien', phanLoai: 'Điện lưới', thietBi: 'Công tơ tổng' },
      { id: 'mc1', loai: 'moichat', phanLoai: 'R410A', thietBi: 'Điều hòa Daikin', viTri: 'Văn phòng', thuocTinh: { ngayBatDau: '2020-01-15', congSuatLanh: 24000, khoiLuongNapDay: 3.5 } },
      { id: 'pt1', loai: 'phattan', phanLoai: 'Than', thietBi: 'Mỏ than', viTri: 'Quảng Ninh', thuocTinh: { congNghe: 'hamlo' } }
    ],
    soLieu: sl, heSo: hs,
    qc: [{ ma: 'ct1', noiDung: 'Đối chiếu số liệu nhập với chứng từ gốc', nguoiKiem: 'Trần Thị Kiểm', ngay: '2026-02-10', ketQua: 'dat', loiPhatHien: '', cachXuLy: '' }],
    khongChacChan: { dinhTinh: {}, dinhLuong: '', bangU: [{ nguonId: 'cd1', muc: '1', khi: 'CO2', uAd: 5, uEf: 3 }, { nguonId: 'dn1', muc: '3', khi: 'CO2', uAd: 2, uEf: 10 }] }
  };
}
function ghi(ten, o) { const f = path.join(TMP, ten); fs.writeFileSync(f, JSON.stringify(o)); return f; }
const soLieuCua = (o, id, y) => o && o.soLieu.find(r => r.nguonId === id && r.nam === y);

(async () => {
  const errors = [];
  console.log('Bản chạy: ' + URL);
  console.log('Ảnh chụp: ' + SHOTS);
  const browser = await chromium.launch();
  async function moi(bag, opts) {
    const ctx = await browser.newContext(Object.assign({ acceptDownloads: true, viewport: { width: 1360, height: 950 }, locale: 'en-US' }, opts || {}));
    const page = await ctx.newPage(); theoDoiLoi(page, bag || errors); page.setDefaultTimeout(5000);
    return { ctx, page };
  }
  /* mot muc bi dung giua chung (ban loi lam mat o, nut) thi ghi trượt, chay tiep muc sau */
  async function muc(ten, fn) {
    console.log('\n' + ten);
    try { await fn(); } catch (e) { ok(false, 'chạy hết mục, không dừng giữa chừng: ' + String(e.message || e).split('\n')[0]); }
  }
  const fGoc = ghi('goc.json', hoSo());

  await muc('1. Đọc số thập phân bắt đầu bằng 0', async () => {
    const { ctx, page } = await moi();
    await page.goto(URL); await nap(page, fGoc);
    await doiHash(page, 'buoc-3');
    await dienTab(page, '#hs-dien [data-b$="|CO2|2024|giaTri"]', '0.681');
    ok((await page.inputValue('#hs-dien [data-b$="|CO2|2024|giaTri"]')) === '0,681', 'Bước 3: gõ 0.681 vào hệ số lưới điện thì ô hiện 0,681, không phải 681');
    await doiHash(page, 'buoc-2'); await bam(page, '[data-act="nam|2024"]');
    await dienTab(page, '[data-b="s|dn1|2024|gioTri"]', '0.681');
    ok((await page.inputValue('[data-b="s|dn1|2024|gioTri"]')) === '0,681', 'Bước 2: gõ 0.681 ở giao diện tiếng Việt thì hiện 0,681, không phải 681');
    await dienTab(page, '[data-b="s|cd1|2024|ct.nhietTri"]', '0.043');
    await cho(700);
    let o = await luuTam(page);
    const hsDn = o && o.heSo.find(h => h.nguonId === 'dn1' && h.nam === 2024);
    ok(hsDn && gan(hsDn.giaTri, 0.681), 'hệ số lưới điện 0.681 lưu 0,681, không phải 681: ' + (hsDn && hsDn.giaTri));
    ok(gan(soLieuCua(o, 'dn1', 2024).gioTri, 0.681), 'gõ 0.681 ở giao diện tiếng Việt thì lưu 0,681, không phải 681: ' + soLieuCua(o, 'dn1', 2024).gioTri);
    ok(gan(soLieuCua(o, 'cd1', 2024).chiTiet.nhietTri, 0.043), 'nhiệt trị gõ 0.043 lưu 0,043, không phải 43: ' + soLieuCua(o, 'cd1', 2024).chiTiet.nhietTri);
    await page.click('#qt-en');
    await bam(page, '[data-act="nam|2025"]');
    await dienTab(page, '[data-b="s|dn1|2025|gioTri"]', '0,681');
    await dienTab(page, '[data-b="s|cd1|2025|ct.nhietTri"]', '0,042');
    await cho(700);
    o = await luuTam(page);
    ok((await page.inputValue('[data-b="s|dn1|2025|gioTri"]')) === '0.681' && gan(soLieuCua(o, 'dn1', 2025).gioTri, 0.681),
      'gõ 0,681 ở giao diện tiếng Anh thì hiện 0.681, lưu 0,681, không phải 681: ' + soLieuCua(o, 'dn1', 2025).gioTri);
    ok(gan(soLieuCua(o, 'cd1', 2025).chiTiet.nhietTri, 0.042), 'giao diện tiếng Anh: nhiệt trị 0,042 lưu 0,042, không phải 42: ' + soLieuCua(o, 'cd1', 2025).chiTiet.nhietTri);
    await ctx.close();
  });

  await muc('2. Gõ số từng phím: dạng lũy thừa và ký tự sai', async () => {
    const { ctx, page } = await moi();
    await page.goto(URL); await nap(page, fGoc);
    await doiHash(page, 'buoc-2'); await bam(page, '[data-act="nam|2024"]');
    const oNt = '[data-b="s|cd1|2024|ct.nhietTri"]';
    await goPhim(page, oNt, '3.86E-05');
    await cho(700);
    let o = await luuTam(page);
    const nt = soLieuCua(o, 'cd1', 2024).chiTiet.nhietTri;
    ok(gan(nt, 3.86e-5), 'gõ từng phím 3.86E-05 thì lưu 0,0000386, không giữ 3,86 của phần đã gõ: ' + nt);
    ok((await page.inputValue(oNt)) === '0,0000386', 'ô nhiệt trị viết lại 0,0000386: ' + (await page.inputValue(oNt)));
    await goPhim(page, oNt, '3,86E-05');
    await cho(700); o = await luuTam(page);
    ok(gan(soLieuCua(o, 'cd1', 2024).chiTiet.nhietTri, 3.86e-5), 'dạng 3,86E-05 (dấu phẩy, như Excel tiếng Việt) cũng đọc được');
    await bam(page, '[data-act="nam|2025"]');
    const oGt = '[data-b="s|cd1|2025|gioTri"]';
    await goPhim(page, oGt, '12abc');
    await cho(700); o = await luuTam(page);
    const gt = soLieuCua(o, 'cd1', 2025).gioTri;
    const do12 = await page.$eval(oGt, e => e.classList.contains('qt-bad'));
    ok(gt === null && do12, 'gõ 12abc thì ô tô đỏ và lượng tiêu thụ để trống, không lưu 12 của phần đã gõ: ' + gt);
    await doiHash(page, 'buoc-1'); await doiHash(page, 'buoc-2'); await bam(page, '[data-act="nam|2025"]');
    ok((await page.inputValue(oGt)) === '', 'quay lại Bước 2, ô gõ sai trống, không hiện 12: "' + (await page.inputValue(oGt)) + '"');
    const th2 = await txt(page, '#pane-buoc-2 .qt-thieu');
    ok(/năm 2025: Lượng tiêu thụ/.test(th2), 'Bước 2 báo thiếu lượng tiêu thụ năm 2025 của nguồn gõ sai');
    await ctx.close();
  });

  await muc('3. Gõ ngày bằng bàn phím ở Bước 1, 2, 5', async () => {
    const h = hoSo();
    h.nguon.find(n => n.id === 'mc1').thuocTinh.ngayBatDau = '';
    h.soLieu.filter(r => r.nguonId === 'mc1').forEach(r => { r.chiTiet.thoiGianNapGanNhat = ''; });
    h.qc[0].ngay = '';
    const f = ghi('ngay_trong.json', h);
    const { ctx, page } = await moi();
    await page.goto(URL); await nap(page, f);
    await doiHash(page, 'buoc-1');
    const o1 = '[data-b="n|mc1|tt.ngayBatDau"]';
    await goNgay(page, o1);
    await doiHash(page, 'buoc-2'); await bam(page, '[data-act="nam|2024"]');
    const o2 = '[data-b="s|mc1|2024|ct.thoiGianNapGanNhat"]';
    await goNgay(page, o2);
    const v2 = await page.inputValue(o2);
    await doiHash(page, 'buoc-5');
    const o5 = '[data-b="p|qc.0.ngay"]';
    await goNgay(page, o5);
    const v5 = await page.inputValue(o5);
    await page.screenshot({ path: path.join(SHOTS, 'hq_3_ngay_buoc5.png') });
    await cho(700);
    const o = await luuTam(page);
    const s1 = o.nguon.find(n => n.id === 'mc1').thuocTinh.ngayBatDau, s2 = soLieuCua(o, 'mc1', 2024).chiTiet.thoiGianNapGanNhat, s5 = o.qc[0].ngay;
    ok(s1 === '2019-03-15', 'Bước 1: gõ 03152019 vào ngày bắt đầu sử dụng thì lưu 2019-03-15: ' + s1);
    ok(s2 === '2019-03-15' && v2 === '2019-03-15', 'Bước 2 bảng 2.2: gõ ngày nạp gần nhất thì lưu 2019-03-15: ' + s2 + ', ô hiện ' + v2);
    ok(s5 === '2019-03-15' && v5 === '2019-03-15', 'Bước 5: gõ ngày kiểm tra thì lưu 2019-03-15: ' + s5 + ', ô hiện ' + v5);
    await doiHash(page, 'buoc-1');
    ok((await page.inputValue(o1)) === '2019-03-15', 'quay lại Bước 1, ô ngày hiện đúng ngày đã gõ');
    await ctx.close();
  });

  await muc('4. File .json sửa tay có số dạng chuỗi', async () => {
    const h = hoSo();
    h.soLieu.filter(r => r.nguonId === 'cd1').forEach(r => { r.chiTiet.nhietTri = '0,0258'; });
    h.soLieu.filter(r => r.nguonId === 'pt1').forEach(r => { r.chiTiet.ch4Dot = '1.000.000'; r.chiTiet.hieuSuatDot = '98'; });
    h.heSo.find(x => x.nguonId === 'pt1').thamSo.cf = '0,67';
    /* "24.000" doc duoc hai cach (24000 hay 24) nen de trong va bao; "3,5" chi mot cach */
    h.nguon.find(n => n.id === 'mc1').thuocTinh.congSuatLanh = '24.000';
    h.nguon.find(n => n.id === 'mc1').thuocTinh.khoiLuongNapDay = '3,5';
    const fChuoi = ghi('so_chuoi.json', h);
    const h2 = hoSo(); h2.soLieu.find(r => r.nguonId === 'cd1' && r.nam === 2024).chiTiet.nhietTri = 'abc';
    const fSai = ghi('so_sai.json', h2);
    const { ctx, page } = await moi();
    async function tong8() {
      await doiHash(page, 'buoc-8'); const m = {};
      for (const y of [2024, 2025]) for (const k of ['tt', 'gt', 'tong']) m[y + '|' + k] = (await txt(page, `[data-kq8="${y}|${k}"]`)).trim();
      return m;
    }
    await page.goto(URL); await nap(page, fGoc);
    const goc = await tong8();
    const xongGoc = await xongHet(page);
    await nap(page, fChuoi);
    const toastChuoi = await txt(page, '#qt-toast');
    await doiHash(page, 'buoc-2'); await bam(page, '[data-act="nam|2024"]');
    ok((await page.inputValue('[data-b="s|cd1|2024|ct.nhietTri"]')) === '0,0258', 'nhiệt trị "0,0258" (chuỗi) nạp thành 0,0258, ô không trống');
    const bmc = await txt(page, '#bang-moichat');
    ok(!bmc.includes('24.000') && !/\b24\b/.test(bmc) && bmc.includes('3,5') && toastChuoi.includes('đọc được theo hai cách'),
      'chuỗi "24.000" (24000 hay 24) để trống và báo khi nạp; "3,5" chỉ một cách đọc nên nạp thành 3,5');
    const ch = await tong8();
    ok(/^\d/.test(goc['2024|tong']) && Object.keys(goc).every(k => ch[k] === goc[k]), 'số dạng chuỗi trong chiTiet, thamSo cho tổng giống hệt file ghi số: 2024 ' + ch['2024|tong'] + ', 2025 ' + ch['2025|tong']);
    await doiHash(page, 'buoc-4');
    const d4 = await page.$$eval('#b4-chitiet tr[data-dong]', rs => rs.map(r => r.getAttribute('data-dong')));
    ok(d4.includes('pt1|5.2|CO2') && d4.includes('pt1|5.3|CH4'), 'ch4Dot "1.000.000" (chuỗi) vẫn có dòng 5.2, 5.3 ở Bước 4');
    const o = await luuTam(page);
    ok(soLieuCua(o, 'cd1', 2024).chiTiet.nhietTri === 0.0258 && o.heSo.find(x => x.nguonId === 'pt1').thamSo.cf === 0.67,
      'bản lưu tạm ghi số, không ghi chuỗi: nhietTri ' + JSON.stringify(soLieuCua(o, 'cd1', 2024).chiTiet.nhietTri) + ', cf ' + JSON.stringify(o.heSo.find(x => x.nguonId === 'pt1').thamSo.cf));
    await nap(page, fSai);
    await doiHash(page, 'buoc-2');
    const th2 = await txt(page, '#pane-buoc-2 .qt-thieu');
    ok(/năm 2024: Hệ số nhiệt trị/.test(th2), 'nhiệt trị "abc" không đọc được thì để trống, Bước 2 báo thiếu hệ số nhiệt trị năm 2024');
    const s8 = await tong8();
    const xongSai = await xongHet(page);
    ok(xongGoc[4] && !xongSai[4], 'nhiệt trị "abc": Bước 4 chưa xong (file ghi số thì xong)');
    ok(s8['2024|tong'].includes('chưa đủ') && /^\d/.test(s8['2024|tong']), 'nhiệt trị "abc": tổng 2024 có số và ghi chưa đủ, không trống: ' + s8['2024|tong']);
    await ctx.close();
  });

  await muc('5. File .json có ngày sai dạng hoặc ngày dạng số', async () => {
    const h = hoSo();
    h.coSo.giayPhep.ngayCap = '20/5/2010';
    h.qc[0].ngay = 'hôm qua';
    h.nguon.find(n => n.id === 'mc1').thuocTinh.ngayBatDau = 20200115;
    soLieuCua(h, 'mc1', 2024).chiTiet.thoiGianNapGanNhat = 20240610;
    const f = ghi('ngay_sai.json', h);
    const loi5 = [];
    const { ctx, page } = await moi(loi5);
    await page.goto(URL);
    await nap(page, f);
    const o0 = await luuTam(page);
    ok((await page.inputValue('#f-gpngay')) === '' && o0 && o0.coSo.giayPhep.ngayCap === '', 'ngày cấp "20/5/2010" nạp thành trống, cả trên màn hình lẫn bản lưu tạm: ' + JSON.stringify(o0 && o0.coSo.giayPhep.ngayCap));
    await doiHash(page, 'buoc-2'); await bam(page, '[data-act="nam|2024"]');
    const t2 = await txt(page, '#pane-buoc-2');
    ok(!/NaN/.test(t2) && t2.includes('Điều hòa Daikin'), 'Bước 2 dựng đủ bảng 2.2, không có NaN');
    await doiHash(page, 'buoc-8');
    const xt = (await txt(page, '#b8-xemtruoc')) || '';
    ok(!/NaN/.test(xt) && xt.length > 2000, 'Bước 8 có bản xem trước, không có NaN');
    ok(/ngày cấp \[Chưa nhập[^\]]*\]/.test(xt) || xt.includes('ngày cấp [Chưa'), 'bản xem trước đánh dấu thiếu ngày cấp thay vì in ngày sai');
    const fd = await taiXuong(page, '[data-act="xuatDocx"]', 'ngay_sai.docx');
    const fx = await taiXuong(page, '[data-act="xuatXlsx"]', 'ngay_sai.xlsx');
    ok(!!fd && !!fx, 'xuất được cả .docx và .xlsx');
    if (fd) { const z = docZip(fd); ok(!/NaN/.test(z.chu) && z.chu.includes('Giấy phép kinh doanh'), '.docx không có NaN'); }
    if (fx) { const z = docZip(fx); ok(!/NaN/.test(z.chu), '.xlsx không có NaN'); }
    const o = await luuTam(page);
    ok(o && o.nguon.find(n => n.id === 'mc1').thuocTinh.ngayBatDau === '' && o.qc[0].ngay === '' && soLieuCua(o, 'mc1', 2024).chiTiet.thoiGianNapGanNhat === '',
      'ngày dạng số và ngày chữ được để trống khi nạp');
    const pe = loi5.filter(x => x.startsWith('pageerror'));
    ok(loi5.length === 0, 'không lỗi trang, lỗi console (trước đây iso.split is not a function)' + (loi5.length ? ': ' + loi5.slice(0, 2).join(' | ') : ''));
    await ctx.close();
  });

  await muc('6. Kỳ báo cáo trùng năm hoặc đảo ngược trong file', async () => {
    const h = hoSo(); h.ky = { namBatDau: 2024, namKetThuc: 2024 };
    const fTrung = ghi('ky_trung.json', h);
    const h2 = hoSo(); h2.ky = { namBatDau: 2025, namKetThuc: 2024 };
    const fDao = ghi('ky_dao.json', h2);
    const { ctx, page } = await moi();
    await page.goto(URL); await nap(page, fTrung);
    const tb = await toast(page);
    ok((await page.inputValue('#f-ky')) === '', 'kỳ 2024-2024 bị bỏ, Bước 0 chưa chọn kỳ');
    ok(tb.includes('Kỳ báo cáo trong file không phải hai năm tăng dần'), 'thông báo nạp file nói kỳ đã bị bỏ: ' + tb);
    const o = await luuTam(page);
    ok(o.ky.namBatDau === null && o.ky.namKetThuc === null, 'bản lưu tạm không còn kỳ 2024-2024');
    await doiHash(page, 'buoc-4');
    const nhan = await page.$$eval('[data-tong]', es => es.map(e => e.getAttribute('data-tong')));
    ok(nhan.length === new Set(nhan).size, 'Bước 4 không có hai cột cùng năm 2024');
    const dong = await page.$$eval('#b4-chitiet tr[data-dong]', rs => rs.map(r => r.getAttribute('data-dong')));
    ok(dong.length === new Set(dong).size, 'Bước 4 không liệt kê một dòng hai lần');
    await doiHash(page, 'buoc-8');
    const fx = await taiXuong(page, '[data-act="xuatXlsx"]', 'ky_trung.xlsx');
    const trang = fx ? docZip(fx).trang : [];
    ok(!!fx && trang.length === new Set(trang).size, '.xlsx không có hai trang tính trùng tên: ' + trang.join(', '));
    await nap(page, fDao);
    ok((await page.inputValue('#f-ky')) === '' && (await toast(page)).includes('không phải hai năm tăng dần'), 'kỳ đảo ngược 2025-2024 cũng bị bỏ và có thông báo');
    await ctx.close();
  });

  await muc('7. Loại nguồn trùng tên thuộc tính của Object', async () => {
    const h = hoSo();
    h.nguon.push({ id: 'x1', loai: 'constructor', phanLoai: 'a' }, { id: 'x2', loai: '__proto__', phanLoai: 'b' }, { id: 'x3', loai: 'toString', phanLoai: 'c' },
      { id: 'constructor', loai: 'codinh', phanLoai: 'Dầu DO', thietBi: 'Máy phát constructor' });
    [2024, 2025].forEach(y => h.soLieu.push({ nguonId: 'constructor', nam: y, gioTri: 5, donVi: 'TJ', chiTiet: {} }));
    const f = ghi('loai_proto.json', h);
    const loi7 = [];
    const { ctx, page } = await moi(loi7);
    await page.goto(URL);
    const toi = await nap(page, f, 5000);
    ok(toi, 'nạp file có loại "constructor", "__proto__", "toString" vẫn tới Bước 0');
    const tb = await toast(page);
    ok(/3 nguồn thiếu mã hoặc có loại nguồn không hợp lệ đã bị bỏ/.test(tb), 'thông báo nạp nói 3 nguồn có loại không hợp lệ đã bị bỏ: ' + tb);
    const o = await luuTam(page);
    const ids = o ? o.nguon.map(n => n.id) : [];
    ok(!ids.some(x => /^x\d$/.test(x)), 'bản lưu tạm không còn nguồn loại không hợp lệ: ' + ids.join(', '));
    ok(ids.includes('constructor') && !!soLieuCua(o, 'constructor', 2024), 'nguồn có id "constructor" và số liệu của nó vẫn giữ');
    const pe1 = loi7.filter(x => x.startsWith('pageerror'));
    ok(pe1.length === 0, 'nạp file không lỗi trang' + (pe1.length ? ': ' + pe1[0] : ''));
    await page.reload();
    await doiHash(page, 'buoc-1');
    const t1 = await giaTriO(page, '#pane-buoc-1');
    ok(t1.includes('Máy phát constructor') && t1.includes('Lò hơi 1'), 'mở lại trang, Bước 1 vẫn hiện các nguồn');
    await doiHash(page, 'buoc-8');
    ok(((await txt(page, '#b8-xemtruoc')) || '').length > 2000, 'mở lại trang, Bước 8 dựng được bản xem trước');
    ok(loi7.length === 0, 'không lỗi trang, lỗi console cả khi mở lại (trước đây hỏng trang sau mỗi lần tải lại)' + (loi7.length ? ': ' + loi7[0] : ''));
    await ctx.close();
  });

  await muc('8. Hai nguồn trùng id', async () => {
    const h = hoSo();
    h.nguon.splice(1, 0, { id: 'cd1', loai: 'codinh', phanLoai: 'Dầu DO', thietBi: 'Máy phát 2' });
    const f = ghi('trung_id.json', h);
    const { ctx, page } = await moi();
    await page.goto(URL); await nap(page, f);
    const tb = await toast(page);
    ok(/1 nguồn trùng mã đã được cấp mã mới/.test(tb), 'thông báo nạp nói 1 nguồn trùng mã được cấp mã mới: ' + tb);
    await doiHash(page, 'buoc-1');
    const tb1 = await giaTriO(page, '#loai-codinh');
    ok(tb1.includes('Lò hơi 1') && tb1.includes('Máy phát 2'), 'Bước 1 có cả hai nguồn trùng id, không bỏ nguồn sau');
    const o = await luuTam(page);
    const cd = o.nguon.filter(n => n.loai === 'codinh').map(n => n.id);
    ok(cd.length === 2 && cd[0] === 'cd1' && cd[1] !== 'cd1' && o.soLieu.filter(r => r.nguonId === 'cd1').length === 2 && gan(soLieuCua(o, 'cd1', 2024).gioTri, 1000),
      'nguồn đầu giữ id cd1 và số liệu, nguồn sau có id mới: ' + cd.join(', '));
    await ctx.close();
  });

  await muc('9. Lưu tạm không ghi được', async () => {
    const { ctx, page } = await moi();
    await ctx.addInitScript(k => {
      const goc = Storage.prototype.setItem;
      Storage.prototype.setItem = function (a, b) {
        if (window.__hong && a === k) throw new DOMException('Bộ nhớ đầy (giả lập)', 'QuotaExceededError');
        return goc.call(this, a, b);
      };
    }, KEY);
    await page.goto(URL + '#buoc-0');
    await page.fill('#f-ten', 'Ten cu');
    await cho(700);
    const f1 = await txt(page, '#qt-store-state');
    const m1 = await page.evaluate(k => JSON.parse(localStorage.getItem(k)).luuTamLuc, KEY_META);
    await page.evaluate(() => { window.__hong = true; });
    await cho(1100);
    await page.fill('#f-ten', 'Ten moi da sua');
    await cho(700);
    const f2 = await txt(page, '#qt-store-state');
    const m2 = await page.evaluate(k => JSON.parse(localStorage.getItem(k)).luuTamLuc, KEY_META);
    const do2 = await page.$eval('#qt-store-state', e => e.classList.contains('qt-bad'));
    ok(/Lần cuối/.test(f1) && !/Lần cuối/.test(f2) && /không ghi được/.test(f2), 'ghi hồ sơ lỗi thì chân trang báo không ghi được, không ghi lần cuối: ' + f2);
    ok(do2, 'dòng trạng thái lưu tạm tô màu lỗi');
    ok(m2 === m1, 'thời điểm lưu tạm trong meta không đổi khi ghi hồ sơ lỗi: ' + m1 + ' / ' + m2);
    ok(/không ghi được/.test(await toast(page)), 'có thông báo lưu tạm không ghi được');
    await page.evaluate(() => { window.__hong = false; });
    await page.fill('#f-ten', 'Ten moi lan 2');
    await cho(700);
    ok(do2 && /Lần cuối/.test(await txt(page, '#qt-store-state')) && !(await page.$eval('#qt-store-state', e => e.classList.contains('qt-bad'))) && (await luuTam(page)).coSo.ten === 'Ten moi lan 2',
      'ghi lại được thì chân trang từ báo lỗi trở về bình thường');
    await ctx.close();
  });

  await muc('10. Sửa rồi tải lại trang ngay', async () => {
    const { ctx, page } = await moi();
    await page.goto(URL + '#buoc-0');
    await page.fill('#f-ten', 'Ten A');
    await cho(700);
    await page.fill('#f-diachi', 'Dia chi B');
    await cho(100);
    await page.reload();
    const o = await luuTam(page);
    ok(o && o.coSo.ten === 'Ten A' && o.coSo.diaChi === 'Dia chi B', 'sửa địa chỉ rồi tải lại trang trong 100 ms vẫn giữ phần sửa: "' + (o && o.coSo.diaChi) + '"');
    await ctx.close();
  });

  await muc('11. Xóa nguồn xóa luôn độ không chắc chắn', async () => {
    const { ctx, page } = await moi();
    await page.goto(URL); await nap(page, fGoc);
    await doiHash(page, 'buoc-1');
    await page.click('[data-act="xoa|cd1"]');
    const hoi = await txt(page, '#qt-confirm-msg');
    await page.click('#qt-confirm-acts button.qt-pri');
    await cho(200);
    const fj = await taiXuong(page, '#qt-save', 'sau_xoa.json');
    const j = JSON.parse(fs.readFileSync(fj, 'utf8'));
    const u = j.khongChacChan.bangU.map(x => x.nguonId);
    ok(!j.nguon.some(n => n.id === 'cd1') && !u.includes('cd1') && u.includes('dn1'), 'file .json sau khi xóa cd1 không còn dòng bangU của cd1, còn dòng của dn1: ' + JSON.stringify(u));
    ok(/độ không chắc chắn/.test(hoi), 'câu hỏi xác nhận nói độ không chắc chắn cũng bị xóa');
    await ctx.close();
  });

  await browser.close();
  console.log('\n12. Lỗi console');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  console.log(`\nKết quả: ${pass} đạt, ${fail} trượt`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
