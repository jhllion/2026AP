const listEl = document.getElementById('noticeList');
const viewEl = document.getElementById('noticeView');
const boardEl = document.getElementById('noticeBoard');

// 파일 맨 위 "title: ... / date: ..." 두 줄을 읽고, 그 아래 본문을 분리합니다.
function parseFrontMatter(raw) {
  const sepIndex = raw.indexOf('\n---\n');
  if (sepIndex === -1) return { meta: {}, body: raw };
  const head = raw.slice(0, sepIndex);
  const body = raw.slice(sepIndex + 5);
  const meta = {};
  head.split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = value;
  });
  return { meta, body };
}

async function loadList() {
  try {
    const res = await fetch('notices/index.json');
    if (!res.ok) throw new Error('not found');
    const notices = await res.json();

    if (notices.length === 0) {
      listEl.innerHTML = '<p class="notice-empty">아직 등록된 공지가 없어요.</p>';
      return;
    }

    listEl.innerHTML = notices.map(n => `
      <a class="notice-item" href="#${encodeURIComponent(n.file)}">
        <span class="notice-item-date">${n.date || ''}</span>
        <span class="notice-item-title">${n.title}</span>
      </a>
    `).join('');
  } catch (e) {
    listEl.innerHTML = `
      <p class="notice-empty">
        공지 목록을 아직 불러올 수 없어요.<br>
        (배포 전이거나, notices 폴더에 파일을 추가하고 push한 뒤 다시 시도해보세요)
      </p>`;
  }
}

async function showNotice(file) {
  viewEl.innerHTML = '<p class="notice-loading">불러오는 중...</p>';
  boardEl.classList.add('is-viewing');

  try {
    const res = await fetch(`notices/${file}`);
    if (!res.ok) throw new Error('not found');
    const raw = await res.text();
    const { meta, body } = parseFrontMatter(raw);

    viewEl.innerHTML = `
      <a class="back-to-list" href="#">← 목록으로</a>
      <h2 class="notice-view-title">${meta.title || file}</h2>
      <p class="notice-view-date">${meta.date || ''}</p>
      <div class="notice-view-body">${marked.parse(body)}</div>
    `;
  } catch (e) {
    viewEl.innerHTML = `
      <a class="back-to-list" href="#">← 목록으로</a>
      <p class="notice-empty">이 공지를 불러오지 못했어요.</p>
    `;
  }
}

function handleHash() {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash) {
    showNotice(hash);
  } else {
    boardEl.classList.remove('is-viewing');
  }
}

window.addEventListener('hashchange', handleHash);

document.addEventListener('DOMContentLoaded', () => {
  loadList();
  handleHash();
});
