/* ---------- Buoc 7. Tinh toan lai ket qua ky truoc ----------
   Dieu 22 Thong tu 38/2023/TT-BCT: co so giai trinh va tinh toan lai ket qua ky truoc
   khi (a) doi pham vi, (b) doi phuong phap dan toi thay doi ket qua gan nhat, (c) doi
   nguon va he so; khoan 2: bo sung phan tinh toan lai vao bao cao ky nay.
   Ung dung doc duoc file .json ky truoc de tinh tong cua ky do theo bo GWP cua chinh no
   va theo bo GWP dang chon; doi pham vi hoac he so thi nguoi dung sua file ky truoc bang
   chinh ung dung nay roi nap lai. */
Object.assign(T,{
  b7ccH:['Căn cứ','Legal basis'],
  b7cc1:['Điều 22 Thông tư 38/2023/TT-BCT, khoản 1: “Cơ sở có trách nhiệm giải trình và tính toán lại kết quả kiểm kê KNK của các kỳ kiểm kê trước khi xảy ra một trong các trường hợp sau:','Article 22(1) of Circular 38/2023/TT-BCT: the facility must explain and recalculate the results of previous inventory periods when any of the following occurs:'],
  b7_a:['a) Có sự thay đổi về phạm vi kiểm kê KNK;','a) A change in the inventory boundary;'],
  b7_b:['b) Có sự thay đổi về phương pháp kiểm kê KNK dẫn đến sự thay đổi trong kết quả kiểm kê KNK gần nhất;','b) A change in the inventory method that changes the latest inventory result;'],
  b7_c:['c) Có sự thay đổi về nguồn và hệ số phát thải KNK.”','c) A change in emission sources and emission factors.'],
  b7cc2:['Khoản 2: cơ sở bổ sung nội dung tính toán lại kết quả kiểm kê của kỳ trước vào báo cáo của kỳ báo cáo. Đổi bộ GWP, đổi hệ số lưới điện, thêm hoặc bớt một dây chuyền đều là lý do phải tính toán lại.','Article 22(2): the facility adds the recalculation of the previous period to the current report. Switching GWP sets, changing the grid factor, adding or removing a production line are all reasons to recalculate.'],
  b7ttH:['Tình trạng kỳ này','Status of this period'],
  b7kyDau:['Đây là kỳ báo cáo đầu tiên của cơ sở, chưa có kỳ trước','This is the facility’s first reporting period; there is no previous period'],
  b7khongDoi:['Có kỳ trước, không xảy ra trường hợp nào ở khoản 1','There is a previous period, and none of the cases in paragraph 1 applies'],
  b7coDoi:['Có thay đổi thuộc khoản 1, phải tính toán lại kỳ trước','A change under paragraph 1 applies; the previous period must be recalculated'],
  b7thH:['Trường hợp xảy ra','Cases that apply'],
  b7lyDo:['Mô tả thay đổi','Describe the change'],
  b7kyTr:['Kỳ trước','Previous period'],
  b7kqH:['Kết quả kỳ trước','Previous-period results'],
  b7kqHint:['Tấn CO₂ tương đương','Tonnes CO₂ equivalent'],
  b7cNam:['Năm','Year'], b7cCu:['Kết quả đã báo cáo','Result as reported'], b7cMoi:['Kết quả tính lại','Recalculated result'],
  b7cCl:['Chênh lệch','Difference'],
  b7giai:['Giải thích nguyên nhân chênh lệch','Explain the cause of the difference'],
  b7fH:['Tự tính từ file kỳ trước','Compute from the previous-period file'],
  b7fP:['Nạp file .json của kỳ trước, lập bằng ứng dụng này. Ứng dụng tính tổng phát thải của kỳ đó theo bộ GWP của chính file, và theo bộ GWP đang chọn ở Bước 4. Nếu thay đổi là phạm vi, nguồn hoặc hệ số: mở file kỳ trước bằng ứng dụng này ở một tab khác, sửa theo cách tính mới, tải về, rồi nạp file đã sửa ở đây và điền vào cột tính lại.','Load the previous period’s .json file made with this app. The app computes that period’s totals with the file’s own GWP set and with the set chosen in Step 4. If the change concerns the boundary, sources or factors: open the old file with this app in another tab, update it to the new method, download it, then load that file here and fill the recalculated column.'],
  b7fNap:['Nạp file kỳ trước','Load previous-period file'],
  b7fTen:['File %f, kỳ %a–%b.','File %f, period %a–%b.'],
  b7fRieng:['Theo bộ GWP của file (%g):','With the file’s GWP set (%g):'],
  b7fNay:['Theo bộ GWP đang chọn (%g):','With the currently chosen GWP set (%g):'],
  b7fNam:['năm %y: %v','%y: %v'],
  b7fChuaDu:['năm %y: chưa đủ, %n dòng chưa tính được hoặc không có công thức','%y: incomplete, %n rows not computed or without a formula'],
  b7fDienCu:['Điền vào cột đã báo cáo','Fill “as reported”'],
  b7fDienMoi:['Điền vào cột tính lại','Fill “recalculated”'],
  b7fChuaGwp:['chưa chọn','not chosen'],
  b7fLoi:['Không đọc được file %f.','Could not read %f.'],
  b7fDaDien:['Đã điền kết quả kỳ trước.','Previous-period results filled in.'],
  b7mTt:['Chọn tình trạng kỳ này','Choose the status of this period'],
  b7mTh:['Chọn ít nhất một trường hợp của khoản 1','Choose at least one case from paragraph 1'],
  b7mLy:['Mô tả thay đổi','Description of the change'],
  b7mKy:['Hai năm của kỳ trước','The two years of the previous period'],
  b7mKq:['Kết quả năm %y: %c','Result for %y: %c'],
  b7mGt:['Giải thích nguyên nhân chênh lệch','Explanation of the difference']
});
var UI7={ file:null };
KHI_DOI_HO_SO.push(function(){ UI7.file=null; });
/* Tong ky truoc theo bo GWP dang chon: tinh moi lan can, vi nguoi dung co the doi bo GWP
   o Buoc 4 sau khi da nap file ky truoc */
