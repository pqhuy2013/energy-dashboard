#!/usr/bin/env python3
"""Dung knk-quy-trinh/index.html tu thu muc src/.

Ghep src/app.css, src/app.js vao src/index.src.html thanh mot file tu chua,
gan ngay dung vao hang so duy nhat window.__QT_BUILD__, va lay danh sach tinh,
bo quan ly tu du lieu da nhung trong ../knk/index.html de hai trang dung chung
mot nguon.

Chay:  python3 build.py
Ngay dung mac dinh la ngay hom nay; dat bien moi truong QT_BUILD_DATE=YYYY-MM-DD
de dung lai dung mot ban cu.
"""
import datetime
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
KNK = os.path.join(HERE, "..", "knk", "index.html")
OUT = os.path.join(HERE, "index.html")


def doc(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def lay_du_lieu_knk():
    """Doc window.__KNK_DATA__ trong dashboard knk/, la JSON thuan."""
    s = doc(KNK)
    mark = "window.__KNK_DATA__="
    i = s.find(mark)
    if i < 0:
        sys.exit("Khong tim thay window.__KNK_DATA__ trong " + KNK)
    obj, _ = json.JSONDecoder().raw_decode(s, i + len(mark))
    return obj


def thay_mot_lan(html, mark, noi_dung):
    if html.count(mark) != 1:
        sys.exit("Dau %s phai xuat hien dung 1 lan trong index.src.html" % mark)
    return html.replace(mark, noi_dung)


def main():
    ngay = os.environ.get("QT_BUILD_DATE") or datetime.date.today().isoformat()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", ngay):
        sys.exit("QT_BUILD_DATE phai co dang YYYY-MM-DD")

    knk = lay_du_lieu_knk()
    data = {"tinh": knk["d"]["tinh"], "bo": knk["d"]["bo"]}

    js = doc(os.path.join(SRC, "app.js"))
    css = doc(os.path.join(SRC, "app.css"))
    for ten, noi_dung in (("app.js", js), ("app.css", css)):
        if re.search(r"</(script|style)", noi_dung, re.I):
            sys.exit(ten + " chua chuoi dong the </script> hoac </style>")

    # "</" trong du lieu duoc viet thanh "<\/" de khong dong the script som
    data_js = (
        "window.__QT_BUILD__=%s;window.__QT_DATA__=%s;"
        % (json.dumps(ngay), json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    ).replace("</", "<\\/")

    html = doc(os.path.join(SRC, "index.src.html"))
    html = thay_mot_lan(html, "/*@@CSS@@*/", css)
    html = thay_mot_lan(html, "/*@@DATA@@*/", data_js)
    html = thay_mot_lan(html, "/*@@JS@@*/", js)

    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("Da dung %s, %d byte, ngay dung %s" % (os.path.relpath(OUT, HERE), len(html.encode("utf-8")), ngay))


if __name__ == "__main__":
    main()
