/*
 * 화면 문구·메뉴·이미지 경로 설정
 * --------------------------------------------------------------
 * 이 파일만 고치면 홈페이지의 글자, 메뉴, 그림을 바꿀 수 있어요.
 *  - placeholder: true  → 임시 콘텐츠예요. 실제 정보로 바꿔 주세요.
 *  - img 경로            → assets/img 안의 그림을 같은 이름으로 덮어쓰면 교체돼요.
 *  - route               → 눌렀을 때 이동할 화면 (home, map, hidden, food, tips, community, etc, notice, events, search)
 */
window.SITE = {
  name: "한국교통대학교 캠퍼스 라이프",

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
  searchPlaceholder: "검색어를 입력하세요",

  hero: {
    image: "assets/img/hero-campus.jpg",
    tag: "함께라서 더 특별한",
    titleLines: ["한국교통대학교", "캠퍼스 라이프"],
    descLines: ["캠퍼스 지도부터 맛집, 숨은장소, 생활꿀팁까지!", "한국교통대학교의 모든 캠퍼스 생활 정보를 한 곳에서!"],
    searchPlaceholder: "원하는 정보를 검색해보세요!"
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
    ribbon: ["한눈에 보는", "캠퍼스 지도"],
    note: "처음 가도 괜찮아!",
    title: "캠퍼스 지도",
    descLines: ["건물 위치, 강의실, 편의시설까지", "캠퍼스 지도를 통해 쉽게 찾아보세요."],
    button: "지도 바로가기",
    sideNote: ["우리 학교", "어디에 뭐가 있지?"],
    mascot: "assets/img/map-mascot.png",
    // 지도 그림 위 핀 위치(%)는 그림 기준이에요. 그림을 바꾸면 x, y도 함께 맞춰 주세요.
    // keyword: 캠퍼스 지도 화면에서 관련 정보를 찾을 때 쓰는 단어
    pins: [
      { label: "종합강의관", code: "W5", x: 64.7, y: 5.9, keyword: "종합강의", desc: "우체국·농협·복사실·무인 프린터·증명발급기·휴게라운지" },
      { label: "중앙도서관", code: "W20", x: 25.7, y: 26.3, keyword: "도서관", desc: "열람실·디지털정보센터·캐럴실·CU 도서관점" },
      { label: "학생회관", code: "E6", x: 72.7, y: 33.9, keyword: "학생회관", desc: "국원피트니스클럽·IDF·3·4층 로비 휴식장소" },
      { label: "대운동장", code: "W19", x: 35.7, y: 61.9, keyword: "운동장", desc: "트랙·스탠드, 18시 이후 조명" },
      { label: "기숙사", code: "", x: 81.2, y: 69.5, keyword: "생활관", desc: "국원(E3)·대원(E16)·중원(W10)·예성(W11)생활관" }
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
      { code: "E9", name: "항공,기계실습실" },
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
    // 캠퍼스 지도 화면의 큰 일러스트 (학교 공식 지도를 바탕으로 그린 그림)
    //  - labels: 건물 코드 라벨 위치(그림 기준 %). 코드는 아래 buildings와 연결돼요.
    //  - 공식 지도와 대조해 W9·W3 자리를 바로잡고 W2·E14를 추가했어요.
    //  - W10은 W11과 붙은 건물이라 W11 옆에, E18은 E6과 같은 건물이라 E6 옆에 표시해요.
    //  - W15(동아리관)는 그림에 건물이 없어 W9→W16 내려가는 길 위에 라벨만 붙였어요.
    campusMap: {
      image: "assets/img/campus-map.jpg",
      tag: "한눈에 보는",
      title: "캠퍼스 지도",
      descLines: ["건물 번호를 누르면", "건물 정보와 근처 꿀팁이 보여요!"],
      labels: [
      { code: "E16", x: 79.4, y: 5.3 },
      { code: "W10", x: 45.6, y: 5.5 },
      { code: "W11", x: 49.7, y: 5.5 },
      { code: "W13", x: 60.5, y: 5.7 },
      { code: "W9", x: 38.3, y: 11.5 },
      { code: "E15", x: 84.5, y: 15.0 },
      { code: "E17", x: 78.8, y: 16.8 },
      { code: "E13", x: 56.5, y: 17.4 },
      { code: "E10", x: 84.0, y: 22.5 },
      { code: "E11", x: 88.7, y: 23.4 },
      { code: "E9", x: 79.0, y: 25.3 },
      { code: "E12", x: 52.0, y: 25.7 },
      { code: "E8", x: 68.2, y: 33.3 },
      { code: "W7", x: 53.3, y: 34.5 },
      { code: "W16", x: 25.1, y: 34.6 },
      { code: "W15", x: 21.5, y: 29.5 },
      { code: "W17", x: 31.4, y: 35.9 },
      { code: "E7", x: 88.0, y: 38.7 },
      { code: "W18", x: 31.6, y: 42.4 },
      { code: "E6", x: 80.1, y: 43.2 },
      { code: "E18", x: 84.0, y: 43.2 },
      { code: "W5", x: 52.1, y: 43.3 },
      { code: "E8-1", x: 66.9, y: 44.3 },
      { code: "W6", x: 48.0, y: 46.2 },
      { code: "W4", x: 52.3, y: 50.5 },
      { code: "E4", x: 88.4, y: 55.0 },
      { code: "E5", x: 79.7, y: 55.8 },
      { code: "W19", x: 20.4, y: 61.3 },
      { code: "W20", x: 30.1, y: 61.3 },
      { code: "W3", x: 53.7, y: 65.2 },
      { code: "E3", x: 87.4, y: 66.0 },
      { code: "W22", x: 7.7, y: 71.8 },
      { code: "W1", x: 48.6, y: 77.1 },
      { code: "E2", x: 73.3, y: 77.2 },
      { code: "E1", x: 66.2, y: 80.5 },
      { code: "W2", x: 48.2, y: 66.1 },
      { code: "E14", x: 67.7, y: 8.3 }
      ]
    },
    naverMap: "https://map.naver.com/p/search/%ED%95%9C%EA%B5%AD%EA%B5%90%ED%86%B5%EB%8C%80%ED%95%99%EA%B5%90%20%EC%B6%A9%EC%A3%BC%EC%BA%A0%ED%8D%BC%EC%8A%A4"
  },

  popular: {
    title: "지금 가장 인기있는 콘텐츠",
    noteLines: ["다른 친구들은 뭐 볼까?", "지금 가장 핫한 캠퍼스 소식!"],
    // views(조회수)는 임시 숫자예요. 실제 조회수 집계가 생기면 바꿔 주세요.
    items: [
      { badge: "숨은장소", color: "green", title: "벚꽃 명소 추천!", desc: ["캠퍼스 안에서 만나는", "벚꽃 힐링 스팟"], img: "assets/img/popular-1.jpg", views: 2341, route: "hidden", filter: "벚꽃 명소", placeholder: true },
      { badge: "맛집", color: "burgundy", title: "학생회관 근처 맛집 BEST 5", desc: ["학생들이 직접 추천한", "맛집 리스트!"], img: "assets/img/popular-2.jpg", views: 5672, route: "food", sort: "recommend", placeholder: true },
      { badge: "생활꿀팁", color: "orange", title: "대학생활 꿀팁 10가지", desc: ["수강신청부터 과제까지", "알아두면 유용한 꿀팁!"], img: "assets/img/popular-3.jpg", views: 12083, route: "tips", filter: "학사·학교생활", placeholder: true },
      { badge: "커뮤니티", color: "pink", title: "지금 우리 학교는?", desc: ["선배들이 들려주는", "캠퍼스 생활 이야기"], img: "assets/img/popular-4.jpg", views: 8456, route: "community", placeholder: true },
      { badge: "이벤트", color: "coral", title: "교내 행사 캘린더", desc: ["놓치지 말아야 할", "이번 달 주요 행사!"], img: "assets/img/popular-5.jpg", views: 3217, route: "events", placeholder: true }
    ]
  },

  // [임시] 시안에 있던 공지 예시예요. 실제 공지로 바꿔 주세요.
  notices: [
    { title: "2025학년도 1학기 수강신청 안내", date: "2025.02.10", body: "실제 공지 내용으로 바꿔 주세요.", placeholder: true },
    { title: "학생회관 리모델링 공사 안내", date: "2025.02.05", body: "실제 공지 내용으로 바꿔 주세요.", placeholder: true },
    { title: "교내 행사 · \"대동제\" 진행 안내", date: "2025.01.15", body: "실제 공지 내용으로 바꿔 주세요.", placeholder: true }
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

  banner: {
    image: "assets/img/banner-campus.jpg",
    lines: ["오늘도, 좋은 하루", "한국교통대학교에서!"],
    button: "캠퍼스 둘러보기",
    route: "hidden"
  },

  footer: {
    lines: ["더 넓은 세상으로", "함께 가는 한국교통대학교"],
    mascot: "assets/img/footer-mascot.png",
    // url이 비어 있으면 "링크 준비 중" 안내가 떠요. 실제 주소를 넣어 주세요.
    socials: [
      { type: "instagram", label: "인스타그램", url: "", placeholder: true },
      { type: "youtube", label: "유튜브", url: "", placeholder: true },
      { type: "chat", label: "채팅 채널", url: "", placeholder: true }
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
