#!/usr/bin/env bash
# Chay toan bo kiem thu tren chinh ban da dong goi knk-quy-trinh/index.html.
#   bash tests/chay_tat_ca.sh
# Buoc dau: build.py --kiem xac nhan index.html dung la ban dung tu src/ hien tai.
# Moi bo in ket qua cuoi; tong ket tra ma loi 1 neu co bo nao truot.
set -u
cd "$(dirname "$0")/.."
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"

python3 build.py --kiem || { echo "index.html chua dung lai tu src/: chay python3 build.py truoc"; exit 1; }

BO="giai_doan_1 giai_doan_2 giai_doan_3 giai_doan_4 giai_doan_5 toan_luong hoi_quy_nhap hoi_quy_buoc hoi_quy_file"
truot=0
for b in $BO; do
  log="$(mktemp)"
  if node "tests/$b.test.js" > "$log" 2>&1; then kq="ĐẠT"; else kq="TRƯỢT"; truot=$((truot + 1)); fi
  printf '%-12s %-6s %s\n' "$b" "$kq" "$(grep -E '^Kết quả' "$log" | tail -1)"
  if [ "$kq" = "TRƯỢT" ]; then grep -E 'TRƯỢT|Error' "$log" | head -20; fi
  rm -f "$log"
done
[ "$truot" -eq 0 ] && echo "Tất cả bộ kiểm thử đều đạt." || echo "$truot bộ có mục trượt."
exit $(( truot > 0 ))
