/* ---------- Ban thao Mau so 06 ----------
   Dung mot mo hinh noi dung (danh sach khoi) tu ho so va ket qua tinh, roi ve ra hai noi:
   file .docx de nop (87_docx.js) va ban xem truoc o Buoc 8. Cau chu tieu de va de muc chep
   nguyen van Mau so 06 Phu luc II Nghi dinh 06/2022/ND-CP (Mau_so_06_cau_truc.md muc 3).
   Ban thao luon viet bang tieng Viet. Cho nao con thieu thi ghi [Chưa nhập: ...] to vang.

   Theo quyet dinh ngay 26/9/2026 (Mau_so_06_cau_truc.md muc 5): tieu de dien ca hai nam
   cua ky; duoi III.2 chen bang so lieu theo cac bieu Muc 1 Phu luc II Thong tu 38, duoi
   III.3 chen bang tong hop theo bieu E.8, moi nam mot bang; ghi chu "bang la cach trinh
   bay cua ung dung" chi hien tren trang (khoi 'web'), khong vao file .docx.

   Khoi: { k:'mau' } | { k:'dau', ten } | { k:'tieuDe', r:[run] }
         { k:'muc', x } de muc La Ma | { k:'muc2', x } de muc so | { k:'p', r:[run] }
         { k:'gach', r:[run] } | { k:'nho', r:[run] } ghi chu duoi bang
         { k:'bang', tieu, cot:[{ x, w, can }], dong:[[o]] } | { k:'web', x } | { k:'ky', ten }
   O bang: { x | r:[run], can, gop, rs, b } */
var M06={
  mau:'Mẫu số 06',
  cho1:'TÊN CƠ SỞ PHẢI THỰC HIỆN', cho2:'KIỂM KÊ KHÍ NHÀ KÍNH',
  qh1:'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', qh2:'Độc lập - Tự do - Hạnh phúc',
  bc:'BÁO CÁO', td:'Kết quả kiểm kê khí nhà kính cho năm',
  I:'I. Thông tin của cơ sở phải thực hiện kiểm kê khí nhà kính',
  I1:'1. Tên cơ sở, địa chỉ, giấy phép kinh doanh …',
  I2:'2. Thông tin về người đại diện của cơ sở trước pháp luật.',
  I3:'3. Thông tin về lĩnh vực hoạt động kinh doanh, sản xuất.',
  II:'II. Thông tin về hoạt động sản xuất kinh doanh và số liệu hoạt động của cơ sở',
  II1:'1. Ranh giới và phạm vi hoạt động của cơ sở.',
  II2:'2. Cơ sở hạ tầng, công nghệ và hoạt động của cơ sở phải thực hiện kiểm kê khí nhà kính.',
  II3:'3. Các nguồn phát thải, bể hấp thụ khí nhà kính trong phạm vi hoạt động của cơ sở.',
  II4:'4. Hệ thống thông tin, dữ liệu về phát thải khí nhà kính của cơ sở, xác định nguyên nhân các hạn chế trong kiểm kê khí nhà kính của cơ sở.',
  III:'III. Kết quả thực hiện kiểm kê phát thải khí nhà kính',
  III1:'1. Mô tả phương pháp kiểm kê phát thải khí nhà kính (phương pháp thu thập số liệu, hệ số phát thải).',
  III2:'2. Số liệu hoạt động liên quan đến phát thải khí nhà kính của cơ sở.',
  III3:'3. Kết quả kiểm kê khí nhà kính của cơ sở.',
  III4:'4. Độ tin cậy, tính đầy đủ, độ không chắc chắn của thông tin, số liệu về phát thải khí nhà kính và kết quả kiểm kê khí nhà kính của cơ sở.',
  ky:'ĐẠI DIỆN CỦA CƠ SỞ'
};
/* Cong thuc ghi vao muc III.1, _{...} la chi so duoi */
var M06_CT={
  '1':'Đốt nhiên liệu, điểm 1: TPT_{F} = Σ_{i} (AD_{F} × EF_{F,i} × GWP_{i}) / 1000, trong đó AD_{F} tính theo TJ, EF_{F,i} tính theo kg/TJ.',
  '2':'Môi chất lạnh, điểm 2.1: TPT_{mcl} = Σ_{j} (AD_{j} × GWP_{j}) / 1000, trong đó AD_{j} là lượng môi chất lạnh nạp bổ sung trong năm, tính theo kg.',
  '3':'Điện mua ngoài, điểm 3: TPT_{Đ} = AD_{n} × EF_{n}, trong đó AD_{n} tính theo MWh, EF_{n} tính theo tấn CO₂/MWh.',
  '4':'Hơi mua ngoài, điểm 4: TPT_{H,p} = AD_{H,p} × EF_{H,p}, trong đó AD_{H,p} tính theo tấn hơi.',
  '4ct':'Hệ số phát thải của hơi tự tính theo công thức điểm 4, đã áp dụng đính chính tại Quyết định 334/QĐ-BCT ngày 06/02/2025: EF_{H,p} = Entanpi_{H,p} / η_{lò} × EF_{nhiên liệu} / 10⁹, hiệu suất lò hơi dùng dạng phân số.',
  '5':'Khai thác than, điểm 5: E_{CH4} = PQ × EF × CF / 1000 (điểm 5.1 hầm lò, 5.4 lộ thiên); E_{CO2} = PQ × EF_{CO2} × CF_{CO2} / 1000 (điểm 5.5); khối lượng riêng CF tính theo kg/m³.',
  '5dot':'CH₄ thu gom đem đốt: E_{CO2(CH4)} = AB × CF × CE × 44/16 / 1000 (điểm 5.2) và E_{CH4,kc} = AB × CF × (1 − CE) / 1000 (điểm 5.3), hiệu suất đốt CE dùng dạng phân số. Lượng CH₄ thu gom đem đốt không trừ khỏi phát thải CH₄ tại điểm 5.1, theo đúng Mục 2 Phụ lục II Thông tư 38/2023/TT-BCT.'
};
var BAC_M06={
  rieng:'Hệ số riêng được cơ quan có thẩm quyền chấp thuận, khoản 1 Điều 18',
  qd2626:'Danh mục hệ số phát thải ban hành kèm theo Quyết định 2626/QĐ-BTNMT, khoản 2 Điều 18',
  ipcc:'Hướng dẫn của IPCC, khoản 3 Điều 18',
  muc2:'Theo Mục 2 Phụ lục II Thông tư 38/2023/TT-BCT'
};
var GWP_TEN={ AR4:'Báo cáo đánh giá lần thứ tư (AR4) của IPCC', AR5:'Báo cáo đánh giá lần thứ năm (AR5) của IPCC' };

