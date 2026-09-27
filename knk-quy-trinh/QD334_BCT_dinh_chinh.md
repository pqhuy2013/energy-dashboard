# Nội dung đính chính của Quyết định 334/QĐ-BCT

Lấy kèm trong Giai đoạn 0 theo kế hoạch. Lập ngày 26/9/2026. Giải quyết điểm thứ nhất trong mục G.3 của `Quy_trinh_kiem_ke_KNK_linh_vuc_nang_luong.md`.

---

# 1. Nguồn

| Thông tin | Giá trị |
|---|---|
| File | Bản PDF quét, 2 trang, 524.994 byte, có dấu đỏ Bộ Công Thương và chữ ký tay |
| SHA-256 | `57372ef8342f55c80b4e1604f785b64266db9829f09d4fb276227068f9e2fca9` |
| Cách đọc | Không có lớp chữ, đọc từ ảnh trang dựng ở 150 dpi |

| Thông tin văn bản | Nguyên văn |
|---|---|
| Cơ quan | BỘ CÔNG THƯƠNG |
| Số | 334/QĐ-BCT |
| Ngày | Hà Nội, ngày 06 tháng 02 năm 2025 |
| Trích yếu | Về việc đính chính Thông tư số 38/2023/TT-BCT ngày 27 tháng 12 năm 2023 của Bộ trưởng Bộ Công Thương quy định kỹ thuật đo đạc, báo cáo, thẩm định giảm nhẹ phát thải khí nhà kính và kiểm kê khí nhà kính ngành Công Thương |
| Đề nghị | Vụ trưởng Vụ Tiết kiệm năng lượng và Phát triển bền vững |
| Người ký | KT. BỘ TRƯỞNG, THỨ TRƯỞNG, Nguyễn Hoàng Long |

---

# 2. Nguyên văn phần quyết định

> **Điều 1.** Đính chính lỗi kỹ thuật tại Thông tư số 38/2023/TT-BCT ngày 27 tháng 12 năm 2023 của Bộ trưởng Bộ Công Thương quy định kỹ thuật đo đạc, báo cáo, thẩm định giảm nhẹ phát thải khí nhà kính và kiểm kê khí nhà kính ngành Công Thương như sau:
>
> 1. Tại Điểm 4, Mục 2, Phụ Lục II:
>
> Sửa "EF<sub>H,p</sub> = (Enthalpy<sub>H,p</sub> / η<sub>lò</sub>) \* EF<sub>nhiên liệu</sub> / 10<sup>6</sup>" thành "EF<sub>H,p</sub> = (Enthalpy<sub>H,p</sub> / η<sub>lò</sub>) \* EF<sub>nhiên liệu</sub> / 10<sup>9</sup>"
>
> **Điều 2.** Quyết định này có hiệu lực kể từ ngày ký và là bộ phận không thể tách rời của Thông tư số 38/2023/TT-BCT ngày 27 tháng 12 năm 2023 của Bộ trưởng Bộ Công Thương quy định kỹ thuật đo đạc, báo cáo, thẩm định giảm nhẹ phát thải khí nhà kính và kiểm kê khí nhà kính ngành Công Thương./.

Trong bản gốc, Enthalpy<sub>H,p</sub> / η<sub>lò</sub> viết dạng phân số: tử số là Enthalpy<sub>H,p</sub>, mẫu số là η<sub>lò</sub>. Dấu ngoặc ở trên thêm vào để thể hiện đúng phân số đó trên một dòng.

Điều 1 chỉ có 1 khoản đính chính.

---

# 3. Công thức áp dụng sau đính chính

```
EF_H,p = (Enthalpy_H,p / η_lò) × EF_nhiên liệu / 10^9
```

Thay đổi duy nhất là số chia, từ 10⁶ thành 10⁹. Kết quả tính theo công thức cũ lớn gấp 1.000 lần kết quả đúng.

---

# 4. Đối chiếu với bản gốc Thông tư 38/2023/TT-BCT

Đã đối chiếu, chi tiết ở `TT38_Phu_luc_II.md` mục 3.4 và mục 4.2.

- **Điểm 4 Mục 2 Phụ lục II là phương pháp tính phát thải KNK gián tiếp do sử dụng hơi mua từ bên ngoài.** Tiêu đề điểm 4 trong bản gốc ghi đúng như vậy.
- **Đơn vị các biến theo bản gốc:** Enthalpy<sub>H,p</sub> tính bằng kJ/kg, η<sub>lò</sub> tính bằng %, EF<sub>nhiên liệu</sub> tính bằng kg/TJ, EF<sub>H,p</sub> tính bằng tấn CO₂tđ/tấn hơi.
- **Công thức sau đính chính đúng thứ nguyên, với một điều kiện:** η<sub>lò</sub> phải đưa vào dưới dạng phân số, ví dụ 0,85, dù Thông tư ghi đơn vị là %. Nếu đưa số 85 vào thì kết quả nhỏ hơn 100 lần. Phép kiểm tra bằng số nằm ở `TT38_Phu_luc_II.md` mục 4.2.

---

# 5. Hệ quả cho ứng dụng

- Công thức phát thải từ hơi mua ngoài phải dùng số chia 10⁹.
- Người dùng nhập hiệu suất nồi hơi theo phần trăm; ứng dụng tự chia 100 trước khi đưa vào công thức, và ghi rõ việc chia này trên màn hình.
- Chỗ nào trên trang hiện công thức này thì ghi kèm "đã áp dụng đính chính tại Quyết định 334/QĐ-BCT ngày 06/02/2025".
