#!/usr/bin/env python3
"""Dung knk-quy-trinh/index.html tu thu muc src/.

Ghep src/app.css va cac file src/js/*.js (theo thu tu ten, boc trong mot ham tu
goi) vao src/index.src.html thanh mot file tu chua, gan ngay dung vao hang so
duy nhat window.__QT_BUILD__, va lay du lieu tu ../knk/index.html de hai trang
dung chung mot nguon: danh sach tinh, bo; danh muc 2.441 co so (Quyet dinh
42/2026/QD-TTg); 110 co so duoc phan bo han ngach (Quyet dinh 699/QD-BNNMT);
322 he so phat thai (Quyet dinh 2626/QD-BTNMT); he so luoi dien; GWP.

Chay:  python3 build.py
Ngay dung mac dinh la ngay hom nay; dat bien moi truong QT_BUILD_DATE=YYYY-MM-DD
de dung lai dung mot ban cu.

Kiem dong goi:  python3 build.py --kiem
Dung lai trong bo nho voi dung ngay dung ghi trong index.html hien co, so tung byte;
khac nhau nghia la index.html chua dung lai sau khi sua src/ hoac ../knk/. Khong ghi file.
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


def lay_du_lieu_knk(ten):
    """Doc window.<ten> trong dashboard knk/, la JSON thuan."""
    s = doc(KNK)
    mark = "window.%s=" % ten
    i = s.find(mark)
    if i < 0:
        sys.exit("Khong tim thay window.%s trong %s" % (ten, KNK))
    obj, _ = json.JSONDecoder().raw_decode(s, i + len(mark))
    return obj


def du_lieu_ung_dung():
    d = lay_du_lieu_knk("__KNK_DATA__")
    d2 = lay_du_lieu_knk("__KNK_DATA2__")
    # Dong co so trong knk/: [phuLuc, bo, stt, ten, diaChi, nganh, vung, tinh, nhomNganh,
    # moi2026, nganhHanNgach]. Chi giu cac truong ung dung dung.
    cs = [[r[0], r[1], r[2], r[3], r[4], r[5], r[7], r[10]] for r in d["cs"]]
    return {
        "tinh": d["d"]["tinh"],
        "bo": d["d"]["bo"],
        "nganh": d["d"]["nganh"],
        "cs": cs,
        "hq": d["hq"],
        "hqNhom": d["hqNhom"],
        "hqmap": d["hqmap"],
        "hqRoi": d["hqRoi"],
        "hs": d2["hs"],
        "hsMeta": d2["hsMeta"],
        "luoi": d2["luoi"],
        "gwp": d2["gwp"],
    }


def thay_mot_lan(html, mark, noi_dung):
    if html.count(mark) != 1:
        sys.exit("Dau %s phai xuat hien dung 1 lan trong index.src.html" % mark)
    return html.replace(mark, noi_dung)


def dung(ngay):
    """Tra ve noi dung index.html dung tu src/ voi ngay dung cho truoc."""
    data = du_lieu_ung_dung()

    thu_muc_js = os.path.join(SRC, "js")
    tep_js = sorted(f for f in os.listdir(thu_muc_js) if f.endswith(".js"))
    phan = []
    for f in tep_js:
        noi_dung = doc(os.path.join(thu_muc_js, f))
        if re.search(r"</(script|style)", noi_dung, re.I):
            sys.exit(f + " chua chuoi dong the </script> hoac </style>")
        phan.append("/* ---- %s ---- */\n%s" % (f, noi_dung.rstrip()))
    js = '(function(){\n"use strict";\n' + "\n\n".join(phan) + "\n})();"
    css = doc(os.path.join(SRC, "app.css"))
    if re.search(r"</style", css, re.I):
        sys.exit("app.css chua chuoi dong the </style>")

    # "</" trong du lieu duoc viet thanh "<\/" de khong dong the script som
    data_js = (
        "window.__QT_BUILD__=%s;window.__QT_DATA__=%s;"
        % (json.dumps(ngay), json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    ).replace("</", "<\\/")

    html = doc(os.path.join(SRC, "index.src.html"))
    html = thay_mot_lan(html, "/*@@CSS@@*/", css)
    html = thay_mot_lan(html, "/*@@DATA@@*/", data_js)
    html = thay_mot_lan(html, "/*@@JS@@*/", js)
    return html


def kiem():
    if not os.path.exists(OUT):
        sys.exit("Chua co index.html")
    cu = doc(OUT)
    m = re.search(r'window\.__QT_BUILD__="(\d{4}-\d{2}-\d{2})"', cu)
    if not m:
        sys.exit("index.html khong co window.__QT_BUILD__")
    moi = dung(m.group(1))
    if moi != cu:
        i = next((k for k in range(min(len(cu), len(moi))) if cu[k] != moi[k]), min(len(cu), len(moi)))
        sys.exit("index.html KHAC ban dung tu src/ (ngay dung %s), lech tu ky tu %d: ...%s..."
                 % (m.group(1), i, cu[max(0, i - 40):i + 40].replace("\n", " ")))
    print("index.html khop ban dung tu src/, ngay dung %s, %d byte" % (m.group(1), len(cu.encode("utf-8"))))


def main():
    if "--kiem" in sys.argv[1:]:
        return kiem()
    ngay = os.environ.get("QT_BUILD_DATE") or datetime.date.today().isoformat()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", ngay):
        sys.exit("QT_BUILD_DATE phai co dang YYYY-MM-DD")
    html = dung(ngay)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("Da dung %s, %d byte, ngay dung %s" % (os.path.relpath(OUT, HERE), len(html.encode("utf-8")), ngay))


if __name__ == "__main__":
    main()
