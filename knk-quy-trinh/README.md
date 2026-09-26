# knk-quy-trinh

Ứng dụng web thực hiện quy trình kiểm kê khí nhà kính cấp cơ sở, 8 bước theo Điều 15 Thông tư 38/2023/TT-BCT. Số liệu chỉ nằm trong trình duyệt, kèm tải và nạp file .json, không có máy chủ.

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Bản đóng gói tự chứa, là file đăng lên GitHub Pages. **Không sửa tay**, sửa trong `src/` rồi dựng lại |
| `src/index.src.html` | Khung trang, có 3 dấu `/*@@CSS@@*/`, `/*@@DATA@@*/`, `/*@@JS@@*/` |
| `src/app.css` | Giao diện, tiền tố class `qt-` |
| `src/js/*.js` | Mã ứng dụng, ghép theo thứ tự tên file vào một hàm tự gọi. `10_core` mô hình dữ liệu, lưu và nạp, điều hướng; `12_nhap` ô nhập gắn với dữ liệu; `15_khung` dòng nhắc, ngôn ngữ; `20_loai` 8 loại nguồn và cột bảng theo Thông tư 38; `30_buoc0` đến `60_buoc3` từng bước; `70_tinh` bộ tính theo Mục 2 Phụ lục II; `75_buoc4` đến `84_buoc7` Bước 4 đến Bước 7; `85_zip` lõi ZIP, `86_xlsx` bộ ghi .xlsx, `87_docx` bộ ghi .docx; `88_mau06` bản thảo Mẫu số 06, `88_bangtinh` bảng tính .xlsx, `89_buoc8` Bước 8; `90_init` khởi động |
| `build.py` | Ghép `src/` thành `index.html`, gán ngày dựng, lấy dữ liệu từ `../knk/index.html` |
| `tests/giai_doan_*.test.js` | Kiểm thử nghiệm thu từng giai đoạn bằng Playwright |
| `tests/kiem_file.py` | Đọc file .docx, .xlsx do ứng dụng xuất, cho LibreOffice mở và tính lại công thức, dùng trong kiểm thử Giai đoạn 5 |
| `Mau_so_06_cau_truc.md` | Cấu trúc Mẫu số 06 Phụ lục II Nghị định 06/2022/NĐ-CP, kết quả Giai đoạn 0 |
| `QD334_BCT_dinh_chinh.md` | Nội dung đính chính của Quyết định 334/QĐ-BCT |
| `TT38_Phu_luc_II.md` | Phụ lục II Thông tư 38/2023/TT-BCT, số liệu hoạt động và phương pháp tính |

## Dựng

```
python3 build.py
```

Ngày dựng mặc định là ngày chạy lệnh, gán vào hằng số duy nhất `window.__QT_BUILD__`. Trang không dùng đồng hồ của người xem để hiện ngày chốt. Muốn dựng lại đúng một bản cũ thì đặt `QT_BUILD_DATE=YYYY-MM-DD`.

`python3 build.py --kiem` dựng lại trong bộ nhớ với đúng ngày dựng ghi trong `index.html` rồi so từng byte, không ghi file. Khác nhau nghĩa là đã sửa `src/` hoặc `../knk/` mà chưa dựng lại.

## Kiểm thử

Cần Node và gói `playwright` cài toàn cục kèm Chromium. Giai đoạn 5 cần thêm Python 3 có `python-docx`, `openpyxl`, `pymupdf`, và LibreOffice Writer, Calc (gói `libreoffice-writer-nogui`, `libreoffice-calc-nogui`), để mở file xuất và tính lại công thức.

```
bash tests/chay_tat_ca.sh
```

Lệnh trên kiểm đóng gói bằng `build.py --kiem` rồi chạy lần lượt mọi bộ. Chạy riêng từng bộ:

