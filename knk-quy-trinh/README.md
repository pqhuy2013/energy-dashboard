# knk-quy-trinh

Ứng dụng web thực hiện quy trình kiểm kê khí nhà kính cấp cơ sở, 8 bước theo Điều 15 Thông tư 38/2023/TT-BCT. Số liệu chỉ nằm trong trình duyệt, kèm tải và nạp file .json, không có máy chủ.

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Bản đóng gói tự chứa, là file đăng lên GitHub Pages. **Không sửa tay**, sửa trong `src/` rồi dựng lại |
| `src/index.src.html` | Khung trang, có 3 dấu `/*@@CSS@@*/`, `/*@@DATA@@*/`, `/*@@JS@@*/` |
| `src/app.css` | Giao diện, tiền tố class `qt-` |
| `src/js/*.js` | Mã ứng dụng, ghép theo thứ tự tên file vào một hàm tự gọi. `10_core` mô hình dữ liệu, lưu và nạp, điều hướng; `12_nhap` ô nhập gắn với dữ liệu; `15_khung` dòng nhắc, ngôn ngữ; `20_loai` 8 loại nguồn và cột bảng theo Thông tư 38; `30_buoc0` đến `60_buoc3` từng bước; `70_tinh` bộ tính theo Mục 2 Phụ lục II; `75_buoc4` đến `84_buoc7` Bước 4 đến Bước 7; `90_init` khởi động |
| `build.py` | Ghép `src/` thành `index.html`, gán ngày dựng, lấy dữ liệu từ `../knk/index.html` |
| `tests/giai_doan_*.test.js` | Kiểm thử nghiệm thu từng giai đoạn bằng Playwright |
| `Mau_so_06_cau_truc.md` | Cấu trúc Mẫu số 06 Phụ lục II Nghị định 06/2022/NĐ-CP, kết quả Giai đoạn 0 |
| `QD334_BCT_dinh_chinh.md` | Nội dung đính chính của Quyết định 334/QĐ-BCT |
| `TT38_Phu_luc_II.md` | Phụ lục II Thông tư 38/2023/TT-BCT, số liệu hoạt động và phương pháp tính |

## Dựng

```
python3 build.py
```

Ngày dựng mặc định là ngày chạy lệnh, gán vào hằng số duy nhất `window.__QT_BUILD__`. Trang không dùng đồng hồ của người xem để hiện ngày chốt. Muốn dựng lại đúng một bản cũ thì đặt `QT_BUILD_DATE=YYYY-MM-DD`.

## Kiểm thử

Cần Node và gói `playwright` cài toàn cục kèm Chromium.

```
python3 build.py
NODE_PATH=$(npm root -g) node tests/giai_doan_1.test.js
NODE_PATH=$(npm root -g) node tests/giai_doan_2.test.js
NODE_PATH=$(npm root -g) node tests/giai_doan_3.test.js
NODE_PATH=$(npm root -g) node tests/giai_doan_4.test.js
```

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

Dòng nào không tính đúng được thì ghi lý do, không ra số: thiếu số liệu, hệ số hiệu chỉnh, hệ số theo khối lượng các-bon hoặc ni-tơ, theo % hoặc theo năng lượng, đơn vị mẫu số không khớp công thức, thiếu khối lượng riêng.

## Bước 5 đến Bước 7

- Bước 5 dẫn Điều 20. Ứng dụng chưa đối chiếu được nguyên văn tiểu mục 6.1.2 TCVN ISO 14064-1:2011, nên 4 nội dung tối thiểu lấy theo tài liệu quy trình và trang nói rõ điều đó. Phần kiểm tra tự động (chứng từ, lỗi đơn vị, tính liên tục giữa hai năm, đối chiếu kỳ trước, số liệu ước tính) chỉ là gợi ý, không thay biên bản. Người kiểm tra trùng người cung cấp số liệu thì hiện cảnh báo.
- Bước 6 hiện 6 nội dung nguyên văn khoản 1 Điều 11, kèm gợi ý rút từ số liệu đã nhập. Phần định lượng theo Phương pháp 1, Chương 3 Quyển 1 Hướng dẫn IPCC 2006: phương trình 3.1 cho từng dòng, phương trình 3.2 cho tổng mỗi năm, kèm tỷ lệ phát thải có đủ số liệu. Phần này không bắt buộc nhập đủ.
- Bước 7 dẫn khoản 1 Điều 22. Nạp file .json kỳ trước thì ứng dụng tính tổng kỳ đó hai lần, theo bộ GWP của chính file và theo bộ đang chọn, bằng cùng bộ tính của Bước 4. Nếu thay đổi là phạm vi, nguồn hoặc hệ số thì người dùng sửa file kỳ trước theo cách tính mới rồi nạp lại.

## Lưu dữ liệu

- File .json tải về là cách lưu chính.
- `localStorage` chỉ để không mất số liệu khi lỡ đóng tab. Mọi thao tác đọc ghi đều bọc `try/catch`, ứng dụng chạy đủ chức năng khi bộ nhớ bị chặn.
- Khi trang nằm trong iframe, ví dụ nhúng vào WordPress, trang hiện dòng gợi ý và nút Mở toàn màn hình.

## Tham số địa chỉ

- `#dau` là màn hình mở, `#buoc-0` đến `#buoc-8` là 9 màn hình.
- Dự kiến cho Giai đoạn 7, khi nối từ dashboard `knk/`: `?phuluc=II&stt=15`, trùng tên với `coSo.phuLuc` và `coSo.stt`. Chưa cài.