function voiTiengViet(fn){ var cu=L; L='vi'; try{ return fn(); } finally{ L=cu; } }
function R(x,o){ var r={ x:x==null?'':String(x) }; if(o) for(var k in o) r[k]=o[k]; return r; }
function Rt(nhan){ return { x:nhan?'[Chưa nhập: '+nhan+']':'[Chưa nhập]', hl:true }; }
function Rv(v,nhan){ return rong(v) ? Rt(nhan) : R(String(v).trim()); }
function Rct(s){
  var out=[], re=/_\{([^}]*)\}/g, i=0, m;
  while((m=re.exec(s))){ if(m.index>i) out.push(R(s.slice(i,m.index))); out.push(R(m[1],{ sub:true })); i=re.lastIndex; }
  if(i<s.length) out.push(R(s.slice(i)));
  return out;
}
function doanVan(s,nhan){
  if(rong(s)) return nhan ? [{ k:'p', r:[Rt(nhan)] }] : [];
  return String(s).split(/\n+/).map(function(x){ return x.trim(); }).filter(Boolean).map(function(x){ return { k:'p', r:[R(x)] }; });
}
/* Luong khi (tan): so lon giu 3 chu so thap phan, so nho giu 6 de khong mat CH4, N2O */
function soLuong(v){ return v==null ? '' : vietSo(v,Math.abs(v)>=1?3:6); }
function soVi(v,d){ return v==null ? '' : vietSo(v,d==null?3:d); }
/* Ten loai moi chat lanh cua nguon, chua ghi thi danh dau thieu */
function mcTen(n){ return rong(n.phanLoai) ? Rt('loại môi chất lạnh') : R(n.phanLoai.trim()); }
function moTaNguon(n){ var s=[n.phanLoai,n.thietBi,n.viTri].filter(function(x){ return x && String(x).trim(); }).join(', '); return s || nhanNguon(n); }
function boCuoi(s){ return String(s).replace(/[;.”\s]+$/,''); }
function chuD16(l){ return l.d16.slice(1); }

