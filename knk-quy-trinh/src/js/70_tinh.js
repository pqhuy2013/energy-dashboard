/* ---------- Tinh toan, Muc 2 Phu luc II Thong tu 38/2023/TT-BCT ----------
   Ket qua khong luu vao file, luon tinh lai tu so lieu va he so. Moi dong ket qua la
   mot khi cua mot nguon trong mot nam. Dong nao khong tinh dung duoc thi ghi ly do
   (loi), khong dua ra con so.

   Ba lop bao ve (muc 5.3 ke hoach):
   1. He so hieu chinh khong vao bang tinh: khong chon duoc o Buoc 3, va neu file sua tay
      tro toi mot he so hieu chinh thi dong do bi chan.
   2. He so khong quy doi thang ra tan khi (theo khoi luong cac-bon, ni-to, theo %, theo
      nang luong) thi bao thang, khuyen dung cong thuc day du cua IPCC.
   3. He so theo m3 khi phai co khoi luong rieng, va dong ket qua ghi ro gia tri da dung.

   Ghi chu ve don vi theo TT38_Phu_luc_II.md muc 4: ty le ghi (%) ma cong thuc can phan so
   (eta lo, CE_CH4) thi chia 100 truoc khi tinh; CF ghi Gg/m3 nhung cong thuc chia 1000 ra
   tan chi dung voi kg/m3, nen ung dung dung kg/m3. */
var HS_HC={};
DATA.hs.forEach(function(r){ if(r[15]==='hc') HS_HC['QĐ2626:'+maHs(r)]=true; });

function chuanDv(s){ return String(s||'').replace(/₂/g,'2').replace(/₄/g,'4').replace(/³/g,'3').replace(/\s+/g,' ').trim(); }
/* Tu so cua don vi he so: tra ve { khi, f } voi f doi ra tan, { khi, m3:true }, hoac { khong:true } */
function tuSoDv(tu){
  var s=chuanDv(tu);
  if(!s) return { khong:true };
  if(/N2O-N|NH3-N|NOx-N|%|GJ|TJ|MJ|\bC\b|các-bon|carbon/i.test(s)) return { khong:true };
  var khi=null, m=s.match(/(CO2|CH4|N2O)(?:e|tđ|td|-eq)?/i);
  if(m){ khi=m[1].toUpperCase(); s=(s.slice(0,m.index)+' '+s.slice(m.index+m[0].length)).trim(); }
  s=s.toLowerCase().replace(/\s+/g,' ');
  if(s==='m3') return { khi:khi, m3:true };
  var f={ 'nghìn tấn':1000, 'nghin tan':1000, 'gg':1000, 'tấn':1, 'tan':1, 't':1, 'kg':0.001, 'g':0.000001 }[s];
  return (f==null) ? { khong:true } : { khi:khi, f:f };
}
function mauSoDv(dv){ var p=chuanDv(dv).split('/'); return p.length>1 ? p.slice(1).join('/').trim().toLowerCase() : ''; }
function tuDv(dv){ return chuanDv(dv).split('/')[0]; }
/* he so co quy doi thang ra tan khi duoc khong, dung o hop tra va o bang tinh */
function hsQuyDoiDuoc(donVi){ return !tuSoDv(tuDv(donVi)).khong; }

var MUC={ codinh:'1', didong:'1', moichat:'2.1', dien:'3', hoi:'4' };
/* Moi dong ket qua co k: he so doi don vi de luong khi (tan) = AD × EF × k, hoac AD × k khi
   cong thuc khong co EF (2.1, 5.2, 5.3). Bang tinh .xlsx dung dung k nay trong cong thuc. */
function ghiK(f,tu){ return f===1 ? '' : fill(t('tkDoiDv'),{a:chuanDv(tu),k:vietSo(f)}); }
function loiDong(n,y,muc,khi,loi){ return { n:n, y:y, muc:muc, khi:khi, loi:loi }; }

/* He so da gan cho nguon n, khi k, nam y (dien theo nam) */
function hsCua(n,k,y){ return layHs(n.id,k,LOAI_BY[n.loai].hs.theoNam?y:null,false); }
/* Kiem tra chung cua mot he so: co gia tri, khong phai he so hieu chinh */
function kiemHs(h){
  if(!h || h.giaTri==null) return t('tkThieuHs');
  if(HS_HC[h.maHeSo]) return t('tkHc');
  return null;
}
/* Doi he so ra tan khi tren mot don vi mau so. mau: mau so mong doi (ham kiem tra). */
function doiHs(h,khi,mau){
  if(rong(h.donVi)) return { loi:t('tkDvRong') };
  var tu=tuSoDv(tuDv(h.donVi));
  if(tu.khong) return { loi:t('tkKqd') };
  if(tu.khi && tu.khi!==khi) return { loi:fill(t('tkKhacKhi'),{a:KHI_NHAN[tu.khi],b:KHI_NHAN[khi]}) };
  if(!mau(mauSoDv(h.donVi))) return { loi:fill(t('tkMau'),{d:h.donVi||'—'}) };
  return tu;
}
/* GWP cua CO2 bang 1 theo dinh nghia o moi bao cao danh gia, khong phu thuoc bo da chon */
function gwpCua(khi){ if(khi==='CO2') return 1; var g=S.gwp && DATA.gwp[S.gwp]; return (g && g[khi]!=null) ? g[khi] : null; }

