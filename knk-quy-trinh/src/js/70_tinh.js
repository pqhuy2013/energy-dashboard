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

/* ---- tung diem cua Muc 2 ---- */
function tinhDot(n,y,so){                      /* Diem 1: TPT_F = Σ(AD_F × EF_F,i × GWP_i)/1000 */
  var out=[], ad=null, ly=null, adGhi='', dv=(so && so.donVi)||'';
  if(!so || so.gioTri==null) ly=t('tkThieuAd');
  else {
    var heTJ={ tj:1, gj:0.001, mj:0.000001 }[dv.toLowerCase()], nt=so.chiTiet.nhietTri;
    if(n.loai==='codinh' && heTJ!=null){ ad=so.gioTri*heTJ; if(heTJ!==1) adGhi=vietSo(so.gioTri)+' '+dv; }
    else if(nt!=null){ ad=so.gioTri*nt; adGhi=vietSo(so.gioTri)+' '+(dv||'')+' × '+vietSo(nt)+' TJ/'+(dv||'đv'); }
    else ly=t('tkThieuNt');
  }
  ['CO2','CH4','N2O'].forEach(function(k){
    if(ly){ out.push(loiDong(n,y,'1',k,ly)); return; }
    var h=hsCua(n,k,y), e=kiemHs(h);
    if(e){ out.push(loiDong(n,y,'1',k,e)); return; }
    var d=doiHs(h,k,function(m){ return m==='tj'; });
    if(d.loi){ out.push(loiDong(n,y,'1',k,d.loi)); return; }
    if(d.m3){ out.push(loiDong(n,y,'1',k,t('tkM3Sai'))); return; }
    out.push({ n:n, y:y, muc:'1', khi:k, ad:ad, adDv:'TJ', adGhi:adGhi, ef:h.giaTri, efDv:h.donVi, h:h, luong:ad*h.giaTri*d.f });
  });
  return out;
}
function tinhMoiChat(n,y,so){                   /* Diem 2.1: TPT_mcl = Σ(AD_j × GWP_j)/1000 */
  if(!so || so.gioTri==null) return [loiDong(n,y,'2.1','HFC',t('tkThieuAd'))];
  var h=hsCua(n,'GWP',y);
  if(!h || h.giaTri==null) return [loiDong(n,y,'2.1','HFC',t('tkThieuGwp'))];
  return [{ n:n, y:y, muc:'2.1', khi:'HFC', ad:so.gioTri, adDv:'kg', ef:null, h:h, luong:so.gioTri/1000, gwpRieng:h.giaTri }];
}
function tinhDien(n,y,so){                      /* Diem 3: TPT_D = AD_n × EF_n */
  if(!so || so.gioTri==null) return [loiDong(n,y,'3','CO2',t('tkThieuAd'))];
  var h=hsCua(n,'CO2',y), e=kiemHs(h); if(e) return [loiDong(n,y,'3','CO2',e)];
  var d=doiHs(h,'CO2',function(m){ return m==='mwh'; }); if(d.loi) return [loiDong(n,y,'3','CO2',d.loi)];
  if(d.m3) return [loiDong(n,y,'3','CO2',t('tkM3Sai'))];
  return [{ n:n, y:y, muc:'3', khi:'CO2', ad:so.gioTri, adDv:'MWh', ef:h.giaTri, efDv:h.donVi, h:h, luong:so.gioTri*h.giaTri*d.f }];
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
  return [{ n:n, y:y, muc:'4', khi:'CO2', ad:ad, adDv:'tấn', adGhi:adGhi, ef:ef.v, efDv:'tCO₂/tấn hơi', efGhi:ef.ghi, h:ef.h, luong:ad*ef.v }];
}
function tinhPhatTan(n,y,so){                    /* Diem 5.1 den 5.5, chi cho khai thac than */
  var cn=n.thuocTinh.congNghe;
  if(!/than/.test(nod(n.phanLoai)) || (cn!=='hamlo' && cn!=='lothien')) return [loiDong(n,y,'5','CH4',t('tkPtKhong'))];
  var hl=(cn==='hamlo'), mucCH4=hl?'5.1':'5.4', out=[];
  if(!so || so.gioTri==null) return [loiDong(n,y,mucCH4,'CH4',t('tkThieuAd'))];
  if(so.donVi!=='tấn') return [loiDong(n,y,mucCH4,'CH4',t('tkPtTan'))];
  function mot(khi,muc,bb){
    var h=hsCua(n,khi,y);
    if(!h && !bb) return;
    var e=kiemHs(h); if(e){ out.push(loiDong(n,y,muc,khi,e)); return; }
    var d=doiHs(h,khi,function(m){ return /^(t|tấn|tan)$/.test(m); });
    if(d.loi){ out.push(loiDong(n,y,muc,khi,d.loi)); return; }
    if(!d.m3){ out.push({ n:n, y:y, muc:muc, khi:khi, ad:so.gioTri, adDv:'tấn', ef:h.giaTri, efDv:h.donVi, h:h, luong:so.gioTri*h.giaTri*d.f }); return; }
    var cf=h.thamSo.cf; if(cf==null){ out.push(loiDong(n,y,muc,khi,t('tkCf'))); return; }
    out.push({ n:n, y:y, muc:muc, khi:khi, ad:so.gioTri, adDv:'tấn', ef:h.giaTri, efDv:h.donVi, h:h, cf:cf, luong:so.gioTri*h.giaTri*cf/1000 });
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
      out.push({ n:n, y:y, muc:'5.2', khi:'CO2', ad:ab, adDv:'m³ CH₄', cf:cf, ce:ce, luong:kg*(ce/100)*(44/16)/1000 });
      out.push({ n:n, y:y, muc:'5.3', khi:'CH4', ad:ab, adDv:'m³ CH₄', cf:cf, ce:ce, luong:kg*(1-ce/100)/1000 });
    }
  }
  return out;
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
    d.gwp = d.gwpRieng!=null ? d.gwpRieng : gwpCua(d.khi);
    d.tco2e = d.gwp==null ? null : d.luong*d.gwp;
  });
  var tong={};
  ys.forEach(function(y){
    var o={ tong:0, tt:0, gt:0, khi:{ CO2:0, CH4:0, N2O:0, HFC:0 }, loai:{}, loi:0, khongCT:0, chuaGwp:0 };
    dong.filter(function(d){ return d.y===y; }).forEach(function(d){
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
