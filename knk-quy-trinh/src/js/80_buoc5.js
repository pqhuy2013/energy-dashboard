/* ---------- Buoc 5. Kiem soat chat luong ----------
   Dieu 20 Thong tu 38/2023/TT-BCT dan chieu tieu muc 6.1.2 Muc 6 TCVN ISO 14064-1:2011;
   ban tieu chuan chua co trong tay, nen bon noi dung kiem soat toi thieu lay theo tai
   lieu quy trinh, Buoc 5, va noi ro dieu nay tren trang. Phan kiem tra tu dong chi goi
   y tu so lieu da nhap, nguoi kiem tra van phai tu danh gia va ghi bien ban. */
Object.assign(T,{
  b5ccH:['Căn cứ','Legal basis'],
  b5cc:['Điều 20 Thông tư 38/2023/TT-BCT: “Quy trình kiểm soát chất lượng kiểm kê KNK cấp cơ sở được thực hiện theo tiểu mục 6.1.2 Mục 6 Tiêu chuẩn quốc gia TCVN ISO 14064-1:2011, Phần 1: Quy định kỹ thuật và hướng dẫn định lượng và báo cáo phát thải và loại bỏ KNK ở cấp độ cơ sở.”','Article 20 of Circular 38/2023/TT-BCT: quality control of the facility inventory follows clause 6.1.2, Section 6 of national standard TCVN ISO 14064-1:2011, Part 1: Specification with guidance at the organization level for quantification and reporting of greenhouse gas emissions and removals.'],
  b5chua:['Ứng dụng chưa đối chiếu được nguyên văn tiểu mục 6.1.2 của tiêu chuẩn. Bốn nội dung kiểm soát tối thiểu dưới đây lấy theo tài liệu quy trình, Bước 5. Người kiểm tra nên là người không trực tiếp nhập số liệu ở Bước 2.','The app has not been able to check the text of clause 6.1.2 of the standard. The four minimum checks below come from the procedure document, Step 5. The checker should not be the person who entered the data in Step 2.'],
  b5tdH:['Kiểm tra tự động từ số liệu đã nhập','Automatic checks from the entered data'],
  b5tdHint:['Gợi ý để người kiểm tra xem xét, không thay cho biên bản','Hints for the checker; they do not replace the log'],
  b5t1:['1. Chứng từ gốc','1. Source documents'],
  b5t1ok:['Mọi dòng số liệu đều đã ghi nguồn số liệu hoặc số hiệu chứng từ.','Every data row has a data source or document reference.'],
  b5t1x:['%n dòng số liệu chưa ghi nguồn số liệu và số hiệu chứng từ:','%n data rows have neither a data source nor a document reference:'],
  b5t2:['2. Đơn vị đo và hệ số quy đổi','2. Units and conversion factors'],
  b5t2ok:['Không có dòng nào lỗi đơn vị hoặc hệ số ở bảng tính Bước 4.','No unit or factor errors in the Step 4 calculation.'],
  b5t2x:['%n dòng ở bảng tính Bước 4 chưa tính được:','%n rows in the Step 4 calculation could not be computed:'],
  b5t2nt:['Số liệu đổi ra TJ bằng hệ số nhiệt trị do người dùng nhập ở %n dòng; cần đối chiếu nhiệt trị với chứng từ hoặc tài liệu kỹ thuật.','Data are converted to TJ with user-entered calorific values in %n rows; check them against documents or technical data.'],
  b5t3:['3. Tính liên tục giữa hai năm của kỳ','3. Continuity between the two years'],
  b5t3a:['Nguồn','Source'], b5t3d:['Chênh lệch','Change'],
  b5t3tong:['Tổng phát thải (tCO₂tđ)','Total emissions (tCO₂e)'],
  b5t3note:['Chênh lệch lớn chưa chắc là sai, nhưng cần giải thích trong biên bản. Ứng dụng không đặt ngưỡng.','A large change is not necessarily an error, but it needs an explanation in the log. The app sets no threshold.'],
  b5t4:['4. Đối chiếu với kỳ trước','4. Comparison with the previous period'],
  b5t4ko:['Chưa có kết quả kỳ trước. Nhập ở Bước 7 nếu cơ sở đã có kỳ báo cáo trước.','No previous-period results yet. Enter them in Step 7 if the facility has reported before.'],
  b5t4kd:['Bước 7 ghi đây là kỳ báo cáo đầu tiên, không có kỳ trước để đối chiếu.','Step 7 records this as the first reporting period; there is nothing to compare with.'],
  b5t4dong:['Kỳ trước, năm %y: %v tCO₂tđ','Previous period, %y: %v tCO₂e'],
  b5t4nay:['Kỳ này, năm %y: %v tCO₂tđ','This period, %y: %v tCO₂e'],
  b5t5:['5. Số liệu ước tính','5. Estimated figures'],
  b5t5ok:['Không có số liệu nào đánh dấu ước tính.','No figures are marked as estimates.'],
  b5t5x:['%n dòng số liệu là ước tính:','%n data rows are estimates:'],
  b5bbH:['Biên bản kiểm soát chất lượng','Quality control log'],
  b5bbHint:['Ghi rõ lỗi đã phát hiện và cách xử lý','Record the errors found and how they were handled'],
  b5c:['Nội dung kiểm soát','Check'], b5nk:['Người kiểm tra','Checked by'], b5ng:['Ngày','Date'],
  b5kq:['Kết quả','Result'], b5loi:['Sai sót phát hiện','Errors found'], b5xl:['Cách xử lý','Action taken'],
  b5kqDat:['Đạt','Passed'], b5kqSai:['Có sai sót','Errors found'],
  b5them4:['+ Thêm 4 nội dung tối thiểu','+ Add the 4 minimum checks'],
  b5them:['+ Thêm dòng','+ Add row'],
  b5xoa:['Xóa','Delete'],
  b5trung:['%n vừa là người kiểm tra, vừa là người cung cấp số liệu ở Bước 2. Nên để người khác kiểm tra.','%n is both a checker and a data provider in Step 2. Someone else should do the check.'],
  b5ct1:['Đối chiếu số liệu nhập với chứng từ gốc','Check entered data against source documents'],
  b5ct2:['Kiểm tra đơn vị đo và hệ số quy đổi','Check units and conversion factors'],
  b5ct3:['Kiểm tra tính liên tục của chuỗi số liệu giữa 2 năm trong kỳ','Check continuity of the data series between the 2 years'],
  b5ct4:['Đối chiếu kết quả với kỳ trước và giải thích chênh lệch bất thường','Compare results with the previous period and explain unusual changes'],
  b5mCt:['Nội dung tối thiểu: %c','Minimum check: %c'],
  b5mDong:['Dòng %i của biên bản: %c','Log row %i: %c'],
  b5mRong:['Biên bản kiểm soát chất lượng chưa có dòng nào','The quality control log is empty']
});
var CT_TOI_THIEU=['ct1','ct2','ct3','ct4'];

