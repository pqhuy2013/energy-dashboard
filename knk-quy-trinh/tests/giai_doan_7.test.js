/* Kiem thu Giai doan 7: duong noi tu dashboard knk/ sang ung dung, the tren trang chu.

   Chay:  NODE_PATH=$(npm root -g) node tests/giai_doan_7.test.js

   Nut trong khung chi tiet co so cua knk/ tro toi dia chi GitHub Pages cua ung dung. Bo
   nay chuyen dia chi do sang index.html tren may (context.route) nen chay duoc truoc khi
   dang, va chan moi yeu cau mang khac. Bon truong hop cua ?phuluc=&stt=: ho so trong thi
   dien, trung co so thi mo lai buoc dang lam, co so khac thi khong ghi de, khong khop thi
   bao. Cuoi cung la the tren trang chu ../index.html. */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPO = path.resolve(ROOT, '..');
const QT = 'https://pqhuy2013.github.io/energy-dashboard/knk-quy-trinh/';
const APP_HTML = fs.readFileSync(process.env.QT_HTML || path.join(ROOT, 'index.html'));   /* QT_HTML: chay tren mot ban dong goi khac */
const SHOTS = process.env.QT_SHOTS || path.join(os.tmpdir(), 'qt-shots');
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  ĐẠT   ' + msg); } else { fail++; console.log('  TRƯỢT ' + msg); } }

/* danh muc co so nhung trong ung dung: [phu luc, bo, stt, ten, dia chi, ...] */
const CS = (function () {
  const s = APP_HTML.toString('utf-8'), i = s.indexOf('"cs":[['), j = s.indexOf(']]', i) + 2;
  return JSON.parse(s.slice(i + 5, j));
})();
const dong = (pl, stt) => CS.find(r => r[0] === pl && r[2] === stt);
const R15 = dong('II', 15), R16 = dong('II', 16), RXD = dong('III.B', 1);

const loi = [], ngoai = [];
async function moCtx(browser, opt) {
  const ctx = await browser.newContext(Object.assign({ acceptDownloads: true }, opt || {}));
  await ctx.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith('file:') || u.startsWith('data:') || u.startsWith('blob:')) return route.continue();
    if (u.startsWith(QT)) return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: APP_HTML });
    ngoai.push(u); return route.abort();
  });
  ctx.on('page', p => {
    p.on('console', m => { if (m.type() === 'error' && !/net::ERR_FAILED/.test(m.text())) loi.push(p.url() + ' console: ' + m.text()); });
    p.on('pageerror', e => loi.push(p.url() + ' pageerror: ' + e.message));
  });
  return ctx;
}
async function mo(page, q) { await page.goto(QT + q); await page.waitForSelector('#qt-menu .qt-mi'); await page.waitForTimeout(80); }
const truong = (page, f) => page.$eval(`#pane-buoc-0 [data-f="coSo.${f}"]`, e => e.value);
const viTri = page => page.evaluate(() => ({ search: location.search, hash: location.hash }));
const soLk = page => page.$$eval('#qt-tra .qt-lk', xs => xs.length);
const chuLk = page => page.$eval('#qt-tra .qt-lk', e => e.className + ' | ' + e.innerText);
const choLuu = page => page.waitForTimeout(700);   /* luu tam sau 400 ms */

