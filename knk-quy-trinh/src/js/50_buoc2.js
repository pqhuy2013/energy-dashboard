/* ---------- Buoc 2. Thu thap so lieu hoat dong ----------
   Moi nam cua ky mot bo bieu. Bang, ten cot va thu tu cot theo Muc 1 Phu luc II Thong
   tu 38/2023/TT-BCT; cot ung dung them nam sau, to nen rieng. Dong truy vet duoi moi
   dong ghi nguon so lieu, chung tu, nguoi cung cap va danh dau uoc tinh, theo Dieu 17
   Thong tu va luu y o Buoc 2 tai lieu quy trinh. */
Object.assign(T,{
  b2ky:['Chọn kỳ báo cáo ở Bước 0 trước: bảng số liệu lập riêng cho từng năm của kỳ.','Choose the reporting period in Step 0 first: data tables are kept per year of the period.'],
  b2veBuoc0:['Về Bước 0','Go to Step 0'],
  b2veBuoc1:['Về Bước 1','Go to Step 1'],
  b2nam:['Năm %y','Year %y'],
  b2p:['Nhập số liệu năm %y. Mỗi năm của kỳ một bộ biểu. Ưu tiên số liệu có chứng từ như hóa đơn, phiếu nhập kho, nhật ký vận hành. Số liệu ước tính phải đánh dấu và ghi cách ước tính.','Enter data for %y. Each year of the period has its own set of tables. Prefer documented figures such as invoices, stock receipts and operating logs. Mark estimates and explain how they were made.'],
  b2chuaNguon:['Chưa có nguồn phát thải nào. Khai báo nguồn ở Bước 1 trước.','No emission sources yet. Declare sources in Step 1 first.'],
  b2ngoaiKy:['Hồ sơ có số liệu của năm %y, không thuộc kỳ đang chọn nên không hiện ở đây. Số liệu này vẫn nằm trong file.','The record holds data for %y, outside the selected period, so it is not shown here. It is still kept in the file.'],
  b2xoaNgoaiKy:['Xóa số liệu ngoài kỳ','Delete data outside the period'],
  b2bang:['Bảng %s. %t','Table %s. %t'],
  b2tt38:['Mục 1 Phụ lục II Thông tư 38/2023/TT-BCT','Section 1, Appendix II of Circular 38/2023/TT-BCT'],
  b2chuTT:['Theo biểu của Thông tư','Circular table column'],
  b2chuThem:['Cột ứng dụng thêm, không có trong biểu của Thông tư','Column added by the app, not in the Circular table'],
  b2nguonSL:['Nguồn số liệu','Data source'],
  b2chungTu:['Số hiệu chứng từ','Document ref.'],
  b2nguoi:['Người cung cấp','Provided by'],
  b2uoc:['Số liệu ước tính','Estimated figure'],
  b2cach:['Cách ước tính','How it was estimated'],
  b221:['Bảng 2.1. Lượng môi chất lạnh nạp hàng năm','Table 2.1. Refrigerant charged per year'],
  b221h:['Cộng từ cột “Lượng nạp bổ sung trong năm” của bảng 2.2, theo loại môi chất','Summed from the “Refrigerant added in the year” column of table 2.2, by refrigerant'],
  b221a:['Loại môi chất lạnh','Refrigerant'],
  b221b:['Lượng môi chất nạp (kg)','Refrigerant charged (kg)'],
  b2htH:['Hệ thống thông tin, dữ liệu về phát thải khí nhà kính của cơ sở','The facility’s GHG information and data system'],
  b2htHint:['Mục II.4 Mẫu số 06','Form 06, item II.4'],
  b2htLab:['Mô tả cách thu thập, lưu giữ số liệu, người phụ trách, và nguyên nhân các hạn chế trong kiểm kê','Describe how data is collected and kept, who is responsible, and the causes of any limitations'],
  b2mKy:['Kỳ báo cáo (Bước 0)','Reporting period (Step 0)'],
  b2mNguon:['Nguồn phát thải (Bước 1)','Emission sources (Step 1)'],
  b2mO:['%n, năm %y: %c','%n, %y: %c'],
  b2tXoa:['Đã xóa số liệu ngoài kỳ.','Data outside the period deleted.']
});
var NGUON_SL=['Hóa đơn','Phiếu nhập kho','Nhật ký vận hành','Đồng hồ đo, công tơ','Báo cáo sản xuất','Hợp đồng mua bán'];
var UI2={ nam:null };
function namKy(){ return (S.ky.namBatDau && S.ky.namKetThuc) ? [S.ky.namBatDau,S.ky.namKetThuc] : []; }

