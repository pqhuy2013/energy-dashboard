/* Kiem thu nghiem thu Giai doan 5 (Buoc 8, xuat .docx va .xlsx), chay tren ban da dong goi.

   Chay:  NODE_PATH=$(npm root -g) node tests/giai_doan_5.test.js

   Nghiem thu theo ke hoach: file .docx mo duoc, dung cau truc Mau so 06, so lieu khop voi
   man hinh ket qua; file .xlsx mo duoc, cac cong thuc va tong cong khop.
   - Cau truc Mau so 06 doi chieu voi nguyen van chep trong Mau_so_06_cau_truc.md muc 3.
   - Ket qua tinh doc lap o day theo Muc 2 Phu luc II Thong tu 38, so voi man hinh, .docx, .xlsx.
   - Cong thuc .xlsx: tests/kiem_file.py xoa gia tri tinh san roi cho LibreOffice tinh lai.
   Can python3 co python-docx, openpyxl, pymupdf, va LibreOffice Writer, Calc. So lieu gia dinh. */
'use strict';
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-test5-'));
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
const vi = (v, d) => v.toLocaleString('vi-VN', { maximumFractionDigits: d });
/* chi so duoi trong .docx la chu so thuong dinh dang chi so duoi */
const sub = s => s.replace(/[₀-₉]/g, c => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)));
const gan = (a, b, e) => Math.abs(a - b) <= (e || 1e-9) * Math.max(1, Math.abs(b));
async function nap(page, file) {
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#qt-load')]);
  await fc.setFiles(file);
  await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
}
async function taiXuong(page, sel, ten) {
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(sel)]);
  const f = path.join(TMP, ten || dl.suggestedFilename()); await dl.saveAs(f); return { f, ten: dl.suggestedFilename() };
}
function kiemFile(docx, xlsx, tienTo) {
  const out = execFileSync('python3', [path.join(__dirname, 'kiem_file.py'), docx || '-', xlsx || '-', SHOTS, tienTo || 'mau06'], { maxBuffer: 64 << 20, timeout: 600000 });
  return JSON.parse(out.toString('utf8'));
}