function mau06(){ return voiTiengViet(function(){
  var kq=tinhToan(), ys=namKy(), B=[], cs=S.coSo;
  function muc(x){ B.push({ k:'muc', x:x }); }
  function muc2(x){ B.push({ k:'muc2', x:x }); }
  function gach(r){ B.push({ k:'gach', r:r }); }
  function p(r){ B.push({ k:'p', r:r }); }

  B.push({ k:'mau' });
  B.push({ k:'dau', ten:rong(cs.ten)?null:cs.ten.trim().toLocaleUpperCase('vi') });
  B.push({ k:'tieuDe', r:ys.length ? [R(M06.td+' '+ys[0]+' và năm '+ys[1])] : [R(M06.td+' '),Rt('kỳ báo cáo')] });

  /* ---- I ---- */
  muc(M06.I);
  muc2(M06.I1);
  gach([R('Tên cơ sở: '),Rv(cs.ten,'tên cơ sở')]);
  var dc=[R('Địa chỉ: '),Rv(cs.diaChi,'địa chỉ')];
  if(!rong(cs.tinh) && !rong(cs.diaChi) && nod(cs.diaChi).indexOf(nod(cs.tinh).replace(/^(tinh|thanh pho) /,''))<0) dc.push(R(', '+cs.tinh));
  gach(dc);
  gach([R('Mã số thuế: '),Rv(cs.maSoThue,'mã số thuế')]);
  var gp=cs.giayPhep;
  gach([R('Giấy phép kinh doanh: số '),Rv(gp.so,'số giấy phép'),R(', ngày cấp '),ngayHopLe(gp.ngayCap)?R(dmyv(gp.ngayCap)):Rt('ngày cấp'),R(', nơi cấp '),Rv(gp.noiCap,'nơi cấp')]);
  gach([R('Số thứ tự trong danh mục tại Quyết định 42/2026/QĐ-TTg: Phụ lục '),Rv(cs.phuLuc,'phụ lục'),R(', số thứ tự '),Rv(cs.stt,'số thứ tự')]);
  if(!rong(cs.boQuanLy)) gach([R('Bộ quản lý lĩnh vực: Bộ '+cs.boQuanLy.trim())]);
  muc2(M06.I2);
  gach([R('Họ và tên: '),Rv(cs.daiDien.hoTen,'họ và tên người đại diện')]);
  gach([R('Chức vụ: '),Rv(cs.daiDien.chucVu,'chức vụ')]);
  muc2(M06.I3);
  B=B.concat(doanVan(cs.linhVuc,'mô tả lĩnh vực hoạt động kinh doanh, sản xuất'));

  /* ---- II ---- */
  muc(M06.II);
  muc2(M06.II1);
  B=B.concat(doanVan(S.moTa.ranhGioi,'ranh giới và phạm vi hoạt động'));
  muc2(M06.II2);
  B=B.concat(doanVan(S.moTa.haTang,'cơ sở hạ tầng, công nghệ và hoạt động'));
  muc2(M06.II3);
  [[false,'Nguồn phát thải trực tiếp, theo khoản 1 Điều 16 Thông tư 38/2023/TT-BCT:'],[true,'Nguồn phát thải gián tiếp, theo khoản 2 Điều 16 Thông tư 38/2023/TT-BCT:']].forEach(function(g){
    p([R(g[1])]);
    LOAI.filter(function(l){ return l.gt===g[0]; }).forEach(function(l){
      var ds=nguonTheoLoai(l.k), r=[R(chuD16(l)+') '+lv(l.ten)+': ')];
      if(ds.length) r.push(R(ds.length+' nguồn, gồm '+ds.map(moTaNguon).join('; ')+'.'));
      else if(S.loaiKhongCo.indexOf(l.k)>=0) r.push(R('không có.'));
      else r.push(Rt('có hay không có loại nguồn này'));
      p(r);
    });
  });
  var bh=S.beHapThu;
  p([R('Bể hấp thụ khí nhà kính: ')].concat(bh.coHayKhong===false ? [R('không có.')] : bh.coHayKhong===true ? [R('có. '),Rv(bh.moTa,'mô tả bể hấp thụ')] : [Rt('có hay không có bể hấp thụ')]));
  muc2(M06.II4);
  B=B.concat(doanVan(S.moTa.heThongDuLieu,'hệ thống thông tin, dữ liệu và nguyên nhân các hạn chế'));
  var dsSo=[]; S.nguon.forEach(function(n){ ys.forEach(function(y){ var so=laySo(n.id,y,false); if(so) dsSo.push(so); }); });
  if(dsSo.length){
    var coCt=dsSo.filter(function(so){ return !rong(so.chungTu); }).length, uoc=dsSo.filter(function(so){ return so.laUocTinh; }).length;
    p([R('Số liệu hoạt động của kỳ báo cáo gồm '+dsSo.length+' dòng, trong đó '+coCt+' dòng có ghi số hiệu chứng từ'+(uoc?' và '+uoc+' dòng là số liệu ước tính.':'; không có số liệu ước tính.'))]);
  }

  /* ---- III ---- */
  muc(M06.III);
  muc2(M06.III1);
  var co={}; S.nguon.forEach(function(n){ co[n.loai]=1; });
  p([R('Phát thải khí nhà kính của cơ sở được tính theo Điều 19 và Mục 2 Phụ lục II Thông tư 38/2023/TT-BCT: lượng phát thải của từng khí nhà kính bằng số liệu hoạt động nhân với hệ số phát thải; tổng lượng phát thải quy đổi ra tấn CO₂ tương đương theo tiềm năng nóng lên toàn cầu (GWP) của từng khí. Công thức áp dụng cho các nguồn của cơ sở:')]);
  if(!S.nguon.length) gach([Rt('nguồn phát thải, Bước 1')]);
  if(co.codinh || co.didong) gach(Rct(M06_CT['1']));
  if(co.moichat) gach(Rct(M06_CT['2']));
  if(co.dien) gach(Rct(M06_CT['3']));
  if(co.hoi){
    gach(Rct(M06_CT['4']));
    if(S.heSo.some(function(h){ var n=timNguon(h.nguonId); return n && n.loai==='hoi' && h.thamSo.cachTinh==='congThuc'; })) gach(Rct(M06_CT['4ct']));
  }
  var ptCo=nguonTheoLoai('phattan').filter(ptCoCongThuc), ptKhong=nguonTheoLoai('phattan').filter(function(n){ return !ptCoCongThuc(n); });
  if(ptKhong.length) gach([R(lv(LOAI_BY.phattan.ten)+' ('+ptKhong.map(moTaNguon).join('; ')+'): '),Rt('phương pháp tính, Mục 2 Phụ lục II Thông tư 38/2023/TT-BCT chỉ có công thức cho khai thác than hầm lò và lộ thiên')]);
  if(ptCo.length){
    gach(Rct(M06_CT['5']));
    if(ptCo.some(function(n){ return ys.some(function(y){ var so=laySo(n.id,y,false); return so && so.chiTiet.ch4Dot>0; }); })) gach(Rct(M06_CT['5dot']));
  }
  LOAI.filter(function(l){ return l.pp.canhBao && co[l.k]; }).forEach(function(l){
    gach([R(lv(l.ten)+': '),Rt('phương pháp tính, Thông tư 38/2023/TT-BCT không có công thức cho loại nguồn này')]);
  });
  if(S.gwp){
    var g=DATA.gwp[S.gwp];
    var gr=[R('Tiềm năng nóng lên toàn cầu theo '+GWP_TEN[S.gwp]+': CO₂ = 1; CH₄ = '+vietSo(g.CH4)+'; N₂O = '+vietSo(g.N2O)+'.')];
    var mc=[], mcR=[]; nguonTheoLoai('moichat').forEach(function(n){
      var h=layHs(n.id,'GWP',null,false); if(!h || h.giaTri==null) return;
      var s=n.phanLoai.trim()+' = '+vietSo(h.giaTri); if(mc.indexOf(s)>=0) return; mc.push(s);
      if(mcR.length) mcR.push(R('; '));
      mcR.push(mcTen(n),R(' = '+vietSo(h.giaTri)));
    });
    if(mcR.length) gr=gr.concat([R(' GWP của môi chất lạnh: ')],mcR,[R('.')]);
    p(gr);
  } else p([R('Tiềm năng nóng lên toàn cầu: '),Rt('bộ GWP')]);
  var nsl=[]; S.soLieu.forEach(function(so){ if(ys.indexOf(so.nam)>=0 && !rong(so.nguonSoLieu) && nsl.indexOf(so.nguonSoLieu.trim())<0) nsl.push(so.nguonSoLieu.trim()); });
  p([R('Phương pháp thu thập số liệu: số liệu hoạt động thu thập theo các biểu Mục 1 Phụ lục II Thông tư 38/2023/TT-BCT, riêng cho từng năm của kỳ báo cáo'+(nsl.length?'; nguồn số liệu gồm: '+nsl.join('; ').toLocaleLowerCase('vi')+'.':'.'))]);
  p([R('Hệ số phát thải lựa chọn theo thứ tự ưu tiên tại Điều 18 Thông tư 38/2023/TT-BCT:')]);
  var theoBac={};
  S.nguon.forEach(function(n){
    var l=LOAI_BY[n.loai];
    (l.hs.khi||[]).forEach(function(k){
      (l.hs.theoNam?ys:[null]).forEach(function(y){
        var h=layHs(n.id,k,y,false); if(!h || (h.giaTri==null && h.thamSo.cachTinh!=='congThuc')) return;
        var bac=h.bac||'khac'; (theoBac[bac]=theoBac[bac]||[]).push({ n:n, h:h, y:y });
      });
    });
  });
  var coHs=false;
  ['rieng','qd2626','ipcc','muc2','khac'].forEach(function(bac){
    var ds=theoBac[bac]; if(!ds) return; coHs=true;
    gach([R((BAC_M06[bac]||'Chưa ghi bậc hệ số')+':')]);
    ds.forEach(function(o){
      var kh=o.h.khi==='GWP' ? 'GWP '+(o.n.phanLoai.trim()||'môi chất lạnh') : (KHI_NHAN[o.h.khi]||o.h.khi);
      var ts=o.h.thamSo, r;
      if(ts.cachTinh==='congThuc'){
        r=[R('+ '+moTaNguon(o.n)+', '+kh+': tự tính theo công thức điểm 4, hiệu suất lò hơi '),
           ts.hieuSuat==null?Rt('hiệu suất lò hơi'):R(vietSo(ts.hieuSuat)+' %'),R(', hệ số CO₂ của nhiên liệu lò hơi '),
           ts.efNhienLieu==null?Rt('hệ số CO₂ của nhiên liệu'):R(vietSo(ts.efNhienLieu)+' kg CO₂/TJ'),R('; nguồn gốc hệ số nhiên liệu: '),Rv(ts.efNguon,'nguồn gốc')];
      } else {
        r=[R('+ '+moTaNguon(o.n)+', '+kh+(o.y?', năm '+o.y:'')+': '+vietSo(o.h.giaTri)+(o.h.donVi?' '+o.h.donVi:''))];
        if(ts.cf!=null) r.push(R(', khối lượng riêng '+vietSo(ts.cf)+' kg/m³'));
        if(!rong(o.h.maHeSo) && /^QĐ2626:/.test(o.h.maHeSo)) r.push(R(', mã '+o.h.maHeSo.replace(/^QĐ2626:/,'')));
        r.push(R('; nguồn gốc: ')); r.push(Rv(o.h.nguonGoc,'nguồn gốc hệ số'));
      }
      B.push({ k:'gach', r:r, cap:2 });
    });
  });
  if(!coHs) gach([Rt('hệ số phát thải, Bước 3')]);
  B=B.concat(doanVan(S.moTa.phuongPhap));

  muc2(M06.III2);
  B.push({ k:'web', x:t('b8webBang') });
  if(!ys.length) p([Rt('kỳ báo cáo')]);
  else if(!S.nguon.length) p([Rt('nguồn phát thải, Bước 1')]);
  ys.forEach(function(y){
    B.push({ k:'p', r:[R('Năm '+y,{ b:true, i:true })], giu:true });
    LOAI.forEach(function(l){
      var ds=nguonTheoLoai(l.k); if(!ds.length) return;
      if(l.k==='moichat') B.push(bang21(ds,y));
      var bsl=bangSoLieu(l,ds,y); B.push(bsl);
      if(bsl.them.length) B.push({ k:'nho', r:[R('Số liệu dùng để tính, ngoài các cột của biểu: '+bsl.them.join('. ')+'.')] });
      if(bsl.thieu.length) B.push({ k:'nho', r:[Rt(bsl.thieu.join('; '))] });
      var uoc=ds.filter(function(n){ var so=laySo(n.id,y,false); return so && so.laUocTinh; });
      if(uoc.length) B.push({ k:'nho', r:[R('Số liệu ước tính: '+uoc.map(function(n){ var so=laySo(n.id,y,false); return moTaNguon(n)+(rong(so.cachUocTinh)?'':', '+so.cachUocTinh.trim()); }).join('; ')+'.')] });
    });
  });

  muc2(M06.III3);
  B.push({ k:'web', x:t('b8webBang') });
  if(!ys.length) p([Rt('kỳ báo cáo')]);
  ys.forEach(function(y){
    var o=kq.tong[y];
    var r=[R('Năm '+y+': tổng lượng phát thải khí nhà kính của cơ sở là '+soVi(o.tong)+' tấn CO₂ tương đương, trong đó phát thải trực tiếp '+soVi(o.tt)+' tấn CO₂ tương đương, phát thải gián tiếp '+soVi(o.gt)+' tấn CO₂ tương đương.')];
    if(o.loi || o.chuaGwp) r.push(R(' '),{ x:'[Chưa đầy đủ: '+(o.loi+o.chuaGwp)+' dòng chưa tính được, xem bảng dưới]', hl:true });
    if(o.khongCT) r.push(R(' '),{ x:'[Chưa gồm phát thải của '+o.khongCT+' nguồn thuộc loại Thông tư 38/2023/TT-BCT không có công thức]', hl:true });
    p(r);
  });
  ys.forEach(function(y){ B.push(bangKetQua(kq,y)); });
  if(ys.length) p(S.gwp ? [R('Bộ GWP sử dụng: '+S.gwp+' (CO₂ = 1; CH₄ = '+vietSo(DATA.gwp[S.gwp].CH4)+'; N₂O = '+vietSo(DATA.gwp[S.gwp].N2O)+').')] : [R('Bộ GWP sử dụng: '),Rt('bộ GWP')]);
  tinhLaiM06(B);

  muc2(M06.III4);
  if(S.qc.length){
    p([R('Kiểm soát chất lượng: ',{ i:true }),R('cơ sở thực hiện kiểm soát chất lượng theo Điều 20 Thông tư 38/2023/TT-BCT với các nội dung sau:')]);
    S.qc.forEach(function(q){
      var r=[Rv(q.noiDung,'nội dung kiểm soát'),R(': '),Rv(q.nguoiKiem,'người kiểm tra'),R(' kiểm tra ngày '),ngayHopLe(q.ngay)?R(dmyv(q.ngay)):Rt('ngày'),R('; kết quả: ')];
      if(q.ketQua==='dat') r.push(R('đạt.'));
      else if(q.ketQua==='saiSot'){ r.push(R('có sai sót. Sai sót phát hiện: ')); r.push(Rv(q.loiPhatHien,'sai sót')); r.push(R('. Cách xử lý: ')); r.push(Rv(q.cachXuLy,'cách xử lý')); r.push(R('.')); }
      else r.push(Rt('kết quả'));
      gach(r);
    });
  } else p([R('Kiểm soát chất lượng: ',{ i:true }),Rt('biên bản kiểm soát chất lượng, Bước 5')]);
  p([R('Đánh giá độ không chắc chắn: ',{ i:true }),R('theo Điều 21 và khoản 1 Điều 11 Thông tư 38/2023/TT-BCT:')]);
  KHIA_CANH.forEach(function(k){
    p([R(boCuoi(T['b6_'+k][0])+': '),Rv(S.khongChacChan.dinhTinh[k],'nhận xét')]);
  });
  var uys=ys.map(function(y){ return { y:y, u:uTong(kq,y) }; }).filter(function(o){ return o.u; });
  if(uys.length){
    p([R('Định lượng độ không chắc chắn: ',{ i:true }),R('theo Phương pháp 1, Chương 3, Quyển 1 Hướng dẫn IPCC 2006, phương trình 3.1 cho từng nguồn và phương trình 3.2 cho tổng, giả định các sai số độc lập với nhau.')]);
    /* chi goi la do khong chac chan cua tong khi moi dong phat thai deu co so lieu U */
    uys.forEach(function(o){
      gach([R(o.u.phu>=99.95
        ? 'Năm '+o.y+': độ không chắc chắn của tổng lượng phát thải là ±'+vietSo(o.u.u,1)+' %.'
        : 'Năm '+o.y+': độ không chắc chắn của phần phát thải có đủ số liệu độ không chắc chắn, chiếm '+vietSo(o.u.phu,1)+' % tổng lượng phát thải, là ±'+vietSo(o.u.u,1)+' %.')]);
    });
  } else p([R('Định lượng độ không chắc chắn: ',{ i:true }),R('chưa định lượng do chưa có số liệu độ không chắc chắn của số liệu hoạt động và hệ số phát thải.')]);
  B=B.concat(doanVan(S.khongChacChan.dinhLuong));

  B.push({ k:'ky', ten:rong(cs.daiDien.hoTen)?null:cs.daiDien.hoTen.trim() });
  return B;
}); }

