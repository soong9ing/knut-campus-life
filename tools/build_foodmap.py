"""주희님 사이트(캠퍼스.zip)의 맛집 정보 -> 맛집 지도 데이터(data/foodmap.js).

사용법:  python tools/build_foodmap.py [주희님 사이트 html 경로 또는 주소] [--fetch]
- 기본값은 tools/juhee-campus-zip.html (https://cjh050728.github.io/campus-zip/ 를 저장한 파일)
- 주희님 정보는 그대로 옮긴다. 지도 핀 좌표만 새로 붙인다.
- 좌표는 tools/coords-cache.json(성림님 사이트에서 받아 둔 좌표)에서 먼저 찾고,
  --fetch를 붙이면 캐시에 없는 가게의 네이버·카카오 지도 링크에 접속해 받아 캐시에 저장한다.
- 링크로 좌표를 못 얻은 가게는 같은 건물 주소(도로명+번지)의 다른 가게 좌표를 쓴다. 그것도 없으면 지도에 찍지 않는다.
"""
import hashlib, json, re, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "juhee-campus-zip.html"
CACHE = ROOT / "tools" / "coords-cache.json"
OUT = ROOT / "data" / "foodmap.js"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "Accept-Language": "ko-KR,ko;q=0.9"}
KAKAO_H = dict(UA, pf="web", appVersion="6.6.0", Referer="https://place.map.kakao.com/", Origin="https://place.map.kakao.com")


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


opener = urllib.request.build_opener(NoRedirect)


def final_url(url):
    """짧은 링크(naver.me 등)를 따라가 최종 주소를 얻는다."""
    for _ in range(6):
        if re.search(r"place/\d+|place\.map\.kakao\.com/\d+|[?&]lat=", url):
            return url
        try:
            opener.open(urllib.request.Request(url, headers=UA), timeout=15)
            return url
        except urllib.error.HTTPError as e:
            loc = e.headers.get("Location")
            if e.code in (301, 302, 303, 307, 308) and loc:
                url = urllib.parse.urljoin(url, loc)
                continue
            return url
    return url


def get(url, headers=UA):
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20) as r:
        return r.read().decode("utf-8", "replace")


def coords_from_link(link):
    url = final_url(link)
    m = re.search(r"place\.map\.kakao\.com/(\d+)", url)
    if m:
        p = json.loads(get("https://place-api.map.kakao.com/places/panel3/" + m.group(1), KAKAO_H))["summary"]["point"]
        return p["lat"], p["lon"], "카카오맵 링크"
    m = re.search(r"place/(\d+)", url)
    if m:
        for attempt in range(4):
            try:
                html = get("https://m.place.naver.com/place/%s/home" % m.group(1))
                break
            except urllib.error.HTTPError as e:
                if e.code != 429:
                    raise
                time.sleep(10 + attempt * 10)
        else:
            return None
        c = re.search(r'"coordinate":\{[^}]*"x":"([\d.]+)","y":"([\d.]+)"', html) or re.search(r'"x":"([\d.]+)","y":"([\d.]+)"', html)
        return (float(c.group(2)), float(c.group(1)), "네이버 지도 링크") if c else None
    m = re.search(r"[?&]lng=([\d.]+).*?[?&]lat=([\d.]+)", url)
    if m:
        return float(m.group(2)), float(m.group(1)), "네이버 지도 링크(좌표)"
    return None  # 검색 링크 등


def building_key(addr):
    m = re.search(r"([가-힣0-9]+(?:로|길))\s*(\d+(?:-\d+)?)", addr or "")
    return m.group(1) + " " + m.group(2) if m else None


def norm(s):
    return re.sub(r"\s+", "", s or "")


# 지도 핀 모양: 카페·디저트는 카페, 술집은 술집, 나머지는 음식점
def pin_type(kind):
    return "cafe" if kind == "카페·디저트" else "bar" if kind == "술집" else "food"


# 수경님 맛집 데이터(data/places.js)와 짝짓기: 핀을 누르면 수경님 사이트의 자세한 정보 창(영업 중·후기·저장)을 연다.
# 이름이 달라 자동으로 못 찾거나 잘못 붙는 가게는 여기에 직접 적는다. {주희님 이름: 수경님 이름}
SK_ALIAS = {"대학본부 학생식당": "학생식당 (THE HUE)", "대학본부 교직원식당": "교직원식당"}


def sk_key(s):
    return re.sub(r"[\s\-·&]", "", re.sub(r"\(.*?\)", "", s or ""))


def load_sukyung():
    path = ROOT / "data" / "places.js"
    if not path.exists():
        return []
    t = path.read_text(encoding="utf-8")
    i = t.index("window.PLACES")
    return json.loads(t[t.index("{", i):t.rindex("}") + 1]).get("food", [])


def match_sukyung(p, sk):
    if p["n"] in SK_ALIAS:
        return next((q["id"] for q in sk if q["name"] == SK_ALIAS[p["n"]]), "")
    a = sk_key(p["n"])
    for q in sk:  # 이름이 같거나 한쪽 이름이 다른 쪽에 들어 있으면 같은 가게
        b = sk_key(q["name"])
        if a == b or (min(len(a), len(b)) >= 3 and (a in b or b in a)):
            return q["id"]
    return ""


def load_source(src):
    text = get(src) if re.match(r"https?://", src) else Path(src).read_text(encoding="utf-8")
    m = re.search(r"const DATA = (\{.*?\});\n", text, re.S)
    if not m:
        sys.exit("주희님 사이트에서 맛집 정보(const DATA)를 찾지 못했어요.")
    return json.loads(m.group(1))


