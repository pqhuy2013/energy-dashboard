/* ---------- Buoc 6. Danh gia do khong chac chan ----------
   Dieu 21 Thong tu 38/2023/TT-BCT dan chieu Dieu 11: danh gia 6 noi dung (khoan 1, dinh
   tinh) va dinh luong theo Chuong 3 Quyen 1 Huong dan IPCC 2006, 2019 (khoan 2). Phan
   dinh luong dung Phuong phap 1 (lan truyen sai so) cua IPCC 2006: phep nhan cong binh
   phuong phan tram (phuong trinh 3.1), phep cong theo phuong trinh 3.2; gia dinh cac sai
   so doc lap. Muc III.4 Mau so 06. */
Object.assign(T,{
  b6ccH:['Căn cứ','Legal basis'],
  b6cc:['Điều 21 Thông tư 38/2023/TT-BCT: đánh giá độ không chắc chắn kiểm kê cấp cơ sở thực hiện theo Điều 11 của Thông tư. Khoản 1 Điều 11 nêu 6 nội dung đánh giá; khoản 2 quy định định lượng theo Chương 3, Quyển 1, Hướng dẫn IPCC 2006, Hướng dẫn IPCC 2019. Nội dung này đi vào mục III.4 Mẫu số 06.','Article 21 of Circular 38/2023/TT-BCT: facility uncertainty assessment follows Article 11. Article 11(1) lists 6 aspects; Article 11(2) requires quantification per Volume 1, Chapter 3 of the 2006 and 2019 IPCC Guidelines. This feeds item III.4 of Form 06.'],
  b6dtH:['Đánh giá theo 6 nội dung, khoản 1 Điều 11','Assessment of the 6 aspects, Article 11(1)'],
  b6dtHint:['Dòng in nghiêng là gợi ý ứng dụng rút ra từ số liệu đã nhập','Italic lines are hints drawn from the entered data'],
  b6_a:['a) Tính hoàn thiện của báo cáo;','a) Completeness of the report;'],
  b6_b:['b) Tính phù hợp thực tế của mô hình, phương pháp kiểm kê;','b) Practical suitability of the model and inventory method;'],
  b6_c:['c) Tính đầy đủ của dữ liệu tính toán;','c) Sufficiency of the calculation data;'],
  b6_d:['d) Tính đại diện của số liệu;','d) Representativeness of the data;'],
  b6_dd:['đ) Tính bất thường của số liệu;','đ) Anomalies in the data;'],
  b6_e:['e) Sự thiếu minh bạch, sai phạm vi kiểm kê.','e) Lack of transparency, boundary errors.'],
  b6nx:['Nhận xét','Assessment'],
  b6gA:['Bước chưa hoàn thành: %s.','Steps not yet complete: %s.'],
  b6gAok:['Bước 0 đến Bước 5 đã hoàn thành.','Steps 0 to 5 are complete.'],
  b6gB:['Hệ số: %a từ Quyết định 2626, %b hệ số riêng được chấp thuận, %c theo IPCC, %d theo cách riêng của Mục 2. %e nguồn thuộc loại Thông tư 38 không có công thức.','Factors: %a from Decision 2626, %b approved facility factors, %c from IPCC, %d set by Section 2. %e sources are of a type with no formula in Circular 38.'],
  b6gC:['%n dòng ở bảng tính Bước 4 chưa tính được.','%n rows of the Step 4 calculation could not be computed.'],
  b6gCok:['Mọi dòng ở bảng tính Bước 4 đều tính được.','Every row of the Step 4 calculation was computed.'],
  b6gD:['%n dòng số liệu là ước tính.','%n data rows are estimates.'],
  b6gDok:['Không có số liệu ước tính.','No estimated figures.'],
  b6gDd:['Chênh lệch số liệu hoạt động lớn nhất giữa hai năm: %s.','Largest changes in activity data between the years: %s.'],
  b6gE:['%a dòng số liệu chưa ghi chứng từ. Loại nguồn đánh dấu không có: %b. Bể hấp thụ: %c.','%a data rows lack a document reference. Source types marked as absent: %b. Sinks: %c.'],
  b6khong:['không','none'], b6chuaTL:['chưa trả lời','not answered'],
  b6dlH:['Định lượng, khoản 2 Điều 11','Quantification, Article 11(2)'],
  b6dlHint:['Phương pháp 1, Chương 3 Quyển 1 Hướng dẫn IPCC 2006; không bắt buộc nhập đủ','Approach 1, Vol. 1 Ch. 3 of the 2006 IPCC Guidelines; entries optional'],
  b6dlP:['Nhập độ không chắc chắn của số liệu hoạt động và của hệ số cho từng dòng, theo phần trăm của nửa khoảng tin cậy 95 %. Độ không chắc chắn của dòng tính theo phương trình 3.1: căn bậc hai của tổng bình phương. Độ không chắc chắn của tổng tính theo phương trình 3.2. Phương pháp giả định các sai số độc lập với nhau và tương đối nhỏ.','Enter the uncertainty of the activity data and of the factor for each row, as a percentage half-width of the 95 % confidence interval. Row uncertainty follows equation 3.1: square root of the sum of squares. The total follows equation 3.2. The approach assumes independent and relatively small errors.'],
  b6uA:['U số liệu (%)','U activity data (%)'], b6uE:['U hệ số (%)','U factor (%)'], b6uK:['U kết hợp (%)','Combined U (%)'],
  b6tong:['Năm %y: độ không chắc chắn của tổng phát thải ±%u %, tính trên %p % tổng phát thải có đủ số liệu độ không chắc chắn.','%y: uncertainty of total emissions ±%u %, based on the %p % of total emissions with uncertainty inputs.'],
  b6tongKo:['Năm %y: chưa có dòng nào đủ số liệu độ không chắc chắn.','%y: no row has uncertainty inputs yet.'],
  b6dlLab:['Mô tả thêm về định lượng, nguồn của các giá trị độ không chắc chắn','Notes on the quantification and the sources of the uncertainty values'],
  b6m:['Nhận xét cho nội dung %k','Assessment for aspect %k']
});
var KHIA_CANH=['a','b','c','d','dd','e'];
function layU(id,muc,khi,tao){
  var ds=S.khongChacChan.bangU;
  for(var i=0;i<ds.length;i++){ var u=ds[i]; if(u.nguonId===id && u.muc===muc && u.khi===khi) return u; }
  if(!tao) return null;
  var u2={ nguonId:id, muc:muc, khi:khi, uAd:null, uEf:null }; ds.push(u2); return u2;
}
function uDong(u){ return (u && u.uAd!=null && u.uEf!=null) ? Math.sqrt(u.uAd*u.uAd+u.uEf*u.uEf) : null; }
/* Phuong trinh 3.2: U = sqrt(Σ(U_i·x_i)²) / |Σx_i|, tren cac dong co du U */
function uTong(kq,y){
  /* o [data-calc] cua man hinh cu co the con giu nam da ra khoi ky (vua mo ky moi, vua doi ky) */
  if(!kq.tong[y]) return null;
  var tong=kq.tong[y].tong, s2=0, sx=0;
  kq.dong.forEach(function(d){
    if(d.y!==y || d.loi || d.tco2e==null) return;
    var u=uDong(layU(d.n.id,d.muc,d.khi,false)); if(u==null) return;
    s2+=Math.pow(u*d.tco2e,2); sx+=d.tco2e;
  });
  if(!sx) return null;
  return { u:Math.sqrt(s2)/Math.abs(sx), phu:tong ? sx/tong*100 : 100 };
}
function goiY6(k,kq){
  var ys=namKy();
  if(k==='a'){ var chua=[0,1,2,3,4,5].filter(function(n){ return !xong(n); }).map(function(n){ return (L==='vi'?'Bước ':'Step ')+n; }); return chua.length ? fill(t('b6gA'),{s:chua.join(', ')}) : t('b6gAok'); }
  if(k==='b'){
    var dem={ qd2626:0, rieng:0, ipcc:0, muc2:0 }; S.heSo.forEach(function(h){ if(dem[h.bac]!=null && h.giaTri!=null) dem[h.bac]++; });
    var kct=S.nguon.filter(function(n){ return !!LOAI_BY[n.loai].pp.canhBao; }).length;
    return fill(t('b6gB'),{ a:dem.qd2626, b:dem.rieng, c:dem.ipcc, d:dem.muc2, e:kct });
  }
  if(k==='c'){ var n=kq.dong.filter(function(d){ return d.loi && !d.khongCT; }).length; return n ? fill(t('b6gC'),{n:n}) : t('b6gCok'); }
  if(k==='d'){ var u=S.soLieu.filter(function(r){ return r.laUocTinh; }).length; return u ? fill(t('b6gD'),{n:u}) : t('b6gDok'); }
  if(k==='dd'){
    if(ys.length<2) return '';
    var ds=[];
    S.nguon.forEach(function(n){ var a=laySo(n.id,ys[0],false), b=laySo(n.id,ys[1],false); if(a && b && a.gioTri && b.gioTri!=null) ds.push([nhanNguon(n),(b.gioTri-a.gioTri)/a.gioTri*100]); });
    ds.sort(function(x,y){ return Math.abs(y[1])-Math.abs(x[1]); });
    return ds.length ? fill(t('b6gDd'),{s:ds.slice(0,3).map(function(x){ return x[0]+' '+(x[1]>0?'+':'')+vietSo(x[1],1)+' %'; }).join('; ')}) : '';
  }
  if(k==='e'){
    var ct=0; S.soLieu.forEach(function(r){ if(r.gioTri!=null && rong(r.chungTu)) ct++; });
    var kc=S.loaiKhongCo.map(function(x){ return lv(LOAI_BY[x].ten); }).join(', ')||t('b6khong');
    var bh=S.beHapThu.coHayKhong===true?t('b1co'):(S.beHapThu.coHayKhong===false?t('b1ko'):t('b6chuaTL'));
    return fill(t('b6gE'),{a:ct,b:kc,c:bh});
  }
  return '';
}
VE[6]=function(sec){
  var kq=tinhToan(), ys=namKy();
  var cb=theCard(sec,t('b6ccH')); cb.appendChild(el('p',null,t('b6cc')));
  cb=theCard(sec,t('b6dtH'),t('b6dtHint')); cb.parentNode.id='b6-dinhtinh';
  KHIA_CANH.forEach(function(k){
    var box=el('div','qt-loai');
    box.appendChild(el('div','qt-loai-h')).appendChild(el('h4',null,t('b6_'+k)));
    var g=goiY6(k,kq); if(g){ var p=el('p','qt-note',g); p.style.fontStyle='italic'; p.style.margin='0 0 8px'; box.appendChild(p); }
    var o=oNhap({ kieu:'area', lab:T['b6_'+k] },'p|khongChacChan.dinhTinh.'+k,S.khongChacChan.dinhTinh[k]); o.style.minHeight='64px';
    box.appendChild(truong(t('b6nx'),o,true,null,true));
    cb.appendChild(box);
  });
  cb=theCard(sec,t('b6dlH'),t('b6dlHint')); cb.parentNode.id='b6-dinhluong';
  cb.appendChild(el('p','qt-note',t('b6dlP')));
  if(ys.length){
    var dong=kq.dong.filter(function(d){ return d.y===ys[0] && !d.loi; });
    if(dong.length){
      var w=el('div','qt-tbw'), tb=el('table','qt-t'), hr=el('tr');
      [t('b4cN'),t('b4cD'),t('b4cK'),t('b6uA'),t('b6uE'),t('b6uK')].forEach(function(x){ hr.appendChild(el('th',null,x)); });
      var th=el('thead'); th.appendChild(hr); tb.appendChild(th);
      var bd=el('tbody'), truoc=null;
      dong.forEach(function(d){
        var r=el('tr'), u=layU(d.n.id,d.muc,d.khi,false), bp='u|'+d.n.id+'|'+d.muc+'|'+d.khi+'|';
        r.appendChild(el('td',null,truoc===d.n?'':nhanNguon(d.n))); truoc=d.n;
        r.appendChild(el('td',null,d.muc)); r.appendChild(el('td',null,KHI_NHAN[d.khi]||d.khi));
        [['uAd','b6uA'],['uEf','b6uE']].forEach(function(x){ var td=el('td'); td.appendChild(oNhap({ kieu:'num', w:90, lab:T[x[1]] },bp+x[0],u?u[x[0]]:null)); r.appendChild(td); });
        var tk=el('td'), sp=el('span','qt-calc'); sp.setAttribute('data-calc','urow|'+d.n.id+'|'+d.muc+'|'+d.khi); tk.appendChild(sp); r.appendChild(tk);
        bd.appendChild(r);
      });
      tb.appendChild(bd); w.appendChild(tb); cb.appendChild(w);
      ys.forEach(function(y){ var p=el('p','qt-todo'); p.setAttribute('data-calc','utong|'+y); p.style.margin='8px 0 0'; cb.appendChild(p); });
    }
  }
  var g2=el('div','qt-grid'); g2.style.marginTop='12px'; cb.appendChild(g2);
  g2.appendChild(truong(t('b6dlLab'), oNhap({kieu:'area'},'p|khongChacChan.dinhLuong',S.khongChacChan.dinhLuong), false, null, true));
};
TINH.urow=function(a){ var u=uDong(layU(a[0],a[1],a[2],false)); return u==null?'':vietSo(u,1); };
TINH.utong=function(a){
  var y=+a[0], r=uTong(tinhToan(),y);
  return r ? fill(t('b6tong'),{y:y,u:vietSo(r.u*1,1),p:vietSo(r.phu,1)}) : fill(t('b6tongKo'),{y:y});
};
THIEU[6]=function(){
  return KHIA_CANH.filter(function(k){ return rong(S.khongChacChan.dinhTinh[k]); }).map(function(k){ return fill(t('b6m'),{k:t('b6_'+k).split(')')[0]}); });
};