/* ---- ho so thu: du 7 loai nguon tinh duoc, them qua trinh cong nghiep khong co cong thuc ---- */
const NAM = [2024, 2025];
const IN = {   /* so lieu tung nam */
  cd1: [10, 12], cd2: [100, 110], cd3: [5000, 6000], dd1: [5000, 5500], mc1: [10, 12], dn1: [1000, 1100],
  h1: [500, 600], h2gio: [4000, 4200], pt1: [100000, 110000], pt1dot: [50000, 60000], cn1: [1000, 1100]
};
const GWP = { CO2: 1, CH4: 28, N2O: 265 };
function hoSo() {
  const hs = [];
  const qd = (id, k, v, dv, ma) => hs.push({ nguonId: id, khi: k, nam: null, maHeSo: 'QĐ2626:' + ma, giaTri: v, donVi: dv, bac: 'qd2626', nguonGoc: 'Quyết định 2626/QĐ-BTNMT' });
  const ip = (id, k, v, dv, ng, ts) => hs.push({ nguonId: id, khi: k, nam: null, giaTri: v, donVi: dv, bac: 'ipcc', nguonGoc: ng, thamSo: ts || {} });
  qd('cd1', 'CO2', 98300, 'Kg CO2/TJ', 'I.1.25'); qd('cd1', 'CH4', 10, 'Kg CH4/TJ', 'I.1.26'); qd('cd1', 'N2O', 1.5, 'Kg N2O/TJ', 'I.1.27');
  ip('cd2', 'CO2', 74100, 'kg CO2/TJ', 'IPCC 2006, Tập 2, Bảng 2.2'); ip('cd2', 'CH4', 3, 'kg CH4/TJ', 'IPCC 2006, Tập 2, Bảng 2.2'); ip('cd2', 'N2O', 0.6, 'kg N2O/TJ', 'IPCC 2006, Tập 2, Bảng 2.2');
  ip('cd3', 'CO2', 56100, 'kg CO2/TJ', 'IPCC 2006, Tập 2, Bảng 2.2'); ip('cd3', 'CH4', 1, 'kg CH4/TJ', 'IPCC 2006, Tập 2, Bảng 2.2'); ip('cd3', 'N2O', 0.1, 'kg N2O/TJ', 'IPCC 2006, Tập 2, Bảng 2.2');
  ip('dd1', 'CO2', 74100, 'kg CO2/TJ', 'IPCC 2006, Tập 2, Bảng 3.2.1'); ip('dd1', 'CH4', 3.9, 'kg CH4/TJ', 'IPCC 2006, Tập 2, Bảng 3.2.2'); ip('dd1', 'N2O', 3.9, 'kg N2O/TJ', 'IPCC 2006, Tập 2, Bảng 3.2.2');
  hs.push({ nguonId: 'mc1', khi: 'GWP', nam: null, giaTri: 1924, donVi: '', bac: 'muc2', nguonGoc: 'IPCC AR5, giả định để kiểm thử' });
  NAM.forEach(y => hs.push({ nguonId: 'dn1', khi: 'CO2', nam: y, giaTri: 0.6592, donVi: 'tCO₂/MWh', bac: 'muc2', nguonGoc: 'Số giả định để kiểm thử' }));
  hs.push({ nguonId: 'h1', khi: 'CO2', nam: null, giaTri: 0.25, donVi: 'tCO₂/tấn hơi', bac: 'muc2', nguonGoc: 'Đơn vị cấp hơi cung cấp, giả định' });
  hs.push({ nguonId: 'h2', khi: 'CO2', nam: null, giaTri: null, donVi: '', bac: 'muc2', nguonGoc: 'Tự tính theo điểm 4', thamSo: { cachTinh: 'congThuc', hieuSuat: 85, efNhienLieu: 94600, efNguon: 'Quyết định 2626/QĐ-BTNMT, giả định' } });
  ip('pt1', 'CH4', 10, 'm³ CH₄/tấn', 'IPCC 2006, Tập 2, Chương 4', { cf: 0.67 });
  ip('cn1', 'CO2', 0.52, 't CO2/tấn clinker', 'IPCC 2006, Tập 3, Chương 2');
  const sl = [];
  const so = (id, i, gioTri, donVi, ct, them) => sl.push(Object.assign({ nguonId: id, nam: NAM[i], gioTri, donVi, nguonSoLieu: 'Hóa đơn', chungTu: 'HĐ-' + id + '-' + NAM[i], nguoiCungCap: 'Phòng vật tư', chiTiet: ct || {} }, them || {}));
  [0, 1].forEach(i => {
    so('cd1', i, IN.cd1[i], 'TJ');
    so('cd2', i, IN.cd2[i], 'tấn', { nhietTri: 0.0433 });
    so('cd3', i, IN.cd3[i], 'GJ');
    so('dd1', i, IN.dd1[i], 'lít', { nhietTri: 0.0000386, quangDuong: 20000 }, i === 1 ? { laUocTinh: true, cachUocTinh: 'Ước theo quãng đường và định mức 27,5 lít/100 km' } : {});
    so('mc1', i, IN.mc1[i], 'kg', { luongNapGanNhat: 2, thoiGianNapGanNhat: NAM[i] + '-06-10' });
    so('dn1', i, IN.dn1[i], 'MWh');
    so('h1', i, IN.h1[i], 'tấn', { apSuat: '8 bar', nhietDo: 175 });
    so('h2', i, null, 'tấn', { apSuat: '10 bar', nhietDo: 180, khoiLuongGio: 2, soGio: IN.h2gio[i], entanpi: 2800, tyLeNhienLieu: 'Than 100 %' });
    so('pt1', i, IN.pt1[i], 'tấn', { ch4Dot: IN.pt1dot[i], hieuSuatDot: 98 });
    so('cn1', i, IN.cn1[i], 'tấn');
  });
  const dt = {}; ['a', 'b', 'c', 'd', 'dd', 'e'].forEach(k => { dt[k] = 'Nhận xét nội dung ' + k + ' của cơ sở.'; });
  return {
    phienBan: 1,
    coSo: { ten: 'Công ty Cổ phần Thử nghiệm Năng lượng', diaChi: 'Số 1 đường Láng, phường Láng, Thành phố Hà Nội', tinh: 'Thành phố Hà Nội', maSoThue: '0101234567',
      nhom: 'A', boQuanLy: 'Công Thương', phuLuc: 'II', stt: '15', giayPhep: { so: '0101234567', ngayCap: '2010-05-20', noiCap: 'Sở Kế hoạch và Đầu tư Hà Nội' },
      daiDien: { hoTen: 'Nguyễn Văn An', chucVu: 'Tổng giám đốc' }, linhVuc: 'Sản xuất gạch ốp lát.\nKhai thác than hầm lò.' },
    ky: { namBatDau: 2024, namKetThuc: 2025 }, gwp: 'AR5',
    moTa: { ranhGioi: 'Toàn bộ nhà máy và mỏ than.', haTang: 'Lò hơi, xe tải, điều hòa.', heThongDuLieu: 'Phòng vật tư lưu hóa đơn.', phuongPhap: 'Bậc 1 theo IPCC.' },
    beHapThu: { coHayKhong: false }, loaiKhongCo: ['chatthai'],
    nguon: [
      { id: 'cd1', loai: 'codinh', phanLoai: 'than antraxit', thietBi: 'Lò hơi 1' },
      { id: 'cd2', loai: 'codinh', phanLoai: 'Dầu DO', thietBi: 'Máy phát dự phòng' },
      { id: 'cd3', loai: 'codinh', phanLoai: 'Khí thiên nhiên', thietBi: 'Lò nung' },
      { id: 'dd1', loai: 'didong', phanLoai: 'Dầu diesel', thietBi: 'Xe tải Hino 29C-12345', thuocTinh: { loaiPhuongTien: 'Ô tô' } },
      { id: 'cn1', loai: 'congnghiep', phanLoai: 'Sản xuất clinker xi măng', thietBi: 'Lò quay', thuocTinh: { nguyenLieu: 'Clinker' } },
      { id: 'pt1', loai: 'phattan', phanLoai: 'Than', thietBi: 'Mỏ than Khe Chàm', viTri: 'Quảng Ninh', thuocTinh: { congNghe: 'hamlo' } },
      { id: 'mc1', loai: 'moichat', phanLoai: 'R410A', thietBi: 'Điều hòa Daikin FDY', viTri: 'Văn phòng', thuocTinh: { ngayBatDau: '2020-01-15', congSuatLanh: 24000, khoiLuongNapDay: 3.5 } },
      { id: 'dn1', loai: 'dien', phanLoai: 'Điện lưới', thietBi: 'Công tơ tổng' },
      { id: 'h1', loai: 'hoi', thietBi: 'Công ty Hơi A', phanLoai: 'Hơi bão hòa' },
      { id: 'h2', loai: 'hoi', thietBi: 'Công ty Hơi B', phanLoai: 'Hơi quá nhiệt' }
    ],
    soLieu: sl, heSo: hs,
    qc: [['ct1', 'Đối chiếu số liệu nhập với chứng từ gốc'], ['ct2', 'Kiểm tra đơn vị đo và hệ số quy đổi'], ['ct3', 'Kiểm tra tính liên tục của chuỗi số liệu giữa 2 năm trong kỳ'], ['ct4', 'Đối chiếu kết quả với kỳ trước và giải thích chênh lệch bất thường']]
      .map((x, i) => ({ ma: x[0], noiDung: x[1], nguoiKiem: 'Trần Thị Kiểm', ngay: '2026-02-1' + i, ketQua: i === 1 ? 'saiSot' : 'dat', loiPhatHien: i === 1 ? 'Nhập nhầm kWh' : '', cachXuLy: i === 1 ? 'Đã sửa theo MWh' : '' })),
    khongChacChan: { dinhTinh: dt, dinhLuong: 'Giá trị U lấy theo IPCC 2006.', bangU: [{ nguonId: 'cd1', muc: '1', khi: 'CO2', uAd: 5, uEf: 3 }, { nguonId: 'dn1', muc: '3', khi: 'CO2', uAd: 2, uEf: 10 }] },
    tinhLai: { tinhTrang: 'coDoi', truongHop: ['b'], lyDo: 'Đổi bộ GWP từ AR4 sang AR5.', kyTruoc: { namBatDau: 2022, namKetThuc: 2023 },
      ketQuaCu: { 2022: 25000, 2023: 26000 }, ketQuaMoi: { 2022: 25010.5, 2023: 25990 }, giaiThich: 'Do GWP của CH₄ và N₂O thay đổi.', fileKyTruoc: '' }
  };
}

