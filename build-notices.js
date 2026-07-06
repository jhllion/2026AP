// Netlify가 배포할 때마다 자동으로 실행되는 스크립트예요.
// notices 폴더 안의 .md 파일들을 읽어서 notices/index.json 목록을 만듭니다.
// 직접 실행할 일은 없고, netlify.toml의 build command로 자동 실행돼요.

const fs = require('fs');
const path = require('path');

const NOTICES_DIR = path.join(__dirname, 'notices');
const OUTPUT_FILE = path.join(NOTICES_DIR, 'index.json');

function parseFrontMatter(raw) {
  const sepIndex = raw.indexOf('\n---\n');
  if (sepIndex === -1) return { meta: {}, body: raw };
  const head = raw.slice(0, sepIndex);
  const meta = {};
  head.split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = value;
  });
  return { meta };
}

if (!fs.existsSync(NOTICES_DIR)) {
  console.log('notices 폴더가 없어서 건너뜁니다.');
  process.exit(0);
}

const files = fs.readdirSync(NOTICES_DIR).filter(f => f.endsWith('.md'));

const notices = files.map(file => {
  const raw = fs.readFileSync(path.join(NOTICES_DIR, file), 'utf-8');
  const { meta } = parseFrontMatter(raw);
  return {
    file,
    title: meta.title || file.replace('.md', ''),
    date: meta.date || ''
  };
});

// 최신 날짜가 위로 오도록 정렬
notices.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(notices, null, 2));
console.log(`공지 ${notices.length}개 인덱싱 완료`);
