/* Kiem thu hoi quy: file .docx (Mau so 06) va .xlsx (bang tinh) do Buoc 8 xuat ra.
   Chay tren ban da dong goi knk-quy-trinh/index.html.

   Chay:  NODE_PATH=$(npm root -g) node tests/hoi_quy_file.test.js
   Chay tren ban khac (vd ban truoc khi sua):  QT_URL=file:///duong/dan/index.html NODE_PATH=$(npm root -g) node tests/hoi_quy_file.test.js

   Moi muc giu mot loi da sua khong quay lai:
   1. Ho so day du: moi phan XML trong .docx va .xlsx doc duoc bang bo doc XML chat (xml.etree).
   2. Ky tu U+FFFE, U+FFFF va nua cap thay the dung le trong o chu (ten co so, ranh gioi, thiet bi,
      noi dung kiem soat...): bi bo khi ghi file, moi phan XML cua ca hai file van hop le,
      chu con lai giu nguyen, cap thay the dung (bieu tuong cam xuc) van giu.
   3. Bang 2.1 trong .docx: loai moi chat co thiet bi chua co so lieu nam do thi ghi
      "[Chưa đầy đủ: n thiết bị chưa có số liệu]" canh tong, khong in tong thieu nhu tong du.
   4. Nguon moi chat lanh chua ghi loai: Bang 2.1 van giu luong nap voi ten "[Chưa nhập: loại môi chất lạnh]",
      III.1 khong in " = 1.924" khong ten, o Khi o III.3 danh dau thieu; .xlsx van co dong nay.
   5. Cot bat buoc cua nguon (khai o Buoc 1) con trong trong bang III.2 thi ghi [Chưa nhập];
      thieu tong khoi luong hoi trong nam va thieu tham so cong thuc hoi thi danh dau.
   6. Bang 2.1 trong .xlsx cong theo ten dung chinh xac nhu ung dung (phan biet hoa thuong,
      * ? ~ khong la ky tu dai dien, chi bo khoang trang hai dau nen "R 22" va "R  22" la hai loai):
      LibreOffice tinh lai (tests/kiem_file.py) ra dung so man hinh.
   7. File .json co ky trung nam (2024-2024): .xlsx khong co hai trang tinh trung ten,
      mo va tinh lai duoc, cong thuc tinh lai khop gia tri ghi san.
   8. Chua chon bo GWP: trang Tong hop khong ghi CH4 = 0, N2O = 0; cac khi liet ke giong Buoc 4.
   Can python3 (zipfile, xml.etree), openpyxl va LibreOffice Calc cho muc 6 va 7. Ho so thu, so gia dinh. */
'use strict';
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const URL = process.env.QT_URL || 'file://' + path.join(ROOT, 'index.html');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'qt-hoiquy-file-'));
const SHOTS = process.env.QT_SHOTS || path.join(os.tmpdir(), 'qt-shots');
fs.mkdirSync(SHOTS, { recursive: true });

let pass = 0, fail = 0;
function ok(cond, msg) { if (cond) { pass++; console.log('  ĐẠT   ' + msg); } else { fail++; console.log('  TRƯỢT ' + msg); } }
function theoDoiLoi(page, bag) {
  page.on('console', m => { if (m.type() === 'error') bag.push('console: ' + m.text()); });
  page.on('pageerror', e => bag.push('pageerror: ' + e.message));
}
const doiHash = (page, h) => page.evaluate(x => { location.hash = x; }, h);
const cho = ms => new Promise(r => setTimeout(r, ms));
/* chi so duoi trong .docx la chu so thuong dinh dang chi so duoi */
const sub = s => s.replace(/[₀-₉]/g, c => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c)));
/* so kieu Viet Nam (1.234,5) ra so */
const soVN = s => { const t = String(s == null ? '' : s).trim(); return t === '' ? null : Number(t.replace(/\./g, '').replace(',', '.')); };
const gan = (a, b) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));