/* Nang luong tieu thu theo TJ cua mot dong so lieu dot nhien lieu. Nguon co dinh ghi
   san theo TJ, GJ, MJ thi doi thang; don vi khac nhan he so nhiet tri (TJ/don vi).
   Dung chung cho cot "Tong tieu thu (TJ)" o Buoc 2 va cho diem 1 Muc 2. */
var HE_TJ={ tj:1, gj:0.001, mj:0.000001 };
function tjCua(n,so){
  if(!so || so.gioTri==null) return null;
  var dv=so.donVi||'', he=HE_TJ[dv.toLowerCase()], nt=so.chiTiet.nhietTri;
  if(n.loai==='codinh' && he!=null) return { v:so.gioTri*he, ghi:he===1?'':vietSo(so.gioTri)+' '+dv };
  if(nt!=null) return { v:so.gioTri*nt, ghi:vietSo(so.gioTri)+' '+(dv||'')+' × '+vietSo(nt)+' TJ/'+(dv||'đv') };
  return null;
}

/* ---- tung diem cua Muc 2 ---- */
function tinhDot(n,y,so){                      /* Diem 1: TPT_F = Σ(AD_F × EF_F,i × GWP_i)/1000 */
  var out=[], ad=null, ly=null, adGhi='', dv=(so && so.donVi)||'';
  if(!so || so.gioTri==null) ly=t('tkThieuAd');
  else {
    var tj=tjCua(n,so);
    if(tj){ ad=tj.v; adGhi=tj.ghi; } else ly=t('tkThieuNt');
  }
  ['CO2','CH4','N2O'].forEach(function(k){
    if(ly){ out.push(loiDong(n,y,'1',k,ly)); return; }
    var h=hsCua(n,k,y), e=kiemHs(h);
    if(e){ out.push(loiDong(n,y,'1',k,e)); return; }
    var d=doiHs(h,k,function(m){ return m==='tj'; });
    if(d.loi){ out.push(loiDong(n,y,'1',k,d.loi)); return; }
    if(d.m3){ out.push(loiDong(n,y,'1',k,t('tkM3Sai'))); return; }
    out.push({ n:n, y:y, muc:'1', khi:k, ad:ad, adDv:'TJ', adGhi:adGhi, ef:h.giaTri, efDv:h.donVi, h:h, k:d.f, kGhi:ghiK(d.f,tuDv(h.donVi)), luong:ad*h.giaTri*d.f });
  });
  return out;
}
function tinhMoiChat(n,y,so){                   /* Diem 2.1: TPT_mcl = Σ(AD_j × GWP_j)/1000 */
  if(!so || so.gioTri==null) return [loiDong(n,y,'2.1','HFC',t('tkThieuAd'))];
  var h=hsCua(n,'GWP',y);
  if(!h || h.giaTri==null) return [loiDong(n,y,'2.1','HFC',t('tkThieuGwp'))];
  return [{ n:n, y:y, muc:'2.1', khi:'HFC', ad:so.gioTri, adDv:'kg', ef:null, h:h, k:0.001, kGhi:ghiK(0.001,'kg'), luong:so.gioTri/1000, gwpRieng:h.giaTri }];
}
function tinhDien(n,y,so){                      /* Diem 3: TPT_D = AD_n × EF_n */
  if(!so || so.gioTri==null) return [loiDong(n,y,'3','CO2',t('tkThieuAd'))];
  var h=hsCua(n,'CO2',y), e=kiemHs(h); if(e) return [loiDong(n,y,'3','CO2',e)];
  var d=doiHs(h,'CO2',function(m){ return m==='mwh'; }); if(d.loi) return [loiDong(n,y,'3','CO2',d.loi)];
  if(d.m3) return [loiDong(n,y,'3','CO2',t('tkM3Sai'))];
  return [{ n:n, y:y, muc:'3', khi:'CO2', ad:so.gioTri, adDv:'MWh', ef:h.giaTri, efDv:h.donVi, h:h, k:d.f, kGhi:ghiK(d.f,tuDv(h.donVi)), luong:so.gioTri*h.giaTri*d.f }];
}
/* EF_H,p cua hoi nam y: do don vi cap hoi cung cap, hoac tinh theo cong thuc Diem 4 sau
   dinh chinh QD 334: EF = Enthalpy / eta × EF_nhien lieu / 10^9, eta la phan so. */
