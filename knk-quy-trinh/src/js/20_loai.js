/* ---------- tam loai nguon phat thai theo Dieu 16 Thong tu 38/2023/TT-BCT ----------
   Moi loai khai bao mot lan, dung chung cho Buoc 1 (truong cua nguon), Buoc 2 (bang
   so lieu) va Buoc 3 (o he so). Ten cot bang so lieu chep nguyen van Muc 1 Phu luc II
   Thong tu 38/2023/TT-BCT (xem TT38_Phu_luc_II.md); cot co tt38:false la cot ung
   dung them, dat sau cot cua Thong tu.

   Truong nguon (nf): f la duong dan trong ban ghi nguon, 'tt.x' la thuocTinh.x.
   Cot bang so lieu (cot):
     { n:'truong nguon' }        hien gia tri cua nguon, khong sua o Buoc 2
     { s:'truong so lieu' }      o nhap, 'ct.x' la chiTiet.x
     { calc:'ten' }              o tinh san, khong luu vao file
   Kieu o nhap: text, num, date, sel (opts), list (goi y), area. */
var NHIEN_LIEU = (function(){
  var seen={}, out=[], re=/^Hệ số phát thải (?:CO2|CH4|N2O) của (.+)$/;
  DATA.hs.forEach(function(r){ var m=r[3]==='Các hoạt động đốt nhiên liệu' && re.exec(r[5]); if(m && !seen[m[1]]){ seen[m[1]]=1; out.push(m[1]); } });
  return out;
})();
var LOAI = [
  { k:'codinh', gt:false, d16:'1a',
    ten:['Nguồn cố định','Stationary combustion'],
    mo:['Đốt nhiên liệu trong thiết bị lắp đặt cố định như nồi hơi, lò nung, đầu đốt, tua-bin, lò sưởi, lò đốt','Fuel combustion in fixed equipment such as boilers, kilns, burners, turbines, heaters, incinerators'],
    pp:{ m2:'1' },
    nf:[ { f:'phanLoai', lab:['Loại nhiên liệu','Fuel type'], kieu:'list', list:NHIEN_LIEU, req:true, w:170 },
         { f:'thietBi', lab:['Thiết bị','Equipment'], ph:['Nồi hơi, lò nung, đầu đốt...','Boiler, kiln, burner...'], w:170 },
         { f:'viTri', lab:['Vị trí','Location'], w:130 },
         { f:'ghiChu', lab:['Ghi chú','Notes'], w:150 } ],
    bang:{ so:'1.1', ten:['Nhiên liệu sử dụng trong quá trình đốt từ nguồn cố định','Fuel used in combustion from stationary sources'],
      cot:[ { n:'phanLoai', lab:['Loại nhiên liệu','Fuel type'] },
            { s:'gioTri', kieu:'num', lab:['Lượng tiêu thụ','Quantity consumed'], req:true },
            { s:'donVi', kieu:'list', list:['lít','tấn','m³','kg','BTU','GJ','TJ'], lab:['Đơn vị tính (lít/tấn/m³, BTU...)','Unit (litre/tonne/m³, BTU...)'], req:true, w:90 },
            { s:'ct.nhietTri', kieu:'num', lab:['Hệ số nhiệt trị (TJ/đơn vị nhiên liệu)','Calorific value (TJ per fuel unit)'], req:'nhietTri' },
            { calc:'tj', lab:['Tổng tiêu thụ (TJ)','Total consumption (TJ)'] } ] },
    hs:{ khi:['CO2','CH4','N2O'], nhom:'Các hoạt động đốt nhiên liệu', mau:'kg/TJ', tra:true, bac:['rieng','ipcc'] } },

  { k:'didong', gt:false, d16:'1b',
    ten:['Nguồn di động','Mobile combustion'],
    mo:['Đốt nhiên liệu của các thiết bị vận tải','Fuel combustion in transport equipment'],
    pp:{ m2:'1' },
    nf:[ { f:'tt.loaiPhuongTien', lab:['Loại phương tiện (ôtô/xe máy)','Vehicle type (car/motorbike)'], kieu:'list', list:['Ô tô','Xe máy','Xe nâng','Máy xúc','Máy ủi','Tàu, thuyền'], w:140 },
         { f:'thietBi', lab:['Thông tin phương tiện (nhãn hiệu, kiểu xe, biển số,...)','Vehicle details (make, model, plate,...)'], req:true, w:220 },
         { f:'phanLoai', lab:['Loại nhiên liệu (xăng hoặc dầu diesel)','Fuel (petrol or diesel)'], kieu:'list', list:['Xăng','Dầu diesel'], req:true, w:150 },
         { f:'ghiChu', lab:['Ghi chú','Notes'], w:150 } ],
    bang:{ so:'1.2', ten:['Nhiên liệu sử dụng trong quá trình đốt nhiêu liệu từ nguồn di động','Fuel used in combustion from mobile sources'],
      cot:[ { n:'tt.loaiPhuongTien', lab:['Loại phương tiện (ôtô/xe máy)','Vehicle type (car/motorbike)'] },
            { n:'thietBi', lab:['Thông tin phương tiện (nhãn hiệu, kiểu xe, biển số,...)','Vehicle details (make, model, plate,...)'] },
            { n:'phanLoai', lab:['Loại nhiên liệu (xăng hoặc dầu diesel)','Fuel (petrol or diesel)'] },
            { s:'gioTri', kieu:'num', lab:['Lượng tiêu thụ (lít)','Quantity consumed (litres)'], req:true },
            { s:'ct.quangDuong', kieu:'num', lab:['Quãng đường di chuyển trong năm (km)','Distance travelled in the year (km)'] },
            { s:'ct.nhietTri', kieu:'num', lab:['Hệ số nhiệt trị (TJ/lít)','Calorific value (TJ/litre)'], req:true, tt38:false },
            { calc:'tj', lab:['Tổng tiêu thụ (TJ)','Total consumption (TJ)'], tt38:false } ],
      donVi:'lít', ghiThem:['Hai cột cuối do ứng dụng thêm: Điểm 1 Mục 2 tính theo TJ, nên cần nhiệt trị để đổi lít ra TJ.','The last two columns are added by the app: Point 1 of Section 2 works in TJ, so a calorific value is needed to convert litres to TJ.'] },
    hs:{ khi:['CO2','CH4','N2O'], nhom:'Các hoạt động đốt nhiên liệu', mau:'kg/TJ', tra:true, bac:['rieng','ipcc'] } },

  { k:'congnghiep', gt:false, d16:'1c',
    ten:['Quá trình công nghiệp','Industrial processes'],
    mo:['Phát thải từ các quá trình vật lý hoặc hóa học tạo ra khí nhà kính trong dây chuyền sản xuất','Emissions from physical or chemical processes in the production line'],
    pp:{ canhBao:['Thông tư 38/2023/TT-BCT không có biểu số liệu và không có công thức cho loại nguồn này. Ứng dụng lưu số liệu và hệ số, nhưng sẽ không tự tính phát thải.','Circular 38/2023/TT-BCT has neither a data table nor a formula for this source type. The app stores the data and factors but will not compute emissions automatically.'] },
    nf:[ { f:'thietBi', lab:['Công đoạn, dây chuyền','Process step, line'], req:true, w:180 },
         { f:'phanLoai', lab:['Loại quá trình','Process type'], kieu:'list', list:['Sản xuất clinker xi măng','Sản xuất vôi','Sản xuất thủy tinh','Sản xuất amoniac','Sản xuất axit nitric','Sản xuất thép lò thổi BOF','Sản xuất thép lò điện hồ quang EAF'], req:true, w:190 },
         { f:'tt.nguyenLieu', lab:['Nguyên liệu hoặc sản phẩm','Raw material or product'], w:160 },
         { f:'ghiChu', lab:['Ghi chú','Notes'], w:140 } ],
    bang:{ so:'', ten:['Số liệu quá trình công nghiệp','Industrial process data'],
      nguonBang:['Thông tư 38 không có biểu; dựng theo biểu E.3 tài liệu quy trình','Circular 38 has no table; built from table E.3 of the procedure document'],
      cot:[ { n:'thietBi', lab:['Công đoạn, dây chuyền','Process step, line'] },
            { n:'phanLoai', lab:['Loại quá trình','Process type'] },
            { n:'tt.nguyenLieu', lab:['Nguyên liệu hoặc sản phẩm','Raw material or product'] },
            { s:'gioTri', kieu:'num', lab:['Sản lượng','Output'], req:true },
            { s:'donVi', kieu:'list', list:['tấn'], lab:['Đơn vị','Unit'], req:true, w:80 } ] },
    hs:{ khi:['CO2','CH4','N2O'], lv:'Các quá trình công nghiệp và sử dụng sản phẩm', tra:true, bac:['rieng','ipcc'], itNhat:1 } },

  { k:'phattan', gt:false, d16:'1d',
    ten:['Phát tán, khai thác khoáng sản','Fugitive, mining'],
    mo:['Phát thải do phát tán từ trong máy móc, thiết bị hoặc trong quá trình khai thác, chế biến khoáng sản','Fugitive emissions from equipment or from mining and mineral processing'],
    pp:{ m2:'5', luu:['Mục 2 chỉ có công thức cho khai thác than, điểm 5.1 đến 5.5.','Section 2 only has formulas for coal mining, points 5.1 to 5.5.'] },
    nf:[ { f:'phanLoai', lab:['Loại khoáng sản','Mineral'], kieu:'list', list:['Than'], req:true, w:130 },
         { f:'tt.congNghe', lab:['Công nghệ khai thác','Mining method'], kieu:'sel', req:true, w:170,
           opts:[['hamlo',['Hầm lò','Underground']],['lothien',['Lộ thiên','Surface']],['khac',['Khác, phát tán từ máy móc, thiết bị','Other, fugitive from equipment']]] },
         { f:'thietBi', lab:['Tên khu vực khai thác','Mining area'], w:160 },
         { f:'viTri', lab:['Vị trí khai thác','Location'], w:130 },
         { f:'ghiChu', lab:['Đặc điểm công nghệ khai thác','Mining technology details'], w:170 } ],
    bang:{ so:'3', ten:['Số liệu hoạt động trong khai thác, sản xuất, chế biến khoáng sản','Activity data for mining and mineral processing'],
      cot:[ { n:'phanLoai', lab:['Loại khoáng sản','Mineral'] },
            { s:'gioTri', kieu:'num', lab:['Sản lượng khai thác (tấn hoặc m³)','Output (tonnes or m³)'], req:true, donVi:['tấn','m³'] },
            { n:'@khaiThac', lab:['Tên, vị trí khai thác, đặc điểm công nghệ khai thác','Mining area, location, technology'] },
            { s:'ct.ch4Dot', kieu:'num', lab:['CH₄ thu gom đem đốt (m³)','CH₄ captured and flared (m³)'], tt38:false },
            { s:'ct.hieuSuatDot', kieu:'num', lab:['Hiệu suất đốt CH₄ (%)','CH₄ combustion efficiency (%)'], tt38:false } ],
      ghiThem:['Hai cột cuối do ứng dụng thêm, cần cho điểm 5.2 và 5.3 Mục 2. Bỏ trống nếu không thu gom CH₄.','The last two columns are added by the app for points 5.2 and 5.3 of Section 2. Leave blank if no CH₄ is captured.'] },
    hs:{ khi:['CH4'], nhom:'Phát thải do phát tán', tra:true, bac:['rieng','ipcc'], mau:'m³ CH₄/tấn' } },

  { k:'moichat', gt:false, d16:'1đ',
    ten:['Môi chất lạnh','Refrigerants'],
    mo:['Phát thải KNK là các dung môi chất lạnh từ thiết bị và quá trình sản xuất, kinh doanh môi chất lạnh','Refrigerant emissions from equipment and from refrigerant production and trade'],
    pp:{ m2:'2' },
    nf:[ { f:'thietBi', lab:['Thông tin thiết bị (Nhãn hiệu và kiểu máy)','Equipment (make and model)'], req:true, w:150 },
         { f:'viTri', lab:['Vị trí lắp đặt','Installed at'], w:110 },
         { f:'tt.ngayBatDau', lab:['Ngày bắt đầu sử dụng (lắp đặt)','Date put into use (installed)'], kieu:'date', w:136 },
         { f:'phanLoai', lab:['Loại môi chất lạnh được sử dụng (R22, R410a, R134a,...)','Refrigerant used (R22, R410a, R134a,...)'], kieu:'list', list:['R22','R32','R134a','R404A','R407C','R410A','R507A'], req:true, w:116 },
         { f:'tt.congSuatLanh', lab:['Công suất lạnh (BTU/giờ)','Cooling capacity (BTU/h)'], kieu:'num', w:96 },
         { f:'tt.khoiLuongNapDay', lab:['Khối lượng môi chất lạnh khi nạp đầy (kg)','Full charge (kg)'], kieu:'num', w:100 } ],
    bang:{ so:'2.2', ten:['Thông tin về các thiết bị lạnh sử dụng','Refrigeration equipment in use'],
      cot:[ { n:'thietBi', lab:['Thông tin thiết bị (Nhãn hiệu và kiểu máy)','Equipment (make and model)'] },
            { n:'viTri', lab:['Vị trí lắp đặt','Installed at'] },
            { n:'tt.ngayBatDau', lab:['Ngày bắt đầu sử dụng (lắp đặt)','Date put into use (installed)'], ngay:true },
            { n:'phanLoai', lab:['Loại môi chất lạnh được sử dụng (R22, R410a, R134a,...)','Refrigerant used (R22, R410a, R134a,...)'] },
            { n:'tt.congSuatLanh', lab:['Công suất lạnh (BTU/giờ)','Cooling capacity (BTU/h)'], so:true },
            { n:'tt.khoiLuongNapDay', lab:['Khối lượng môi chất lạnh khi nạp đầy (kg)','Full charge (kg)'], so:true },
            { s:'ct.luongNapGanNhat', kieu:'num', lab:['Lượng nạp gần nhất (kg)','Most recent top-up (kg)'] },
            { s:'ct.thoiGianNapGanNhat', kieu:'date', lab:['Thời gian nạp gần nhất','Date of most recent top-up'] },
            { s:'gioTri', kieu:'num', lab:['Lượng nạp bổ sung trong năm (kg)','Refrigerant added in the year (kg)'], req:true, tt38:false } ],
      donVi:'kg', ghiThem:['Cột cuối do ứng dụng thêm: cộng theo loại môi chất ra bảng 2.1, là số liệu cho phương pháp 2.1 Mục 2. Không nạp thì ghi 0.','The last column is added by the app: summed by refrigerant into table 2.1, the input to method 2.1 of Section 2. Enter 0 if nothing was added.'] },
    hs:{ khi:['GWP'], gwp:true, bac:['muc2'] } },

  { k:'chatthai', gt:false, d16:'1e',
    ten:['Chất thải','Waste'],
    mo:['Phát thải từ thu gom, quản lý và xử lý chất thải','Emissions from waste collection, management and treatment'],
    pp:{ canhBao:['Điểm 6 Mục 2 dẫn sang Mục 2 Chương 2 Thông tư 17/2022/TT-BTNMT. Ứng dụng chưa có văn bản này, nên lưu số liệu và hệ số nhưng sẽ không tự tính phát thải.','Point 6 of Section 2 refers to Chapter 2, Section 2 of Circular 17/2022/TT-BTNMT. The app does not have that text yet, so it stores the data and factors but will not compute emissions automatically.'] },
    nf:[ { f:'phanLoai', lab:['Loại chất thải, cách xử lý','Waste type, treatment'], req:true, w:200 },
         { f:'thietBi', lab:['Công trình, thiết bị xử lý','Treatment facility'], w:170 },
         { f:'viTri', lab:['Vị trí','Location'], w:120 },
         { f:'ghiChu', lab:['Ghi chú','Notes'], w:140 } ],
    bang:{ so:'', ten:['Số liệu quản lý, xử lý chất thải','Waste management data'],
      nguonBang:['Thông tư 38 không có biểu; biểu tạm để lưu số liệu','Circular 38 has no table; a provisional table to keep the data'],
      cot:[ { n:'phanLoai', lab:['Loại chất thải, cách xử lý','Waste type, treatment'] },
            { n:'thietBi', lab:['Công trình, thiết bị xử lý','Treatment facility'] },
            { s:'gioTri', kieu:'num', lab:['Khối lượng','Quantity'], req:true },
            { s:'donVi', kieu:'list', list:['tấn','kg','m³'], lab:['Đơn vị','Unit'], req:true, w:80 } ] },
    hs:{ khi:['CO2','CH4','N2O'], lv:'Chất thải', tra:true, bac:['rieng','ipcc'], itNhat:1 } },

  { k:'dien', gt:true, d16:'2a',
    ten:['Điện','Electricity'],
    mo:['Phát thải do tiêu thụ năng lượng điện','Emissions from electricity consumption'],
    pp:{ m2:'3' },
    nf:[ { f:'phanLoai', lab:['Nguồn sử dụng','Supply'], kieu:'sel', req:true, w:180,
           opts:[['Điện lưới',['Điện lưới','Grid']],['Điện tự sản xuất',['Điện tự sản xuất','Self-generated']],['Điện mua trực tiếp',['Điện mua trực tiếp','Direct purchase']]] },
         { f:'thietBi', lab:['Điểm đo, công tơ','Meter'], w:170 },
         { f:'viTri', lab:['Vị trí','Location'], w:130 },
         { f:'ghiChu', lab:['Ghi chú','Notes'], w:150 } ],
    bang:{ so:'4.1', ten:['Số liệu sử dụng điện','Electricity use'],
      cot:[ { s:'gioTri', kieu:'num', lab:['Lượng điện tiêu thụ (MWh)','Electricity consumed (MWh)'], req:true },
            { n:'phanLoai', lab:['Nguồn sử dụng (Điện lưới/tự sản xuất/mua trực tiếp)','Supply (grid/self-generated/direct purchase)'] },
            { s:'ghiChu', kieu:'text', lab:['Ghi chú','Notes'], w:160 } ],
      donVi:'MWh' },
    hs:{ khi:['CO2'], theoNam:true, luoi:true, bac:['muc2'], mau:'tCO₂/MWh' } },

  { k:'hoi', gt:true, d16:'2b',
    ten:['Hơi','Steam'],
    mo:['Phát thải do sử dụng năng lượng hơi mua từ bên ngoài','Emissions from purchased steam'],
    pp:{ m2:'4' },
    nf:[ { f:'thietBi', lab:['Đơn vị cung cấp hơi','Steam supplier'], req:true, w:190 },
         { f:'phanLoai', lab:['Mức áp suất, loại hơi','Pressure level, steam type'], w:160 },
         { f:'viTri', lab:['Điểm nhận hơi','Delivery point'], w:130 },
         { f:'ghiChu', lab:['Ghi chú','Notes'], w:150 } ],
    bang:{ so:'4.2', ten:['Số liệu về sử dụng hơi','Steam use'],
      cot:[ { s:'ct.apSuat', kieu:'text', lab:['Áp suất hơi nước (P)','Steam pressure (P)'], w:100 },
            { s:'ct.nhietDo', kieu:'num', lab:['Nhiệt độ hơi nước (°C)','Steam temperature (°C)'] },
            { s:'ct.khoiLuongGio', kieu:'num', lab:['Khối lượng hơi (tấn/giờ)','Steam flow (tonnes/hour)'] },
            { s:'ct.entanpi', kieu:'num', lab:['Entanpi của hơi nước (kJ/kg)','Steam enthalpy (kJ/kg)'] },
            { s:'ct.tyLeNhienLieu', kieu:'text', lab:['Tỷ lệ các loại nhiên liệu của lò hơi','Boiler fuel mix'], w:160 },
            { s:'gioTri', kieu:'num', lab:['Tổng khối lượng hơi mua trong năm (tấn)','Total steam purchased in the year (tonnes)'], req:'hoi', tt38:false },
            { s:'ct.soGio', kieu:'num', lab:['Số giờ cấp hơi trong năm','Hours of supply in the year'], tt38:false } ],
      donVi:'tấn', ghiThem:['Hai cột cuối do ứng dụng thêm: Điểm 4 Mục 2 cần tổng lượng hơi theo tấn, còn bảng 4.2 ghi tấn/giờ. Nhập tổng lượng hơi, hoặc nhập số giờ cấp hơi để ứng dụng đổi ra tấn.','The last two columns are added by the app: Point 4 of Section 2 needs total steam in tonnes, while table 4.2 records tonnes per hour. Enter the total, or the hours of supply so the app can convert.'] },
    hs:{ khi:['CO2'], bac:['muc2'], mau:'tCO₂/tấn hơi' } }
];
var LOAI_BY=Object.create(null); LOAI.forEach(function(l){ LOAI_BY[l.k]=l; });
function nguonTheoLoai(k){ return S.nguon.filter(function(n){ return n.loai===k; }); }
function timNguon(id){ for(var i=0;i<S.nguon.length;i++) if(S.nguon[i].id===id) return S.nguon[i]; return null; }
function nhanNguon(n){
  var l=LOAI_BY[n.loai], ds=nguonTheoLoai(n.loai), i=ds.indexOf(n)+1;
  var chu=[n.phanLoai, n.thietBi, n.viTri].filter(function(x){ return x && x.trim(); }).join(', ');
  return lv(l.ten)+' '+i+(chu?': '+chu:'');
}
function laySo(id,nam,tao){
  for(var i=0;i<S.soLieu.length;i++){ var r=S.soLieu[i]; if(r.nguonId===id && r.nam===nam) return r; }
  if(!tao) return null;
  var n=timNguon(id), dv=(n && LOAI_BY[n.loai].bang.donVi)||'';
  var r2={ nguonId:id, nam:nam, gioTri:null, donVi:dv, nguonSoLieu:'', chungTu:'', nguoiCungCap:'', laUocTinh:false, cachUocTinh:'', ghiChu:'', chiTiet:{} };
  S.soLieu.push(r2); return r2;
}
function layHs(id,khi,nam,tao){
  for(var i=0;i<S.heSo.length;i++){ var h=S.heSo[i]; if(h.nguonId===id && h.khi===khi && h.nam===nam) return h; }
  if(!tao) return null;
  var h2={ nguonId:id, khi:khi, nam:nam, maHeSo:'', tenHeSo:'', giaTri:null, donVi:'', bac:'', nguonGoc:'', thamSo:{} };
  S.heSo.push(h2); return h2;
}
/* Truong cua ban ghi theo duong dan rut gon cua cau hinh: 'tt.x' -> thuocTinh.x, 'ct.x' -> chiTiet.x */
function duongDan(f){ return f.replace(/^tt\./,'thuocTinh.').replace(/^ct\./,'chiTiet.'); }
