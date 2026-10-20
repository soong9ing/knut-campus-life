/*
 * 캠퍼스 정보 데이터 (엑셀 4종에서 변환)
 *  - food: 맛집 / tips: 생활꿀팁 / hidden: 숨은장소 / etc: 자유(놀거리)
 *  - 빈 문자열("")은 원본 엑셀의 "모르겠음"이에요.
 *  - 엑셀을 고친 뒤에는 이 파일만 다시 만들면 화면에 반영돼요.
 *  - id: 후기·좋아요가 연결되는 장소 고유값이에요. 한 번 정해지면 바꾸지 마세요 (바꾸면 기존 후기와 끊겨요).
 */
window.PLACES = {
 "food": [
  {
   "id": "food-7f02a1b7",
   "category": "교내식당",
   "subcategory": "",
   "name": "교직원식당",
   "area": "교내",
   "location": "대학본부 복지관(별관, E8-1동) 3층",
   "map": [
    "https://map.naver.com/p/entry/place/20973405"
   ],
   "checkedAt": "2026-10-07",
   "price": "뷔페 1인 5,500원",
   "recommend": 4,
   "note": "학생식당에서 한 층 위\n12시(다른 메모: 12:10)부터 학생도 이용 가능, 방학 중 학생식당 휴점 시 이용\n학생식당보다 퀄리티가 좋다고 느낌\n층 표기가 메모마다 다름 (3층 / 2층)"
  },
  {
   "id": "food-cac198a9",
   "category": "교내식당",
   "subcategory": "",
   "name": "대원생활관 식당",
   "area": "교내",
   "location": "충북 충주시 대소원면 대학로 50 (대원생활관)",
   "map": [
    "https://naver.me/xoHJH6p0"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "기숙사생 식당이지만 일반 학생도 5,000원 이하로 이용 가능\n에브리타임에서 식단표 확인 후 방문"
  },
  {
   "id": "food-63924cb2",
   "category": "교내식당",
   "subcategory": "",
   "name": "예성생활관 식당 (W13)",
   "area": "교내",
   "location": "충북 충주시 대학로 50 한국교통대학교 예성중원관리동(W13)",
   "map": [
    "https://map.naver.com/p/search/%EC%98%88%EC%84%B1%EA%B4%80%EB%A6%AC%EB%8F%99?c=15.00,0,0,0,dh&placePath=%2Fhome%3Ffrom%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202610062032%26locale%3Dko%26svcName%3Dmap_pcv5%26searchText%3D%EC%98%88%EC%84%B1%EA%B4%80%EB%A6%AC%EB%8F%99",
    "https://naver.me/xCjQG1GX"
   ],
   "checkedAt": "2026-10-06",
   "price": "식권 약 4,900원",
   "recommend": 2,
   "note": "txt의 이름 표기: 한국교통대학교 충주캠퍼스예성중원관리동 / W13 / 예성생활관식당\n학교 사이트에서 식단 미리 확인 후 맛있는 메뉴 나오는 날 가기\n외식보다 많이 저렴\n기숙사생 식당이지만 일반 학생도 5,000원 이하로 이용 가능\n에브리타임에서 식단표 확인 후 방문"
  },
  {
   "id": "food-ec509365",
   "category": "교내식당",
   "subcategory": "",
   "name": "학생식당 (THE HUE)",
   "area": "교내",
   "location": "대학본부 복지관(별관, E8-1동) 1층",
   "map": [
    "https://naver.me/xTsMpYvQ"
   ],
   "checkedAt": "2026-10-07",
   "price": "5,000원 (최고 5,000원)",
   "recommend": 9,
   "note": "식사 10:00~14:00, 라면 09:00~15:00, 방학 중 휴점 → 방학엔 3층 교직원식당 이용 (학교 안내에 코로나19 문구가 남아 있어 현장 확인 권장)\n한식·일품 코너, 돈까스·라면 등\n밥·찌개류는 일찍 가야 함 (늦으면 품절), 돈까스는 널널\n학식이라 맛은 날마다 다르지만 가성비 좋음, 무난함\n점심시간 활기찬 분위기, 혼밥·친구와 식사 모두 좋음\n국원생활관은 식당이 없어 국원생들이 이용\n한 층 위(3층) 교직원식당은 12시(다른 메모: 12:10)부터 학생도 이용 가능\n천원의 아침밥 행사 달엔 PAYCO 앱으로 식권 구매\n메뉴 확인: 학교 홈페이지 식단안내 https://www.ut.ac.kr/prog/mealManage/MT01/kor/sub06_02_02_01/list.do, 학교 앱(스마트모바일) 대학생활 메뉴, 생활관 식단은 생활관 홈페이지\ntxt의 이름 표기: 한국교통대학교 충주캠퍼스대학본부별관 / 학식 먹는 곳 / 대학본부별관 학생식당 / 학생식당 THE HUE"
  },
  {
   "id": "food-18feb182",
   "category": "음식점",
   "subcategory": "한식",
   "name": "국대부대찌개 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 19-3 1층",
   "map": [
    "https://map.naver.com/p/search/%EA%B5%AD%EB%8C%80%EB%B6%80%EB%8C%80%EC%B0%8C%EA%B0%9C%20%EA%B5%90%ED%86%B5%EB%8C%80%EC%A0%90"
   ],
   "checkedAt": "2026-10-06",
   "price": "부대찌개 2인 20,000원·3인 30,000원, 부대전골 2인 22,000원·3인 33,000원, 등심부대전골 2인 26,000원·3인 39,000원·4인 52,000원, 부대볶음 2인 24,000원·3인 36,000원",
   "recommend": 1,
   "note": "종합강의동에서 도보 약 12분(890m), 후문에서 도보 약 16분(1.2km)"
  },
  {
   "id": "food-5870e222",
   "category": "음식점",
   "subcategory": "한식",
   "name": "막국수파는집 한국교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충청북도 충주시 대소원면 대학로 28",
   "map": [
    "https://naver.me/F2LbN0j5"
   ],
   "checkedAt": "2026-10-06",
   "price": "막국수 보쌈 도시락 13,900원",
   "recommend": 1,
   "note": "보쌈 도시락 시키면 밥·보쌈·막국수까지 꽤 배부름"
  },
  {
   "id": "food-463a688e",
   "category": "음식점",
   "subcategory": "한식",
   "name": "배가네국수",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 8",
   "map": [
    "https://naver.me/FaOjexru"
   ],
   "checkedAt": "2026-10-06",
   "price": "6,000원~8,000원",
   "recommend": 2,
   "note": "가격이 싸고 양이 많음\n교통대 학생은 곱빼기 무료\n국물이 깔끔함\n여름 콩국수 추천"
  },
  {
   "id": "food-49d9c3a6",
   "category": "음식점",
   "subcategory": "한식",
   "name": "보스찜닭",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 21",
   "map": [
    "https://naver.me/GuCjAZhA"
   ],
   "checkedAt": "2026-10-06",
   "price": "간장찜닭(2인) 19,000원",
   "recommend": 1,
   "note": "양이 많음"
  },
  {
   "id": "food-ab1ddfad",
   "category": "음식점",
   "subcategory": "한식",
   "name": "성마루 국밥",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 성종두담길 315",
   "map": [
    "https://naver.me/x8tNhL9d"
   ],
   "checkedAt": "2026-10-06",
   "price": "9,000~15,000원",
   "recommend": 1,
   "note": "대표 메뉴: 우렁제육쌈밥 (맛있고 가성비 좋음)\n우렁된장 무한리필\n영업시간: 매일 08:30~20:30, 라스트오더 19:50\n가끔 안 여는 날 있음 (네이버로 확인 불가)\n점심 붐빔, 대기 포함 40분 소요"
  },
  {
   "id": "food-acecdeb0",
   "category": "음식점",
   "subcategory": "한식",
   "name": "일미닭갈비 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충청북도 충주시 대소원면 대학로 6",
   "map": [
    "https://naver.me/xPURzzQt"
   ],
   "checkedAt": "2026-10-06",
   "price": "닭갈비 2인분 19,000원·3~4인분 28,000원·4~5인분 38,000원, 닭갈비 삼겹살 2인분 20,000원·3~4인분 30,000원·4~5인분 40,000원, 볶음밥·사리 추가 각 2,000원, 막걸리 1,000cc 3,000원·2,000cc 6,000원",
   "recommend": 3,
   "note": "철판 닭갈비 중심, 파전도 있음\n저렴·가성비 좋음, 밥 푸짐\n셀프바, 칸막이\n영업시간: 월~금 11:00~21:00, 브레이크타임 15:00~17:00, 라스트오더 20:10 (온라인 후기 기준)\n전화: 043-853-3212\n종합강의동에서 도보 약 14분(1.0km), 후문에서 도보 약 18분(1.4km)\n참고 블로그(2024-03-24): https://blog.naver.com/k_sungjun-/223393768353"
  },
  {
   "id": "food-45d85a18",
   "category": "음식점",
   "subcategory": "한식",
   "name": "제갈덮밥&곱창마니 한국교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 25 102호",
   "map": [
    "https://naver.me/FwGHArSe"
   ],
   "checkedAt": "2026-10-07",
   "price": "",
   "recommend": 2,
   "note": "덮밥·짜글이 종류 다양\n늦게까지 해서 시켜 먹기 좋음\n결제 간편, 혼밥하기 좋음\n영업시간: 11:00~24:00\n전화: 0507-1470-2228"
  },
  {
   "id": "food-b8209862",
   "category": "음식점",
   "subcategory": "한식",
   "name": "큰집아저씨 충주 본점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 중원대로 4102",
   "map": [
    "https://naver.me/FIfGM87n"
   ],
   "checkedAt": "2026-09-08",
   "price": "",
   "recommend": 1,
   "note": "메뉴: 육칼국수, 육개장, 육회비빔밥 (추천: 육회비빔밥)\nKBS 생방송투데이 / MBC 삼도삼미 방송 출연\n교통대에서 차로 2분\n전화: 0507-1347-6869"
  },
  {
   "id": "food-b398c534",
   "category": "음식점",
   "subcategory": "한식",
   "name": "메밀마당 충주중앙탑본점",
   "area": "충주 시내·외곽",
   "location": "충청북도 충주시 중앙탑면 중앙탑길 103",
   "map": [
    "https://naver.me/FV75JYzM"
   ],
   "checkedAt": "2026-10-06",
   "price": "순메밀 후라이드치킨 반 마리 10,000원·한 마리 19,000원, 메밀 새싹 물막국수·비빔막국수 각 9,000원",
   "recommend": 2,
   "note": "메밀막국수 전문점, 중앙탑사적공원 인근\n대표 조합: 막국수+메밀치킨 \"치막\"\n사이드: 메밀반반만두, 메밀부침\n영업시간: 매일 11:00~20:40 (라스트오더 19:50)\n주차: 매장 앞 소규모, 중앙탑공원 공영주차장 권장\n주말·식사 시간 대기 있을 수 있음\n전화: 043-855-0283 / 0507-1400-0283"
  },
  {
   "id": "food-e3d3e1cb",
   "category": "음식점",
   "subcategory": "한식",
   "name": "오복쌈밥",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 사직로 191-3",
   "map": [
    "https://map.naver.com/p/search/%EC%98%A4%EB%B3%B5%EC%8C%88%EB%B0%A5/place/17503896?c=15.00,0,0,0,adh&p=o017mr121VHNtzt5SVQdkA,-54.52,10,80,Float&isMini=true&placePath=%2Fhome%3Fbk_query%3D%EC%98%A4%EB%B3%B5%EC%8C%88%EB%B0%A5%26entry%3Dbmp%26fromPanelNum%3D2%26timestamp%3D202610061943%26locale%3Dko%26svcName%3Dmap_pcv5%26searchText%3D%EC%98%A4%EB%B3%B5%EC%8C%88%EB%B0%A5"
   ],
   "checkedAt": "2026-10-06",
   "price": "제육쌈밥·우렁이쌈밥 각 10,000원 가격대",
   "recommend": 1,
   "note": "충주 시내 (교통대에서 멂)\n평가가 좋은 쌈밥 맛집\n토요일 휴무"
  },
  {
   "id": "food-30d401cb",
   "category": "음식점",
   "subcategory": "한식",
   "name": "옹심촌 감자옹심이 전문점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 주덕읍 신덕로 1383 1층 3~5호",
   "map": [
    "https://naver.me/FSSDyWTi"
   ],
   "checkedAt": "2026-09-16",
   "price": "",
   "recommend": 1,
   "note": ""
  },
  {
   "id": "food-84a19b6e",
   "category": "음식점",
   "subcategory": "한식",
   "name": "원조중원탑막국수",
   "area": "충주 시내·외곽",
   "location": "충청북도 충주시 중원대로 3018",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "가족외식·식사모임\n점심·저녁식사, 셀프바, 무료주차"
  },
  {
   "id": "food-ec7ec51f",
   "category": "음식점",
   "subcategory": "한식",
   "name": "이정동묵밥",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 쇠저울1길 13-2",
   "map": [
    "https://map.naver.com/p/entry/place/1058887404"
   ],
   "checkedAt": "2026-10-06",
   "price": "평균 12,000원대 (묵밥치고 가격대 있는 편)",
   "recommend": 1,
   "note": "한식, 충주 시내\n묵밥 3종(짬뽕·냉채·전통), 사이드 도토리전·간장묵\n추천 메뉴: 전통묵밥, 냉채묵밥"
  },
  {
   "id": "food-2bd6fe59",
   "category": "음식점",
   "subcategory": "한식",
   "name": "중원육면 충주점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 호암토성5길 24 1층",
   "map": [
    "https://naver.me/F2ngxUY2"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "추천: 들기름육회비빔밥 (육회 신선, 들기름 향 좋음)\n백면은 슴슴하고 고기향 진함\n교통대에서 급행1번 → 힐데스하임아파트 하차, 또는 700번 → 풍경채 하차 후 도보"
  },
  {
   "id": "food-1a666c80",
   "category": "음식점",
   "subcategory": "국밥·해장국",
   "name": "두꺼비네",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 19 1층",
   "map": [
    "https://map.naver.com/p/search/%EC%B6%A9%EC%A3%BC%20%EB%8C%80%EC%86%8C%EC%9B%90%EB%A9%B4%20%EB%91%90%EA%BA%BC%EB%B9%84%EB%84%A4"
   ],
   "checkedAt": "2026-10-06",
   "price": "순대국·뼈해장국·수육국밥 9,000원, 순대전골(중)·감자탕(중) 25,000원",
   "recommend": 2,
   "note": "해장국집\n시원함, 넓음, 셀프바, 와이파이\n영업시간 확인 필요\n종합강의동에서 도보 약 12분(870m), 후문에서 도보 약 16분(1.2km)"
  },
  {
   "id": "food-a9d0a488",
   "category": "음식점",
   "subcategory": "국밥·해장국",
   "name": "생각나는감자탕",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 11",
   "map": [
    "https://map.naver.com/p/entry/place/21755270?c=15.00,0,0,0,dh"
   ],
   "checkedAt": "2026-10-06",
   "price": "뼈해장국 9,500원",
   "recommend": 3,
   "note": "대학로 감자탕 맛집, 뼈해장국이 메인\n맛과 양 훌륭, 전혀 맵지 않음"
  },
  {
   "id": "food-5a3c1bfb",
   "category": "음식점",
   "subcategory": "국밥·해장국",
   "name": "옛날순대",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 중원대로 4104",
   "map": [
    "https://naver.me/GBFzFynw"
   ],
   "checkedAt": "2026-10-06",
   "price": "순대국밥 10,000원 (다른 메모: 순대국밥·돼지머리국밥·불고기뚝배기 7,000원)",
   "recommend": 2,
   "note": "순대국밥 든든하고 고기 푸짐\n차가 있어야 갈 수 있음\n매장 넓고 반찬 잘 나옴\n운영시간 확인 필요"
  },
  {
   "id": "food-8606c225",
   "category": "음식점",
   "subcategory": "국밥·해장국",
   "name": "24시전주명가콩나물국밥",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 계명대로 24",
   "map": [
    "https://naver.me/x3j434F6"
   ],
   "checkedAt": "2026-04-26",
   "price": "콩나물국밥 5,500원",
   "recommend": 1,
   "note": "대표·추천 메뉴: 콩나물국밥\n전화: 043-856-7723\n교통대에서 차로 11분"
  },
  {
   "id": "food-2ddf034d",
   "category": "음식점",
   "subcategory": "국밥·해장국",
   "name": "일번지순대국",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 연수상가2길 9",
   "map": [
    "https://naver.me/FsRseC0s"
   ],
   "checkedAt": "2026-10-06",
   "price": "순대국밥 9,000원 (대 11,000원)",
   "recommend": 3,
   "note": "우거지·시래기 듬뿍, 깊고 진한 국물인데 느끼하지 않음\n캐치테이블 등록\n저녁 혼잡 시간 웨이팅 10~30분"
  },
  {
   "id": "food-0bc740fc",
   "category": "음식점",
   "subcategory": "고기·구이",
   "name": "새마을 삼겹살",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 12",
   "map": [
    "https://map.naver.com/p/search/%EC%83%88%EB%A7%88%EC%9D%84%20%EC%82%BC%EA%B2%B9%EC%82%B4/place/1973130023?c=13.96,0,0,0,adh&p=9hrllEVDysTHP8429SjWJg,88.11,10,80,Float&isMini=true&placePath=%3Fbk_query%253D%2525EC%252583%252588%2525EB%2525A7%252588%2525EC%25259D%252584%252520%2525EC%252582%2525BC%2525EA%2525B2%2525B9%2525EC%252582%2525B4%2526entry%253Dbmp"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "대학로에서 삼겹살 먹고 싶을 때"
  },
  {
   "id": "food-31d57945",
   "category": "음식점",
   "subcategory": "고기·구이",
   "name": "윤박사한식삼겹살",
   "area": "학교 주변 (대소원면)",
   "location": "충청북도 충주시 대소원면 대학로 12",
   "map": [
    "https://map.naver.com/p/search/윤박사한식삼겹살"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "한식·생고기 식당, 삼겹살 중심 (탕수육도 언급됨)\n재방문 후기 많음, 학생·소규모 모임에 어울림\n영업시간: 08:30~22:00 (온라인 정보 기준)\n참고 블로그: https://blog.naver.com/98_yeun/224390686178"
  },
  {
   "id": "food-7592db08",
   "category": "음식점",
   "subcategory": "고기·구이",
   "name": "제주돼지촌",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 산정독정길 220",
   "map": [
    "https://map.naver.com/p/entry/place/1620939304?c=12.83,0,0,0,dh&placePath=%2Fhome%3Ffrom%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202610061941%26locale%3Dko%26svcName%3Dmap_pcv5"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "학교에서 걸어서 이동 가능\n삼겹살·막창·곱창"
  },
  {
   "id": "food-bd8312cf",
   "category": "음식점",
   "subcategory": "고기·구이",
   "name": "촌집돌판삼겹살",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 중원대로 4102 1층",
   "map": [
    "https://naver.me/GwpjkcRo"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "다 구워져서 돌판에 나오는 삼겹살\n학교 직원 회식 장소"
  },
  {
   "id": "food-47ba847a",
   "category": "음식점",
   "subcategory": "고기·구이",
   "name": "뚝딱김치찌개삼겹살",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 금제9길 38",
   "map": [
    "https://naver.me/FtTxTVFr"
   ],
   "checkedAt": "2026-10-06",
   "price": "10,000~30,000원",
   "recommend": 1,
   "note": "대표 메뉴: 김치찌개, 삼겹살\n김치찌개 맛있고 사장님이 착하심\n라면사리·공깃밥 무한리필\n영업시간: 10:30~22:00, 브레이크타임 14:30~16:30, 라스트오더 21:30"
  },
  {
   "id": "food-0af61668",
   "category": "음식점",
   "subcategory": "고기·구이",
   "name": "몽돌집",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 우륵로 22",
   "map": [
    "https://naver.me/FPnG0prc"
   ],
   "checkedAt": "2026-10-01",
   "price": "생삼겹살(180g) 10,900원",
   "recommend": 1,
   "note": "대표·추천 메뉴: 국내산생삼겹살\n전화: 043-724-8889\n교통대에서 차로 13분"
  },
  {
   "id": "food-1ff4535c",
   "category": "음식점",
   "subcategory": "고기·구이",
   "name": "큰집막창 봉방점",
   "area": "충주 시내·외곽",
   "location": "",
   "map": [
    "https://naver.me/GxkgL5fN"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "금·토 저녁 웨이팅 기본\n충주 세 지점 중 가장 인기\n교통대에서 999 또는 100번대 버스 → 충주역 하차 후 도보"
  },
  {
   "id": "food-e18b25ef",
   "category": "음식점",
   "subcategory": "고기·구이",
   "name": "화곡구이",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 주덕읍 화개2길 3 나동 109호",
   "map": [
    "https://naver.me/xI1tuVUb"
   ],
   "checkedAt": "2026-09-03",
   "price": "",
   "recommend": 1,
   "note": ""
  },
  {
   "id": "food-af9da533",
   "category": "음식점",
   "subcategory": "중식",
   "name": "권짬뽕 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학촌1길 3 1층",
   "map": [
    "https://naver.me/xQJ4dr9R"
   ],
   "checkedAt": "2026-10-06",
   "price": "해물짬뽕 9,000원, 짜장면 6,000원",
   "recommend": 3,
   "note": "교통대 정문 인근 짬뽕 전문 중식당\n해물짬뽕·육짬뽕·알짬뽕·백짬뽕, 진한 국물과 푸짐한 해물\n알짬뽕 나쁘지 않음\n영업시간: 11:00~21:00, 브레이크타임 15:00~16:30 (온라인 후기 기준)\n일요일 정기휴무 (온라인 후기 기준)\n참고 후기(2023-11-28): https://www.welfarehello.com/community/hometownNews/2ddddf97-21e6-4113-a50e-89881a23d683"
  },
  {
   "id": "food-5a831ae3",
   "category": "음식점",
   "subcategory": "중식",
   "name": "리밍 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 12 2층 203호",
   "map": [
    "https://map.naver.com/p/search/%EB%A6%AC%EB%B0%8D/place/1573411784?c=15.00,0,0,0,dh&placePath=%2Fhome%3Fbk_query%3D%EB%A6%AC%EB%B0%8D%26entry%3Dbmp%26from%3Dmap%26fromPanelNum%3D2%26timestamp%3D202610062000%26locale%3Dko%26svcName%3Dmap_pcv5%26searchText%3D%EB%A6%AC%EB%B0%8D"
   ],
   "checkedAt": "2026-10-06",
   "price": "육짬뽕·해물짬뽕 10,000원, 짜장면 6,000원",
   "recommend": 4,
   "note": "중식당 (대학가 원조 중국집)\n짜장면·짬뽕·볶음밥·탕수육·칠리새우 등, 볶음짬뽕·해물/차돌 지옥짬뽕 언급\n내부가 비교적 넓어 혼밥·친구 모임 모두 좋음\n영업시간: 10:30~24:00 (금요일 22:00까지), 브레이크타임 15:00~16:30\n매주 토요일 휴무\n참고 블로그(2025-08-21): https://blog.naver.com/PostView.nhn?blogId=coo5739&logNo=223978226517&widgetTypeCall=true"
  },
  {
   "id": "food-9a3ff921",
   "category": "음식점",
   "subcategory": "중식",
   "name": "마라야 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 용두제방길 4 1층",
   "map": [
    "https://naver.me/FeNgUQsI"
   ],
   "checkedAt": "2026-10",
   "price": "최소주문 6,000원",
   "recommend": 1,
   "note": ""
  },
  {
   "id": "food-28852230",
   "category": "음식점",
   "subcategory": "중식",
   "name": "신신마라탕 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 13 1층",
   "map": [
    "https://map.naver.com/p/search/%EC%8B%A0%EC%8B%A0%EB%A7%88%EB%9D%BC%ED%83%95%20%EA%B5%90%ED%86%B5%EB%8C%80%EC%A0%90"
   ],
   "checkedAt": "2026-10-06",
   "price": "마라탕 100g 1,900원(7,000원 이상), 마라샹궈 100g 2,800원(14,000원 이상), 꿔바로우 소 7,000원·중 11,000원, 새우반반꿔바로우 중 11,000원·대 18,000원, 마라가재꼬리 18,000원",
   "recommend": 1,
   "note": "종합강의동에서 도보 약 12분(930m), 후문에서 도보 약 17분(1.3km)"
  },
  {
   "id": "food-206dc6e2",
   "category": "음식점",
   "subcategory": "중식",
   "name": "짬뽕생각",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 20 1층 101호",
   "map": [
    "https://naver.me/FUiCPE9l"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "새로 생긴 중식집\n면발 얇고 삶음 정도 좋음\n매장 넓음\n저녁 20시까지 운영"
  },
  {
   "id": "food-3eeeb256",
   "category": "음식점",
   "subcategory": "중식",
   "name": "차이나김쉐프",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 첨단쉼터2길 15",
   "map": [
    "https://naver.me/GOPKXRso"
   ],
   "checkedAt": "2026-09-10",
   "price": "",
   "recommend": 1,
   "note": ""
  },
  {
   "id": "food-b9da035d",
   "category": "음식점",
   "subcategory": "중식",
   "name": "탄금반점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 탄금대로 296",
   "map": [
    "https://naver.me/5uIRcpew"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "11:00~15:00 영업이지만 재료 소진으로 일찍 마감\n13시 이후엔 탕수육 품절\n짜장 추천"
  },
  {
   "id": "food-09196e1d",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "핵밥 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 6 보람빌딩 1층",
   "map": [
    "https://naver.me/5XJAWCXH"
   ],
   "checkedAt": "2026-10-07",
   "price": "덮밥 단품 9,900~15,900원 / 정식 12,900~18,900원, 한우대창덮밥 정식 16,900원, 경양식왕돈까스 10,900원, 돈코츠라멘 10,500원, 마제소바 10,900원",
   "recommend": 5,
   "note": "덮밥이 주메뉴, 라멘·마제소바·돈까스도 있음\n인테리어 깔끔, 양 많음, 라멘 먹고 싶을 때 추천\n키오스크 주문(입구/테이블) → 사람 많아도 원활, 한국어 없이 주문 가능\n영업시간: 매일 11:00~22:00, 브레이크타임 15:00~17:00, 라스트오더 21:30\n전화: 043-852-6277\n종합강의동에서 도보 약 14분(1.0km), 후문에서 도보 약 18분(1.4km)\n\"이름 핵밥\" 파일의 위치 표기: 충청북도 충주시 대소원면 만정리 196"
  },
  {
   "id": "food-e7ccaa68",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "막부",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 봉현로 296 1층",
   "map": [
    "https://naver.me/F4LDKwiH"
   ],
   "checkedAt": "2026-09-28",
   "price": "30,000원 이상",
   "recommend": 1,
   "note": "런치/디너 스시 오마카세\n별점 4.92\n전화: 0507-1398-5190\n교통대에서 차로 13분"
  },
  {
   "id": "food-671d36df",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "봉방돈까스",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 봉방3길 34-1",
   "map": [
    "https://map.naver.com/p/entry/place/1869525189?c=15.00,0,0,0,dh&placePath=%2Fhome%3Ffrom%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202610061925%26locale%3Dko%26svcName%3Dmap_pcv5"
   ],
   "checkedAt": "2026-10-06",
   "price": "메뉴 평균 13,000원",
   "recommend": 1,
   "note": "경양식 돈까스 전문점\n차가 있으면 이동 편함\n셀프바 무제한 (수프가 맛있음)\n매운 돈까스는 상당히 매움"
  },
  {
   "id": "food-423a6767",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "쇼쿠스시 충주호암점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 호암토성4길 3 노브랜드 3층",
   "map": [
    "https://naver.me/Gjy3MuJv"
   ],
   "checkedAt": "2026-10-06",
   "price": "회전초밥 한 접시 1,990원, 세트 14,000~22,000원, 평일 점심 특선 16,000원, 사시미 한상 65,000~110,000원",
   "recommend": 2,
   "note": "충주 회전초밥 중 가성비 최고\n영업시간: 매일 11:30~21:30, 연중무휴\n식사 시간엔 한 팀 정도 웨이팅\n교통대에서 700번 버스 → 풍경채 하차 후 도보"
  },
  {
   "id": "food-c9c8bd70",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "심향",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 관아1길 17",
   "map": [
    "https://map.naver.com/p/entry/place/37081756"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "일식당\n충주 시내"
  },
  {
   "id": "food-1c493233",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "예반72",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 관아5길 6",
   "map": [
    "https://map.naver.com/p/entry/place/1019680026"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "돈가스\n충주 시내"
  },
  {
   "id": "food-1fe9f22e",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "우동키노야 충주호암점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 호암수청2로 10 1층 115호",
   "map": [
    "https://naver.me/FSvS2TUh"
   ],
   "checkedAt": "2026-10-06",
   "price": "우동 9,000~16,900원, 돈카츠 12,900원 (키노야 카케우동 9,000원, 카레우동 11,500원, 토리텐 카케우동 13,000원, 통장어튀김 붓카케우동 16,900원)",
   "recommend": 2,
   "note": "다양한 우동·소바·돈까스\n1인석 있음\n영업시간: 매일 11:00~21:00, 브레이크타임 15:00~17:00, 라스트오더 20:00"
  },
  {
   "id": "food-ddf4e8cb",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "카츠집",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 연수서편2길 11 상가동 117호",
   "map": [
    "https://map.naver.com/p/entry/place/1875506164?lng=127.9303531&lat=36.9899468&placePath=%2Finformation%3FfromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202610061904%26locale%3Dko%26svcName%3Dmap_pcv5&searchType=place&c=15.00,0,0,0,dh"
   ],
   "checkedAt": "2026-10-06",
   "price": "평균 11,000원",
   "recommend": 1,
   "note": "차가 있으면 이동 편함\n점심 대기 15~20분"
  },
  {
   "id": "food-72ee20b2",
   "category": "음식점",
   "subcategory": "일식·돈까스",
   "name": "후라토식당 충주점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 호암토성2로 3 선우프라자 2층 201호",
   "map": [
    "https://naver.me/GDafwATF"
   ],
   "checkedAt": "2026-10-05",
   "price": "",
   "recommend": 1,
   "note": "메뉴: 규카츠, 스테끼 정식, 에비카츠동 (추천: 규카츠)\n별점 4.87\n교통대에서 차로 13분\n전화: 0507-1338-0956"
  },
  {
   "id": "food-b6792fc0",
   "category": "음식점",
   "subcategory": "양식",
   "name": "꼬보 (COVO)",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 대가미13길 28 1층",
   "map": [
    "https://map.naver.com/p/entry/place/1027293990"
   ],
   "checkedAt": "2026-10-06",
   "price": "치킨난반 14,000원, 꼬보 스키야키 25,000원",
   "recommend": 1,
   "note": "스파게티·파스타 전문\n충주 시내"
  },
  {
   "id": "food-2180205e",
   "category": "음식점",
   "subcategory": "양식",
   "name": "밍거스 바베큐",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 사천개로 40 이노스퀘어빌딩 2층",
   "map": [
    "https://naver.me/FV7YuLNq"
   ],
   "checkedAt": "2026-10-06",
   "price": "타코 13,000원, 1인 바베큐 16,000~23,000원, 플레이트 41,000~43,000원 (밍거스 플레이트 41,000원, 베이비 백 립 플레이트 43,000원, 파히타 42,000원)",
   "recommend": 1,
   "note": "영업시간: 월~토 17:00~22:00\n매주 일요일 휴무"
  },
  {
   "id": "food-4be53308",
   "category": "음식점",
   "subcategory": "양식",
   "name": "투파인드피터 충주연수점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 연수동산로2길 3 2층 201호",
   "map": [
    "https://naver.me/GeURtqMe"
   ],
   "checkedAt": "2026-10-06",
   "price": "파스타 11,000~18,000원대 (옵션별 차이 큼)",
   "recommend": 2,
   "note": "샐러드·파스타 이탈리아 양식 체인점, 충주 시내\n분위기 좋아 데이트하기 좋음\n대기 시간 없음\n추천 메뉴: 핫 쉬림프 갈릭 파스타, 해산물 토마토 페투치네"
  },
  {
   "id": "food-58169387",
   "category": "음식점",
   "subcategory": "분식",
   "name": "대학로 친구분식",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 23 1층",
   "map": [
    "https://place.map.kakao.com/15670775"
   ],
   "checkedAt": "2026-10-06",
   "price": "야채김밥 3,000원, 즉석떡볶이 6,000원",
   "recommend": 2,
   "note": "분식 (김밥류, 만두)\n종합강의동에서 도보 약 11분(820m), 후문에서 도보 약 16분(1.2km)"
  },
  {
   "id": "food-8e7cdc62",
   "category": "음식점",
   "subcategory": "분식",
   "name": "미미분식",
   "area": "학교 주변 (대소원면)",
   "location": "충청북도 충주시 대소원면 대학로 19",
   "map": [
    "https://naver.me/xAf7hzHy"
   ],
   "checkedAt": "2026-10-06",
   "price": "떡볶이 3,000원대, 라면·튀김류 4,000~6,000원대",
   "recommend": 1,
   "note": "떡볶이·오뎅·라면·순대·튀김 등 분식\n수업 사이 빠른 식사, 친구들과 나눠 먹기 좋음"
  },
  {
   "id": "food-ad1d657f",
   "category": "음식점",
   "subcategory": "분식",
   "name": "성대분식",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 요도천변길 220-7",
   "map": [
    "https://naver.me/FfsYd6yg"
   ],
   "checkedAt": "2026-10-06",
   "price": "삼겹살비빔밥 8,900원",
   "recommend": 1,
   "note": "가격 대비 양 많고 맛 괜찮음\n배달이 빠름"
  },
  {
   "id": "food-f4e29c90",
   "category": "음식점",
   "subcategory": "분식",
   "name": "신전떡볶이 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 21 2호",
   "map": [
    "https://map.naver.com/p/entry/place/37656960"
   ],
   "checkedAt": "2026-10-07",
   "price": "떡볶이 4,000원, 치즈떡볶이 6,000원, 튀김 1,700원",
   "recommend": 1,
   "note": "맵기 선택 가능, 매운 것 못 먹으면 순한맛\n영업시간: 매일 11:00~23:00"
  },
  {
   "id": "food-c540fe9b",
   "category": "음식점",
   "subcategory": "분식",
   "name": "엄정분식",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 충인6길 37-1",
   "map": [
    "https://naver.me/FtTdJwWL"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "술 안 마시면 불친절할 수도 있음"
  },
  {
   "id": "food-8d63f154",
   "category": "음식점",
   "subcategory": "분식",
   "name": "오뚜기분식",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 자유시장길 31 1층",
   "map": [
    "https://naver.me/FKGITrds"
   ],
   "checkedAt": "2026-10-06",
   "price": "쫄면+김밥+떡볶이 약 16,000원 (2인 배부름)",
   "recommend": 2,
   "note": "종합분식, 충주 시내 (서충주에도 있음)\n정통 분식\n쫄면 최고"
  },
  {
   "id": "food-4892d498",
   "category": "음식점",
   "subcategory": "버거·간편식",
   "name": "뉴욕버거 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학촌1길 8 1층",
   "map": [
    "https://map.naver.com/p/search/%EB%89%B4%EC%9A%95%EB%B2%84%EA%B1%B0/place/1360232479?c=13.00,0,0,0,dh&placePath=%2Fhome%3Fentry%3Dbmp%26from%3Dmap%26fromPanelNum%3D2%26timestamp%3D202610062005%26locale%3Dko%26svcName%3Dmap_pcv5%26searchText%3D%EB%89%B4%EC%9A%95%EB%B2%84%EA%B1%B0"
   ],
   "checkedAt": "2026-10-06",
   "price": "뉴욕버거 (단품)5,800원 (세트)9,100원",
   "recommend": 2,
   "note": "수제버거집, 피자도 판매\n영업시간: 10:00~21:00 (다른 메모에는 22:00 영업 종료)"
  },
  {
   "id": "food-d036415c",
   "category": "음식점",
   "subcategory": "버거·간편식",
   "name": "도란도락",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 10-6",
   "map": [
    "https://naver.me/FE32chm2"
   ],
   "checkedAt": "2026-10-06",
   "price": "가츠동 5,700원, 전체 메뉴 10,000원 이하",
   "recommend": 1,
   "note": "도시락집\n12:00~13:00 붐빔, 주문 시 30분 정도 소요 → 점심 전이나 이후 추천"
  },
  {
   "id": "food-ece9180f",
   "category": "음식점",
   "subcategory": "버거·간편식",
   "name": "봉구스밥버거 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 18",
   "map": [
    "https://map.naver.com/p/entry/place/32874983"
   ],
   "checkedAt": "2026-10-07",
   "price": "기본 봉구스밥버거 3,500원, 고기·치즈 메뉴 4,000~7,000원대",
   "recommend": 1,
   "note": "주문 후 바로 만들어 포장 → 쉬는 시간 짧을 때 테이크아웃\n영업시간: 월~목 09:00~21:00, 금 09:00~19:00, 일 11:00~21:00\n토요일 정기휴무"
  },
  {
   "id": "food-115f178f",
   "category": "음식점",
   "subcategory": "버거·간편식",
   "name": "부리또인 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 13",
   "map": [
    "https://naver.me/xKEb82t9"
   ],
   "checkedAt": "2026-10-07",
   "price": "부리또(단품) 4,000원~",
   "recommend": 9,
   "note": "평일 점심(12:00~13:00) 붐빔: 대기 10분~40분 → 조금 일찍 또는 점심 이후 방문 추천\n매장 협소\n입맛대로 커스터마이징 가능, 소고기 조금매운맛+파인애플 추천\n착한 가격, 양 적지 않음 (하나만 먹어도 배부르다는 메모 / 한 끼로 가볍다는 메모)\n매일 먹어도 안 질림\n종합강의동에서 도보 약 13분(950m), 후문에서 도보 약 17분(1.3km)"
  },
  {
   "id": "food-bdf4c917",
   "category": "음식점",
   "subcategory": "버거·간편식",
   "name": "샌치",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 19-10 1층",
   "map": [
    "https://naver.me/G8hLweAu"
   ],
   "checkedAt": "2026-10-06",
   "price": "포케 10,400원~",
   "recommend": 2,
   "note": "대학가 유일 샐러드·포케집\n21:00 영업 종료"
  },
  {
   "id": "food-1777e3bc",
   "category": "음식점",
   "subcategory": "버거·간편식",
   "name": "수리또 대소원점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 9",
   "map": [
    "https://naver.me/GahRhZGP"
   ],
   "checkedAt": "2026-10-06",
   "price": "부리또 6,300~8,500원, 세트 추가 3,000원 (김치소고기 7,200원, 믹스 6,500원, 새우 8,500원)",
   "recommend": 1,
   "note": "대학로에 있어 접근 쉽고 맛있음\n운영시간 확인 필요"
  },
  {
   "id": "food-d0e98173",
   "category": "음식점",
   "subcategory": "버거·간편식",
   "name": "한솥도시락 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 21 1호",
   "map": [
    "https://naver.me/F758CQyD"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "프랜차이즈라 맛 보장, 혼밥 좋음\n영업시간: 08:00~20:00\n전화: 043-844-8869"
  },
  {
   "id": "food-02c5a100",
   "category": "음식점",
   "subcategory": "버거·간편식",
   "name": "스매쉬크루",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 용정2길 40",
   "map": [
    "https://naver.me/GO6z8s6l"
   ],
   "checkedAt": "2026-10-06",
   "price": "버거 5,500~9,000원, 사이드 3,000~7,500원 (스매쉬 싱글 치즈버거 5,500원, 싱글버거 SET 9,000원, 칠리프라이 7,500원, 사이드세트 5,500원)",
   "recommend": 1,
   "note": "미국 LA 버거 맛에 가장 근접\n영업시간: 11:00~20:00"
  },
  {
   "id": "food-101f605d",
   "category": "음식점",
   "subcategory": "치킨",
   "name": "태권치킨 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 12",
   "map": [
    "https://naver.me/xZKpX5Pd"
   ],
   "checkedAt": "2026-10-06",
   "price": "나혼자세트2번 17,000원",
   "recommend": 1,
   "note": "1인 세트: 순살 후라이드 300g + 떡볶이 1인분 + 치즈볼 3개 + 음료 500ml, 가성비 좋음\n영업시간: 17:00~24:00\n전화: 0507-1371-0724"
  },
  {
   "id": "food-735c5021",
   "category": "음식점",
   "subcategory": "치킨",
   "name": "또래오래 (대학로)",
   "area": "충주 시내·외곽",
   "location": "대학로",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "소주를 시키면 서비스로 순두부찌개를 줌"
  },
  {
   "id": "food-50e18c81",
   "category": "음식점",
   "subcategory": "기타 (정보 부족)",
   "name": "NIR (니르)",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 8",
   "map": [
    "https://map.naver.com/p/search/%EC%B6%A9%EC%A3%BC%20%EB%8C%80%EC%86%8C%EC%9B%90%EB%A9%B4%20%EB%8B%88%EB%A5%B4"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "종합강의동에서 도보 약 13분(1.0km), 후문에서 도보 약 18분(1.3km)"
  },
  {
   "id": "food-2dc8f129",
   "category": "음식점",
   "subcategory": "기타 (정보 부족)",
   "name": "이씨식당 충주점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 능바우길 15",
   "map": [
    "https://naver.me/xa5R7ek6"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "주차장 있음 (공간 제한적)"
  },
  {
   "id": "food-377910d2",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "블루포트 한국교통대학교점",
   "area": "교내",
   "location": "충북 충주시 대소원면 대학로 50 한국교통대학교 인문사회관 1층",
   "map": [
    "https://naver.me/x4GV13TR"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 3,
   "note": "영업 09:00~17:30, 영업시간 외에도 공부할 수 있게 열려 있음\n메뉴 안 시켜도 잠깐 앉아 조별과제 가능\n공부하기 좋음\n카페 안에 프린터 있음 (프린트카드 결제)"
  },
  {
   "id": "food-afa4dadc",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "카페플로르 도서관점",
   "area": "교내",
   "location": "중앙도서관 1층",
   "map": [
    "https://map.naver.com/p/search/%ED%95%9C%EA%B5%AD%EA%B5%90%ED%86%B5%EB%8C%80%ED%95%99%EA%B5%90%20%EC%B9%B4%ED%8E%98%ED%94%8C%EB%A1%9C%EB%A5%B4%20%EB%8F%84%EC%84%9C%EA%B4%80%EC%A0%90"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 3,
   "note": "교내 카페\n운영시간: 월~목 09:00~21:00, 금 09:00~18:00\n메뉴: 원두커피, 각종 음료, 케이크·빵\n전화: 043-849-1565\n참고: https://www.ut.ac.kr/kor/sub06_02_01_01.do"
  },
  {
   "id": "food-f5f766bc",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "카페플로르 복지관점",
   "area": "교내",
   "location": "대학본부 복지관 2층 (1층 학생식당 바로 위)",
   "map": [
    "https://map.naver.com/p/search/%ED%95%9C%EA%B5%AD%EA%B5%90%ED%86%B5%EB%8C%80%ED%95%99%EA%B5%90%20%EC%B9%B4%ED%8E%98%ED%94%8C%EB%A1%9C%EB%A5%B4%20%EB%B3%B5%EC%A7%80%EA%B4%80%EC%A0%90"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 4,
   "note": "교내 카페\n운영시간: 월~금 09:00~18:00\n메뉴: 원두커피, 각종 음료, 케이크·빵\n전화: 043-841-5475\n높은 위치라 전망·경치가 좋음\ntxt의 이름 표기: 카페플로르(FLORE) (위치: 대학본부)"
  },
  {
   "id": "food-6615a790",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "카페플로르 휴스퀘어관점",
   "area": "교내",
   "location": "휴스퀘어관",
   "map": [
    "https://map.naver.com/p/search/%ED%95%9C%EA%B5%AD%EA%B5%90%ED%86%B5%EB%8C%80%ED%95%99%EA%B5%90%20%EC%B9%B4%ED%8E%98%ED%94%8C%EB%A1%9C%EB%A5%B4%20%ED%9C%B4%EC%8A%A4%ED%80%98%EC%96%B4%EA%B4%80%EC%A0%90",
    "https://naver.me/IFGoZ2wU"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 4,
   "note": "교내 카페\n운영시간: 월~목 09:00~20:00, 금 09:00~18:00\n메뉴: 원두커피, 각종 음료, 케이크·빵\n전화: 043-849-1725\n학교가 관리해 저렴하고 좌석 넓음\n한 파일의 위치 표기: 충북 충주시 대소원면 검단리 123"
  },
  {
   "id": "food-2f0abe51",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "돈까스카페",
   "area": "학교 주변 (대소원면)",
   "location": "",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "카페 (카페 리스트의 대학가 항목)"
  },
  {
   "id": "food-63e49674",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "드랍바이 (DROP BY)",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 용두제방길 4 1층",
   "map": [
    "https://naver.me/FBMXKtQH"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 3,
   "note": "<카패> 테이크아웃 카페\n와플이 맛있음, 겨울에는 붕어빵도 판매\n시간대 상관없이 주문 원활"
  },
  {
   "id": "food-85485343",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "메가MGC커피 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "카페 (카페 리스트의 대학가 항목)"
  },
  {
   "id": "food-44187379",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "밀크티인",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 10",
   "map": [
    "https://naver.me/5B00vJjM"
   ],
   "checkedAt": "2026-10-06",
   "price": "아메리카노 3,500원, 밀크티 5,200원",
   "recommend": 3,
   "note": "<카페> 밀크티 전문 카페, 밀크티가 맛있음\n특색 있는 카페를 찾을 때 추천"
  },
  {
   "id": "food-b287d11a",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "빽다방 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충청북도 충주시 대소원면 대학로 19-3",
   "map": [
    "https://naver.me/Fc6WbV6p"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 2,
   "note": "저가 커피 프랜차이즈, 큰 용량 음료\n매일 09:00~24:00 (방문 전 확인 권장)\n전화: 0507-1437-0462\n학교 바로 앞이라 공강·등하굣길에 들르기 편함, 시험 기간 밤늦게도 이용"
  },
  {
   "id": "food-6983a69f",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "이디야커피 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 11",
   "map": [
    "https://map.naver.com/p/entry/place/1914596127"
   ],
   "checkedAt": "2026-10-07",
   "price": "아메리카노(라지 520ml) 3,200원",
   "recommend": 2,
   "note": "정문에서 약 350m (도보 5분)\n영업시간: 평일 08:30~23:00, 주말 09:00~23:00 (라스트오더 22:30)\n콘센트 좌석 있어 노트북 과제·조모임 가능"
  },
  {
   "id": "food-cb4eda7e",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "카페 제이",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 요도천변길 299",
   "map": [
    "https://naver.me/GL8ircx9"
   ],
   "checkedAt": "2026-10-07",
   "price": "",
   "recommend": 1,
   "note": "인사대 후문 쪽\n커피가 맛있음\n테이크아웃 후 내천 따라 걷기 좋음"
  },
  {
   "id": "food-a3940552",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "컴포즈커피",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 27",
   "map": [
    "https://naver.me/xpjcky0B"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "시간대 상관없이 주문 원활"
  },
  {
   "id": "food-fe67d20c",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "굿나잇커피앤북",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 행정5길 25 1층",
   "map": [
    "https://map.naver.com/p/entry/place/1057582602"
   ],
   "checkedAt": "2026-10-06",
   "price": "아메리카노 4,500원",
   "recommend": 1,
   "note": "<카페>카페·디저트\n충주 시내"
  },
  {
   "id": "food-c5e1ca67",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "서리꽃",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 성서2길 20 1층 103호",
   "map": [
    "https://map.naver.com/p/entry/place/1250616851"
   ],
   "checkedAt": "2026-10-06",
   "price": "아메리카노 5,300원",
   "recommend": 1,
   "note": "<카페> 카페·디저트\n충주 시내"
  },
  {
   "id": "food-5aee0dde",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "소소, 단월",
   "area": "충주 시내·외곽",
   "location": "충청북도 충주시 충열5길 12 1층",
   "map": [
    "https://naver.me/x2cKXYyf"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "<카페> 건대 앞 가게지만 교통대까지 배달\n새벽 1시까지 영업"
  },
  {
   "id": "food-c88cd5b4",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "아흐레커피",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 대흥길 42",
   "map": [
    "https://map.naver.com/p/entry/place/1952540278"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "카페·디저트\n충주 시내"
  },
  {
   "id": "food-41d18d7e",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "커피상점 교동",
   "area": "충주 시내·외곽",
   "location": "충청북도 충주시 교현동 교동3길 9-2",
   "map": [
    "https://naver.me/Gip5jjDj"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "조용한 커피 전문 카페, 작은 정원과 깔끔한 인테리어\n고소하고 부드러운 커피, 친절, 주차 편리\n쑥라테·쑥차 등 개성 있는 음료\n화~일 12:00~21:00, 월요일 휴무 (방문 전 확인 권장)\n전화: 043-843-0754"
  },
  {
   "id": "food-9ead8cc9",
   "category": "카페",
   "subcategory": "커피·음료",
   "name": "파스쿠찌 충주칠금점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 칠금동 842",
   "map": [
    "https://naver.me/xprpznbK"
   ],
   "checkedAt": "2026-10-05",
   "price": "",
   "recommend": 1,
   "note": "공부하기 좋은 넓은 좌석\n밤 12시까지 영업"
  },
  {
   "id": "food-95e47b55",
   "category": "카페",
   "subcategory": "베이커리·디저트",
   "name": "파리바게뜨 서충주농협점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 중원대로 3930 (만정리 182-6)",
   "map": [
    "https://naver.me/GUmUHvu2"
   ],
   "checkedAt": "2026-10",
   "price": "",
   "recommend": 1,
   "note": "학교 반대편 하나로마트 쪽에 있음 (모르는 학생 많음)\n빵 좋아하는 신입생에게 추천"
  },
  {
   "id": "food-bc107f33",
   "category": "카페",
   "subcategory": "베이커리·디저트",
   "name": "듀레베이커리",
   "area": "충주 시내·외곽",
   "location": "충청북도 충주시 중원대로 3250 1층",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "아메리카노 5,800원",
   "recommend": 1,
   "note": "<카페> 간식·데이트\n깔끔함, 넓음, 아침·점심식사, 야외자리, 넓은 마당, 무료주차"
  },
  {
   "id": "food-e37c5f3b",
   "category": "카페",
   "subcategory": "베이커리·디저트",
   "name": "베이커리 이와정",
   "area": "충주 시내·외곽",
   "location": "충청북도 충주시 연수동산로7길 2",
   "map": [
    "https://naver.me/GOPwoQea"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "크루아상·깜빠뉴 중심 동네 빵집, 시그니처는 소금 크루아상\n대표 메뉴: 버터/소금 크루아상 3,800원, 퀸아망 4,500원, 소금빵 2,800원, 깜빠뉴(단호박/고구마/무화과) 5,500~6,000원, 올리브 포카치아 5,800원, 베이글 3종 3,300~3,800원\n추천: 단호박 크림치즈 깜빠뉴\n깔끔한 매장, 음료 판매, 주차·포장 가능\n인기 메뉴는 오후 늦게 품절 → 오전·이른 오후 방문\n수~일 09:30~18:30, 월·화 휴무 (방문 전 확인 권장)\n전화: 070-7722-7700"
  },
  {
   "id": "food-3fb6bcb0",
   "category": "카페",
   "subcategory": "베이커리·디저트",
   "name": "카페 슬로우 모닝즈 충주본점",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 봉계13길 30 1층",
   "map": [
    "https://map.naver.com/p/entry/place/1208664909"
   ],
   "checkedAt": "2026-10-06",
   "price": "소금빵 2,000원대",
   "recommend": 1,
   "note": "빵·샌드위치 카페, 충주 시내\n좌석 25석 가까이, 넓은 편\n추천 메뉴: 소금빵, 아인슈페너, 클래식 스콘"
  },
  {
   "id": "food-6ffa0577",
   "category": "카페",
   "subcategory": "베이커리·디저트",
   "name": "평정",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 성서1길 14-1",
   "map": [
    "https://map.naver.com/p/entry/place/1196620055"
   ],
   "checkedAt": "2026-10-06",
   "price": "푸딩 평균 5,500원대",
   "recommend": 1,
   "note": "푸딩만 파는 디저트 집, 충주 시내 (빨간 문)\n6종: 커피젤리·커스터드·우유·초코·말차·얼그레이\n추천: 우유푸딩, 커스터드 푸딩"
  },
  {
   "id": "food-26c0b744",
   "category": "카페",
   "subcategory": "감성·전망 카페",
   "name": "앤쏘온",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 수안보면 안보복거리길 70 1층",
   "map": [
    "https://naver.me/xeAfRTju"
   ],
   "checkedAt": "2026-02",
   "price": "",
   "recommend": 1,
   "note": "LP카페\ntxt 파일명: 이색데이트 카페"
  },
  {
   "id": "food-92a62f7b",
   "category": "카페",
   "subcategory": "감성·전망 카페",
   "name": "째즈와산조",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 지곡6길 39",
   "map": [
    "https://map.naver.com/p/entry/place/36655170"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "카페·디저트, 충주 시내\n감성 분위기, 데이트 코스 추천\n그날그날 시그니처 메뉴와 맞는 디저트·커피"
  },
  {
   "id": "food-73a69efe",
   "category": "카페",
   "subcategory": "감성·전망 카페",
   "name": "카페샵오팔",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 청운로 58-1 4층~6층",
   "map": [
    "https://map.naver.com/p/entry/place/1200943881"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "디저트 주력 카페, 충주 시내\n추천 메뉴: 소금빵, 브라우니 아이스크림\n시내 전망 대형 감성 카페, 여러 층 넓은 좌석·통창·루프탑\n데이트·친구 모임에 좋고 비 오는 날 분위기 좋음\n메뉴: 커피, 바닐라라테, 에그타르트, 와플 등\n월·수~일 12:00~22:00, 화요일 휴무 (방문 전 확인 권장)\n전화: 0507-1478-4502"
  },
  {
   "id": "food-1eb7da6f",
   "category": "카페",
   "subcategory": "감성·전망 카페",
   "name": "커피단월",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 충원대로 55",
   "map": [
    "https://naver.me/xAFCN08a"
   ],
   "checkedAt": "2026-10-07",
   "price": "",
   "recommend": 1,
   "note": "가격대가 있지만 빵·커피 맛있음\n2~3층까지 넓음, 통창 풍경"
  },
  {
   "id": "food-0140d1db",
   "category": "카페",
   "subcategory": "감성·전망 카페",
   "name": "호수가아름다운전망대",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 동량면 지등로 1391",
   "map": [
    "https://naver.me/GoD7vjgx"
   ],
   "checkedAt": "2026-05-25",
   "price": "",
   "recommend": 1,
   "note": "txt 파일명: 숨겨진 카페"
  },
  {
   "id": "food-9b13441c",
   "category": "술집",
   "subcategory": "",
   "name": "달주",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 19-3",
   "map": [
    "https://naver.me/FSw0F3WZ"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "<술집> 과 행사·단체 모임 하기 좋음\n단체는 미리 전화 예약 권장"
  },
  {
   "id": "food-c7a55b1b",
   "category": "술집",
   "subcategory": "",
   "name": "만정 요리주점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 용두제방길 4 201호",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-01773bd1",
   "category": "술집",
   "subcategory": "",
   "name": "슬기로운대학생활",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 25",
   "map": [
    "https://naver.me/50JBNrJR"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 3,
   "note": "술자리 갖기 좋은 대학로 대표 술집, 항상 사람 많음\n안주 맛있음\n신입생에게 강추"
  },
  {
   "id": "food-956c3c77",
   "category": "술집",
   "subcategory": "",
   "name": "아지트",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 28 2층",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-db38cbcb",
   "category": "술집",
   "subcategory": "",
   "name": "야식포차 충주 교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 19 2층",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-fd535ccc",
   "category": "술집",
   "subcategory": "",
   "name": "역전할머니맥주 충주교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 26",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-95a4b5b8",
   "category": "술집",
   "subcategory": "",
   "name": "연애포차",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 12",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-6a9d26d3",
   "category": "술집",
   "subcategory": "",
   "name": "오후",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 11 2층 (이디야커피 옆 계단)",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-317cfcb3",
   "category": "술집",
   "subcategory": "",
   "name": "청춘주막",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 13 2층",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-8b751afe",
   "category": "술집",
   "subcategory": "",
   "name": "쿠마쿠마교통대점",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 11 2층",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-c84160e1",
   "category": "술집",
   "subcategory": "",
   "name": "한식주점 권식당",
   "area": "학교 주변 (대소원면)",
   "location": "충북 충주시 대소원면 대학로 11 5층",
   "map": [],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "술집"
  },
  {
   "id": "food-f85fba81",
   "category": "술집",
   "subcategory": "",
   "name": "낮과밤",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 지현천변1길 55-2",
   "map": [
    "https://map.naver.com/p/entry/place/1353118575"
   ],
   "checkedAt": "2026-10-06",
   "price": "매콤크림플레이트 18,900원 (2인 적당)",
   "recommend": 1,
   "note": "요리주점, 양식 메뉴 주력\n충주 시내\n야장 좌석 약 20석, 선선한 날씨에 매력적\n추천 메뉴: 매콤크림플레이트, 오뎅탕\n저녁에 붐비고 8시쯤 만석"
  },
  {
   "id": "food-c499c5d9",
   "category": "술집",
   "subcategory": "",
   "name": "속초실비집",
   "area": "충주 시내·외곽",
   "location": "충북 충주시 갱고개로 59",
   "map": [
    "https://naver.me/GI3eyvrS"
   ],
   "checkedAt": "2026-10-06",
   "price": "소주 3,000원",
   "recommend": 1,
   "note": "안주 종류 많고 양 푸짐"
  }
 ],
 "tips": [
  {
   "id": "tips-549d5e96",
   "category": "장학금·지원금",
   "name": "교내 장학금 평점 기준",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "성적우수 장학금: 평점 2.8 이상, 12학점 이상 (단과대학장 추천)\n미래장학금(기초·차상위): 2.0 이상, 12학점\n공로장학금: 2.5 이상, 12학점\n교내근로 장학금: 소득 8분위 이내, 백분위 70점 이상\n금액·기준은 학기마다 바뀔 수 있음 (출처: 교통대 재학생 장학 안내)"
  },
  {
   "id": "tips-d8f9cac3",
   "category": "장학금·지원금",
   "name": "국가근로장학금",
   "location": "",
   "map": [],
   "recommend": 3,
   "note": "한국장학재단 앱에서 정해진 기간에 신청 → 학기 시작 전 교내·교외 근로 신청\n성적·소득분위로 우선순위 결정\n최저시급보다 높은 시급, 알바 대신 좋은 생활비 수단\n다자녀는 탈락이 잘 안 되니 꼭 신청\n한국장학재단에 국가근로장학금 신청 → 재단 사이트에서 희망근로지 신청 (1순위 희망근로지 신청자 우선 선발)\n조건: 직전 정규학기 백분위 70점 이상, 학자금 지원 9구간 이하\n2026-2학기 시급: 교내 10,320원, 교외 12,790원, 매월 17일 지급\n학기 중 월 최대 80시간\n문의: 학생과 장학팀 043-849-1449\n참고: https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000060/selectBoardArticle.do?nttId=1124049"
  },
  {
   "id": "tips-4d82ea30",
   "category": "장학금·지원금",
   "name": "국가장학금",
   "location": "",
   "map": [],
   "recommend": 2,
   "note": "다음 학기 1차 신청은 보통 11월 하순~12월 하순 (2026학년도 1학기: 2025.11.20~12.26)\n2027학년도 1학기 날짜는 한국장학재단 공고 확인\n신청: https://www.kosaf.go.kr\n재학생은 원칙적으로 1차 신청 기간에만 신청 가능, 2차 신청은 재학 중 2회까지만 구제\n신청 후 부모님 가구원 정보제공 동의까지 끝내야 함 (빠지면 지원 못 받음)\n성적기준: 직전 학기 12학점 이상 이수, 100점 만점에 80점 이상 (신입생 첫 학기 미적용)\n1차 신청은 보통 11월 하순~12월 하순 (2025-1학기: 2024.11.21~12.26)\n참고: https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_12_01_01&tab=1"
  },
  {
   "id": "tips-c6c56cd6",
   "category": "장학금·지원금",
   "name": "등록금 분할납부",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "통합정보시스템 → 등록 → 분납신청에서 2·3·4회 중 선택 (2학기는 8월·9월 신청)\n1차 납부를 안 하면 분납 신청 자동 취소\n분납 중 휴학하면 남은 등록금 한꺼번에 납부\n카드 불가, 가상계좌나 은행 방문으로 납부\n참고: https://www.ut.ac.kr/kor/sub05_08_01_08_02.do"
  },
  {
   "id": "tips-6a6a4174",
   "category": "장학금·지원금",
   "name": "인문100년 장학금",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "인문·사회계열 1학년 신입생이나 3학년만 신청 가능\n학점이 높거나 고등학교 성적이 좋았던 신입생은 꼭 신청\nⅠ유형: 등록금 전액 + 생활비 학기당 250만원, Ⅱ유형: 등록금 전액\n기초수급자는 유형 상관없이 생활비 250만원"
  },
  {
   "id": "tips-2c2ca36c",
   "category": "장학금·지원금",
   "name": "청년월세 지원",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "충주시 청년월세 지원: 만 19~34세, 부모와 따로 사는 무주택 청년, 전입신고 필수\n실제 월세 범위에서 월 최대 20만 원, 최대 24개월\n복지로 또는 주소지 행정복지센터에서 신청 (2026년 신청은 3.30~5.29로 마감)\n국가 주거안정장학금과 중복 불가\n문의: 충주시 건축과 043-850-6422\n참고: https://www.chungju.go.kr/youth/?menu=29"
  },
  {
   "id": "tips-7398a485",
   "category": "교통",
   "name": "999번 버스·시내버스",
   "location": "교내 정류장: 인문사회대 앞 / 대학본부 앞 / 체육관 앞 / 대학로쪽",
   "map": [],
   "recommend": 7,
   "note": "학교 안까지 들어오는 버스는 999번 → 교내 이동, 시내·충주역·터미널 갈 때 편함\n999번 경로: 한국교통대 → 교통대정문 → 달천 → 건대사거리 → 충주역 → 터미널\n999번은 토요일·휴일·방학에는 운행 안 함\n시간표: 교내 모든 정류장에 부착, 에브리타임에서 \"999\" 검색 (700번·999번 시간표 확인)\n999번이 없을 땐 농협 하나로마트 맞은편 정류장에서 100번대 (학교 → 터미널 → 호암동 방향)\n신연수동은 터미널·시내에서 300번대로 환승 (360번대는 신연수동 안 감, 300번대 정류장이 따로 있으니 노선표 확인)\n통학생: 100번대는 하나로마트 맞은편·정문에 서므로 과 건물이 높으면 터미널에서 999번으로 환승 추천\n점심시간 배차가 적으니 시간표를 잘 짜기\n충주 버스는 시간을 잘 안 지킴 → 카카오맵에 정류장 저장해 실시간 확인\n캠퍼스 안까지 들어오는 999번 버스 이용"
  },
  {
   "id": "tips-7fa6eeac",
   "category": "교통",
   "name": "교통대시외버스정류소 (고속·시외버스)",
   "location": "충북 충주시 대소원면 만정리 160-4",
   "map": [
    "https://naver.me/5GhgHbJV"
   ],
   "recommend": 4,
   "note": "대학로 파리바게뜨·하나로마트에서 도로 따라 조금 걸으면 있음\n경기권·서울 방면 고속·시외버스 탑승, 터미널에 안 가도 \"교통대\" 출발·도착 가능\n예약은 모바일 앱 권장 (티머니고 등)\n출발 시간보다 보통 5분, 평균 10분 늦게 도착 (센트럴·강변 방향)\n금요일 출발은 일주일 전 예약 권장 (금·일요일 서울↔충주 버스는 일주일 전부터 대부분 매진)\n금 13~14시, 금요일 제외 평일 18:25 버스는 교수님들과 동행 가능성\n다른 메모의 위치 표기: 교통대1 정류소 / 교통대2 정류소 (정확한 위치는 현장 확인 전)\n교통대1 정류소 출발 (충주공용버스터미널 시간표, 2026-07-01 기준)\n동서울: 08:05, 08:15, 09:05, 13:45, 14:05, 15:05, 16:35, 16:45, 19:35, 20:25\n강남(센트럴): 09:10, 11:10, 13:40, 16:10, 18:25\n청주: 11:20, 12:10, 14:10, 16:48, 18:50 / 수원: 10:45, 16:15 / 안산·인천: 08:35, 13:25, 17:35 (목·금·토·일·월 운행)\n교통대2 정류소: 제천행 18:30\n2026-10-01부터 고속·시외버스 요금 9% 인상\n참고: http://www.cjterminal.co.kr/bbs/board.php?bo_table=b5x1&wr_id=142"
  },
  {
   "id": "tips-efe0248b",
   "category": "교통",
   "name": "이동수단 팁 (렌트·투루카)",
   "location": "",
   "map": [],
   "recommend": 2,
   "note": "충주는 버스 노선이 부족해 환승이 많고 정류장까지 10분은 걸어야 함\n공강 때 동기·연인과 멀리 놀러 가려면 렌트 추천 (안전운전)\n면허가 있으면 투루카 앱으로 간단히 차를 빌려 이용 (투루카 차량: 도서관 앞)"
  },
  {
   "id": "tips-6b9ffd2c",
   "category": "교통",
   "name": "점심시간 주차 팁",
   "location": "종합강의동·학생회관 근처",
   "map": [],
   "recommend": 1,
   "note": "평소엔 주차 자리가 잘 안 나지만, 점심시간엔 교직원들이 밥 먹으러 가서 자리가 많은 편"
  },
  {
   "id": "tips-bde50ef3",
   "category": "교통",
   "name": "주말에 학교에서 터미널 가기",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "999번·700번 대학순환 버스는 주말·공휴일·방학 미운행, 통학버스도 학기 중에만 운행\n주말엔 신니방면 시내버스(151·152·154·157·159·171·172)나 서충주 노선 111·112 이용 (교통대·충주역·터미널 경유)\n시간표에서 노란 칸 편은 주말 미운행\n요금 일반 1,700원, 교통카드 50원 할인, 40분 안에 2회까지 무료 환승\n참고: https://www.chungju.go.kr/www/contents.do?key=598 (충주시청 시내버스, 2026.08.10 수정)"
  },
  {
   "id": "tips-122de922",
   "category": "교통",
   "name": "충주공용버스터미널 (인천공항행 시외버스)",
   "location": "충북 충주시 봉계1길 49 (롯데마트 충주점)",
   "map": [
    "https://map.naver.com/p/entry/place/11625338"
   ],
   "recommend": 1,
   "note": "터미널과 롯데마트 충주점이 한 건물\n셔틀·시내버스로 이동 후 인천공항 직통 리무진 탑승\n방학 출국 시즌엔 일찍 매진 → 버스타고(Bustago) 앱 사전 예매 필수"
  },
  {
   "id": "tips-0af2993d",
   "category": "교통",
   "name": "카카오맵으로 버스 시간 보기",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "네이버지도는 버스 시간이 잘 안 맞고 카카오맵이 정확한 편\n네이버지도만 믿고 시내에 나가면 당황할 수 있음"
  },
  {
   "id": "tips-dff7865a",
   "category": "교통",
   "name": "택시 할증 할인",
   "location": "",
   "map": [],
   "recommend": 4,
   "note": "대학로↔시내 택시 탈 때 학생증 보여주면 시외할증 제외\n교통대 앱 모바일 학생증으로도 가능하다는 메모가 있지만, 실물 학생증을 요구하는 기사가 많아 실물 학생증 추천\n택시 탈 때 교통대 모바일 학생증을 보여주면 시외할증 면제"
  },
  {
   "id": "tips-212a3d41",
   "category": "교통",
   "name": "통학버스·무료 셔틀버스",
   "location": "한국교통대(회차지) ↔ 충주터미널·충주역",
   "map": [
    "https://naver.me/x52uZuee"
   ],
   "recommend": 4,
   "note": "한국교통대(회차지)에서 셔틀 탑승\n충주터미널·충주역 노선은 무료, 교통대 직통이고 캠퍼스 안을 돌며 중간중간 내려줌\n시간(원문 그대로): (터미널)09:35 → (충주역)09:40 → (캠퍼스)09:50 / (캠퍼스)17:50 → (충주역)17:30 → (터미널)17:40\n청주가경·이천 부발역 노선은 편도 3,500원, PAYCO 모바일 승차권으로 결제\n학기 중에만 운행 (1학기 3/3~6/19, 2학기 9/1~12/21), 방학 중 운행 없음\n출처: 교통대 통학버스 안내\n청주가경 노선: 등교 청주가경터미널 07:15 → 신흥고 07:45 → 캠퍼스 08:45~08:53 / 하교 캠퍼스 18:10 → 신흥고 19:00 → 터미널 19:25\n이천 부발역 노선: 등교 부발역 07:50 → 캠퍼스 08:36~08:45 / 하교 캠퍼스 18:10 → 부발역 18:50\n충주터미널·충주역 노선(무료): 등교 터미널 08:37 → 충주역 08:40 → 캠퍼스 08:55~09:05 / 하교 캠퍼스 17:50~18:00 → 충주역 18:25 → 터미널 18:30\n문의: 043-841-5114"
  },
  {
   "id": "tips-f851a719",
   "category": "학사·학교생활",
   "name": "교내 와이파이 연결",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "학생은 WI_KNUT 접속 → \"무선 등록 신청 페이지\"에서 아이디·비밀번호 입력 → 기기 재시작 (방문객 안내에는 Wi-KNUT로 표기)\n중앙도서관·종합강의관·학생회관에서는 KNUT_5G(5G 시범 운영)도 무료\n다른 대학에선 eduroam: 아이디 학번@ut.ac.kr, 비밀번호는 종합정보시스템 비밀번호\n문의: 전산정보원 043-849-1800\n참고: https://www.ut.ac.kr/kor/sub06_03_03_02.do"
  },
  {
   "id": "tips-2c7767f0",
   "category": "학사·학교생활",
   "name": "군휴학",
   "location": "",
   "map": [
    "https://naver.me/xOdMfdXy"
   ],
   "recommend": 1,
   "note": "절차: 담당 교수님과 상담 → 학생과에 군휴학 접수 → 완료\n주의: 담당 교수님 상담 필수\n확인한 날이 2020-08로 오래된 정보"
  },
  {
   "id": "tips-f381debc",
   "category": "학사·학교생활",
   "name": "동아리 신청",
   "location": "",
   "map": [],
   "recommend": 5,
   "note": "학기 초 3월·9월 초중반 통합정보시스템으로 신청, DM 등으로 미리 면담하기도 함\n다른 학생과 접점이 적으니 하는 것 추천\n추천: 사랑방(연극 동아리) - 40년 역사, 배우·조명·음향·무대 제작 등 다양한 팀, 전문 지식 없어도 됨 (진지한 마음가짐과 시간 필요)\n통합정보시스템 → 학생지원 → 동아리가입신청 → 동아리 회장 승인\n충주캠퍼스 중앙동아리: 체육 9, 봉사 4, 종교 1, 문예 10, 학술 3 (학교 홈페이지 기준, 연도 표기 없음)\n중앙동아리 소개는 총동아리연합회 \"여정\" 인스타에서 확인\n총동아리연합회: 043-841-5550\n면접 예상 질문: 고른 이유, 매주 모임 참석 가능 여부, 관련 경험, 해 보고 싶은 활동, 팀 갈등 대처\n고르는 기준: 모임 시간이 시간표와 맞는지, 회비·MT 비용, 진로와 연결되는지\n참고: https://www.ut.ac.kr/kor/sub06_01_02_01.do"
  },
  {
   "id": "tips-fc37cb84",
   "category": "학사·학교생활",
   "name": "모바일 학생증",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "학교 앱 \"한국교통대학교 스마트모바일\"에 학번 로그인 → 스마트서비스 → 모바일학생증\n도서관 출입·대출·좌석예약에 사용\n위변조 방지로 2분마다 새로 생성\n참고: https://www.ut.ac.kr/kor/sub06_03_02.do"
  },
  {
   "id": "tips-34455509",
   "category": "학사·학교생활",
   "name": "수강신청",
   "location": "",
   "map": [],
   "recommend": 4,
   "note": "통합정보시스템에서 필수 전공·교양과 필요 학점 확인\n예비수강신청 기간에 실전처럼 미리 등록해 두기\n못 들으면 안 되는 과목은 학과사무실·지도교수님과 미리 상담\n경쟁이 가장 센 교양을 첫 클릭으로, 장바구니에 1순위 바로 아래 같은 시간대 차선책\n유선 PC 메인, 휴대폰은 로그인만 한 백업, 서버 시간 맞추기\n못 잡은 과목은 수강정정 첫날 아침에 빈자리가 자주 남\n수강신청 사이트: https://sugang.ut.ac.kr\n장바구니에 담기만 하면 신청 아님, 최종 수강신청 기간에 \"신청\"을 눌러야 확정\n최근 로그인한 기기 1대만 사용 가능\n정원 찬 과목에 취소가 생기면 대기 교과목 → 11:00, 17:00 이후 신청 가능\n자신 없으면 PC방에서 하기, 네이버에 \"사이트 시간\" 검색해 서버 시간 맞추기\n1학년 때 필수교양·융기초 과목을 최대한 들어 두기\n포털 \"졸업생자가진단\"에서 꼭 들어야 할 전필·필수교양 확인\n참고: https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000055/selectBoardArticle.do?nttId=1123293 (2026-07-21 학사공지)"
  },
  {
   "id": "tips-1aab688b",
   "category": "학사·학교생활",
   "name": "술자리에서 살아남기",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "요즘은 술 강요 문화가 거의 없어 주량대로 적당히 마시면 됨\n강요하는 사람이 있으면: 글라스를 가득 채워 짠은 계속하되 실제로는 소주잔보다 적게 마시고, 바로 채우는 척해 늘 풀잔 유지\n이후 술자리에서는 강요하는 사람과 같이 앉지 않기"
  },
  {
   "id": "tips-95276b24",
   "category": "학사·학교생활",
   "name": "일본어 회화 수업·일본 교환학생",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "1~2학년 때 일본어 회화 수업 듣고 관심 있으면 일본 교환학생 도전\n교수님께 유의점·팁을 들을 수 있음\n3~4학년 때는 교환학생 가기 시기상 애매할 수 있음"
  },
  {
   "id": "tips-af311e4d",
   "category": "학사·학교생활",
   "name": "재수강",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "C+ 이하 또는 NP 과목만 가능, 성적은 최대 A0\n학기당 6학점, 재학 중 12학점까지 (F 과목은 제한 없음), 같은 과목은 3회까지\n재수강하면 예전 성적 무효, 그래도 그 학기 학사경고는 남음\n참고: 학사운영 규정 제54조의2, 제81조의2, 제94조 (2026-02-26 개정)"
  },
  {
   "id": "tips-561a2648",
   "category": "학사·학교생활",
   "name": "졸업생 취업 통계",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "2024년 졸업생 취업률 66.5% (전국 4년제 평균 62.4%), 국립대 1위\n유지취업률 83.6%, 건강보험 직장가입자 비중 92.1% (전국 평균 87.8%)\n학과별 취업률은 대학알리미(https://www.academyinfo.go.kr)에서 확인\n출처: 중도일보 2026.01.19"
  },
  {
   "id": "tips-cc6b9d79",
   "category": "학사·학교생활",
   "name": "졸업요건",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "졸업학점은 130학점 이상에서 학과별로 다름 (학칙 제74조), 학교 안내의 \"140학점\"은 예전 내용일 수 있으니 학과 교육과정표 확인\n총 평점평균 1.75 이상\n2019학번 이후는 졸업자격인증(글로컬·전인적·창의) 3개 필수, 전인적 인증은 비교과 프로그램 40시간\n참고: https://www.ut.ac.kr/kor/sub05_08_01_02_06.do"
  },
  {
   "id": "tips-49a9a3a0",
   "category": "학사·학교생활",
   "name": "출석인정 신청",
   "location": "종합강의동(W5) 1층 학생과",
   "map": [],
   "recommend": 1,
   "note": "결석 사유가 생기면 담당 교수님께 먼저 말씀드리기\n결석사유서와 증빙을 학과사무실에 내고 지도교수·학과장 날인 → W5 1층 학생과 제출\n사유 발생 후 1주 안에 내는 것 권장, 기말고사 기간 안에는 꼭 신청\n출석 인정은 수업일수의 4분의 1까지, 예비군 훈련은 반드시 인정\n안내 공지가 2023-03-10 것이라 제출처 재확인 권장\n참고: https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000390/selectBoardArticle.do?nttId=1059410"
  },
  {
   "id": "tips-b4594f76",
   "category": "학사·학교생활",
   "name": "통합정보시스템·UTRO 매일 확인",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "학사·일반·장학·행사·취업 공지와 UTRO를 매일 보면 장학금, 해외봉사단 같은 행사 정보를 쉽게 확인"
  },
  {
   "id": "tips-c64e34f4",
   "category": "학사·학교생활",
   "name": "학교 문의 전 홈페이지 검색",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "조교님이나 학교에 전화하기 전에 학교 홈페이지에서 먼저 검색하고 질문하기"
  },
  {
   "id": "tips-c3b28311",
   "category": "교내 이용시설",
   "name": "NH농협은행 출장소",
   "location": "종합강의관(W5) 1층",
   "map": [
    "https://map.naver.com/p/entry/place/13409634"
   ],
   "recommend": 2,
   "note": "평일 09:00~16:00 (일찍 마감하니 공강 활용)\n외국인 유학생 계좌 개설: 외국인등록증·여권·표준입학허가서 지참 → 학생증 체크카드·입출금 통장\n기숙사비·아르바이트 급여에 한국 계좌가 필요하니 개강 첫 주 방문 권장\n참고: https://www.ut.ac.kr/kor/sub06_02_01_01.do"
  },
  {
   "id": "tips-4d09771c",
   "category": "교내 이용시설",
   "name": "강의실·세미나실 빌리기",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "학교 홈페이지 시설물예약: https://www.ut.ac.kr/prog/fcltsRental/kor/sub06_04_03/list.do\n시설별 담당부서·연락처: https://www.ut.ac.kr/kor/sub06_04_02_01.do"
  },
  {
   "id": "tips-96434668",
   "category": "교내 이용시설",
   "name": "국원피트니스클럽 (교내 헬스장)",
   "location": "학생회관(E6) 1층",
   "map": [
    "https://map.naver.com/p/entry/place/17792159"
   ],
   "recommend": 3,
   "note": "월 이용료 20,000원 고정 (다른 메모: 이용료 확인 못 함)\n학기 초 학생회관 안내데스크에서 등록·결제\n전용 실내 운동화 필수\n러닝머신·웨이트 기구, 탈의실·샤워실\n월~금 09:00~21:00\n참고: https://www.ut.ac.kr/kor/sub06_02_01_01.do\n러닝머신이 많음\n월 2만원으로 저렴\n2022년엔 괜찮았지만 2026년 기준은 모름"
  },
  {
   "id": "tips-9a935419",
   "category": "교내 이용시설",
   "name": "국제교류본부 (외국인등록증 발급·체류 연장)",
   "location": "국제청년협력센터 E18동 (경영항공관 E7동 맞은편)",
   "map": [],
   "recommend": 1,
   "note": "입국 후 90일 이내 외국인등록 필요, 국제교류본부에 서류 제출하면 담당 선생님이 대신 신청\n재학증명서·기숙사 거주증명서 등 필요 서류는 국제교류본부에서 안내\n체류 만료 최소 2개월 전부터 하이코리아에서 연장 일정 확인 (불법체류 과태료 방지)"
  },
  {
   "id": "tips-dc37341c",
   "category": "교내 이용시설",
   "name": "대학원 건물 앞 ATM",
   "location": "충북 충주시 대소원면 대학로 50 (대학원 건물 앞)",
   "map": [
    "https://naver.me/x3cCYLd0"
   ],
   "recommend": 3,
   "note": "신한·국민 ATM이 있음 (농협은 종합강의관과 대학로에도 있음)\n입출금·통장정리 가능, 밖에 안 나가도 돼서 편함"
  },
  {
   "id": "tips-bf12cd2a",
   "category": "교내 이용시설",
   "name": "보건실",
   "location": "대학본부 1층",
   "map": [
    "https://naver.me/55PRULTi"
   ],
   "recommend": 3,
   "note": "09:00~18:00 (점심시간 12:00~13:00은 피해서 이용)\n전화: 043-841-5024\n간단한 질환은 무료로 치료·투약 (간단한 약 처방)\n혈압·혈당·체성분 측정 가능\n참고: https://www.ut.ac.kr/kor/sub06_02_03.do\n한 파일의 이름 표기: 한국교통대학교 충주캠퍼스대학본부 보건소"
  },
  {
   "id": "tips-6eb7ef6c",
   "category": "교내 이용시설",
   "name": "우체국 (택배·우편)",
   "location": "종합강의관(W5) 1층",
   "map": [
    "https://naver.me/5FE4rlSg"
   ],
   "recommend": 6,
   "note": "우편취급국, 우편물·소포(택배) 접수·발송\n09:00~18:00 (점심시간 12:00~13:00)\n우체국 업무 외 잡다한 업무도 가능\n당일 보내거나 받아야 하는 택배는 충주 터미널 택배도 가능 (노선이 있으면)\n참고: https://www.ut.ac.kr/kor/sub06_02_01_01.do"
  },
  {
   "id": "tips-58af11ab",
   "category": "교내 이용시설",
   "name": "자동증명발급기",
   "location": "종합강의관(W5) 1층 정문 쪽",
   "map": [
    "https://naver.me/xOdMfdXy"
   ],
   "recommend": 3,
   "note": "학교 관련 증명서 발급, 수수료 무료\n온라인 발급도 무료 (전자증명서로 받으면 수수료 별도)\n24시간\n문의: 학사관리과 043-841-5671~2\n참고: https://www.ut.ac.kr/kor/sub05_08_01_04_06.do"
  },
  {
   "id": "tips-b2290370",
   "category": "교내 이용시설",
   "name": "중앙도서관",
   "location": "충북 충주시 대소원면 대학로 50 (W20)",
   "map": [
    "https://naver.me/IFEuEdnL"
   ],
   "recommend": 4,
   "note": "3층 열람실 05:00~24:00, 시험기간과 그 전 1주는 24시간 개방, 좌석배정시스템 운영\n시험기간에 3층 정독실 자리가 없으면 5층 강의실 추천 (넓고 문 열고 나가면 바람 쐴 곳 있음)\n같은 층 CU 도서관점은 밤에도 무인 운영\n도서관 사이트 로그인 후 국내·국외 논문 열람: https://chains.ut.ac.kr/guide/Static.ax?page=Sub22\n참고: https://mchains.ut.ac.kr/guide/Static.ax?page=service1"
  },
  {
   "id": "tips-016b47b1",
   "category": "교내 이용시설",
   "name": "학생상담센터",
   "location": "국제청년협력센터 3층 309호",
   "map": [],
   "recommend": 1,
   "note": "고민 상담받는 곳\n전화: 043-841-5728\n참고: https://www.ut.ac.kr/sc/sub01_04.do"
  },
  {
   "id": "tips-c6a0679b",
   "category": "교내 이용시설",
   "name": "학생회관 IDF",
   "location": "충북 충주시 대소원면 대학로 50 학생회관",
   "map": [
    "https://naver.me/5qL3k8Vq"
   ],
   "recommend": 1,
   "note": "3D프린트 등 다양한 작업을 무료로 할 수 있음"
  },
  {
   "id": "tips-80a91423",
   "category": "프린트·복사",
   "name": "예서카피",
   "location": "충북 충주시 대소원면 대학로 18",
   "map": [
    "https://naver.me/5TQYbuqn"
   ],
   "recommend": 2,
   "note": "프린트하는 곳\n친구 교재를 빌려 인쇄하면 가격이 1/3로 줄어듦"
  },
  {
   "id": "tips-7db64003",
   "category": "프린트·복사",
   "name": "인문사회관 1층 카페 안 프린터",
   "location": "인문사회관(E14) 1층 카페(블루포트) 안",
   "map": [
    "https://naver.me/FHO0SCdz"
   ],
   "recommend": 3,
   "note": "카페 안에 프린터와 컴퓨터가 있음\n프린트카드로만 결제 가능 → 종합강의관 복사실에서 미리 발급"
  },
  {
   "id": "tips-5ba34237",
   "category": "프린트·복사",
   "name": "종합강의관 1층 무인 프린터",
   "location": "종합강의관(W5) 1층 정문 쪽 (들어가자마자 오른쪽)",
   "map": [
    "https://naver.me/xOdMfdXy"
   ],
   "recommend": 6,
   "note": "컴퓨터와 프린터로 직접 출력, 흑백만 가능\n결제: 신용카드 또는 프린트카드 (카드 결제 추천, 가장 오른쪽 무인프린터는 신용카드 가능)\n24시간, 출력은 유료"
  },
  {
   "id": "tips-f609464a",
   "category": "프린트·복사",
   "name": "종합강의관 1층 복사실",
   "location": "종합강의관(W5) 1층 편의점 쪽 복도",
   "map": [
    "https://map.naver.com/p/entry/place/17792199"
   ],
   "recommend": 5,
   "note": "강의 PPT 인쇄, 과제 제본 가능\nUSB의 PDF 즉시 출력, 흑백 장당 약 50원\n컬러 인쇄 가능, 프린트카드 발급 (사장님께 요청)\n09:00~18:00\n시험 기간·과제 마감 주간 오전엔 대기 많음 → 미리 출력"
  },
  {
   "id": "tips-cccc4abb",
   "category": "프린트·복사",
   "name": "테크노관 2층 프린터",
   "location": "테크노관(E5) 2층",
   "map": [],
   "recommend": 1,
   "note": ""
  },
  {
   "id": "tips-782b1734",
   "category": "편의점·장보기",
   "name": "CU 도서관점",
   "location": "중앙도서관(W20) 3층",
   "map": [],
   "recommend": 2,
   "note": "편의점 (편의점 리스트 표기: CU 국립한국교통대도서관)\n평일 09:00~18:00 직원 근무, 그 외 24시간 무인 운영\n밤에 간식 사기 좋음\n참고: https://www.ut.ac.kr/kor/sub06_02_01_01.do"
  },
  {
   "id": "tips-8037461f",
   "category": "편의점·장보기",
   "name": "CU 종합강의관점",
   "location": "종합강의관(W5) 1층",
   "map": [],
   "recommend": 2,
   "note": "편의점 (편의점 리스트 표기: CU 한국교통대생활관점 / 다른 파일 표기: CU 강의관점)\n월~목 08:30~19:30, 금 08:30~18:00\n강의 사이 간식 사기 좋음\n참고: https://www.ut.ac.kr/kor/sub06_02_01_01.do"
  },
  {
   "id": "tips-cd2ba39a",
   "category": "편의점·장보기",
   "name": "CU 충주교통대1호점",
   "location": "국원대교 근처",
   "map": [],
   "recommend": 2,
   "note": "편의점\n프린트 가능 (프린트 리스트)"
  },
  {
   "id": "tips-1d8d1bde",
   "category": "편의점·장보기",
   "name": "CU 충주교통대대로점",
   "location": "자취방 근처",
   "map": [],
   "recommend": 1,
   "note": "편의점"
  },
  {
   "id": "tips-407a29a7",
   "category": "편의점·장보기",
   "name": "CU 한국교통대점",
   "location": "자취방 근처",
   "map": [],
   "recommend": 1,
   "note": "편의점"
  },
  {
   "id": "tips-eb75836b",
   "category": "편의점·장보기",
   "name": "CU 한국교통대학사점",
   "location": "학교 앞 자취방 근처",
   "map": [],
   "recommend": 1,
   "note": "편의점"
  },
  {
   "id": "tips-4f023f48",
   "category": "편의점·장보기",
   "name": "GS25 교통대생활관점",
   "location": "대원생활관(E16동)",
   "map": [],
   "recommend": 1,
   "note": "편의점"
  },
  {
   "id": "tips-456c59ab",
   "category": "편의점·장보기",
   "name": "GS25 교통대센터점",
   "location": "대학가 중앙",
   "map": [],
   "recommend": 2,
   "note": "편의점\n프린트 가능 (프린트 리스트)"
  },
  {
   "id": "tips-003bc8cf",
   "category": "편의점·장보기",
   "name": "GS25 충주대점",
   "location": "국원대교 근처",
   "map": [],
   "recommend": 1,
   "note": "편의점"
  },
  {
   "id": "tips-beae990a",
   "category": "편의점·장보기",
   "name": "로켓프레시로 식재료 사기",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "충주에서도 로켓프레시 서비스가 되니 식재료 구매에 활용"
  },
  {
   "id": "tips-c604bb8a",
   "category": "편의점·장보기",
   "name": "서충주농협하나로마트 만정지점",
   "location": "충북 충주시 대소원면 중원대로 3930",
   "map": [
    "https://naver.me/5oEzg1t9"
   ],
   "recommend": 2,
   "note": "대형마트\n장보기 (마트)\n시내 롯데마트·이마트는 차나 택시로 가서 장보기"
  },
  {
   "id": "tips-949b86cb",
   "category": "편의점·장보기",
   "name": "세븐일레븐 충주교통대카페점",
   "location": "국원생활관 앞",
   "map": [],
   "recommend": 1,
   "note": "편의점"
  },
  {
   "id": "tips-0cccf2be",
   "category": "편의점·장보기",
   "name": "세븐일레븐 충주교통대후문점",
   "location": "예성생활관 뒤",
   "map": [],
   "recommend": 1,
   "note": "편의점"
  },
  {
   "id": "tips-236a8143",
   "category": "편의점·장보기",
   "name": "이마트24 충주교통대점",
   "location": "명보약국 옆",
   "map": [],
   "recommend": 1,
   "note": "편의점"
  },
  {
   "id": "tips-d1e8c8c7",
   "category": "편의점·장보기",
   "name": "정문 앞 CU",
   "location": "정문 앞",
   "map": [],
   "recommend": 1,
   "note": "편의점\n프린트 가능: USB나 메일로 파일 가져가면 유료 출력\n어느 CU 지점인지 모르겠음"
  },
  {
   "id": "tips-372bdcd0",
   "category": "편의점·장보기",
   "name": "하이24 교동대1호점",
   "location": "충북 충주시 대소원면 대학촌1길 21",
   "map": [
    "https://naver.me/IgMnibGy"
   ],
   "recommend": 1,
   "note": "24시간 무인 아이스크림 할인점\n생활용품·자취용품도 판매, 밤늦게 급할 때 좋음"
  },
  {
   "id": "tips-766eb0ce",
   "category": "세탁",
   "name": "런드리라운지 교통대점",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "세탁방"
  },
  {
   "id": "tips-065a8c6c",
   "category": "세탁",
   "name": "백조 세탁소",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "세탁소\n친절하심"
  },
  {
   "id": "tips-60a7fc2a",
   "category": "세탁",
   "name": "셀프빨래방1",
   "location": "충청북도 충주시 대소원면 대학촌1길 12-12 (1층)",
   "map": [],
   "recommend": 2,
   "note": "세탁방\n프린트 리스트에도 같은 주소(1층)가 프린트 가능한 곳으로 있음"
  },
  {
   "id": "tips-4913a5c3",
   "category": "세탁",
   "name": "셀프빨래방2",
   "location": "충청북도 충주시 대소원면 대학촌1길 12-13",
   "map": [],
   "recommend": 1,
   "note": "세탁방"
  },
  {
   "id": "tips-445699b3",
   "category": "세탁",
   "name": "워시팡팡 셀프빨래방 충주교통대점",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "세탁방"
  },
  {
   "id": "tips-75ee817b",
   "category": "기숙사·자취방",
   "name": "국원생활관",
   "location": "충북 충주시 대소원면 대학로 50 국원생활관",
   "map": [
    "https://naver.me/xLsAox1z"
   ],
   "recommend": 1,
   "note": "타 기숙사보다 저렴 (50만원대)\n체력단련실: 덤벨, 렛풀다운, 펙덱머신, 벤치, 실내 자전거, 러닝머신 2대\n1층 공용공간 카페 같은 분위기, 공용 식사 공간 (전자레인지 3대, 자판기, 싱크대)\n층별 전자레인지·세탁기·건조기, 공용 샤워장·화장실\n통학하는 사람에게 추천"
  },
  {
   "id": "tips-c1f86464",
   "category": "기숙사·자취방",
   "name": "금빛원룸",
   "location": "충북 충주시 대소원면 요도천변길 254-12",
   "map": [
    "https://naver.me/51u0L9eJ"
   ],
   "recommend": 1,
   "note": "장점: 엘리베이터, 신축\n단점: 주변 편의시설 없음\n가격: 1년 280만원 (보증금 미포함, 2021년 기준)\n계약 전 요금 납부 확인 필요\n확인한 날이 2021-12-21로 오래된 정보"
  },
  {
   "id": "tips-a7e70707",
   "category": "기숙사·자취방",
   "name": "대원생활관",
   "location": "충북 충주시 대소원면 대학로 50 대원생활관",
   "map": [
    "https://naver.me/xLsAox1z",
    "https://naver.me/xoHJH6p0"
   ],
   "recommend": 1,
   "note": "1층 기숙사 식당·편의점, 2층 학습실\n체력단련실: 벤치 2대, 펙덱머신 1대, 덤벨(정리 안 됨), 러닝머신 4대, 실내자전거 3대 (국원보다 넓지만 장비 부족)\n층별 세탁기 2대, 건조기 없음, 빨래 건조대 1인 1개"
  },
  {
   "id": "tips-021755fe",
   "category": "기숙사·자취방",
   "name": "생활관 생활수칙 (벌점·외박)",
   "location": "",
   "map": [],
   "recommend": 3,
   "note": "점호 23:30, 귀사 01:00 전, 01:00~04:00 출입 통제\n벌점 8점이면 다음 학기 입사 불가, 10점이면 퇴사\n음주·실내흡연은 바로 10점, 전열기·출입카드 빌려주기 금지\n외박은 통합정보시스템에서 23:00 전 신청, 주중 외박 월 8회·1박 2일 원칙\n특별외박은 관장·사감 사전 승인과 증빙 필요, 승인 없이 안 들어오면 무단외박\n출처: 충주생활관 생활수칙, 외박 안내\n점호 23:30, 귀사 01:00 전 (이후 들어오면 벌점), 외박 신청은 23:00 전\n점호 때 방에 없으면 무단외박\n전열기·음주·실내흡연·외부인 동행 금지\n벌점 5점 경고, 8점 이상 다음 학기 입사 불가, 10점 이상 퇴사 (재입사 불가)\n항목별 벌점표는 확인 못 함\n문의: 충주생활관 행정실 043-841-5906\n참고: https://www.ut.ac.kr/dorm/sub01_03_03.do"
  },
  {
   "id": "tips-86993dec",
   "category": "기숙사·자취방",
   "name": "아이파크원룸",
   "location": "충북 충주시 대소원면 하검단2길 66-4",
   "map": [
    "https://naver.me/GRDZduOq"
   ],
   "recommend": 1,
   "note": "후문 쪽 원룸\n연세 200만원, 가격이 장점"
  },
  {
   "id": "tips-4e56022a",
   "category": "기숙사·자취방",
   "name": "자취방 계약 전 체크",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "등기부등본으로 집주인·근저당 확인\n관리비에 인터넷·수도 포함인지 확인\n전입신고·확정일자 바로 받기\n밤에 한 번 더 가서 소음·가로등 확인\n평면도·시세는 직방(https://www.zigbang.com), 다방(https://www.dabangapp.com)에서 \"대소원면\" 검색"
  },
  {
   "id": "tips-a37548bf",
   "category": "할인·혜택",
   "name": "배달비 아끼기",
   "location": "",
   "map": [],
   "recommend": 2,
   "note": "교통대 주변은 배달비가 있고 할인도 잘 안 해 줌 → 직접 가서 포장 추천\n네이버 멤버십 가입하면 요기요 패스 무료 → 배달비 무료 (안 되는 가게도 있음)"
  },
  {
   "id": "tips-bb0ab5c8",
   "category": "할인·혜택",
   "name": "병원비 할인 (협약 병원)",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "서울W치과병원: 재학생 비보험수가 전 항목 15% 할인\n세명대 충주한방병원: 재학생 비보험 수가 20% 할인 (녹용 포함 시 10%)\n충주의료원: 진료비 20% 할인 (본인부담액 중 비급여 항목, 재료비·주사약제료 제외)\n가기 전에 협약이 유효한지 병원에 확인\n참고: https://www.ut.ac.kr/kor/sub06_02_03.do"
  },
  {
   "id": "tips-d76b9e44",
   "category": "할인·혜택",
   "name": "생성형 AI 플랫폼 무료 사용",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "통합정보시스템에서 생성형 AI 플랫폼을 무료로 사용 가능"
  },
  {
   "id": "tips-ff15df68",
   "category": "할인·혜택",
   "name": "전공책 싸게 사기 (e-서점·에브리타임 장터)",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "새 책은 학기당 기본 5~8만원\n에브리타임 장터게시판이나 e-서점 이용하면 30% 이상 싸게 구할 수 있음\n매물이 없으면 새 책 구입"
  },
  {
   "id": "tips-c72f2912",
   "category": "할인·혜택",
   "name": "지역화폐 (충주사랑상품권)",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "충주사랑상품권 앱에서 가입·충전 후 결제하면 충전 시 인센티브 10%\n대학로 매장 대부분 결제 가능"
  },
  {
   "id": "tips-639258ff",
   "category": "할인·혜택",
   "name": "천원의 아침밥",
   "location": "종합강의동 CU (PAYCO 이용 시)",
   "map": [],
   "recommend": 2,
   "note": "매 학기 진행, 참여 방법·기간은 통합정보시스템 행사 공지에서 확인\nPAYCO로 천 원 내고 아침밥 구매"
  },
  {
   "id": "tips-05de1018",
   "category": "할인·혜택",
   "name": "한글·V3·Office 무료 사용",
   "location": "대학원동 302호 (전산정보원)",
   "map": [],
   "recommend": 1,
   "note": "전산정보원에서 한글(2018~2024), V3 Campus Pack, 알툴즈 CD 대여\nOffice 365는 재학생 무료 (학교 홈페이지 하단 OFFICE 365 메뉴)\nAdobe CC는 공용 PC실습실에서만 사용 가능\n참고: https://www.ut.ac.kr/cc/sub03_01.do"
  }
 ],
 "hidden": [
  {
   "id": "hidden-42808d9a",
   "category": "캠퍼스 지름길",
   "name": "ICT관 가는 길 (대학본부 엘리베이터)",
   "location": "대학본부 건물",
   "map": [
    "https://naver.me/55PRULTi",
    "https://naver.me/FUiC6tEB"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 2,
   "note": "대학본부 엘리베이터를 타고 대학본부 로비에서 내려 거기서부터 걷기\n\"ICT관 지름길\" 파일은 지도 링크만 있음 (두 번째 지도)"
  },
  {
   "id": "hidden-4fa236e6",
   "category": "캠퍼스 지름길",
   "name": "인사대 가는 길 (건축관·건설환경관 엘리베이터)",
   "location": "충북 충주시 대소원면 대학로 50 한국교통대학교 충주캠퍼스 건축관 (후문 쪽)",
   "map": [
    "https://naver.me/xAAUmpqR",
    "https://naver.me/5f5nVIPK"
   ],
   "checkedAt": "2026-8",
   "price": "",
   "recommend": 4,
   "note": "인문사회관 올라가는 길이 오르막이 심함\n건축관 엘리베이터를 타고 3층에서 내려서 가면 훨씬 편함\n24시간 이용\n인사대는 캠퍼스에서 가장 높은 곳 (필수교양 실무영어 수강 시 필요)\n올라가다가 건설환경관으로 들어가 엘리베이터를 타면 거리가 조금 줄어듦"
  },
  {
   "id": "hidden-f2266bf1",
   "category": "산책·러닝",
   "name": "건설환경관~스마트ICT 중앙 고가길",
   "location": "건설환경관과 스마트 ICT까지 가는 차도 옆 인도길",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "밤에 펜스 전등이 켜져 둘이 걷기 좋음\n선선한 날 가벼운 외투 들고 걷기 좋음\n나무데크와 나무가 많아 숲길 같은 느낌"
  },
  {
   "id": "hidden-ddf8556a",
   "category": "산책·러닝",
   "name": "교통대 둘레길",
   "location": "한국교통대학교 충주캠퍼스 정문 출발 (테크노관 → 스마트ICT관 → 생활관 → IT관 → 대학원 → 정문)",
   "map": [
    "https://naver.me/xXwnwCdy"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "순환형 산책 코스, 약 3.26km\n빠르게 걸으면 약 1시간\n운동과 산책을 함께 하기 좋음\n교내 안내판 기준 8개 구간\n1구간 국원길 320m (5분) / 2구간 웅비길 670m (15분) / 3구간 해찬솔길 400m (7분) / 4구간 비상길 510m (8분)\n5구간 꽃내음길 320m (8분) / 6구간 중예길 310m (5분) / 7구간 가온길 620m (9분) / 8구간 온새미로길 850m (10분)"
  },
  {
   "id": "hidden-814d73fd",
   "category": "산책·러닝",
   "name": "교통대 러닝코스",
   "location": "충북 충주시 중앙탑면 창동리 74-3",
   "map": [],
   "checkedAt": "2026-10",
   "price": "",
   "recommend": 1,
   "note": "오른쪽 하천, 왼쪽 도로 (뛰는 공간엔 차 진입 불가)\n총 1.5km, 왕복 3km\n300m도 안 되는 학교 트랙보다 장거리 러닝에 좋음"
  },
  {
   "id": "hidden-af6766f4",
   "category": "산책·러닝",
   "name": "대운동장 스탠드 및 트랙",
   "location": "대운동장(W19) 관람석 및 트랙",
   "map": [
    "https://map.naver.com/p/entry/place/1867870762"
   ],
   "checkedAt": "2026-10-07",
   "price": "무료",
   "recommend": 1,
   "note": "다양한 국적 유학생들이 축구·농구·조깅\n18시 이후 조명\n스탠드 관람석은 공강 휴식 장소"
  },
  {
   "id": "hidden-d9c28e45",
   "category": "산책·러닝",
   "name": "대원생활관 뒷길",
   "location": "충북 충주시 대소원면 대학로 50 (대원생활관 뒤쪽)",
   "map": [
    "https://naver.me/xLN9zRcK"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "쭉 펼쳐진 길, 사람·차 적어 조용히 걷기 좋음\n주변에 아무것도 없어 무서움 → 썸 탈 때 가기 좋음\nE15동 앞 야경까지 감상\n친구·연인·혼자 모두 좋음\ntxt의 이름 표기: 대원생활관 뒷길 / 분위기 좋은 산책 코스"
  },
  {
   "id": "hidden-f462174d",
   "category": "산책·러닝",
   "name": "대학본부 뒤 산책길",
   "location": "한국교통대학교 충주캠퍼스 대학본부 뒤 (건설환경관 방향)",
   "map": [
    "https://naver.me/55PRULTi"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "평지 위주, 양옆 나무\n수업 사이 가볍게 걷거나 조용히 쉬기 좋음\n계절별 꽃·초록 풍경, 사진 찍기 좋음"
  },
  {
   "id": "hidden-abed23a3",
   "category": "산책·러닝",
   "name": "러닝코스",
   "location": "충청북도 충주시 중앙탑면 창동리 43-6",
   "map": [
    "https://naver.me/GZDBRThY"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "강 따라 왕복 3km 조금 안 됨\n저녁에 달리기 좋음\n학교에서 출발해 왕복 후 복귀하면 약 6.5km"
  },
  {
   "id": "hidden-036400ad",
   "category": "산책·러닝",
   "name": "스마트 ICT관 뒷 산책길",
   "location": "학군단 건물 옆 숲길",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "밤에 친구들과 가면 담력체험\n낮에 혼자 걸으면 숲길 느낌"
  },
  {
   "id": "hidden-0a387419",
   "category": "산책·러닝",
   "name": "악어봉",
   "location": "충북 충주시 살미면",
   "map": [
    "https://map.naver.com/p/search/%EC%95%85%EC%96%B4%EB%B4%89/place/1316246950?c=15.00"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "txt의 이름 표기: 악아봉\n왕복 1시간 반 정도\n정상 경치가 아주 좋음"
  },
  {
   "id": "hidden-207e27d3",
   "category": "산책·러닝",
   "name": "요도천변길 산책",
   "location": "충청북도 충주시 대소원면 검단리 120-2",
   "map": [
    "https://naver.me/5hocKGPL"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "너무 멀리 가면 가로등이 없어 무서움\n적당히 어둡고 별이 잘 보이는 산책 코스"
  },
  {
   "id": "hidden-e2039dd7",
   "category": "산책·러닝",
   "name": "인사대 옆 숲길",
   "location": "인사대 옆 (교통대 둘레길 코스 중 하나)",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "둘레길 코스로 산책길이 나 있음"
  },
  {
   "id": "hidden-3c7a8466",
   "category": "산책·러닝",
   "name": "충주종합운동장 보조경기장",
   "location": "충북 충주시 대림로 85",
   "map": [
    "https://map.naver.com/p/entry/place/1479231076?c=16.63,0,0,0,dh&placePath=%2Fhome%3Ffrom%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202610061950%26locale%3Dko%26svcName%3Dmap_pcv5"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "훌륭한 러닝 트랙, 한 바퀴 400m, 6레인\n저녁·밤(6~10시) 러닝하는 사람 꽤 있음"
  },
  {
   "id": "hidden-a52da37d",
   "category": "산책·러닝",
   "name": "학교 내 산책길",
   "location": "",
   "map": [
    "https://naver.me/Fx2WyHhg"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "길을 따라 걸으면 좋음"
  },
  {
   "id": "hidden-4aa48579",
   "category": "산책·러닝",
   "name": "호암지",
   "location": "충청북도 충주시 호암동 653-3",
   "map": [
    "https://naver.me/GqfS5get"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "약 4km 둘레 호수공원\n러닝 코스로 괜찮음 (두 바퀴 약 6km라는 메모도 있음)\n숨은 장소는 아니지만 산책하기 지겹지 않음"
  },
  {
   "id": "hidden-f503f309",
   "category": "산책·러닝",
   "name": "이름 미정",
   "location": "충청북도 충주시 대소원면 검단리 산21-8",
   "map": [
    "https://naver.me/5wrFX4ce"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "txt 파일명: 달천러닝코스\nCU 한국교통대학사점 출발 → 탄금교 들어가기 전까지 약 3km"
  },
  {
   "id": "hidden-1d6222b7",
   "category": "산책·러닝",
   "name": "이름 미정",
   "location": "충청북도 충주시 대소원면 검단리 73-14",
   "map": [
    "https://naver.me/xYN7qQ3l"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "txt 파일명: 산책로\n입구~하검단교 약 1km, 지나서도 길이 이어짐\n가로등이 거의 없어 밤에 어두움 → 둘 이상 추천\n맑은 날 밤 별이 잘 보임"
  },
  {
   "id": "hidden-30ce3816",
   "category": "야경·노을",
   "name": "충주야경",
   "location": "충청북도 충주시 대소원면 검단리 산21-26",
   "map": [
    "https://naver.me/xQJ4FKrq"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "가파른 오르막길을 올라가면 맑은 공기"
  },
  {
   "id": "hidden-417965a0",
   "category": "야경·노을",
   "name": "한국교통대학교 충주캠퍼스 주차장",
   "location": "충북 충주시 대소원면 대학로 50",
   "map": [
    "https://naver.me/FTMNt0be"
   ],
   "checkedAt": "2026-10-07",
   "price": "",
   "recommend": 1,
   "note": "인사대에서 이쪽으로 걸어가면 학곡산이 나옴\n노을 질 때 예쁨"
  },
  {
   "id": "hidden-659a73cf",
   "category": "야경·노을",
   "name": "이름 미정",
   "location": "충청북도 충주시 대소원면 대학로 50",
   "map": [
    "https://naver.me/Fz8iLbxK"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "txt 파일명: 야경맛집\n충주 시내가 한눈에 보여 밤에 예쁨"
  },
  {
   "id": "hidden-f1a08654",
   "category": "벚꽃 명소",
   "name": "벚꽃길",
   "location": "충청북도 충주시 대소원면 대학로 50",
   "map": [
    "https://naver.me/GZDBRXG7"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": ""
  },
  {
   "id": "hidden-be3e511f",
   "category": "벚꽃 명소",
   "name": "인문사회관 벚꽃길",
   "location": "한국교통대학교 충주캠퍼스 인문사회관으로 올라가는 길",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "봄철 벚꽃 사진 명소\n오르막길이라 다소 힘듦"
  },
  {
   "id": "hidden-eb41c64e",
   "category": "벚꽃 명소",
   "name": "하방마을 벚꽃길",
   "location": "충청북도 충주시 봉방동 517-1",
   "map": [
    "https://naver.me/FgEILHWJ"
   ],
   "checkedAt": "2025-03-20",
   "price": "",
   "recommend": 1,
   "note": "양쪽 벚꽃나무 행렬이 500m 이상"
  },
  {
   "id": "hidden-df56d0a0",
   "category": "벚꽃 명소",
   "name": "하방마을회관",
   "location": "충북 충주시 하방1길 61",
   "map": [
    "https://naver.me/5gFt5Dqt"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "학교에서 그나마 가까운 벚꽃 나무 길\n시내에서 데이트하고 싶을 때 추천"
  },
  {
   "id": "hidden-7648dcce",
   "category": "데이트·나들이",
   "name": "낚시 스팟",
   "location": "충청북도 충주시 칠금동 523",
   "map": [],
   "checkedAt": "2026-4",
   "price": "",
   "recommend": 1,
   "note": "민물고기가 생각보다 잡힘, 물가라 시원함\n낚싯대 필요, 낚시 좋아하거나 입문하는 친구들에게 추천\n조금 냄새가 남"
  },
  {
   "id": "hidden-86e1f071",
   "category": "데이트·나들이",
   "name": "드라이브 가기 좋은 장소",
   "location": "충북 충주시 중앙탑면 중앙탑길 251 ~ 충북 충주시 동량면 미라실로 689-1 캠핑808",
   "map": [
    "https://naver.me/x3cOiagj",
    "https://naver.me/5EUZytb5"
   ],
   "checkedAt": "2026-03-19",
   "price": "",
   "recommend": 1,
   "note": ""
  },
  {
   "id": "hidden-9caa4ce2",
   "category": "데이트·나들이",
   "name": "중앙탑 (충주 탑평리 칠층석탑)",
   "location": "충북 충주시 중앙탑면 탑평리 11",
   "map": [
    "https://map.naver.com/p/search/%EC%A4%91%EC%95%99%ED%83%91/place/20099075?c=15.00"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": "중앙탑 근처 산책하고 구경하기"
  },
  {
   "id": "hidden-5c8621f0",
   "category": "데이트·나들이",
   "name": "탄금대교",
   "location": "충북 충주시 금가면 유송리",
   "map": [
    "https://naver.me/xMjHkPb8"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "시내↔학교 정문 차로 이동할 때 드라이브 코스, 중간중간 야경"
  },
  {
   "id": "hidden-0a116855",
   "category": "데이트·나들이",
   "name": "탄금호무지개길",
   "location": "충북 충주시 중앙탑면 루암리 642",
   "map": [
    "https://naver.me/513UP41P"
   ],
   "checkedAt": "2026-09-28",
   "price": "",
   "recommend": 1,
   "note": "싸운 커플이 같이 가면 화해하는 곳"
  },
  {
   "id": "hidden-cbecb264",
   "category": "공강 휴식",
   "name": "국원 쉼터",
   "location": "충북 충주시 대소원면 대학로 50 (E2동)",
   "map": [
    "https://naver.me/5ZSzHSvl"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "잠깐 기다리거나 쉬기, 모임 장소로 추천\n앉을 곳 있음, 여름엔 그늘\n어디서 모일지 모를 때 정하기 좋음"
  },
  {
   "id": "hidden-7ff0a90e",
   "category": "공강 휴식",
   "name": "국원노천극장",
   "location": "충북 충주시 대소원면 검단리 123 (한국교통대학교 충주캠퍼스)",
   "map": [
    "https://naver.me/FZ8Fndy6"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "학생 공연·행사가 열리는 야외 문화 공간\n행사 없는 날 계단식 좌석에서 쉬거나 이야기하기 좋음\n흔들의자는 커플들의 1등석"
  },
  {
   "id": "hidden-1f2e8167",
   "category": "공강 휴식",
   "name": "대학본부 앞 잔디광장 벤치",
   "location": "대학본부(E8) 앞 야외 잔디광장",
   "map": [
    "https://map.naver.com/p/entry/place/20973405"
   ],
   "checkedAt": "2026-10-07",
   "price": "무료",
   "recommend": 1,
   "note": "캠퍼스 중심부, 벤치에서 공강 시간 휴식\n봄 벚꽃·가을 단풍 기념사진 명소\n출입 절차 없음"
  },
  {
   "id": "hidden-429f8cb9",
   "category": "공강 휴식",
   "name": "인문사회관 소극장",
   "location": "인문사회관 (층 모르겠음)",
   "map": [
    "https://naver.me/FHO0SCdz",
    "https://naver.me/5zUsRjJ1"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 3,
   "note": "대형 강의실이라 행사 없으면 대부분 비어 있음\n공강 때 영화관 같은 의자에서 조용히 자거나 휴대폰하기\n조용히 하고, 누가 들어와도 아는 척 안 하는 게 룰\n담당: 학사관리과 043-841-5619\n참고(학교 이용가능시설 목록): https://www.ut.ac.kr/kor/sub06_04_02_01.do\ntxt의 이름 표기: 인문사회예술대학 공강 때 시간 보내는 곳 / 인문사회관소극장\n공강 시간에 눈치 안 보고 쉴 수 있음"
  },
  {
   "id": "hidden-f3a7fbff",
   "category": "공강 휴식",
   "name": "인문사회예술대학 (인사대)",
   "location": "충북 충주시 대소원면 대학로 50 (E14)",
   "map": [
    "https://naver.me/FHO0SCdz"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "수업 후 1층 카페에서 쉬기 좋음\n야외·1층 로비 테이블\n조금 올라가면 후문 쪽 편의점"
  },
  {
   "id": "hidden-8db25b95",
   "category": "공강 휴식",
   "name": "종합강의관 1층 (W5)",
   "location": "충북 충주시 대소원면 대학로 50 종합강의관(W5) 1층",
   "map": [
    "https://naver.me/xOdMfdXy"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "프린트·은행·우체국·안경점 등 업무 시설이 모여 있음\n앞에 CU와 야외 테이블이 있어 쉬기 좋음\ntxt의 이름 표기: 종합강의관1층 / 한국교통대학교 종합강의동"
  },
  {
   "id": "hidden-24335909",
   "category": "공강 휴식",
   "name": "종합강의관 휴게라운지",
   "location": "종합강의관(W5) 1층 및 3층",
   "map": [
    "https://map.naver.com/p/entry/place/17792199"
   ],
   "checkedAt": "2026-10-07",
   "price": "무료",
   "recommend": 1,
   "note": "1층 휴게실은 모바일 학생증 QR 태그 후 입장, 3층은 자유 출입\n소파·충전 콘센트, 연강 사이 30분~1시간 공강에 좋음\n1층에 농협은행 출장소"
  },
  {
   "id": "hidden-11923fe2",
   "category": "공강 휴식",
   "name": "학생회관 3·4층 로비 휴식장소",
   "location": "학생회관(E6) 3, 4층",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "휴식장소"
  },
  {
   "id": "hidden-a244d1c2",
   "category": "공강 휴식",
   "name": "휴스퀘어동 (W5동)",
   "location": "충북 충주시 대소원면 대학로 50 (W5)",
   "map": [
    "https://naver.me/IFGoZ2wU"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "앞에 그늘막과 앉을 곳이 있어 쉬기 좋음\n캠퍼스 중앙이라 어디로든 이동 무난\n바로 앞 카페에서 커피 사서 이동하기 좋음"
  },
  {
   "id": "hidden-ed79efbb",
   "category": "공부 공간",
   "name": "생활관 독서실",
   "location": "국원 5층 중앙 / 예성 관리동 2층 / 중원 6층 / 대원 2층",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "시험 기간 도서관 자리 경쟁 피해서 공부\n생활관마다 위치가 다르니 내 생활관 층 확인\n출처: 충주생활관 생활안내"
  },
  {
   "id": "hidden-c76d28f8",
   "category": "공부 공간",
   "name": "중앙도서관 (W20)",
   "location": "충북 충주시 대소원면 대학로 50 (W20)",
   "map": [
    "https://map.naver.com/p/search/%EA%B5%90%ED%86%B5%EB%8C%80%20%EC%A4%91%EC%95%99%EB%8F%84%EC%84%9C%EA%B4%80?c=15.00,0,0,0,dh&placePath=%2Fhome%3Ffrom%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202610061951%26locale%3Dko%26svcName%3Dmap_pcv5%26searchText%3D%EA%B5%90%ED%86%B5%EB%8C%80%20%EC%A4%91%EC%95%99%EB%8F%84%EC%84%9C%EA%B4%80%26from%3Dmap%26fromPanelNum%3D1%26additionalHeight%3D76%26timestamp%3D202610061951%26locale%3Dko%26svcName%3Dmap_pcv5%26searchText%3D%EA%B5%90%ED%86%B5%EB%8C%80%20%EC%A4%91%EC%95%99%EB%8F%84%EC%84%9C%EA%B4%80"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "리모델링으로 시설이 더 좋아짐\n야외 테라스가 노을 스팟\n한 파일의 위치 표기: 충북 충주시 대소원면 검단리 123"
  },
  {
   "id": "hidden-eaf50c02",
   "category": "공부 공간",
   "name": "중앙도서관 2~3층",
   "location": "충북 충주시 대소원면 대학로 50 중앙도서관(W20) 2~3층",
   "map": [
    "https://naver.me/IFEuEdnL"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "공강 시간에 조용히 쉬기 좋음\n2층: 개인 공부 테이블, 공용 컴퓨터\n3층 로비: 파티션 설치된 테이블, 사람이 금방 몰리니 일찍 자리 잡기\n3층 CU 도서관점 (유인 월~금 09:00~18:00, 무인 24시간)"
  },
  {
   "id": "hidden-254a5076",
   "category": "공부 공간",
   "name": "중앙도서관 2층 디지털정보센터",
   "location": "중앙도서관(W20) 2층",
   "map": [
    "https://naver.me/IFEuEdnL"
   ],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 3,
   "note": "2026년 9월 새 단장한 라운지형 복합문화공간 (카페형 인테리어, 개방형)\n오픈 스터디 라운지에서 공부·독서, 힐링·휴게 공간에서 공강 휴식\n카페 같은 분위기에서 과제·시험공부하기 좋음\ntxt의 이름 표기: 공강 때 쉬는 장소 / 도서관 2층 휴식장소 / 중앙도서관 2층 디지털정보센터\n이용시간·좌석 운영 방식은 도서관 공지 확인 권장"
  },
  {
   "id": "hidden-f05b5019",
   "category": "공부 공간",
   "name": "중앙도서관 3층 열람실",
   "location": "중앙도서관(W20) 3층",
   "map": [
    "https://map.naver.com/p/entry/place/17792124"
   ],
   "checkedAt": "2026-10-07",
   "price": "",
   "recommend": 2,
   "note": "1층 게이트에서 모바일 학생증 앱 바코드 태그 후 출입\n전 좌석 콘센트, Wi-Fi 지원\n같은 층 CU 편의점\n독서실처럼 공부하기 좋은 장소\n각 학과마다 스터디 가능한 공간도 있는 것 같음"
  },
  {
   "id": "hidden-355cae64",
   "category": "공부 공간",
   "name": "캐럴실 (1인 개인열람실)",
   "location": "중앙도서관 3층 (다른 메모: 중앙도서관/교육관/W20 1층)",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 2,
   "note": "개인열람실, 09:00~21:00\n디지털정보센터 예약시스템으로 예약 후 이용\n참고: https://mchains.ut.ac.kr/guide/Static.ax?page=service1"
  },
  {
   "id": "hidden-b9345b8c",
   "category": "학교 시설",
   "name": "SPACE K – VR체험관",
   "location": "",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "LINC 3.0 사업단 운영 (043-849-1780)\n같은 사업단의 SPACE K – VR상영관도 있음\n참고(학교 이용가능시설 목록): https://www.ut.ac.kr/kor/sub06_04_02_01.do"
  },
  {
   "id": "hidden-ae3431ef",
   "category": "학교 시설",
   "name": "SPACE K – 코딩아카데미센터",
   "location": "",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "산학연공유·협업센터 운영 (043-849-1788)\n참고(학교 이용가능시설 목록): https://www.ut.ac.kr/kor/sub06_04_02_01.do"
  },
  {
   "id": "hidden-82c2186d",
   "category": "학교 시설",
   "name": "SPACE-K 1인 스튜디오",
   "location": "",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "LINC 3.0 사업단 운영 (043-849-1780)\n용도와 장비는 아직 확인 못 함\n참고(학교 이용가능시설 목록): https://www.ut.ac.kr/kor/sub06_04_02_01.do"
  },
  {
   "id": "hidden-ce6b6625",
   "category": "학교 시설",
   "name": "대학 라운지",
   "location": "",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "브랜드전략실 관리 (043-841-5105)\n정확한 위치와 이용 방법은 아직 확인 못 함\n참고(학교 이용가능시설 목록): https://www.ut.ac.kr/kor/sub06_04_02_01.do"
  },
  {
   "id": "hidden-4ab4870d",
   "category": "학교 시설",
   "name": "대학본부 3층 전시공간",
   "location": "대학본부 3층",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "담당: 총무과 043-841-5589\n참고(학교 이용가능시설 목록): https://www.ut.ac.kr/kor/sub06_04_02_01.do"
  },
  {
   "id": "hidden-e66bf28d",
   "category": "학교 시설",
   "name": "소담스퀘어 충북",
   "location": "충북 충주시 대소원면 대학로 50 E3동 1층",
   "map": [
    "https://naver.me/FPnrRT95"
   ],
   "checkedAt": "2026-10-06",
   "price": "무료",
   "recommend": 1,
   "note": "네이버 예약으로 스튜디오, 공유오피스 회의실 등 이용 가능"
  },
  {
   "id": "hidden-38ab2367",
   "category": "기타",
   "name": "IT관 앞 벤치 흡연장",
   "location": "IT관(W16) 앞",
   "map": [],
   "checkedAt": "2026-10-06",
   "price": "",
   "recommend": 1,
   "note": "흡연장\n해질 때 담배 피기 좋음"
  },
  {
   "id": "hidden-36732e12",
   "category": "기타",
   "name": "고양이 출몰지역",
   "location": "충청북도 충주시 대소원면 대학로 50 한국교통대학교(대학본부) 버스 정류장 주변",
   "map": [
    "https://naver.me/xPYTbhmL"
   ],
   "checkedAt": "",
   "price": "",
   "recommend": 1,
   "note": ""
  },
  {
   "id": "hidden-5e1582ad",
   "category": "기타",
   "name": "청설모 발견 장소",
   "location": "미래융합정보관(W18) 앞 나무",
   "map": [
    "https://naver.me/IxKl3jzm"
   ],
   "checkedAt": "2026-09-22",
   "price": "",
   "recommend": 1,
   "note": ""
  }
 ],
 "etc": [
  {
   "id": "etc-b0c95ada",
   "category": "PC방",
   "name": "고스트캐슬대학로점",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "PC방"
  },
  {
   "id": "etc-cb7eb69d",
   "category": "PC방",
   "name": "본PC",
   "location": "충북 충주시 칠금15길 21 1층 (Born cafe&pc)",
   "map": [
    "https://naver.me/xRhORwri"
   ],
   "recommend": 1,
   "note": "50시리즈 그래픽카드 PC방\n단체석, 장비 대여 가능"
  },
  {
   "id": "etc-dd5dcb39",
   "category": "PC방",
   "name": "오셀롯PC방 충주교통대점",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "PC방"
  },
  {
   "id": "etc-a3cdd3d7",
   "category": "PC방",
   "name": "테라피씨방",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "PC방"
  },
  {
   "id": "etc-0cdbdb3b",
   "category": "코인노래방",
   "name": "세븐스타코인노래연습장 충주교통대점",
   "location": "충북 충주시 대소원면 대학로 24 1층",
   "map": [
    "https://naver.me/F5sr8zz5"
   ],
   "recommend": 3,
   "note": "코인노래방\n카드는 3곡, 현금은 4곡 (6곡 → 5곡 → 4곡으로 줄었지만 다른 코노보다 혜자)\n다른 코노는 시설이 열악해 선호하지 않음\n회원 가입 시 적립금 많이 줌\n남은 곡 저장해 두고 다음에 이어 부르기 가능"
  },
  {
   "id": "etc-fd9ccba0",
   "category": "코인노래방",
   "name": "지르고코인노래연습장",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "코인노래방"
  },
  {
   "id": "etc-a32feb0f",
   "category": "영화관",
   "name": "충주 영화관 (CGV·메가박스)",
   "location": "",
   "map": [],
   "recommend": 1,
   "note": "충주 영화관은 롯데시네마·CGV·메가박스 세 곳\nCGV와 메가박스는 전 좌석 리클라이너라 추천"
  },
  {
   "id": "etc-f69947ae",
   "category": "볼링·펍",
   "name": "한스타워 나이스 펍 볼링장",
   "location": "충북 충주시 국원대로 107 한스타워 3층, 4층",
   "map": [
    "https://naver.me/FgHlQq1p"
   ],
   "recommend": 1,
   "note": "펍·볼링장\n교통대생 혜택 있음"
  },
  {
   "id": "etc-156c9096",
   "category": "운동",
   "name": "98짐 헬스장",
   "location": "대학가",
   "map": [],
   "recommend": 1,
   "note": "위치와 시설이 좋음"
  }
 ]
};