/* ---- ket qua tinh doc lap theo Muc 2 Phu luc II ---- */
function duKien() {
  const out = {};
  NAM.forEach((y, i) => {
    const r = [];
    const dot = (id, tj, ef) => { r.push({ id, k: 'CO2', t: tj * ef[0] / 1000 * 1, tt: true }); r.push({ id, k: 'CH4', t: tj * ef[1] / 1000 * GWP.CH4, tt: true }); r.push({ id, k: 'N2O', t: tj * ef[2] / 1000 * GWP.N2O, tt: true }); };
    dot('cd1', IN.cd1[i], [98300, 10, 1.5]);
    dot('cd2', IN.cd2[i] * 0.0433, [74100, 3, 0.6]);
    dot('cd3', IN.cd3[i] / 1000, [56100, 1, 0.1]);
    dot('dd1', IN.dd1[i] * 0.0000386, [74100, 3.9, 3.9]);
    r.push({ id: 'mc1', k: 'HFC', t: IN.mc1[i] / 1000 * 1924, tt: true });
    r.push({ id: 'dn1', k: 'CO2', t: IN.dn1[i] * 0.6592, tt: false });
    r.push({ id: 'h1', k: 'CO2', t: IN.h1[i] * 0.25, tt: false });
    r.push({ id: 'h2', k: 'CO2', t: 2 * IN.h2gio[i] * (2800 / 0.85 * 94600 / 1e9), tt: false });
    r.push({ id: 'pt1', k: 'CH4', t: IN.pt1[i] * 10 * 0.67 / 1000 * GWP.CH4, tt: true });
    r.push({ id: 'pt1', k: 'CO2', t: IN.pt1dot[i] * 0.67 * 0.98 * 44 / 16 / 1000, tt: true });
    r.push({ id: 'pt1', k: 'CH4', t: IN.pt1dot[i] * 0.67 * 0.02 / 1000 * GWP.CH4, tt: true });
    const tt = r.filter(x => x.tt).reduce((a, x) => a + x.t, 0), gt = r.filter(x => !x.tt).reduce((a, x) => a + x.t, 0);
    /* phuong trinh 3.1, 3.2 tren hai dong co U */
    const e1 = r[0].t, e2 = r.find(x => x.id === 'dn1').t, u1 = Math.hypot(5, 3), u2 = Math.hypot(2, 10);
    out[y] = { rows: r, tt, gt, tong: tt + gt, u: Math.sqrt((u1 * e1) ** 2 + (u2 * e2) ** 2) / (e1 + e2), phu: (e1 + e2) / (tt + gt) * 100 };
  });
  return out;
}
const DK = duKien();

