/* ---------- Buoc 3. Lua chon he so phat thai ----------
   Thu tu uu tien Dieu 18 Thong tu 38/2023/TT-BCT: he so rieng duoc chap thuan; Danh
   muc Quyet dinh 2626/QD-BTNMT; huong dan IPCC. Dien, hoi va moi chat lanh theo cach
   rieng cua Muc 2 Phu luc II. Ba lop bao ve cua dashboard knk/ giu nguyen:
   71 he so hieu chinh khong chon duoc; he so khong quy doi tu dong duoc thi bao thang;
   he so theo m3 CH4 phai ghi ro khoi luong rieng da dung. */
Object.assign(T,{
  b3p:['Mỗi nguồn cần hệ số cho từng khí. Thứ tự ưu tiên theo Điều 18 Thông tư 38/2023/TT-BCT: (1) hệ số riêng của cơ sở đã được cơ quan có thẩm quyền chấp thuận; (2) Danh mục hệ số phát thải, hiện là Quyết định 2626/QĐ-BTNMT; (3) hướng dẫn mới nhất của IPCC. Điện, hơi và môi chất lạnh lấy hệ số theo cách riêng ghi ở Mục 2 Phụ lục II.',
       'Each source needs a factor for each gas. Priority under Article 18 of Circular 38/2023/TT-BCT: (1) an approved facility-specific factor; (2) the emission factor list, currently Decision 2626/QD-BTNMT; (3) the latest IPCC guidance. Electricity, steam and refrigerants follow the specific rules of Section 2, Appendix II.'],
  b3chuaNguon:['Chưa có nguồn phát thải nào. Khai báo nguồn ở Bước 1 trước.','No emission sources yet. Declare sources in Step 1 first.'],
  b3cKhi:['Khí','Gas'], b3cNam:['Năm','Year'], b3cGt:['Hệ số','Factor'], b3cDv:['Đơn vị','Unit'],
  b3cBac:['Loại nguồn hệ số','Factor source type'], b3cNg:['Căn cứ, nguồn gốc','Reference'],
  b3kbb:['không bắt buộc','optional'],
  b3gwp:['GWP của %m','GWP of %m'],
  b3gwpMc:['môi chất','refrigerant'],
  b3ktn:['không thứ nguyên','dimensionless'],
  bac_rieng:['Hệ số riêng được chấp thuận, Điều 18 khoản 1','Approved facility factor, Art. 18(1)'],
  bac_qd2626:['Danh mục Quyết định 2626/QĐ-BTNMT, Điều 18 khoản 2','Decision 2626/QD-BTNMT list, Art. 18(2)'],
  bac_ipcc:['Hướng dẫn IPCC, Điều 18 khoản 3','IPCC guidance, Art. 18(3)'],
  bac_muc2:['Theo Mục 2 Phụ lục II Thông tư 38','As set out in Section 2, Appendix II'],
  b3tra:['Tra QĐ 2626','Search Decision 2626'],
  b3boChon:['Bỏ chọn','Clear'],
  b3luoi:['Dùng hệ số lưới năm %y','Use %y grid factor'],
  b3luoiThieu:['Chưa xác minh được hệ số phát thải lưới điện năm %y đã được công bố. Nhập tay kèm văn bản công bố; không lấy tạm hệ số của năm khác.','The %y grid emission factor could not be verified as published. Enter it by hand with the publishing document; do not borrow another year’s factor.'],
  b3ngPh:['Ví dụ: Công văn số ..., IPCC 2006 Tập 2 Bảng 2.3','E.g. Official letter no. ..., IPCC 2006 Vol. 2 Table 2.3'],
  b3kqd:['Hệ số này tính theo đơn vị không quy đổi thẳng ra tấn CO₂ tương đương, ví dụ theo khối lượng các-bon, ni-tơ hoặc theo năng lượng. Khi tính, ứng dụng sẽ không tự quy đổi mà yêu cầu dùng công thức đầy đủ của IPCC.','This factor uses a unit that does not convert directly to tonnes CO₂e, e.g. carbon or nitrogen mass, or energy. The app will not convert it automatically and will ask for the full IPCC formula.'],
  b3cf:['Khối lượng riêng dùng để đổi m³ ra tấn (kg/m³)','Density used to convert m³ to tonnes (kg/m³)'],
  b3cfNguon:['nguồn','source'],
  b3cfCH4:['Mặc định theo IPCC là 0,67 kg/m³ CH₄ ở 20 °C và 1 atm. Thông tư 38 ghi đơn vị Gg/m³, nhưng công thức chia 1000 ra tấn chỉ đúng khi dùng kg/m³.','The IPCC default is 0.67 kg/m³ CH₄ at 20 °C and 1 atm. Circular 38 writes the unit as Gg/m³, but its divide-by-1000-to-tonnes formula is only correct with kg/m³.'],
  b3cfCO2:['Thông tư 38 không cho giá trị mặc định của hệ số chuyển đổi thể tích sang khối lượng của CO₂. Nhập và ghi nguồn.','Circular 38 gives no default volume-to-mass factor for CO₂. Enter one and cite its source.'],
  b3lt:['Điểm 5.5 Mục 2, khai thác lộ thiên','Point 5.5 of Section 2, surface mining'],
  b3y_codinh:['Điểm 1 Mục 2 tính theo TJ nhiên liệu, nên dùng hệ số theo kg khí/TJ.','Point 1 of Section 2 works in TJ of fuel, so use factors in kg gas/TJ.'],
  b3y_moichat:['Ứng dụng chưa có bảng GWP của môi chất lạnh; nhập theo báo cáo đánh giá IPCC và ghi nguồn. Môi chất hỗn hợp như R410A thì tính GWP từ thành phần. Bộ GWP phải thống nhất với bộ chọn ở Bước 4, AR4 hoặc AR5.','The app has no refrigerant GWP table yet; enter values from an IPCC assessment report and cite it. For blends such as R410A, compute the GWP from the components. Use the same set as chosen in Step 4, AR4 or AR5.'],
  b3y_dien:['Điểm 3 Mục 2: điện lưới dùng hệ số lưới điện quốc gia công bố cho năm tính toán; điện tự sản xuất hoặc mua trực tiếp dùng hệ số do đơn vị bán điện cung cấp kèm tài liệu minh chứng.','Point 3 of Section 2: grid electricity uses the national grid factor published for the calculation year; self-generated or directly purchased electricity uses the factor supplied by the seller with evidence.'],
  b3y_hoi:['Điểm 4 Mục 2: hệ số của hơi lấy trực tiếp từ đơn vị cung cấp hơi. Tự tính theo công thức, đã áp dụng đính chính của Quyết định 334/QĐ-BCT, sẽ có ở Giai đoạn 3 của kế hoạch.','Point 4 of Section 2: the steam factor is taken from the steam supplier. Computing it from the formula, with the correction of Decision 334/QD-BCT, comes in phase 3 of the plan.'],
  b3y_phattan:['Điểm 5 Mục 2 dùng hệ số theo m³ khí trên tấn than, cùng khối lượng riêng để đổi ra tấn.','Point 5 of Section 2 uses factors in m³ of gas per tonne of coal, with a density to convert to tonnes.'],
  b3mNguon:['Nguồn phát thải (Bước 1)','Emission sources (Step 1)'],
  b3mKy:['Kỳ báo cáo (Bước 0), để gán hệ số điện theo năm','Reporting period (Step 0), for per-year electricity factors'],
  b3mHs:['%n: hệ số %k','%n: factor %k'],
  b3mNam:[' năm %y',' for %y'],
  b3mNg:['%n: căn cứ, nguồn gốc của hệ số %k','%n: reference for factor %k'],
  b3mCf:['%n: khối lượng riêng của %k','%n: density for %k'],
  b3mIt:['%n: ít nhất một hệ số','%n: at least one factor'],
  trH:['Tra hệ số trong Quyết định 2626/QĐ-BTNMT','Search Decision 2626/QD-BTNMT'],
  trFor:['Gán cho: %n · khí %k','For: %n · gas %k'],
  trQ:['Tìm theo tên, nguồn phát thải, đơn vị','Search name, source or unit'],
  trLv:['Lĩnh vực','Sector'], trNhom:['Nhóm','Group'], trKhi:['Khí','Gas'], trTatCa:['Tất cả','All'],
  trNote:['Hệ số hiệu chỉnh và hệ số không có giá trị số không chọn được. Hệ số chỉ chọn được cho đúng khí của ô đang gán.','Correction factors and factors without a numeric value cannot be chosen. A factor can only be chosen for the gas of the slot being filled.'],
  trMuc:['Mục','Item'], trTen:['Tên hệ số','Factor'], trGt:['Giá trị','Value'], trDv:['Đơn vị','Unit'], trBac:['Bậc','Tier'],
  trChon:['Chọn','Choose'],
  trHc:['Hệ số hiệu chỉnh: dùng bên trong công thức IPCC, không nhân trực tiếp với số liệu hoạt động','Correction factor: used inside IPCC formulas, never multiplied directly with activity data'],
  trNull:['Không có giá trị số','No numeric value'],
  trKhacKhi:['Khác khí','Other gas'],
  trKqd:['Không tự quy đổi ra tCO₂tđ','No automatic tCO₂e conversion'],
  trM3:['Theo m³ CH₄: cần khối lượng riêng','m³ CH₄: needs a density'],
  trKo:['Không có hệ số nào khớp bộ lọc.','No factor matches the filters.'],
  trSo:['%a trên %b hệ số','%a of %b factors'],
  trThem:['Hiện thêm','Show more'],
  trDaChon:['Đã gán hệ số %m.','Assigned factor %m.']
});
var KHI_NHAN={ CO2:'CO₂', CH4:'CH₄', N2O:'N₂O' };
var KL=[[/nghìn tấn|thousand ton/i,1000],[/\btấn\b|\bton(ne)?s?\b/i,1],[/\bkg\b/i,0.001],[/\bg\b/i,0.000001]];
/* Quy doi don vi he so ve tan khi, giong dashboard knk/. null la khong quy doi tu dong duoc. */
function convInfo(donVi){
  var num=(donVi||'').split('/')[0];
  var gas=/CO2/i.test(num)?'CO2':(/CH4/i.test(num)?'CH4':(/N2O/i.test(num)?'N2O':null));
  if(!gas) return null;
  if(/m3/i.test(num) && gas==='CH4') return { gas:'CH4', m3:true };
  for(var i=0;i<KL.length;i++) if(KL[i][0].test(num)) return { gas:gas, f:KL[i][1] };
  return null;
}
function maHs(r){ return r[0]+'.'+r[1]+(r[2]>1?' ('+r[2]+')':''); }
function luoiNam(y){ var r=DATA.luoi.filter(function(x){ return x[0]===String(y); })[0]; return (r && r[2]!=null) ? r : null; }