def main(src):
    data = load_source(src)
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    by_name = {norm(k.split("|")[0]): v for k, v in cache.items()}
    by_link = {k.split("|", 1)[1]: v for k, v in cache.items() if "|" in k}

    sk = load_sukyung()
    rows = []
    for p in data["places"]:
        if p.get("c") != "맛집":
            continue
        link = p.get("m") if re.match(r"https?://", p.get("m") or "") else ""
        key = p["n"] + "|" + link
        if key in cache:
            c = cache[key]
        elif norm(p["n"]) in by_name:
            c = by_name[norm(p["n"])]
        elif link and link in by_link:
            c = by_link[link]
        else:
            c = None
            if link and FETCH:
                try:
                    got = coords_from_link(link)
                except Exception as e:  # 접속 실패: 이번엔 건너뛰고 다음 실행 때 다시 시도
                    print("  좌표 접속 실패:", p["n"], e)
                    got = False
                if got is not False:
                    c = {"lat": got[0], "lng": got[1], "source": got[2]} if got else None
                    cache[key] = c
                    print("  새 좌표:", p["n"], "->", c)
                time.sleep(1.2)
        rows.append({
            "name": p["n"], "address": p.get("a") or "", "link": link, "date": p.get("d") or "",
            "solo": p.get("h") or "", "price": p.get("p") if isinstance(p.get("p"), (int, float)) else None,
            "zone": p.get("z") or "", "rec": p.get("r") or 0, "where": p.get("b") if p.get("b") not in (None, "-") else "",
            "kind": p.get("k") or "", "desc": p.get("s") or "", "tags": p.get("g") if p.get("g") not in (None, "-") else "",
            "type": pin_type(p.get("k")), "skId": match_sukyung(p, sk),
            "lat": c["lat"] if c else None, "lng": c["lng"] if c else None, "coordSource": c["source"] if c else "",
        })

    # 같은 건물 주소의 다른 가게 좌표로 채우기
    bld = {}
    for r in rows:
        k = building_key(r["address"])
        if k and r["lat"] is not None and "같은 건물" not in r["coordSource"]:
            bld.setdefault(k, r)
    for r in rows:
        k = building_key(r["address"])
        if r["lat"] is None and k in bld:
            b = bld[k]
            r["lat"], r["lng"], r["coordSource"] = b["lat"], b["lng"], "같은 건물(%s)의 다른 가게 위치" % k

    # 수경님 데이터에 없는 가게는 수경님 형식으로 바꿔 맛집 목록(window.PLACES.food)에 더한다
    # → 모든 가게에서 저장·후기 버튼이 똑같이 동작 (id는 가게 이름으로 정해져 바뀌지 않음)
    extra = []
    for r in rows:
        if r["skId"]:
            continue
        r["skId"] = "fm-" + hashlib.md5(r["name"].encode("utf-8")).hexdigest()[:8]
        z = r["zone"]
        extra.append({
            "id": r["skId"], "category": {"cafe": "카페", "bar": "술집"}.get(r["type"], "음식점"), "subcategory": r["kind"] if r["kind"] != "-" else "",
            "name": r["name"],
            "area": "교내" if z == "교내" else "학교 주변 (대소원면)" if z in ("대학로", "대소원(기타)") else "충주 시내·외곽",
            "location": r["address"] + (" (" + r["where"] + ")" if r["where"] else ""),
            "map": [r["link"]] if r["link"] else [], "checkedAt": r["date"],
            "price": "1인 %s원부터" % format(int(r["price"]), ",") if r["price"] else "",
            "recommend": r["rec"] or 1,
            "note": "\n".join(x for x in [r["desc"] if r["desc"] not in ("", "-") else "", ("태그: " + r["tags"]) if r["tags"] else ""] if x),
            "source": "주희님 데이터(캠퍼스.zip)",
        })

    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")
    OUT.write_text(
        "/* 맛집 지도 데이터 — tools/build_foodmap.py가 만든 파일이에요. 직접 고치지 말고 스크립트를 다시 실행하세요.\n"
        " * 가게 정보: 주희님 사이트(캠퍼스.zip, https://cjh050728.github.io/campus-zip/) · 정리 날짜 %s\n"
        " * 지도 핀 좌표: 가게의 네이버·카카오 지도 링크에서 받은 값\n"
        " * index.html에서 data/places.js 바로 다음, js/features.js보다 먼저 불러야 해요(아래 추가 가게를 저장·후기에 등록하려고). */\n"
        "window.FOODMAP = %s;\n"
        "/* 수경님 맛집 목록에 없는 가게 %d곳 (주희님 데이터에서 가져옴) */\n"
        "window.PLACES = window.PLACES || {};\n"
        "window.PLACES.food = (window.PLACES.food || []).concat(%s);\n"
        % (data.get("updated", ""), json.dumps({"updated": data.get("updated", ""), "places": rows}, ensure_ascii=False, indent=0),
           len(extra), json.dumps(extra, ensure_ascii=False, indent=0)),
        encoding="utf-8")
    on_map = sum(1 for r in rows if r["lat"] is not None)
    print("맛집 %d곳 · 지도에 표시 %d곳 · 위치 없음 %d곳 · 수경님 상세 정보 연결 %d곳"
          % (len(rows), on_map, len(rows) - on_map, sum(1 for r in rows if r["skId"])))
    for e in extra:
        print("  수경님 데이터에 없어 새로 등록:", e["name"])
    for r in rows:
        if r["lat"] is None:
            print("  위치 없음:", r["name"], r["link"] or "(링크 없음)")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--fetch"]
    FETCH = "--fetch" in sys.argv  # 붙이면 캐시에 없는 가게의 지도 링크에 접속해 좌표를 받는다
    main(args[0] if args else str(SRC))
