/* Kiem thu nghiem thu Giai doan 1, chay tren ban da dong goi knk-quy-trinh/index.html.

   Chay:  NODE_PATH=$(npm root -g) node tests/giai_doan_1.test.js
   Can goi playwright (npm i -g playwright) va Chromium. Anh chup man hinh luu vao
   thu muc QT_SHOTS, mac dinh la <tmp>/qt-shots.

   Nghiem thu theo ke hoach: nhap thong tin co so o Buoc 0, tai file .json ve,
   dong trinh duyet, mo lai, nap file, thay dung so lieu cu. Chay thu ca khi bo nho
   cuc bo bi chan, ung dung khong van loi. */
'use strict';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-test-'));
const SHOTS = process.env.QT_SHOTS || path.join(os.tmpdir(), 'qt-shots');
fs.mkdirSync(SHOTS, { recursive: true });
const BUILD = (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/window\.__QT_BUILD__="(\d{4}-\d{2}-\d{2})"/) || [])[1];

/* So lieu gia dinh de thu, khong phai co so that */
const MAU = {
  ten: 'Công ty Cổ phần Thử nghiệm Đông Á',
  diaChi: 'Số 1 đường Thử Nghiệm, phường Thử, Thành phố Hà Nội',
  tinh: 'Thành phố Hà Nội',
  mst: '0100000000-001',
  gpso: '0100000000',
  gpngay: '2010-05-17',
  gpnoi: 'Sở Kế hoạch và Đầu tư Hà Nội',
  pl: 'II',
  stt: '15',
  dd: 'Nguyễn Văn Thử',
  cv: 'Giám đốc',
  lv: 'Sản xuất phôi thép từ thép phế liệu, công suất 500.000 tấn/năm'
};

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  ĐẠT   ' + msg); } else { fail++; console.log('  TRƯỢT ' + msg); } }

function serve(files) {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = decodeURIComponent(req.url.split('?')[0]);
      const f = files(p);
      if (!f || !fs.existsSync(f)) { rsp.writeHead(404); rsp.end('not found'); return; }
      rsp.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' });
      fs.createReadStream(f).pipe(rsp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

function theoDoiLoi(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}

async function dienBuoc0(page) {
  await page.check('input[name=nhom][value=B]');
  await page.selectOption('#f-ky', '2024-2025');
  await page.fill('#f-ten', MAU.ten);
  await page.fill('#f-diachi', MAU.diaChi);
  await page.selectOption('#f-tinh', MAU.tinh);
  await page.fill('#f-mst', MAU.mst);
  await page.fill('#f-gpso', MAU.gpso);
  await page.fill('#f-gpngay', MAU.gpngay);
  await page.fill('#f-gpnoi', MAU.gpnoi);
  await page.fill('#f-pl', MAU.pl);
  await page.fill('#f-stt', MAU.stt);
  await page.fill('#f-dd', MAU.dd);
  await page.fill('#f-cv', MAU.cv);
  await page.fill('#f-lv', MAU.lv);
}

async function docBuoc0(page) {
  return page.evaluate(() => {
    const v = id => document.getElementById(id).value;
    const r = document.querySelector('input[name=nhom]:checked');
    return { nhom: r ? r.value : '', ky: v('f-ky'), ten: v('f-ten'), diaChi: v('f-diachi'), tinh: v('f-tinh'), mst: v('f-mst'),
      gpso: v('f-gpso'), gpngay: v('f-gpngay'), gpnoi: v('f-gpnoi'), bo: v('f-bo'), pl: v('f-pl'), stt: v('f-stt'),
      dd: v('f-dd'), cv: v('f-cv'), lv: v('f-lv') };
  });
}
function khopMau(b) {
  return b.nhom === 'B' && b.ky === '2024-2025' && b.ten === MAU.ten && b.diaChi === MAU.diaChi && b.tinh === MAU.tinh &&
    b.mst === MAU.mst && b.gpso === MAU.gpso && b.gpngay === MAU.gpngay && b.gpnoi === MAU.gpnoi && b.bo === 'Công Thương' &&
    b.pl === MAU.pl && b.stt === MAU.stt && b.dd === MAU.dd && b.cv === MAU.cv && b.lv === MAU.lv;
}
const paneOn = (page, id) => page.evaluate(i => document.getElementById('pane-' + i).classList.contains('on'), id);
const text = (page, sel) => page.textContent(sel);

async function napFile(page, trigger, file) {
  const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click(trigger)]);
  await fc.setFiles(file);
}
/* FileReader chay bat dong bo: cho thong bao loi xuat hien, toi da 3 giay */
async function choLoi(page, doan) {
  try {
    await page.waitForFunction(d => { const e = document.getElementById('qt-err'); return !e.hidden && e.textContent.includes(d); }, doan, { timeout: 3000 });
    return true;
  } catch (e) { return false; }
}

