/* ---------- o nhap gan voi du lieu ----------
   Moi o nhap o Buoc 1 den Buoc 3 co thuoc tinh data-b chi cho biet no ghi vao dau:
     p|duong.dan                      truong cua ho so S
     n|<id nguon>|duong.dan           truong cua nguon
     s|<id nguon>|<nam>|duong.dan     truong cua so lieu nam do, tao ban ghi khi can
     h|<id nguon>|<khi>|<nam|->|duong.dan   truong cua he so
     k|<loai>                         danh dau co so khong co loai nguon nay
   data-k la kieu: text, num, date, sel, bool, radio. Hai bo lang nghe chung cho ca
   trang nen dung lai man hinh khong lam mat su kien. */
Object.assign(T,{
  chon:['Chọn','Choose'],
  eSo:['Không đọc được số “%s”. Chỉ nhập chữ số, dấu chấm, dấu phẩy.','Could not read the number “%s”. Use digits, dots and commas only.'],
  thieuH:['Còn thiếu để hoàn thành Bước %n:','Still needed to complete Step %n:'],
  thieuThem:['và %n mục khác','and %n more']
});

var dsId=0, dsCache={};
function datalist(list){
  var key=list.join('|'); if(dsCache[key]) return dsCache[key];
  var id='qt-dl-'+(++dsId), dl=el('datalist'); dl.id=id;
  list.forEach(function(v){ var o=el('option'); o.value=v; dl.appendChild(o); });
  $('qt-lists').appendChild(dl); dsCache[key]=id; return id;
}
function oNhap(spec,b,val){
  var k=spec.kieu||'text', e;
  if(k==='sel'){
    e=el('select');
    var o0=el('option',null,t('chon')); o0.value=''; e.appendChild(o0);
    var co=false;
    (spec.opts||[]).forEach(function(o){ var x=el('option',null,lv(o[1])); x.value=o[0]; if(o[0]===val) co=true; e.appendChild(x); });
    if(val && !co){ var y=el('option',null,val); y.value=val; e.appendChild(y); }
    e.value=val||'';
  } else if(k==='area'){
    e=el('textarea'); e.value=val||'';
  } else {
    e=el('input'); e.type=(k==='date')?'date':'text';
    if(k==='num'){ e.inputMode='decimal'; e.value=vietSo(val); }
    else e.value=(val==null?'':val);
    if(k==='list') e.setAttribute('list',datalist(spec.list||[]));
  }
  e.setAttribute('data-b',b);
  e.setAttribute('data-k',(k==='list'||k==='area')?'text':k);
  if(spec.ph) e.placeholder=lv(spec.ph);
  if(spec.w) e.style.minWidth=spec.w+'px';
  if(spec.lab) e.setAttribute('aria-label',lv(spec.lab));
  return e;
}
function oHop(b,checked,nhan){
  var lab=el('label','qt-chk'), i=el('input'); i.type='checkbox'; i.checked=!!checked;
  i.setAttribute('data-b',b); i.setAttribute('data-k','bool');
  lab.appendChild(i); lab.appendChild(el('span',null,nhan)); return lab;
}
function nut(chu,act,cls){ var b=el('button','qt-btn'+(cls?' '+cls:''),chu); b.type='button'; b.setAttribute('data-act',act); return b; }

