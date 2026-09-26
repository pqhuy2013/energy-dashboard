/* ---------- Buoc 1. Xac dinh pham vi kiem ke ----------
   Muc II.1 den II.3 Mau so 06. Nguon phat thai khai bao theo 6 loai truc tiep va 2 loai
   gian tiep cua Dieu 16 Thong tu 38/2023/TT-BCT; loai nao khong co thi danh dau ro,
   theo muc 3 bang kiem Phan F tai lieu quy trinh. */
Object.assign(T,{
  b1rgH:['Ranh giới và phạm vi hoạt động của cơ sở','Facility boundary and scope'],
  b1rgHint:['Mục II.1 Mẫu số 06','Form 06, item II.1'],
  b1rgLab:['Mô tả ranh giới cơ sở: các khu vực, dây chuyền, công trình thuộc phạm vi kiểm kê','Describe the boundary: areas, lines and installations covered'],
  b1rgHelp:['Cơ sở có nhiều địa điểm sản xuất cần nói rõ báo cáo theo cơ sở nào, vì danh mục Quyết định 42/2026/QĐ-TTg định danh theo cơ sở chứ không theo pháp nhân.','A company with several sites must state which facility this report covers: Decision 42/2026/QD-TTg lists facilities, not legal entities.'],
  b1htH:['Cơ sở hạ tầng, công nghệ và hoạt động','Infrastructure, technology and operations'],
  b1htHint:['Mục II.2 Mẫu số 06','Form 06, item II.2'],
  b1htLab:['Mô tả hạ tầng, công nghệ sản xuất, công suất, chế độ vận hành','Describe infrastructure, production technology, capacity, operating regime'],
  b1nH:['Nguồn phát thải','Emission sources'],
  b1nHint:['Mục II.3 Mẫu số 06; Điều 16 Thông tư 38/2023/TT-BCT','Form 06, item II.3; Article 16 of Circular 38/2023/TT-BCT'],
  b1nP:['Khai báo từng nguồn, mỗi nguồn gắn với một thiết bị hoặc một công đoạn cụ thể, không bỏ sót và không tính trùng. Loại nào cơ sở không có thì đánh dấu “Cơ sở không có loại nguồn này”. Phát thải gián tiếp từ điện mua ngoài thuộc phạm vi kiểm kê bắt buộc.','Declare each source, tied to one piece of equipment or one process step, with no omission or double counting. Tick “The facility has no source of this type” where applicable. Indirect emissions from purchased electricity are mandatory.'],
  b1tt:['Nguồn phát thải trực tiếp, khoản 1 Điều 16','Direct sources, Article 16(1)'],
  b1gt:['Nguồn phát thải gián tiếp, khoản 2 Điều 16','Indirect sources, Article 16(2)'],
  b1d16:['Điểm %d','Point %d'],
  b1so:['%n nguồn','%n sources'],
  b1khong:['Cơ sở không có loại nguồn này','The facility has no source of this type'],
  b1khongChip:['Không có','None'],
  b1pp:['Số liệu: bảng %b Mục 1 Phụ lục II. Công thức: điểm %m Mục 2 Phụ lục II Thông tư 38/2023/TT-BCT.','Data: table %b of Section 1, Appendix II. Formula: point %m of Section 2, Appendix II of Circular 38/2023/TT-BCT.'],
  b1them:['+ Thêm nguồn','+ Add source'],
  b1nhan:['Nhân bản','Duplicate'],
  b1xoa:['Xóa','Delete'],
  b1xoaHoi:['Xóa %n? Số liệu, hệ số và độ không chắc chắn đã nhập cho nguồn này cũng bị xóa.','Delete %n? Its activity data, factors and uncertainty inputs will be deleted too.'],
  b1bhtH:['Bể hấp thụ khí nhà kính','Greenhouse gas sinks'],
  b1bhtHint:['Mục II.3 Mẫu số 06 có nêu bể hấp thụ; Điều 16 Thông tư 38 chỉ liệt kê nguồn phát thải','Form 06 item II.3 mentions sinks; Article 16 of Circular 38 lists emission sources only'],
  b1bhtQ:['Trong phạm vi hoạt động, cơ sở có bể hấp thụ khí nhà kính không?','Does the facility have any greenhouse gas sinks within its boundary?'],
  b1co:['Có','Yes'], b1ko:['Không','No'],
  b1bhtMo:['Mô tả bể hấp thụ','Describe the sinks'],
  b1mRg:['Ranh giới và phạm vi hoạt động (mục II.1)','Boundary and scope (item II.1)'],
  b1mNguon:['Ít nhất một nguồn phát thải','At least one emission source'],
  b1mLoai:['%l: thêm nguồn, hoặc đánh dấu cơ sở không có','%l: add a source, or mark it as not present'],
  b1mBht:['Trả lời câu hỏi về bể hấp thụ','Answer the question on sinks'],
  b1tDup:['Đã nhân bản nguồn, kèm hệ số đã gán.','Source duplicated, with its assigned factors.']
});