(async () => {
  const srvA = await serve(p => path.join(ROOT, p === '/' ? 'index.html' : p));
  const portA = srvA.address().port;
  const URL = 'http://127.0.0.1:' + portA + '/index.html';
  const hostHtml = path.join(TMP, 'host.html');
  fs.writeFileSync(hostHtml, '<!doctype html><meta charset="utf-8"><title>WordPress giả lập</title><h1>Trang nhúng</h1><iframe id="f" src="' + URL + '" style="width:1200px;height:820px;border:1px solid #999"></iframe>');
  const srvB = await serve(p => (p === '/host.html' ? hostHtml : null));
  const HOST = 'http://localhost:' + srvB.address().port + '/host.html';
  const errors = [];
  let jsonFile;

  console.log('Bản dựng: ' + BUILD + '   Ảnh chụp: ' + SHOTS);

  /* ---------- 1. Nhập Bước 0, lưu tạm, tải file .json ---------- */
  console.log('\n1. Nhập Bước 0 và tải file .json');
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    ok(await paneOn(page, 'dau'), 'mở trang thấy màn hình mở');
    ok(await page.isHidden('#qt-c-resume'), 'chưa có phiên lưu tạm thì không hiện nút Tiếp tục');
    ok(await page.isHidden('#qt-full'), 'mở thẳng, không trong khung nhúng, thì ẩn nút Mở toàn màn hình');
    ok((await text(page, '#qt-build')).includes('26/9/2026') || !BUILD, 'chân thanh bên hiện ngày dựng lấy từ hằng số dựng');
    ok((await page.$$('#qt-menu .qt-mi')).length === 9, 'thanh bên có 9 màn hình');
    await page.screenshot({ path: path.join(SHOTS, '01_man_hinh_mo.png'), fullPage: true });

    await page.click('#qt-new');
    ok(await paneOn(page, 'buoc-0'), 'Bắt đầu kỳ mới chuyển sang Bước 0');
    ok((await text(page, '#qt-strip-msg')).includes('Hồ sơ trống'), 'dòng nhắc cố định hiện ngay từ đầu');
    ok(await page.isVisible('#qt-b0-miss'), 'Bước 0 trống thì liệt kê mục còn thiếu');
    await dienBuoc0(page);
    ok(await page.evaluate(() => document.querySelector('#qt-menu .qt-mi').classList.contains('xong')), 'đủ thông tin bắt buộc thì Bước 0 có dấu hoàn thành');
    ok((await text(page, '#qt-title-preview')).includes('cho năm 2024 và năm 2025'), 'tiêu đề Mẫu số 06 điền cả hai năm của kỳ');
    ok(await page.evaluate(() => document.getElementById('qt-strip').classList.contains('qt-dirty')), 'có thay đổi chưa tải về thì dòng nhắc chuyển màu cảnh báo');
    ok((await text(page, '#w-mst')) === '', 'mã số thuế 10 số kèm 3 số đơn vị phụ thuộc không bị cảnh báo');
    await page.waitForTimeout(700);
    const luuTam = await page.evaluate(() => { try { return JSON.parse(localStorage.getItem('knk-quy-trinh/v1')); } catch (e) { return null; } });
    ok(luuTam && luuTam.coSo && luuTam.coSo.ten === MAU.ten, 'tự lưu tạm vào localStorage sau khi sửa');
    await page.screenshot({ path: path.join(SHOTS, '02_buoc_0_da_dien.png'), fullPage: true });

    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#qt-save')]);
    const name = dl.suggestedFilename();
    ok(/^KNK_cong-ty-co-phan-thu-nghiem-dong-a_2024-2025_\d{8}-\d{4}\.json$/.test(name), 'tên file tải về có tên cơ sở không dấu và kỳ: ' + name);
    jsonFile = path.join(TMP, name);
    await dl.saveAs(jsonFile);
    const o = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
    ok(o.phienBan === 1, 'file có phienBan = 1');
    ok(o.taoBoi && o.taoBoi.ungDung === 'knk-quy-trinh' && o.taoBoi.banDung === BUILD, 'file ghi ứng dụng và ngày dựng tạo ra nó');
    ok(o.coSo.ten === MAU.ten && o.coSo.nhom === 'B' && o.coSo.maSoThue === MAU.mst && o.coSo.tinh === MAU.tinh && o.coSo.boQuanLy === 'Công Thương', 'file giữ đúng thông tin cơ sở');
    ok(o.coSo.giayPhep.ngayCap === MAU.gpngay && o.coSo.daiDien.hoTen === MAU.dd && o.coSo.linhVuc === MAU.lv, 'file giữ giấy phép, người đại diện, lĩnh vực');
    ok(o.ky.namBatDau === 2024 && o.ky.namKetThuc === 2025, 'kỳ lưu dạng số, 2024 và 2025');
    ok(Array.isArray(o.nguon) && Array.isArray(o.soLieu) && Array.isArray(o.heSo) && Array.isArray(o.qc), 'đủ các mảng của mô hình dữ liệu');
    ok(!('ketQua' in o) && !('tongPhatThai' in o), 'file không lưu kết quả tính toán');
    ok(!(await page.evaluate(() => document.getElementById('qt-strip').classList.contains('qt-dirty'))) && (await text(page, '#qt-strip-msg')).includes('Đã tải file về'), 'tải xong thì dòng nhắc ghi đã tải về');

    await page.reload();
    ok(await paneOn(page, 'buoc-0') && khopMau(await docBuoc0(page)), 'tải lại trang thì ở nguyên Bước 0, đủ số liệu từ lưu tạm');
    await page.goto(URL);
    ok(await paneOn(page, 'dau'), 'mở lại địa chỉ gốc thì về màn hình mở');
    ok(await page.isVisible('#qt-c-resume') && (await text(page, '#qt-resume-info')).includes(MAU.ten), 'màn hình mở có nút Tiếp tục kèm tên cơ sở');
    await page.click('#qt-resume');
    ok(await paneOn(page, 'buoc-0') && khopMau(await docBuoc0(page)), 'Tiếp tục về đúng bước đang làm, đủ số liệu từ lưu tạm');
    await browser.close();
  }

  /* ---------- 2. Đóng trình duyệt, mở lại, nạp file ---------- */
  console.log('\n2. Đóng trình duyệt, mở lại, nạp file .json');
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage(); theoDoiLoi(page, errors);
    await page.goto(URL);
    ok(await page.isHidden('#qt-c-resume'), 'trình duyệt mới không có phiên lưu tạm');
    await napFile(page, '#qt-load', jsonFile);
    ok(await paneOn(page, 'buoc-0'), 'nạp xong chuyển sang Bước 0');
    ok(khopMau(await docBuoc0(page)), 'nạp file thấy đúng toàn bộ số liệu cũ');
    ok((await text(page, '#qt-strip-msg')).includes('Đang làm trên file'), 'dòng nhắc ghi tên file đang làm');
    await page.screenshot({ path: path.join(SHOTS, '03_nap_lai_file.png'), fullPage: true });

    const bad = path.join(TMP, 'hong.json'); fs.writeFileSync(bad, 'đây không phải JSON');
    await napFile(page, '#qt-open', bad);
    ok(await choLoi(page, 'không phải JSON hợp lệ'), 'file hỏng thì báo lỗi rõ');
    ok((await docBuoc0(page)).ten === MAU.ten, 'file hỏng không làm mất số liệu đang có');
    const newer = path.join(TMP, 'moi_hon.json'); fs.writeFileSync(newer, JSON.stringify({ phienBan: 99, coSo: {} }));
    await napFile(page, '#qt-open', newer);
    ok(await choLoi(page, 'phiên bản mới hơn'), 'file của phiên bản mới hơn thì từ chối, nói rõ lý do');
    const other = path.join(TMP, 'khac.json'); fs.writeFileSync(other, JSON.stringify({ foo: 1 }));
    await napFile(page, '#qt-open', other);
    ok(await choLoi(page, 'không phải dữ liệu của ứng dụng này'), 'file JSON khác loại thì từ chối');
    ok((await docBuoc0(page)).ten === MAU.ten, 'sau ba lần nạp hỏng số liệu vẫn nguyên');

    await page.click('#qt-en');
    ok((await text(page, '#qt-title')) === 'Step 0. Facility information' && (await text(page, 'label[for=f-ten] span')) === 'Facility name', 'chuyển sang tiếng Anh');
    ok(await page.evaluate(() => document.documentElement.lang) === 'en', 'thuộc tính lang đổi theo');
    ok(khopMau(await docBuoc0(page)), 'đổi ngôn ngữ không làm mất số liệu hay lựa chọn');
    await page.screenshot({ path: path.join(SHOTS, '04_buoc_0_tieng_anh.png'), fullPage: true });
    await page.click('#qt-vi');
    ok((await text(page, '#qt-title')) === 'Bước 0. Thông tin cơ sở', 'chuyển lại tiếng Việt');

    await page.fill('#f-ten', MAU.ten + ' sửa');
    await page.click('#qt-home');
    await page.click('#qt-new');
    ok(await page.isVisible('#qt-confirm') && (await text(page, '#qt-confirm-msg')).includes('chưa tải về'), 'bắt đầu kỳ mới khi còn thay đổi chưa tải về thì hỏi lại ngay trên trang');
    await page.click('#qt-confirm-acts button:has-text("Hủy")');
    ok((await docBuoc0(page)).ten === MAU.ten + ' sửa', 'bấm Hủy thì giữ nguyên hồ sơ');
    await page.click('#qt-new');
    await page.click('#qt-confirm-acts button:has-text("Bắt đầu kỳ mới")');
    ok((await docBuoc0(page)).ten === '' && await paneOn(page, 'buoc-0'), 'xác nhận thì mở hồ sơ trống');
    await browser.close();
  }

  /* ---------- 3. Bộ nhớ cục bộ bị chặn ---------- */
  console.log('\n3. Bộ nhớ cục bộ bị chặn');
  {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('The operation is insecure.', 'SecurityError'); } });
    });
    const page = await ctx.newPage();
    const errs = []; theoDoiLoi(page, errs);
    await page.goto(URL);
    ok(await page.isVisible('#qt-home-nostore'), 'màn hình mở báo trình duyệt đang chặn lưu tạm');
    ok((await text(page, '#qt-store-state')).includes('không dùng được'), 'chân thanh bên ghi lưu tạm không dùng được');
    await page.click('#qt-new');
    await dienBuoc0(page);
    await page.click('#qt-menu .qt-mi:nth-child(2)');
    await page.click('#qt-menu .qt-mi:nth-child(1)');
    ok(khopMau(await docBuoc0(page)), 'vẫn nhập và đi lại giữa các bước bình thường');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#qt-save')]);
    const f = path.join(TMP, 'chan_' + dl.suggestedFilename()); await dl.saveAs(f);
    ok(JSON.parse(fs.readFileSync(f, 'utf8')).coSo.ten === MAU.ten, 'vẫn tải được file .json đúng số liệu');
    await napFile(page, '#qt-open', jsonFile);
    ok(khopMau(await docBuoc0(page)), 'vẫn nạp được file .json');
    await page.click('#qt-en'); await page.click('#qt-vi');
    ok(errs.length === 0, 'không có lỗi JavaScript nào khi bộ nhớ bị chặn' + (errs.length ? ': ' + errs.join(' | ') : ''));
    await page.screenshot({ path: path.join(SHOTS, '05_bo_nho_bi_chan.png'), fullPage: true });
    errors.push(...errs);
    await browser.close();
  }

  /* ---------- 4. Nhúng trong trang khác nguồn gốc ---------- */
  console.log('\n4. Nhúng trong iframe khác nguồn gốc');
  {
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ viewport: { width: 1300, height: 950 } })).newPage();
    theoDoiLoi(page, errors);
    await page.goto(HOST);
    const fr = page.frame({ url: URL });
    await fr.waitForSelector('#qt-frame');
    ok(await fr.isVisible('#qt-frame'), 'trong khung nhúng thì hiện dòng gợi ý mở toàn màn hình');
    ok(await fr.isVisible('#qt-full'), 'nút Mở toàn màn hình hiện và nổi bật');
    await page.screenshot({ path: path.join(SHOTS, '06_trong_iframe.png') });
    await browser.close();
  }

  /* ---------- 5. Khổ điện thoại ---------- */
  console.log('\n5. Khổ điện thoại 375 px');
  {
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })).newPage();
    theoDoiLoi(page, errors);
    await page.goto(URL);
    const tran = [];
    for (const id of ['dau', 'buoc-0', 'buoc-1', 'buoc-2', 'buoc-3', 'buoc-4', 'buoc-5', 'buoc-6', 'buoc-7', 'buoc-8']) {
      await page.evaluate(i => { location.hash = i; }, id);
      await page.waitForTimeout(60);
      const w = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      if (w[0] > w[1]) tran.push(id + ' ' + w[0] + '>' + w[1]);
    }
    ok(tran.length === 0, 'không màn hình nào tràn ngang' + (tran.length ? ': ' + tran.join(', ') : ''));
    await page.evaluate(() => { location.hash = 'dau'; });
    await page.screenshot({ path: path.join(SHOTS, '07_dien_thoai_man_hinh_mo.png'), fullPage: true });
    await page.evaluate(() => { location.hash = 'buoc-0'; });
    await page.screenshot({ path: path.join(SHOTS, '08_dien_thoai_buoc_0.png'), fullPage: true });
    await browser.close();
  }

  console.log('\n6. Lỗi console trên toàn bộ các lượt');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang' + (errors.length ? ': ' + errors.join(' | ') : ''));

  srvA.close(); srvB.close();
  console.log('\nKết quả: ' + pass + ' đạt, ' + fail + ' trượt');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
