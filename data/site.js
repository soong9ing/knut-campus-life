/*
 * 화면 문구·메뉴·이미지 경로 설정
 * --------------------------------------------------------------
 * 이 파일만 고치면 홈페이지의 글자, 메뉴, 그림을 바꿀 수 있어요.
 *  - placeholder: true  → 임시 콘텐츠예요. 실제 정보로 바꿔 주세요.
 *  - img 경로            → assets/img 안의 그림을 같은 이름으로 덮어쓰면 교체돼요.
 *  - route               → 눌렀을 때 이동할 화면 (home, map, hidden, food, tips, community, etc, notice, events(학사일정), search, bus(교내 버스 실시간 정류장), favorites(내 장소))
 */
window.SITE = {
  name: "교통정리; 교통대 생활, 선배들이 정리 해드림",

  // 정보 수정 요청(제보)을 받을 구글 폼 주소. claude.ai 게시 페이지에서는 사이트 저장소에 모이고,
  // GitHub 사이트에서는 이 주소가 있을 때만 제보 버튼이 보여요. {place}, {text}를 넣으면 미리 채워져요.
  reportFormUrl: "",

  // 로고: 학교 UI 가이드의 "시그니처 국/영문 가로형" (엠블럼+국문+영문이 한 덩어리)
  //  - srcOnDark: 버건디 배경(네비·푸터)용 흰색 버전, src: 원래 색 버전
  //  - 규정상 요소를 따로 떼거나 비율을 바꾸지 말고 통째로 정비례 축소·확대해서 써요.
  //  - 흰색 반전 버전은 가이드 원본에 없어서 원본 색만 흰색으로 바꿔 만든 거예요. 공식 흰색 파일이 있으면 교체해 주세요.
  //  - 비워 두면 "LOGO" 자리표시자가 보여요.
  logo: { src: "assets/img/logo-knut.png", srcOnDark: "assets/img/logo-knut-white.png", alt: "국립한국교통대학교 KOREA NATIONAL UNIVERSITY OF TRANSPORTATION" },
  school: { ko: "한국교통대학교", en: "KOREA NATIONAL UNIVERSITY OF TRANSPORTATION" },

  nav: [
    { label: "홈", route: "home" },
    { label: "캠퍼스 지도", route: "map" },
    { label: "숨은장소", route: "hidden" },
    { label: "맛집", route: "food" },
    { label: "생활꿀팁", route: "tips" },
    { label: "커뮤니티", route: "community" }
  ],
  searchPlaceholder: "궁금한 정보를 검색해보세요.",
  // 헤더 로고 아래 서비스 이름 (공식 로고와는 따로 표시)
  subtitle: "",

  hero: {
    image: "assets/img/hero-campus.jpg",
    // 계절마다 홈 맨 위 배경 그림이 저절로 바뀌어요 (방문자 기기의 오늘 날짜 기준).
    //  봄 3~5월 · 여름 6~8월 · 가을 9~11월 · 겨울 12~2월. 그림을 바꾸려면 같은 이름으로 덮어쓰기.
    //  주소 끝에 ?season=winter 처럼 붙이면 다른 계절 배경을 미리 볼 수 있어요.
    seasons: {
      spring: "assets/img/hero-spring.jpg",
      summer: "assets/img/hero-summer.jpg",
      autumn: "assets/img/hero-autumn.jpg",
      winter: "assets/img/hero-winter.jpg"
    },
    badge: "한국교통대학교 캠퍼스 생활 플랫폼",
    tag: "교통대 생활, 선배들이 정리 해드림",
    titleLines: ["교통정리"],
    descLines: ["교통대 생활, 선배들이 정리 해드림"],
    searchPlaceholder: "캠퍼스, 맛집, 꿀팁 등 궁금한 정보를 검색해보세요!"
  },

  menuCards: [
    { title: "캠퍼스 지도", desc: ["건물·시설·편의시설을", "한눈에 보기"], img: "assets/img/menu-1.png", route: "map" },
    { title: "숨은장소", desc: ["조용하고 특별한", "우리 캠퍼스의 숨은 명소"], img: "assets/img/menu-2.png", route: "hidden" },
    { title: "맛집", desc: ["학생들이 추천하는", "캠퍼스 근처 맛집"], img: "assets/img/menu-3.png", route: "food" },
    { title: "생활꿀팁", desc: ["알아두면 유용한", "대학생활 꿀팁 모음"], img: "assets/img/menu-4.png", route: "tips" },
    { title: "커뮤니티", desc: ["함께 나누는", "캠퍼스 이야기"], img: "assets/img/menu-5.png", route: "community" }
  ],

  mapIntro: {
    image: "assets/img/map-illust.jpg",
    card: "assets/img/map-card.jpg",  // 홈 화면 "한눈에 보는 캠퍼스 지도" 카드 그림
    ribbon: ["한눈에 보는", "캠퍼스 지도"],
    note: "처음 가도 괜찮아!",
    title: "캠퍼스 지도",
    descLines: ["건물 위치, 강의실, 편의시설까지", "캠퍼스 지도를 통해 쉽게 찾아보세요."],
    button: "지도 바로가기",
    sideNote: ["우리 학교", "어디에 뭐가 있지?"],
    mascot: "assets/img/map-mascot.png",
    // 지도 그림 위 핀 위치(%)는 그림 기준이에요. 그림을 바꾸면 x, y도 함께 맞춰 주세요.
    // keyword: 캠퍼스 지도 화면에서 관련 정보를 찾을 때 쓰는 단어
    // 핀 위치(%): x, y는 핀 꼬리가 가리키는 건물 지점이에요. flip: true면 말풍선이 왼쪽으로 펼쳐져요.
    pins: [
      { label: "종합강의관", code: "W5", x: 49.2, y: 46.9, flip: true, keyword: "종합강의", desc: "우체국·농협·복사실·무인 프린터·증명발급기·휴게라운지" },
      { label: "중앙도서관", code: "W20", x: 35.4, y: 64.0, keyword: "도서관", desc: "열람실·디지털정보센터·캐럴실·CU 도서관점" },
      { label: "학생회관", code: "E6", x: 65.2, y: 49.6, keyword: "학생회관", desc: "국원피트니스클럽·IDF·3·4층 로비 휴식장소" },
      { label: "대운동장", code: "W19", x: 27.3, y: 73.2, flip: true, keyword: "운동장", desc: "트랙·스탠드, 18시 이후 조명" },
      { label: "기숙사", code: "E3", x: 75.6, y: 75.8, keyword: "생활관", desc: "국원(E3)·대원(E16)·중원(W10)·예성(W11)생활관" }
    ],
    // 학교 공식 캠퍼스 지도 (충주캠퍼스)
    officialMap: "https://www.ut.ac.kr/prog/campusMap/kor/sub01_07_02/list.do?campus_code=dorm1",
    // 공식 지도의 건물 목록 (코드·이름). 같은 건물의 다른 이름은 alias에 넣으면 관련 정보 찾기에 쓰여요.
    buildings: [
      { code: "E1", name: "정문" },
      { code: "E2", name: "국원쉼터", alias: ["국원 쉼터"] },
      { code: "E3", name: "국원생활관" },
      { code: "E4", name: "시스템관/국원문화관" },
      { code: "E5", name: "테크노관" },
      { code: "E6", name: "학생회관" },
      { code: "E7", name: "경영항공관" },
      { code: "E8", name: "대학본부", alias: ["교직원식당", "학생식당"] },
      { code: "E8-1", name: "대학본부 별관", alias: ["복지관", "본부별관"] },
      { code: "E9", name: "항공,기계실습관" },
      { code: "E10", name: "역학시험동" },
      { code: "E11", name: "창업생산동" },
      { code: "E12", name: "건축관" },
      { code: "E13", name: "건설환경관" },
      { code: "E14", name: "인문사회관", alias: ["인사대", "인문사회예술대학", "블루포트"] },
      { code: "E15", name: "학군단" },
      { code: "E16", name: "대원생활관" },
      { code: "E17", name: "스마트ICT관", alias: ["스마트 ICT", "ICT관"] },
      { code: "E18", name: "국제청년협력센터" },
      { code: "W1", name: "테니스장" },
      { code: "W2", name: "아레나K" },
      { code: "W3", name: "국원노천극장" },
      { code: "W4", name: "대학원" },
      { code: "W5", name: "종합강의관", alias: ["종합강의동"] },
      { code: "W6", name: "휴스퀘어관", alias: ["휴스퀘어"] },
      { code: "W7", name: "화학생명관" },
      { code: "W9", name: "공동실험관" },
      { code: "W10", name: "중원생활관" },
      { code: "W11", name: "예성생활관" },
      { code: "W13", name: "예성관리동", alias: ["예성중원관리동"] },
      { code: "W15", name: "동아리관" },
      { code: "W16", name: "IT관" },
      { code: "W17", name: "인터넷창업센터" },
      { code: "W18", name: "미래융합정보관" },
      { code: "W19", name: "대운동장" },
      { code: "W20", name: "중앙도서관/교육관" },
      { code: "W22", name: "환경관" }
    ],
    // 캠퍼스 지도 화면의 큰 일러스트 (학교 공식 지도를 바탕으로 다시 그린 그림, 1774×887)
    //  - labels: 그림에 그려진 건물 번호 위치(그림 기준 %). x, y는 가운데, w, h는 크기예요.
    //    그림의 번호 위에 보이지 않는 버튼이 올라가고, 누르면 노란색으로 표시돼요.
    //  - drawn: false 는 그림에 번호가 없어 화면에서 라벨을 그려 넣는 건물이에요 (W6, E17: 공식 지도 배치를 참고한 위치).
    campusMap: {
      image: "assets/img/campus-map.jpg",
      width: 1774, height: 887,
      descLines: ["건물 번호를 누르면", "건물 정보와 근처 꿀팁이 보여요!"],
      labels: [
      { code: "E1", x: 58.46, y: 86.92, w: 3.04, h: 4.74 },
      { code: "E2", x: 65.11, y: 83.65, w: 3.04, h: 5.30 },
      { code: "E3", x: 75.65, y: 73.84, w: 3.04, h: 4.74 },
      { code: "E4", x: 76.49, y: 60.32, w: 3.10, h: 4.74 },
      { code: "E5", x: 70.01, y: 62.23, w: 3.10, h: 4.51 },
      { code: "E6", x: 65.16, y: 49.61, w: 3.16, h: 4.74 },
      { code: "E7", x: 72.49, y: 44.64, w: 3.10, h: 4.74 },
      { code: "E8", x: 60.94, y: 36.41, w: 3.04, h: 4.51 },
      { code: "E8-1", x: 60.09, y: 44.76, w: 3.83, h: 5.30 },
      { code: "E9", x: 64.66, y: 30.21, w: 2.93, h: 4.40 },
      { code: "E10", x: 66.85, y: 25.82, w: 3.44, h: 4.62 },
      { code: "E11", x: 71.98, y: 26.04, w: 3.49, h: 4.62 },
      { code: "E12", x: 47.91, y: 28.41, w: 3.44, h: 4.51 },
      { code: "E13", x: 51.47, y: 19.28, w: 3.55, h: 4.62 },
      { code: "E14", x: 57.05, y: 12.74, w: 3.89, h: 4.74 },
      { code: "E15", x: 69.00, y: 16.91, w: 3.49, h: 4.74 },
      { code: "E16", x: 65.45, y: 5.75, w: 3.66, h: 4.74 },
      { code: "E18", x: 69.50, y: 49.27, w: 3.49, h: 4.74 },
      { code: "W1", x: 46.05, y: 83.31, w: 3.49, h: 4.85 },
      { code: "W2", x: 46.05, y: 72.60, w: 3.38, h: 4.74 },
      { code: "W3", x: 50.79, y: 69.90, w: 3.38, h: 4.74 },
      { code: "W4", x: 49.15, y: 55.02, w: 3.55, h: 4.85 },
      { code: "W5", x: 49.15, y: 47.13, w: 3.44, h: 4.74 },
      { code: "W7", x: 49.72, y: 38.11, w: 3.38, h: 4.62 },
      { code: "W9", x: 35.85, y: 13.19, w: 3.38, h: 4.62 },
      { code: "W10", x: 43.80, y: 4.51, w: 3.83, h: 4.74 },
      { code: "W11", x: 49.38, y: 3.95, w: 3.95, h: 5.07 },
      { code: "W13", x: 54.90, y: 4.40, w: 4.00, h: 4.85 },
      { code: "W15", x: 25.08, y: 22.89, w: 4.28, h: 5.52 },
      { code: "W16", x: 25.82, y: 39.91, w: 3.78, h: 5.52 },
      { code: "W17", x: 31.29, y: 41.94, w: 3.66, h: 4.51 },
      { code: "W18", x: 31.51, y: 48.03, w: 3.78, h: 4.74 },
      { code: "W19", x: 27.34, y: 71.48, w: 3.95, h: 4.96 },
      { code: "W20", x: 35.40, y: 69.33, w: 3.55, h: 4.51 },
      { code: "W22", x: 19.11, y: 81.29, w: 3.83, h: 6.09 },
      { code: "W6", x: 44.53, y: 50.96, drawn: false },
      { code: "E17", x: 64.15, y: 22.55, drawn: false }
      ]
    },
    naverMap: "https://map.naver.com/p/search/%ED%95%9C%EA%B5%AD%EA%B5%90%ED%86%B5%EB%8C%80%ED%95%99%EA%B5%90%20%EC%B6%A9%EC%A3%BC%EC%BA%A0%ED%8D%BC%EC%8A%A4"
  },

  popular: {
    title: "지금 가장 인기있는 콘텐츠",
    noteLines: [],
    // 조회수가 많은 정보가 자동으로 올라와요 (상세 창을 열 때마다 조회 1회).
    // 조회 기록이 모자라면 추천인 수가 많은 정보로 채워요. count: 보여 줄 개수
    count: 5
  },

  // [임시] 시안에 있던 공지 예시예요. 실제 공지로 바꿔 주세요.
  // 공지사항은 data/notices.js에 있어요 (자동 업데이트가 그 파일만 바꿔요).
  // 학교 공지 게시판 바로가기
  noticeBoards: [
    { label: "학사공지", url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000055/selectBoardList.do" },
    { label: "일반 공지사항", url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000059/selectBoardList.do" }
  ],

  // [임시] 행사 캘린더 예시
  events: [
    { date: "매 학기", title: "천원의 아침밥", desc: "통합정보시스템 행사 공지에서 기간 확인 후 PAYCO로 구매", placeholder: false },
    { date: "3월·9월 초중반", title: "동아리 모집 기간", desc: "통합정보시스템 → 학생지원 → 동아리가입신청", placeholder: false },
    { date: "날짜 미정", title: "대동제", desc: "실제 일정으로 바꿔 주세요.", placeholder: true }
  ],

  // [임시] 커뮤니티 예시 글 (게시판 서버가 생기면 실제 글로 바뀌어요)
  community: [
    { cat: "자유", title: "인사대 올라갈 때 건축관 엘리베이터 타면 진짜 편해요", meta: "익명 · 예시 글", placeholder: true },
    { cat: "질문", title: "999번 버스 주말에도 다니나요?", meta: "익명 · 예시 글", placeholder: true },
    { cat: "후기", title: "부리또인 소고기 조금매운맛+파인애플 조합 추천", meta: "익명 · 예시 글", placeholder: true },
    { cat: "정보", title: "시험기간 도서관 3층 자리 없으면 5층 강의실 가세요", meta: "익명 · 예시 글", placeholder: true }
  ],

  // 홈 지도 카드 옆 배너. 없애려면 null로 바꾸면 돼요.
  banner: { image: "assets/img/banner-campus.jpg", lines: ["오늘도, 좋은 하루", "한국교통대학교에서!"], button: "캠퍼스 둘러보기", route: "hidden" },

  footer: {
    lines: ["더 넓은 세상으로", "함께 가는 한국교통대학교"],
    mascot: "assets/img/footer-mascot.png",
    // url이 비어 있으면 "링크 준비 중" 안내가 떠요. 실제 주소를 넣어 주세요.
    // 학교 홈페이지(www.ut.ac.kr) 하단에 걸린 공식 SNS 주소 (2026-11-03 확인)
    // 아이콘을 더 넣으려면 type을 instagram, youtube, blog, kakao, facebook 중에서 골라 추가하세요.
    socials: [
      { type: "instagram", label: "한국교통대학교 인스타그램", url: "https://www.instagram.com/knut_rising/" },
      { type: "youtube", label: "한국교통대학교 유튜브", url: "https://www.youtube.com/channel/UCxy8o0ygKBHr0Gw9mTg8e6w" },
      { type: "blog", label: "한국교통대학교 네이버 블로그", url: "https://blog.naver.com/cjnupr" },
      { type: "kakao", label: "한국교통대학교 카카오톡 채널", url: "https://pf.kakao.com/_YUWdj" },
      { type: "facebook", label: "한국교통대학교 페이스북", url: "https://www.facebook.com/knutpr" }
    ]
  },

  // 목록 화면 상단 소개
  sections: {
    hidden: { title: "숨은장소", desc: "조용하고 특별한 우리 캠퍼스의 숨은 명소" },
    food: { title: "맛집", desc: "학생들이 추천하는 캠퍼스 근처 맛집" },
    tips: { title: "생활꿀팁", desc: "알아두면 유용한 대학생활 꿀팁 모음" },
    etc: { title: "자유 · 놀거리", desc: "PC방, 노래방, 영화관처럼 쉬는 날 갈 곳" }
  }
};
