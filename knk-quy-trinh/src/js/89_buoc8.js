/* ---------- Buoc 8. Ket qua va xuat bao cao ----------
   Dieu 23 Thong tu 38/2023/TT-BCT: bao cao theo Mau so 06 Phu luc II Nghi dinh 06/2022/ND-CP.
   Diem e khoan 1 Dieu 11 Nghi dinh 06, bo sung tai diem b khoan 7 Dieu 1 Nghi dinh
   119/2025/ND-CP: bao cao gom ket qua cua hai nam lien ke nam nop. Doc tu ban goc: Thong
   tu 38 trang in so 9; Nghi dinh 119 ban .docx.
   Bang kiem truoc khi nop la Phan F tai lieu quy trinh; ung dung tu kiem nhung muc kiem duoc. */
Object.assign(T,{
  b8ccH:['Căn cứ','Legal basis'],
  b8cc1:['Điều 23 Thông tư 38/2023/TT-BCT: “Cơ sở xây dựng Báo cáo kiểm kê KNK cấp cơ sở theo Mẫu số 06 Phụ lục II Nghị định số 06/2022/NĐ-CP.”',
         'Article 23 of Circular 38/2023/TT-BCT: the facility prepares its facility-level GHG inventory report on Form 06, Appendix II of Decree 06/2022/ND-CP.'],
  b8cc2:['Điểm e khoản 1 Điều 11 Nghị định 06/2022/NĐ-CP, bổ sung tại điểm b khoản 7 Điều 1 Nghị định 119/2025/NĐ-CP: “Báo cáo kết quả kiểm kê khí nhà kính định kỳ hai năm một lần của cơ sở bao gồm kết quả kiểm kê khí nhà kính của hai năm liền kề năm nộp báo cáo.”',
         'Article 11(1)(e) of Decree 06/2022/ND-CP, added by Article 1(7)(b) of Decree 119/2025/ND-CP: the facility’s biennial inventory report covers the two years immediately before the year of submission.'],
  b8ttH:['Tình trạng hồ sơ','Record status'],
  b8ttHint:['Bản thảo xuất được bất cứ lúc nào; chỗ còn thiếu ghi [Chưa nhập: …] tô vàng trong file','The draft can be exported at any time; gaps are marked [Chưa nhập: …] and highlighted in the file'],
  b8cB:['Bước','Step'], b8cT:['Tình trạng','Status'],
  b8xong:['Đã xong','Done'], b8con:['Còn %n mục','%n items left'], b8den:['Mở','Open'],
  b8conBuoc:['Còn %n bước chưa xong. File vẫn xuất được, chỗ còn thiếu được đánh dấu để hoàn thiện sau.','%n steps are not complete. Files can still be exported; gaps are marked for later.'],
  b8duBuoc:['Bước 0 đến Bước 7 đã xong.','Steps 0 to 7 are complete.'],
  b8kqH:['Kết quả','Results'], b8kqHint:['Tấn CO₂ tương đương','Tonnes CO₂ equivalent'],
  b8kqGwp:['Bộ GWP: %g. Chi tiết từng dòng ở Bước 4.','GWP set: %g. Row-by-row detail in Step 4.'],
  b8u:['Độ không chắc chắn năm %y: ±%u %.','Uncertainty %y: ±%u %.'],
  b8xH:['Xuất file','Export'], b8xHint:['File xuất viết bằng tiếng Việt, vì báo cáo nộp cơ quan nhà nước Việt Nam','Exported files are in Vietnamese, as the report is filed with Vietnamese authorities'],
  b8docx:['Tải bản thảo Mẫu số 06 (.docx)','Download Form 06 draft (.docx)'],
  b8xlsx:['Tải bảng tính (.xlsx)','Download workbook (.xlsx)'],
  b8json:['Tải file dữ liệu (.json)','Download data file (.json)'],
  b8docxP:['Bản thảo Mẫu số 06: giữ nguyên câu chữ các đề mục của mẫu, tiêu đề ghi cả hai năm của kỳ, khổ A4, chữ Times New Roman 14, số trang từ trang 2. Người có thẩm quyền của cơ sở phải rà soát, hoàn thiện và ký trước khi nộp.',
           'Form 06 draft: the form’s headings are kept word for word, the title names both years of the period, A4, Times New Roman 14, page numbers from page 2. An authorised person at the facility must review, complete and sign it before submission.'],
  b8xlsxP:['Bảng tính gồm: trang tổng hợp tính bằng công thức; bảng tính trung gian, mỗi dòng một khí của một nguồn, lượng khí = số liệu hoạt động × hệ số × hệ số đổi đơn vị, phát thải = lượng khí × GWP; các biểu Mục 1 Phụ lục II đã điền cho từng năm; hệ số; biên bản kiểm soát chất lượng; độ không chắc chắn; tính toán lại. Excel tính lại công thức khi mở file.',
           'The workbook holds: a summary sheet built from formulas; the intermediate calculation, one row per gas per source, gas = activity data × factor × unit factor, emissions = gas × GWP; the filled Section 1 tables of Appendix II for each year; factors; the quality control log; uncertainty; recalculation. Excel recalculates the formulas on opening.'],
  b8jsonP:['File .json là hồ sơ đầy đủ để nạp lại vào ứng dụng, kể cả ở kỳ sau.','The .json file is the complete record to load back into the app, including next period.'],
  b8xemH:['Xem trước bản thảo','Draft preview'], b8xemHint:['Cùng nội dung với file .docx. Khung nền xanh là ghi chú của ứng dụng, không in vào file','Same content as the .docx. Blue boxes are app notes and are not printed in the file'],
  b8webBang:['Ghi chú của ứng dụng, không in vào file .docx: bảng dưới đây là cách trình bày của ứng dụng, không phải bảng bắt buộc của Mẫu số 06; Mẫu số 06 chỉ quy định đề mục.',
             'App note, not printed in the .docx: the table below is how the app presents the data; Form 06 prescribes headings only, no tables.'],
  b8tDocx:['Đã tải %f.','Downloaded %f.'], b8tXlsx:['Đã tải %f.','Downloaded %f.'],
  b8loiX:['Không tạo được file: %e','Could not create the file: %e'],
  b8fH:['Bảng kiểm trước khi nộp','Pre-submission checklist'], b8fHint:['Phần F tài liệu quy trình; ứng dụng tự kiểm những mục kiểm được','Part F of the procedure document; the app checks what it can'],
  b8fNd:['Nội dung kiểm','Check'], b8fCc:['Căn cứ','Basis'], b8fKq:['Kết quả','Result'],
  b8dat:['Đạt','Passed'], b8chua:['Chưa đạt','Not yet'], b8tu:['Tự kiểm','Check yourself'], b8ka:['Không áp dụng','Not applicable'],
  b8mBuoc:['Bước %n chưa xong','Step %n is not complete'],
  f1:['Đã xác định đúng nhóm đối tượng A, B hay C','The obligation group A, B or C has been determined'],
  f2:['Báo cáo có kết quả của cả 2 năm liền kề năm nộp','The report has results for both years before the submission year'],
  f3:['Đã liệt kê đủ 6 loại nguồn trực tiếp và 2 loại nguồn gián tiếp, hoặc nêu rõ loại nào không có','All 6 direct and 2 indirect source types are listed, or marked as absent'],
  f4:['Không bỏ sót phát thải gián tiếp từ điện mua ngoài','Indirect emissions from purchased electricity are not omitted'],
  f5:['Mỗi hệ số phát thải đều ghi được nguồn gốc theo 1 trong 3 bậc','Every emission factor states its origin under one of the 3 tiers'],
  f6:['Hệ số phát thải lưới điện ghi rõ năm và văn bản công bố','The grid emission factor states its year and the publishing document'],
  f7:['Đã ghi rõ bộ GWP sử dụng và giữ nhất quán với kỳ trước','The GWP set is stated and consistent with the previous period'],
  f8:['Không nhân trực tiếp hệ số hiệu chỉnh với số liệu hoạt động','No correction factor is multiplied directly with activity data'],
  f9:['Có biên bản kiểm soát chất lượng','A quality control log exists'],
  f10:['Có phần đánh giá độ không chắc chắn','An uncertainty assessment exists'],
  f11:['Nếu có thay đổi phạm vi, phương pháp hoặc hệ số thì đã tính toán lại kỳ trước','If the boundary, method or factors changed, the previous period has been recalculated'],
  f12:['Báo cáo theo đúng Mẫu số 06 Phụ lục II Nghị định 06/2022/NĐ-CP','The report follows Form 06, Appendix II of Decree 06/2022/ND-CP'],
  f13:['Gửi đúng nơi nhận theo nhóm đối tượng','Sent to the right recipient for the group'],
  f14:['Gửi đúng mốc thời hạn theo nhóm đối tượng','Sent by the deadline for the group'],
  f15:['Hồ sơ số liệu gốc được lưu giữ tại cơ sở','Source data records are kept at the facility'],
  f2nam:['năm %y còn %n dòng chưa tính được hoặc không có công thức','%y has %n rows not computed or without a formula'],
  f4dien:['Đã đánh dấu cơ sở không dùng điện mua ngoài, cần kiểm tra lại.','Marked as using no purchased electricity; check again.'],
  f7gwp:['Bộ %g. Đối chiếu với bộ đã dùng ở kỳ trước.','Set %g. Compare with the set used last period.'],
  f12docx:['Bản thảo xuất theo đề mục Mẫu số 06.','The draft follows the Form 06 headings.']
});
var PHAN_F_CC=[
  ['Khoản 4 Điều 11 Nghị định 06/2022/NĐ-CP sửa đổi','Art. 11(4) of Decree 06/2022/ND-CP as amended'],
  ['Điểm e khoản 1 Điều 11','Art. 11(1)(e)'],
  ['Điều 16 Thông tư 38/2023/TT-BCT','Art. 16 of Circular 38/2023/TT-BCT'],
  ['Điểm a khoản 2 Điều 16','Art. 16(2)(a)'],
  ['Điều 18 Thông tư 38/2023/TT-BCT','Art. 18 of Circular 38/2023/TT-BCT'],
  ['Công văn của cơ quan quản lý','Official letter of the authority'],
  ['Điểm c khoản 1 Điều 11','Art. 11(1)(c)'],
  ['Quyết định 2626/QĐ-BTNMT','Decision 2626/QD-BTNMT'],
  ['Điều 20 Thông tư 38/2023/TT-BCT','Art. 20 of Circular 38/2023/TT-BCT'],
  ['Điều 21 Thông tư 38/2023/TT-BCT','Art. 21 of Circular 38/2023/TT-BCT'],
  ['Điều 22 Thông tư 38/2023/TT-BCT','Art. 22 of Circular 38/2023/TT-BCT'],
  ['Điều 23 Thông tư 38/2023/TT-BCT','Art. 23 of Circular 38/2023/TT-BCT'],
  ['Bảng A.2 tài liệu quy trình','Table A.2 of the procedure document'],
  ['Bảng A.2 tài liệu quy trình','Table A.2 of the procedure document'],
  ['Điều 17 Thông tư 38/2023/TT-BCT','Art. 17 of Circular 38/2023/TT-BCT']
];

