/* ---------- buoc 0 ---------- */
function veSelects(){
  var tinh=$('f-tinh'), bo=$('f-bo'), ky=$('f-ky');
  function opts(sel, rows, first, val){
    sel.innerHTML='';
    var o=el('option',null,first); o.value=''; sel.appendChild(o);
    var seen=false;
    rows.forEach(function(r){ var x=el('option',null,lv(r)); x.value=r[0]; if(r[0]===val) seen=true; sel.appendChild(x); });
    if(val && !seen){ var y=el('option',null,val); y.value=val; sel.appendChild(y); }
    sel.value=val||'';
  }
  var tinhRows=DATA.tinh.slice().sort(function(a,b){ return a[0].localeCompare(b[0],'vi'); });
  opts(tinh, tinhRows, t('tinhchoose'), S.coSo.tinh);
  opts(bo, DATA.bo, t('bochoose'), S.coSo.boQuanLy);
  /* ky: nam dau tu 2022, nam 2022 la nam dau tien co nghia vu kiem ke co so, toi nam dung - 1 */
  ky.innerHTML='';
  var o0=el('option',null,t('kychoose')); o0.value=''; ky.appendChild(o0);
  var a=S.ky.namBatDau, b=S.ky.namKetThuc, found=false;
  for(var y=2022; y<=BUILD_YEAR-1; y++){
    var o=el('option',null,fill(t('kyopt'),{a:y,b:y+1})); o.value=y+'-'+(y+1); ky.appendChild(o);
    if(a===y && b===y+1) found=true;
  }
  if(a && b && !found){ var x=el('option',null,fill(t(b===a+1?'kyopt':'kyodd'),{a:a,b:b})); x.value=a+'-'+b; ky.appendChild(x); }
  ky.value=(a&&b)?a+'-'+b:'';
}
function dienForm(){
  document.querySelectorAll('#pane-buoc-0 [data-f]').forEach(function(e){
    var v=getP(S,e.dataset.f);
    if(e.type==='radio') e.checked=(v===e.value);
    else if(e.tagName!=='SELECT') e.value=(v==null?'':v);
  });
  veSelects(); veB0();
}
function thieuB0(){
  var m=[];
  if(!S.coSo.nhom) m.push(t('nhomh'));
  if(!(S.ky.namBatDau&&S.ky.namKetThuc)) m.push(t('kyh'));
  else if(S.ky.namKetThuc!==S.ky.namBatDau+1) m.push(t('kyLienKe'));
  if(!S.coSo.ten.trim()) m.push(t('ften'));
  if(!S.coSo.diaChi.trim()) m.push(t('fdiachi'));
  return m;
}
function veB0(){
  document.querySelectorAll('#qt-nhom .qt-radio').forEach(function(r){ r.classList.toggle('on', r.dataset.v===S.coSo.nhom); });
  var a=S.ky.namBatDau, b=S.ky.namKetThuc, tp=$('qt-title-preview');
  tp.innerHTML='';
  if(a&&b){
    tp.appendChild(document.createTextNode(t('tpLab')+' '));
    tp.appendChild(el('b',null,'BÁO CÁO Kết quả kiểm kê khí nhà kính cho năm '+a+' và năm '+b));
  } else tp.textContent=t('tpNone');
  var mst=S.coSo.maSoThue.trim();
  $('w-mst').textContent=(mst && !/^\d{10}(-\d{3})?$/.test(mst)) ? t('wmst') : '';
  $('w-ky').textContent=canhBaoKy();
  var bo=S.coSo.boQuanLy;
  $('w-bo').textContent=(bo && bo!==BO_MAC_DINH) ? t('wbo') : '';
  var miss=thieuB0(), mb=$('qt-b0-miss');
  $('qt-b0-ok').hidden=miss.length>0;
  mb.hidden=miss.length===0; mb.innerHTML='';
  if(miss.length){
    mb.appendChild(el('b',null,t('b0miss')));
    var ul=el('ul','qt-missing'); miss.forEach(function(x){ ul.appendChild(el('li',null,x)); }); mb.appendChild(ul);
  }
}
function ganForm(){
  document.querySelectorAll('#pane-buoc-0 [data-f]').forEach(function(e){
    var ev=(e.tagName==='SELECT'||e.type==='radio'||e.type==='date')?'change':'input';
    e.addEventListener(ev,function(){
      if(e.type==='radio' && !e.checked) return;
      setP(S,e.dataset.f,e.value); daSua();
    });
  });
  $('f-ky').addEventListener('change',function(){
    var v=this.value;
    if(!v){ S.ky.namBatDau=null; S.ky.namKetThuc=null; }
    else { var p=v.split('-'); S.ky.namBatDau=+p[0]; S.ky.namKetThuc=+p[1]; }
    daSua();
  });
}
THIEU[0]=thieuB0;