function efHoi(n,y,so){
  var h=hsCua(n,'CO2',y); if(!h) return { loi:t('tkThieuHs') };
  if(h.thamSo.cachTinh!=='congThuc'){
    var e=kiemHs(h); if(e) return { loi:e };
    var d=doiHs(h,'CO2',function(m){ return /^(t|tấn|tan)( hơi| hoi)?$/.test(m); });
    if(d.loi) return { loi:d.loi }; if(d.m3) return { loi:t('tkM3Sai') };
    return { v:h.giaTri*d.f, h:h, ghi:'' };
  }
  var eta=h.thamSo.hieuSuat, efnl=h.thamSo.efNhienLieu, H=so && so.chiTiet.entanpi;
  if(eta==null || !(eta>0) || eta>100) return { loi:t('tkEta') };
  if(efnl==null) return { loi:t('tkEfNl') };
  if(H==null) return { loi:t('tkEntanpi') };
  var v=H/(eta/100)*efnl/1e9;
  return { v:v, h:h, ghi:vietSo(H)+' kJ/kg ÷ '+vietSo(eta/100)+' × '+vietSo(efnl)+' kg CO₂/TJ ÷ 10⁹' };
}
function tinhHoi(n,y,so){                        /* Diem 4: TPT_H,p = AD_H,p × EF_H,p */
  if(!so) return [loiDong(n,y,'4','CO2',t('tkThieuAd'))];
  var ad=so.gioTri, adGhi='';
  if(ad==null && so.chiTiet.khoiLuongGio!=null && so.chiTiet.soGio!=null){
    ad=so.chiTiet.khoiLuongGio*so.chiTiet.soGio; adGhi=vietSo(so.chiTiet.khoiLuongGio)+' tấn/giờ × '+vietSo(so.chiTiet.soGio)+' giờ';
  }
  if(ad==null) return [loiDong(n,y,'4','CO2',t('tkThieuAd'))];
  var ef=efHoi(n,y,so); if(ef.loi) return [loiDong(n,y,'4','CO2',ef.loi)];
  return [{ n:n, y:y, muc:'4', khi:'CO2', ad:ad, adDv:'tấn', adGhi:adGhi, ef:ef.v, efDv:'tCO₂/tấn hơi', efGhi:ef.ghi, h:ef.h, k:1, kGhi:'', luong:ad*ef.v }];
}
/* Muc 2 chi co cong thuc cho khai thac than ham lo va lo thien */
function ptCoCongThuc(n){ var cn=n.thuocTinh.congNghe; return /than/.test(nod(n.phanLoai)) && (cn==='hamlo' || cn==='lothien'); }
function tinhPhatTan(n,y,so){                    /* Diem 5.1 den 5.5, chi cho khai thac than */
  var cn=n.thuocTinh.congNghe;
  /* khoang san khac hoac phat tan tu may moc: nhu qua trinh cong nghiep, khong co cong thuc */
  if(!ptCoCongThuc(n)) return [{ n:n, y:y, muc:'5', khi:'', khongCT:true, loi:t('tkPtKhong') }];
  var hl=(cn==='hamlo'), mucCH4=hl?'5.1':'5.4', out=[];
  if(!so || so.gioTri==null) return [loiDong(n,y,mucCH4,'CH4',t('tkThieuAd'))];
  if(so.donVi!=='tấn') return [loiDong(n,y,mucCH4,'CH4',t('tkPtTan'))];
  function mot(khi,muc,bb){
    var h=hsCua(n,khi,y);
    if(!h && !bb) return;
    var e=kiemHs(h); if(e){ out.push(loiDong(n,y,muc,khi,e)); return; }
    var d=doiHs(h,khi,function(m){ return /^(t|tấn|tan)$/.test(m); });
    if(d.loi){ out.push(loiDong(n,y,muc,khi,d.loi)); return; }
    if(!d.m3){ out.push({ n:n, y:y, muc:muc, khi:khi, ad:so.gioTri, adDv:'tấn', ef:h.giaTri, efDv:h.donVi, h:h, k:d.f, kGhi:ghiK(d.f,tuDv(h.donVi)), luong:so.gioTri*h.giaTri*d.f }); return; }
    var cf=h.thamSo.cf; if(cf==null){ out.push(loiDong(n,y,muc,khi,t('tkCf'))); return; }
    out.push({ n:n, y:y, muc:muc, khi:khi, ad:so.gioTri, adDv:'tấn', ef:h.giaTri, efDv:h.donVi, h:h, cf:cf, k:cf/1000, kGhi:fill(t('tkKcf'),{c:vietSo(cf)}), luong:so.gioTri*h.giaTri*cf/1000 });
  }
  mot('CH4',mucCH4,true);
  if(!hl) mot('CO2','5.5',false);
  /* 5.2 va 5.3: CH4 thu gom dem dot, dung cung khoi luong rieng voi o CH4 */
  var ab=so.chiTiet.ch4Dot;
  if(ab!=null && ab>0){
    var hc=hsCua(n,'CH4',y), cf=hc && hc.thamSo.cf, ce=so.chiTiet.hieuSuatDot;
    if(cf==null) out.push(loiDong(n,y,'5.2','CO2',t('tkCf')));
    else if(ce==null || ce<0 || ce>100) out.push(loiDong(n,y,'5.2','CO2',t('tkCe')));
    else {
      var kg=ab*cf;
      out.push({ n:n, y:y, muc:'5.2', khi:'CO2', ad:ab, adDv:'m³ CH₄', ef:null, cf:cf, ce:ce, k:cf*(ce/100)*(44/16)/1000, kGhi:fill(t('tkK52'),{c:vietSo(cf),e:vietSo(ce)}), luong:kg*(ce/100)*(44/16)/1000 });
      out.push({ n:n, y:y, muc:'5.3', khi:'CH4', ad:ab, adDv:'m³ CH₄', ef:null, cf:cf, ce:ce, k:cf*(1-ce/100)/1000, kGhi:fill(t('tkK53'),{c:vietSo(cf),e:vietSo(ce)}), luong:kg*(1-ce/100)/1000 });
    }
  }
  return out;
}

