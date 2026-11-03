/*
 * 공지사항 (학교 학사공지·일반 공지사항에서 가져옴)
 *  - 위에서 3개가 홈 화면에 보여요. tag: 분류, points: 요약, url: 원문
 *  - updated: 마지막으로 가져온 날
 */
window.SITE.noticesUpdated = "2026-11-03";
  //  - tag: 분류, dept: 올린 부서, points: 요약, url: 원문
  //  - 요약은 원문 일부를 간추린 거예요. 정확한 내용은 원문을 확인하도록 안내해요.
window.SITE.notices = [
    { tag: "수강신청", title: "NEW) 국립한국교통대학교 수강신청 시스템 매뉴얼 안내", date: "2026.07.21", dept: "학사관리과",
      points: ["2026학년도 2학기부터 개편된 수강신청시스템(sugang.ut.ac.kr) 사용", "최근 로그인한 기기 1대만 사용 가능, 다중 로그인 제한", "정원 마감 과목은 취소 발생 시 대기 교과목 → 11:00, 17:00 이후 신청 가능", "장바구니에 담기만 하면 신청 아님, 최종 수강신청 기간에 \"신청\"을 눌러야 확정"],
      url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000055/selectBoardArticle.do?bbsId=BBSMSTR_000000000055&nttId=1123293" },
    { tag: "통학버스", title: "[페이코] 통학버스 승차권 사용자 가이드", date: "2026.02.26", dept: "학생과",
      points: ["이천 부발·청주 노선 승차권은 페이코(PAYCO)로 구매", "충주터미널 ↔ 충주역 ↔ 충주캠퍼스 노선은 무료, 별도 신청 없이 탑승", "노선별 운행시간·탑승위치는 원문 링크에서 확인"],
      url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000059/selectBoardArticle.do?bbsId=BBSMSTR_000000000059&nttId=1086631" },
    { tag: "시험", title: "2026학년도 2학기 졸업종합시험 실시 안내", date: "2026.09.21", dept: "학사관리과",
      points: ["1차 2026.11.2.(월) ~ 11.13.(금), 2차 11.30.(월) ~ 12.4.(금) 예정 (학과별 별도 공고)", "대상: 3학년 과정 수료자(건축학전공은 4학년), 조기졸업 신청자, 미통과자", "시험과목·일자는 소속 학과 사무실에서 꼭 확인", "합격: 과목별 40점 이상 + 평균 60점 이상"],
      url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000055/selectBoardArticle.do?bbsId=BBSMSTR_000000000055&nttId=1125010" },
    { tag: "학사", title: "2027학년도 1학기 전과 시행 안내", date: "2026.11.03", dept: "학사관리과",
      points: ["신청기간: 2027.1.8.(금) 09:00 ~ 1.14.(목) 18:00 (주말 제외)", "희망학과 상담 → 원소속·희망학과 확인 → 학사관리과 방문 제출", "허가 확정 통보: 2027.1.21.(목) 예정"],
      url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000055/selectBoardArticle.do?bbsId=BBSMSTR_000000000055&nttId=1125808" },
    { tag: "수강신청", title: "2026학년도 동계 계절학기 운영 계획 안내", date: "2026.10.12", dept: "학사관리과",
      points: ["수업기간: 2026.12.22.(화) ~ 2027.1.13.(수), 3주간 대면수업", "신청학점 6학점 이내, 우리대학 강좌 1학점당 30,400원", "수강신청 기간·방법은 원문에서 확인"],
      url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000055/selectBoardArticle.do?bbsId=BBSMSTR_000000000055&nttId=1125335" },
    { tag: "학사", title: "2026학년도 2학기 수업일수 3/4이상 수강한 휴학생 성적인정 신청 안내", date: "2026.10.14", dept: "학사관리과",
      points: ["대상: 2026.11.25.(수) 이후 병역 등으로 휴학하는 학생", "신청기간: 2026.11.30.(월) ~ 12.7.(월) 18:00", "접수: 학사관리과(충주)"],
      url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000055/selectBoardArticle.do?bbsId=BBSMSTR_000000000055&nttId=1125391" },
    { tag: "수강신청", title: "2026학년도 2학기 수강신청 교과목 철회 신청기간 안내", date: "2026.09.07", dept: "학사관리과",
      points: ["신청기간 2026.9.21.(월) ~ 9.23.(수) (마감됨)", "통합정보시스템 → 학부생 → 수강 → 수강철회신청, 3과목 이내"],
      url: "https://www.ut.ac.kr/cop/bbs/BBSMSTR_000000000055/selectBoardArticle.do?bbsId=BBSMSTR_000000000055&nttId=1124528" }
  ];