```
python3 build.py
NODE_PATH=$(npm root -g) node tests/giai_doan_1.test.js
NODE_PATH=$(npm root -g) node tests/giai_doan_2.test.js
NODE_PATH=$(npm root -g) node tests/giai_doan_3.test.js
NODE_PATH=$(npm root -g) node tests/giai_doan_4.test.js
NODE_PATH=$(npm root -g) node tests/giai_doan_5.test.js
NODE_PATH=$(npm root -g) node tests/toan_luong.test.js
NODE_PATH=$(npm root -g) node tests/hoi_quy_nhap.test.js
NODE_PATH=$(npm root -g) node tests/hoi_quy_buoc.test.js
NODE_PATH=$(npm root -g) node tests/hoi_quy_file.test.js
```

`toan_luong.test.js` là bộ nghiệm thu Giai đoạn 6: một người dùng làm trọn một kỳ 2024–2025 từ hồ sơ trống, chỉ qua giao diện, qua đủ 9 màn hình; bốn phép kiểm chứng số học của kế hoạch; xuất và nạp lại file; chuyển VI sang EN rồi về VI trên từng màn hình; khổ 375 px ở hai ngôn ngữ; chặn mọi yêu cầu mạng ra ngoài; không lỗi console.

Ba bộ `hoi_quy_*.test.js` giữ các lỗi tìm được trong đợt rà soát Giai đoạn 6 khỏi quay lại: `hoi_quy_nhap` (đọc số, ô ngày, nạp file sửa tay, lưu tạm), `hoi_quy_buoc` (từng bước), `hoi_quy_file` (file .docx, .xlsx). Mỗi mục trượt trên bản trước khi sửa và đạt trên bản hiện tại; đặt `QT_URL=file:///…/index.html` để chạy trên một bản khác.

Kiểm thử chạy trên `index.html` đã đóng gói. Ảnh chụp màn hình lưu vào thư mục `QT_SHOTS`, mặc định là `<tmp>/qt-shots`.

## Dữ liệu nhúng

`build.py` lấy từ dashboard `knk/` để hai trang dùng chung một nguồn: 34 tỉnh, 4 bộ, danh mục 2.441 cơ sở theo Quyết định 42/2026/QĐ-TTg, 110 cơ sở được phân bổ hạn ngạch theo Quyết định 699/QĐ-BNNMT, 322 hệ số phát thải theo Quyết định 2626/QĐ-BTNMT, hệ số lưới điện và GWP. Sửa dữ liệu ở `knk/` rồi dựng lại cả hai trang.

## Mô hình dữ liệu

Một đối tượng JSON, `phienBan: 1`, theo mục 3.3 kế hoạch, bổ sung các trường Mẫu số 06 cần mà mục 3.3 chưa có: `coSo.giayPhep`, `coSo.daiDien`, `coSo.linhVuc`, `moTa`, `beHapThu`. Kết quả tính toán không lưu trong file, luôn tính lại từ số liệu gốc.

| Mảng | Mỗi phần tử |
|---|---|
| `nguon` | `id`, `loai` (một trong `codinh`, `didong`, `congnghiep`, `phattan`, `moichat`, `chatthai`, `dien`, `hoi` theo Điều 16), `phanLoai`, `thietBi`, `viTri`, `ghiChu`, `thuocTinh` cho trường riêng của từng loại |
| `soLieu` | `nguonId`, `nam`, `gioTri`, `donVi`, `nguonSoLieu`, `chungTu`, `nguoiCungCap`, `laUocTinh`, `cachUocTinh`, `ghiChu`, `chiTiet` cho các cột khác của bảng Mục 1 Phụ lục II |
| `heSo` | `nguonId`, `khi`, `nam` (chỉ điện có theo năm), `maHeSo`, `tenHeSo`, `giaTri`, `donVi`, `bac` (`rieng`, `qd2626`, `ipcc` theo Điều 18, hoặc `muc2` cho cách riêng của Mục 2), `nguonGoc`, `thamSo` (ví dụ khối lượng riêng CH₄) |
| `loaiKhongCo` | Mã các loại nguồn cơ sở đánh dấu là không có |
| `qc` | Biên bản kiểm soát chất lượng Bước 5: `ma` (`ct1` đến `ct4` cho 4 nội dung tối thiểu, rỗng cho dòng tự thêm), `noiDung`, `nguoiKiem`, `ngay`, `ketQua` (`dat` hoặc `saiSot`), `loiPhatHien`, `cachXuLy` |
| `khongChacChan.bangU` | Bước 6: `nguonId`, `muc`, `khi`, `uAd`, `uEf`, độ không chắc chắn của số liệu và của hệ số, theo % nửa khoảng tin cậy 95 % |