/* Cot bat buoc cua mot dong so lieu, cung cach voi thieuSo o Buoc 2 */
function batBuoc(c,so){
  if(c.req==='nhietTri') return HE_TJ[(so.donVi||'').toLowerCase()]==null;
  if(c.req==='hoi') return !(so.chiTiet.khoiLuongGio!=null && so.chiTiet.soGio!=null);
  return !!c.req;
}
/* O cua bang so lieu: gia tri theo cot cua bieu */
function oSoLieu(n,so,c){
  if(c.n){
    var gv=giaTriNguon(n,c);
    /* truong bat buoc cua nguon (khai o Buoc 1) con trong thi danh dau thieu */
    var nf=LOAI_BY[n.loai].nf.filter(function(f){ return f.f===c.n; })[0];
    return (rong(gv) && nf && nf.req) ? { r:[Rt()] } : { x:gv };
  }
  if(c.calc==='tj'){ var tj=tjCua(n,so); return { x:tj?vietSo(tj.v,6):'', can:'right' }; }
  var v=getP(so,duongDan(c.s));
  if(rong(v) || v==null) return batBuoc(c,so) ? { r:[Rt()] } : { x:'' };
  if(c.kieu==='num') return { x:vietSo(v)+(c.donVi && so.donVi?' '+so.donVi:''), can:'right' };
  if(c.kieu==='date') return { x:dmyv(v) };
  return { x:String(v) };
}
function bangSoLieu(l,ds,y){
  var b=l.bang, cols=b.cot.filter(function(c){ return c.tt38!==false; });
  var tieu=(b.so?'Bảng '+b.so+'. ':'')+lv(b.ten)+', năm '+y;
  var cot=[{ x:'STT', w:7, can:'center' }].concat(cols.map(function(c){ return { x:lv(c.lab), w:12 }; }));
  var thieuThem=[], them=[];
  var dong=ds.map(function(n,i){
    var so=laySo(n.id,y,false)||{ gioTri:null, donVi:b.donVi||'', chiTiet:{} };
    /* cot ung dung them (nhiet tri, TJ, tong luong hoi, CH4 dem dot...) khong co trong bieu cua
       Thong tu nhung la so lieu da dung de tinh: ghi duoi bang de nguoi tham dinh lan lai duoc */
    var gt=[];
    b.cot.forEach(function(c){
      if(c.tt38!==false) return;
      var v=c.calc==='tj' ? (tjCua(n,so)||{}).v : getP(so,duongDan(c.s));
      if(v==null || rong(v)) return;
      gt.push(lv(c.lab)+': '+(typeof v==='number'?vietSo(v,c.calc?6:10):String(v)));
    });
    if(gt.length) them.push(moTaNguon(n)+': '+gt.join('; '));
    /* cot ung dung them khong in vao bang nhung can cho cong thuc: con thieu thi ghi duoi bang */
    b.cot.forEach(function(c){ if(c.tt38===false && c.s && batBuoc(c,so) && (getP(so,duongDan(c.s))==null || rong(getP(so,duongDan(c.s))))) thieuThem.push(lv(c.lab).toLocaleLowerCase('vi')+' của '+moTaNguon(n)); });
    return [{ x:String(i+1), can:'center' }].concat(cols.map(function(c){ return oSoLieu(n,so,c); }));
  });
  return { k:'bang', tieu:tieu, cot:cot, dong:dong, thieu:thieuThem, them:them };
}
function bang21(ds,y){
  /* nguon chua ghi loai gom vao mot dong rieng, danh dau thieu loai; dong co thiet bi chua co
     so lieu thi ghi ro tong chua day du */
  var loai=[]; ds.forEach(function(n){ var k=n.phanLoai.trim(); if(loai.indexOf(k)<0) loai.push(k); });
  var dong=loai.map(function(k,i){
    var tong=null, thieu=0;
    ds.forEach(function(n){ if(n.phanLoai.trim()!==k) return; var so=laySo(n.id,y,false); if(so && so.gioTri!=null) tong=(tong||0)+so.gioTri; else thieu++; });
    var o=tong==null ? { r:[Rt()] } : thieu ? { r:[R(vietSo(tong,6)),R(' '),{ x:'[Chưa đầy đủ: '+thieu+' thiết bị chưa có số liệu]', hl:true }], can:'right' } : { x:vietSo(tong,6), can:'right' };
    return [{ x:String(i+1), can:'center' },k?{ x:k }:{ r:[Rt('loại môi chất lạnh')] },o];
  });
  return { k:'bang', tieu:'Bảng 2.1. Lượng môi chất lạnh nạp hàng năm, năm '+y, cot:[{ x:'STT', w:6, can:'center' },{ x:'Loại môi chất lạnh', w:30 },{ x:'Lượng môi chất nạp (kg)', w:20 }], dong:dong };
}
/* Bang tong hop theo bieu E.8 tai lieu quy trinh, mot nam mot bang */
function bangKetQua(kq,y){
  var cot=[{ x:'Nguồn phát thải', w:14 },{ x:'Số liệu hoạt động', w:11 },{ x:'Đơn vị', w:8 },{ x:'Hệ số phát thải', w:12 },{ x:'Đơn vị', w:10 },
           { x:'Khí', w:9 },{ x:'Lượng khí phát thải (tấn)', w:12 },{ x:'GWP', w:8 },{ x:'Phát thải (tấn CO₂tđ)', w:15 }];
  var ds=kq.dong.filter(function(d){ return d.y===y; }), dong=[], i=0;
  while(i<ds.length){
    var n=ds[i].n, j=i; while(j<ds.length && ds[j].n===n) j++;
    for(var k=i;k<j;k++){
      var d=ds[k], r=[];
      if(k===i) r.push({ x:nhanNguon(n), rs:j-i });
      if(d.loi){
        var ten=d.khi ? (d.khi==='HFC'?(n.phanLoai.trim()||'môi chất lạnh'):KHI_NHAN[d.khi]||d.khi)+': ' : '';
        r.push({ r:[{ x:d.khongCT?'[Thông tư 38/2023/TT-BCT không có công thức cho loại nguồn này; cơ sở tự tính và bổ sung]':'['+ten+'chưa tính được: '+boCuoi(d.loi)+']', hl:true }], gop:8 });
        dong.push(r); continue;
      }
      var ef, efDv=d.efDv||'';
      if(d.muc==='5.2' || d.muc==='5.3'){ ef='CF = '+vietSo(d.cf)+' kg/m³; CE = '+vietSo(d.ce)+' %'; efDv=''; }
      else if(d.muc==='2.1'){ ef='—'; efDv=''; }
      else ef=vietSo(d.ef,6)+(d.cf!=null?' (CF = '+vietSo(d.cf)+' kg/m³)':'');
      r.push({ x:vietSo(d.ad,6), can:'right' },{ x:d.adDv },{ x:ef, can:d.ef!=null?'right':'left' },{ x:efDv },
             d.khi==='HFC'?{ r:[mcTen(n)] }:{ x:KHI_NHAN[d.khi] },{ x:soLuong(d.luong), can:'right' },
             d.gwp==null?{ r:[Rt('bộ GWP')] }:{ x:vietSo(d.gwp), can:'right' },
             { x:d.tco2e==null?'':soVi(d.tco2e), can:'right' });
      dong.push(r);
    }
    i=j;
  }
  var o=kq.tong[y], nh=[R('Tổng cộng',{ b:true })];
  if(chuaDu(o)) nh.push(R(' '),{ x:'[chưa đầy đủ]', hl:true });
  dong.push([{ r:nh, gop:8, can:'right', tongDt:soVi(o.tong) },{ r:[R(soVi(o.tong),{ b:true })], can:'right' }]);
  return { k:'bang', tieu:'Bảng tổng hợp kết quả kiểm kê khí nhà kính năm '+y, cot:cot, dong:dong, nho:true };
}
function tinhLaiM06(B){
  var tl=S.tinhLai;
  function p(r){ B.push({ k:'p', r:r }); }
  var dau=R('Tính toán lại kết quả kỳ trước: ',{ i:true });
  if(tl.tinhTrang==='kyDau') p([dau,R('đây là kỳ báo cáo đầu tiên của cơ sở, không có kết quả kiểm kê kỳ trước phải tính toán lại.')]);
  else if(tl.tinhTrang==='khongDoi') p([dau,R('trong kỳ báo cáo không xảy ra trường hợp phải tính toán lại kết quả kiểm kê kỳ trước theo khoản 1 Điều 22 Thông tư 38/2023/TT-BCT.')]);
  else if(tl.tinhTrang==='coDoi'){
    var ky=tl.kyTruoc, kyX=(ky.namBatDau&&ky.namKetThuc)?'năm '+ky.namBatDau+' và năm '+ky.namKetThuc:null;
    var r=[dau,R('theo Điều 22 Thông tư 38/2023/TT-BCT, cơ sở tính toán lại kết quả kiểm kê '),kyX?R(kyX):Rt('kỳ trước'),R(' do: ')];
    if(tl.truongHop.length) r.push(R(tl.truongHop.map(function(k){ return boCuoi(T['b7_'+k][0]).replace(/^[abc]\) /,''); }).join('; ').replace(/^./,function(c){ return c.toLocaleLowerCase('vi'); })+'.'));
    else r.push(Rt('trường hợp tại khoản 1 Điều 22'));
    p(r);
    p([R('Mô tả thay đổi: '),Rv(tl.lyDo,'mô tả thay đổi')]);
    var nam=kyX?[ky.namBatDau,ky.namKetThuc]:[];
    if(nam.length){
      var dong=nam.map(function(y){
        var cu=tl.ketQuaCu[y], moi=tl.ketQuaMoi[y], d=(cu!=null&&moi!=null)?moi-cu:null;
        return [{ x:String(y), can:'center' },cu==null?{ r:[Rt()] }:{ x:soVi(cu), can:'right' },moi==null?{ r:[Rt()] }:{ x:soVi(moi), can:'right' },
                { x:d==null?'':(d>0?'+':'')+soVi(d), can:'right' },{ x:(d==null||!cu)?'':(d>0?'+':'')+vietSo(d/cu*100,2)+' %', can:'right' }];
      });
      B.push({ k:'bang', tieu:'Kết quả kiểm kê kỳ trước đã báo cáo và kết quả tính toán lại', cot:[{ x:'Năm', w:10, can:'center' },{ x:'Kết quả đã báo cáo (tấn CO₂tđ)', w:22 },{ x:'Kết quả tính lại (tấn CO₂tđ)', w:22 },{ x:'Chênh lệch (tấn CO₂tđ)', w:20 },{ x:'Chênh lệch (%)', w:14 }], dong:dong });
    }
    p([R('Giải thích nguyên nhân chênh lệch: '),Rv(tl.giaiThich,'giải thích chênh lệch')]);
  }
  else p([dau,Rt('tình trạng tính toán lại, Bước 7')]);
}