/* Tong cua mot nam co thieu khong: 'tt', 'gt' theo nhom nguon, mac dinh la ca tong.
   Dung chung cho Buoc 4, 7, 8 va ban thao de cung mot tong mang cung mot nhan. */
function chuaDu(o,k){ return k==='tt' ? o.thieuTT>0 : k==='gt' ? o.thieuGT>0 : (o.loi+o.chuaGwp+o.khongCT)>0; }
/* Don vi do bo tinh ghi bang tieng Viet (file xuat giu tieng Viet); giao dien tieng Anh doi luc hien */
function dvHien(s){
  if(L==='vi' || !s) return s;
  return String(s).replace(/tấn hơi/g,'t steam').replace(/tấn\/giờ/g,'t/h').replace(/giờ/g,'h').replace(/tấn/g,'t').replace(/lít/g,'L').replace(/\bđv\b/g,'unit');
}
/* Toan bo bang tinh cua ky. Tra ve { dong:[...], tong:{ nam: {...} } } */
function tinhToan(){
  var ys=namKy(), dong=[];
  S.nguon.forEach(function(n){
    ys.forEach(function(y){
      var so=laySo(n.id,y,false), r;
      if(n.loai==='codinh' || n.loai==='didong') r=tinhDot(n,y,so);
      else if(n.loai==='moichat') r=tinhMoiChat(n,y,so);
      else if(n.loai==='dien') r=tinhDien(n,y,so);
      else if(n.loai==='hoi') r=tinhHoi(n,y,so);
      else if(n.loai==='phattan') r=tinhPhatTan(n,y,so);
      else r=[{ n:n, y:y, muc:'', khi:'', khongCT:true, loi:lv(LOAI_BY[n.loai].pp.canhBao) }];
      dong=dong.concat(r);
    });
  });
  dong.forEach(function(d){
    if(d.loi) return;
    /* luoi an toan: so khong hop le (NaN, vo cung) thanh dong loi co ly do, khong lan vao tong */
    if(!isFinite(d.luong)){ d.loi=t('tkKhongHopLe'); return; }
    d.gwp = d.gwpRieng!=null ? d.gwpRieng : gwpCua(d.khi);
    d.tco2e = d.gwp==null ? null : d.luong*d.gwp;
  });
  var tong={};
  ys.forEach(function(y){
    var o={ tong:0, tt:0, gt:0, khi:{ CO2:0, CH4:0, N2O:0, HFC:0 }, loai:{}, loi:0, khongCT:0, chuaGwp:0, thieuTT:0, thieuGT:0 };
    dong.filter(function(d){ return d.y===y; }).forEach(function(d){
      if(d.khongCT || d.loi || d.tco2e==null){ if(LOAI_BY[d.n.loai].gt) o.thieuGT++; else o.thieuTT++; }
      if(d.khongCT){ o.khongCT++; return; }
      if(d.loi){ o.loi++; return; }
      if(d.tco2e==null){ o.chuaGwp++; return; }
      o.tong+=d.tco2e;
      if(LOAI_BY[d.n.loai].gt) o.gt+=d.tco2e; else o.tt+=d.tco2e;
      o.khi[d.khi]=(o.khi[d.khi]||0)+d.tco2e;
      o.loai[d.n.loai]=(o.loai[d.n.loai]||0)+d.tco2e;
    });
    tong[y]=o;
  });
  return { dong:dong, tong:tong };
}
