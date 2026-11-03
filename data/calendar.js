/*
 * 학사일정 — 홈 화면 D-day와 '학사일정' 화면에 써요.
 *  - 출처: 학교 홈페이지 학사일정(https://www.ut.ac.kr/prog/schedule/kor/sub05_01/1/scheduleList.do)
 *          과 학사공지(전과·계절학기·졸업종합시험·성적인정), 2026-11-03 확인
 *  - start, end: "YYYY-MM-DD", key: true 이면 홈 D-day에 우선 보여요
 *  - type: exam(시험) · apply(신청) · class(수업) · holiday(휴일) · etc
 *  - 학교 원본의 설 연휴(2027-02-06~2027-01-08)는 날짜 오류라 2/6~2/8로 고쳐 넣었어요.
 */
window.CALENDAR = {
  updated: "2026-11-03",
  url: "https://www.ut.ac.kr/prog/schedule/kor/sub05_01/1/scheduleList.do",
  events: [
    { start: "2026-09-01", end: "2026-09-01", title: "2학기 개강", type: "class" },
    { start: "2026-09-24", end: "2026-09-26", title: "추석 연휴", type: "holiday" },
    { start: "2026-10-20", end: "2026-10-26", title: "중간고사 권장기간", type: "exam", key: true },
    { start: "2026-10-29", end: "2026-10-29", title: "수업일수 1/2", type: "class" },
    { start: "2026-11-02", end: "2026-11-13", title: "졸업종합시험 1차 (학과별 공고)", type: "exam" },
    { start: "2026-11-16", end: "2026-11-16", title: "수업일수 2/3", type: "class" },
    { start: "2026-11-25", end: "2026-11-25", title: "수업일수 3/4", type: "class" },
    { start: "2026-11-30", end: "2026-12-04", title: "졸업종합시험 2차 (학과별 공고)", type: "exam" },
    { start: "2026-11-30", end: "2026-12-07", title: "휴학생 성적인정 신청", type: "apply" },
    { start: "2026-12-08", end: "2026-12-14", title: "2학기 지정보강기간", type: "class" },
    { start: "2026-12-15", end: "2026-12-21", title: "기말고사", type: "exam", key: true },
    { start: "2026-12-15", end: "2026-12-28", title: "성적입력기간", type: "etc" },
    { start: "2026-12-22", end: "2026-12-22", title: "동계방학 시작", type: "holiday", key: true },
    { start: "2026-12-22", end: "2027-01-13", title: "동계 계절학기 수업", type: "class" },
    { start: "2026-12-25", end: "2026-12-25", title: "성탄절", type: "holiday" },
    { start: "2027-01-01", end: "2027-01-01", title: "신정", type: "holiday" },
    { start: "2027-01-08", end: "2027-01-14", title: "2027-1학기 전과 신청", type: "apply", key: true },
    { start: "2027-02-06", end: "2027-02-08", title: "설 연휴", type: "holiday" },
    { start: "2027-02-09", end: "2027-02-09", title: "대체휴일", type: "holiday" },
    { start: "2027-02-18", end: "2027-02-18", title: "2026학년도 학위수여식(전기)", type: "etc" },
    { start: "2027-02-22", end: "2027-02-26", title: "2027-1학기 재학생 등록기간", type: "apply", key: true },
    { start: "2027-03-02", end: "2027-03-02", title: "2027-1학기 개강", type: "class", key: true }
  ]
};
