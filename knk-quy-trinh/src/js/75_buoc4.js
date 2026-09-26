/* ---------- Buoc 4. Xac dinh phuong phap kiem ke, tinh toan ----------
   Dieu 19 Thong tu 38/2023/TT-BCT: KNK_i = AD_i × EF_i; TPT = Σ(KNK_i × GWP_i), cong
   thuc chi tiet theo Muc 2 Phu luc II. Chon bo GWP AR4 hoac AR5. */
Object.assign(T,{
  tkThieuAd:['Thiếu số liệu hoạt động (Bước 2)','Activity data missing (Step 2)'],
  tkThieuNt:['Thiếu hệ số nhiệt trị để đổi ra TJ (Bước 2)','Calorific value missing, needed to convert to TJ (Step 2)'],
  tkThieuHs:['Chưa gán hệ số (Bước 3)','No factor assigned (Step 3)'],
  tkThieuGwp:['Chưa nhập GWP của môi chất (Bước 3)','Refrigerant GWP missing (Step 3)'],
  tkHc:['Hệ số hiệu chỉnh bị chặn: hệ số này dùng bên trong công thức IPCC, không nhân trực tiếp với số liệu hoạt động','Correction factor blocked: it is used inside IPCC formulas and is never multiplied directly with activity data'],
  tkKqd:['Không tự tính: đơn vị hệ số không quy đổi thẳng ra tấn khí (theo khối lượng các-bon, ni-tơ, theo phần trăm hoặc theo năng lượng). Hãy dùng công thức đầy đủ của IPCC rồi nhập hệ số theo khối lượng khí.','Not computed: the factor unit does not convert directly to tonnes of gas (carbon or nitrogen mass, percent or energy basis). Use the full IPCC formula and enter a factor in mass of gas.'],
  tkDvRong:['Chưa ghi đơn vị của hệ số (Bước 3)','The factor has no unit (Step 3)'],
  tkKhacKhi:['Hệ số tính cho %a, khác khí %b của ô','The factor is for %a, not %b'],
  tkMau:['Đơn vị hệ số “%d” không khớp với số liệu hoạt động của công thức','The factor unit “%d” does not match the activity data of the formula'],
  tkM3Sai:['Hệ số theo m³ khí không dùng được ở công thức này','A factor per m³ of gas cannot be used in this formula'],
  tkEta:['Thiếu hiệu suất nồi hơi, hoặc hiệu suất không nằm trong khoảng 0 đến 100 %','Boiler efficiency missing or outside 0 to 100 %'],
  tkEfNl:['Thiếu hệ số CO₂ của nhiên liệu lò hơi','Boiler fuel CO₂ factor missing'],
  tkEntanpi:['Thiếu entanpi của hơi năm này (bảng 4.2, Bước 2)','Steam enthalpy missing for this year (table 4.2, Step 2)'],
  tkPtKhong:['Không tự tính: Mục 2 chỉ có công thức cho khai thác than hầm lò và lộ thiên','Not computed: Section 2 only has formulas for underground and surface coal mining'],
  tkPtTan:['Sản lượng phải tính theo tấn than, vì hệ số tính trên một tấn than','Output must be in tonnes of coal, since the factor is per tonne'],
  tkCf:['Thiếu khối lượng riêng để đổi m³ khí ra tấn (Bước 3)','Density missing to convert m³ of gas to tonnes (Step 3)'],
  tkCe:['Thiếu hiệu suất đốt CH₄, hoặc hiệu suất không nằm trong khoảng 0 đến 100 %','CH₄ combustion efficiency missing or outside 0 to 100 %'],
  b4gwpH:['Bộ GWP','GWP set'],
  b4gwpHint:['Tiềm năng nóng lên toàn cầu, điểm a và điểm c khoản 1 Điều 11 Nghị định 06/2022/NĐ-CP','Global warming potentials, Article 11(1)(a) and (c) of Decree 06/2022/ND-CP'],
  b4gwpP:['Nghị định chỉ quy định dùng hướng dẫn của IPCC, không chỉ định báo cáo đánh giá nào, và Quyết định 2626/QĐ-BTNMT không có GWP. Kiểm kê quốc gia kỳ 2016 trong BUR3 dùng AR5, còn Đóng góp do quốc gia tự quyết định năm 2022 dùng AR4. Ghi rõ bộ đã dùng và giữ nguyên qua các kỳ; đổi bộ thì phải tính toán lại kỳ trước ở Bước 7.','The Decree only requires IPCC guidance without naming an assessment report, and Decision 2626/QD-BTNMT has no GWPs. The 2016 national inventory in BUR3 uses AR5; the 2022 NDC uses AR4. State the set used and keep it across periods; switching requires recalculating the previous period in Step 7.'],
  b4gwpMc:['GWP của môi chất lạnh nhập tay ở Bước 3 phải lấy theo cùng bộ này.','Refrigerant GWPs entered by hand in Step 3 must come from the same set.'],
  b4gwpKhi:['Khí','Gas'],
  b4tongH:['Kết quả tổng hợp','Summary'],
  b4tongHint:['Tấn CO₂ tương đương, theo bộ GWP đã chọn','Tonnes CO₂ equivalent, with the chosen GWP set'],
  b4chuaGwp:['Chọn bộ GWP để quy đổi CH₄ và N₂O ra CO₂ tương đương.','Choose a GWP set to convert CH₄ and N₂O to CO₂ equivalent.'],
  b4ct:['Chỉ tiêu','Item'],
  b4tt:['Phát thải trực tiếp','Direct emissions'],
  b4gt:['Phát thải gián tiếp','Indirect emissions'],
  b4tong:['Tổng phát thải','Total emissions'],
  b4chuaDu:['chưa đủ','incomplete'],
  b4theoKhi:['Theo khí','By gas'],
  b4theoLoai:['Theo loại nguồn','By source type'],
  b4loi:['Năm %y: %n dòng chưa tính được, xem bảng tính chi tiết.','%y: %n rows could not be computed; see the detailed table.'],
  b4kct:['Năm %y: %n nguồn thuộc loại Thông tư 38 không có công thức, chưa gồm trong tổng.','%y: %n sources of a type with no formula in Circular 38 are not included in the total.'],
  b4ctH:['Bảng tính chi tiết','Detailed calculation'],
  b4ctHint:['Mỗi dòng là một khí của một nguồn; không lưu vào file, luôn tính lại từ số liệu','One row per gas per source; not stored in the file, always recomputed'],
  b4cN:['Nguồn','Source'], b4cD:['Điểm Mục 2','Section 2 point'], b4cK:['Khí','Gas'], b4cA:['Số liệu hoạt động','Activity data'],
  b4cE:['Hệ số phát thải','Emission factor'], b4cL:['Lượng khí (tấn)','Gas (tonnes)'], b4cG:['GWP','GWP'], b4cT:['tCO₂tđ','tCO₂e'],
  b4cf:['khối lượng riêng %c kg/m³','density %c kg/m³'],
  b4dot:['khối lượng riêng %c kg/m³ × hiệu suất đốt %e % × 44/16','density %c kg/m³ × combustion efficiency %e % × 44/16'],
  b4kc:['khối lượng riêng %c kg/m³ × (1 − hiệu suất đốt %e %)','density %c kg/m³ × (1 − combustion efficiency %e %)'],
  b4gwpMcl:['GWP môi chất','refrigerant GWP'],
  b4tongNam:['Tổng năm %y','Total %y'],
  b4ctThuc:['Công thức áp dụng','Formulas applied'],
  b4ctThucHint:['Mục 2 Phụ lục II Thông tư 38/2023/TT-BCT','Section 2, Appendix II of Circular 38/2023/TT-BCT'],
  b4f1:['Điểm 1, đốt nhiên liệu: TPT_F = Σ_i (AD_F × EF_F,i × GWP_i) / 1000, với AD_F theo TJ và EF theo kg/TJ. Bản in của Thông tư có dấu gạch ngang ở chỗ dấu bằng; ứng dụng đọc là dấu bằng.','Point 1, fuel combustion: TPT_F = Σ_i (AD_F × EF_F,i × GWP_i) / 1000, with AD_F in TJ and EF in kg/TJ. The printed Circular shows a dash where the equals sign belongs; the app reads it as equals.'],
  b4f2:['Điểm 2.1, môi chất lạnh: TPT_mcl = Σ_j (AD_j × GWP_j) / 1000, AD_j là lượng mua bổ sung trong năm theo kg. Phương pháp 2.2 theo giai đoạn lắp đặt, vận hành, thải bỏ chưa được hỗ trợ.','Point 2.1, refrigerants: TPT_mcl = Σ_j (AD_j × GWP_j) / 1000, AD_j being the kg added in the year. Method 2.2 by installation, operation and disposal stages is not supported yet.'],
  b4f3:['Điểm 3, điện mua ngoài: TPT_Đ = AD_n × EF_n, AD theo MWh, EF theo tấn CO₂/MWh.','Point 3, purchased electricity: TPT = AD_n × EF_n, AD in MWh, EF in t CO₂/MWh.'],
  b4f4:['Điểm 4, hơi mua ngoài: TPT_H,p = AD_H,p × EF_H,p. Khi tự tính: EF_H,p = Entanpi_H,p ÷ η_lò × EF_nhiên liệu ÷ 10⁹, đã áp dụng đính chính của Quyết định 334/QĐ-BCT, η_lò dùng dạng phân số.','Point 4, purchased steam: TPT_H,p = AD_H,p × EF_H,p. When computed: EF_H,p = Enthalpy ÷ η × EF_fuel ÷ 10⁹, with the correction of Decision 334/QD-BCT and η as a fraction.'],
  b4f5:['Điểm 5, khai thác than: E_CH4 = PQ × EF × CF / 1000 (5.1 hầm lò, 5.4 lộ thiên); E_CO2 = PQ × EF_CO2 × CF_CO2 / 1000 (5.5); đốt CH₄ thu gom: E_CO2(CH4) = AB × CF × CE × 44/16 / 1000 (5.2) và E_CH4,kc = AB × CF × (1 − CE) / 1000 (5.3). CF dùng theo kg/m³, CE dùng dạng phân số.','Point 5, coal mining: E_CH4 = PQ × EF × CF / 1000 (5.1 underground, 5.4 surface); E_CO2 = PQ × EF_CO2 × CF_CO2 / 1000 (5.5); flaring captured CH₄: E_CO2(CH4) = AB × CF × CE × 44/16 / 1000 (5.2) and E_CH4,kc = AB × CF × (1 − CE) / 1000 (5.3). CF in kg/m³, CE as a fraction.'],
  b4thuHoi:['Thông tư 38 không nêu việc trừ lượng CH₄ thu gom đem đốt khỏi phát thải CH₄ của khai thác, trong khi Hướng dẫn IPCC 2006, Tập 2, Chương 4 có trừ phần CH₄ thu hồi. Ứng dụng tính đúng như Thông tư: cộng cả điểm 5.1, 5.2 và 5.3, không trừ. Cơ sở cần tự xem xét và ghi rõ trong mô tả phương pháp.','Circular 38 does not say to deduct captured and flared CH₄ from mining CH₄ emissions, whereas the 2006 IPCC Guidelines, Vol. 2, Ch. 4 deduct recovered CH₄. The app follows the Circular: points 5.1, 5.2 and 5.3 are all added, nothing is deducted. The facility should review this and state it in the method description.'],
  b4ppH:['Mô tả phương pháp','Method description'],
  b4ppHint:['Mục III.1 Mẫu số 06: phương pháp thu thập số liệu, hệ số phát thải','Form 06, item III.1: data collection method, emission factors'],
  b4ppLab:['Mô tả bổ sung, ví dụ bậc phương pháp, lý do chọn bộ GWP, cách xử lý số liệu thiếu','Additional notes, e.g. method tier, reason for the GWP set, handling of missing data'],
  b4mGwp:['Chọn bộ GWP','Choose a GWP set'],
  b4mLoi:['%n, năm %y, %k: %l','%n, %y, %k: %l']
});
var UI4={ nam:null };
function sGon(v,d){ return v==null ? '' : vietSo(v,d==null?3:d); }

