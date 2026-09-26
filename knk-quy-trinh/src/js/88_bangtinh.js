/* ---------- Bang tinh .xlsx ----------
   Cac trang tinh:
   - Thông tin: co so, ky, bo GWP.
   - Tổng hợp: ket qua theo nam, theo khi, theo loai nguon, tinh bang SUMIFS tu trang Bảng tính.
   - Bảng tính: bang tinh trung gian, moi dong mot khi cua mot nguon trong mot nam:
     luong khi (tan) = AD × EF × k (AD × k khi cong thuc khong co EF), phat thai = luong khi × GWP.
     k la he so doi don vi cua bo tinh (70_tinh.js), ghi kem dien giai.
   - Biểu năm y: bieu Muc 1 Phu luc II Thong tu 38 da dien, kem cot ung dung them va cot truy vet.
   - Hệ số, Kiểm soát chất lượng, Độ không chắc chắn (phuong trinh 3.1 va 3.2 bang cong thuc),
     Tính toán lại.
   Moi o cong thuc kem gia tri ung dung da tinh; Excel tinh lai khi mo file. */
function bangTinhXlsx(){ return voiTiengViet(function(){
  var kq=tinhToan(), ys=namKy(), BT='Bảng tính', qBT="'"+BT+"'!", sheets=[];
  function C(v,s){ return { v:v, s:s||(typeof v==='number'?'soTho':'o') }; }
  function F(f,v,s){ return { f:f, v:v, s:s||'so' }; }
  function H(x){ return { v:x, s:'dau' }; }
  function N(x){ return { v:x, s:'nhan' }; }
  function G(x){ return { v:x, s:'ghi' }; }
  function chuoi(s){ return '"'+String(s).replace(/"/g,'""')+'"'; }
  var cs=S.coSo;

  /* ---- Bảng tính ---- */
  var bt=[['STT','Năm','Nguồn phát thải','Loại nguồn (Điều 16)','Phạm vi','Điểm Mục 2','Khí','Số liệu hoạt động (AD)','Đơn vị AD',
           'Hệ số phát thải (EF)','Đơn vị EF','Hệ số đổi đơn vị (k)','Diễn giải k','Lượng khí (tấn) = AD × EF × k','GWP',
           'Phát thải (tấn CO₂tđ) = lượng khí × GWP','Trạng thái','Ghi chú'].map(H)];
  var hangBT=[];
  ys.forEach(function(y){
    kq.dong.filter(function(d){ return d.y===y; }).forEach(function(d){
      var r=bt.length+1, l=LOAI_BY[d.n.loai];
      var row=[C(r-1),C(y),C(nhanNguon(d.n)),C(lv(l.ten)),C(l.gt?'Gián tiếp':'Trực tiếp'),C(d.muc||''),C(d.khi?(KHI_NHAN[d.khi]||d.khi):'')];
      if(d.loi){
        for(var i=0;i<9;i++) row.push(C(''));
        row.push(C(d.khongCT?'Không có công thức':'Chưa tính được'),C(d.loi));
      } else {
        var ghi=[];
        if(d.adGhi) ghi.push('AD = '+d.adGhi);
        if(d.efGhi) ghi.push('EF = '+d.efGhi);
        if(d.muc==='2.1') ghi.push('GWP của môi chất '+d.n.phanLoai.trim()+' nhập ở Bước 3');
        if(d.h && d.h.maHeSo && /^QĐ2626:/.test(d.h.maHeSo)) ghi.push('Mã '+d.h.maHeSo.replace(':',' '));
        if(d.h && !rong(d.h.nguonGoc)) ghi.push('Nguồn gốc hệ số: '+d.h.nguonGoc.trim());
        row.push(C(d.ad),C(d.adDv),d.ef!=null?C(d.ef):C(''),C(d.efDv||''),C(d.k),C(d.kGhi||''),
                 F(d.ef!=null?'H'+r+'*J'+r+'*L'+r:'H'+r+'*L'+r,d.luong,'soTho'),
                 d.gwp!=null?C(d.gwp):C(''),
                 d.gwp!=null?F('N'+r+'*O'+r,d.tco2e,'so'):C(''),
                 C(d.gwp!=null?'Đã tính':'Chưa chọn bộ GWP'),C(ghi.join('. ')));
      }
      bt.push(row); hangBT.push({ d:d, r:r });
    });
  });
  var n=bt.length;
  function tongIf(dk,v){ return n>1 ? F('SUMIFS('+qBT+'$P$2:$P$'+n+dk+')',v) : C(v||0,'so'); }
  function demIf(dk,v){ return n>1 ? F('COUNTIFS('+qBT+'$B$2:$B$'+n+dk+')',v,'soTho') : C(v||0,'soTho'); }

  /* ---- Thông tin ---- */
  var tt=[[{ v:'Bảng tính kiểm kê khí nhà kính cấp cơ sở', s:'tieuDe' }],
    [G('Lập bằng ứng dụng knk-quy-trinh, bản dựng ngày '+dmyv(BUILD)+'. Ngày xuất file: '+dmyv(new Date().toISOString().slice(0,10))+'. Các ô tính toán là công thức, Excel tính lại khi mở file.')],[],
    [N('Tên cơ sở'),C(cs.ten)],[N('Địa chỉ'),C(cs.diaChi)],[N('Mã số thuế'),C(cs.maSoThue)],
    [N('Kỳ báo cáo'),C(ys.length?'Năm '+ys[0]+' và năm '+ys[1]:'')],[N('Bộ GWP'),C(S.gwp||'Chưa chọn')]];
  if(S.gwp) ['CO2','CH4','N2O'].forEach(function(k){ tt.push([N('GWP '+KHI_NHAN[k]),C(k==='CO2'?1:DATA.gwp[S.gwp][k])]); });
  tt.push([],[N('Các trang tính')]);
  [['Tổng hợp','kết quả theo năm, tính bằng công thức SUMIFS từ trang Bảng tính'],
   ['Bảng tính','mỗi dòng là một khí của một nguồn trong một năm; lượng khí = AD × EF × k, phát thải = lượng khí × GWP; k là hệ số đổi đơn vị, có diễn giải'],
   ['Biểu năm …','các biểu Mục 1 Phụ lục II Thông tư 38/2023/TT-BCT đã điền, kèm cột ứng dụng thêm và thông tin truy vết số liệu'],
   ['Hệ số','hệ số phát thải đã gán, bậc theo Điều 18 và nguồn gốc'],
   ['Kiểm soát chất lượng','biên bản Bước 5'],
   ['Độ không chắc chắn','phương trình 3.1 và 3.2, Chương 3 Quyển 1 Hướng dẫn IPCC 2006'],
   ['Tính toán lại','kết quả kỳ trước theo Điều 22 Thông tư 38/2023/TT-BCT, nếu có']].forEach(function(x){ tt.push([C(x[0]),C(x[1])]); });
  tt.push([],[G('Ứng dụng là công cụ hỗ trợ tính toán, không thay thế trách nhiệm của cơ sở. Người dùng tự chịu trách nhiệm kiểm tra kết quả. Văn bản có hiệu lực pháp lý là bản gốc của các nghị định, thông tư.')]);
  sheets.push({ ten:'Thông tin', rong:[26,90], dong:tt });

  /* ---- Tổng hợp ---- */
  var th=[[H('Chỉ tiêu (tấn CO₂ tương đương)')].concat(ys.map(function(y){ return H('Năm '+y); }))];
  function dongTH(nhan,f,dam){ th.push([dam?{ v:nhan, s:'oDam' }:C(nhan)].concat(ys.map(function(y,i){ return f(y,kq.tong[y],XL.cot(i+1)); }))); return th.length; }
  var rTT=dongTH('Phát thải trực tiếp',function(y,o){ return tongIf(','+qBT+'$B$2:$B$'+n+','+y+','+qBT+'$E$2:$E$'+n+',"Trực tiếp"',o.tt); });
  var rGT=dongTH('Phát thải gián tiếp',function(y,o){ return tongIf(','+qBT+'$B$2:$B$'+n+','+y+','+qBT+'$E$2:$E$'+n+',"Gián tiếp"',o.gt); });
  dongTH('Tổng phát thải',function(y,o,c){ return F(c+rTT+'+'+c+rGT,o.tong,'soDam'); },true);
  th.push([N('Theo khí')]);
  ['CO2','CH4','N2O','HFC'].forEach(function(k){
    if(!ys.some(function(y){ return kq.dong.some(function(d){ return d.y===y && d.khi===k && !d.loi; }); })) return;
    dongTH(KHI_NHAN[k],function(y,o){ return tongIf(','+qBT+'$B$2:$B$'+n+','+y+','+qBT+'$G$2:$G$'+n+','+chuoi(KHI_NHAN[k]),o.khi[k]||0); });
  });
  th.push([N('Theo loại nguồn')]);
  LOAI.forEach(function(l){
    /* nhu Buoc 4: chi loai co ket qua; loai khong co cong thuc nam o dong dem ben duoi */
    if(!ys.some(function(y){ return kq.tong[y].loai[l.k]!=null; })) return;
    dongTH(lv(l.ten),function(y,o){ return tongIf(','+qBT+'$B$2:$B$'+n+','+y+','+qBT+'$D$2:$D$'+n+','+chuoi(lv(l.ten)),o.loai[l.k]||0); });
  });
  th.push([N('Dòng chưa gồm trong tổng')]);
  dongTH('Số dòng chưa tính được',function(y,o){ return demIf(','+y+','+qBT+'$Q$2:$Q$'+n+',"Chưa tính được"',o.loi); });
  dongTH('Số dòng chưa chọn bộ GWP',function(y,o){ return demIf(','+y+','+qBT+'$Q$2:$Q$'+n+',"Chưa chọn bộ GWP"',o.chuaGwp); });
  dongTH('Số nguồn không có công thức trong Thông tư 38',function(y,o){ return demIf(','+y+','+qBT+'$Q$2:$Q$'+n+',"Không có công thức"',o.khongCT); });
  th.push([],[G('Tổng phát thải chỉ gồm các dòng đã tính của trang Bảng tính. Bộ GWP: '+(S.gwp||'chưa chọn')+'.')]);
  sheets.push({ ten:'Tổng hợp', rong:[44].concat(ys.map(function(){ return 18; })), dong:th, coDinh:1 });
  sheets.push({ ten:BT, rong:[6,7,34,22,11,9,9,16,10,14,14,12,26,18,8,18,16,50], dong:bt, coDinh:1 });

  /* ---- Biểu năm y ---- */
  ys.forEach(function(y){
    var R=[[{ v:'Biểu số liệu hoạt động năm '+y+', theo Mục 1 Phụ lục II Thông tư 38/2023/TT-BCT', s:'tieuDe' }],
      [G('Cột ghi "(ứng dụng thêm)" không có trong biểu của Thông tư. Năm cột cuối là thông tin truy vết số liệu theo Điều 17 Thông tư.')],[]], maxc=1;
    LOAI.forEach(function(l){
      var ds=nguonTheoLoai(l.k); if(!ds.length) return;
      var b=l.bang, map=[], hdr=[H('STT')];
      R.push([N((b.so?'Bảng '+b.so+'. ':'')+lv(b.ten))]);
      b.cot.forEach(function(c){
        hdr.push(H(lv(c.lab)+(c.tt38===false?' (ứng dụng thêm)':''))); map.push({ c:c });
        if(c.donVi){ hdr.push(H('Đơn vị')); map.push({ c:c, dv:true }); }
      });
      ['Nguồn số liệu','Số hiệu chứng từ','Người cung cấp','Số liệu ước tính','Cách ước tính'].forEach(function(x){ hdr.push(H(x)); });
      R.push(hdr); maxc=Math.max(maxc,hdr.length);
      function cotCua(f){ for(var j=0;j<map.length;j++){ var m=map[j]; if(f(m)) return XL.cot(j+1); } return null; }
      var cG=cotCua(function(m){ return m.c.s==='gioTri' && !m.dv; }), cU=cotCua(function(m){ return m.c.s==='donVi' || m.dv; }),
          cN=cotCua(function(m){ return m.c.s==='ct.nhietTri'; }), cP=cotCua(function(m){ return m.c.n==='phanLoai'; });
      var r0=R.length+1;
      ds.forEach(function(nn,i){
        var so=laySo(nn.id,y,false)||{ gioTri:null, donVi:b.donVi||'', chiTiet:{}, nguonSoLieu:'', chungTu:'', nguoiCungCap:'', laUocTinh:false, cachUocTinh:'' };
        var r=R.length+1, row=[C(i+1)];
        map.forEach(function(m){
          var c=m.c;
          if(m.dv){ row.push(C(so.donVi||'')); return; }
          if(c.n){ var raw=getP(nn,duongDan(c.n)); row.push(c.so && typeof raw==='number' ? C(raw) : C(giaTriNguon(nn,c))); return; }
          if(c.calc==='tj'){
            var tj=tjCua(nn,so), f=null;
            if(tj && cG && cN) f=(l.k==='codinh' && cU) ? 'IF('+cU+r+'="TJ",'+cG+r+',IF('+cU+r+'="GJ",'+cG+r+'/1000,IF('+cU+r+'="MJ",'+cG+r+'/1000000,'+cG+r+'*'+cN+r+')))' : cG+r+'*'+cN+r;
            row.push(f ? F(f,tj.v,'soTho') : C('')); return;
          }
          var v=getP(so,duongDan(c.s));
          if(c.kieu==='num') row.push(v==null?C(''):C(v));
          else if(c.kieu==='date') row.push(C(v?dmyv(v):''));
          else row.push(C(v==null?'':String(v)));
        });
        row.push(C(so.nguonSoLieu||''),C(so.chungTu||''),C(so.nguoiCungCap||''),C(so.laUocTinh?'Có':'Không'),C(so.cachUocTinh||''));
        R.push(row);
      });
      var r1=R.length;
      if(l.k==='moichat' && cP && cG){
        R.push([],[N('Bảng 2.1. Lượng môi chất lạnh nạp hàng năm')],[H('STT'),H('Loại môi chất lạnh'),H('Lượng môi chất nạp (kg)')]);
        var loai=[]; ds.forEach(function(nn){ var k=nn.phanLoai.trim(); if(k && loai.indexOf(k)<0) loai.push(k); });
        loai.forEach(function(k,i){
          var tong=0; ds.forEach(function(nn){ if(nn.phanLoai.trim()!==k) return; var so=laySo(nn.id,y,false); if(so && so.gioTri!=null) tong+=so.gioTri; });
          R.push([C(i+1),C(k),F('SUMIF('+cP+r0+':'+cP+r1+','+chuoi(k)+','+cG+r0+':'+cG+r1+')',tong,'soTho')]);
        });
      }
      R.push([]);
    });
    var rong=[6]; for(var i=1;i<maxc;i++) rong.push(18);
    sheets.push({ ten:'Biểu năm '+y, rong:rong, dong:R });
  });

  /* ---- Hệ số ---- */
  var hs=[['Nguồn phát thải','Khí','Năm','Mã hệ số','Tên hệ số','Giá trị','Đơn vị','Bậc theo Điều 18','Nguồn gốc','Tham số'].map(H)];
  S.nguon.forEach(function(nn){
    var l=LOAI_BY[nn.loai];
    (l.hs.khi||[]).forEach(function(k){
      (l.hs.theoNam?ys:[null]).forEach(function(y){
        var h=layHs(nn.id,k,y,false); if(!h) return;
        var ts=Object.keys(h.thamSo||{}).filter(function(x){ return h.thamSo[x]!=null && h.thamSo[x]!==''; }).map(function(x){ return x+' = '+(typeof h.thamSo[x]==='number'?vietSo(h.thamSo[x]):h.thamSo[x]); }).join('; ');
        hs.push([C(nhanNguon(nn)),C(k==='GWP'?'GWP '+nn.phanLoai.trim():(KHI_NHAN[k]||k)),y==null?C(''):C(y),C(h.maHeSo||''),C(h.tenHeSo||''),
                 h.giaTri==null?C(''):C(h.giaTri),C(h.donVi||''),C(T['bac_'+h.bac]?T['bac_'+h.bac][0]:''),C(h.nguonGoc||''),C(ts)]);
      });
    });
  });
  sheets.push({ ten:'Hệ số', rong:[34,12,7,18,34,12,16,34,40,30], dong:hs, coDinh:1 });

  /* ---- Kiểm soát chất lượng ---- */
  var qc=[['STT','Nội dung kiểm soát','Người kiểm tra','Ngày','Kết quả','Sai sót phát hiện','Cách xử lý'].map(H)];
  S.qc.forEach(function(q,i){ qc.push([C(i+1),C(q.noiDung),C(q.nguoiKiem),C(q.ngay?dmyv(q.ngay):''),C(q.ketQua==='dat'?'Đạt':q.ketQua==='saiSot'?'Có sai sót':''),C(q.loiPhatHien),C(q.cachXuLy)]); });
  sheets.push({ ten:'Kiểm soát chất lượng', rong:[6,40,20,12,12,36,36], dong:qc, coDinh:1 });

  /* ---- Độ không chắc chắn ---- */
  var uk=[['Năm','Nguồn phát thải','Điểm Mục 2','Khí','Phát thải (tấn CO₂tđ)','U số liệu (%)','U hệ số (%)','U kết hợp (%), phương trình 3.1','U × phát thải'].map(H)];
  ys.forEach(function(y){
    var a=uk.length+1;
    hangBT.forEach(function(o){
      var d=o.d; if(d.y!==y || d.loi || d.tco2e==null) return;
      var r=uk.length+1, u=layU(d.n.id,d.muc,d.khi,false), ud=uDong(u);
      uk.push([C(y),C(nhanNguon(d.n)),C(d.muc),C(KHI_NHAN[d.khi]||d.khi),F(qBT+'P'+o.r,d.tco2e),
               u&&u.uAd!=null?C(u.uAd,'pt'):C(''),u&&u.uEf!=null?C(u.uEf,'pt'):C(''),
               F('IF(AND(ISNUMBER(F'+r+'),ISNUMBER(G'+r+')),SQRT(F'+r+'^2+G'+r+'^2),"")',ud,'pt'),
               F('IF(ISNUMBER(H'+r+'),H'+r+'*E'+r+',"")',ud==null?null:ud*d.tco2e,'so')]);
    });
    var b=uk.length; if(b<a) return;
    var ut=uTong(kq,y), co='SUMPRODUCT(--ISNUMBER(H'+a+':H'+b+'),E'+a+':E'+b+')';
    uk.push([C(y),{ v:'Độ không chắc chắn của tổng phát thải (%), phương trình 3.2', s:'oDam' },C(''),C(''),C(''),C(''),C(''),
             F('IF('+co+'=0,"",SQRT(SUMSQ(I'+a+':I'+b+'))/'+co+')',ut?ut.u:null,'pt'),C('')]);
    uk.push([C(y),C('Tỷ lệ phát thải có đủ số liệu độ không chắc chắn (%)'),C(''),C(''),C(''),C(''),C(''),
             F('IF(SUM(E'+a+':E'+b+')=0,"",'+co+'/SUM(E'+a+':E'+b+')*100)',ut?ut.phu:null,'pt'),C('')]);
  });
  uk.push([],[G('Phương pháp 1, Chương 3 Quyển 1 Hướng dẫn IPCC 2006: U kết hợp = căn bậc hai của tổng bình phương (phương trình 3.1); U tổng = căn bậc hai của tổng bình phương (U × phát thải), chia cho tổng phát thải của các dòng có đủ U (phương trình 3.2). Giả định các sai số độc lập với nhau.')]);
  sheets.push({ ten:'Độ không chắc chắn', rong:[7,34,10,10,16,12,12,18,16], dong:uk, coDinh:1 });

  /* ---- Tính toán lại ---- */
  var tl=S.tinhLai;
  if(tl.tinhTrang==='coDoi'){
    var kt=[[{ v:'Tính toán lại kết quả kỳ trước, Điều 22 Thông tư 38/2023/TT-BCT', s:'tieuDe' }],
      [N('Trường hợp'),C(tl.truongHop.map(function(k){ return boCuoi(T['b7_'+k][0]); }).join('; '))],
      [N('Mô tả thay đổi'),C(tl.lyDo)],[N('File kỳ trước'),C(tl.fileKyTruoc||'')],[],
      ['Năm','Kết quả đã báo cáo (tấn CO₂tđ)','Kết quả tính lại (tấn CO₂tđ)','Chênh lệch (tấn CO₂tđ)','Chênh lệch (%)'].map(H)];
    var ky=tl.kyTruoc;
    [ky.namBatDau,ky.namKetThuc].forEach(function(y){
      if(y==null) return;
      var r=kt.length+1, cu=tl.ketQuaCu[y], moi=tl.ketQuaMoi[y];
      kt.push([C(y),cu==null?C(''):C(cu,'so'),moi==null?C(''):C(moi,'so'),
               F('IF(AND(ISNUMBER(B'+r+'),ISNUMBER(C'+r+')),C'+r+'-B'+r+',"")',(cu!=null&&moi!=null)?moi-cu:null),
               F('IF(AND(ISNUMBER(B'+r+'),ISNUMBER(C'+r+'),B'+r+'<>0),(C'+r+'-B'+r+')/B'+r+'*100,"")',(cu&&moi!=null)?(moi-cu)/cu*100:null,'pt')]);
    });
    kt.push([],[N('Giải thích'),C(tl.giaiThich)]);
    sheets.push({ ten:'Tính toán lại', rong:[18,24,24,22,16], dong:kt });
  }
  return sheets;
}); }
function xuatXlsx(){
  var sheets=bangTinhXlsx(), ten=S.coSo.ten||'co so';
  var blob=XL.tao(sheets,'Bảng tính kiểm kê khí nhà kính, '+ten);
  var name=tenFile('KNK_BangTinh','xlsx');
  taiBlob(blob,name); toast(fill(t('b8tXlsx'),{f:name}));
}