function oHs(n){
  var c=LOAI_BY[n.loai].hs, out=[];
  if(c.theoNam) namKy().forEach(function(y){ out.push({ khi:c.khi[0], nam:y, req:true }); });
  else c.khi.forEach(function(k){ out.push({ khi:k, nam:null, req:!c.itNhat }); });
  if(n.loai==='phattan'){
    out.forEach(function(o){ o.cf=true; });
    if(n.thuocTinh.congNghe==='lothien') out.push({ khi:'CO2', nam:null, req:false, cf:true, lt:true });
  }
  return out;
}
function khiNhan(o,n){ return o.khi==='GWP' ? fill(t('b3gwp'),{m:n.phanLoai.trim()||t('b3gwpMc')}) : (KHI_NHAN[o.khi]||o.khi); }
function hsDu(h,o){ return !!h && h.giaTri!=null && !!h.bac && !rong(h.nguonGoc) && (!o.cf || h.thamSo.cf!=null); }
function hsKhoa(h){ return !!h && (h.bac==='qd2626' || /^luoi:/.test(h.maHeSo)); }
function macDinhHs(h){
  var n=timNguon(h.nguonId); if(!n) return;
  var c=LOAI_BY[n.loai].hs;
  if(!h.bac && c.bac.length===1) h.bac=c.bac[0];
  if(n.loai==='phattan' && h.khi==='CH4' && h.thamSo.cf==null){ h.thamSo.cf=0.67; h.thamSo.cfNguon='IPCC 2006, Tập 2, Chương 4: 0,67 kg/m³ ở 20 °C và 1 atm'; }
}