/* ---------- ve ra .docx ---------- */
function mau06Docx(B){
  var CO=14, TH=567, out='';
  function runsO(o){ return o.r || [{ x:o.x==null?'':String(o.x) }]; }
  B.forEach(function(k){
    if(k.k==='mau') out+=DX.p([R(M06.mau,{ b:true })],{ can:'right', truoc:0, sau:120 });
    else if(k.k==='dau'){
      var trai=k.ten ? [[[R(k.ten,{ b:true })],{ can:'center', co:13, dong:240 }]]
                     : [[[R(M06.cho1,{ b:true, hl:true })],{ can:'center', co:13, dong:240 }],[[R(M06.cho2,{ b:true, hl:true })],{ can:'center', co:13, dong:240 }]];
      trai.push([[],{ vien:true, trai:1300, phai:1300, truoc:0, sau:0, coDau:2, dong:240 }]);
      var phai=[[[R(M06.qh1,{ b:true })],{ can:'center', co:12, dong:240 }],[[R(M06.qh2,{ b:true })],{ can:'center', co:13, dong:240 }],
                [[],{ vien:true, trai:1000, phai:1000, truoc:0, sau:0, coDau:2, dong:240 }]];
      out+=DX.bang({ rong:[3900,DX.RONG-3900], vien:false, co:13, hang:[{ o:[{ doan:trai, can:'center' },{ doan:phai, can:'center' }] }] });
    }
    else if(k.k==='tieuDe'){
      out+=DX.p([R(M06.bc,{ b:true })],{ can:'center', truoc:360, sau:0, co:CO });
      out+=DX.p(k.r.map(function(r){ var q={}; for(var x in r) q[x]=r[x]; q.b=true; return q; }),{ can:'center', truoc:0, sau:0, co:CO });
      out+=DX.p([],{ vien:true, trai:Math.round(DX.RONG/2-700), phai:Math.round(DX.RONG/2-700), truoc:0, sau:240, coDau:2, dong:240 });
    }
    else if(k.k==='muc') out+=DX.p([R(k.x,{ b:true })],{ thut:TH, giu:true, truoc:180 });
    else if(k.k==='muc2') out+=DX.p([R(k.x,{ b:true })],{ thut:TH, giu:true, truoc:120 });
    else if(k.k==='p') out+=DX.p(k.r,{ thut:TH, giu:k.giu });
    else if(k.k==='gach') out+=DX.p(k.cap===2?k.r:[R('- ')].concat(k.r),{ thut:k.cap===2?TH*2:TH });
    else if(k.k==='nho') out+=DX.p(k.r,{ i:true, co:12, thut:TH, truoc:0 });
    else if(k.k==='bang'){
      var n=k.cot.length, co=n>6?11:12;
      out+=DX.p([R(k.tieu,{ b:true })],{ can:'center', giu:true, truoc:160, sau:80, co:13 });
      var rong=DX.chia(k.cot.map(function(c){ return c.w||10; }));
      var hang=[{ dau:true, o:k.cot.map(function(c){ return { x:c.x, can:'center' }; }) }];
      k.dong.forEach(function(d){ hang.push({ o:d.map(function(c){ return { r:runsO(c), can:c.can, gop:c.gop, rs:c.rs, b:c.b }; }) }); });
      out+=DX.bang({ rong:rong, co:co, hang:hang });
      out+=DX.p([],{ truoc:0, sau:80, coDau:6, dong:240 });
    }
    else if(k.k==='ky'){
      var ky=[[[R(M06.ky,{ b:true })],{ can:'center', co:CO }]];
      for(var i=0;i<4;i++) ky.push([[],{ can:'center', co:CO }]);
      if(k.ten) ky.push([[R(k.ten,{ b:true })],{ can:'center', co:CO }]);
      out+=DX.p([],{ truoc:120, sau:0 });
      out+=DX.bang({ rong:[DX.RONG-4800,4800], vien:false, co:CO, hang:[{ o:[{ x:'' },{ doan:ky, can:'center' }] }] });
    }
  });
  return out;
}
function xuatDocx(){
  var B=mau06(), ten=S.coSo.ten||'co so';
  var blob=DX.tao(mau06Docx(B),'Báo cáo kết quả kiểm kê khí nhà kính, '+ten);
  var name=tenFile('KNK_Mau06','docx');
  taiBlob(blob,name); toast(fill(t('b8tDocx'),{f:name}));
}