/* ---- doc .docx/.xlsx bang python: moi phan XML qua bo doc chat, than van ban, o bang tinh ---- */
const PY = String.raw`
import json, re, sys, zipfile
import xml.etree.ElementTree as ET
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
S = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
RL = '{http://schemas.openxmlformats.org/package/2006/relationships}'
RID = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
f = sys.argv[1]
z = zipfile.ZipFile(f)
out = {'parts': z.namelist(), 'loiXml': [], 'fffd': [], 'xml': {}}
cay = {}
for n in z.namelist():
    if not (n.endswith('.xml') or n.endswith('.rels')):
        continue
    b = z.read(n)
    if '�' in b.decode('utf-8', 'replace'):
        out['fffd'].append(n)
    try:
        cay[n] = ET.fromstring(b)
    except Exception as e:
        out['loiXml'].append([n, str(e)])
def runs(el):
    x, h = '', ''
    for r in el.iter(W + 'r'):
        t = ''.join(q.text or '' for q in r.iter(W + 't'))
        x += t
        if r.find(W + 'rPr/' + W + 'highlight') is not None:
            h += t
    return {'x': x, 'h': h}
if 'word/document.xml' in cay:
    body = cay['word/document.xml'].find(W + 'body')
    than = []
    for el in body:
        if el.tag == W + 'p':
            than.append(dict(runs(el), k='p'))
        elif el.tag == W + 'tbl':
            than.append({'k': 't', 'rows': [[runs(tc) for tc in tr.findall(W + 'tc')] for tr in el.findall(W + 'tr')]})
    out['docx'] = than
if 'docProps/core.xml' in cay:
    out['core'] = ''.join(cay['docProps/core.xml'].itertext())
if 'xl/workbook.xml' in z.namelist():
    ss = []
    if 'xl/sharedStrings.xml' in cay:
        ss = [''.join(t.text or '' for t in si.iter(S + 't')) for si in cay['xl/sharedStrings.xml'].iter(S + 'si')]
    wb = re.findall(r'<sheet [^>]*name="([^"]*)"', z.read('xl/workbook.xml').decode('utf-8', 'replace'))
    out['sheets'] = wb
    out['o'] = {}
    if 'xl/workbook.xml' in cay and 'xl/_rels/workbook.xml.rels' in cay:
        dich = {r.get('Id'): r.get('Target') for r in cay['xl/_rels/workbook.xml.rels'].iter(RL + 'Relationship')}
        for sh in cay['xl/workbook.xml'].iter(S + 'sheet'):
            p = 'xl/' + dich.get(sh.get(RID), '').lstrip('/').replace('xl/', '', 1)
            if p not in cay:
                continue
            o = {}
            for c in cay[p].iter(S + 'c'):
                fo = c.find(S + 'f'); v = c.find(S + 'v'); t = c.get('t')
                if t == 'inlineStr':
                    val = ''.join(q.text or '' for q in c.iter(S + 't'))
                elif t == 's' and v is not None:
                    val = ss[int(v.text)]
                elif v is not None and v.text is not None:
                    try: val = float(v.text)
                    except ValueError: val = v.text
                else:
                    val = None
                o[c.get('r')] = {'v': val, 'f': fo.text if fo is not None else None}
            if sh.get('name') not in out['o']:
                out['o'][sh.get('name')] = o
json.dump(out, sys.stdout, ensure_ascii=False)
`;
const fPy = path.join(TMP, 'doc_zip.py'); fs.writeFileSync(fPy, PY);
const docZip = f => JSON.parse(execFileSync('python3', [fPy, f], { maxBuffer: 64 << 20 }).toString('utf8'));
/* tests/kiem_file.py: xoa gia tri tinh san roi cho LibreOffice tinh lai; loi (vd openpyxl KeyError) tra ve null */
function tinhLai(xlsx) {
  try {
    const out = execFileSync('python3', [path.join(__dirname, 'kiem_file.py'), '-', xlsx, SHOTS, 'hoiquy'], { maxBuffer: 64 << 20, timeout: 600000, stdio: ['ignore', 'pipe', 'pipe'] });
    return JSON.parse(out.toString('utf8')).xlsx;
  } catch (e) { return { loi: String(e.stderr || e.message).trim().split('\n').pop() }; }
}

/* ---- tim trong than .docx ---- */
const khoiDoan = D => (D || []).filter(e => e.k === 'p');
/* bang ngay sau doan tieu de (bo qua doan rong); tra ve so dong, khong co thi [] */
function bangSau(D, tieu) {
  if (!D) return [];
  for (let i = 0; i < D.length; i++) {
    if (D[i].k === 'p' && D[i].x === tieu) {
      for (let j = i + 1; j < D.length; j++) { if (D[j].k === 't') return D[j].rows; if (D[j].x.trim()) break; }
    }
  }
  return [];
}
/* cac doan tu sau bang co tieu de den tieu de bang ke tiep */
function doanSauBang(D, tieu) {
  if (!D) return [];
  const i = D.findIndex(e => e.k === 'p' && e.x === tieu); if (i < 0) return [];
  let j = i + 1; while (j < D.length && D[j].k !== 't') j++;
  const kq = [];
  for (j++; j < D.length && D[j].k === 'p' && !/^(Bảng |Số liệu (?!dùng để tính)|\d\. )/.test(D[j].x); j++) kq.push(D[j]);
  return kq;
}
const dongBang = rows => rows.map(r => r.map(c => c.x).join(' | ')).join(' / ');
/* bang ket qua III.3 cua nam y: bang ngay sau tieu de "Bảng tổng hợp kết quả..." */
const bangKQ = (D, y) => bangSau(D, 'Bảng tổng hợp kết quả kiểm kê khí nhà kính năm ' + y);

/* ---- o .xlsx ---- */
function cotA(o) { const m = {}; for (const [r, c] of Object.entries(o || {})) { const x = /^A(\d+)$/.exec(r); if (x) m[+x[1]] = c.v; } return m; }
/* cac dong Bang 2.1 cua trang "Biểu năm y": [ten, o cong thuc] */
function bang21Xlsx(o) {
  const A = cotA(o); const kq = [];
  const dau = Object.keys(A).map(Number).find(r => String(A[r]).startsWith('Bảng 2.1.'));
  if (!dau) return kq;
  for (let r = dau + 2; o['A' + r] || o['B' + r]; r++) kq.push({ r, ten: o['B' + r] && o['B' + r].v, c: 'C' + r, v: o['C' + r] && o['C' + r].v, f: o['C' + r] && o['C' + r].f });
  return kq;
}