function banGhi(b,tao){
  var p=b.split('|');
  if(p[0]==='p') return { o:S, path:p[1] };
  if(p[0]==='n'){ var n=timNguon(p[1]); return n ? { o:n, path:duongDan(p[2]) } : null; }
  if(p[0]==='s'){ var n2=timNguon(p[1]); return n2 ? { o:laySo(p[1],+p[2],tao), path:duongDan(p[3]) } : null; }
  if(p[0]==='h'){ var n3=timNguon(p[1]); return n3 ? { o:layHs(p[1],p[2],p[3]==='-'?null:+p[3],tao), path:p[4] } : null; }
  if(p[0]==='u'){ var n4=timNguon(p[1]); return n4 ? { o:layU(p[1],p[2],p[3],tao), path:p[4] } : null; }
  return null;
}
function onNhap(ev){
  var e=ev.target; if(!e || !e.getAttribute) return;
  var b=e.getAttribute('data-b'); if(!b) return;
  var k=e.getAttribute('data-k')||'text';
  var doiCauTruc=(k==='sel'||k==='bool'||k==='radio');
  /* o ngay: chi luu khi 'change' va ngay da day du, khong dung lai man hinh. Chromium ban
     'change' sau moi phim khi o da co gia tri; dung lai man hinh luc do lam con tro ve dau o */
  if(ev.type==='input' && (doiCauTruc || k==='date')) return;
  if(k==='date' && e.value && !ngayHopLe(e.value)) return;
  if(ev.type==='change' && k==='text') return;
  if(b.indexOf('th|')===0){
    var th=b.slice(3), ds=S.tinhLai.truongHop, j=ds.indexOf(th);
    if(e.checked && j<0) ds.push(th);
    if(!e.checked && j>=0) ds.splice(j,1);
    ds.sort(); daSua(); veLai(); return;
  }
  if(b==='ky7'){
    var kp=e.value ? e.value.split('-') : [null,null];
    S.tinhLai.kyTruoc.namBatDau=kp[0]?+kp[0]:null; S.tinhLai.kyTruoc.namKetThuc=kp[1]?+kp[1]:null;
    daSua(); veLai(); return;
  }
  if(b.indexOf('k|')===0){
    var lk=b.slice(2), i=S.loaiKhongCo.indexOf(lk);
    if(e.checked && i<0) S.loaiKhongCo.push(lk);
    if(!e.checked && i>=0) S.loaiKhongCo.splice(i,1);
    daSua(); veLai(); return;
  }
  var v;
  if(k==='num'){
    var r=docSo(e.value);
    if(!r.ok){
      /* khong giu gia tri doc duoc tu phan dang go do (3.86 cua 3.86E-05): de trong de bao thieu */
      var g0=banGhi(b,false); if(g0 && g0.o && getP(g0.o,g0.path)!=null){ setP(g0.o,g0.path,null); daSua(); }
      if(ev.type==='change'){ e.classList.add('qt-bad'); toast(fill(t('eSo'),{s:e.value}),true); }
      return;
    }
    e.classList.remove('qt-bad'); v=r.v;
    if(ev.type==='change') e.value=vietSo(v);
  } else if(k==='bool') v=e.checked;
  else if(k==='radio'){ if(!e.checked) return; v=(e.value==='co')?true:(e.value==='khong')?false:e.value; }
  else v=e.value;
  var g=banGhi(b,true); if(!g || !g.o) return;
  if(ev.type==='change' && k==='num' && getP(g.o,g.path)===v) return;
  setP(g.o,g.path,v);
  if(b.indexOf('h|')===0) macDinhHs(g.o);
  daSua();
  if(doiCauTruc || e.hasAttribute('data-r')) veLai();
}
/* Dung lai man hinh dang mo, giu vi tri con tro neu o nhap van con */
function veLai(){
  var n=+String(cur).split('-')[1];
  if(!VE[n]) return;
  var a=document.activeElement, b=a && a.getAttribute && a.getAttribute('data-b');
  veBuoc(n);
  if(b){ var again=document.querySelector('[data-b="'+b.replace(/"/g,'\\"')+'"]'); if(again) again.focus(); }
}
var ACT={};   /* ACT[ten](doiSo, phanTu) cho nut co data-act="ten|doiSo|..." */
function onBam(ev){
  var e=ev.target.closest && ev.target.closest('[data-act]'); if(!e) return;
  var p=e.getAttribute('data-act').split('|'), f=ACT[p[0]];
  if(f){ ev.preventDefault(); f(p.slice(1),e); }
}
/* the co tieu de va dong goi y; tra ve phan than de them noi dung */
function theCard(host,tieuDe,goiY){
  var card=el('div','qt-card'), ch=el('div','qt-ch');
  ch.appendChild(el('h3',null,tieuDe)); if(goiY) ch.appendChild(el('span','qt-hint',goiY));
  card.appendChild(ch); var cb=el('div','qt-cb'); card.appendChild(cb); host.appendChild(card);
  return cb;
}
function truong(nhan,ctrl,batBuoc,goiY,rong){
  var f=el('div','qt-f'+(rong?' qt-wide':'')), lab=el('label');
  if(!ctrl.id) ctrl.id='f-'+taoId();
  lab.htmlFor=ctrl.id; lab.appendChild(el('span',null,nhan));
  if(batBuoc) lab.appendChild(el('span','qt-req','*'));
  f.appendChild(lab); f.appendChild(ctrl);
  if(goiY) f.appendChild(el('span','qt-help',goiY));
  return f;
}
function rong(v){ return v==null || (typeof v==='string' && !v.trim()); }
function oThaoTac(nuts){ var td=el('td','qt-acts'), r=el('span','qt-actrow'); nuts.forEach(function(b){ if(b) r.appendChild(b); }); td.appendChild(r); return td; }