/* ---------- ve ra ban xem truoc tren trang ---------- */
function mau06Html(B){
  var root=el('div','qt-a4');
  function vRuns(host,runs){
    runs.forEach(function(r){
      if(typeof r==='string') r={ x:r };
      var e=r.sub?el('sub',null,r.x):r.sup?el('sup',null,r.x):document.createTextNode(r.x);
      if(r.b || r.i || r.hl){ var w=el('span',r.hl?'qt-a4-o':null); if(r.b) w.style.fontWeight='700'; if(r.i) w.style.fontStyle='italic'; w.appendChild(e); e=w; }
      host.appendChild(e);
    });
    return host;
  }
  B.forEach(function(k){
    if(k.k==='mau') root.appendChild(el('div','qt-a4-mau',M06.mau));
    else if(k.k==='dau'){
      var d=el('div','qt-a4-dau'), a=el('div'), b=el('div');
      if(k.ten) a.appendChild(el('b',null,k.ten));
      else { var o=el('b','qt-a4-o',M06.cho1+' '+M06.cho2); a.appendChild(o); }
      a.appendChild(el('i','qt-a4-ke'));
      b.appendChild(el('b',null,M06.qh1)); b.appendChild(el('b',null,M06.qh2)); b.appendChild(el('i','qt-a4-ke qt-a4-ke2'));
      d.appendChild(a); d.appendChild(b); root.appendChild(d);
    }
    else if(k.k==='tieuDe'){
      var t0=el('div','qt-a4-td'); t0.appendChild(el('b',null,M06.bc));
      var t1=el('b'); vRuns(t1,k.r); t0.appendChild(t1); t0.appendChild(el('i','qt-a4-ke')); root.appendChild(t0);
    }
    else if(k.k==='muc') root.appendChild(el('p','qt-a4-muc',k.x));
    else if(k.k==='muc2') root.appendChild(el('p','qt-a4-muc2',k.x));
    else if(k.k==='p') root.appendChild(vRuns(el('p','qt-a4-p'),k.r));
    else if(k.k==='gach') root.appendChild(vRuns(el('p','qt-a4-p'+(k.cap===2?' qt-a4-cap2':'')),k.cap===2?k.r:[R('- ')].concat(k.r)));
    else if(k.k==='nho') root.appendChild(vRuns(el('p','qt-a4-nho'),k.r));
    else if(k.k==='web') root.appendChild(el('div','qt-a4-web',k.x));
    else if(k.k==='bang'){
      root.appendChild(el('p','qt-a4-cap',k.tieu));
      var w=el('div','qt-tbw'), tb=el('table','qt-a4t'), hr=el('tr');
      k.cot.forEach(function(c){ hr.appendChild(el('th',null,c.x)); });
      var th=el('thead'); th.appendChild(hr); tb.appendChild(th);
      var bd=el('tbody');
      k.dong.forEach(function(d){
        var tr=el('tr');
        d.forEach(function(c){
          var td=vRuns(el('td',c.can==='right'?'qt-r':c.can==='center'?'qt-c':null),c.r||[{ x:c.x==null?'':String(c.x) }]);
          if(c.gop) td.colSpan=c.gop; if(c.rs) td.rowSpan=c.rs; if(c.b) td.style.fontWeight='700';
          /* dong tong tren dien thoai: nhan kem so, bang cuon ngang khong che mat so */
          if(c.tongDt){ td.classList.add('qt-tong-lab'); td.appendChild(el('span','qt-tong-dt',': '+c.tongDt)); }
          tr.appendChild(td);
        });
        bd.appendChild(tr);
      });
      tb.appendChild(bd); w.appendChild(tb); root.appendChild(w);
    }
    else if(k.k==='ky'){ var s=el('div','qt-a4-ky'); s.appendChild(el('b',null,M06.ky)); if(k.ten) s.appendChild(el('b','qt-a4-kyten',k.ten)); root.appendChild(s); }
  });
  return root;
}