VE[5]=function(sec){
  var cb=theCard(sec,t('b5ccH'));
  cb.appendChild(el('p',null,t('b5cc')));
  cb.appendChild(el('div','qt-alert',t('b5chua')));
  veTuDong5(sec);
  veBienBan5(sec);
};
function danhSach(host,items,toiDa){
  var ul=el('ul','qt-missing'); ul.style.fontSize='13px';
  items.slice(0,toiDa||8).forEach(function(x){ ul.appendChild(el('li',null,x)); });
  if(items.length>(toiDa||8)) ul.appendChild(el('li',null,fill(t('thieuThem'),{n:items.length-(toiDa||8)})));
  host.appendChild(ul);
}
function veTuDong5(sec){
  var ys=namKy(), cb=theCard(sec,t('b5tdH'),t('b5tdHint')); cb.parentNode.id='b5-tudong';
  function muc(tieuDe){ cb.appendChild(el('div','qt-hsn',tieuDe)); }
  /* 1. chung tu */
  muc(t('b5t1'));
  var thieuCt=[];
  S.nguon.forEach(function(n){ ys.forEach(function(y){ var so=laySo(n.id,y,false); if(so && so.gioTri!=null && rong(so.nguonSoLieu) && rong(so.chungTu)) thieuCt.push(nhanNguon(n)+', '+y); }); });
  if(!thieuCt.length) cb.appendChild(el('p','qt-note',t('b5t1ok')));
  else { cb.appendChild(el('p','qt-note',fill(t('b5t1x'),{n:thieuCt.length}))); danhSach(cb,thieuCt); }
  /* 2. don vi, he so quy doi */
  muc(t('b5t2'));
  var kq=tinhToan(), loi=kq.dong.filter(function(d){ return d.loi && !d.khongCT; });
  if(!loi.length) cb.appendChild(el('p','qt-note',t('b5t2ok')));
  else { cb.appendChild(el('p','qt-note',fill(t('b5t2x'),{n:loi.length}))); danhSach(cb,loi.map(function(d){ return nhanNguon(d.n)+', '+d.y+', '+(KHI_NHAN[d.khi]||d.khi)+': '+d.loi; })); }
  var nt=kq.dong.filter(function(d){ return !d.loi && d.adGhi && /TJ\//.test(d.adGhi) && d.khi==='CO2'; }).length;
  if(nt) cb.appendChild(el('p','qt-note',fill(t('b5t2nt'),{n:nt})));
  /* 3. lien tuc giua hai nam */
  muc(t('b5t3'));
  if(ys.length===2){
    var w=el('div','qt-tbw'), tb=el('table','qt-t'), hr=el('tr');
    [t('b5t3a'),String(ys[0]),String(ys[1]),t('b5t3d')].forEach(function(x){ hr.appendChild(el('th',null,x)); });
    var th=el('thead'); th.appendChild(hr); tb.appendChild(th);
    var bd=el('tbody');
    function dong(nhan,a,b,dv){
      var r=el('tr'); r.appendChild(el('td',null,nhan));
      r.appendChild(el('td','qt-calc',a==null?'':vietSo(a,3)+(dv?' '+dv:''))); r.appendChild(el('td','qt-calc',b==null?'':vietSo(b,3)+(dv?' '+dv:'')));
      var d=(a!=null && b!=null && a!==0) ? (b-a)/a*100 : null;
      var td=el('td','qt-calc',d==null?'—':(d>0?'+':'')+vietSo(d,1)+' %'); td.setAttribute('data-lientuc',nhan); r.appendChild(td);
      bd.appendChild(r);
    }
    S.nguon.forEach(function(n){ var a=laySo(n.id,ys[0],false), b=laySo(n.id,ys[1],false); dong(nhanNguon(n),a&&a.gioTri,b&&b.gioTri,(a&&a.donVi)||(b&&b.donVi)||''); });
    dong(t('b5t3tong'),kq.tong[ys[0]].tong,kq.tong[ys[1]].tong,'');
    tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
    cb.appendChild(el('p','qt-note',t('b5t3note')));
  } else cb.appendChild(el('p','qt-note',t('b2ky')));
  /* 4. ky truoc */
  muc(t('b5t4'));
  var tl=S.tinhLai, ktr=tl.ketQuaMoi, co=Object.keys(ktr).length?ktr:tl.ketQuaCu;
  if(tl.tinhTrang==='kyDau') cb.appendChild(el('p','qt-note',t('b5t4kd')));
  else if(!Object.keys(co).length) cb.appendChild(el('p','qt-note',t('b5t4ko')));
  else {
    var ds=Object.keys(co).sort().map(function(y){ return fill(t('b5t4dong'),{y:y,v:vietSo(co[y],3)}); });
    ys.forEach(function(y){ ds.push(fill(t('b5t4nay'),{y:y,v:vietSo(kq.tong[y].tong,3)})); });
    danhSach(cb,ds);
  }
  /* 5. uoc tinh */
  muc(t('b5t5'));
  var uoc=[]; S.soLieu.forEach(function(r){ if(r.laUocTinh){ var n=timNguon(r.nguonId); if(n) uoc.push(nhanNguon(n)+', '+r.nam+': '+r.cachUocTinh); } });
  if(!uoc.length) cb.appendChild(el('p','qt-note',t('b5t5ok')));
  else { cb.appendChild(el('p','qt-note',fill(t('b5t5x'),{n:uoc.length}))); danhSach(cb,uoc); }
}
function veBienBan5(sec){
  var cb=theCard(sec,t('b5bbH'),t('b5bbHint')); cb.parentNode.id='b5-bienban';
  if(S.qc.length){
    var w=el('div','qt-tbw'), tb=el('table','qt-t'), hr=el('tr');
    ['#',t('b5c'),t('b5nk'),t('b5ng'),t('b5kq'),t('b5loi'),t('b5xl'),''].forEach(function(x,i){ var th=el('th',i===0?'qt-stt':null,x); if(i>=1&&i<=4) th.appendChild(el('span','qt-req','*')); hr.appendChild(th); });
    var th=el('thead'); th.appendChild(hr); tb.appendChild(th);
    var bd=el('tbody');
    S.qc.forEach(function(q,i){
      var r=el('tr'), p='p|qc.'+i+'.';
      r.appendChild(el('td','qt-stt',String(i+1)));
      [['noiDung','area',176],['nguoiKiem','text',120],['ngay','date',128]].forEach(function(x){
        var td=el('td'), o=oNhap({ kieu:x[1], w:x[2], lab:T['b5'+{noiDung:'c',nguoiKiem:'nk',ngay:'ng'}[x[0]]] },p+x[0],q[x[0]]);
        if(x[1]==='area'){ o.rows=3; o.style.minHeight='74px'; o.style.width='100%'; }
        td.appendChild(o); r.appendChild(td);
      });
      var tk=el('td'); tk.appendChild(oNhap({ kieu:'sel', w:104, opts:[['dat',T.b5kqDat],['saiSot',T.b5kqSai]], lab:T.b5kq },p+'ketQua',q.ketQua)); r.appendChild(tk);
      ['loiPhatHien','cachXuLy'].forEach(function(k){ var td=el('td'), o=oNhap({ kieu:'area', w:150, lab:T[k==='loiPhatHien'?'b5loi':'b5xl'] },p+k,q[k]); o.rows=2; o.style.minHeight='54px'; o.style.width='100%'; td.appendChild(o); r.appendChild(td); });
      r.appendChild(oThaoTac([nut(t('b5xoa'),'xoaQc|'+i)]));
      bd.appendChild(r);
    });
    tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
  }
  var f=el('div','qt-loai-f');
  var co=S.qc.map(function(q){ return q.ma; });
  if(CT_TOI_THIEU.some(function(m){ return co.indexOf(m)<0; })) f.appendChild(nut(t('b5them4'),'qc4','qt-pri'));
  f.appendChild(nut(t('b5them'),'qcThem'));
  cb.appendChild(f);
  var ncc={}; S.soLieu.forEach(function(r){ if(!rong(r.nguoiCungCap)) ncc[nod(r.nguoiCungCap.trim())]=r.nguoiCungCap.trim(); });
  var trung={}; S.qc.forEach(function(q){ var k=nod(q.nguoiKiem.trim()); if(k && ncc[k]) trung[k]=q.nguoiKiem.trim(); });
  Object.keys(trung).forEach(function(k){ cb.appendChild(el('div','qt-alert',fill(t('b5trung'),{n:trung[k]}))); });
}
THIEU[5]=function(){
  var m=[];
  if(!S.qc.length) m.push(t('b5mRong'));
  var co=S.qc.map(function(q){ return q.ma; });
  CT_TOI_THIEU.forEach(function(ma,i){ if(co.indexOf(ma)<0) m.push(fill(t('b5mCt'),{c:t('b5ct'+(i+1))})); });
  S.qc.forEach(function(q,i){
    var x=[];
    if(rong(q.noiDung)) x.push(t('b5c'));
    if(rong(q.nguoiKiem)) x.push(t('b5nk'));
    if(rong(q.ngay)) x.push(t('b5ng'));
    if(rong(q.ketQua)) x.push(t('b5kq'));
    if(q.ketQua==='saiSot'){ if(rong(q.loiPhatHien)) x.push(t('b5loi')); if(rong(q.cachXuLy)) x.push(t('b5xl')); }
    x.forEach(function(c){ m.push(fill(t('b5mDong'),{i:i+1,c:c})); });
  });
  return m;
};
function dongQc(ma,noiDung){ return { ma:ma, noiDung:noiDung, nguoiKiem:'', ngay:'', ketQua:'', loiPhatHien:'', cachXuLy:'' }; }
ACT.qc4=function(){
  var co=S.qc.map(function(q){ return q.ma; });
  /* Noi dung ghi tieng Viet vi di vao bien ban va bao cao nop */
  CT_TOI_THIEU.forEach(function(ma,i){ if(co.indexOf(ma)<0) S.qc.push(dongQc(ma,T['b5ct'+(i+1)][0])); });
  daSua(); veLai();
};
ACT.qcThem=function(){ S.qc.push(dongQc('','')); daSua(); veLai(); };
ACT.xoaQc=function(p){ S.qc.splice(+p[0],1); daSua(); veLai(); };
