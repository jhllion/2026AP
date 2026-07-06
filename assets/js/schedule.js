const MONTHS = [
  { key: '2026-07', label: '7월' },
  { key: '2026-08', label: '8월' },
  { key: '2026-09', label: '9월' },
  { key: '2026-10', label: '10월' },
  { key: '2026-11', label: '11월' },
];

const WEEKDAYS_KR = ['일', '월', '화', '수', '목', '금', '토'];

function parseLocalDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function renderSchedule() {
  const container = document.getElementById('scheduleTable');
  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const html = MONTHS.map(month => {
    const items = SCHEDULE
      .filter(item => item.date.startsWith(month.key))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    const rows = items.length
      ? items.map(item => {
          const d = parseLocalDate(item.date);
          const weekday = WEEKDAYS_KR[d.getDay()];
          const isToday = d.getTime() === today.getTime();
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          return `
            <tr class="${isToday ? 'is-today' : ''}">
              <td class="col-date">${d.getDate()}일</td>
              <td class="col-day ${isWeekend ? 'is-weekend' : ''}">${weekday}</td>
              <td class="col-time">${item.time || ''}</td>
              <td class="col-note">${item.note}</td>
              <td class="col-absent">${item.absent || ''}</td>
            </tr>`;
        }).join('')
      : `<tr class="empty-row"><td colspan="5">예정된 일정이 없어요</td></tr>`;

    return `
      <div class="month-block">
        <h2 class="month-label">${month.label}</h2>
        <table class="schedule-table">
          <thead>
            <tr><th>날짜</th><th>요일</th><th>시간</th><th>내용</th><th>결석</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join('');

  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderSchedule);