/* ---------- tra danh muc co so, goi y nhom ----------
   Danh muc 2.441 co so theo Quyet dinh 42/2026/QD-TTg va 110 co so duoc phan bo han
   ngach theo Quyet dinh 699/QD-BNNMT, lay tu dashboard knk/. Cach suy nhom giong het
   dashboard: co ten trong QD 699 thi nhom B; con lai goi y nhom A, kem luu y khi nganh
   nghe thuoc dien co the duoc phan bo han ngach. Chi la goi y, nguoi dung tu quyet. */
Object.assign(T,{
  traH:['Tra danh mục cơ sở phải kiểm kê','Look up the facility list'],
  traHint:['Quyết định 42/2026/QĐ-TTg, 2.441 cơ sở; Quyết định 699/QĐ-BNNMT, 110 cơ sở được phân bổ hạn ngạch','Decision 42/2026/QD-TTg, 2,441 facilities; Decision 699/QD-BNNMT, 110 facilities with quotas'],
  traLab:['Tên, địa chỉ hoặc mã số thuế','Name, address or tax code'],
  traPh:['Gõ không dấu cũng được, ví dụ: thep hoa phat','Diacritics optional, e.g. thep hoa phat'],
  traGo:['Gõ ít nhất 2 ký tự để tìm.','Type at least 2 characters to search.'],
  traKo:['Không tìm thấy trong danh mục. Cơ sở không có tên trong Quyết định 42/2026/QĐ-TTg thì không phát sinh nghĩa vụ kiểm kê cấp cơ sở.','Not found. A facility not listed in Decision 42/2026/QD-TTg has no facility-level inventory obligation.'],
  traSo:['Hiện %a trên %b kết quả, gõ thêm để thu hẹp.','Showing %a of %b results; type more to narrow down.'],
  traPl:['Phụ lục %p, số thứ tự %s','Appendix %p, no. %s'],
  traChip699:['QĐ 699','Decision 699'],
  traChipNganh:['Ngành hạn ngạch','Quota sector'],
  traGoiY:['Gợi ý: nhóm %g.','Suggestion: group %g.'],
  traB:['Cơ sở có tên trong Quyết định 699/QĐ-BNNMT ngày 27/2/2026, thuộc nhóm %n. Hạn ngạch năm 2025: %a, năm 2026: %b tấn CO₂ tương đương.','The facility is in Decision 699/QD-BNNMT of 27 Feb 2026, category %n. Quota 2025: %a, 2026: %b tCO₂e.'],
  traBRoi:['Cơ sở có tên trong Quyết định 699/QĐ-BNNMT nhưng không ghép được với dòng nào của danh mục Quyết định 42/2026/QĐ-TTg.','The facility is in Decision 699/QD-BNNMT but could not be matched to a row of Decision 42/2026/QD-TTg.'],
  traANganh:['Ngành nghề ghi trong danh mục là nhiệt điện, sắt thép hoặc xi măng. Điểm c khoản 4 Điều 11 áp dụng cho nhà máy nhiệt điện, cơ sở sản xuất sắt thép, cơ sở sản xuất xi măng thuộc danh mục do Thủ tướng Chính phủ ban hành, không nêu điều kiện phải có tên trong Quyết định 699/QĐ-BNNMT; cơ sở thuộc điểm c không thực hiện điểm b (nhóm A) và không thuộc điểm d (nhóm C). Cơ sở không có tên trong Quyết định 699/QĐ-BNNMT, nên cần xác định với bộ quản lý lĩnh vực mình có thuộc điểm c hay không: thuộc thì chọn nhóm B; không thuộc, ví dụ chỉ đúc hoặc gia công sản phẩm thép, thì chọn nhóm A.',
              'The listed activity is thermal power, iron and steel, or cement. Article 11(4)(c) covers thermal power plants, iron and steel producers and cement producers on the Prime Minister’s list, with no condition of being in Decision 699/QD-BNNMT; such facilities do not follow point b (group A) and are not under point d (group C). This facility is not in Decision 699/QD-BNNMT, so it should confirm with its managing ministry whether point c applies: if so, choose group B; if not, for example if it only casts or processes steel products, choose group A.'],
  traGoiY2:['Gợi ý: nhóm B hoặc nhóm A.','Suggestion: group B or group A.'],
  traBNhieu:['Cơ sở ứng với %n dòng của Quyết định 699/QĐ-BNNMT ngày 27/2/2026, có thể là các pháp nhân khác nhau; đối chiếu tên và mã số thuế:','The facility matches %n rows of Decision 699/QD-BNNMT of 27 Feb 2026, possibly different legal entities; check the name and tax code:'],
  traBDong:['%t, mã số thuế %m, nhóm %n: hạn ngạch năm 2025 %a, năm 2026 %b tấn CO₂ tương đương.','%t, tax code %m, category %n: quota 2025 %a, 2026 %b tCO₂e.'],
  traMstNhieu:['Có nhiều mã số thuế khác nhau nên không tự điền mã số thuế; nhập tay mã của cơ sở.','Several different tax codes, so the tax code was not filled in; enter the facility’s own code.'],
  traA:['Cơ sở có tên trong danh mục Quyết định 42/2026/QĐ-TTg và không có tên trong Quyết định 699/QĐ-BNNMT.','The facility is in Decision 42/2026/QD-TTg and not in Decision 699/QD-BNNMT.'],
  traLuuY:['Đây là gợi ý dựa trên danh mục, không phải kết luận pháp lý. Cơ sở tự xác định nhóm của mình, bấm áp dụng xong vẫn sửa lại được.','This is a suggestion based on the lists, not a legal conclusion. The facility determines its own group and can change it after applying.'],
  traDien:['Điền thông tin từ danh mục','Fill in from the list'],
  traNhom:['Áp dụng nhóm %g','Apply group %g'],
  traDaDien:['Đã điền %n trường từ danh mục.','Filled %n fields from the list.'],
  traDaNhom:['Đã chọn nhóm %g.','Group %g selected.'],
  traNganh:['Ngành nghề','Activity'],
  traBo:['Bộ quản lý','Ministry']
});
var TRA=null, traChon=-1;
function dungTra(){
  if(TRA) return TRA;
  var hqCua={};   /* chi so co so -> cac dong QD 699 */
  Object.keys(DATA.hqmap).forEach(function(k){ hqCua[k]=DATA.hqmap[k]; });
  TRA=DATA.cs.map(function(r,i){
    var hq=hqCua[String(i)]||[];
    var mst=hq.map(function(j){ return DATA.hq[j][4]; }).join(' ');
    return { cs:i, hq:hq, s:nod(r[3]+' '+r[4]+' '+mst) };
  });
  DATA.hqRoi.forEach(function(j){ var x=DATA.hq[j]; TRA.push({ cs:null, hq:[j], s:nod(x[2]+' '+x[3]+' '+x[4]) }); });
  return TRA;
}
/* B: co ten trong QD 699. BA: nganh nhiet dien, sat thep, xi mang nhung khong co ten trong
   QD 699, diem c khoan 4 Dieu 11 co the ap dung, co so tu xac dinh. A: con lai. */