VE[3]=function(sec){
  sec.appendChild(el('div','qt-info',t('b3p')));
  if(!S.nguon.length){
    var i0=el('div','qt-info'); i0.appendChild(document.createTextNode(t('b3chuaNguon')+' '));
    i0.appendChild(nut(t('b2veBuoc1'),'goBuoc|1')); sec.appendChild(i0); return;
  }
  LOAI.forEach(function(l){
    var ds=nguonTheoLoai(l.k); if(!ds.length) return;
    var cb=theCard(sec,lv(l.ten), l.pp.m2 ? fill(t('b1pp'),{b:l.bang.so,m:l.pp.m2}) : '');
    cb.parentNode.id='hs-'+l.k;
    var y=T['b3y_'+(l.k==='didong'?'codinh':l.k)]; if(y) cb.appendChild(el('p','qt-note',lv(y)));
    if(l.pp.canhBao) cb.appendChild(el('div','qt-alert',lv(l.pp.canhBao)));
    ds.forEach(function(n){ veHs(cb,l,n); });
  });
};
function veHs(cb,l,n){
  var c=l.hs, slots=oHs(n);
  cb.appendChild(el('div','qt-hsn',nhanNguon(n)));
  if(!slots.length){ cb.appendChild(el('p','qt-note',t('b3mKy'))); return; }
  var w=el('div','qt-tbw'), tb=el('table','qt-t'), thead=el('thead'), tr=el('tr');
  var cols=[t('b3cKhi')].concat(c.theoNam?[t('b3cNam')]:[]).concat([t('b3cGt'),t('b3cDv'),t('b3cBac'),t('b3cNg'),'']);
  cols.forEach(function(x){ tr.appendChild(el('th',null,x)); });
  thead.appendChild(tr); tb.appendChild(thead);
  var tbody=el('tbody'), nc=cols.length;
  slots.forEach(function(o){
    var h=layHs(n.id,o.khi,o.nam,false), key=n.id+'|'+o.khi+'|'+(o.nam==null?'-':o.nam), bp='h|'+key+'|';
    var r=el('tr');
    var tk=el('td'); tk.appendChild(el('b',null,khiNhan(o,n)));
    if(o.req) tk.appendChild(el('span','qt-req','*')); else tk.appendChild(el('small',null,' '+t('b3kbb')));
    if(o.lt) tk.appendChild(el('small',null,' · '+t('b3lt')));
    r.appendChild(tk);
    if(c.theoNam) r.appendChild(el('td',null,String(o.nam)));
    if(hsKhoa(h)){
      r.appendChild(el('td','qt-lock qt-calc',vietSo(h.giaTri)));
      r.appendChild(el('td','qt-lock',h.donVi));
      r.appendChild(el('td','qt-lock',t('bac_'+h.bac)));
      var tg=el('td','qt-lock',h.nguonGoc); if(h.tenHeSo) tg.appendChild(el('small',null,h.tenHeSo)); r.appendChild(tg);
      r.appendChild(oThaoTac([nut(t('b3boChon'),'boChon|'+key)]));
    } else {
      var t1=el('td'); t1.appendChild(oNhap({ kieu:'num', w:110, lab:[khiNhan(o,n),khiNhan(o,n)] },bp+'giaTri',h?h.giaTri:null)); r.appendChild(t1);
      var t2=el('td');
      if(o.khi==='GWP') t2.appendChild(el('span','qt-ro',t('b3ktn')));
      else t2.appendChild(oNhap({ kieu:'text', w:110, ph:[c.mau||'',c.mau||''] },bp+'donVi',h?h.donVi:''));
      r.appendChild(t2);
      var t3=el('td'), ops=c.bac.map(function(b){ return [b,T['bac_'+b]]; });
      var sel=oNhap({ kieu:'sel', opts:ops, w:190 },bp+'bac',h?h.bac:(c.bac.length===1?c.bac[0]:''));
      t3.appendChild(sel); r.appendChild(t3);
      var t4=el('td'); t4.appendChild(oNhap({ kieu:'text', w:220, ph:T.b3ngPh },bp+'nguonGoc',h?h.nguonGoc:'')); r.appendChild(t4);
      r.appendChild(oThaoTac([
        c.tra ? nut(t('b3tra'),'tra|'+key,'qt-pri') : null,
        (c.luoi && n.phanLoai==='Điện lưới' && luoiNam(o.nam)) ? nut(fill(t('b3luoi'),{y:o.nam}),'luoi|'+key,'qt-pri') : null ]));
    }
    tbody.appendChild(r);
    function ghiChu(txt,ok){ var rr=el('tr','qt-tr-note'), td=el('td',ok?'qt-okn':null,txt); td.colSpan=nc; rr.appendChild(td); tbody.appendChild(rr); return td; }
    if(h && h.bac==='qd2626' && !convInfo(h.donVi)) ghiChu(t('b3kqd'));
    if(c.luoi && n.phanLoai==='Điện lưới' && !luoiNam(o.nam) && !hsKhoa(h)) ghiChu(fill(t('b3luoiThieu'),{y:o.nam}));
    if(o.cf){
      var td=ghiChu('',true);
      td.appendChild(document.createTextNode(t('b3cf')+' '));
      var cfv=h?h.thamSo.cf:null, cin=oNhap({ kieu:'num', ph:[o.khi==='CH4'?'0,67':'',o.khi==='CH4'?'0.67':''], lab:T.b3cf },bp+'thamSo.cf',cfv);
      td.appendChild(cin);
      td.appendChild(document.createTextNode(t('b3cfNguon')+' '));
      var cn=oNhap({ kieu:'text', lab:T.b3cfNguon },bp+'thamSo.cfNguon',h?h.thamSo.cfNguon:''); cn.classList.add('qt-wide'); td.appendChild(cn);
      td.appendChild(el('div',null,t(o.khi==='CH4'?'b3cfCH4':'b3cfCO2')));
    }
  });
  tb.appendChild(tbody); w.appendChild(tb); cb.appendChild(w);
}