Đối tượng Bước 6 và Bước 7:

- `khongChacChan.dinhTinh`: nhận xét 6 nội dung khoản 1 Điều 11, khóa `a`, `b`, `c`, `d`, `dd`, `e` theo thứ tự điểm a) đến e). `khongChacChan.dinhLuong`: mô tả thêm phần định lượng.
- `tinhLai.tinhTrang`: `kyDau`, `khongDoi` hoặc `coDoi`. Khi `coDoi`: `truongHop` là mảng con của `a`, `b`, `c` theo khoản 1 Điều 22; `lyDo`; `kyTruoc.namBatDau`, `kyTruoc.namKetThuc`; `ketQuaCu` và `ketQuaMoi` theo năm, tấn CO₂tđ; `giaiThich`; `fileKyTruoc` là tên file kỳ trước đã nạp, nếu có.

Số lưu dạng số JavaScript. Ô nhập đọc được cả cách viết Việt Nam (`98.300`, `0,6592`) lẫn tiếng Anh, rời ô thì viết lại theo ngôn ngữ đang chọn.

Khi đổi cấu trúc dữ liệu: tăng `PHIEN_BAN` trong `src/js/10_core.js` và thêm hàm vào `NANG_CAP` để file cũ nạp được.

## Tính toán

`src/js/70_tinh.js` tính theo Mục 2 Phụ lục II Thông tư 38/2023/TT-BCT, mỗi dòng là một khí của một nguồn trong một năm: điểm 1 đốt nhiên liệu, điểm 2.1 môi chất lạnh, điểm 3 điện, điểm 4 hơi (kể cả tự tính hệ số theo công thức đã đính chính tại Quyết định 334/QĐ-BCT), điểm 5.1 đến 5.5 khai thác than. Quá trình công nghiệp và chất thải không có công thức trong Thông tư nên không tự tính.

Các chỗ không khớp đơn vị của Thông tư xử lý theo `TT38_Phu_luc_II.md` mục 4: hiệu suất nồi hơi và hiệu suất đốt CH₄ nhập theo % rồi chia 100; khối lượng riêng dùng kg/m³. GWP của CO₂ luôn là 1; CH₄ và N₂O theo bộ AR4 hoặc AR5 chọn ở Bước 4.

Nguồn cố định ghi theo TJ, GJ hoặc MJ thì đổi thẳng ra TJ, đơn vị khác nhân hệ số nhiệt trị; cột “Tổng tiêu thụ (TJ)” ở Bước 2 dùng chung cách đổi này. Mỗi dòng kết quả mang hệ số đổi đơn vị k, sao cho lượng khí (tấn) = AD × EF × k, hoặc AD × k ở điểm 2.1, 5.2, 5.3; bảng tính .xlsx dùng đúng k này trong công thức.

Dòng nào không tính đúng được thì ghi lý do, không ra số: thiếu số liệu, hệ số hiệu chỉnh, hệ số theo khối lượng các-bon hoặc ni-tơ, theo % hoặc theo năng lượng, đơn vị mẫu số không khớp công thức, thiếu khối lượng riêng.

## Bước 5 đến Bước 7

