/* Kiem thu nghiem thu Giai doan 4 (Buoc 5, 6, 7), chay tren ban da dong goi.

   Chay:  NODE_PATH=$(npm root -g) node tests/giai_doan_4.test.js

   Nghiem thu theo ke hoach: ba man hinh nhap duoc va noi dung di vao file xuat.
   Kem: kiem tra tu dong cua Buoc 5, may tinh do khong chac chan doi chieu voi phuong
   trinh 3.1, 3.2 IPCC 2006 tinh doc lap o day, tu tinh ket qua ky truoc tu file .json.
   So lieu la so gia dinh. */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-test4-'));
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
const vi = (v, d) => v.toLocaleString('vi-VN', { maximumFractionDigits: d });
async function go(page, sel, v) { await page.fill(sel, v); await page.press(sel, 'Tab'); }

/* Ho so thu: ky 2024-2025, AR5, lo hoi dot than antraxit va dien luoi */
function hoSo(ky, gwp, luoi, tj) {
  const hs = [
    { nguonId: 'cd1', khi: 'CO2', nam: null, maHeSo: 'QĐ2626:I.1.25', giaTri: 98300, donVi: 'Kg CO2/TJ', bac: 'qd2626', nguonGoc: 'Quyết định 2626/QĐ-BTNMT' },
    { nguonId: 'cd1', khi: 'CH4', nam: null, maHeSo: 'QĐ2626:I.1.26', giaTri: 10, donVi: 'Kg CH4/TJ', bac: 'qd2626', nguonGoc: 'Quyết định 2626/QĐ-BTNMT' },
    { nguonId: 'cd1', khi: 'N2O', nam: null, maHeSo: 'QĐ2626:I.1.27', giaTri: 1.5, donVi: 'Kg N2O/TJ', bac: 'qd2626', nguonGoc: 'Quyết định 2626/QĐ-BTNMT' }
  ];
  ky.forEach((y, i) => hs.push({ nguonId: 'dn1', khi: 'CO2', nam: y, giaTri: luoi[i], donVi: 'tCO₂/MWh', bac: 'muc2', nguonGoc: 'Số giả định để kiểm thử' }));
  return {
    phienBan: 1, coSo: { ten: 'Công ty Thử nghiệm Giai đoạn 4', diaChi: 'Hà Nội', nhom: 'A', boQuanLy: 'Công Thương' },
    ky: { namBatDau: ky[0], namKetThuc: ky[1] }, gwp,
    moTa: { ranhGioi: 'Toàn bộ nhà máy.' }, beHapThu: { coHayKhong: false },
    loaiKhongCo: ['didong', 'congnghiep', 'phattan', 'moichat', 'chatthai', 'hoi'],
    nguon: [{ id: 'cd1', loai: 'codinh', phanLoai: 'than antraxit', thietBi: 'Lò hơi' }, { id: 'dn1', loai: 'dien', phanLoai: 'Điện lưới', thietBi: 'Công tơ tổng' }],
    soLieu: [
      { nguonId: 'cd1', nam: ky[0], gioTri: tj[0], donVi: 'TJ', nguoiCungCap: 'Phòng vật tư', chungTu: 'HĐ 0001' },
      { nguonId: 'cd1', nam: ky[1], gioTri: tj[1], donVi: 'TJ', nguoiCungCap: 'Phòng vật tư' },
      { nguonId: 'dn1', nam: ky[0], gioTri: 1000, donVi: 'MWh' },
      { nguonId: 'dn1', nam: ky[1], gioTri: 1000, donVi: 'MWh' }
    ],
    heSo: hs
  };
}
const fNay = path.join(TMP, 'ky_nay.json'), fTruoc = path.join(TMP, 'ky_truoc.json');
fs.writeFileSync(fNay, JSON.stringify(hoSo([2024, 2025], 'AR5', [0.6592, 0.6592], [10, 12])));
fs.writeFileSync(fTruoc, JSON.stringify(hoSo([2022, 2023], 'AR4', [0.6766, 0.6592], [10, 10])));

async function nap(page, trigger, file) {
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click(trigger)]);
  await fc.setFiles(file);
}