VE[1]=function(sec){
  var cb=theCard(sec,t('b1rgH'),t('b1rgHint'));
  var g=el('div','qt-grid'); cb.appendChild(g);
  g.appendChild(truong(t('b1rgLab'), oNhap({kieu:'area'},'p|moTa.ranhGioi',S.moTa.ranhGioi), true, t('b1rgHelp'), true));

  cb=theCard(sec,t('b1htH'),t('b1htHint'));
  g=el('div','qt-grid'); cb.appendChild(g);
  g.appendChild(truong(t('b1htLab'), oNhap({kieu:'area'},'p|moTa.haTang',S.moTa.haTang), false, null, true));

  cb=theCard(sec,t('b1nH'),t('b1nHint'));
  cb.appendChild(el('p',null,t('b1nP')));
  [false,true].forEach(function(gt){
    cb.appendChild(el('div','qt-group',t(gt?'b1gt':'b1tt')));
    LOAI.filter(function(l){ return l.gt===gt; }).forEach(function(l){ veLoai1(cb,l); });
  });

  cb=theCard(sec,t('b1bhtH'),t('b1bhtHint'));
  cb.appendChild(el('p',null,t('b1bhtQ')));
  var rg=el('div','qt-radgrp');
  [['co','b1co'],['khong','b1ko']].forEach(function(x){
    var lab=el('label','qt-chk'), i=el('input'); i.type='radio'; i.name='qt-bht'; i.value=x[0];
    i.checked=(S.beHapThu.coHayKhong===(x[0]==='co'));
    i.setAttribute('data-b','p|beHapThu.coHayKhong'); i.setAttribute('data-k','radio');
    lab.appendChild(i); lab.appendChild(el('span',null,t(x[1]))); rg.appendChild(lab);
  });
  cb.appendChild(rg);
  if(S.beHapThu.coHayKhong===true){
    g=el('div','qt-grid'); cb.appendChild(g);
    g.appendChild(truong(t('b1bhtMo'), oNhap({kieu:'area'},'p|beHapThu.moTa',S.beHapThu.moTa), false, null, true));
  }
};