THIEU[3]=function(){
  if(!S.nguon.length) return [t('b3mNguon')];
  var m=[];
  if(!namKy().length && S.nguon.some(function(n){ return LOAI_BY[n.loai].hs.theoNam; })) m.push(t('b3mKy'));
  S.nguon.forEach(function(n){
    var c=LOAI_BY[n.loai].hs, du=0, nn=nhanNguon(n);
    oHs(n).forEach(function(o){
      var h=layHs(n.id,o.khi,o.nam,false), k=khiNhan(o,n)+(o.nam!=null?fill(t('b3mNam'),{y:o.nam}):'');
      if(hsDu(h,o)){ du++; return; }
      var coGi=h && (h.giaTri!=null || !rong(h.nguonGoc));
      if(!o.req && !coGi) return;
      if(!h || h.giaTri==null || !h.bac) m.push(fill(t('b3mHs'),{n:nn,k:k}));
      else if(rong(h.nguonGoc)) m.push(fill(t('b3mNg'),{n:nn,k:k}));
      else m.push(fill(t('b3mCf'),{n:nn,k:k}));
    });
    if(c.itNhat && du<c.itNhat) m.push(fill(t('b3mIt'),{n:nn}));
  });
  return m;
};

ACT.boChon=function(p){
  var nam=p[2]==='-'?null:+p[2];
  S.heSo=S.heSo.filter(function(h){ return !(h.nguonId===p[0] && h.khi===p[1] && h.nam===nam); });
  daSua(); veLai();
};
ACT.luoi=function(p){
  var nam=+p[2], r=luoiNam(nam); if(!r) return;
  var h=layHs(p[0],p[1],nam,true);
  h.giaTri=r[2]; h.donVi='tCO₂/MWh'; h.bac='muc2'; h.maHeSo='luoi:'+nam;
  h.tenHeSo='Hệ số phát thải lưới điện quốc gia năm '+nam; h.nguonGoc=r[3];
  daSua(); veLai();
};