/* ---- ho so thu: du 7 loai nguon tinh duoc, them qua trinh cong nghiep khong co cong thuc ---- */
const NAM = [2024, 2025];
function hoSo() {
  const hs = [], sl = [];
  const ip = (id, k, v, dv, ts) => hs.push({ nguonId: id, khi: k, nam: null, giaTri: v, donVi: dv, bac: 'ipcc', nguonGoc: 'IPCC 2006, Tập 2, Bảng 2.2', thamSo: ts || {} });
  ip('cd1', 'CO2', 98300, 'kg CO2/TJ'); ip('cd1', 'CH4', 10, 'kg CH4/TJ'); ip('cd1', 'N2O', 1.5, 'kg N2O/TJ');
  ip('cd2', 'CO2', 74100, 'kg CO2/TJ'); ip('cd2', 'CH4', 3, 'kg CH4/TJ'); ip('cd2', 'N2O', 0.6, 'kg N2O/TJ');
  ip('dd1', 'CO2', 74100, 'kg CO2/TJ'); ip('dd1', 'CH4', 3.9, 'kg CH4/TJ'); ip('dd1', 'N2O', 3.9, 'kg N2O/TJ');
  hs.push({ nguonId: 'mc1', khi: 'GWP', nam: null, giaTri: 1924, donVi: '', bac: 'muc2', nguonGoc: 'IPCC AR5, giả định để kiểm thử' });
  NAM.forEach(y => hs.push({ nguonId: 'dn1', khi: 'CO2', nam: y, giaTri: 0.6592, donVi: 'tCO₂/MWh', bac: 'muc2', nguonGoc: 'Số giả định để kiểm thử' }));
  hs.push({ nguonId: 'h1', khi: 'CO2', nam: null, giaTri: 0.25, donVi: 'tCO₂/tấn hơi', bac: 'muc2', nguonGoc: 'Đơn vị cấp hơi cung cấp, giả định' });
  hs.push({ nguonId: 'h2', khi: 'CO2', nam: null, giaTri: null, donVi: '', bac: 'muc2', nguonGoc: 'Tự tính theo điểm 4', thamSo: { cachTinh: 'congThuc', hieuSuat: 85, efNhienLieu: 94600, efNguon: 'Quyết định 2626/QĐ-BTNMT, giả định' } });
  ip('pt1', 'CH4', 10, 'm³ CH₄/tấn', { cf: 0.67 });
  ip('cn1', 'CO2', 0.52, 't CO2/tấn clinker');
  const so = (id, i, gioTri, donVi, ct) => sl.push({ nguonId: id, nam: NAM[i], gioTri, donVi, nguonSoLieu: 'Hóa đơn', chungTu: 'HĐ-' + id + '-' + NAM[i], nguoiCungCap: 'Phòng vật tư', chiTiet: ct || {} });
  [0, 1].forEach(i => {
    so('cd1', i, [10, 12][i], 'TJ');
    so('cd2', i, [100, 110][i], 'tấn', { nhietTri: 0.0433 });
    so('dd1', i, [5000, 5500][i], 'lít', { nhietTri: 0.0000386, quangDuong: 20000 });
    so('mc1', i, [10, 12][i], 'kg', { luongNapGanNhat: 2, thoiGianNapGanNhat: NAM[i] + '-06-10' });
    so('dn1', i, [1000, 1100][i], 'MWh');
    so('h1', i, [500, 600][i], 'tấn', { apSuat: '8 bar', nhietDo: 175 });
    so('h2', i, null, 'tấn', { apSuat: '10 bar', nhietDo: 180, khoiLuongGio: 2, soGio: [4000, 4200][i], entanpi: 2800, tyLeNhienLieu: 'Than 100 %' });
    so('pt1', i, [100000, 110000][i], 'tấn', { ch4Dot: [50000, 60000][i], hieuSuatDot: 98 });
    so('cn1', i, [1000, 1100][i], 'tấn');
  });
  const dt = {}; ['a', 'b', 'c', 'd', 'dd', 'e'].forEach(k => { dt[k] = 'Nhận xét nội dung ' + k + ' của cơ sở.'; });
  return {
    phienBan: 1,
    coSo: { ten: 'Công ty Thử nghiệm File Xuất', diaChi: 'Số 1 đường Láng, Hà Nội', tinh: 'Thành phố Hà Nội', maSoThue: '0101234567', nhom: 'A', boQuanLy: 'Công Thương', phuLuc: 'II', stt: '15',
      giayPhep: { so: '0101234567', ngayCap: '2010-05-20', noiCap: 'Sở Kế hoạch và Đầu tư Hà Nội' }, daiDien: { hoTen: 'Nguyễn Văn An', chucVu: 'Tổng giám đốc' }, linhVuc: 'Sản xuất gạch ốp lát.' },
    ky: { namBatDau: 2024, namKetThuc: 2025 }, gwp: 'AR5',
    moTa: { ranhGioi: 'Toàn bộ nhà máy và mỏ than.', haTang: 'Lò hơi, xe tải, điều hòa.', heThongDuLieu: 'Phòng vật tư lưu hóa đơn.', phuongPhap: 'Bậc 1 theo IPCC.' },
    beHapThu: { coHayKhong: false }, loaiKhongCo: ['chatthai'],
    nguon: [
      { id: 'cd1', loai: 'codinh', phanLoai: 'than antraxit', thietBi: 'Lò hơi 1' },
      { id: 'cd2', loai: 'codinh', phanLoai: 'Dầu DO', thietBi: 'Máy phát dự phòng' },
      { id: 'dd1', loai: 'didong', phanLoai: 'Dầu diesel', thietBi: 'Xe tải Hino 29C-12345', thuocTinh: { loaiPhuongTien: 'Ô tô' } },
      { id: 'cn1', loai: 'congnghiep', phanLoai: 'Sản xuất clinker xi măng', thietBi: 'Lò quay', thuocTinh: { nguyenLieu: 'Clinker' } },
      { id: 'pt1', loai: 'phattan', phanLoai: 'Than', thietBi: 'Mỏ than Khe Chàm', viTri: 'Quảng Ninh', thuocTinh: { congNghe: 'hamlo' } },
      { id: 'mc1', loai: 'moichat', phanLoai: 'R410A', thietBi: 'Điều hòa Daikin FDY', viTri: 'Văn phòng', thuocTinh: { ngayBatDau: '2020-01-15', congSuatLanh: 24000, khoiLuongNapDay: 3.5 } },
      { id: 'dn1', loai: 'dien', phanLoai: 'Điện lưới', thietBi: 'Công tơ tổng' },
      { id: 'h1', loai: 'hoi', thietBi: 'Công ty Hơi A', phanLoai: 'Hơi bão hòa' },
      { id: 'h2', loai: 'hoi', thietBi: 'Công ty Hơi B', phanLoai: 'Hơi quá nhiệt' }
    ],
    soLieu: sl, heSo: hs,
    qc: [{ ma: 'ct1', noiDung: 'Đối chiếu số liệu nhập với chứng từ gốc', nguoiKiem: 'Trần Thị Kiểm', ngay: '2026-02-10', ketQua: 'dat', loiPhatHien: '', cachXuLy: '' }],
    khongChacChan: { dinhTinh: dt, dinhLuong: 'Giá trị U lấy theo IPCC 2006.', bangU: [{ nguonId: 'cd1', muc: '1', khi: 'CO2', uAd: 5, uEf: 3 }, { nguonId: 'dn1', muc: '3', khi: 'CO2', uAd: 2, uEf: 10 }] },
    tinhLai: { tinhTrang: 'khongDoi' }
  };
}
function ghi(ten, o) { const f = path.join(TMP, ten); fs.writeFileSync(f, JSON.stringify(o)); return f; }
/* them mot thiet bi lanh co GWP va so lieu cac nam cho truoc */
function themMc(o, id, phanLoai, kg) {
  o.nguon.push({ id, loai: 'moichat', phanLoai, thietBi: 'Máy lạnh ' + id, viTri: 'Kho', thuocTinh: {} });
  Object.keys(kg).forEach(y => o.soLieu.push({ nguonId: id, nam: +y, gioTri: kg[y], donVi: 'kg', nguonSoLieu: 'Hóa đơn', chungTu: 'x', chiTiet: {} }));
  o.heSo.push({ nguonId: id, khi: 'GWP', nam: null, giaTri: 2088, donVi: '', bac: 'muc2', nguonGoc: 'IPCC AR5' });
}