VE[4]=function(sec){
  var kq=tinhToan(), ys=namKy();
  /* bo GWP */
  var cb=theCard(sec,t('b4gwpH'),t('b4gwpHint'));
  cb.appendChild(el('p',null,t('b4gwpP')));
  var rg=el('div','qt-radgrp');
  ['AR4','AR5'].forEach(function(k){
    var lab=el('label','qt-chk'), i=el('input'); i.type='radio'; i.name='qt-gwp'; i.value=k; i.checked=S.gwp===k;
    i.setAttribute('data-b','p|gwp'); i.setAttribute('data-k','radio');
    lab.appendChild(i); lab.appendChild(el('span',null,k)); rg.appendChild(lab);
  });
  cb.appendChild(rg);
  var w=el('div','qt-tbw'), tb=el('table','qt-t'); w.style.maxWidth='420px';
  var hr=el('tr'); [t('b4gwpKhi'),'AR4','AR5'].forEach(function(x,i){ var th=el('th',i&&S.gwp===x?'qt-them':null,x); hr.appendChild(th); });
  var th0=el('thead'); th0.appendChild(hr); tb.appendChild(th0);
  var bd=el('tbody');
  ['CO2','CH4','N2O'].forEach(function(k){
    var r=el('tr'); r.appendChild(el('td',null,KHI_NHAN[k]));
    ['AR4','AR5'].forEach(function(s){ var td=el('td',S.gwp===s?'qt-them qt-calc':'qt-calc',String((DATA.gwp[s]||{})[k])); td.setAttribute('data-gwp',s+'|'+k); r.appendChild(td); });
    bd.appendChild(r);
  });
  tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
  if(nguonTheoLoai('moichat').length) cb.appendChild(el('p','qt-note',t('b4gwpMc')));
  if(!ys.length || !S.nguon.length){
    var a=el('div','qt-alert'); a.textContent=!ys.length?t('b2ky'):t('b3chuaNguon'); sec.appendChild(a); veCongThuc(sec); return;
  }
  veTong4(sec,kq,ys);
  veChiTiet4(sec,kq,ys);
  veCongThuc(sec);
  cb=theCard(sec,t('b4ppH'),t('b4ppHint'));
  var g=el('div','qt-grid'); cb.appendChild(g);
  g.appendChild(truong(t('b4ppLab'), oNhap({kieu:'area'},'p|moTa.phuongPhap',S.moTa.phuongPhap), false, null, true));
};
function veTong4(sec,kq,ys){
  var cb=theCard(sec,t('b4tongH'),t('b4tongHint')); cb.parentNode.id='b4-tong';
  if(!S.gwp) cb.appendChild(el('div','qt-alert',t('b4chuaGwp')));
  var w=el('div','qt-tbw'), tb=el('table','qt-t'), hr=el('tr');
  [t('b4ct')].concat(ys.map(function(y){ return fill(t('b2nam'),{y:y}); })).forEach(function(x){ hr.appendChild(el('th',null,x)); });
  var th=el('thead'); th.appendChild(hr); tb.appendChild(th);
  var bd=el('tbody');
  function dong(nhan,f,dam,cls){
    var r=el('tr',cls||null); var c=el('td',null,nhan); if(dam) c.style.fontWeight='650'; r.appendChild(c);
    ys.forEach(function(y){
      var o=kq.tong[y], v=f(o), td=el('td','qt-calc',v==null?'':sGon(v));
      td.setAttribute('data-tong',y+'|'+nhan); if(dam) td.style.fontSize='14px';
      if(v!=null && (o.loi || o.chuaGwp)){ td.appendChild(document.createTextNode(' ')); td.appendChild(el('span','qt-chip qt-cw',t('b4chuaDu'))); }
      r.appendChild(td);
    });
    bd.appendChild(r);
  }
  dong(t('b4tt'),function(o){ return o.tt; });
  dong(t('b4gt'),function(o){ return o.gt; });
  dong(t('b4tong'),function(o){ return o.tong; },true);
  var sub=el('tr','qt-tr-trace'), sc=el('td',null,t('b4theoKhi')); sc.colSpan=ys.length+1; sc.style.fontWeight='650'; sub.appendChild(sc); bd.appendChild(sub);
  ['CO2','CH4','N2O','HFC'].forEach(function(k){
    if(!ys.some(function(y){ return kq.tong[y].khi[k]; })) return;
    dong(KHI_NHAN[k],function(o){ return o.khi[k]; });
  });
  var sub2=el('tr','qt-tr-trace'), sc2=el('td',null,t('b4theoLoai')); sc2.colSpan=ys.length+1; sc2.style.fontWeight='650'; sub2.appendChild(sc2); bd.appendChild(sub2);
  LOAI.forEach(function(l){
    if(!ys.some(function(y){ return kq.tong[y].loai[l.k]!=null; })) return;
    dong(lv(l.ten),function(o){ return o.loai[l.k]; });
  });
  tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
  ys.forEach(function(y){
    var o=kq.tong[y];
    if(o.loi) cb.appendChild(el('div','qt-alert',fill(t('b4loi'),{y:y,n:o.loi})));
    if(o.khongCT) cb.appendChild(el('div','qt-info',fill(t('b4kct'),{y:y,n:o.khongCT})));
  });
}
function veChiTiet4(sec,kq,ys){
  if(ys.indexOf(UI4.nam)<0) UI4.nam=ys[0];
  var y=UI4.nam;
  var cb=theCard(sec,t('b4ctH'),t('b4ctHint')); cb.parentNode.id='b4-chitiet';
  var tabs=el('div','qt-tabs');
  ys.forEach(function(x){ var b=nut(fill(t('b2nam'),{y:x}),'nam4|'+x); if(x===y) b.classList.add('on'); tabs.appendChild(b); });
  cb.appendChild(tabs);
  var w=el('div','qt-tbw'), tb=el('table','qt-t'), hr=el('tr');
  ['#',t('b4cN'),t('b4cD'),t('b4cK'),t('b4cA'),t('b4cE'),t('b4cL'),t('b4cG'),t('b4cT')].forEach(function(x,i){ hr.appendChild(el('th',i===0?'qt-stt':null,x)); });
  var th=el('thead'); th.appendChild(hr); tb.appendChild(th);
  var bd=el('tbody'), stt=0, truoc=null;
  kq.dong.filter(function(d){ return d.y===y; }).forEach(function(d){
    var r=el('tr'); stt++;
    r.setAttribute('data-dong',d.n.id+'|'+(d.muc||'-')+'|'+(d.khi||'-'));
    r.appendChild(el('td','qt-stt',String(stt)));
    r.appendChild(el('td',null,truoc===d.n?'':nhanNguon(d.n))); truoc=d.n;
    r.appendChild(el('td',null,d.muc?d.muc:''));
    r.appendChild(el('td',null,d.khi?(KHI_NHAN[d.khi]||d.khi):''));
    if(d.loi){
      var td=el('td',null,d.loi); td.colSpan=5; td.style.color=d.khongCT?'#23458f':'#b42318'; td.style.whiteSpace='normal'; r.appendChild(td);
      bd.appendChild(r); return;
    }
    var a=el('td','qt-calc',sGon(d.ad,6)+' '+d.adDv); if(d.adGhi) a.appendChild(el('small',null,' = '+d.adGhi)); r.appendChild(a);
    var e=el('td');
    if(d.muc==='5.2') e.textContent=fill(t('b4dot'),{c:vietSo(d.cf),e:vietSo(d.ce)});
    else if(d.muc==='5.3') e.textContent=fill(t('b4kc'),{c:vietSo(d.cf),e:vietSo(d.ce)});
    else if(d.muc==='2.1') e.textContent='—';
    else {
      e.appendChild(el('span','qt-calc',vietSo(d.ef,6)+' '+(d.efDv||'')));
      if(d.efGhi) e.appendChild(el('small',null,' = '+d.efGhi));
      if(d.cf!=null) e.appendChild(el('small',null,' × '+fill(t('b4cf'),{c:vietSo(d.cf)})));
      if(d.h && d.h.maHeSo && /^QĐ2626:/.test(d.h.maHeSo)) e.appendChild(el('small',null,' · '+d.h.maHeSo.replace(':',' ')));
    }
    r.appendChild(e);
    r.appendChild(el('td','qt-calc',sGon(d.luong,6)));
    var g=el('td','qt-calc',d.gwp==null?'—':vietSo(d.gwp)); if(d.gwpRieng!=null) g.appendChild(el('small',null,' '+t('b4gwpMcl'))); r.appendChild(g);
    var tc=el('td','qt-calc',d.tco2e==null?'':sGon(d.tco2e)); tc.style.fontWeight='650'; r.appendChild(tc);
    bd.appendChild(r);
  });
  var fr=el('tr'), fc=el('td',null,fill(t('b4tongNam'),{y:y})); fc.colSpan=8; fc.style.textAlign='right'; fc.style.fontWeight='650'; fr.appendChild(fc);
  var ft=el('td','qt-calc',sGon(kq.tong[y].tong)); ft.style.fontWeight='700'; ft.setAttribute('data-tong',y+'|chitiet'); fr.appendChild(ft);
  bd.appendChild(fr);
  tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
}
function veCongThuc(sec){
  var co={}; S.nguon.forEach(function(n){ co[n.loai]=1; });
  var ds=[]; if(co.codinh||co.didong) ds.push('b4f1'); if(co.moichat) ds.push('b4f2'); if(co.dien) ds.push('b4f3'); if(co.hoi) ds.push('b4f4'); if(co.phattan) ds.push('b4f5');
  if(!ds.length) return;
  var cb=theCard(sec,t('b4ctThuc'),t('b4ctThucHint'));
  var ul=el('ul','qt-missing'); ul.style.fontSize='13px'; ds.forEach(function(k){ ul.appendChild(el('li',null,t(k))); }); cb.appendChild(ul);
  if(nguonTheoLoai('phattan').some(function(n){ return namKy().some(function(y){ var so=laySo(n.id,y,false); return so && so.chiTiet.ch4Dot>0; }); }))
    cb.appendChild(el('div','qt-alert',t('b4thuHoi')));
}
THIEU[4]=function(){
  var m=[];
  if(!S.gwp) m.push(t('b4mGwp'));
  if(!namKy().length) return m.concat([t('b2mKy')]);
  if(!S.nguon.length) return m.concat([t('b3mNguon')]);
  tinhToan().dong.forEach(function(d){
    if(d.loi && !d.khongCT) m.push(fill(t('b4mLoi'),{ n:nhanNguon(d.n), y:d.y, k:KHI_NHAN[d.khi]||d.khi, l:d.loi }));
  });
  return m;
};
ACT.nam4=function(p){ UI4.nam=+p[0]; veLai(); };