VE[2]=function(sec){
  var ys=namKy();
  if(!ys.length){
    var a=el('div','qt-alert'); a.appendChild(document.createTextNode(t('b2ky')+' '));
    a.appendChild(nut(t('b2veBuoc0'),'goBuoc|0')); sec.appendChild(a); return;
  }
  if(ys.indexOf(UI2.nam)<0) UI2.nam=ys[0];
  var y=UI2.nam;
  var tabs=el('div','qt-tabs');
  ys.forEach(function(x){ var b=nut(fill(t('b2nam'),{y:x}),'nam|'+x); if(x===y) b.classList.add('on'); tabs.appendChild(b); });
  sec.appendChild(tabs);
  var ngoai={}; S.soLieu.forEach(function(r){ if(ys.indexOf(r.nam)<0) ngoai[r.nam]=1; });
  Object.keys(ngoai).forEach(function(k){
    var a=el('div','qt-alert'); a.appendChild(document.createTextNode(fill(t('b2ngoaiKy'),{y:k})+' '));
    a.appendChild(nut(t('b2xoaNgoaiKy'),'xoaNgoaiKy')); sec.appendChild(a);
  });
  if(!S.nguon.length){
    var i0=el('div','qt-info'); i0.appendChild(document.createTextNode(t('b2chuaNguon')+' '));
    i0.appendChild(nut(t('b2veBuoc1'),'goBuoc|1')); sec.appendChild(i0);
  } else {
    sec.appendChild(el('p','qt-note',fill(t('b2p'),{y:y})));
    var lg=el('div','qt-legend');
    var s1=el('span'); s1.appendChild(el('i')); s1.appendChild(document.createTextNode(t('b2chuTT'))); lg.appendChild(s1);
    var s2=el('span'); var i2=el('i'); i2.style.background='#f6f5ef'; s2.appendChild(i2); s2.appendChild(document.createTextNode(t('b2chuThem'))); lg.appendChild(s2);
    sec.appendChild(lg);
    LOAI.forEach(function(l){ var ds=nguonTheoLoai(l.k); if(ds.length) veBang2(sec,l,ds,y); });
  }
  var cb=theCard(sec,t('b2htH'),t('b2htHint'));
  var g=el('div','qt-grid'); cb.appendChild(g);
  g.appendChild(truong(t('b2htLab'), oNhap({kieu:'area'},'p|moTa.heThongDuLieu',S.moTa.heThongDuLieu), false, null, true));
};