function nhomGoiY(it){
  if(it.hq.length) return 'B';
  if(it.cs!=null && DATA.cs[it.cs][7]) return 'BA';
  return 'A';
}
/* Ky so lieu dau tien cua tung nhom, diem b, c, d khoan 4 Dieu 11 sua doi boi Nghi dinh 119 */
var NAM_DAU={ A:2024, B:2026, C:2028 };
function canhBaoKy(){
  var a=S.ky.namBatDau, b=S.ky.namKetThuc, g=S.coSo.nhom, d=NAM_DAU[g];
  if(!a || !b || b!==a+1 || !d) return '';
  var c=t('nhom'+g+'c'); c=c.charAt(0).toLocaleLowerCase()+c.slice(1);
  if(a<d) return fill(t('wKyTruoc'),{g:g,d:d,c:c,a:a,b:b});
  if((a-d)%2) return fill(t('wKyLech'),{g:g,d:d,e:d+1,f:d+2,h:d+3,c:c,a:a,b:b});
  return '';
}
function veTra(){
  var host=$('qt-tra'); if(!host) return;
  var q=host.querySelector('#tra-q'), giu=q?q.value:'';
  host.innerHTML='';
  var card=el('div','qt-card');
  var ch=el('div','qt-ch'); ch.appendChild(el('h3',null,t('traH'))); ch.appendChild(el('span','qt-hint',t('traHint'))); card.appendChild(ch);
  var cb=el('div','qt-cb');
  var f=el('div','qt-f'), lab=el('label',null,t('traLab')); lab.htmlFor='tra-q';
  var inp=el('input'); inp.type='search'; inp.id='tra-q'; inp.placeholder=t('traPh'); inp.value=giu; inp.autocomplete='off';
  f.appendChild(lab); f.appendChild(inp); cb.appendChild(f);
  cb.appendChild(el('div','qt-kq')).id='tra-kq';
  var ct=el('div','qt-ct'); ct.id='tra-ct'; ct.hidden=true; cb.appendChild(ct);
  card.appendChild(cb); host.appendChild(card);
  inp.addEventListener('input',function(){ traChon=-1; veKq(); });
  veKq();
}
function veKq(){
  var box=$('tra-kq'); if(!box) return;
  var q=nod($('tra-q').value.trim()); box.innerHTML='';
  $('tra-ct').hidden=true;
  if(q.length<2){ box.appendChild(el('p','qt-note',t('traGo'))); return; }
  var tu=q.split(/\s+/);
  var kq=dungTra().filter(function(it){ return tu.every(function(x){ return it.s.indexOf(x)>=0; }); });
  /* xep hang: ca cum tu nam trong ten truoc, roi ca cum nam o dau do, roi con lai; giu thu tu danh muc trong moi hang */
  function hang(it){ var ten=nod(it.cs!=null?DATA.cs[it.cs][3]:DATA.hq[it.hq[0]][2]); return ten.indexOf(q)>=0?0:(it.s.indexOf(q)>=0?1:2); }
  kq=kq.map(function(it,i){ return [hang(it),i,it]; }).sort(function(a,b){ return a[0]-b[0] || a[1]-b[1]; }).map(function(x){ return x[2]; });
  if(!kq.length){ box.appendChild(el('p','qt-note',t('traKo'))); return; }
  kq.slice(0,20).forEach(function(it){
    var i=TRA.indexOf(it), b=el('button'); b.type='button'; b.setAttribute('data-act','traChon|'+i);
    if(i===traChon) b.className='on';
    var ten, dc, phu;
    if(it.cs!=null){ var r=DATA.cs[it.cs]; ten=r[3]; dc=r[4]; phu=(DATA.tinh[r[6]]?lv(DATA.tinh[r[6]]):''); }
    else { var x=DATA.hq[it.hq[0]]; ten=x[2]; dc=x[3]; phu=''; }
    b.appendChild(el('b',null,ten));
    if(it.hq.length){ b.appendChild(document.createTextNode(' ')); b.appendChild(el('span','qt-chip qt-cq',t('traChip699'))); }
    else if(it.cs!=null && DATA.cs[it.cs][7]){ b.appendChild(document.createTextNode(' ')); b.appendChild(el('span','qt-chip qt-cb',t('traChipNganh'))); }
    b.appendChild(el('small',null,dc+(phu?' · '+phu:'')));
    box.appendChild(b);
  });
  if(kq.length>20) box.appendChild(el('p','qt-note',fill(t('traSo'),{a:20,b:kq.length})));
  if(traChon>=0) veCt();
}
function veCt(){
  var ct=$('tra-ct'), it=TRA[traChon]; if(!ct || !it) return;
  ct.innerHTML=''; ct.hidden=false;
  var g=nhomGoiY(it), kv=el('dl','qt-kv');
  function dong(k,v){ kv.appendChild(el('dt',null,k)); kv.appendChild(el('dd',null,v)); }
  if(it.cs!=null){
    var r=DATA.cs[it.cs];
    dong(t('ften'), r[3]); dong(t('fdiachi'), r[4]);
    dong(t('fpl'), fill(t('traPl'),{p:r[0],s:r[2]}));
    dong(t('traNganh'), DATA.nganh[r[5]]||'');
    dong(t('traBo'), DATA.bo[r[1]]?lv(DATA.bo[r[1]]):'');
  } else { var x0=DATA.hq[it.hq[0]]; dong(t('ften'),x0[2]); dong(t('fdiachi'),x0[3]); }
  it.hq.forEach(function(j){ dong(t('fmst'), DATA.hq[j][4]); });
  ct.appendChild(kv);
  var p=el('p'); p.appendChild(el('b',null,g==='BA'?t('traGoiY2'):fill(t('traGoiY'),{g:g}))); p.appendChild(document.createTextNode(' '));
  var ly, ul=null;
  function nhomHq(x){ return DATA.hqNhom[x[0]]?lv(DATA.hqNhom[x[0]]):''; }
  if(it.hq.length && it.cs==null) ly=t('traBRoi');
  else if(it.hq.length===1){ var x=DATA.hq[it.hq[0]]; ly=fill(t('traB'),{ n:nhomHq(x), a:vietSo(x[5]), b:vietSo(x[6]) }); }
  else if(it.hq.length){
    ly=fill(t('traBNhieu'),{n:it.hq.length}); ul=el('ul','qt-missing');
    it.hq.forEach(function(j){ var x=DATA.hq[j]; ul.appendChild(el('li',null,fill(t('traBDong'),{ t:x[2], m:x[4], n:nhomHq(x), a:vietSo(x[5]), b:vietSo(x[6]) }))); });
  }
  else if(DATA.cs[it.cs][7]) ly=t('traANganh');
  else ly=t('traA');
  p.appendChild(document.createTextNode(ly)); ct.appendChild(p);
  if(ul) ct.appendChild(ul);
  ct.appendChild(el('p','qt-note',t('traLuuY')));
  var acts=el('div','qt-acts');
  acts.appendChild(nut(t('traDien'),'traDien',''));
  (g==='BA'?['B','A']:[g]).forEach(function(x){ acts.appendChild(nut(fill(t('traNhom'),{g:x}),'traNhom|'+x,'qt-pri')); });
  ct.appendChild(acts);
}
ACT.traChon=function(p){ traChon=+p[0]; veKq(); };
ACT.traDien=function(){
  var it=TRA[traChon]; if(!it) return;
  var c=S.coSo, n=0;
  function dat(k,v){ if(v!=null && v!=='' && c[k]!==v){ c[k]=v; n++; } }
  if(it.cs!=null){
    var r=DATA.cs[it.cs];
    dat('ten',r[3]); dat('diaChi',r[4]);
    if(DATA.tinh[r[6]]) dat('tinh',DATA.tinh[r[6]][0]);
    if(DATA.bo[r[1]]) dat('boQuanLy',DATA.bo[r[1]][0]);
    dat('phuLuc',String(r[0])); dat('stt',String(r[2]));
    if(!c.linhVuc.trim()) dat('linhVuc',DATA.nganh[r[5]]||'');
  } else { var x=DATA.hq[it.hq[0]]; dat('ten',x[2]); dat('diaChi',x[3]); }
  /* nhieu dong QD 699 co the la cac phap nhan khac nhau: chi dien ma so thue khi chi co mot ma */
  var ms=[]; it.hq.forEach(function(j){ var m=DATA.hq[j][4]; if(ms.indexOf(m)<0) ms.push(m); });
  if(ms.length===1 && !c.maSoThue.trim()) dat('maSoThue',ms[0]);
  dienForm(); if(n) daSua();
  toast(fill(t('traDaDien'),{n:n})+(ms.length>1?' '+t('traMstNhieu'):''));
};
ACT.traNhom=function(p){ S.coSo.nhom=p[0]; dienForm(); daSua(); toast(fill(t('traDaNhom'),{g:p[0]})); };
