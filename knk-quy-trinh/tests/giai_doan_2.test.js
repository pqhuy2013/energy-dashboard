/* Kiem thu nghiem thu Giai doan 2, chay tren ban da dong goi knk-quy-trinh/index.html.

   Chay:  NODE_PATH=$(npm root -g) node tests/giai_doan_2.test.js

   Nghiem thu theo ke hoach: khai bao duoc mot co so co du 8 loai nguon, nhap so lieu
   2 nam, gan he so cho tung nguon, xuat file va nap lai khong mat du lieu. Kem theo:
   tra danh muc goi y nhom, ba lop bao ve khi tra he so, doc so theo cach viet Viet Nam,
   kho dien thoai, khong loi console. So lieu duoi day la so gia dinh de thu. */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-test2-'));
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

/* Buoc 1: them mot nguon va dien cac truong theo duong dan data-b */
async function themNguon(page, loai, truong) {
  await page.click(`[data-act="them|${loai}"]`);
  for (const [f, v] of Object.entries(truong)) {
    const sel = `#loai-${loai} tbody tr:last-child [data-b$="|${f}"]`;
    const tag = await page.$eval(sel, e => e.tagName);
    if (tag === 'SELECT') await page.selectOption(sel, v); else await page.fill(sel, v);
  }
}
/* Buoc 2: dien dong thu i cua bang loai, nam dang mo */
async function dienSo(page, loai, i, truong) {
  const row = `#bang-${loai} tbody tr:not(.qt-tr-trace) >> nth=${i}`;
  for (const [f, v] of Object.entries(truong)) {
    const loc = page.locator(row).locator(`[data-b$="|${f}"]`);
    if (await loc.evaluate(e => e.tagName) === 'SELECT') await loc.selectOption(v); else { await loc.fill(v); await loc.press('Tab'); }
  }
}
/* Buoc 2: dien dong truy vet (nguon so lieu, chung tu...) ngay duoi dong thu i */
async function dienVet(page, loai, i, truong) {
  const row = `#bang-${loai} tbody tr.qt-tr-trace >> nth=${i}`;
  for (const [f, v] of Object.entries(truong)) await page.locator(row).locator(`[data-b$="|${f}"]`).fill(v);
}
/* Buoc 3: mo hop tra cho o he so, loc, chon dong co chua chuoi */
async function traChon(page, loai, khi, q, coChu) {
  await page.click(`#hs-${loai} [data-act^="tra|"][data-act$="|${khi}|-"]`);
  await page.waitForSelector('#qt-modal:not([hidden])');
  if (q != null) await page.fill('#tr-q', q);
  const row = page.locator('#tr-kq tbody tr', { hasText: coChu }).first();
  await row.locator('button[data-act^="chonHs|"]').click();
  await page.waitForSelector('#qt-modal[hidden]', { state: 'attached' });
}
async function nhapHs(page, loai, khi, nam, v) {
  const b = `#hs-${loai} [data-b$="|${khi}|${nam}|`;
  if (v.giaTri != null) { await page.fill(b + 'giaTri"]', v.giaTri); await page.press(b + 'giaTri"]', 'Tab'); }
  if (v.donVi != null) await page.fill(b + 'donVi"]', v.donVi);
  if (v.bac != null) await page.selectOption(b + 'bac"]', v.bac);
  if (v.nguonGoc != null) await page.fill(b + 'nguonGoc"]', v.nguonGoc);
}
function boThoiGian(o) { const c = JSON.parse(JSON.stringify(o)); delete c.ngayCapNhat; delete c.taoBoi; return c; }