- Bước 5 dẫn Điều 20. Ứng dụng chưa đối chiếu được nguyên văn tiểu mục 6.1.2 TCVN ISO 14064-1:2011, nên 4 nội dung tối thiểu lấy theo tài liệu quy trình và trang nói rõ điều đó. Phần kiểm tra tự động (chứng từ, lỗi đơn vị, tính liên tục giữa hai năm, đối chiếu kỳ trước, số liệu ước tính) chỉ là gợi ý, không thay biên bản. Người kiểm tra trùng người cung cấp số liệu thì hiện cảnh báo.
- Bước 6 hiện 6 nội dung nguyên văn khoản 1 Điều 11, kèm gợi ý rút từ số liệu đã nhập. Phần định lượng theo Phương pháp 1, Chương 3 Quyển 1 Hướng dẫn IPCC 2006: phương trình 3.1 cho từng dòng, phương trình 3.2 cho tổng mỗi năm, kèm tỷ lệ phát thải có đủ số liệu. Phần này không bắt buộc nhập đủ.
- Bước 7 dẫn khoản 1 Điều 22. Nạp file .json kỳ trước thì ứng dụng tính tổng kỳ đó hai lần, theo bộ GWP của chính file và theo bộ đang chọn, bằng cùng bộ tính của Bước 4. Nếu thay đổi là phạm vi, nguồn hoặc hệ số thì người dùng sửa file kỳ trước theo cách tính mới rồi nạp lại.

## Bước 8, xuất file

Bước 8 dẫn Điều 23 Thông tư 38 và điểm e khoản 1 Điều 11 Nghị định 06 (bổ sung tại Nghị định 119/2025/NĐ-CP), hiện tình trạng từng bước, kết quả từng năm, bảng kiểm trước khi nộp (Phần F tài liệu quy trình, ứng dụng tự kiểm những mục kiểm được) và bản xem trước. File xuất luôn viết bằng tiếng Việt, kể cả khi giao diện đang ở tiếng Anh.

**Bản thảo Mẫu số 06 (.docx).** Nội dung dựng một lần thành danh sách khối (`mau06()` trong `88_mau06.js`), rồi vẽ ra hai nơi: file .docx và bản xem trước trên trang, nên hai bản luôn giống nhau.

- Tiêu đề và 14 đề mục chép nguyên văn `Mau_so_06_cau_truc.md` mục 3. Đề mục in đậm để dễ đọc; câu chữ giữ nguyên.
- Tiêu đề điền cả hai năm của kỳ. Dưới III.2 là các bảng số liệu theo biểu Mục 1 Phụ lục II Thông tư 38, chỉ gồm cột của Thông tư; dưới III.3 là bảng tổng hợp theo biểu E.8, mỗi năm một bảng. Ghi chú “bảng là cách trình bày của ứng dụng” chỉ hiện trên trang, không vào file (quyết định ngày 26/9/2026).
- Chỗ còn thiếu ghi `[Chưa nhập: …]` tô vàng. Nguồn thuộc loại Thông tư 38 không có công thức ghi rõ, không ra số, và tổng ghi `[chưa đầy đủ]`.
- Thể thức theo Nghị định 30/2020/NĐ-CP: A4, Times New Roman 14, lề trên 20 mm, dưới 20 mm, trái 30 mm, phải 20 mm, số trang giữa lề trên từ trang 2. Chữ số chỉ số dưới (CO₂, CH₄) ghi bằng ký tự Unicode trong cùng một đoạn chữ: tách thành đoạn định dạng chỉ số dưới thì LibreOffice làm mất chữ số khi nó rơi đúng cuối dòng căn đều. Dưới mỗi bảng III.2 ghi thêm số liệu ứng dụng dùng để tính mà biểu của Thông tư không có cột (nhiệt trị, tổng TJ, tổng khối lượng hơi, CH₄ đem đốt), để lần lại được từ số liệu ra kết quả.

**Bảng tính (.xlsx).** Tối đa chín trang tính: Thông tin; Tổng hợp (SUMIFS từ trang Bảng tính); Bảng tính, mỗi dòng một khí của một nguồn trong một năm, lượng khí = AD × EF × k và phát thải = lượng khí × GWP, với k là hệ số đổi đơn vị của bộ tính có kèm diễn giải; Biểu năm của từng năm (biểu Mục 1 đã điền, kể cả cột ứng dụng thêm và thông tin truy vết, cột TJ và bảng 2.1 là công thức); Hệ số; Kiểm soát chất lượng; Độ không chắc chắn (phương trình 3.1 và 3.2 bằng công thức); Tính toán lại, chỉ có khi Bước 7 có thay đổi. Ô công thức kèm giá trị ứng dụng đã tính, Excel tính lại khi mở file.