/* Ket qua tu kiem tung muc Phan F: { kq:'dat'|'chua'|'tu'|'ka', ghi } */
function kiemPhanF(kq){
  var ys=namKy(), out=[];
  function hsDung(){
    var ds=[];
    S.nguon.forEach(function(n){ var l=LOAI_BY[n.loai]; (l.hs.khi||[]).forEach(function(k){ (l.hs.theoNam?ys:[null]).forEach(function(y){ var h=layHs(n.id,k,y,false); if(h && h.giaTri!=null) ds.push({ n:n, h:h }); }); }); });
    return ds;
  }
  var nhom=S.coSo.nhom, ghiNhom=nhom ? t('nhom'+nhom+'d') : '';
  out.push({ kq:nhom?'dat':'chua', ghi:nhom?lv(['Nhóm ','Group '])+nhom:'' });
  var thieuNam=ys.map(function(y){ var o=kq.tong[y], n=o.loi+o.chuaGwp+o.khongCT; return n ? fill(t('f2nam'),{y:y,n:n}) : ''; }).filter(Boolean);
  out.push({ kq:(ys.length===2 && S.nguon.length && !thieuNam.length)?'dat':'chua', ghi:!ys.length?t('b2mKy'):!S.nguon.length?t('b2mNguon'):thieuNam.join('; ') });
  out.push({ kq:LOAI.every(function(l){ return nguonTheoLoai(l.k).length || S.loaiKhongCo.indexOf(l.k)>=0; })?'dat':'chua' });
  if(nguonTheoLoai('dien').length) out.push({ kq:'dat' });
  else if(S.loaiKhongCo.indexOf('dien')>=0) out.push({ kq:'tu', ghi:t('f4dien') });
  else out.push({ kq:'chua' });
  var hs=hsDung();
  out.push({ kq:(hs.length && hs.every(function(o){ return !rong(o.h.bac) && !rong(o.h.nguonGoc); }))?'dat':'chua' });
  var hd=hs.filter(function(o){ return o.n.loai==='dien'; });
  if(!nguonTheoLoai('dien').length) out.push({ kq:'ka' });
  else out.push({ kq:(hd.length===nguonTheoLoai('dien').length*ys.length && hd.every(function(o){ return o.h.nam!=null && !rong(o.h.nguonGoc); }))?'dat':'chua' });
  out.push({ kq:S.gwp?'dat':'chua', ghi:S.gwp?fill(t('f7gwp'),{g:S.gwp}):'' });
  out.push({ kq:kq.dong.some(function(d){ return d.loi===t('tkHc'); })?'chua':'dat' });
  out.push({ kq:xong(5)?'dat':'chua' });
  out.push({ kq:xong(6)?'dat':'chua' });
  out.push({ kq:xong(7)?'dat':'chua' });
  out.push({ kq:'dat', ghi:t('f12docx') });
  out.push({ kq:'tu', ghi:ghiNhom });
  out.push({ kq:'tu', ghi:ghiNhom });
  out.push({ kq:'tu' });
  return out;
}

