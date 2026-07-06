const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const listEl = document.getElementById('guestbookList');
const formEl = document.getElementById('guestbookForm');
const nameEl = document.getElementById('guestbookName');
const inputEl = document.getElementById('guestbookInput');
const statusEl = document.getElementById('guestbookStatus');

const ROTATIONS = [-3, -1.5, 0, 1.5, 3, -2, 2];

function randomRotation() {
  return ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function renderEntries(entries) {
  if (!entries.length) {
    listEl.innerHTML = '<p class="notice-empty">아직 남긴 글이 없어요. 첫 번째로 남겨보세요!</p>';
    return;
  }
  listEl.innerHTML = entries.map(entry => `
    <div class="guest-note" style="transform: rotate(${randomRotation()}deg)">
      <span class="pin" aria-hidden="true"></span>
      <p class="guest-note-name">${escapeHtml(entry.name || '익명')}</p>
      <p>${escapeHtml(entry.message)}</p>
      <p class="guest-note-date">${formatDate(entry.created_at)}</p>
    </div>
  `).join('');
}

async function loadEntries() {
  listEl.innerHTML = '<p class="notice-loading">불러오는 중...</p>';

  const { data, error } = await client
    .from('guestbook_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    listEl.innerHTML = '<p class="notice-empty">글 목록을 불러오지 못했어요. (Supabase 설정을 확인해주세요)</p>';
    console.error(error);
    return;
  }
  renderEntries(data);
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameEl.value.trim();
  const message = inputEl.value.trim();

  if (!message) return;
  if (name.length > 20) {
    statusEl.textContent = '이름은 20자 이내로 적어주세요.';
    return;
  }
  if (message.length > 300) {
    statusEl.textContent = '300자 이내로 적어주세요.';
    return;
  }

  statusEl.textContent = '올리는 중...';

  const { error } = await client.from('guestbook_entries').insert({
    name: name || null,
    message,
  });

  if (error) {
    statusEl.textContent = '올리지 못했어요. 잠시 후 다시 시도해주세요.';
    console.error(error);
    return;
  }

  nameEl.value = '';
  inputEl.value = '';
  statusEl.textContent = '';
  loadEntries();
});

document.addEventListener('DOMContentLoaded', loadEntries);
