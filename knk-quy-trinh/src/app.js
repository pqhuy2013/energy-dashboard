/* ====================== Quy trinh kiem ke KNK cap co so - app ====================== */
(function(){
"use strict";

/* Ngay dung do build.py gan vao window.__QT_BUILD__. Trang khong tu troi theo dong ho nguoi xem. */
var BUILD = window.__QT_BUILD__ || '2026-09-26';
var BUILD_YEAR = +BUILD.slice(0,4);
var DATA = window.__QT_DATA__ || { tinh:[], bo:[] };
var PHIEN_BAN = 1;
var KEY = 'knk-quy-trinh/v1';
var KEY_META = 'knk-quy-trinh/v1/meta';
var KEY_LANG = 'knk-quy-trinh/lang';
var BO_MAC_DINH = 'Công Thương';
var L = 'vi';

/* ---------- chu ---------- */
var T = {
  brand:['Kiểm kê KNK cấp cơ sở','Facility GHG inventory'],
  brandsub:['Quy trình 8 bước theo Thông tư 38/2023/TT-BCT','8-step procedure under Circular 38/2023/TT-BCT'],
  home:['Màn hình mở','Start'],
  build:['Bản dựng ngày %d','Build of %d'],
  storeOk:['Lưu tạm trong trình duyệt: đang bật.','Browser autosave: on.'],
  storeLast:['Lần cuối %t.','Last saved %t.'],
  storeBad:['Lưu tạm trong trình duyệt: không dùng được. Nhớ tải file .json về máy.','Browser autosave: unavailable. Remember to download the .json file.'],
  btnfull:['Mở toàn màn hình','Open full screen'],
  btnsave:['Tải file .json','Download .json'],
  btnopen:['Nạp file .json','Load .json file'],
  btnnew:['Bắt đầu kỳ mới','Start a new period'],
  btnresume:['Tiếp tục','Continue'],
  btncancel:['Hủy','Cancel'],
  btnsavefirst:['Tải về trước','Download first'],
  btnprev:['← Bước trước','← Previous step'],
  btnnext:['Bước sau →','Next step →'],
  framemsg:['Trang đang chạy trong khung nhúng của một trang khác. Trình duyệt có thể chặn hoặc tách riêng bộ nhớ lưu tạm. Bấm Mở toàn màn hình để làm việc ổn định hơn, và luôn tải file .json về máy.',
            'This page is running inside a frame on another site. The browser may block or isolate autosave storage. Use Open full screen for a more reliable session, and always download the .json file.'],
  stripDirty:['Có thay đổi chưa tải về máy. Số liệu chỉ nằm trong trình duyệt này, hãy tải file .json trước khi đóng trang.',
              'You have changes that are not downloaded. The data lives only in this browser, so download the .json file before closing the page.'],
  stripSaved:['Đã tải file về lúc %t. Chưa có thay đổi mới.','File downloaded at %t. No new changes.'],
  stripLoaded:['Đang làm trên file %f, nạp lúc %t. Chưa có thay đổi mới.','Working on file %f, loaded at %t. No new changes.'],
  stripBlank:['Hồ sơ trống. Số liệu bạn nhập chỉ nằm trong trình duyệt này cho tới khi bạn tải file .json về.','Empty record. What you enter stays only in this browser until you download the .json file.'],
  homeh:['Kiểm kê khí nhà kính cấp cơ sở','Facility-level greenhouse gas inventory'],
  homep1:['Ứng dụng dẫn cơ sở đi qua 8 bước kiểm kê khí nhà kính theo Điều 15 Thông tư 38/2023/TT-BCT, tính ra tấn CO₂ tương đương, rồi xuất bản thảo báo cáo theo Mẫu số 06 Phụ lục II Nghị định 06/2022/NĐ-CP cùng bảng tính Excel lưu hồ sơ.',
          'The app walks a facility through the 8 inventory steps of Article 15 of Circular 38/2023/TT-BCT, computes tonnes of CO₂ equivalent, and exports a draft report on Form 06, Appendix II of Decree 06/2022/ND-CP, together with an Excel workbook for the records.'],
  homep2:['Số liệu bạn nhập chỉ nằm trong trình duyệt này. Muốn làm tiếp ở lần sau hoặc trên máy khác, hãy tải file .json về và giữ lại.',
          'What you enter stays only in this browser. To continue later or on another computer, download the .json file and keep it.'],
  homenostore:['Trình duyệt đang chặn bộ nhớ lưu tạm, thường gặp khi trang được nhúng trong trang khác hoặc ở chế độ riêng tư. Ứng dụng vẫn chạy bình thường, nhưng đóng trang là mất số liệu chưa tải về. Hãy tải file .json về sau mỗi lần làm việc.',
               'The browser is blocking autosave storage, which is common when the page is embedded in another site or in private mode. The app still works, but closing the page loses anything not downloaded. Download the .json file after each session.'],
  resumeh:['Tiếp tục phiên đang làm dở','Continue the unfinished session'],
  resumeinfo:['%n, kỳ %k. Lưu tạm lúc %t.','%n, period %k. Autosaved at %t.'],
  noname:['(chưa có tên cơ sở)','(no facility name yet)'],
  noky:['chưa chọn','not chosen'],
  newh:['Bắt đầu kỳ kiểm kê mới','Start a new inventory period'],
  newp:['Mở hồ sơ trống, bắt đầu từ Bước 0 là thông tin cơ sở và nhóm đối tượng.','Open an empty record, starting from Step 0: facility information and obligation group.'],
  loadh:['Nạp file đã lưu','Load a saved file'],
  loadp:['Mở file .json đã tải về từ lần làm việc trước, kể cả file của kỳ trước để dùng lại danh mục nguồn phát thải.','Open a .json file downloaded in an earlier session, including a previous period’s file to reuse its list of emission sources.'],
  stepsh:['Chín màn hình của ứng dụng','The nine screens'],
  stepshint:['Đi lại tự do giữa các bước, không phải làm theo thứ tự','Move freely between steps; no fixed order is enforced'],
  scope:['Ứng dụng hiện phục vụ cơ sở ngành Công Thương, theo quy trình 8 bước của Thông tư 38/2023/TT-BCT. Cơ sở ngành Xây dựng làm theo Thông tư 13/2024/TT-BXD với 10 bước, chưa được hỗ trợ.',
         'The app currently serves facilities under the Ministry of Industry and Trade, following the 8-step procedure of Circular 38/2023/TT-BCT. Construction-sector facilities follow Circular 13/2024/TT-BXD with 10 steps and are not supported yet.'],
  nhomh:['Nhóm đối tượng','Obligation group'],
  nhomhint:['Khoản 4 Điều 11 Nghị định 06/2022/NĐ-CP, sửa đổi bởi Nghị định 119/2025/NĐ-CP','Article 11(4) of Decree 06/2022/ND-CP as amended by Decree 119/2025/ND-CP'],
  nhomp:['Ba nhóm có kỳ số liệu đầu tiên, nơi nộp và mốc nộp khác nhau. Chọn nhóm của cơ sở. Tra danh mục Quyết định 42/2026/QĐ-TTg và Quyết định 699/QĐ-BNNMT để gợi ý nhóm sẽ có ở bản sau.',
         'The three groups differ in first data year, recipient and deadline. Choose the facility’s group. A lookup in Decision 42/2026/QD-TTg and Decision 699/QD-BNNMT to suggest the group will come in a later version.'],
  nhomA:['Nhóm A','Group A'],
  nhomAd:['Cơ sở không được phân bổ hạn ngạch. Kỳ số liệu đầu tiên cho năm 2024 trở đi. Nộp Ủy ban nhân dân cấp tỉnh trước 31/3, kể từ năm 2025.',
          'Facilities without an emission allowance allocation. First data year 2024 onward. Submit to the provincial People’s Committee by 31 March, from 2025.'],
  nhomAc:['Điểm b khoản 4 Điều 11','Article 11(4)(b)'],
  nhomB:['Nhóm B','Group B'],
  nhomBd:['Nhà máy nhiệt điện, cơ sở sản xuất sắt thép, xi măng được phân bổ hạn ngạch giai đoạn 2025 đến 2026, gồm 110 cơ sở theo Quyết định 699/QĐ-BNNMT. Kỳ số liệu đầu tiên cho năm 2026 trở đi. Báo cáo phải được thẩm định, nộp Bộ Nông nghiệp và Môi trường trước 01/12, kể từ năm 2027.',
          'Thermal power, iron and steel, and cement facilities allocated allowances for 2025 to 2026, the 110 facilities in Decision 699/QD-BNNMT. First data year 2026 onward. The report must be verified and sent to the Ministry of Agriculture and Environment by 1 December, from 2027.'],
  nhomBc:['Điểm c khoản 4 và khoản 6a Điều 11','Article 11(4)(c) and 11(6a)'],
  nhomC:['Nhóm C','Group C'],
  nhomCd:['Cơ sở được phân bổ hạn ngạch giai đoạn từ năm 2027. Kỳ số liệu đầu tiên cho năm 2028 trở đi. Báo cáo phải được thẩm định, nộp Bộ Nông nghiệp và Môi trường trước 01/12, kể từ năm 2027.',
          'Facilities allocated allowances from the 2027 phase. First data year 2028 onward. The report must be verified and sent to the Ministry of Agriculture and Environment by 1 December, from 2027.'],
  nhomCc:['Điểm d khoản 4 và khoản 6a Điều 11','Article 11(4)(d) and 11(6a)'],
  kyh:['Kỳ báo cáo','Reporting period'],
  kyhint:['Điểm e khoản 1 Điều 11, bổ sung bởi Nghị định 119/2025/NĐ-CP','Article 11(1)(e), added by Decree 119/2025/ND-CP'],
  kylab:['Hai năm của kỳ số liệu','The two data years'],
  kyhelp:['Báo cáo định kỳ hai năm một lần gồm kết quả kiểm kê của hai năm liền kề năm nộp báo cáo.','The biennial report covers the two years immediately before the year of submission.'],
  kychoose:['Chọn kỳ','Choose a period'],
  kyopt:['Năm %a và năm %b','%a and %b'],
  kyodd:['Năm %a và năm %b (không liền kề)','%a and %b (not consecutive)'],
  tpNone:['Chọn kỳ để xem tiêu đề báo cáo.','Choose a period to preview the report title.'],
  tpLab:['Tiêu đề trên Mẫu số 06:','Title on Form 06 (kept in Vietnamese):'],
  i1h:['Thông tin cơ sở','Facility details'],
  i1hint:['Mục I.1 Mẫu số 06: tên cơ sở, địa chỉ, giấy phép kinh doanh','Form 06, item I.1: name, address, business licence'],
  ften:['Tên cơ sở','Facility name'],
  fdiachi:['Địa chỉ','Address'],
  ftinh:['Tỉnh, thành phố','Province or city'],
  ftinhhelp:['Theo địa giới hành chính sau sáp nhập năm 2025','Administrative boundaries after the 2025 merger'],
  tinhchoose:['Chọn tỉnh, thành phố','Choose a province or city'],
  fmst:['Mã số thuế','Tax code'],
  wmst:['Mã số thuế thường gồm 10 chữ số; đơn vị phụ thuộc thêm 3 chữ số sau dấu gạch, ví dụ 0104297034-001.','A tax code usually has 10 digits; a dependent unit adds 3 digits after a hyphen, e.g. 0104297034-001.'],
  fgpso:['Số giấy phép kinh doanh','Business licence number'],
  fgpngay:['Ngày cấp','Date of issue'],
  fgpnoi:['Nơi cấp','Issued by'],
  fbo:['Bộ quản lý lĩnh vực','Line ministry'],
  bochoose:['Chọn bộ','Choose a ministry'],
  wbo:['Quy trình và biểu mẫu trong ứng dụng theo Thông tư 38/2023/TT-BCT của Bộ Công Thương. Cơ sở thuộc bộ khác phải theo thông tư kỹ thuật của bộ đó.',
       'The procedure and forms in this app follow Circular 38/2023/TT-BCT of the Ministry of Industry and Trade. Facilities under another ministry must follow that ministry’s technical circular.'],
  fpl:['Phụ lục trong danh mục','Appendix in the list'],
  fplhelp:['Phụ lục chứa tên cơ sở trong Quyết định 42/2026/QĐ-TTg, ví dụ II','Appendix of Decision 42/2026/QD-TTg that lists the facility, e.g. II'],
  fstt:['Số thứ tự trong phụ lục','Row number in the appendix'],
  i2h:['Người đại diện theo pháp luật','Legal representative'],
  i2hint:['Mục I.2 Mẫu số 06, đồng thời là người ký ở cuối báo cáo','Form 06, item I.2; also the signatory of the report'],
  fdd:['Họ và tên','Full name'],
  fcv:['Chức vụ','Position'],
  i3h:['Lĩnh vực hoạt động kinh doanh, sản xuất','Business and production activities'],
  i3hint:['Mục I.3 Mẫu số 06','Form 06, item I.3'],
  flv:['Mô tả ngắn ngành nghề, sản phẩm chính','Short description of the sector and main products'],
  b0ok:['Bước 0 đã đủ thông tin bắt buộc.','Step 0 has all required information.'],
  b0miss:['Còn thiếu để hoàn thành Bước 0:','Still needed to complete Step 0:'],
  lblGoal:['Mục tiêu','Purpose'],
  lblWork:['Việc làm ở màn hình này','What this screen will do'],
  lblBasis:['Căn cứ','Legal basis'],
  todo:['Màn hình này đang được xây dựng, dự kiến có ở Giai đoạn %g của kế hoạch.','This screen is under construction, planned for phase %g of the build plan.'],
  s8note:['Bản thảo .docx sẽ chèn bảng số liệu hoạt động dưới mục III.2 và bảng tổng hợp theo từng năm dưới mục III.3. Các bảng này là cách trình bày của ứng dụng, không phải bảng bắt buộc của Mẫu số 06; Mẫu số 06 chỉ quy định đề mục.',
          'The .docx draft will insert activity data tables under item III.2 and a per-year summary table under item III.3. These tables are how the app presents the data; Form 06 itself prescribes headings only, no tables.'],
  s8json:['Tải và nạp file .json đã dùng được ngay từ bây giờ, bằng các nút ở thanh trên cùng.','Downloading and loading the .json file already works, using the buttons in the top bar.'],
  foot1:['Ứng dụng là công cụ hỗ trợ tính toán, không thay thế trách nhiệm của cơ sở. Người dùng tự chịu trách nhiệm kiểm tra kết quả. Văn bản có hiệu lực pháp lý là bản gốc của các nghị định, thông tư. Bản thảo báo cáo xuất ra phải được người có thẩm quyền của cơ sở rà soát trước khi nộp.',
         'This app is a calculation aid and does not replace the facility’s own responsibility. Users are responsible for checking the results. The legally binding texts are the original decrees and circulars. Any exported draft report must be reviewed by an authorised person of the facility before submission.'],
  foot2:['Số liệu bạn nhập không được gửi đi đâu. Số liệu chỉ nằm trong trình duyệt này và trong file bạn tự tải về.',
         'Nothing you enter is sent anywhere. The data stays only in this browser and in the files you download yourself.'],
  cfNew:['Hồ sơ đang mở sẽ được thay bằng hồ sơ trống.','The open record will be replaced by an empty one.'],
  cfLoad:['Nạp file sẽ thay hồ sơ đang mở bằng nội dung file %f.','Loading will replace the open record with the contents of %f.'],
  cfDirty:['Hồ sơ đang mở có thay đổi chưa tải về máy.','The open record has changes that are not downloaded.'],
  cfLoadGo:['Vẫn nạp file','Load anyway'],
  cfFull:['Tab mới không thấy số liệu đang nhập trong khung này, vì trình duyệt tách riêng bộ nhớ của trang nhúng. Tải file .json về trước, rồi nạp lại ở tab mới.',
          'The new tab cannot see the data entered in this frame, because the browser isolates storage for embedded pages. Download the .json file first, then load it in the new tab.'],
  cfFullSave:['Tải về rồi mở','Download, then open'],
  cfFullGo:['Mở luôn','Open anyway'],
  tSaved:['Đã tải file %f.','Downloaded %f.'],
  tLoaded:['Đã nạp file %f.','Loaded %f.'],
  tNew:['Đã mở hồ sơ trống.','Opened an empty record.'],
  eJson:['Không đọc được file %f: nội dung không phải JSON hợp lệ.','Could not read %f: the content is not valid JSON.'],
  eShape:['File %f không phải dữ liệu của ứng dụng này: thiếu trường phienBan hoặc coSo.','%f is not a data file of this app: the phienBan or coSo field is missing.'],
  eNewer:['File %f được tạo bởi phiên bản mới hơn của ứng dụng, phiên bản dữ liệu %v. Hãy mở bằng bản ứng dụng mới nhất.','%f was created by a newer version of the app, data version %v. Open it with the latest version of the app.'],
  eBig:['File %f quá lớn để là file dữ liệu của ứng dụng này.','%f is too large to be a data file of this app.'],
  eRead:['Không đọc được file %f.','Could not read %f.']
};
function t(k){ var v=T[k]; return v ? v[L==='vi'?0:1] : k; }

/* Tieu de va noi dung tung buoc. g la giai doan cua ke hoach se lam man hinh do. */
var STEPS = [
  { n:0, t:['Thông tin cơ sở','Facility information'], s:['Thông tin cơ sở','Facility'] },
  { n:1, t:['Xác định phạm vi kiểm kê','Inventory boundary'], s:['Phạm vi','Boundary'], g:2,
    goal:['Liệt kê đủ nguồn phát thải trong ranh giới cơ sở, không bỏ sót và không tính trùng.','List every emission source inside the facility boundary, with no omission and no double counting.'],
    work:['Mô tả ranh giới và phạm vi, hạ tầng và công nghệ; khai báo nguồn theo 6 loại trực tiếp và 2 loại gián tiếp của Điều 16; khai báo bể hấp thụ nếu có. Đây là nội dung mục II.1 đến II.3 Mẫu số 06.','Describe the boundary, infrastructure and technology; declare sources under the 6 direct and 2 indirect types of Article 16; declare any sinks. This feeds items II.1 to II.3 of Form 06.'],
    basis:['Khoản 1 Điều 15 và Điều 16 Thông tư 38/2023/TT-BCT','Article 15(1) and Article 16 of Circular 38/2023/TT-BCT'] },
  { n:2, t:['Thu thập số liệu hoạt động','Activity data'], s:['Số liệu hoạt động','Activity data'], g:2,
    goal:['Có đủ số liệu hoạt động cho từng nguồn, cho cả 2 năm của kỳ.','Collect activity data for every source, for both years of the period.'],
    work:['Nhập số liệu theo đúng các bảng Mục 1 Phụ lục II Thông tư 38/2023/TT-BCT, mỗi năm một bộ, kèm chứng từ và người cung cấp; đánh dấu số liệu ước tính.','Enter data in the tables of Section 1, Appendix II of Circular 38/2023/TT-BCT, one set per year, with supporting documents and provider; flag estimates.'],
    basis:['Khoản 2 Điều 15, Điều 17 và Mục 1 Phụ lục II Thông tư 38/2023/TT-BCT','Article 15(2), Article 17 and Section 1, Appendix II of Circular 38/2023/TT-BCT'] },
  { n:3, t:['Lựa chọn hệ số phát thải','Emission factors'], s:['Hệ số phát thải','Emission factors'], g:2,
    goal:['Gán cho mỗi số liệu hoạt động một hệ số phát thải có nguồn gốc rõ ràng.','Give every activity data item an emission factor with a clear source.'],
    work:['Chọn hệ số theo thứ tự 3 bậc: hệ số riêng được chấp thuận, Danh mục 322 hệ số của Quyết định 2626/QĐ-BTNMT, hướng dẫn IPCC. 71 hệ số hiệu chỉnh không được nhân thẳng với số liệu.','Pick factors in the 3-tier order: an approved facility-specific factor, the 322-factor list of Decision 2626/QD-BTNMT, then IPCC guidance. The 71 correction factors cannot be multiplied directly with activity data.'],
    basis:['Khoản 3 Điều 15 và Điều 18 Thông tư 38/2023/TT-BCT; Quyết định 2626/QĐ-BTNMT','Article 15(3) and Article 18 of Circular 38/2023/TT-BCT; Decision 2626/QD-BTNMT'] },
  { n:4, t:['Phương pháp và bộ GWP','Methods and GWP set'], s:['Phương pháp, GWP','Methods, GWP'], g:3,
    goal:['Chốt công thức tính cho từng nguồn và chốt bộ GWP sử dụng.','Fix the calculation formula for each source and the GWP set.'],
    work:['Tính theo các công thức Mục 2 Phụ lục II, đã áp dụng đính chính của Quyết định 334/QĐ-BCT; chọn bộ GWP AR4 hoặc AR5 và giữ nhất quán giữa các kỳ.','Compute with the formulas of Section 2, Appendix II, including the correction in Decision 334/QD-BCT; choose AR4 or AR5 GWPs and keep them consistent across periods.'],
    basis:['Khoản 4 Điều 15, Điều 19 và Mục 2 Phụ lục II Thông tư 38/2023/TT-BCT; Quyết định 334/QĐ-BCT','Article 15(4), Article 19 and Section 2, Appendix II of Circular 38/2023/TT-BCT; Decision 334/QD-BCT'] },
  { n:5, t:['Kiểm soát chất lượng','Quality control'], s:['Kiểm soát chất lượng','Quality control'], g:4,
    goal:['Phát hiện sai sót trước khi số liệu đi vào báo cáo.','Catch errors before the data goes into the report.'],
    work:['Lập biên bản kiểm soát chất lượng: đối chiếu chứng từ gốc, đơn vị và hệ số quy đổi, tính liên tục giữa 2 năm, so với kỳ trước.','Record the quality control log: check against source documents, units and conversion factors, continuity between the 2 years, comparison with the previous period.'],
    basis:['Khoản 5 Điều 15 và Điều 20 Thông tư 38/2023/TT-BCT; tiểu mục 6.1.2 TCVN ISO 14064-1:2011','Article 15(5) and Article 20 of Circular 38/2023/TT-BCT; clause 6.1.2 of TCVN ISO 14064-1:2011'] },
  { n:6, t:['Đánh giá độ không chắc chắn','Uncertainty assessment'], s:['Độ không chắc chắn','Uncertainty'], g:4,
    goal:['Nêu rõ mức tin cậy của kết quả và chỗ yếu của số liệu.','State how reliable the result is and where the data is weak.'],
    work:['Đánh giá theo 6 khía cạnh của Điều 11 Thông tư, định tính và định lượng ở mức làm được. Đây là nội dung mục III.4 Mẫu số 06.','Assess the 6 aspects of Article 11 of the Circular, qualitatively and quantitatively where possible. This feeds item III.4 of Form 06.'],
    basis:['Khoản 6 Điều 15, Điều 21 và Điều 11 Thông tư 38/2023/TT-BCT','Article 15(6), Article 21 and Article 11 of Circular 38/2023/TT-BCT'] },
  { n:7, t:['Tính toán lại kết quả kỳ trước','Recalculation'], s:['Tính toán lại','Recalculation'], g:4,
    goal:['Giữ cho chuỗi số liệu qua các kỳ so sánh được với nhau.','Keep the time series comparable across periods.'],
    work:['Khi đổi phạm vi, phương pháp hoặc hệ số, nhập kết quả kỳ trước và so sánh cách tính cũ với cách tính mới.','When the boundary, method or factors change, enter the previous period’s result and compare the old and new calculations.'],
    basis:['Khoản 7 Điều 15 và Điều 22 Thông tư 38/2023/TT-BCT','Article 15(7) and Article 22 of Circular 38/2023/TT-BCT'] },
  { n:8, t:['Kết quả và xuất báo cáo','Results and report export'], s:['Kết quả, xuất file','Results, export'], g:5,
    goal:['Hoàn thành báo cáo đúng Mẫu số 06.','Complete the report on Form 06.'],
    work:['Xem kết quả từng năm, xuất bản thảo Mẫu số 06 dạng .docx, bảng tính .xlsx và file dữ liệu .json.','Review the results per year and export the Form 06 draft as .docx, the .xlsx workbook and the .json data file.'],
    basis:['Khoản 8 Điều 15 và Điều 23 Thông tư 38/2023/TT-BCT; Mẫu số 06 Phụ lục II Nghị định 06/2022/NĐ-CP','Article 15(8) and Article 23 of Circular 38/2023/TT-BCT; Form 06, Appendix II of Decree 06/2022/ND-CP'] }
];
function lv(pair){ return pair[L==='vi'?0:1]; }

/* ---------- tien ich ---------- */
function $(id){ return document.getElementById(id); }
function el(tag,cls,txt){ var e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }
function nod(s){ return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase(); }
function isObj(x){ return x!==null && typeof x==='object' && !Array.isArray(x); }
function clone(x){ return JSON.parse(JSON.stringify(x)); }
function p2(n){ return (n<10?'0':'')+n; }
function dmyv(iso){ var p=iso.split('-'); return (+p[2])+'/'+(+p[1])+'/'+p[0]; }
function gio(iso){ if(!iso) return ''; var d=new Date(iso); if(isNaN(d)) return ''; return p2(d.getHours())+':'+p2(d.getMinutes())+' '+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear(); }
function fill(s,m){ return s.replace(/%(\w)/g,function(a,k){ return (k in m) ? m[k] : a; }); }

/* ---------- bo nho luu tam: moi thao tac deu boc try/catch ----------
   Trong iframe khac nguon goc, Safari chan han, Chrome tach vung rieng. Truy cap
   window.localStorage co the nem loi ngay o buoc lay doi tuong. */
var store = {
  ok:false,
  probe:function(){ try{ var s=window.localStorage, k='knk-quy-trinh/probe'; s.setItem(k,'1'); s.removeItem(k); this.ok=true; }catch(e){ this.ok=false; } return this.ok; },
  get:function(k){ try{ return window.localStorage.getItem(k); }catch(e){ return null; } },
  set:function(k,v){ try{ window.localStorage.setItem(k,v); return true; }catch(e){ return false; } },
  del:function(k){ try{ window.localStorage.removeItem(k); }catch(e){} }
};
function inFrame(){ try{ return window.self!==window.top; }catch(e){ return true; } }

/* ---------- mo hinh du lieu, phienBan 1 ----------
   Ket qua tinh toan khong luu trong file, luon tinh lai tu so lieu goc. */
function khuon(){
  return {
    phienBan: PHIEN_BAN,
    taoBoi: { ungDung:'knk-quy-trinh', banDung:BUILD },
    coSo: { ten:'', diaChi:'', maSoThue:'', tinh:'', boQuanLy:'', phuLuc:'', stt:'', nhom:'',
            giayPhep:{ so:'', ngayCap:'', noiCap:'' },
            daiDien:{ hoTen:'', chucVu:'' },
            linhVuc:'' },
    ky: { namBatDau:null, namKetThuc:null },
    gwp: null,
    moTa: { ranhGioi:'', haTang:'', heThongDuLieu:'' },
    beHapThu: { coHayKhong:null, moTa:'' },
    nguon: [],
    soLieu: [],
    heSo: [],
    qc: [],
    khongChacChan: { dinhTinh:[], dinhLuong:'' },
    tinhLai: { coHayKhong:null, lyDo:'', ketQuaCu:null, ketQuaMoi:null },
    ngayCapNhat: null
  };
}
/* Ho so moi: dien san bo quan ly theo pham vi ung dung, nguoi dung sua duoc. */
function macDinh(){ var o=khuon(); o.coSo.boQuanLy=BO_MAC_DINH; return o; }

/* Ghep du lieu nap vao len khuon: truong thieu hoac sai kieu lay gia tri rong,
   truong la duoc giu nguyen de khong mat du lieu. */
function ghep(src,def){
  var out = isObj(src) ? clone(src) : {};
  Object.keys(def).forEach(function(k){
    var d=def[k], v=out[k];
    if(isObj(d)) out[k]=ghep(v,d);
    else if(Array.isArray(d)) out[k]=Array.isArray(v)?v:[];
    else if(d===null) out[k]=(v===undefined)?null:v;
    else if(typeof v!==typeof d) out[k]=d;
  });
  return out;
}
var NANG_CAP = {};  /* NANG_CAP[n](o) tra ve doi tuong phienBan n+1 */
function chuanHoa(o){
  while(o.phienBan<PHIEN_BAN){ o=NANG_CAP[o.phienBan](o); }
  o=ghep(o,khuon());
  var y1=o.ky.namBatDau, y2=o.ky.namKetThuc;
  function nam(y){ return (typeof y==='number' && y%1===0 && y>=1990 && y<=2100) ? y : null; }
  o.ky.namBatDau=nam(y1); o.ky.namKetThuc=nam(y2);
  if(['A','B','C'].indexOf(o.coSo.nhom)<0) o.coSo.nhom='';
  if(o.gwp!=='AR4' && o.gwp!=='AR5') o.gwp=null;
  o.phienBan=PHIEN_BAN;
  return o;
}
function coNoiDung(o){
  function bo(x){ var c=clone(x); delete c.taoBoi; delete c.ngayCapNhat; return JSON.stringify(c); }
  return bo(o)!==bo(macDinh());
}
function getP(o,path){ return path.split('.').reduce(function(a,k){ return a==null?undefined:a[k]; },o); }
function setP(o,path,v){ var ks=path.split('.'), last=ks.pop(); var a=ks.reduce(function(a,k){ return a[k]; },o); a[last]=v; }

/* ---------- trang thai ---------- */
var S = macDinh();
var M = { coThayDoi:false, luuTamLuc:null, taiVeLuc:null, napTuFile:null, napLuc:null, buocCuoi:0 };
var SAVED = null;           /* ho so luu tam tim thay luc mo trang */
var cur = 'dau';
var saveTimer = null;

function luuTam(){
  if(!store.ok) return;
  M.luuTamLuc = new Date().toISOString();
  store.set(KEY, JSON.stringify(S));
  store.set(KEY_META, JSON.stringify(M));
  veNavFoot();
}
function luuMeta(){ if(store.ok) store.set(KEY_META, JSON.stringify(M)); }
function daSua(){
  S.ngayCapNhat = new Date().toISOString();
  M.coThayDoi = true;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(luuTam, 400);
  veStrip(); veMenuState(); veB0();
}

/* ---------- thong bao ---------- */
var toastTimer=null;
function toast(msg,err){
  var e=$('qt-toast'); e.textContent=msg; e.className='qt-toast on'+(err?' qt-e':'');
  clearTimeout(toastTimer); toastTimer=setTimeout(function(){ e.className='qt-toast'+(err?' qt-e':''); },3200);
}
function loi(msg){ var e=$('qt-err'); e.textContent=msg; e.hidden=false; toast(msg,true); }
function hetLoi(){ $('qt-err').hidden=true; }
/* Hop xac nhan nam ngay tren trang, khong dung hop thoai cua trinh duyet. */
function hoi(msg, acts){
  var box=$('qt-confirm'), wrap=$('qt-confirm-acts');
  $('qt-confirm-msg').textContent=msg; wrap.innerHTML='';
  acts.concat([{ k:'btncancel' }]).forEach(function(a){
    var b=el('button','qt-btn'+(a.pri?' qt-pri':''),t(a.k)); b.type='button';
    b.addEventListener('click',function(){ box.hidden=true; if(a.fn) a.fn(); });
    wrap.appendChild(b);
  });
  box.hidden=false; box.scrollIntoView({block:'nearest'});
}

/* ---------- tai ve va nap file ---------- */
function tenFile(){
  var slug=nod(S.coSo.ten).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'co-so';
  var d=new Date(), stamp=d.getFullYear()+p2(d.getMonth()+1)+p2(d.getDate())+'-'+p2(d.getHours())+p2(d.getMinutes());
  var ky=(S.ky.namBatDau&&S.ky.namKetThuc) ? '_'+S.ky.namBatDau+'-'+S.ky.namKetThuc : '';
  return 'KNK_'+slug+ky+'_'+stamp+'.json';
}
function taiVe(){
  S.taoBoi={ ungDung:'knk-quy-trinh', banDung:BUILD };
  if(!S.ngayCapNhat) S.ngayCapNhat=new Date().toISOString();
  var name=tenFile();
  var blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
  M.coThayDoi=false; M.taiVeLuc=new Date().toISOString();
  luuTam(); luuMeta(); veStrip();
  toast(fill(t('tSaved'),{f:name}));
}
function docFile(file){
  hetLoi();
  var f=file.name;
  if(file.size>20*1024*1024){ loi(fill(t('eBig'),{f:f})); return; }
  var r=new FileReader();
  r.onerror=function(){ loi(fill(t('eRead'),{f:f})); };
  r.onload=function(){
    var o;
    try{ o=JSON.parse(String(r.result).replace(/^﻿/,'')); }catch(e){ loi(fill(t('eJson'),{f:f})); return; }
    if(!isObj(o) || typeof o.phienBan!=='number' || o.phienBan%1!==0 || o.phienBan<1 || !isObj(o.coSo)){ loi(fill(t('eShape'),{f:f})); return; }
    if(o.phienBan>PHIEN_BAN){ loi(fill(t('eNewer'),{f:f,v:o.phienBan})); return; }
    function napVao(){
      S=chuanHoa(o);
      M={ coThayDoi:false, luuTamLuc:null, taiVeLuc:null, napTuFile:f, napLuc:new Date().toISOString(), buocCuoi:0 };
      luuTam(); SAVED=null;
      veHet(); go('buoc-0');
      toast(fill(t('tLoaded'),{f:f}));
    }
    if(coNoiDung(S) && M.coThayDoi){
      hoi(fill(t('cfLoad'),{f:f})+' '+t('cfDirty'), [
        { k:'btnsavefirst', pri:true, fn:function(){ taiVe(); napVao(); } },
        { k:'cfLoadGo', fn:napVao }
      ]);
    } else napVao();
  };
  r.readAsText(file,'utf-8');
}
function moFile(){ var i=$('qt-file'); i.value=''; i.click(); }

function kyMoi(){
  function lam(){
    S=macDinh();
    M={ coThayDoi:false, luuTamLuc:null, taiVeLuc:null, napTuFile:null, napLuc:null, buocCuoi:0 };
    SAVED=null; store.del(KEY); luuMeta();
    veHet(); go('buoc-0'); toast(t('tNew'));
  }
  if(coNoiDung(S)){
    hoi(t('cfNew')+(M.coThayDoi?' '+t('cfDirty'):''), [
      { k:'btnsavefirst', pri:true, fn:function(){ taiVe(); lam(); } },
      { k:'btnnew', fn:lam }
    ]);
  } else lam();
}
function moToanManHinh(){
  function mo(){ window.open(location.href,'_blank','noopener'); }
  if(coNoiDung(S) && M.coThayDoi){
    hoi(t('cfFull'), [
      { k:'cfFullSave', pri:true, fn:function(){ taiVe(); mo(); } },
      { k:'cfFullGo', fn:mo }
    ]);
  } else mo();
}

/* ---------- dieu huong ---------- */
var menu=$('qt-menu');
function veMenu(){
  menu.innerHTML='';
  STEPS.forEach(function(st){
    var b=el('button','qt-mi'); b.type='button'; b.dataset.go='buoc-'+st.n;
    b.appendChild(el('span','qt-n',String(st.n)));
    b.appendChild(el('span','qt-lab',lv(st.s)));
    b.addEventListener('click',function(){ go('buoc-'+st.n); });
    menu.appendChild(b);
  });
  var ol=$('qt-steplist'); ol.innerHTML='';
  STEPS.forEach(function(st){ ol.appendChild(el('li',null,lv(st.t))); });
  veMenuState();
}
function xong(n){
  if(n===0){ return thieuB0().length===0; }
  return false;
}
function veMenuState(){
  menu.querySelectorAll('.qt-mi').forEach(function(b){
    var n=+b.dataset.go.split('-')[1];
    b.classList.toggle('on', cur===b.dataset.go);
    b.classList.toggle('xong', xong(n));
    b.querySelector('.qt-n').textContent = xong(n) ? '✓' : String(n);
    b.title = xong(n) ? (L==='vi'?'Đã xong':'Done') : '';
  });
}
function tieuDe(id){
  if(id==='dau') return t('home');
  var n=+id.split('-')[1]; return (L==='vi'?'Bước ':'Step ')+n+'. '+lv(STEPS[n].t);
}
function go(id, noHash){
  if(id!=='dau' && !/^buoc-[0-8]$/.test(id)) id='dau';
  cur=id; hetLoi();
  document.querySelectorAll('.qt-pane').forEach(function(p){ p.classList.toggle('on', p.id==='pane-'+id); });
  $('qt-title').textContent=tieuDe(id);
  if(id!=='dau'){ M.buocCuoi=+id.split('-')[1]; luuMeta(); }
  veMenuState();
  if(!noHash && location.hash!=='#'+id){ try{ history.replaceState(null,'','#'+id); }catch(e){ location.hash=id; } }
  window.scrollTo(0,0);
}

/* ---------- man hinh buoc 1 den 8, dang xay dung ---------- */
function vePanes(){
  var host=$('qt-panes'); host.innerHTML='';
  STEPS.slice(1).forEach(function(st){
    var sec=el('section','qt-pane'); sec.id='pane-buoc-'+st.n;
    var card=el('div','qt-card');
    var ch=el('div','qt-ch'); ch.appendChild(el('h3',null,tieuDe('buoc-'+st.n))); card.appendChild(ch);
    var cb=el('div','qt-cb');
    var dl=el('dl','qt-kv');
    [['lblGoal',st.goal],['lblWork',st.work],['lblBasis',st.basis]].forEach(function(r){
      dl.appendChild(el('dt',null,t(r[0]))); dl.appendChild(el('dd',null,lv(r[1])));
    });
    cb.appendChild(dl);
    if(st.n===8){ cb.appendChild(el('p','qt-note',t('s8note'))); cb.appendChild(el('p','qt-note',t('s8json'))); }
    cb.appendChild(el('div','qt-todo',fill(t('todo'),{g:st.g})));
    card.appendChild(cb); sec.appendChild(card);
    sec.appendChild(pager(st.n));
    host.appendChild(sec);
  });
  var p0=$('pane-buoc-0'), old=p0.querySelector('.qt-pager'); if(old) old.remove();
  p0.appendChild(pager(0));
}
function pager(n){
  var d=el('div','qt-pager');
  var a=el('button','qt-btn',t('btnprev')); a.type='button';
  a.addEventListener('click',function(){ go(n===0?'dau':'buoc-'+(n-1)); });
  d.appendChild(a);
  if(n<8){ var b=el('button','qt-btn',t('btnnext')); b.type='button'; b.addEventListener('click',function(){ go('buoc-'+(n+1)); }); d.appendChild(b); }
  return d;
}

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

/* ---------- dong trang thai ---------- */
function veStrip(){
  var s=$('qt-strip'), m=$('qt-strip-msg');
  s.hidden=false; s.classList.toggle('qt-dirty', M.coThayDoi);
  if(M.coThayDoi) m.textContent=t('stripDirty');
  else if(M.taiVeLuc) m.textContent=fill(t('stripSaved'),{t:gio(M.taiVeLuc)});
  else if(M.napTuFile) m.textContent=fill(t('stripLoaded'),{f:M.napTuFile,t:gio(M.napLuc)});
  else m.textContent=t('stripBlank');
}
function veNavFoot(){
  var st=$('qt-store-state');
  st.className=store.ok?'':'qt-bad';
  st.textContent=store.ok ? t('storeOk')+(M.luuTamLuc?' '+fill(t('storeLast'),{t:gio(M.luuTamLuc)}):'') : t('storeBad');
  $('qt-build').textContent=fill(t('build'),{d:dmyv(BUILD)});
}
function veHome(){
  $('qt-home-nostore').hidden=store.ok;
  var c=$('qt-c-resume');
  if(SAVED){
    c.hidden=false;
    var ky=(SAVED.s.ky.namBatDau&&SAVED.s.ky.namKetThuc)?SAVED.s.ky.namBatDau+'–'+SAVED.s.ky.namKetThuc:t('noky');
    $('qt-resume-info').textContent=fill(t('resumeinfo'),{ n:SAVED.s.coSo.ten.trim()||t('noname'), k:ky, t:gio(SAVED.m.luuTamLuc||SAVED.s.ngayCapNhat) });
  } else c.hidden=true;
}

/* ---------- ngon ngu ---------- */
function applyLang(){
  document.documentElement.lang=L;
  document.querySelectorAll('[data-i]').forEach(function(e){ e.textContent=t(e.dataset.i); });
  $('qt-vi').classList.toggle('on',L==='vi'); $('qt-en').classList.toggle('on',L==='en');
  document.title = L==='vi' ? 'Quy trình kiểm kê khí nhà kính cấp cơ sở' : 'Facility GHG inventory procedure';
  veMenu(); vePanes(); veSelects(); veB0(); veStrip(); veNavFoot(); veHome();
  go(cur,true);
}
function setLang(l){ L=l; store.set(KEY_LANG,l); applyLang(); }

function veHet(){ dienForm(); veStrip(); veNavFoot(); veHome(); veMenuState(); }

/* ---------- khoi dong ---------- */
function init(){
  store.probe();
  var l=store.get(KEY_LANG); if(l==='en'||l==='vi') L=l;
  /* phien luu tam tu lan truoc */
  var raw=store.get(KEY), rawM=store.get(KEY_META);
  if(raw){
    try{
      var o=JSON.parse(raw), m=rawM?JSON.parse(rawM):{};
      if(isObj(o) && typeof o.phienBan==='number' && o.phienBan<=PHIEN_BAN && isObj(o.coSo)){
        o=chuanHoa(o);
        if(coNoiDung(o)){ S=o; SAVED={ s:o, m:isObj(m)?m:{} }; if(isObj(m)) Object.keys(M).forEach(function(k){ if(k in m) M[k]=m[k]; }); }
      }
    }catch(e){ /* du lieu luu tam hong: bo qua, bat dau ho so trong */ }
  }
  if(inFrame()){ $('qt-frame').hidden=false; $('qt-full').hidden=false; }
  $('qt-home').addEventListener('click',function(){ go('dau'); });
  $('qt-vi').addEventListener('click',function(){ setLang('vi'); });
  $('qt-en').addEventListener('click',function(){ setLang('en'); });
  $('qt-save').addEventListener('click',taiVe);
  $('qt-strip-save').addEventListener('click',taiVe);
  $('qt-open').addEventListener('click',moFile);
  $('qt-load').addEventListener('click',moFile);
  $('qt-file').addEventListener('change',function(){ if(this.files && this.files[0]) docFile(this.files[0]); });
  $('qt-new').addEventListener('click',kyMoi);
  $('qt-resume').addEventListener('click',function(){ go('buoc-'+(M.buocCuoi||0)); });
  $('qt-full').addEventListener('click',moToanManHinh);
  ganForm();
  window.addEventListener('hashchange',function(){ go(location.hash.slice(1),true); });
  var h=location.hash.slice(1);
  cur=(h==='dau'||/^buoc-[0-8]$/.test(h))?h:'dau';
  applyLang();
  dienForm();
}
init();
})();