VE[8]=function(sec){
  var kq=tinhToan(), ys=namKy();
  var cb=theCard(sec,t('b8ccH'));
  cb.appendChild(el('p',null,t('b8cc1')));
  cb.appendChild(el('p',null,t('b8cc2')));

  /* tinh trang ho so */
  cb=theCard(sec,t('b8ttH'),t('b8ttHint')); cb.parentNode.id='b8-tinhtrang';
  var w=el('div','qt-tbw'), tb=el('table','qt-t'), hr=el('tr');
  [t('b8cB'),t('b8cT'),''].forEach(function(x){ hr.appendChild(el('th',null,x)); });
  var th=el('thead'); th.appendChild(hr); tb.appendChild(th);
  var bd=el('tbody'), con=0;
  STEPS.slice(0,8).forEach(function(st){
    var m=THIEU[st.n]?THIEU[st.n]():[], r=el('tr'); r.setAttribute('data-b8',st.n);
    r.appendChild(el('td',null,st.n+'. '+lv(st.s)));
    var c=el('td'); c.appendChild(el('span','qt-chip '+(m.length?'qt-cw':'qt-cok'),m.length?fill(t('b8con'),{n:m.length}):t('b8xong'))); r.appendChild(c);
    r.appendChild(oThaoTac([m.length?nut(t('b8den'),'goBuoc|'+st.n):null]));
    if(m.length) con++;
    bd.appendChild(r);
  });
  tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
  cb.appendChild(el('div',con?'qt-alert':'qt-info',con?fill(t('b8conBuoc'),{n:con}):t('b8duBuoc')));

  /* ket qua */
  if(ys.length && S.nguon.length){
    cb=theCard(sec,t('b8kqH'),t('b8kqHint')); cb.parentNode.id='b8-ketqua';
    w=el('div','qt-tbw'); tb=el('table','qt-t'); hr=el('tr');
    [t('b4ct')].concat(ys.map(function(y){ return fill(t('b2nam'),{y:y}); })).forEach(function(x){ hr.appendChild(el('th',null,x)); });
    th=el('thead'); th.appendChild(hr); tb.appendChild(th); bd=el('tbody');
    [['tt',t('b4tt')],['gt',t('b4gt')],['tong',t('b4tong')]].forEach(function(x){
      var r=el('tr'), c0=el('td',null,x[1]); if(x[0]==='tong') c0.style.fontWeight='650'; r.appendChild(c0);
      ys.forEach(function(y){
        var o=kq.tong[y], td=el('td','qt-calc',sGon(o[x[0]])); td.setAttribute('data-kq8',y+'|'+x[0]);
        if(o.loi || o.chuaGwp || o.khongCT){ td.appendChild(document.createTextNode(' ')); td.appendChild(el('span','qt-chip qt-cw',t('b4chuaDu'))); }
        r.appendChild(td);
      });
      bd.appendChild(r);
    });
    tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
    cb.appendChild(el('p','qt-note',fill(t('b8kqGwp'),{g:S.gwp||t('b7fChuaGwp')})));
    ys.forEach(function(y){ var u=uTong(kq,y); if(u) cb.appendChild(el('p','qt-note',fill(t('b8u'),{y:y,u:vietSo(u.u,1)}))); });
  }

  /* xuat file */
  cb=theCard(sec,t('b8xH'),t('b8xHint')); cb.parentNode.id='b8-xuat';
  [['b8docx','xuatDocx','qt-pri','b8docxP'],['b8xlsx','xuatXlsx',null,'b8xlsxP'],['b8json','xuatJson',null,'b8jsonP']].forEach(function(x){
    var row=el('div','qt-xuat'); row.appendChild(nut(t(x[0]),x[1],x[2]));
    var p=el('p','qt-note',t(x[3])); row.appendChild(p);
    if(x[1]==='xuatDocx') row.appendChild(el('p','qt-note',t('s8note')));
    cb.appendChild(row);
  });

  /* bang kiem Phan F */
  cb=theCard(sec,t('b8fH'),t('b8fHint')); cb.parentNode.id='b8-phanf';
  w=el('div','qt-tbw'); tb=el('table','qt-t'); hr=el('tr');
  ['#',t('b8fNd'),t('b8fCc'),t('b8fKq')].forEach(function(x,i){ hr.appendChild(el('th',i===0?'qt-stt':null,x)); });
  th=el('thead'); th.appendChild(hr); tb.appendChild(th); bd=el('tbody');
  kiemPhanF(kq).forEach(function(o,i){
    var r=el('tr'); r.setAttribute('data-f',String(i+1));
    r.appendChild(el('td','qt-stt',String(i+1)));
    r.appendChild(el('td',null,t('f'+(i+1))));
    r.appendChild(el('td',null,lv(PHAN_F_CC[i])));
    var c=el('td'); c.appendChild(el('span','qt-chip '+({ dat:'qt-cok', chua:'qt-cw', tu:'', ka:'' }[o.kq]),t({ dat:'b8dat', chua:'b8chua', tu:'b8tu', ka:'b8ka' }[o.kq])));
    if(o.ghi) c.appendChild(el('small','qt-fghi',o.ghi));
    r.appendChild(c); bd.appendChild(r);
  });
  tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);

  /* xem truoc */
  cb=theCard(sec,t('b8xemH'),t('b8xemHint')); cb.parentNode.id='b8-xemtruoc';
  cb.appendChild(mau06Html(mau06()));
};
THIEU[8]=function(){
  var m=[];
  for(var n=0;n<8;n++) if(!xong(n)) m.push(fill(t('b8mBuoc'),{n:n}));
  return m;
};
function chayXuat(fn){ try{ fn(); }catch(e){ loi(fill(t('b8loiX'),{e:e && e.message || String(e)})); } }
ACT.xuatDocx=function(){ chayXuat(xuatDocx); };
ACT.xuatXlsx=function(){ chayXuat(xuatXlsx); };
ACT.xuatJson=function(){ taiVe(); };