(async () => {
  const errors = [];
  console.log('Bản chạy: ' + URL);
  console.log('Ảnh chụp: ' + SHOTS);
  const browser = await chromium.launch();
  /* nap ho so vao trang moi, xuat .docx, .xlsx o Buoc 8; tra ve duong dan file (null neu khong tai duoc) */
  async function xuat(ten, file, them) {
    const bag = [];
    const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1360, height: 950 } });
    const page = await ctx.newPage(); theoDoiLoi(page, bag); page.setDefaultTimeout(10000);
    await page.goto(URL);
    const [fc] = await Promise.all([page.waitForEvent('filechooser'), page.click('#qt-load')]);
    await fc.setFiles(file);
    await page.waitForFunction(() => document.getElementById('pane-buoc-0').classList.contains('on'));
    const r = { page, ctx, bag };
    if (them) await them(page, r);
    await doiHash(page, 'buoc-8'); await cho(150);
    for (const [act, duoi] of [['xuatDocx', 'docx'], ['xuatXlsx', 'xlsx']]) {
      try {
        const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), page.click('[data-act="' + act + '"]')]);
        r[duoi] = path.join(TMP, ten + '.' + duoi); await dl.saveAs(r[duoi]);
      } catch (e) { r[duoi] = null; }
    }
    await ctx.close();
    errors.push(...bag);
    return r;
  }
  const loiXml = z => z.loiXml.map(x => x[0] + ': ' + x[1]).join('; ');

  console.log('\n1. Hồ sơ đầy đủ: mọi phần XML hợp lệ');
  {
    const r = await xuat('day_du', ghi('day_du.json', hoSo()));
    ok(r.docx && r.xlsx, 'Bước 8 tải về được cả .docx và .xlsx');
    const D = r.docx ? docZip(r.docx) : { loiXml: [['không có file', '']], parts: [] };
    const X = r.xlsx ? docZip(r.xlsx) : { loiXml: [['không có file', '']], parts: [] };
    ok(D.parts.length >= 8 && D.loiXml.length === 0, 'mọi phần XML của .docx đọc được bằng bộ đọc XML chặt (' + D.parts.length + ' phần)' + (D.loiXml.length ? ': ' + loiXml(D) : ''));
    ok(X.parts.length >= 10 && X.loiXml.length === 0, 'mọi phần XML của .xlsx đọc được bằng bộ đọc XML chặt (' + X.parts.length + ' phần)' + (X.loiXml.length ? ': ' + loiXml(X) : ''));
    ok(D.fffd.length === 0 && X.fffd.length === 0, 'không có ký tự thay thế � trong file');
    ok(X.sheets && new Set(X.sheets).size === X.sheets.length && X.sheets.includes('Biểu năm 2024') && X.sheets.includes('Biểu năm 2025'), 'tên trang tính không trùng: ' + (X.sheets || []).join(', '));
  }

  console.log('\n2. Ký tự XML 1.0 cấm: U+FFFE, U+FFFF, nửa cặp thay thế đứng lẻ');
  {
    const o = hoSo();
    o.coSo.ten = 'Công ty Ký￾ Tự Lạ';
    o.coSo.diaChi = 'Số 2\uDC00 phố Huế, Hà Nội';
    o.moTa.ranhGioi = 'Toàn bộ nhà máy￿ và mỏ than.';
    o.moTa.haTang = 'Lò hơi 😀 và xe tải\uD800.';
    o.nguon.find(n => n.id === 'cd1').thietBi = 'Lò hơi￾ số 1';
    o.nguon.find(n => n.id === 'mc1').viTri = 'Văn phòng\uD800';
    o.qc[0].noiDung = 'Đối chiếu￿ chứng từ gốc';
    const r = await xuat('ky_tu', ghi('ky_tu.json', o));
    ok(r.docx && r.xlsx, 'hồ sơ có ký tự cấm vẫn xuất được cả .docx và .xlsx');
    const D = r.docx ? docZip(r.docx) : { loiXml: [['không có file', '']], parts: [], fffd: [] };
    const X = r.xlsx ? docZip(r.xlsx) : { loiXml: [['không có file', '']], parts: [], fffd: [] };
    ok(D.loiXml.length === 0, '.docx: U+FFFE, U+FFFF bị bỏ, mọi phần XML (document.xml, core.xml...) vẫn hợp lệ' + (D.loiXml.length ? ': ' + loiXml(D).slice(0, 200) : ''));
    ok(X.loiXml.length === 0, '.xlsx: U+FFFE, U+FFFF bị bỏ, mọi trang tính vẫn là XML hợp lệ' + (X.loiXml.length ? ': ' + loiXml(X).slice(0, 200) : ''));
    const chuD = khoiDoan(D.docx).map(p => p.x).join('\n') + '\n' + (D.docx || []).filter(e => e.k === 't').map(e => dongBang(e.rows)).join('\n');
    ok(chuD.includes('Toàn bộ nhà máy và mỏ than.') && chuD.includes('Đối chiếu chứng từ gốc') && chuD.includes('Lò hơi số 1'), '.docx giữ phần chữ còn lại: "Toàn bộ nhà máy và mỏ than.", "Lò hơi số 1"');
    ok((D.core || '').includes('Công ty Ký Tự Lạ'), 'tiêu đề trong docProps/core.xml còn tên cơ sở, đã bỏ U+FFFE: "' + (D.core || '').slice(0, 60) + '"');
    ok(D.fffd.length === 0 && X.fffd.length === 0, 'nửa cặp thay thế đứng lẻ bị bỏ, không thành ký tự �' + (D.fffd.length + X.fffd.length ? ': ' + D.fffd.concat(X.fffd).join(', ') : ''));
    ok(chuD.includes('Lò hơi 😀 và xe tải.'), 'cặp thay thế đúng (biểu tượng cảm xúc) vẫn giữ trong .docx');
    const chuX = sh => X.o && X.o[sh] ? Object.values(X.o[sh]).map(c => c.v).join('\n') : '';
    ok(chuX('Thông tin').includes('Công ty Ký Tự Lạ') && chuX('Thông tin').includes('Số 2 phố Huế, Hà Nội') && chuX('Kiểm soát chất lượng').includes('Đối chiếu chứng từ gốc'),
      '.xlsx đọc được trang Thông tin và Kiểm soát chất lượng, còn tên, địa chỉ, nội dung kiểm soát đã bỏ ký tự cấm');
    ok(r.bag.filter(e => e.startsWith('pageerror')).length === 0, 'xuất file không có lỗi trang');
  }

  console.log('\n3. Bảng 2.1 (.docx): tổng thiếu thiết bị ghi rõ chưa đầy đủ');
  {
    const o = hoSo(); themMc(o, 'mc2', 'R410A', { 2024: 5 });
    const r = await xuat('mc_thieu', ghi('mc_thieu.json', o));
    const D = r.docx ? docZip(r.docx).docx : null;
    const b24 = bangSau(D, 'Bảng 2.1. Lượng môi chất lạnh nạp hàng năm, năm 2024');
    const b25 = bangSau(D, 'Bảng 2.1. Lượng môi chất lạnh nạp hàng năm, năm 2025');
    const d25 = b25.find(rw => rw[1] && rw[1].x === 'R410A');
    ok(d25 && d25[2].x === '12 [Chưa đầy đủ: 1 thiết bị chưa có số liệu]' && d25[2].h.includes('[Chưa đầy đủ: 1 thiết bị chưa có số liệu]'),
      'năm 2025: R410A có 1 thiết bị chưa có số liệu thì ghi "12 [Chưa đầy đủ: 1 thiết bị chưa có số liệu]", tô vàng: ' + (d25 ? d25[2].x : dongBang(b25)));
    const d24 = b24.find(rw => rw[1] && rw[1].x === 'R410A');
    ok(d24 && d24[2].x === '15' && !d24[2].h, 'năm 2024: đủ số liệu hai thiết bị thì ghi 15, không đánh dấu: ' + (d24 ? d24[2].x : dongBang(b24)));
  }

  console.log('\n4. Nguồn môi chất lạnh chưa ghi loại; 5. cột bắt buộc của nguồn còn trống');
  {
    const o = hoSo();
    ['cd1', 'dd1', 'mc1', 'dn1'].forEach(id => { o.nguon.find(n => n.id === id).phanLoai = ''; });
    o.nguon.find(n => n.id === 'dd1').thietBi = '';
    const r = await xuat('thieu_ten', ghi('thieu_ten.json', o));
    const Z = r.docx ? docZip(r.docx) : {}, D = Z.docx || null;
    const b21 = bangSau(D, 'Bảng 2.1. Lượng môi chất lạnh nạp hàng năm, năm 2024');
    const d = b21.find(rw => rw.length === 3 && rw[0].x === '1');
    ok(d && d[1].x === '[Chưa nhập: loại môi chất lạnh]' && d[1].h === d[1].x && d[2].x === '10',
      'Bảng 2.1 năm 2024 giữ 10 kg của thiết bị chưa ghi loại, tên ghi "[Chưa nhập: loại môi chất lạnh]" tô vàng: ' + (dongBang(b21) || 'không có bảng'));
    const P = khoiDoan(D).map(p => p.x);
    const gwp = P.find(p => p.includes('GWP của môi chất lạnh')) || '';
    ok(D && !/GWP của môi chất lạnh:\s*=/.test(gwp) && gwp.includes('GWP của môi chất lạnh: [Chưa nhập: loại môi chất lạnh] = 1.924.'),
      'III.1 không in "GWP của môi chất lạnh:  = 1.924", mà ghi "[Chưa nhập: loại môi chất lạnh] = 1.924": ' + gwp.slice(gwp.indexOf('GWP của'), gwp.indexOf('GWP của') + 70));
    const kq = bangKQ(D, 2024), dMc = kq.find(rw => rw[0] && /^Môi chất lạnh 1/.test(rw[0].x));
    ok(dMc && dMc.length === 9 && dMc[5].x === '[Chưa nhập: loại môi chất lạnh]' && dMc[5].h === dMc[5].x,
      'III.3 năm 2024: ô Khí của dòng môi chất lạnh chưa ghi loại là "[Chưa nhập: loại môi chất lạnh]" tô vàng: ' + (dMc ? dMc.map(c => c.x).join(' | ') : 'không có dòng'));
    const b11 = bangSau(D, 'Bảng 1.1. Nhiên liệu sử dụng trong quá trình đốt từ nguồn cố định, năm 2024');
    const d11 = b11.find(rw => rw[0].x === '1');
    ok(d11 && d11[1].x === '[Chưa nhập]' && d11[1].h === '[Chưa nhập]', 'Bảng 1.1: loại nhiên liệu chưa khai ở Bước 1 ghi [Chưa nhập] tô vàng, không để ô trống: ' + (d11 ? d11.map(c => c.x).join(' | ') : ''));
    const b12 = bangSau(D, 'Bảng 1.2. Nhiên liệu sử dụng trong quá trình đốt nhiêu liệu từ nguồn di động, năm 2024');
    const d12 = b12.find(rw => rw[0].x === '1');
    ok(d12 && d12[2].h === '[Chưa nhập]' && d12[3].h === '[Chưa nhập]', 'Bảng 1.2: thông tin phương tiện và loại nhiên liệu chưa khai ghi [Chưa nhập]: ' + (d12 ? d12.map(c => c.x).join(' | ') : ''));
    const b41 = bangSau(D, 'Bảng 4.1. Số liệu sử dụng điện, năm 2024');
    const d41 = b41.find(rw => rw[0].x === '1');
    ok(d41 && d41[2].h === '[Chưa nhập]', 'Bảng 4.1: nguồn sử dụng điện chưa khai ghi [Chưa nhập]: ' + (d41 ? d41.map(c => c.x).join(' | ') : ''));
    const X = r.xlsx ? docZip(r.xlsx) : {};
    const x21 = bang21Xlsx(X.o && X.o['Biểu năm 2024']);
    ok(x21.some(rw => rw.v === 10 && /chưa/i.test(String(rw.ten))), '.xlsx Bảng 2.1 năm 2024 cũng giữ 10 kg của thiết bị chưa ghi loại: ' + x21.map(rw => rw.ten + '=' + rw.v).join(', '));
  }

  console.log('\n5b. Hơi: thiếu tổng khối lượng hơi trong năm, thiếu tham số công thức');
  {
    const o = hoSo();
    o.soLieu = o.soLieu.filter(s => !(s.nguonId === 'h1' && s.nam === 2025));
    const ts = o.heSo.find(h => h.nguonId === 'h2').thamSo; ts.hieuSuat = null; ts.efNhienLieu = null;
    const r = await xuat('hoi_thieu', ghi('hoi_thieu.json', o));
    const D = r.docx ? docZip(r.docx).docx : null;
    const P = khoiDoan(D);
    const ct = P.find(p => p.x.includes('Công ty Hơi B') && p.x.includes('tự tính theo công thức điểm 4')) || { x: '', h: '' };
    ok(ct.h.includes('[Chưa nhập: hiệu suất lò hơi]') && sub(ct.h).includes(sub('[Chưa nhập: hệ số CO₂ của nhiên liệu]')) && !/lò hơi\s+%|lò hơi\s+kg/.test(ct.x),
      'III.1: thiếu hiệu suất lò hơi và hệ số CO₂ nhiên liệu thì ghi [Chưa nhập: ...] tô vàng, không in "lò hơi  %": ' + ct.x.slice(ct.x.indexOf('hiệu suất'), ct.x.indexOf('hiệu suất') + 110));
    const sau25 = doanSauBang(D, 'Bảng 4.2. Số liệu về sử dụng hơi, năm 2025');
    const gc = sau25.find(p => /\[Chưa nhập: tổng khối lượng hơi[^\]]*Công ty Hơi A\]/.test(p.h));
    ok(!!gc, 'Bảng 4.2 năm 2025: nguồn hơi chưa có tổng khối lượng hơi trong năm được đánh dấu [Chưa nhập: tổng khối lượng hơi ...] tô vàng: ' + (gc ? gc.x : sau25.map(p => p.x).join(' / ')));
    const sau24 = doanSauBang(D, 'Bảng 4.2. Số liệu về sử dụng hơi, năm 2024');
    ok(D && !sau24.some(p => /tổng khối lượng hơi/.test(p.x)), 'Bảng 4.2 năm 2024 đủ số liệu thì không có dòng đánh dấu thiếu');
  }

  console.log('\n6. Bảng 2.1 (.xlsx): cộng theo tên đúng chính xác như ứng dụng');
  {
    const o = hoSo();
    /* 'R 22' va 'R  22' (hai dau cach giua): ung dung chi bo khoang trang hai dau nen tach hai dong */
    const them = { R410a: 5, 'R22 ': 7, R22: 3, 'R4*': 100, 'R-32?': 11, 'R~22': 4, 'R 22': 2, 'R  22': 6 };
    Object.keys(them).forEach((k, i) => themMc(o, 'mx' + i, k, { 2024: them[k], 2025: them[k] + 1 }));
    const DK = { 2024: { R410A: 10, R410a: 5, R22: 10, 'R4*': 100, 'R-32?': 11, 'R~22': 4 }, 2025: { R410A: 12, R410a: 6, R22: 12, 'R4*': 101, 'R-32?': 12, 'R~22': 5 } };
    const DK2 = { 2024: { 'R 22': 2, 'R  22': 6 }, 2025: { 'R 22': 3, 'R  22': 7 } }, cach = [];
    const man = {};
    const r = await xuat('ten_mc', ghi('ten_mc.json', o), async page => {
      await doiHash(page, 'buoc-2');
      for (const y of NAM) {
        await page.click('[data-act="nam|' + y + '"]').catch(() => {});
        await cho(100);
        man[y] = await page.$$eval('[data-calc^="mc21|"][data-calc$="|' + y + '"]', es => es.map(e => [decodeURIComponent(e.getAttribute('data-calc').split('|')[1]), e.textContent]));
      }
    });
    const K = r.xlsx ? tinhLai(r.xlsx) : { loi: 'không có file' };
    ok(K && !K.loi && K.calc, 'LibreOffice mở được và tính lại .xlsx' + (K && K.loi ? ': ' + K.loi : ''));
    for (const y of NAM) {
      const mh = {}; (man[y] || []).forEach(([k, v]) => { mh[k] = soVN(v); });
      ok(Object.keys(DK[y]).every(k => gan(mh[k], DK[y][k])), 'Bước 2 năm ' + y + ' cộng đúng theo tên: ' + JSON.stringify(mh));
      const sh = 'Biểu năm ' + y;
      const rows = K && K.cells ? bang21Xlsx(Object.fromEntries(Object.entries(K.cells[sh] || {}).map(([ref, c]) => [ref, { v: c.v, f: c.f }]))) : [];
      const tinh = {}; rows.forEach(rw => { tinh[rw.ten] = K.calc && K.calc[sh] ? K.calc[sh][rw.c] : null; });
      ok(rows.length === 8 && Object.keys(DK[y]).every(k => gan(tinh[k], DK[y][k]) && gan(tinh[k], mh[k])),
        '.xlsx năm ' + y + ' sau khi LibreOffice tính lại khớp màn hình: R410A và R410a tách riêng, R4* và R-32? không là ký tự đại diện: ' + JSON.stringify(tinh));
      const chinh = rows.filter(rw => rw.ten in DK[y]);
      ok(chinh.length === 6 && chinh.every(rw => gan(rw.v, tinh[rw.ten])), '.xlsx năm ' + y + ': giá trị ghi sẵn của Bảng 2.1 bằng giá trị tính lại');
      Object.keys(DK2[y]).forEach(k => cach.push(y + ' "' + k + '" màn hình ' + mh[k] + ', ghi sẵn ' + (rows.find(rw => rw.ten === k) || {}).v + ', tính lại ' + tinh[k]));
      cach.ok = (cach.ok !== false) && Object.keys(DK2[y]).every(k => gan(mh[k], DK2[y][k]) && gan(tinh[k], DK2[y][k]));
    }
    ok(cach.ok, '.xlsx: tên có hai dấu cách ở giữa ("R 22", "R  22") là hai loại riêng như màn hình, tính lại không gộp: ' + cach.join('; '));
  }

  console.log('\n7. Kỳ trùng năm (2024-2024) trong file .json');
  {
    const o = hoSo(); o.ky = { namBatDau: 2024, namKetThuc: 2024 };
    const r = await xuat('mot_nam', ghi('mot_nam.json', o));
    ok(r.bag.filter(e => e.startsWith('pageerror')).length === 0, 'nạp và xuất không có lỗi trang');
    ok(!!r.xlsx, 'vẫn tải được .xlsx');
    const X = r.xlsx ? docZip(r.xlsx) : { sheets: [], loiXml: [] };
    ok(X.sheets.length > 0 && new Set(X.sheets).size === X.sheets.length, '.xlsx không có hai trang tính trùng tên: ' + X.sheets.join(', '));
    ok(X.loiXml.length === 0, 'mọi phần XML của .xlsx hợp lệ');
    const K = r.xlsx ? tinhLai(r.xlsx) : { loi: 'không có file' };
    ok(K && !K.loi && K.calc, 'openpyxl và LibreOffice mở được, tính lại được (kiem_file.py không lỗi)' + (K && K.loi ? ': ' + K.loi : ''));
    let n = 0; const lech = [];
    if (K && K.cells && K.calc) {
      for (const sh of K.sheets) for (const [ref, c] of Object.entries(K.cells[sh])) {
        if (!('f' in c)) continue; n++;
        const moi = K.calc[sh][ref];
        const khop = (typeof c.v === 'number' && typeof moi === 'number') ? gan(moi, c.v) : ((c.v == null || c.v === '') && (moi == null || moi === '' || moi === 0));
        if (!khop) lech.push(sh + '!' + ref + ' ' + c.v + ' / ' + moi);
      }
    }
    ok(K && K.calc && lech.length === 0, 'công thức tính lại khớp giá trị ghi sẵn (' + n + ' công thức)' + (lech.length ? ': ' + lech.slice(0, 4).join('; ') : ''));
  }

  console.log('\n8. Chưa chọn bộ GWP: trang Tổng hợp');
  {
    const o = hoSo(); o.gwp = null;
    let khiMH = [];
    const r = await xuat('chua_gwp', ghi('chua_gwp.json', o), async page => {
      await doiHash(page, 'buoc-4'); await cho(150);
      khiMH = await page.$$eval('[data-tong^="2024|"]', es => es.map(e => e.getAttribute('data-tong').split('|')[1]));
      await page.screenshot({ path: path.join(SHOTS, 'hoi_quy_file_chua_gwp_buoc4.png'), fullPage: false });
    });
    const KHI = ['CO₂', 'CH₄', 'N₂O', 'HFC, HCFC'];
    khiMH = khiMH.filter(k => KHI.includes(k));
    const X = r.xlsx ? docZip(r.xlsx) : {};
    const th = X.o && X.o['Tổng hợp'], A = cotA(th);
    const rs = Object.keys(A).map(Number).sort((a, b) => a - b);
    const i0 = rs.find(rr => A[rr] === 'Theo khí'), i1 = rs.find(rr => A[rr] === 'Theo loại nguồn');
    const khiX = rs.filter(rr => rr > i0 && rr < i1).map(rr => A[rr]);
    ok(i0 && i1 && !khiX.includes('CH₄') && !khiX.includes('N₂O'), 'Tổng hợp không liệt kê CH₄ = 0, N₂O = 0 khi chưa quy đổi được: ' + khiX.join(', '));
    ok(i0 && khiX.join('|') === khiMH.join('|'), 'các khí ở mục Theo khí của .xlsx giống Bước 4: .xlsx ' + khiX.join(', ') + '; Bước 4 ' + khiMH.join(', '));
  }

  await browser.close();
  console.log('\n9. Lỗi console');
  ok(errors.length === 0, 'không có lỗi console hay lỗi trang' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  console.log(`\nKết quả: ${pass} đạt, ${fail} trượt`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
