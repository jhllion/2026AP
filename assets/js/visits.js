const visitClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function trackAndShowVisits() {
  const todayEl = document.getElementById('visitToday');
  const totalEl = document.getElementById('visitTotal');
  if (!todayEl || !totalEl) return;

  // 같은 세션(같은 탭)에서 새로고침해도 중복으로 안 세지도록 1번만 기록
  // (insert가 성공했을 때만 플래그를 남김 — 실패했는데 플래그가 남으면 영영 재시도 안 함)
  if (!sessionStorage.getItem('visited')) {
    const { error: insertError } = await visitClient.from('visits').insert({});
    if (insertError) {
      console.error('방문 기록 실패:', insertError);
    } else {
      sessionStorage.setItem('visited', '1');
    }
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [totalRes, todayRes] = await Promise.all([
    visitClient.from('visits').select('*', { count: 'exact', head: true }),
    visitClient.from('visits').select('*', { count: 'exact', head: true }).gte('visited_at', todayStart)
  ]);

  if (totalRes.error) console.error('전체 카운트 조회 실패:', totalRes.error);
  if (todayRes.error) console.error('오늘 카운트 조회 실패:', todayRes.error);

  todayEl.textContent = todayRes.count ?? '–';
  totalEl.textContent = totalRes.count ?? '–';
}

document.addEventListener('DOMContentLoaded', trackAndShowVisits);
