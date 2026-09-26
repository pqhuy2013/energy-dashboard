# knk-quy-trinh

Ứng dụng web thực hiện quy trình kiểm kê khí nhà kính cấp cơ sở, 8 bước theo Điều 15 Thông tư 38/2023/TT-BCT. Số liệu chỉ nằm trong trình duyệt, kèm tải và nạp file .json, không có máy chủ.

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Bản đóng gói tự chứa, là file đăng lên GitHub Pages. **Không sửa tay**, sửa trong `src/` rồi dựng lại |
| `src/index.src.html` | Khung trang, có 3 dấu `/*@@CSS@@*/`, `/*@@DATA@@*/`, `/*@@JS@@*/` |
| `src/app.css` | Giao diện, tiền tố class `qt-` |
| `src/js/*.js` | Mã ứng dụng, ghép theo thứ tự tên file vào một hàm tự gọi. `10_core` mô hình dữ liệu, lưu và nạp, điều hướng; `12_nhap` ô nhập gắn với dữ liệu; `15_khung` dòng nhắc, ngôn ngữ; `20_loai` 8 loại nguồn và cột bảng theo Thông tư 38; `30_buoc0` đến `60_buoc3` từng bước; `90_init` khởi động |
| `build.py` | Ghép `src/` thành `index.html`, gán ngày dựng, lấy dữ liệu từ `../knk/index.html` |
| `tests/giai_doan_1.test.js`, `tests/giai_doan_2.test.js` | Kiểm thử nghiệm thu từng giai đoạn bằng Playwright |
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

Số lưu dạng số JavaScript. Ô nhập đọc được cả cách viết Việt Nam (`98.300`, `0,6592`) lẫn tiếng Anh, rời ô thì viết lại theo ngôn ngữ đang chọn.

Khi đổi cấu trúc dữ liệu: tăng `PHIEN_BAN` trong `src/js/10_core.js` và thêm hàm vào `NANG_CAP` để file cũ nạp được.

## Lưu dữ liệu

- File .json tải về là cách lưu chính.
- `localStorage` chỉ để không mất số liệu khi lỡ đóng tab. Mọi thao tác đọc ghi đều bọc `try/catch`, ứng dụng chạy đủ chức năng khi bộ nhớ bị chặn.
- Khi trang nằm trong iframe, ví dụ nhúng vào WordPress, trang hiện dòng gợi ý và nút Mở toàn màn hình.

## Tham số địa chỉ

- `#dau` là màn hình mở, `#buoc-0` đến `#buoc-8` là 9 màn hình.
- Dự kiến cho Giai đoạn 7, khi nối từ dashboard `knk/`: `?phuluc=II&stt=15`, trùng tên với `coSo.phuLuc` và `coSo.stt`. Chưa cài.