(async () => {
  const errors = [];
  let file1, j1;
  console.log('Ảnh chụp: ' + SHOTS);

  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1320, height: 900 } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await page.click('#qt-new');

    console.log('\n1. Bước 0: tra danh mục, gợi ý nhóm');
    const D = await page.evaluate(() => window.__QT_DATA__);
    await page.fill('#tra-q', 'nhiet dien na duong');
    const dau = await page.textContent('#tra-kq button:first-child');
    ok(/Na Dương/i.test(dau) && /QĐ 699/.test(dau), 'kết quả đầu là nhà máy nhiệt điện Na Dương, gắn nhãn QĐ 699');
    await page.click('#tra-kq button:first-child');
    ok((await txt(page, '#tra-ct')).includes('Gợi ý: nhóm B') && (await txt(page, '#tra-ct')).includes('không phải kết luận pháp lý'), 'gợi ý nhóm B kèm câu nhắc không phải kết luận pháp lý');
    await page.click('[data-act="traDien"]');
    await page.click('[data-act="traNhom|B"]');
    ok(/Na Dương/i.test(await page.inputValue('#f-ten')) && /^\d{10}(-\d{3})?$/.test(await page.inputValue('#f-mst')), 'điền tên cơ sở và mã số thuế lấy từ Quyết định 699');
    ok(await page.$eval('input[name=nhom]:checked', e => e.value) === 'B', 'áp dụng gợi ý thì chọn nhóm B');
    ok((await page.inputValue('#f-pl')) !== '' && (await page.inputValue('#f-stt')) !== '', 'điền phụ lục và số thứ tự trong danh mục');
    await page.check('input[name=nhom][value=A]');
    ok(await page.$eval('input[name=nhom]:checked', e => e.value) === 'A', 'người dùng vẫn sửa lại được nhóm');
    await page.check('input[name=nhom][value=B]');
    const iNganh = D.cs.findIndex((r, i) => r[7] && !D.hqmap[String(i)]);
    const tenNganh = D.cs[iNganh][3];
    await page.fill('#tra-q', tenNganh);
    await page.click('#tra-kq button:first-child');
    const ct = await txt(page, '#tra-ct');
    ok(ct.includes('Gợi ý: nhóm A') && ct.includes('nhóm C'), 'ngành hạn ngạch nhưng không có trong QĐ 699 thì gợi ý nhóm A, nhắc khả năng nhóm C: ' + tenNganh);
    await page.fill('#tra-q', 'khong co co so nay xyz');
    ok((await txt(page, '#tra-kq')).includes('Không tìm thấy'), 'tên không có trong danh mục thì báo không tìm thấy');
    await page.selectOption('#f-ky', '2023-2024');

    console.log('\n2. Bước 1: đủ 8 loại nguồn');
    await doiHash(page, 'buoc-1');
    await page.fill('[data-b="p|moTa.ranhGioi"]', 'Toàn bộ khu nhà máy trong hàng rào, gồm dây chuyền chính và kho than.');
    await themNguon(page, 'codinh', { phanLoai: 'dầu diesel', thietBi: 'Nồi hơi số 1', viTri: 'Xưởng A' });
    await themNguon(page, 'didong', { 'tt.loaiPhuongTien': 'Xe nâng', thietBi: 'Xe nâng Toyota 29C-12345', phanLoai: 'Dầu diesel' });
    await themNguon(page, 'congnghiep', { thietBi: 'Lò nung clinker', phanLoai: 'Sản xuất clinker xi măng' });
    await themNguon(page, 'phattan', { phanLoai: 'Than', 'tt.congNghe': 'hamlo', thietBi: 'Khu mỏ A' });
    await themNguon(page, 'moichat', { thietBi: 'Điều hòa Daikin FTKC35', viTri: 'Văn phòng', phanLoai: 'R410A', 'tt.congSuatLanh': '12.000', 'tt.khoiLuongNapDay': '1,2' });
    await page.click('#loai-moichat [data-act^="nhan|"]');
    ok((await page.$$('#loai-moichat tbody tr')).length === 2, 'nhân bản nguồn môi chất lạnh');
    await page.click('#loai-moichat tbody tr:last-child [data-act^="xoa|"]');
    ok((await page.$$('#loai-moichat tbody tr')).length === 1, 'xóa nguồn chưa có số liệu thì xóa luôn');
    await themNguon(page, 'chatthai', { phanLoai: 'Bùn thải xử lý kỵ khí' });
    await themNguon(page, 'dien', { phanLoai: 'Điện lưới', thietBi: 'Công tơ tổng' });
    await page.check('[data-b="k|hoi"]');
    ok(await page.$eval('#loai-hoi', e => e.classList.contains('khong')) && !(await txt(page, '#pane-buoc-1 .qt-thieu')).includes('Hơi:'), 'đánh dấu cơ sở không có nguồn hơi thì loại này không còn bị tính là thiếu');
    await themNguon(page, 'hoi', { thietBi: 'Công ty cấp hơi Đông Á' });
    ok(!(await page.$eval('#loai-hoi', e => e.classList.contains('khong'))), 'thêm nguồn hơi thì tự bỏ dấu không có');
    await page.check('input[name=qt-bht][value=khong]');
    ok(await xongBuoc(page, 1), 'Bước 1 có dấu hoàn thành khi đủ 8 loại nguồn và trả lời bể hấp thụ');
    ok((await txt(page, '#loai-congnghiep')).includes('không có biểu số liệu và không có công thức'), 'loại quá trình công nghiệp báo rõ Thông tư 38 không có công thức');
    await page.screenshot({ path: path.join(SHOTS, '21_buoc_1.png'), fullPage: true });

    console.log('\n3. Bước 2: số liệu hai năm');
    await doiHash(page, 'buoc-2');
    ok((await page.$$('.qt-tabs .qt-btn')).length === 2, 'có hai thẻ năm của kỳ');
    ok((await txt(page, '#bang-codinh h3')).includes('Bảng 1.1. Nhiên liệu sử dụng trong quá trình đốt từ nguồn cố định'), 'tên bảng 1.1 đúng nguyên văn Thông tư');
    ok((await txt(page, '#bang-hoi thead')).includes('Khối lượng hơi (tấn/giờ)') && (await txt(page, '#bang-hoi thead')).includes('Tỷ lệ các loại nhiên liệu của lò hơi'), 'bảng 4.2 đủ cột của Thông tư');
    const so = {
      2023: { cd: '120.000', dd: '5.000', dien: '15.000,5' },
      2024: { cd: '130.500', dd: '5.200', dien: '16.200' }
    };
    for (const y of [2023, 2024]) {
      await page.click(`[data-act="nam|${y}"]`);
      await dienSo(page, 'codinh', 0, { gioTri: so[y].cd, donVi: 'lít', 'ct.nhietTri': '0,0000359' });
      await dienSo(page, 'didong', 0, { gioTri: so[y].dd, 'ct.quangDuong': '12.500', 'ct.nhietTri': '0,0000359' });
      await dienSo(page, 'congnghiep', 0, { gioTri: '250.000', donVi: 'tấn' });
      await dienSo(page, 'phattan', 0, { gioTri: '300.000', donVi: 'tấn', 'ct.ch4Dot': '1.000.000', 'ct.hieuSuatDot': '98' });
      await dienSo(page, 'moichat', 0, { 'ct.luongNapGanNhat': '2,5', 'ct.thoiGianNapGanNhat': y + '-06-15', gioTri: '2,5' });
      await dienSo(page, 'chatthai', 0, { gioTri: '40', donVi: 'tấn' });
      await dienSo(page, 'dien', 0, { gioTri: so[y].dien, ghiChu: 'Theo hóa đơn EVN' });
      await dienSo(page, 'hoi', 0, { 'ct.apSuat': '10 bar', 'ct.nhietDo': '180', 'ct.khoiLuongGio': '2,5', 'ct.entanpi': '2.776', 'ct.tyLeNhienLieu': '100% than', gioTri: '18.000' });
      await dienVet(page, 'codinh', 0, { nguonSoLieu: 'Hóa đơn', chungTu: 'HĐ 0001234', nguoiCungCap: 'Phòng vật tư' });
    }
    await page.click('[data-act="nam|2023"]');
    ok((await page.inputValue('#bang-codinh [data-b$="|2023|gioTri"]')) === '120.000', 'số 120.000 viết theo kiểu Việt Nam được hiểu là một trăm hai mươi nghìn');
    ok((await txt(page, '#bang-codinh [data-calc^="tj|"]')) === '4,308', 'tổng tiêu thụ TJ tính sẵn: 120.000 lít × 0,0000359 = 4,308 TJ');
    ok((await txt(page, '[data-calc^="mc21|"]')) === '2,5', 'bảng 2.1 cộng lượng nạp theo loại môi chất');
    const cb = '#bang-chatthai tbody tr.qt-tr-trace [data-b$="|laUocTinh"]';
    await page.check(cb);
    ok(!(await xongBuoc(page, 2)), 'đánh dấu ước tính mà chưa ghi cách ước tính thì Bước 2 chưa xong');
    await page.fill('#bang-chatthai tbody tr.qt-tr-trace [data-b$="|cachUocTinh"]', 'Ước theo số xe chở bùn ra khỏi nhà máy');
    await page.click('[data-act="nam|2024"]');
    await page.check(cb);
    await page.fill('#bang-chatthai tbody tr.qt-tr-trace [data-b$="|cachUocTinh"]', 'Ước theo số xe chở bùn ra khỏi nhà máy');
    const o = '#bang-dien [data-b$="|2024|gioTri"]';
    await page.fill(o, '16a'); await page.press(o, 'Tab');
    ok(await page.$eval(o, e => e.classList.contains('qt-bad')), 'nhập số sai thì ô báo đỏ');
    await page.fill(o, '16.200'); await page.press(o, 'Tab');
    ok(!(await page.$eval(o, e => e.classList.contains('qt-bad'))), 'sửa lại số đúng thì hết báo đỏ');
    ok(await xongBuoc(page, 2), 'Bước 2 có dấu hoàn thành khi đủ số liệu hai năm');
    await page.screenshot({ path: path.join(SHOTS, '22_buoc_2.png'), fullPage: true });

    console.log('\n4. Bước 3: gán hệ số');
    await doiHash(page, 'buoc-3');
    await traChon(page, 'codinh', 'CO2', null, 'Công nghiệp sản xuất và xây dựng');
    ok((await txt(page, '#hs-codinh')).includes('74.100') && (await txt(page, '#hs-codinh')).includes('Kg CO2/TJ'), 'chọn từ QĐ 2626: CO₂ của dầu diesel 74.100 Kg CO2/TJ');
    ok(await page.$('#hs-codinh [data-b$="|CO2|-|giaTri"]') === null, 'hệ số lấy từ QĐ 2626 bị khóa, không sửa tay được');
    await traChon(page, 'codinh', 'CH4', null, 'Công nghiệp sản xuất và xây dựng');
    await traChon(page, 'codinh', 'N2O', null, 'Công nghiệp sản xuất và xây dựng');
    for (const [k, v] of [['CO2', '74.100'], ['CH4', '3,9'], ['N2O', '3,9']])
      await nhapHs(page, 'didong', k, '-', { giaTri: v, donVi: 'kg/TJ', bac: 'ipcc', nguonGoc: 'IPCC 2006, Tập 2, Bảng 3.2.1 và 3.2.2' });
    await page.click('#hs-congnghiep [data-act^="tra|"][data-act$="|CO2|-"]');
    await page.fill('#tr-q', 'clinker');
    const hc = page.locator('#tr-kq tbody tr', { hasText: 'Hàm lượng CaO/clinker' });
    ok(await hc.count() === 1 && await hc.locator('button').count() === 0 && (await hc.textContent()).includes('Hệ số hiệu chỉnh'), 'hệ số hiệu chỉnh không có nút chọn, thay bằng câu giải thích');
    await page.fill('#tr-q', 'NH3');
    ok((await txt(page, '#tr-kq')).includes('Không tự quy đổi ra tCO₂tđ'), 'hệ số theo GJ/tấn NH3 gắn nhãn không tự quy đổi');
    await page.fill('#tr-q', 'clinker');
    await page.locator('#tr-kq tbody tr', { hasText: 'phối liệu sản xuất clinker' }).locator('button').click();
    ok((await txt(page, '#hs-congnghiep')).includes('0,525'), 'quá trình công nghiệp: 0,525 tấn CO₂/tấn clinker');
    await page.click('#hs-chatthai [data-act^="tra|"][data-act$="|N2O|-"]');
    await page.fill('#tr-q', 'biogas');
    const nul = page.locator('#tr-kq tbody tr', { hasText: 'Giả định không đáng kể' }).first();
    ok(await nul.count() === 1 && (await nul.textContent()).includes('Không có giá trị số'), 'hệ số không có giá trị số thì không chọn được');
    await page.selectOption('#tr-khi', 'CH4');
    const khac = page.locator('#tr-kq tbody tr', { hasText: 'CH4' }).first();
    ok(await khac.locator('button:disabled').count() === 1, 'ô đang gán khí N₂O thì hệ số khí CH₄ bị khóa nút chọn');
    await page.keyboard.press('Escape');
    ok(await page.$eval('#qt-modal', e => e.hidden), 'phím Esc đóng hộp tra');
    await traChon(page, 'chatthai', 'CH4', 'biogas', 'CH4');
    await traChon(page, 'phattan', 'CH4', null, 'trong khai thác than hầm lò');
    ok((await page.inputValue('#hs-phattan [data-b$="|CH4|-|thamSo.cf"]')) === '0,67', 'phát tán CH₄ theo m³: khối lượng riêng mặc định 0,67 kg/m³ hiện rõ');
    await nhapHs(page, 'moichat', 'GWP', '-', { giaTri: '2.088', nguonGoc: 'IPCC AR4; R410A = 50% HFC-32 + 50% HFC-125' });
    ok((await txt(page, '#hs-dien')).includes('Chưa xác minh được hệ số phát thải lưới điện năm 2024'), 'năm 2024 chưa có hệ số lưới điện thì báo thiếu, không lấy tạm năm khác');
    ok(await page.$('#hs-dien [data-act$="|CO2|2024"][data-act^="luoi|"]') === null, 'không có nút lấy hệ số lưới cho năm 2024');
    await page.click('#hs-dien [data-act^="luoi|"][data-act$="|CO2|2023"]');
    ok((await txt(page, '#hs-dien')).includes('0,6592') && (await txt(page, '#hs-dien')).includes('1726/BĐKH-PTCBT'), 'năm 2023 dùng hệ số lưới 0,6592 kèm công văn công bố');
    await nhapHs(page, 'dien', 'CO2', '2024', { giaTri: '0,6', nguonGoc: 'Số giả định để kiểm thử' });
    await nhapHs(page, 'hoi', 'CO2', '-', { giaTri: '0,242', nguonGoc: 'Văn bản số 01/2025 của đơn vị cấp hơi' });
    ok(await xongBuoc(page, 3), 'Bước 3 có dấu hoàn thành khi mọi nguồn đã có hệ số');
    ok(await xongBuoc(page, 0) && await xongBuoc(page, 1) && await xongBuoc(page, 2), 'Bước 0 đến Bước 3 đều hoàn thành');
    await page.screenshot({ path: path.join(SHOTS, '23_buoc_3.png'), fullPage: true });

    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#qt-save')]);
    file1 = path.join(TMP, dl.suggestedFilename()); await dl.saveAs(file1);
    j1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
    await browser.close();
  }

  console.log('\n5. Nội dung file .json');
  const ng = l => j1.nguon.filter(n => n.loai === l);
  ok(j1.nguon.length === 8 && new Set(j1.nguon.map(n => n.loai)).size === 8, 'file có 8 nguồn, đủ 8 loại');
  ok(j1.soLieu.length === 16, 'file có 16 bản ghi số liệu, 8 nguồn × 2 năm');
  const sl = (l, y) => j1.soLieu.find(r => r.nguonId === ng(l)[0].id && r.nam === y);
  ok(sl('codinh', 2023).gioTri === 120000 && sl('codinh', 2024).gioTri === 130500 && sl('dien', 2023).gioTri === 15000.5, 'số lưu dạng số: 120000, 130500, 15000,5');
  ok(sl('codinh', 2023).chiTiet.nhietTri === 0.0000359 && sl('hoi', 2023).chiTiet.entanpi === 2776, 'cột chi tiết lưu dạng số: nhiệt trị, entanpi');
  ok(sl('chatthai', 2024).laUocTinh === true && sl('chatthai', 2024).cachUocTinh !== '', 'số liệu ước tính lưu kèm cách ước tính');
  ok(sl('codinh', 2023).chungTu === 'HĐ 0001234' && sl('codinh', 2023).nguoiCungCap === 'Phòng vật tư', 'lưu chứng từ và người cung cấp');
  const hs = (l, k, y) => j1.heSo.find(h => h.nguonId === ng(l)[0].id && h.khi === k && h.nam === (y == null ? null : y));
  ok(hs('codinh', 'CO2').giaTri === 74100 && hs('codinh', 'CO2').bac === 'qd2626' && /^QĐ2626:I\.1\.\d+/.test(hs('codinh', 'CO2').maHeSo), 'hệ số QĐ 2626 lưu giá trị, bậc và mã mục');
  ok(hs('phattan', 'CH4').thamSo.cf === 0.67 && hs('phattan', 'CH4').donVi === 'm3CH4/tấn', 'hệ số phát tán lưu khối lượng riêng 0,67 kg/m³');
  ok(hs('dien', 'CO2', 2023).giaTri === 0.6592 && hs('dien', 'CO2', 2023).maHeSo === 'luoi:2023' && hs('dien', 'CO2', 2024).giaTri === 0.6, 'hệ số điện lưu theo từng năm');
  ok(hs('moichat', 'GWP').giaTri === 2088 && hs('moichat', 'GWP').bac === 'muc2', 'GWP môi chất lạnh lưu kèm loại nguồn Mục 2');
  ok(!('ketQua' in j1), 'file không lưu kết quả tính toán');

  console.log('\n6. Mở trình duyệt mới, nạp file, không mất dữ liệu');
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1320, height: 900 } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#qt-load')]);
    await fc.setFiles(file1);
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
    ok(await xongBuoc(page, 0) && await xongBuoc(page, 1) && await xongBuoc(page, 2) && await xongBuoc(page, 3), 'nạp lại thì Bước 0 đến Bước 3 vẫn hoàn thành');
    await doiHash(page, 'buoc-2');
    ok((await page.inputValue('#bang-dien [data-b$="|2023|gioTri"]')) === '15.000,5', 'số hiện lại đúng kiểu Việt Nam: 15.000,5');
    await page.click('#qt-en');
    ok((await page.inputValue('#bang-dien [data-b$="|2023|gioTri"]')) === '15,000.5', 'chuyển tiếng Anh thì số hiện kiểu Anh: 15,000.5');
    await page.fill('#bang-dien [data-b$="|2023|gioTri"]', '15,000.5'); await page.press('#bang-dien [data-b$="|2023|gioTri"]', 'Tab');
    await page.click('#qt-vi');
    ok((await page.inputValue('#bang-dien [data-b$="|2023|gioTri"]')) === '15.000,5', 'nhập lại theo kiểu Anh, về tiếng Việt vẫn là 15.000,5');
    await page.screenshot({ path: path.join(SHOTS, '24_buoc_2_nap_lai.png'), fullPage: true });
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#qt-save')]);
    const f2 = path.join(TMP, 'lan2_' + dl.suggestedFilename()); await dl.saveAs(f2);
    const j2 = JSON.parse(fs.readFileSync(f2, 'utf8'));
    ok(JSON.stringify(boThoiGian(j1)) === JSON.stringify(boThoiGian(j2)), 'xuất lại sau khi nạp: nội dung trùng khớp tuyệt đối với file gốc, trừ dấu thời gian');
    await browser.close();
  }

  console.log('\n7. Khổ điện thoại 375 px');
  {
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage();
    theoDoiLoi(page, errors);
    await page.goto(URL);
    const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#qt-load')]);
    await fc.setFiles(file1);
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
    const tran = [];
    for (const id of ['buoc-0', 'buoc-1', 'buoc-2', 'buoc-3']) {
      await doiHash(page, id); await page.waitForTimeout(80);
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      if (w[0] > w[1]) tran.push(id + ' ' + w[0] + '>' + w[1]);
    }
    await page.click('#hs-congnghiep [data-act^="boChon|"]');
    await page.click('#hs-congnghiep [data-act^="tra|"][data-act$="|CO2|-"]');
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    if (w[0] > w[1]) tran.push('hộp tra ' + w[0] + '>' + w[1]);
    await page.screenshot({ path: path.join(SHOTS, '25_dien_thoai_hop_tra.png') });
    ok(tran.length === 0, 'không màn hình nào tràn ngang, kể cả hộp tra' + (tran.length ? ': ' + tran.join(', ') : ''));
    await page.keyboard.press('Escape');
    await doiHash(page, 'buoc-2');
    await page.screenshot({ path: path.join(SHOTS, '26_dien_thoai_buoc_2.png'), fullPage: true });
    await browser.close();
  }

  console.log('\n8. Lỗi console');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang' + (errors.length ? ': ' + errors.join(' | ') : ''));
  console.log('\nKết quả: ' + pass + ' đạt, ' + fail + ' trượt');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