(async () => {
  const browser = await chromium.launch();
  ok(R15 && R16 && RXD && R15[1] === 0 && R16[1] === 0 && RXD[1] !== 0, 'danh mục có II/15, II/16 (Công Thương) và III.B/1 (bộ khác)');

  /* ---------- 1. ho so trong: dien tu lien ket ---------- */
  console.log('1. Hồ sơ trống');
  const c1 = await moCtx(browser);
  const p1 = await c1.newPage();
  await mo(p1, '?phuluc=II&stt=15');
  let v = await viTri(p1);
  ok(v.search === '' && v.hash === '#buoc-0', 'bỏ tham số khỏi địa chỉ, mở Bước 0: ' + JSON.stringify(v));
  ok(await p1.$eval('#pane-buoc-0', e => e.classList.contains('on')), 'màn hình Bước 0 đang hiện');
  ok(await truong(p1, 'ten') === R15[3], 'điền tên cơ sở: ' + await truong(p1, 'ten'));
  ok(await truong(p1, 'diaChi') === R15[4], 'điền địa chỉ');
  ok(await truong(p1, 'phuLuc') === 'II' && await truong(p1, 'stt') === '15', 'điền phụ lục II, số thứ tự 15');
  ok(await p1.$eval('#f-bo', e => e.value) === 'Công Thương', 'điền bộ quản lý Công Thương');
  ok(await p1.$$eval('#qt-nhom .qt-radio.on', xs => xs.length) === 0, 'không tự chọn nhóm');
  ok(/qt-info/.test(await chuLk(p1)) && /Đã điền thông tin cơ sở theo liên kết/.test(await chuLk(p1)), 'thông báo đã điền theo liên kết');
  ok(await p1.$eval('#tra-q', e => e.value) === R15[3], 'ô tra cứu ghi tên cơ sở');
  ok(await p1.$eval('#tra-ct', e => !e.hidden && e.innerText.includes('Gợi ý')), 'khung chi tiết cơ sở hiện gợi ý nhóm');
  ok(await p1.$$eval('#tra-ct [data-act^="traNhom|"]', xs => xs.length) >= 1, 'có nút áp dụng nhóm');
  ok(await p1.$eval('#tra-kq button.on', e => e.innerText.includes('phốt pho vàng')), 'dòng kết quả của cơ sở được đánh dấu');
  await p1.click('#qt-en');
  ok(/filled in from the facility-list dashboard link/.test(await chuLk(p1)), 'đổi sang EN thì thông báo đổi theo');
  await p1.click('#qt-vi');
  await p1.setViewportSize({ width: 375, height: 800 });
  await p1.evaluate(() => window.scrollTo(0, 0));
  await p1.screenshot({ path: path.join(SHOTS, 'g7-dien-375.png') });
  await p1.setViewportSize({ width: 1280, height: 800 });
  await choLuu(p1);
  await p1.reload(); await p1.waitForSelector('#qt-menu .qt-mi');
  ok(await truong(p1, 'ten') === R15[3] && await soLk(p1) === 0, 'tải lại trang: hồ sơ còn, không điền lại, không còn thông báo');
  await mo(p1, '?phuluc=II&stt=15');
  await p1.fill('#tra-q', 'lao cai');
  ok(await soLk(p1) === 0, 'gõ tra cứu mới thì bỏ thông báo liên kết');

  /* ---------- 2. trung co so: mo lai buoc dang lam ---------- */
  console.log('2. Hồ sơ của chính cơ sở này');
  await p1.evaluate(() => { location.hash = 'buoc-2'; }); await p1.waitForTimeout(150);
  await mo(p1, '?phuluc=II&stt=015');
  v = await viTri(p1);
  ok(v.search === '' && v.hash === '#buoc-2', 'số thứ tự 015 vẫn khớp, mở lại Bước 2: ' + JSON.stringify(v));
  ok(await p1.$eval('#pane-buoc-2', e => e.classList.contains('on')), 'màn hình Bước 2 đang hiện');
  ok(/đã là của cơ sở này/.test(await p1.textContent('#qt-toast')), 'báo hồ sơ đã là của cơ sở này');
  ok(await soLk(p1) === 0 && await truong(p1, 'ten') === R15[3], 'không thông báo, hồ sơ giữ nguyên');

  /* ---------- 3. co so khac: khong ghi de ---------- */
  console.log('3. Hồ sơ của cơ sở khác');
  await mo(p1, '?phuluc=ii&stt=16&x=1');
  v = await viTri(p1);
  ok(v.search === '?x=1' && v.hash === '#buoc-0', 'phụ lục viết thường vẫn khớp, giữ tham số khác: ' + JSON.stringify(v));
  let lk = await chuLk(p1);
  ok(/qt-alert/.test(lk) && lk.includes(R15[3]) && /không ghi đè/.test(lk), 'cảnh báo nêu tên hồ sơ đang giữ');
  ok(await truong(p1, 'ten') === R15[3] && await truong(p1, 'stt') === '15', 'không ghi đè hồ sơ đang mở');
  ok(await p1.$eval('#tra-ct', e => !e.hidden && e.innerText.includes('Đông Nam Á Lào Cai')), 'khung chi tiết hiện cơ sở trong liên kết');
  await p1.setViewportSize({ width: 375, height: 800 });
  await p1.evaluate(() => window.scrollTo(0, 0));
  await p1.screenshot({ path: path.join(SHOTS, 'g7-khac-375.png') });
  await p1.setViewportSize({ width: 1280, height: 800 });
  await p1.click('[data-act="lkGiu"]');
  v = await viTri(p1);
  ok(v.hash === '#buoc-2' && await soLk(p1) === 0, 'Giữ hồ sơ đang mở: về Bước 2, bỏ cảnh báo');
  ok(await truong(p1, 'ten') === R15[3], 'hồ sơ vẫn là II/15');

  await mo(p1, '?phuluc=II&stt=16');
  await p1.click('[data-act="lkMoi"]');
  ok(await p1.$eval('#qt-confirm', e => !e.hidden), 'Lập hồ sơ mới: hỏi xác nhận trước');
  const nutXn = await p1.$$eval('#qt-confirm-acts button', xs => xs.map(x => x.textContent));
  ok(nutXn.includes('Tải về trước'), 'hộp xác nhận có nút tải hồ sơ đang mở về trước: ' + nutXn.join(', '));
  await p1.click('#qt-confirm-acts button:has-text("Bắt đầu kỳ mới")');
  await p1.waitForTimeout(100);
  ok(await truong(p1, 'ten') === R16[3] && await truong(p1, 'stt') === '16', 'hồ sơ mới điền cơ sở II/16');
  ok(/qt-info/.test(await chuLk(p1)), 'thông báo chuyển sang đã điền');
  ok((await viTri(p1)).hash === '#buoc-0', 'ở Bước 0');
  await choLuu(p1);

  await mo(p1, '?phuluc=II&stt=15');
  ok(/qt-alert/.test(await chuLk(p1)) && (await chuLk(p1)).includes(R16[3]), 'mở II/15 khi đang giữ II/16: cảnh báo');
  await p1.click('#tra-ct [data-act="traDien"]');
  ok(await truong(p1, 'ten') === R15[3] && await soLk(p1) === 0, 'tự bấm Điền thông tin từ danh mục: điền, bỏ cảnh báo');
  await c1.close();

  /* ---------- 4. khong khop ---------- */
  console.log('4. Không khớp danh mục');
  const c2 = await moCtx(browser);
  const p2 = await c2.newPage();
  await mo(p2, '?phuluc=II&stt=99999');
  lk = await chuLk(p2);
  ok(/qt-alert/.test(lk) && lk.includes('Phụ lục II, số thứ tự 99999'), 'báo không có dòng II/99999');
  ok(await truong(p2, 'ten') === '' && (await viTri(p2)).search === '', 'hồ sơ trống, bỏ tham số');
  await mo(p2, '?phuluc=IV');
  ok((await chuLk(p2)).includes('số thứ tự …'), 'thiếu số thứ tự thì ghi dấu …');
  await mo(p2, '?stt=15');
  ok(await truong(p2, 'ten') === '' && (await chuLk(p2)).includes('Phụ lục …'), 'thiếu phụ lục thì không điền');
  await mo(p2, '');
  ok(await soLk(p2) === 0 && (await viTri(p2)).hash === '', 'không tham số: không thông báo, không đổi màn hình');
  ok(await p2.evaluate(() => localStorage.getItem('knk-quy-trinh/v1')) === null, 'không khớp thì không lưu gì');
  await c2.close();

  /* ---------- 5. dashboard knk/: nut mo ung dung ---------- */
  console.log('5. Nút trong dashboard knk/');
  const c3 = await moCtx(browser);
  const p3 = await c3.newPage();
  await p3.goto('file://' + path.join(REPO, 'knk', 'index.html'));
  await p3.click('[data-tab="tc"]');
  await p3.fill('#f-q', 'phot pho vang');
  await p3.click('#tb-cs tr[data-k="II|15"]');
  const a = await p3.$('#det-qt');
  ok(!!a, 'cơ sở Công Thương có nút mở ứng dụng quy trình');
  ok(a && await a.getAttribute('href') === QT + '?phuluc=II&stt=15', 'href: ' + (a && await a.getAttribute('href')));
  ok(a && await a.getAttribute('target') === '_blank' && /noopener/.test(await a.getAttribute('rel')), 'mở tab mới, rel=noopener');
  ok(a && /Mở ứng dụng quy trình/.test(await a.innerText()), 'nhãn tiếng Việt');
  await p3.screenshot({ path: path.join(SHOTS, 'g7-knk-chitiet.png') });
  const [pop] = await Promise.all([c3.waitForEvent('page'), p3.click('#det-qt')]);
  await pop.waitForSelector('#qt-menu .qt-mi'); await pop.waitForTimeout(80);
  ok(await truong(pop, 'ten') === R15[3] && (await viTri(pop)).hash === '#buoc-0', 'bấm nút: ứng dụng mở với cơ sở II/15 đã điền');
  await pop.close();
  await p3.click('#knk-en');
  ok(/Open the procedure app/.test(await p3.innerText('#det-qt')), 'nhãn tiếng Anh sau khi đổi ngôn ngữ');
  await p3.click('#knk-vi');
  /* co so nganh thep khong co ten trong QD 699: nhan nhom va chu thich theo diem c, giong ung dung */
  await p3.fill('#f-q', 'thep viet nga');
  await p3.click('#tb-cs tr[data-k="II|62"]');
  const nv = await p3.$eval('#det-cs', e => e.innerText);
  ok(/Nhóm B hoặc nhóm A, tùy cơ sở có thuộc điểm c hay không/.test(nv) && !/Nhóm B hoặc C/.test(nv), 'ngành hạn ngạch, không có trong QĐ 699: nhãn nhóm B hoặc nhóm A');
  ok(/Điểm c khoản 4 Điều 11/.test(nv) && /không nêu điều kiện phải có tên trong Quyết định 699/.test(nv) && /chỉ áp dụng cho cơ sở được phân bổ hạn ngạch/.test(nv) && /Không thuộc, ví dụ chỉ đúc hoặc gia công sản phẩm thép, thì theo nghĩa vụ nhóm A/.test(nv), 'chú thích nêu điểm c, nhóm A chỉ khi không thuộc điểm c');
  await p3.$eval('.knk-old', e => e.scrollIntoView({ block: 'center' }));
  await p3.screenshot({ path: path.join(SHOTS, 'g7-knk-diemc.png') });
  await p3.click('#knk-en');
  ok(/Group B or group A, depending on whether point c applies/.test(await p3.$eval('#det-cs', e => e.innerText)), 'nhãn tiếng Anh theo điểm c');
  await p3.click('#knk-vi');
  await p3.fill('#f-q', 'vat lieu xay dung cao bang');
  await p3.click('#tb-cs tr[data-k="III.B|1"]');
  ok(await p3.$$eval('#det-qt', xs => xs.length) === 0, 'cơ sở ngành Xây dựng không có nút');
  await p3.setViewportSize({ width: 375, height: 800 });
  await p3.fill('#f-q', 'phot pho vang');
  await p3.click('#tb-cs tr[data-k="II|15"]');
  await p3.$eval('#det-qt', e => e.scrollIntoView({ block: 'center' }));
  const bx = await p3.$eval('#det-qt', e => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, w: document.documentElement.clientWidth }; });
  ok(bx.l >= 0 && bx.r <= bx.w, 'khổ 375 px: nút nằm trọn trong màn hình ' + JSON.stringify(bx));
  await p3.screenshot({ path: path.join(SHOTS, 'g7-knk-375.png') });
  await c3.close();

  /* ---------- 6. the tren trang chu ---------- */
  console.log('6. Thẻ trên trang chủ');
  const c4 = await moCtx(browser);
  const p4 = await c4.newPage();
  await p4.goto('file://' + path.join(REPO, 'index.html'));
  const the = await p4.$('a.dcard[href="knk-quy-trinh/"]');
  ok(!!the, 'có thẻ trỏ tới knk-quy-trinh/');
  ok(fs.existsSync(path.join(REPO, 'knk-quy-trinh', 'index.html')), 'đích của thẻ có index.html');
  const anh = the && await the.$eval('img', e => ({ w: e.naturalWidth, h: e.naturalHeight, alt: e.alt, src: e.getAttribute('src') }));
  ok(anh && anh.w === 1200 && anh.h === 750 && anh.alt, 'ảnh xem trước 1200x750 có alt: ' + JSON.stringify(anh));
  ok(the && await the.evaluate(e => e.closest('.topic').querySelector('h2').textContent) === 'Chính sách năng lượng', 'thẻ nằm trong nhóm Chính sách năng lượng');
  ok(the && await the.evaluate(e => e.previousElementSibling && e.previousElementSibling.getAttribute('href')) === 'knk/', 'thẻ đứng ngay sau thẻ Kiểm kê khí nhà kính');
  if (the) { await the.scrollIntoViewIfNeeded(); await the.screenshot({ path: path.join(SHOTS, 'g7-hub.png') }); }
  await c4.close();

  await browser.close();
  const ngoaiApp = ngoai.filter(u => !/fonts\.(googleapis|gstatic)\.com/.test(u));
  ok(ngoaiApp.length === 0, 'không yêu cầu mạng ra ngoài ngoài phông chữ của trang chủ: ' + ngoaiApp.slice(0, 3).join(' '));
  ok(loi.length === 0, 'không lỗi console: ' + loi.slice(0, 3).join(' | '));
  console.log(`\nKết quả: ${pass} đạt, ${fail} trượt. Ảnh: ${SHOTS}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