(async () => {
  const errors = [];
  let fileXuat;
  console.log('Ảnh chụp: ' + SHOTS);
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await nap(page, '#qt-load', fNay);
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
    ok(await xongBuoc(page, 4), 'hồ sơ thử đã hoàn thành đến Bước 4');

    console.log('\n1. Bước 5: kiểm soát chất lượng');
    await doiHash(page, 'buoc-5');
    ok((await txt(page, '#pane-buoc-5')).includes('tiểu mục 6.1.2 Mục 6 Tiêu chuẩn quốc gia TCVN ISO 14064-1:2011'), 'dẫn nguyên văn Điều 20 Thông tư 38');
    ok((await txt(page, '#pane-buoc-5')).includes('chưa đối chiếu được nguyên văn tiểu mục 6.1.2'), 'nói rõ chưa đối chiếu được nguyên văn tiêu chuẩn');
    ok((await txt(page, '#b5-tudong')).includes('3 dòng số liệu chưa ghi nguồn số liệu và số hiệu chứng từ'), 'kiểm tra tự động đếm đúng 3 dòng chưa có chứng từ');
    const lt = await page.$eval('#b5-tudong [data-lientuc^="Nguồn cố định 1"]', e => e.textContent);
    ok(lt === '+20 %', 'tính liên tục: than 10 TJ lên 12 TJ là +20 %');
    ok(!(await xongBuoc(page, 5)) && (await txt(page, '#pane-buoc-5 .qt-thieu')).includes('Biên bản kiểm soát chất lượng chưa có dòng nào'), 'biên bản trống thì Bước 5 chưa xong');
    await page.click('[data-act="qc4"]');
    ok((await page.$$('#b5-bienban tbody tr')).length === 4, 'nút thêm 4 nội dung tối thiểu tạo 4 dòng');
    ok((await page.inputValue('#b5-bienban [data-b="p|qc.2.noiDung"]')).includes('tính liên tục của chuỗi số liệu giữa 2 năm'), 'nội dung dòng 3 là kiểm tra tính liên tục');
    for (let i = 0; i < 4; i++) {
      await page.fill(`[data-b="p|qc.${i}.nguoiKiem"]`, 'Trần Thị Kiểm');
      await page.fill(`[data-b="p|qc.${i}.ngay"]`, '2026-02-10');
      await page.selectOption(`[data-b="p|qc.${i}.ketQua"]`, i === 1 ? 'saiSot' : 'dat');
    }
    ok(!(await xongBuoc(page, 5)) && (await txt(page, '#pane-buoc-5 .qt-thieu')).includes('Dòng 2 của biên bản: Sai sót phát hiện'), 'dòng có sai sót mà chưa ghi sai sót và cách xử lý thì chưa xong');
    await page.fill('[data-b="p|qc.1.loiPhatHien"]', 'Hóa đơn điện tháng 7 nhập nhầm đơn vị kWh');
    await page.fill('[data-b="p|qc.1.cachXuLy"]', 'Đã sửa lại theo MWh');
    ok(await xongBuoc(page, 5), 'đủ 4 nội dung và thông tin từng dòng thì Bước 5 xong');
    await page.fill('[data-b="p|qc.0.nguoiKiem"]', 'Phòng vật tư');
    await page.fill('[data-b="p|qc.0.nguoiKiem"]', 'Phòng vật tư');
    await doiHash(page, 'buoc-4'); await doiHash(page, 'buoc-5');
    ok((await txt(page, '#b5-bienban')).includes('vừa là người kiểm tra, vừa là người cung cấp số liệu'), 'cảnh báo khi người kiểm tra trùng người cung cấp số liệu');
    await page.fill('[data-b="p|qc.0.nguoiKiem"]', 'Trần Thị Kiểm');
    await page.click('[data-act="qcThem"]');
    ok((await page.$$('#b5-bienban tbody tr')).length === 5, 'thêm được dòng tự do');
    await page.click('[data-act="xoaQc|4"]');
    ok((await page.$$('#b5-bienban tbody tr')).length === 4 && await xongBuoc(page, 5), 'xóa dòng tự do, Bước 5 vẫn xong');
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(SHOTS, '41_buoc_5.png'), fullPage: true });
    ok(await page.$eval('#b5-bienban .qt-tbw', w => w.scrollWidth <= w.clientWidth + 1), 'biên bản vừa khung 1360 px, không phải cuộn ngang');

    console.log('\n2. Bước 6: độ không chắc chắn');
    await doiHash(page, 'buoc-6');
    const dt = await txt(page, '#b6-dinhtinh');
    ok(['a) Tính hoàn thiện của báo cáo;', 'b) Tính phù hợp thực tế của mô hình, phương pháp kiểm kê;', 'c) Tính đầy đủ của dữ liệu tính toán;', 'd) Tính đại diện của số liệu;', 'đ) Tính bất thường của số liệu;', 'e) Sự thiếu minh bạch, sai phạm vi kiểm kê.'].every(x => dt.includes(x)), 'đủ 6 nội dung, đúng nguyên văn khoản 1 Điều 11');
    ok(dt.includes('+20 %'), 'gợi ý cho nội dung đ) nêu chênh lệch +20 %');
    ok(dt.includes('3 từ Quyết định 2626'), 'gợi ý cho nội dung b) đếm hệ số theo nguồn');
    for (const k of ['a', 'b', 'c', 'd', 'dd', 'e']) await page.fill(`[data-b="p|khongChacChan.dinhTinh.${k}"]`, 'Nhận xét thử cho nội dung ' + k);
    ok(await xongBuoc(page, 6), 'đủ nhận xét 6 nội dung thì Bước 6 xong');
    await go(page, '[data-b="u|cd1|1|CO2|uAd"]', '5');
    await go(page, '[data-b="u|cd1|1|CO2|uEf"]', '3');
    await go(page, '[data-b="u|dn1|3|CO2|uAd"]', '2');
    await go(page, '[data-b="u|dn1|3|CO2|uEf"]', '10');
    ok((await txt(page, '[data-calc="urow|cd1|1|CO2"]')) === vi(Math.sqrt(34), 1), 'phương trình 3.1: √(5² + 3²) = ' + vi(Math.sqrt(34), 1) + ' %');
    /* phuong trinh 3.2 tinh doc lap: nam 2024, AR5 */
    const E = { co2: 10 * 98300 * 0.001, ch4: 10 * 10 * 0.001 * 28, n2o: 10 * 1.5 * 0.001 * 265, dien: 1000 * 0.6592 };
    const u1 = Math.sqrt(34), u2 = Math.sqrt(104);
    const U = Math.sqrt(Math.pow(u1 * E.co2, 2) + Math.pow(u2 * E.dien, 2)) / (E.co2 + E.dien);
    const phu = (E.co2 + E.dien) / (E.co2 + E.ch4 + E.n2o + E.dien) * 100;
    const ut = await txt(page, '[data-calc="utong|2024"]');
    ok(ut.includes('±' + vi(U, 1) + ' %') && ut.includes(vi(phu, 1) + ' %'), 'phương trình 3.2: tổng năm 2024 ±' + vi(U, 1) + ' %, phủ ' + vi(phu, 1) + ' % phát thải');
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(SHOTS, '42_buoc_6.png'), fullPage: true });

    console.log('\n3. Bước 7: tính toán lại');
    await doiHash(page, 'buoc-7');
    const t7 = await txt(page, '#pane-buoc-7');
    ok(['a) Có sự thay đổi về phạm vi kiểm kê KNK;', 'c) Có sự thay đổi về nguồn và hệ số phát thải KNK.'].every(x => t7.includes(x)), 'dẫn nguyên văn khoản 1 Điều 22');
    ok(!(await xongBuoc(page, 7)), 'chưa chọn tình trạng thì Bước 7 chưa xong');
    await page.check('input[name=qt-tl][value=kyDau]');
    ok(await xongBuoc(page, 7), 'kỳ báo cáo đầu tiên thì Bước 7 xong ngay');
    await doiHash(page, 'buoc-5');
    ok((await txt(page, '#b5-tudong')).includes('kỳ báo cáo đầu tiên'), 'Bước 5 biết đây là kỳ đầu, không có kỳ trước để đối chiếu');
    await doiHash(page, 'buoc-7');
    await page.check('input[name=qt-tl][value=coDoi]');
    ok(!(await xongBuoc(page, 7)), 'chọn có thay đổi thì phải nhập tiếp');
    await page.check('[data-b="th|b"]');
    await page.fill('[data-b="p|tinhLai.lyDo"]', 'Kỳ trước dùng bộ GWP AR4, kỳ này chuyển sang AR5 theo kiểm kê quốc gia.');
    await nap(page, '[data-act="napKy7"]', fTruoc);
    await page.waitForSelector('#b7-file .qt-ct');
    const f = await txt(page, '#b7-file .qt-ct');
    const cu = { 2022: 983 + 0.1 * 25 + 0.015 * 298 + 676.6, 2023: 983 + 0.1 * 25 + 0.015 * 298 + 659.2 };
    const moi = { 2022: 983 + 0.1 * 28 + 0.015 * 265 + 676.6, 2023: 983 + 0.1 * 28 + 0.015 * 265 + 659.2 };
    ok(f.includes('Theo bộ GWP của file (AR4)') && f.includes(vi(cu[2022], 3)) && f.includes(vi(cu[2023], 3)), 'file kỳ trước theo AR4 của chính nó: ' + vi(cu[2022], 3) + ' và ' + vi(cu[2023], 3));
    ok(f.includes('Theo bộ GWP đang chọn (AR5)') && f.includes(vi(moi[2022], 3)) && f.includes(vi(moi[2023], 3)), 'tính lại theo AR5 đang chọn: ' + vi(moi[2022], 3) + ' và ' + vi(moi[2023], 3));
    await page.click('[data-act="dien7|cu"]');
    await page.click('[data-act="dien7|moi"]');
    ok((await page.inputValue('#b7-ketqua select')) === '2022-2023', 'kỳ trước lấy từ file: 2022 và 2023');
    ok((await page.inputValue('[data-b="p|tinhLai.ketQuaCu.2022"]')) === vi(cu[2022], 10) && (await page.inputValue('[data-b="p|tinhLai.ketQuaMoi.2023"]')) === vi(moi[2023], 10), 'điền đúng hai cột kết quả');
    const cl = await txt(page, '[data-calc="tl|2022"]');
    ok(cl.startsWith(vi(moi[2022] - cu[2022], 3)), 'chênh lệch năm 2022: ' + vi(moi[2022] - cu[2022], 3) + ' tCO₂tđ');
    ok(!(await xongBuoc(page, 7)) && (await txt(page, '#pane-buoc-7 .qt-thieu')).includes('Giải thích nguyên nhân chênh lệch'), 'chưa giải thích chênh lệch thì chưa xong');
    await page.fill('[data-b="p|tinhLai.giaiThich"]', 'Chênh lệch do GWP của CH₄ và N₂O thay đổi giữa AR4 và AR5.');
    ok(await xongBuoc(page, 7), 'đủ trường hợp, mô tả, kết quả hai năm và giải thích thì Bước 7 xong');
    await doiHash(page, 'buoc-5');
    ok((await txt(page, '#b5-tudong')).includes('Kỳ trước, năm 2022'), 'Bước 5 đối chiếu được với kết quả kỳ trước');
    await doiHash(page, 'buoc-7');
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(SHOTS, '43_buoc_7.png'), fullPage: true });
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#qt-save')]);
    fileXuat = path.join(TMP, dl.suggestedFilename()); await dl.saveAs(fileXuat);
    await browser.close();
  }

  console.log('\n4. Nội dung đi vào file xuất');
  const j = JSON.parse(fs.readFileSync(fileXuat, 'utf8'));
  ok(j.qc.length === 4 && j.qc.map(q => q.ma).join() === 'ct1,ct2,ct3,ct4' && j.qc[1].ketQua === 'saiSot' && j.qc[1].cachXuLy === 'Đã sửa lại theo MWh', 'biên bản kiểm soát chất lượng lưu đủ 4 dòng');
  ok(Object.keys(j.khongChacChan.dinhTinh).length === 6 && j.khongChacChan.dinhTinh.dd.includes('dd'), 'lưu nhận xét 6 nội dung');
  ok(j.khongChacChan.bangU.length === 2 && j.khongChacChan.bangU.find(u => u.nguonId === 'dn1').uEf === 10, 'lưu bảng độ không chắc chắn');
  const tl = j.tinhLai;
  ok(tl.tinhTrang === 'coDoi' && tl.truongHop.join() === 'b' && tl.kyTruoc.namBatDau === 2022 && tl.fileKyTruoc === 'ky_truoc.json', 'lưu tình trạng, trường hợp, kỳ trước, tên file');
  ok(Math.abs(tl.ketQuaCu['2022'] - (983 + 2.5 + 4.47 + 676.6)) < 1e-6 && Math.abs(tl.ketQuaMoi['2023'] - (983 + 2.8 + 3.975 + 659.2)) < 1e-6, 'lưu kết quả kỳ trước dạng số');

  console.log('\n5. Mở trình duyệt mới, nạp lại');
  {
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ viewport: { width: 1360, height: 950 } })).newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await nap(page, '#qt-load', fileXuat);
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
    ok(await xongBuoc(page, 5) && await xongBuoc(page, 6) && await xongBuoc(page, 7), 'nạp lại thì Bước 5, 6, 7 vẫn xong');
    await doiHash(page, 'buoc-6');
    ok((await page.inputValue('[data-b="u|dn1|3|CO2|uEf"]')) === '10', 'bảng độ không chắc chắn hiện lại đúng');
    await page.click('#qt-en');
    ok((await txt(page, '#b6-dinhtinh')).includes('a) Completeness of the report;'), 'Bước 6 chuyển được tiếng Anh');
    await doiHash(page, 'buoc-7');
    ok((await txt(page, '#pane-buoc-7')).includes('Recalculated result'), 'Bước 7 chuyển được tiếng Anh');
    await browser.close();
  }

  console.log('\n6. Khổ điện thoại 375 px');
  {
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await nap(page, '#qt-load', fileXuat);
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
    const tran = [];
    for (const id of ['buoc-5', 'buoc-6', 'buoc-7']) {
      await doiHash(page, id); await page.waitForTimeout(80);
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      if (w[0] > w[1]) tran.push(id + ' ' + w[0] + '>' + w[1]);
    }
    ok(tran.length === 0, 'Bước 5, 6, 7 không tràn ngang' + (tran.length ? ': ' + tran.join(', ') : ''));
    await browser.close();
  }

  console.log('\n7. File lưu từ bản Giai đoạn 1 đến 3');
  {
    /* Ban truoc Giai doan 4: dinhTinh la mang rong, tinhLai co truong khac */
    const cu = hoSo([2024, 2025], 'AR5', [0.6592, 0.6592], [10, 12]);
    cu.qc = []; cu.khongChacChan = { dinhTinh: [], dinhLuong: '' }; cu.tinhLai = { coHayKhong: null, lyDo: '', ketQuaCu: null, ketQuaMoi: null };
    const fCu = path.join(TMP, 'ban_cu.json'); fs.writeFileSync(fCu, JSON.stringify(cu));
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } })).newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    await nap(page, '#qt-load', fCu);
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
    await doiHash(page, 'buoc-6');
    await page.fill('[data-b="p|khongChacChan.dinhTinh.a"]', 'Nhận xét sau khi nạp file cũ');
    await doiHash(page, 'buoc-7');
    await page.check('input[data-b="p|tinhLai.tinhTrang"][value="kyDau"]');
    ok(await xongBuoc(page, 7), 'nạp file cũ rồi chọn kỳ đầu thì Bước 7 xong');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#qt-save')]);
    const f2 = path.join(TMP, 'ban_cu_luu_lai.json'); await dl.saveAs(f2);
    const j2 = JSON.parse(fs.readFileSync(f2, 'utf8'));
    ok(!Array.isArray(j2.khongChacChan.dinhTinh) && j2.khongChacChan.dinhTinh.a === 'Nhận xét sau khi nạp file cũ', 'nhận xét Bước 6 không mất khi lưu lại file cũ');
    ok(j2.tinhLai.tinhTrang === 'kyDau' && Array.isArray(j2.tinhLai.truongHop) && typeof j2.tinhLai.ketQuaCu === 'object' && j2.tinhLai.ketQuaCu !== null, 'Bước 7 dùng cấu trúc mới');
    await browser.close();
  }

  console.log('\n8. Lỗi console');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang' + (errors.length ? ': ' + errors.join(' | ') : ''));
  console.log('\nKết quả: ' + pass + ' đạt, ' + fail + ' trượt');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