function tongNay(f){ if(!S.gwp) return null; var c=clone(f.o); c.gwp=S.gwp; return tinhVoi(c).tong; }
/* Tinh voi mot ho so khac, khong dong vao ho so dang mo */
function tinhVoi(o){ var giu=S; S=o; try{ return tinhToan(); } finally { S=giu; } }
function kyTruoc(){ var k=S.tinhLai.kyTruoc; return (k.namBatDau && k.namKetThuc) ? [k.namBatDau,k.namKetThuc] : []; }

VE[7]=function(sec){
  var tl=S.tinhLai;
  var cb=theCard(sec,t('b7ccH'));
  cb.appendChild(el('p',null,t('b7cc1')));
  ['a','b','c'].forEach(function(k){ var p=el('p',null,t('b7_'+k)); p.style.margin='0 0 4px 18px'; cb.appendChild(p); });
  cb.appendChild(el('p','qt-note',t('b7cc2')));
  cb=theCard(sec,t('b7ttH'));
  ['kyDau','khongDoi','coDoi'].forEach(function(k){
    var lab=el('label','qt-chk'), i=el('input'); i.type='radio'; i.name='qt-tl'; i.value=k; i.checked=tl.tinhTrang===k;
    i.setAttribute('data-b','p|tinhLai.tinhTrang'); i.setAttribute('data-k','radio');
    lab.appendChild(i); lab.appendChild(el('span',null,t('b7'+k))); lab.style.display='flex'; lab.style.margin='0 0 6px';
    cb.appendChild(lab);
  });
  if(tl.tinhTrang!=='coDoi') return;
  cb=theCard(sec,t('b7thH')); cb.parentNode.id='b7-truonghop';
  ['a','b','c'].forEach(function(k){
    var lab=oHop('th|'+k,tl.truongHop.indexOf(k)>=0,t('b7_'+k)); lab.style.display='flex'; lab.style.margin='0 0 6px'; cb.appendChild(lab);
  });
  var g=el('div','qt-grid'); g.style.marginTop='8px'; cb.appendChild(g);
  g.appendChild(truong(t('b7lyDo'), oNhap({kieu:'area'},'p|tinhLai.lyDo',tl.lyDo), true, null, true));
  /* file ky truoc */
  cb=theCard(sec,t('b7fH')); cb.parentNode.id='b7-file';
  cb.appendChild(el('p','qt-note',t('b7fP')));
  var inp=el('input'); inp.type='file'; inp.accept='.json,application/json'; inp.hidden=true; inp.id='qt-file7';
  inp.addEventListener('change',function(){ if(this.files && this.files[0]) napKyTruoc(this.files[0]); });
  cb.appendChild(inp);
  var b=nut(t('b7fNap'),'napKy7'); cb.appendChild(b);
  if(UI7.file){
    var f=UI7.file, box=el('div','qt-ct');
    box.appendChild(el('p',null,fill(t('b7fTen'),{f:f.ten,a:f.ky[0],b:f.ky[1]})));
    function dong(nhanK,tong){
      if(!tong) return;
      var p=el('p'); p.appendChild(el('b',null,nhanK+' '));
      p.appendChild(document.createTextNode(f.ky.map(function(y){ var o=tong[y]; return chuaDu(o) ? fill(t('b7fChuaDu'),{y:y,n:o.loi+o.chuaGwp+o.khongCT}) : fill(t('b7fNam'),{y:y,v:vietSo(o.tong,3)}); }).join('; ')));
      box.appendChild(p);
    }
    dong(fill(t('b7fRieng'),{g:f.gwp||t('b7fChuaGwp')}),f.rieng);
    if(S.gwp) dong(fill(t('b7fNay'),{g:S.gwp}),tongNay(f));
    var a=el('div','qt-acts');
    a.appendChild(nut(t('b7fDienCu'),'dien7|cu','qt-pri'));
    if(S.gwp) a.appendChild(nut(t('b7fDienMoi'),'dien7|moi'));
    box.appendChild(a); cb.appendChild(box);
  }
  /* bang ket qua ky truoc */
  cb=theCard(sec,t('b7kqH'),t('b7kqHint')); cb.parentNode.id='b7-ketqua';
  var gk=el('div','qt-grid'); cb.appendChild(gk);
  var sel=el('select'); sel.setAttribute('data-b','ky7'); sel.setAttribute('data-k','sel');
  var o0=el('option',null,t('kychoose')); o0.value=''; sel.appendChild(o0);
  var ky=kyTruoc(), nay=S.ky.namBatDau||BUILD_YEAR;
  for(var y=2020; y<=nay-1; y++){ var o=el('option',null,fill(t('kyopt'),{a:y,b:y+1})); o.value=y+'-'+(y+1); sel.appendChild(o); }
  sel.value=ky.length?ky[0]+'-'+ky[1]:'';
  gk.appendChild(truong(t('b7kyTr'),sel,true));
  if(ky.length){
    var w=el('div','qt-tbw'), tb=el('table','qt-t'), hr=el('tr'); w.style.marginTop='10px';
    [t('b7cNam'),t('b7cCu'),t('b7cMoi'),t('b7cCl')].forEach(function(x,i){ var th=el('th',null,x); if(i===1||i===2) th.appendChild(el('span','qt-req','*')); hr.appendChild(th); });
    var th=el('thead'); th.appendChild(hr); tb.appendChild(th);
    var bd=el('tbody');
    ky.forEach(function(y){
      var r=el('tr'); r.appendChild(el('td',null,String(y)));
      ['ketQuaCu','ketQuaMoi'].forEach(function(k){ var td=el('td'); td.appendChild(oNhap({ kieu:'num', w:130, lab:T[k==='ketQuaCu'?'b7cCu':'b7cMoi'] },'p|tinhLai.'+k+'.'+y,tl[k][y])); r.appendChild(td); });
      var tc=el('td'), sp=el('span','qt-calc'); sp.setAttribute('data-calc','tl|'+y); tc.appendChild(sp); r.appendChild(tc);
      bd.appendChild(r);
    });
    tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
  }
  var g2=el('div','qt-grid'); g2.style.marginTop='12px'; cb.appendChild(g2);
  g2.appendChild(truong(t('b7giai'), oNhap({kieu:'area'},'p|tinhLai.giaiThich',tl.giaiThich), true, null, true));
};
TINH.tl=function(a){
  var y=a[0], cu=S.tinhLai.ketQuaCu[y], moi=S.tinhLai.ketQuaMoi[y];
  if(cu==null || moi==null) return '';
  var d=moi-cu, p=cu? d/cu*100 : null;
  return (d>0?'+':'')+vietSo(d,3)+(p==null?'':' ('+(p>0?'+':'')+vietSo(p,2)+' %)');
};
function napKyTruoc(file){
  var r=new FileReader();
  r.onerror=function(){ loi(fill(t('b7fLoi'),{f:file.name})); };
  r.onload=function(){
    var o;
    try{ o=JSON.parse(String(r.result).replace(BOM,'')); }catch(e){ loi(fill(t('eJson'),{f:file.name})); return; }
    if(!isObj(o) || typeof o.phienBan!=='number' || o.phienBan<1 || !isObj(o.coSo)){ loi(fill(t('eShape'),{f:file.name})); return; }
    if(o.phienBan>PHIEN_BAN){ loi(fill(t('eNewer'),{f:file.name,v:o.phienBan})); return; }
    o=chuanHoa(o);
    var ky=[o.ky.namBatDau,o.ky.namKetThuc];
    if(!ky[0] || !ky[1]){ loi(fill(t('eShape'),{f:file.name})); return; }
    UI7.file={ ten:file.name, ky:ky, gwp:o.gwp, rieng:tinhVoi(o).tong, o:o };
    hetLoi(); veLai();
  };
  r.readAsText(file,'utf-8');
}
ACT.napKy7=function(){ var i=$('qt-file7'); if(i){ i.value=''; i.click(); } };
ACT.dien7=function(p){
  var f=UI7.file; if(!f) return;
  var tl=S.tinhLai, nguon=p[0]==='cu'?f.rieng:tongNay(f), dich=p[0]==='cu'?'ketQuaCu':'ketQuaMoi';
  if(!nguon) return;
  tl.kyTruoc.namBatDau=f.ky[0]; tl.kyTruoc.namKetThuc=f.ky[1]; tl.fileKyTruoc=f.ten;
  f.ky.forEach(function(y){ var o=nguon[y]; if(o && !chuaDu(o)) tl[dich][y]=o.tong; });
  daSua(); veLai(); toast(t('b7fDaDien'));
};
THIEU[7]=function(){
  var tl=S.tinhLai, m=[];
  if(!tl.tinhTrang) return [t('b7mTt')];
  if(tl.tinhTrang!=='coDoi') return m;
  if(!tl.truongHop.length) m.push(t('b7mTh'));
  if(rong(tl.lyDo)) m.push(t('b7mLy'));
  var ky=kyTruoc();
  if(!ky.length) m.push(t('b7mKy'));
  ky.forEach(function(y){
    if(tl.ketQuaCu[y]==null) m.push(fill(t('b7mKq'),{y:y,c:t('b7cCu')}));
    if(tl.ketQuaMoi[y]==null) m.push(fill(t('b7mKq'),{y:y,c:t('b7cMoi')}));
  });
  if(rong(tl.giaiThich)) m.push(t('b7mGt'));
  return m;
};