Bộ ghi .xlsx phát triển từ `xlsx.js` của `qcvn04-2017/index.html`; bộ ghi .docx dùng chung lõi ZIP đó. Không dùng thư viện ngoài.

## Bước 0, nhóm đối tượng và kỳ báo cáo

- Tra danh mục gợi ý nhóm: có tên trong Quyết định 699/QĐ-BNNMT thì gợi ý B; ngành nhiệt điện, sắt thép, xi măng mà không có tên trong Quyết định 699 thì gợi ý “B hoặc A” và dẫn điểm c khoản 4 Điều 11 (sửa đổi bởi Nghị định 119/2025/NĐ-CP): điểm c áp dụng cho nhà máy nhiệt điện, cơ sở sản xuất sắt thép, xi măng thuộc danh mục, không nêu điều kiện có tên trong Quyết định 699, và các cơ sở này không thuộc điểm d (nhóm C). Chỗ này lệch với bảng A.2 tài liệu quy trình, vốn coi nhóm B chỉ gồm 110 cơ sở của Quyết định 699; ứng dụng theo câu chữ của Nghị định.
- Cơ sở ứng với nhiều dòng Quyết định 699 thì liệt kê đủ các dòng; mã số thuế chỉ tự điền khi các dòng cùng một mã.
- Kỳ báo cáo phải là hai năm liền kề (điểm e khoản 1 Điều 11), nếu không thì Bước 0 chưa xong. Kỳ lệch chu kỳ của nhóm (A từ 2024, B từ 2026, C từ 2028, hai năm một lần) thì hiện cảnh báo và mục 2 bảng kiểm trước khi nộp là chưa đạt.

## Lưu dữ liệu

- File .json tải về là cách lưu chính.
- `localStorage` chỉ để không mất số liệu khi lỡ đóng tab. Mọi thao tác đọc ghi đều bọc `try/catch`, ứng dụng chạy đủ chức năng khi bộ nhớ bị chặn. Ghi không được, ví dụ bộ nhớ đầy, thì báo ngay và chân trang không ghi thời điểm lưu. Phần sửa đang chờ 400 ms được ghi ngay khi đóng hoặc ẩn trang.
- Nạp file: ứng dụng dựng màn hình trước rồi mới lưu tạm; file làm hỏng màn hình thì giữ nguyên hồ sơ đang mở và báo lỗi. Khi nạp, `chuanHoa` bỏ hoặc sửa phần tử hỏng và báo cùng thông báo đã nạp: nguồn thiếu mã hoặc sai loại bị bỏ, nguồn trùng mã được cấp mã mới, kỳ trùng năm hoặc đảo ngược bị bỏ; số viết dạng chuỗi được đọc như ô nhập, ngày không đúng dạng YYYY-MM-DD thành trống.
- Ô số chấp nhận cả dạng lũy thừa như `3,86E-05`; nhập sai thì ô báo đỏ và giá trị để trống để được báo thiếu, không giữ phần đã gõ dở. Nhóm đầu bắt đầu bằng 0 không bao giờ là nhóm hàng nghìn: `0.681` là 0,681.
- Khi trang nằm trong iframe, ví dụ nhúng vào WordPress, trang hiện dòng gợi ý và nút Mở toàn màn hình.

## Tham số địa chỉ

- `#dau` là màn hình mở, `#buoc-0` đến `#buoc-8` là 9 màn hình.
- Dự kiến cho Giai đoạn 7, khi nối từ dashboard `knk/`: `?phuluc=II&stt=15`, trùng tên với `coSo.phuLuc` và `coSo.stt`. Chưa cài.