/* ---------- hop tra he so Quyet dinh 2626/QD-BTNMT ---------- */
var UI3={ id:null, khi:null, nam:null, q:'', lv:'', nhom:'', khiLoc:'', shown:60 };
DATA.hs.forEach(function(r){ r._s=nod(r[5]+' '+r[8]+' '+r[3]+' '+r[12]+' '+r[0]+'.'+r[1]); });
ACT.tra=function(p){
  var n=timNguon(p[0]); if(!n) return;
  var c=LOAI_BY[n.loai].hs;
  UI3.id=p[0]; UI3.khi=p[1]; UI3.nam=p[2]==='-'?null:+p[2];
  UI3.q=(n.loai==='codinh'||n.loai==='didong') ? n.phanLoai : (n.loai==='phattan' ? ({hamlo:'ham lo',lothien:'lo thien'}[n.thuocTinh.congNghe]||'') : '');
  UI3.lv=c.lv||''; UI3.nhom=c.nhom||''; UI3.khiLoc=p[1]; UI3.shown=60;
  moTra();
};
function moTra(){
  var n=timNguon(UI3.id), m=$('qt-modal'), b=$('qt-modal-b');
  var h=$('qt-modal-h'); h.innerHTML=''; h.appendChild(document.createTextNode(t('trH')));
  h.appendChild(el('small',null,fill(t('trFor'),{n:nhanNguon(n),k:KHI_NHAN[UI3.khi]||UI3.khi})));
  b.innerHTML='';
  var f=el('div','qt-filt');
  var q=el('input'); q.type='search'; q.value=UI3.q; q.id='tr-q'; q.autocomplete='off';
  var fq=truong(t('trQ'),q); fq.classList.add('qt-q'); f.appendChild(fq);
  function chon(id,nhan,opts,val,key){
    var s=el('select'); s.id=id;
    var o0=el('option',null,t('trTatCa')); o0.value=''; s.appendChild(o0);
    opts.forEach(function(o){ var x=el('option',null,o[1]); x.value=o[0]; s.appendChild(x); });
    s.value=val; s.addEventListener('change',function(){ UI3[key]=s.value; UI3.shown=60; veKqHs(); });
    f.appendChild(truong(nhan,s));
  }
  var M_=DATA.hsMeta;
  chon('tr-lv',t('trLv'),M_.linhVuc.map(function(x){ return [x[0],lv(x)]; }),UI3.lv,'lv');
  var seen={}, nh=[]; M_.nhom.forEach(function(x){ if(!seen[x[1]]){ seen[x[1]]=1; nh.push([x[1],L==='vi'?x[1]:x[2]]); } });
  chon('tr-nhom',t('trNhom'),nh,UI3.nhom,'nhom');
  chon('tr-khi',t('trKhi'),['CO2','CH4','N2O'].map(function(k){ return [k,KHI_NHAN[k]]; }),UI3.khiLoc,'khiLoc');
  b.appendChild(f);
  b.appendChild(el('p','qt-note',t('trNote')));
  var kq=el('div'); kq.id='tr-kq'; b.appendChild(kq);
  q.addEventListener('input',function(){ UI3.q=q.value; UI3.shown=60; veKqHs(); });
  m.hidden=false; document.body.style.overflow='hidden';
  veKqHs(); q.focus();
}
function veKqHs(){
  var box=$('tr-kq'); if(!box) return; box.innerHTML='';
  var tu=nod(UI3.q.trim()).split(/\s+/).filter(Boolean);
  var kq=DATA.hs.filter(function(r){
    if(UI3.lv && r[16]!==UI3.lv) return false;
    if(UI3.nhom && r[3]!==UI3.nhom) return false;
    if(UI3.khiLoc && r[7].split(', ').indexOf(UI3.khiLoc)<0) return false;
    return tu.every(function(x){ return r._s.indexOf(x)>=0; });
  });
  if(!kq.length){ box.appendChild(el('p','qt-note',t('trKo'))); return; }
  box.appendChild(el('p','qt-note',fill(t('trSo'),{a:Math.min(UI3.shown,kq.length),b:kq.length})));
  var w=el('div','qt-tbw'), tb=el('table','qt-t'), thead=el('thead'), tr=el('tr');
  [t('trMuc'),t('trTen'),t('trKhi'),t('trGt'),t('trDv'),t('trBac'),''].forEach(function(x){ tr.appendChild(el('th',null,x)); });
  thead.appendChild(tr); tb.appendChild(thead);
  var tbody=el('tbody');
  kq.slice(0,UI3.shown).forEach(function(r){
    var i=DATA.hs.indexOf(r), rr=el('tr');
    rr.appendChild(el('td',null,maHs(r)));
    var tn=el('td',null,L==='vi'?r[5]:r[6]); tn.appendChild(el('small',null,' · '+(L==='vi'?r[8]:r[9]))); rr.appendChild(tn);
    rr.appendChild(el('td',null,r[7]));
    rr.appendChild(el('td','qt-calc',r[10]));
    var dv=el('td',null,L==='vi'?r[12]:r[13]);
    var ci=convInfo(r[12]);
    if(r[15]!=='hc' && r[11]!=null){
      if(!ci){ dv.appendChild(document.createTextNode(' ')); dv.appendChild(el('span','qt-chip qt-cw',t('trKqd'))); }
      else if(ci.m3){ dv.appendChild(document.createTextNode(' ')); dv.appendChild(el('span','qt-chip',t('trM3'))); }
    }
    rr.appendChild(dv);
    rr.appendChild(el('td',null,r[14]));
    var ta=el('td','qt-acts');
    if(r[15]==='hc') ta.appendChild(el('small',null,t('trHc')));
    else if(r[11]==null) ta.appendChild(el('small',null,t('trNull')));
    else if(r[7].split(', ').indexOf(UI3.khi)<0){ var bx=nut(t('trKhacKhi'),'x'); bx.disabled=true; ta.appendChild(bx); }
    else ta.appendChild(nut(t('trChon'),'chonHs|'+i,'qt-pri'));
    ta.style.whiteSpace='normal'; ta.style.minWidth='130px';
    rr.appendChild(ta); tbody.appendChild(rr);
  });
  tb.appendChild(tbody); w.appendChild(tb); box.appendChild(w);
  if(kq.length>UI3.shown){ var mb=nut(t('trThem'),'traThem'); mb.style.marginTop='10px'; box.appendChild(mb); }
}
ACT.traThem=function(){ UI3.shown+=60; veKqHs(); };
ACT.dongTra=function(){ $('qt-modal').hidden=true; $('qt-modal-b').innerHTML=''; document.body.style.overflow=''; };
ACT.chonHs=function(p){
  var r=DATA.hs[+p[0]]; if(!r || r[15]==='hc' || r[11]==null) return;
  var h=layHs(UI3.id,UI3.khi,UI3.nam,true);
  h.maHeSo='QĐ2626:'+maHs(r); h.tenHeSo=r[5]; h.giaTri=r[11]; h.donVi=r[12]; h.bac='qd2626';
  h.nguonGoc='Quyết định 2626/QĐ-BTNMT, Phụ lục '+r[0]+', mục '+r[1]+(r[2]>1?', biến thể '+r[2]:'')+'; '+r[14]+' IPCC';
  macDinhHs(h);
  ACT.dongTra(); daSua(); veLai();
  toast(fill(t('trDaChon'),{m:maHs(r)}));
};