function giaTriNguon(n,c){
  if(c.n==='@khaiThac'){
    var cn=n.thuocTinh.congNghe, op=LOAI_BY.phattan.nf[1].opts.filter(function(o){ return o[0]===cn; })[0];
    return [n.thietBi, n.viTri, op?lv(op[1]):'', n.ghiChu].filter(function(x){ return x && String(x).trim(); }).join('; ');
  }
  var v=getP(n,duongDan(c.n));
  if(c.ngay && v) return dmyv(v);
  if(c.so) return vietSo(v);
  return v==null?'':String(v);
}
function veBang2(sec,l,ds,y){
  var b=l.bang;
  var cb=theCard(sec, b.so ? fill(t('b2bang'),{s:b.so,t:lv(b.ten)}) : lv(b.ten), (b.so ? t('b2tt38') : lv(b.nguonBang))+' · '+fill(t('b2nam'),{y:y}));
  cb.parentNode.id='bang-'+l.k;
  if(l.pp.canhBao) cb.appendChild(el('div','qt-alert',lv(l.pp.canhBao)));
  var w=el('div','qt-tbw'), tb=el('table','qt-t'), thead=el('thead'), tr=el('tr');
  tr.appendChild(el('th','qt-stt','STT'));
  b.cot.forEach(function(c){
    var th=el('th',c.tt38===false?'qt-them':null,lv(c.lab));
    if(c.req) th.appendChild(el('span','qt-req','*'));
    tr.appendChild(th);
  });
  thead.appendChild(tr); tb.appendChild(thead);
  var tbody=el('tbody');
  ds.forEach(function(n,i){
    var so=laySo(n.id,y,false)||{ gioTri:null, donVi:b.donVi||'', chiTiet:{}, laUocTinh:false, cachUocTinh:'', nguonSoLieu:'', chungTu:'', nguoiCungCap:'' };
    var r=el('tr'), st=el('td','qt-stt',String(i+1));
    var cap=[n.thietBi,n.viTri].filter(function(x){ return x && x.trim(); }).join(', ');
    if(cap) st.appendChild(el('small',null,cap));
    r.appendChild(st);
    b.cot.forEach(function(c){
      var td=el('td',c.tt38===false?'qt-them':null);
      if(c.n){ td.appendChild(el('span','qt-ro',giaTriNguon(n,c))); }
      else if(c.calc){ var sp=el('span','qt-calc'); sp.setAttribute('data-calc',c.calc+'|'+n.id+'|'+y); td.appendChild(sp); }
      else {
        var bb='s|'+n.id+'|'+y+'|'+c.s, v=getP(so,duongDan(c.s));
        var ctrl=oNhap({ kieu:c.kieu, list:c.list, w:c.w, lab:c.lab },bb,v);
        if(c.donVi){
          var row=el('div','qt-cellrow'); row.appendChild(ctrl);
          row.appendChild(oNhap({ kieu:'sel', opts:c.donVi.map(function(u){ return [u,[u,u]]; }), lab:c.lab },'s|'+n.id+'|'+y+'|donVi',so.donVi));
          td.appendChild(row);
        } else td.appendChild(ctrl);
      }
      r.appendChild(td);
    });
    tbody.appendChild(r);
    /* dong truy vet */
    var r2=el('tr','qt-tr-trace'), td2=el('td'); td2.colSpan=b.cot.length+1;
    var tr2=el('div','qt-trace'), p='s|'+n.id+'|'+y+'|';
    function o(nhan,path,kieu,list){ var lab=el('label'); lab.appendChild(el('span',null,nhan)); lab.appendChild(oNhap({ kieu:kieu||'text', list:list, lab:[nhan,nhan] },p+path,getP(so,path))); tr2.appendChild(lab); }
    o(t('b2nguonSL'),'nguonSoLieu','list',NGUON_SL);
    o(t('b2chungTu'),'chungTu');
    o(t('b2nguoi'),'nguoiCungCap');
    tr2.appendChild(oHop(p+'laUocTinh',so.laUocTinh,t('b2uoc')));
    if(so.laUocTinh) o(t('b2cach'),'cachUocTinh');
    td2.appendChild(tr2); r2.appendChild(td2); tbody.appendChild(r2);
  });
  tb.appendChild(tbody); w.appendChild(tb); cb.appendChild(w);
  if(b.ghiThem) cb.appendChild(el('p','qt-note',lv(b.ghiThem)));
  if(l.k==='moichat') veBang21(cb,ds,y);
}
function veBang21(cb,ds,y){
  var loai=[]; ds.forEach(function(n){ var k=n.phanLoai.trim(); if(k && loai.indexOf(k)<0) loai.push(k); });
  cb.appendChild(el('div','qt-hsn',t('b221')));
  cb.appendChild(el('p','qt-note',t('b221h')));
  var w=el('div','qt-tbw'), tb=el('table','qt-t'), thead=el('thead'), tr=el('tr');
  tr.appendChild(el('th','qt-stt','STT')); tr.appendChild(el('th',null,t('b221a'))); tr.appendChild(el('th',null,t('b221b')));
  thead.appendChild(tr); tb.appendChild(thead);
  var tbody=el('tbody');
  loai.forEach(function(k,i){
    var r=el('tr'); r.appendChild(el('td','qt-stt',String(i+1))); r.appendChild(el('td',null,k));
    var td=el('td'), sp=el('span','qt-calc'); sp.setAttribute('data-calc','mc21|'+encodeURIComponent(k)+'|'+y); td.appendChild(sp); r.appendChild(td);
    tbody.appendChild(r);
  });
  tb.appendChild(tbody); w.appendChild(tb); cb.appendChild(w);
}
/* o tinh san, chi hien, khong luu vao file */
TINH.tj=function(a){
  var n=timNguon(a[0]), tj=n && tjCua(n,laySo(a[0],+a[1],false));
  return tj ? vietSo(tj.v,6) : '';
};
TINH.mc21=function(a){
  var k=decodeURIComponent(a[0]), y=+a[1], tong=null;
  nguonTheoLoai('moichat').forEach(function(n){
    if(n.phanLoai.trim()!==k) return;
    var so=laySo(n.id,y,false); if(so && so.gioTri!=null) tong=(tong||0)+so.gioTri;
  });
  return tong==null?'':vietSo(tong,6);
};

/* o bat buoc cua mot dong so lieu; tra ve nhan cot con thieu */
function thieuSo(n,y){
  var l=LOAI_BY[n.loai], so=laySo(n.id,y,false)||{ gioTri:null, donVi:'', chiTiet:{}, laUocTinh:false, cachUocTinh:'' }, m=[];
  l.bang.cot.forEach(function(c){
    if(!c.s || !c.req) return;
    var v=getP(so,duongDan(c.s));
    if(c.req==='nhietTri'){ if(HE_TJ[(so.donVi||'').toLowerCase()]==null && v==null) m.push(lv(c.lab)); return; }
    if(c.req==='hoi'){ if(v==null && !(so.chiTiet.khoiLuongGio!=null && so.chiTiet.soGio!=null)) m.push(lv(c.lab)); return; }
    if(rong(v)) m.push(lv(c.lab));
    if(c.donVi && rong(so.donVi)) m.push(lv(c.lab));
  });
  if(so.laUocTinh && rong(so.cachUocTinh)) m.push(t('b2cach'));
  return m;
}
THIEU[2]=function(){
  var ys=namKy();
  if(!ys.length) return [t('b2mKy')];
  if(!S.nguon.length) return [t('b2mNguon')];
  var m=[];
  S.nguon.forEach(function(n){ ys.forEach(function(y){
    thieuSo(n,y).forEach(function(c){ m.push(fill(t('b2mO'),{n:nhanNguon(n),y:y,c:c})); });
  }); });
  return m;
};
ACT.nam=function(p){ UI2.nam=+p[0]; veLai(); };
ACT.goBuoc=function(p){ go('buoc-'+p[0]); };
ACT.xoaNgoaiKy=function(){
  var ys=namKy(); S.soLieu=S.soLieu.filter(function(r){ return ys.indexOf(r.nam)>=0; });
  daSua(); veLai(); toast(t('b2tXoa'));
};
