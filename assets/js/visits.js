const visitClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function trackAndShowVisits() {
  const todayEl = document.getElementById('visitToday');
  const totalEl = document.getElementById('visitTotal');
  if (!todayEl || !totalEl) return;

  // 같은 세션(같은 탭)에서 새로고침해도 중복으로 안 세지도록 1번만 기록
  if (!sessionStorage.getItem('visited')) {
    sessionStorage.setItem('visited', '1');
    await visitClient.from('visits').insert({});
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [totalRes, todayRes] = await Promise.all([
    visitClient.from('visits').select('*', { count: 'exact', head: true }),
    visitClient.from('visits').select('*', { count: 'exact', head: true }).gte('visited_at', todayStart)
  ]);

  todayEl.textContent = todayRes.count ?? '–';
  totalEl.textContent = totalRes.count ?? '–';
}

document.addEventListener('DOMContentLoaded', trackAndShowVisits);
