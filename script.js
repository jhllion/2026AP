// 공연일을 여기서 바꾸세요 (YYYY-MM-DD)
const SHOW_DATE = "2026-11-14";

document.addEventListener('DOMContentLoaded', () => {
  const numEl = document.getElementById('ddayNumber');
  const capEl = document.getElementById('ddayCaption');
  if (!numEl) return;

  const today = new Date();
  today.setHours(0,0,0,0);
  const show = new Date(SHOW_DATE);
  show.setHours(0,0,0,0);

  const diffDays = Math.round((show - today) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    numEl.textContent = `D-${diffDays}`;
    capEl.textContent = `공연일(${SHOW_DATE})까지`;
  } else if (diffDays === 0) {
    numEl.textContent = 'D-DAY';
    capEl.textContent = '오늘이 공연일입니다!';
  } else {
    numEl.textContent = `D+${Math.abs(diffDays)}`;
    capEl.textContent = '공연 종료';
  }
});