function veLoai1(host,l){
  var ds=nguonTheoLoai(l.k), khong=S.loaiKhongCo.indexOf(l.k)>=0;
  var box=el('div','qt-loai'+(khong?' khong':'')); box.id='loai-'+l.k;
  var h=el('div','qt-loai-h');
  h.appendChild(el('h4',null,lv(l.ten)));
  h.appendChild(el('span','qt-hint',fill(t('b1d16'),{d:l.d16.slice(1)})));
  if(ds.length) h.appendChild(el('span','qt-chip qt-cok',fill(t('b1so'),{n:ds.length})));
  else if(khong) h.appendChild(el('span','qt-chip',t('b1khongChip')));
  box.appendChild(h);
  box.appendChild(el('p',null,lv(l.mo)+'.'));
  if(l.pp.m2) box.appendChild(el('div','qt-note',fill(t('b1pp'),{b:l.bang.so,m:l.pp.m2})+(l.pp.luu?' '+lv(l.pp.luu):'')));
  if(l.pp.canhBao) box.appendChild(el('div','qt-alert',lv(l.pp.canhBao)));
  if(ds.length){
    var w=el('div','qt-tbw'), tb=el('table','qt-t'), thead=el('thead'), tr=el('tr');
    tr.appendChild(el('th','qt-stt','#'));
    l.nf.forEach(function(sp){ var th=el('th',null,lv(sp.lab)); if(sp.req) th.appendChild(el('span','qt-req','*')); tr.appendChild(th); });
    tr.appendChild(el('th',null,''));
    thead.appendChild(tr); tb.appendChild(thead);
    var tbody=el('tbody');
    ds.forEach(function(n,i){
      var r=el('tr'); r.appendChild(el('td','qt-stt',String(i+1)));
      l.nf.forEach(function(sp){
        var td=el('td'); td.appendChild(oNhap(sp,'n|'+n.id+'|'+sp.f,getP(n,duongDan(sp.f)))); r.appendChild(td);
      });
      r.appendChild(oThaoTac([nut(t('b1nhan'),'nhan|'+n.id), nut(t('b1xoa'),'xoa|'+n.id)])); tbody.appendChild(r);
    });
    tb.appendChild(tbody); w.appendChild(tb); box.appendChild(w);
  }
  var f=el('div','qt-loai-f');
  f.appendChild(nut(t('b1them'),'them|'+l.k));
  if(!ds.length) f.appendChild(oHop('k|'+l.k,khong,t('b1khong')));
  box.appendChild(f);
  host.appendChild(box);
}

THIEU[1]=function(){
  var m=[];
  if(rong(S.moTa.ranhGioi)) m.push(t('b1mRg'));
  if(!S.nguon.length) m.push(t('b1mNguon'));
  LOAI.forEach(function(l){
    if(!nguonTheoLoai(l.k).length && S.loaiKhongCo.indexOf(l.k)<0) m.push(fill(t('b1mLoai'),{l:lv(l.ten)}));
  });
  S.nguon.forEach(function(n){
    LOAI_BY[n.loai].nf.forEach(function(sp){ if(sp.req && rong(getP(n,duongDan(sp.f)))) m.push(nhanNguon(n)+': '+lv(sp.lab)); });
  });
  if(S.beHapThu.coHayKhong!==true && S.beHapThu.coHayKhong!==false) m.push(t('b1mBht'));
  return m;
};

ACT.them=function(p){
  var n={ id:taoId(), loai:p[0], phanLoai:'', thietBi:'', viTri:'', ghiChu:'', thuocTinh:{} };
  S.nguon.push(n);
  var i=S.loaiKhongCo.indexOf(p[0]); if(i>=0) S.loaiKhongCo.splice(i,1);
  daSua(); veLai();
  var o=document.querySelector('[data-b^="n|'+n.id+'|"]'); if(o) o.focus();
};
ACT.nhan=function(p){
  var n=timNguon(p[0]); if(!n) return;
  var m=clone(n); m.id=taoId();
  S.nguon.splice(S.nguon.indexOf(n)+1,0,m);
  S.heSo.filter(function(h){ return h.nguonId===n.id; }).forEach(function(h){ var c=clone(h); c.nguonId=m.id; S.heSo.push(c); });
  daSua(); veLai(); toast(t('b1tDup'));
};
ACT.xoa=function(p){
  var n=timNguon(p[0]); if(!n) return;
  function lam(){
    S.nguon=S.nguon.filter(function(x){ return x.id!==n.id; });
    S.soLieu=S.soLieu.filter(function(x){ return x.nguonId!==n.id; });
    S.heSo=S.heSo.filter(function(x){ return x.nguonId!==n.id; });
    S.khongChacChan.bangU=S.khongChacChan.bangU.filter(function(x){ return x.nguonId!==n.id; });
    daSua(); veLai();
  }
  var coDuLieu=[S.soLieu,S.heSo,S.khongChacChan.bangU].some(function(ds){ return ds.some(function(x){ return x.nguonId===n.id; }); });
  if(coDuLieu) hoi(fill(t('b1xoaHoi'),{n:nhanNguon(n)}), [{ k:'b1xoa', pri:true, fn:lam }]);
  else lam();
};