/* ---- de muc Mau so 06 chep nguyen van o Mau_so_06_cau_truc.md muc 3 ---- */
function deMucMau06() {
  const md = fs.readFileSync(path.join(ROOT, 'Mau_so_06_cau_truc.md'), 'utf8');
  const phan = md.slice(md.indexOf('# 3. Nguyên văn Mẫu số 06'), md.indexOf('## 3.1.'));
  return phan.split('\n').filter(l => /^> (\*\*(I|II|III)\. |\d\. )/.test(l)).map(l => l.replace(/^> /, '').replace(/\*\*/g, '').trim());
}

(async () => {
  const errors = [];
  const fHS = path.join(TMP, 'ho_so.json'); fs.writeFileSync(fHS, JSON.stringify(hoSo()));
  const DE_MUC = deMucMau06();
  console.log('Ảnh chụp: ' + SHOTS);
  ok(DE_MUC.length === 14, 'đọc được 3 phần và 11 mục của Mẫu số 06 từ Mau_so_06_cau_truc.md');
  let fDocx, fXlsx, dongMH = {};
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await nap(page, fHS);

    console.log('\n1. Bước 8 trên màn hình');
    await doiHash(page, 'buoc-8');
    const t8 = await txt(page, '#pane-buoc-8');
    ok(t8.includes('“Cơ sở xây dựng Báo cáo kiểm kê KNK cấp cơ sở theo Mẫu số 06 Phụ lục II Nghị định số 06/2022/NĐ-CP.”'), 'dẫn nguyên văn Điều 23 Thông tư 38');
    ok(t8.includes('“Báo cáo kết quả kiểm kê khí nhà kính định kỳ hai năm một lần của cơ sở bao gồm kết quả kiểm kê khí nhà kính của hai năm liền kề năm nộp báo cáo.”'), 'dẫn nguyên văn điểm e khoản 1 Điều 11, bổ sung tại Nghị định 119');
    const tt = await page.$$eval('#b8-tinhtrang tr[data-b8]', rs => rs.map(r => r.textContent));
    ok(tt.length === 8 && tt.every(x => x.includes('Đã xong')), 'hồ sơ thử đã xong Bước 0 đến Bước 7' + (tt.every(x => x.includes('Đã xong')) ? '' : ': ' + tt.filter(x => !x.includes('Đã xong')).join(' | ')));
    const giu = await page.evaluate(() => Array.from(document.querySelectorAll('#qt-menu .qt-mi'))[8].classList.contains('xong'));
    ok(giu, 'Bước 8 có dấu xong khi Bước 0 đến Bước 7 xong');
    for (const y of NAM) {
      for (const k of ['tt', 'gt', 'tong']) dongMH[y + '|' + k] = (await txt(page, `[data-kq8="${y}|${k}"]`)).trim();
    }
    ok(NAM.every(y => dongMH[y + '|tong'].startsWith(vi(DK[y].tong, 3)) && dongMH[y + '|tt'].startsWith(vi(DK[y].tt, 3)) && dongMH[y + '|gt'].startsWith(vi(DK[y].gt, 3))),
      'kết quả trên màn hình khớp phép tính độc lập: 2024 ' + vi(DK[2024].tong, 3) + ', 2025 ' + vi(DK[2025].tong, 3));
    ok(dongMH['2024|tong'].includes('chưa đủ'), 'tổng ghi chưa đủ, vì quá trình công nghiệp không có công thức trong Thông tư 38');
    const pf = await page.$$eval('#b8-phanf tr[data-f]', rs => rs.map(r => r.lastElementChild.textContent));
    const kyVong = ['Đạt', 'Chưa đạt', 'Đạt', 'Đạt', 'Đạt', 'Đạt', 'Đạt', 'Đạt', 'Đạt', 'Đạt', 'Đạt', 'Đạt', 'Tự kiểm', 'Tự kiểm', 'Tự kiểm'];
    ok(pf.length === 15 && pf.every((x, i) => x.startsWith(kyVong[i])), 'bảng kiểm Phần F đủ 15 mục, tự kiểm đúng' + (pf.every((x, i) => x.startsWith(kyVong[i])) ? '' : ': ' + pf.map((x, i) => (i + 1) + ' ' + x.slice(0, 12)).join(', ')));
    ok(pf[12].includes('Ủy ban nhân dân cấp tỉnh'), 'mục 13 nhắc nơi nhận của nhóm A');
    const xt = await txt(page, '#b8-xemtruoc');
    ok(xt.includes('Kết quả kiểm kê khí nhà kính cho năm 2024 và năm 2025') && DE_MUC.every(d => xt.includes(d)), 'bản xem trước có tiêu đề hai năm và đủ đề mục Mẫu số 06');
    ok((await page.$$('#b8-xemtruoc .qt-a4-web')).length === 2, 'bản xem trước có ghi chú “bảng là cách trình bày của ứng dụng” dưới III.2 và III.3');
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(SHOTS, '51_buoc_8.png'), fullPage: true });
    await (await page.$('#b8-xemtruoc .qt-a4')).screenshot({ path: path.join(SHOTS, '52_xem_truoc_mau06.png') });

    console.log('\n2. Xuất file');
    const d = await taiXuong(page, '[data-act="xuatDocx"]', 'mau06.docx'); fDocx = d.f;
    ok(/^KNK_Mau06_cong-ty-co-phan-thu-nghiem-nang-luong_2024-2025_\d{8}-\d{4}\.docx$/.test(d.ten), 'tên file .docx có tên cơ sở và kỳ: ' + d.ten);
    const x = await taiXuong(page, '[data-act="xuatXlsx"]', 'bang_tinh.xlsx'); fXlsx = x.f;
    ok(/^KNK_BangTinh_.+_2024-2025_\d{8}-\d{4}\.xlsx$/.test(x.ten), 'tên file .xlsx: ' + x.ten);
    const j = await taiXuong(page, '[data-act="xuatJson"]');
    ok(/\.json$/.test(j.ten) && JSON.parse(fs.readFileSync(j.f, 'utf8')).coSo.ten === 'Công ty Cổ phần Thử nghiệm Năng lượng', 'nút tải .json ở Bước 8 dùng được');

    console.log('\n3. Bước 2: đơn vị GJ đổi thẳng ra TJ');
    await doiHash(page, 'buoc-2');
    ok((await txt(page, '[data-calc="tj|cd3|2024"]')) === '5', '5.000 GJ hiện 5 TJ, không cần nhiệt trị');
    await browser.close();
  }

  console.log('\n4. File .docx');
  const K = kiemFile(fDocx, fXlsx, 'mau06');
  const D = K.docx, P = D.paras;
  ok(D.parts.includes('word/document.xml') && D.parts.includes('word/styles.xml') && D.parts.includes('word/header1.xml'), 'đủ các phần của gói .docx, python-docx đọc được');
  ok(D.pdf && D.pdf.pages >= 6, 'LibreOffice mở được và xuất PDF, ' + (D.pdf && D.pdf.pages) + ' trang');
  ok(D.sect.w === 11906 && D.sect.h === 16838 && D.sect.top === 1134 && D.sect.bottom === 1134 && D.sect.left === 1701 && D.sect.right === 1134, 'khổ A4, lề trên 20 mm, dưới 20 mm, trái 30 mm, phải 20 mm');
  ok(D.sect.titlePg && D.header.trim() === 'PAGE', 'số trang ở đầu trang, bỏ trang đầu');
  ok(D.fonts.length === 1 && D.fonts[0] === 'Times New Roman', 'phông Times New Roman');
  ok(P[0] === 'Mẫu số 06', 'góc phải trên cùng ghi Mẫu số 06');
  const dau = D.tables[0][0];
  ok(dau[0].includes('CÔNG TY CỔ PHẦN THỬ NGHIỆM NĂNG LƯỢNG') && dau[1] === 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAMĐộc lập - Tự do - Hạnh phúc', 'phần đầu: tên cơ sở chữ in hoa, quốc hiệu và tiêu ngữ');
  ok(P.includes('BÁO CÁO') && P.includes('Kết quả kiểm kê khí nhà kính cho năm 2024 và năm 2025'), 'tiêu đề điền cả hai năm của kỳ');
  let viTri = -1, dungThuTu = true;
  DE_MUC.forEach(dm => { const i = P.indexOf(dm, viTri + 1); if (i < 0) dungThuTu = false; else viTri = i; });
  ok(dungThuTu, 'đủ 14 đề mục, đúng nguyên văn và đúng thứ tự Mẫu số 06');
  const cuoi = D.tables[D.tables.length - 1][0].join('');
  ok(cuoi.includes('ĐẠI DIỆN CỦA CƠ SỞ') && cuoi.includes('Nguyễn Văn An'), 'cuối văn bản: ĐẠI DIỆN CỦA CƠ SỞ và tên người đại diện');
  const tatCa = P.join('\n') + D.tables.map(t => t.map(r => r.join('|')).join('\n')).join('\n');
  ok(!tatCa.includes('Ghi chú của ứng dụng') && !tatCa.includes('không phải bảng bắt buộc'), 'ghi chú “bảng là cách trình bày của ứng dụng” không in vào .docx');
  const hl = D.highlights.join(' | ');
  ok(D.highlights.length > 0 && D.highlights.every(h => /không có công thức|chưa đầy đủ|Chưa gồm phát thải|\[$|^\]$/.test(h) || h.trim() === '' || /Chưa nhập: phương pháp tính, Thông tư 38/.test(h)),
    'chỉ đánh dấu vàng chỗ liên quan nguồn không có công thức: ' + hl.slice(0, 160));
  for (const y of NAM) {
    const tb = ['1.1', '1.2', '2.1', '2.2', '3', '4.1', '4.2'].every(s => P.some(p => p.startsWith('Bảng ' + s + '. ') && p.endsWith('năm ' + y)));
    ok(tb && P.includes('Số liệu quá trình công nghiệp, năm ' + y), 'III.2 năm ' + y + ': đủ bảng 1.1, 1.2, 2.1, 2.2, 3, 4.1, 4.2 và bảng quá trình công nghiệp');
  }
  /* bang tong hop: cac bang co cot "Phat thai (tan CO2td)" */
  const bangKQ = D.tables.filter(t => t[0].length === 9 && t[0][8].startsWith('Phát thải'));
  ok(bangKQ.length === 2, 'III.3 có hai bảng tổng hợp theo biểu E.8, mỗi năm một bảng');
  NAM.forEach((y, i) => {
    const t = bangKQ[i] || [[]];
    const tong = t[t.length - 1];
    ok(tong[0] === 'Tổng cộng [chưa đầy đủ]' && tong[tong.length - 1] === vi(DK[y].tong, 3) && tong[tong.length - 1] === dongMH[y + '|tong'].replace(/\s*chưa đủ$/, ''),
      'tổng cộng năm ' + y + ' trong .docx khớp màn hình: ' + (tong[tong.length - 1] || ''));
    const soDong = t.slice(1, -1).filter(r => r.length === 9).map(r => r[8]).sort().join(';');
    ok(soDong === DK[y].rows.map(r => vi(r.t, 3)).sort().join(';'), 'năm ' + y + ': ' + DK[y].rows.length + ' dòng phát thải trong .docx khớp phép tính độc lập');
    ok(t.some(r => r.length < 9 && r.join('').includes('không có công thức')), 'năm ' + y + ': dòng quá trình công nghiệp ghi rõ không có công thức, không ra số');
    ok(P.some(p => p === '- Năm ' + y + ': độ không chắc chắn của phần phát thải có đủ số liệu độ không chắc chắn, chiếm ' + vi(DK[y].phu, 1) + ' % tổng lượng phát thải, là ±' + vi(DK[y].u, 1) + ' %.'),
      'III.4 năm ' + y + ': ±' + vi(DK[y].u, 1) + ' % khớp phương trình 3.2, nói rõ chỉ tính trên ' + vi(DK[y].phu, 1) + ' % phát thải');
  });
  const bTL = D.tables.find(t => t[0][0] === 'Năm' && t[0].length === 5);
  ok(bTL && bTL[1].join('|') === '2022|25.000|25.010,5|+10,5|+0,04 %', 'bảng tính toán lại kỳ trước: ' + (bTL ? bTL[1].join(' | ') : 'không có'));
  ok(P.some(p => p.includes('Tiềm năng nóng lên toàn cầu theo Báo cáo đánh giá lần thứ năm (AR5) của IPCC: CO₂ = 1; CH₄ = 28; N₂O = 265.') && p.includes('R410A = 1.924')), 'III.1 ghi bộ GWP AR5 và GWP môi chất lạnh');
  ok(P.some(p => p.includes('tự tính theo công thức điểm 4, hiệu suất lò hơi 85 %')) && P.some(p => p.includes('đính chính tại Quyết định 334/QĐ-BCT')), 'III.1 ghi hệ số hơi tự tính và đính chính Quyết định 334');
  ok(P.some(p => p.includes('không trừ khỏi phát thải CH₄ tại điểm 5.1')), 'III.1 nêu rõ không trừ CH₄ thu gom đem đốt, theo Thông tư');
  ok(P.some(p => p.startsWith('Số liệu ước tính: Dầu diesel, Xe tải Hino 29C-12345, Ước theo quãng đường')), 'III.2 ghi số liệu ước tính và cách ước tính');
  ok(tatCa.includes('CO₂') && tatCa.includes('CH₄') && !/CO<\/w:t>/.test(tatCa), 'CO₂, CH₄ ghi bằng ký tự chỉ số dưới trong cùng một run, không tách run để LibreOffice khỏi làm mất chữ số ở cuối dòng');

  console.log('\n5. File .xlsx');
  const X = K.xlsx;
  ok(X.sheets.join('|') === 'Thông tin|Tổng hợp|Bảng tính|Biểu năm 2024|Biểu năm 2025|Hệ số|Kiểm soát chất lượng|Độ không chắc chắn|Tính toán lại', 'đủ 9 trang tính: ' + X.sheets.join(', '));
  ok(X.calc !== null, 'LibreOffice mở được và tính lại toàn bộ công thức');
  let soCT = 0, lech = [];
  for (const sh of X.sheets) {
    for (const [ref, c] of Object.entries(X.cells[sh])) {
      if (!('f' in c)) continue; soCT++;
      const moi = X.calc[sh][ref];
      const khop = (typeof c.v === 'number' && typeof moi === 'number') ? gan(moi, c.v) : ((c.v == null || c.v === '') && (moi == null || moi === ''));
      if (!khop) lech.push(sh + '!' + ref + ' ' + c.v + ' / ' + moi);
    }
  }
  ok(soCT > 150 && lech.length === 0, soCT + ' ô công thức, tính lại khớp giá trị ứng dụng' + (lech.length ? ': ' + lech.slice(0, 5).join('; ') : ''));
  const th = X.cells['Tổng hợp'], thc = X.calc['Tổng hợp'];
  const hangCua = nhan => Object.keys(th).find(r => /^A\d+$/.test(r) && th[r].v === nhan).slice(1);
  const rT = hangCua('Tổng phát thải'), rTT = hangCua('Phát thải trực tiếp'), rGT = hangCua('Phát thải gián tiếp');
  ok(gan(thc['B' + rT], DK[2024].tong) && gan(thc['C' + rT], DK[2025].tong) && gan(thc['B' + rTT], DK[2024].tt) && gan(thc['C' + rGT], DK[2025].gt), 'tổng hợp trong .xlsx khớp phép tính độc lập và màn hình');
  ok(/^=SUMIFS\('Bảng tính'!\$P\$2:\$P\$\d+,'Bảng tính'!\$B\$2:\$B\$\d+,2024,'Bảng tính'!\$E\$2:\$E\$\d+,"Trực tiếp"\)$/.test(th['B' + rTT].f) && th['B' + rT].f === '=B' + rTT + '+B' + rGT, 'tổng hợp là công thức SUMIFS từ trang Bảng tính');
  const bt = X.cells['Bảng tính'];
  const soDongBT = Object.keys(bt).filter(r => /^A\d+$/.test(r)).length - 1;
  ok(soDongBT === (DK[2024].rows.length + 1) * 2, 'Bảng tính có ' + soDongBT + ' dòng: mỗi khí của mỗi nguồn mỗi năm, kể cả dòng không có công thức');
  ok(Object.keys(bt).some(r => /^N\d+$/.test(r) && /^=H\d+\*J\d+\*L\d+$/.test(bt[r].f || '')) && Object.keys(bt).some(r => /^N\d+$/.test(r) && /^=H\d+\*L\d+$/.test(bt[r].f || '')), 'lượng khí = AD × EF × k, hoặc AD × k cho điểm 2.1, 5.2, 5.3');
  const bieu = X.cells['Biểu năm 2024'], bieuC = X.calc['Biểu năm 2024'];
  const tjF = Object.keys(bieu).filter(r => (bieu[r].f || '').startsWith('=IF(')).map(r => bieuC[r]);
  ok(tjF.length === 3 && gan(tjF[0], 10) && gan(tjF[1], 4.33) && gan(tjF[2], 5), 'biểu 1.1: cột tổng tiêu thụ TJ là công thức, ra 10; 4,33; 5');
  const sumif = Object.keys(bieu).filter(r => /^C\d+$/.test(r) && /^=[A-Z]+\d+(\+[A-Z]+\d+)*$/.test(bieu[r].f || '')).map(r => bieuC[r]);
  ok(sumif.length === 1 && sumif[0] === 10, 'bảng 2.1 cộng từ bảng 2.2, khớp đúng tên môi chất như ứng dụng: 10 kg R410A');
  const uk = X.cells['Độ không chắc chắn'], ukc = X.calc['Độ không chắc chắn'];
  const uTong = Object.keys(uk).filter(r => /^H\d+$/.test(r) && (uk[r].f || '').includes('SUMSQ')).map(r => ukc[r]);
  ok(uTong.length === 2 && gan(uTong[0], DK[2024].u, 1e-9) && gan(uTong[1], DK[2025].u, 1e-9), 'độ không chắc chắn tính lại bằng công thức: ±' + uTong.map(u => vi(u, 2)).join(', ±') + ' %');
  const tl = X.calc['Tính toán lại'];
  ok(Object.values(tl).some(v => v === 10.5) && Object.values(tl).some(v => v === -10), 'trang tính toán lại: chênh lệch +10,5 và −10');

  console.log('\n6. Giao diện tiếng Anh vẫn xuất tiếng Việt, hồ sơ trống vẫn xuất được');
  let fDocxEn, fDocxRong, fXlsxRong;
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await nap(page, fHS);
    await page.click('#qt-en');
    await doiHash(page, 'buoc-8');
    ok((await txt(page, '#b8-xuat')).includes('Download Form 06 draft (.docx)'), 'Bước 8 chuyển được tiếng Anh');
    fDocxEn = (await taiXuong(page, '[data-act="xuatDocx"]', 'mau06_en.docx')).f;
    await page.click('#qt-vi');
    await page.click('#qt-home');
    await page.click('#qt-new');
    if (await page.isVisible('#qt-confirm')) await page.click('#qt-confirm-acts button:has-text("Bắt đầu kỳ mới")');
    await doiHash(page, 'buoc-8');
    ok((await page.$$('#b8-ketqua')).length === 0 && (await txt(page, '#b8-tinhtrang')).includes('Còn'), 'hồ sơ trống: Bước 8 hiện tình trạng, chưa có kết quả');
    fDocxRong = (await taiXuong(page, '[data-act="xuatDocx"]', 'rong.docx')).f;
    fXlsxRong = (await taiXuong(page, '[data-act="xuatXlsx"]', 'rong.xlsx')).f;
    await browser.close();
  }
  const KE = kiemFile(fDocxEn, null, 'mau06_en').docx;
  ok(KE.paras.join('\n') === P.join('\n'), 'bản .docx xuất khi đang dùng tiếng Anh giống hệt bản tiếng Việt');
  const KR = kiemFile(fDocxRong, fXlsxRong, 'rong');
  let vt = -1, du = true;
  DE_MUC.forEach(dm => { const i = KR.docx.paras.indexOf(dm, vt + 1); if (i < 0) du = false; else vt = i; });
  ok(du && KR.docx.pdf && KR.docx.highlights.length >= 15, 'hồ sơ trống: .docx vẫn đủ đề mục, ' + KR.docx.highlights.length + ' chỗ đánh dấu [Chưa nhập]');
  ok(KR.docx.tables[0][0][0] === 'TÊN CƠ SỞ PHẢI THỰC HIỆNKIỂM KÊ KHÍ NHÀ KÍNH' && KR.docx.paras.includes('Kết quả kiểm kê khí nhà kính cho năm [Chưa nhập: kỳ báo cáo]'), 'hồ sơ trống: giữ chữ mẫu ở phần đầu, tiêu đề đánh dấu thiếu kỳ');
  ok(KR.xlsx.calc !== null && KR.xlsx.sheets.length === 6, 'hồ sơ trống: .xlsx mở được, ' + KR.xlsx.sheets.length + ' trang tính');

  console.log('\n7. Khổ điện thoại 375 px');
  {
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await nap(page, fHS);
    await doiHash(page, 'buoc-8'); await page.waitForTimeout(100);
    const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
    ok(w[0] <= w[1], 'Bước 8 không tràn ngang: ' + w.join(' / '));
    await page.screenshot({ path: path.join(SHOTS, '53_dien_thoai_buoc_8.png'), fullPage: false });
    await browser.close();
  }

  console.log('\n8. Lỗi console');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang' + (errors.length ? ': ' + errors.join(' | ') : ''));
  console.log('\nKết quả: ' + pass + ' đạt, ' + fail + ' trượt');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
