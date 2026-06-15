/* ===== 상수 ===== */
const MEAL_TYPES = ['아침', '점심', '간식', '저녁', '야식'];
const BEFORE_STATES = ['진짜 배고픔', '입 심심함', '스트레스', '당 떨어짐', '그냥 먹고싶음'];
const AFTER_STATES = ['만족', '더 먹고싶음', '더부룩함', '후회', '잘 멈춤'];
const LEFTOVER_OPTIONS = ['다 먹음', '조금 남김', '많이 남김'];

/* Netlify Functions에서 발급한 VAPID 키 중 "공개" 키 (private key는 서버 환경변수에만 둠) */
const VAPID_PUBLIC_KEY = 'BJe2A5Mchz8EMA_Td8e1yjjkfKo1WWKeAHerxo-yx1JBsTSUoqTunF4rf6m8Vc1t9FrSnSAaoC7eGl0rxtMzRKg';

/* 진짜 배고픔 체크 설문 */
const HUNGER_QUESTIONS = [
  { text: '물을 마신 지 얼마나 됐나요?', options: [
    { label: '방금 마셨어요', score: 0 },
    { label: '1시간 정도 지났어요', score: 1 },
    { label: '1시간 넘게 안 마셨어요', score: 2 },
  ]},
  { text: '마지막 식사 후 얼마나 지났나요?', options: [
    { label: '1시간 이내', score: 0 },
    { label: '2~4시간', score: 1 },
    { label: '4시간 이상', score: 2 },
  ]},
  { text: '배에서 신호(꼬르륵 등)가 느껴지나요?', options: [
    { label: '아니요', score: 0 },
    { label: '조금', score: 1 },
    { label: '네, 확실히', score: 2 },
  ]},
  { text: '특정 음식이 당기나요, 아무거나 괜찮나요?', options: [
    { label: '특정 음식만 당겨요', score: 0 },
    { label: '아무거나 괜찮아요', score: 2 },
  ]},
  { text: '지금 기분은 어떤가요?', options: [
    { label: '스트레스·지루함·심심함', score: 0 },
    { label: '보통이에요', score: 1 },
    { label: '편안해요', score: 2 },
  ]},
];

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  coach: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  left: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  right: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  droplet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
};

/* ===== 날짜 유틸 ===== */
const pad = (n) => String(n).padStart(2, '0');
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const nowTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function fmtDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function addDays(dateStr, n) {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + n);
  return fmtDate(d);
}
function getWeekRange(dateStr) {
  const d = parseDate(dateStr);
  const dow = d.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const start = new Date(d);
  start.setDate(d.getDate() + mondayOffset);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const dd = new Date(start);
    dd.setDate(start.getDate() + i);
    dates.push(fmtDate(dd));
  }
  return dates;
}
function getMonthDates(dateStr) {
  const d = parseDate(dateStr);
  const y = d.getFullYear(), m = d.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const dates = [];
  for (let i = 1; i <= days; i++) dates.push(`${y}-${pad(m + 1)}-${pad(i)}`);
  return dates;
}
function formatKoreanDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}
function shiftRef(ref, period, dir) {
  if (period === 'day') return addDays(ref, dir);
  if (period === 'week') return addDays(ref, dir * 7);
  const d = parseDate(ref);
  d.setMonth(d.getMonth() + dir, 1);
  return fmtDate(d);
}
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
function dayScore(entries) {
  if (!entries || entries.length === 0) return 'none';
  const total = entries.length;
  let regret = 0, stress = 0;
  entries.forEach((e) => {
    if ((e.after || []).includes('후회') || (e.after || []).includes('더부룩함')) regret++;
    if ((e.before || []).includes('스트레스') || (e.before || []).includes('입 심심함') || (e.before || []).includes('당 떨어짐')) stress++;
  });
  const regretRatio = regret / total;
  const stressRatio = stress / total;
  if (regret === 0 && stress === 0) return 'good';
  if (regretRatio >= 0.5 || regret >= 2) return 'bad';
  if (regretRatio > 0 || stressRatio >= 0.5) return 'okay';
  return 'good';
}

function calcStreak() {
  let streak = 0;
  let d = todayStr();
  if (!(state.days[d] && state.days[d].length > 0)) d = addDays(d, -1);
  while (state.days[d] && state.days[d].length > 0) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}

/* ===== 이미지 리사이즈 ===== */
function resizeImage(file, maxSize = 220) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > h) { if (w > maxSize) { h = Math.round((h * maxSize) / w); w = maxSize; } }
        else { if (h > maxSize) { w = Math.round((w * maxSize) / h); h = maxSize; } }
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', 0.55));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ===== IndexedDB ===== */
const DB_NAME = 'stopDiaryDB';
const DB_VERSION = 1;
const STORE = 'days';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAll() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const result = {};
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        result[cursor.key] = cursor.value;
        cursor.continue();
      } else resolve(result);
    };
    req.onerror = () => reject(req.error);
  });
}

async function dbSetDay(date, entries) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(entries, date);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ===== 상태 ===== */
const state = {
  tab: 'today',
  days: {},
  calMonth: null,
  calSelected: todayStr(),
  reportPeriod: 'day',
  reportRef: todayStr(),
};

/* ===== 집계 / 코치 ===== */
function aggregate(dates) {
  let totalEntries = 0, fullnessSum = 0, regretMealCount = 0, regretDayCount = 0, daysWithData = 0;
  const beforeCounts = {}, afterCounts = {};
  const dailySeries = [];
  for (const date of dates) {
    const entries = state.days[date] || [];
    if (entries.length > 0) daysWithData++;
    let dayFlag = false, daySum = 0;
    for (const e of entries) {
      totalEntries++;
      fullnessSum += e.fullness;
      daySum += e.fullness;
      (e.before || []).forEach((b) => (beforeCounts[b] = (beforeCounts[b] || 0) + 1));
      (e.after || []).forEach((a) => {
        afterCounts[a] = (afterCounts[a] || 0) + 1;
        if (a === '후회' || a === '더부룩함') { regretMealCount++; dayFlag = true; }
      });
    }
    if (dayFlag) regretDayCount++;
    dailySeries.push({ date, avg: entries.length ? daySum / entries.length : null, count: entries.length, flag: dayFlag });
  }
  return {
    totalEntries, daysWithData,
    avgFullness: totalEntries ? fullnessSum / totalEntries : null,
    regretMealCount, regretDayCount, beforeCounts, afterCounts, dailySeries,
  };
}

function periodLabelText(period) {
  return period === 'day' ? '오늘은' : period === 'week' ? '이번 주' : '이번 달';
}

function coachMessage(stats, label) {
  if (stats.totalEntries === 0) {
    return `${label} 기록이 없어요. 거창하지 않아도 괜찮으니 한 끼만이라도 가볍게 남겨보세요.`;
  }
  const parts = [];
  const wellDone = stats.afterCounts['잘 멈춤'] || 0;
  if (wellDone > 0) parts.push(`${label} '잘 멈춤'을 ${wellDone}번 기록했어요. 신호를 알아채고 멈춘 경험, 잘하고 있어요.`);
  if (stats.regretMealCount > 0) {
    const ratio = Math.round((stats.regretMealCount / stats.totalEntries) * 100);
    parts.push(`'후회'나 '더부룩함'으로 끝난 끼니가 ${stats.regretMealCount}번(전체의 ${ratio}%) 있었어요.`);
  }
  const topBefore = Object.entries(stats.beforeCounts).sort((a, b) => b[1] - a[1])[0];
  if (topBefore && topBefore[0] !== '진짜 배고픔' && topBefore[1] >= 2) {
    parts.push(`'${topBefore[0]}' 상태로 먹기 시작한 경우가 ${topBefore[1]}번으로 가장 많았어요. 다음에 이 느낌이 들면 5분만 다른 걸 해보고 다시 물어봐도 좋아요.`);
  }
  if (stats.avgFullness !== null && stats.avgFullness >= 8) {
    parts.push(`평균 배부름이 ${stats.avgFullness.toFixed(1)}/10으로 높은 편이에요. 다음 끼니는 7 정도에서 한번 멈춰보는 걸 시도해봐요.`);
  }
  if (parts.length === 0) parts.push(`${label} 큰 패턴 없이 무난하게 지나갔어요. 이 흐름을 유지하는 것만으로도 충분해요.`);
  return parts.join(' ');
}

function renderFreqList(counts, total) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return `<p class="memo">기록 없음</p>`;
  const max = Math.max(...entries.map((e) => e[1]));
  return entries.map(([k, v]) => `
    <div class="freq-row">
      <span class="freq-label">${k}</span>
      <div class="freq-bar"><div class="freq-fill" style="width:${(v / max) * 100}%"></div></div>
      <span class="freq-count">${v}</span>
    </div>`).join('');
}

/* 끼니 종류별 후회 빈도 */
function mealTypeRegretCounts(dates) {
  const counts = {};
  dates.forEach((date) => {
    (state.days[date] || []).forEach((e) => {
      if ((e.after || []).includes('후회') || (e.after || []).includes('더부룩함')) {
        counts[e.type] = (counts[e.type] || 0) + 1;
      }
    });
  });
  return counts;
}

/* 요일별 후회 빈도 */
function weekdayRegretCounts(dates) {
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const counts = {};
  dates.forEach((date) => {
    const wd = WD[parseDate(date).getDay()];
    (state.days[date] || []).forEach((e) => {
      if ((e.after || []).includes('후회') || (e.after || []).includes('더부룩함')) {
        counts[wd] = (counts[wd] || 0) + 1;
      }
    });
  });
  return counts;
}

/* 메모에서 자주 등장한 단어 (상위 6개) */
function memoWordFreq(dates) {
  const STOPWORDS = new Set(['그리고', '근데', '오늘', '먹고', '먹었음', '먹음', '너무', '조금', '많이', '계속', '같아요', '같다', '했음', '했다', '이제']);
  const counts = {};
  dates.forEach((date) => {
    (state.days[date] || []).forEach((e) => {
      if (!e.memo) return;
      e.memo.split(/[\s,.!?~()\[\]:;"'·]+/).forEach((w) => {
        const word = w.trim();
        if (word.length < 2 || STOPWORDS.has(word)) return;
        counts[word] = (counts[word] || 0) + 1;
      });
    });
  });
  return Object.fromEntries(Object.entries(counts).filter(([, v]) => v >= 2).sort((a, b) => b[1] - a[1]).slice(0, 6));
}

/* AI 피드백용 텍스트 요약 */
function buildSummary(dates) {
  const lines = [];
  dates.forEach((date) => {
    (state.days[date] || []).forEach((e) => {
      lines.push(`${date} ${e.type}(${e.time}) - 음식: ${e.food || '미기록'}, 배부름 ${e.fullness}/10, 먹기전: ${(e.before || []).join(',') || '없음'}, 먹은후: ${(e.after || []).join(',') || '없음'}, 남김: ${e.leftover || '미기록'}, 물: ${e.waterBefore ? '마심' : '안 마심'}, 메모: ${e.memo || '없음'}`);
    });
  });
  return lines.join('\n') || '기록 없음';
}

/* ===== 렌더 ===== */
function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <main id="main">${renderTab()}</main>
    ${state.tab === 'today' ? `<button class="fab" data-action="open-form" aria-label="기록 추가">${ICONS.plus}</button>` : ''}
    ${renderNav()}
  `;
  attachMainListeners();
  if (state.tab === 'report') drawReportCharts();
  if (state.tab === 'coach') attachHungerListeners();
  if (state.tab === 'settings') {
    updatePushButtonState();
    const importInput = document.getElementById('import-input');
    if (importInput) importInput.addEventListener('change', handleImportFile);
  }
}

function renderHeader() {
  const dateStr = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
  return `<header class="header"><h1>멈춤일기</h1><p>${dateStr} · 오늘도 기록만 하면 충분해요</p></header>`;
}

function renderNav() {
  const tabs = [
    { key: 'today', icon: 'home', label: '오늘' },
    { key: 'calendar', icon: 'calendar', label: '달력' },
    { key: 'report', icon: 'chart', label: '리포트' },
    { key: 'coach', icon: 'coach', label: '코치' },
    { key: 'settings', icon: 'settings', label: '설정' },
  ];
  return `<nav class="bottom-nav">${tabs.map((t) => `
    <button class="nav-btn ${state.tab === t.key ? 'active' : ''}" data-action="set-tab" data-tab="${t.key}">
      ${ICONS[t.icon]}<span>${t.label}</span>
    </button>`).join('')}</nav>`;
}

function renderTab() {
  if (state.tab === 'today') return renderToday();
  if (state.tab === 'calendar') return renderCalendar();
  if (state.tab === 'report') return renderReport();
  if (state.tab === 'settings') return renderSettings();
  return renderCoach();
}

function renderToday() {
  const date = todayStr();
  const entries = (state.days[date] || []).slice().sort((a, b) => a.time.localeCompare(b.time));
  const streak = calcStreak();
  return `
    <div class="card">
      <p class="card-title">오늘의 리듬</p>
      <p class="card-sub">식사 시간에 맞춰 알림이 오면, 먹기 전·후 상태만 가볍게 남겨두세요. 리포트 탭에서 패턴을 같이 볼 수 있어요.</p>
      ${streak > 0 ? `<div class="streak-badge">${ICONS.flame}<span>${streak}일 연속 기록 중</span></div>` : ''}
    </div>
    ${entries.length === 0 ? `
    <div class="empty">
      <p>아직 오늘 기록이 없어요</p>
      <p>오른쪽 아래 + 버튼으로 첫 끼니를 남겨보세요</p>
    </div>` : entries.map((e) => renderMealCard(e, date)).join('')}
  `;
}

function renderMealCard(e, date) {
  const beforeChips = (e.before || []).map((b) => `<span class="chip-static before">${b}</span>`).join('');
  const afterChips = (e.after || []).map((a) => `<span class="chip-static ${a === '후회' || a === '더부룩함' ? 'after-warn' : 'after'}">${a}</span>`).join('');
  const waterChip = e.waterBefore ? `<span class="chip-static water">${ICONS.droplet} 물 마심</span>` : '';
  const photos = [];
  if (e.beforePhoto) photos.push(`<div class="photo-item"><img src="${e.beforePhoto}" alt="먹기 전" /><span>먹기 전</span></div>`);
  if (e.afterPhoto) photos.push(`<div class="photo-item"><img src="${e.afterPhoto}" alt="먹은 후" /><span>먹은 후</span></div>`);
  let durationHtml = '';
  if (e.beforePhotoTime && e.afterPhotoTime) {
    const mins = Math.max(0, Math.round((e.afterPhotoTime - e.beforePhotoTime) / 60000));
    durationHtml = `<p class="memo">먹는 데 약 ${mins}분 걸렸어요</p>`;
  }
  return `
  <div class="card meal-card">
    <div class="meal-top">
      <div class="meal-meta"><span class="tag">${e.type}</span><span class="time">${e.time}</span></div>
      <button class="delete-btn" data-action="delete-entry" data-date="${date}" data-id="${e.id}">${ICONS.trash}</button>
    </div>
    ${e.food ? `<p class="food">${escapeHtml(e.food)}</p>` : ''}
    <div class="fullness-row">
      <span class="label">배부름</span>
      <div class="fullness-bar"><div class="fullness-fill" style="width:${e.fullness * 10}%"></div></div>
      <span class="val">${e.fullness}/10</span>
    </div>
    ${beforeChips || afterChips || waterChip ? `<div class="chips">${beforeChips}${afterChips}${waterChip}</div>` : ''}
    ${e.leftover ? `<p class="leftover-note">남김: ${e.leftover}</p>` : ''}
    ${photos.length ? `<div class="photos">${photos.join('')}</div>` : ''}
    ${durationHtml}
    ${e.memo ? `<p class="memo">${escapeHtml(e.memo)}</p>` : ''}
  </div>`;
}

function renderCalendar() {
  if (!state.calMonth) {
    const d = new Date();
    state.calMonth = { y: d.getFullYear(), m: d.getMonth() };
  }
  const { y, m } = state.calMonth;
  const first = new Date(y, m, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const fmt = (d) => `${y}-${pad(m + 1)}-${pad(d)}`;

  const cellsHtml = cells.map((d) => {
    if (!d) return `<div></div>`;
    const dateStr = fmt(d);
    const score = dayScore(state.days[dateStr]);
    const isToday = dateStr === todayStr();
    const isSelected = dateStr === state.calSelected;
    return `<button class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-action="select-day" data-date="${dateStr}">
      <span>${d}</span><span class="cal-dot ${score}"></span>
    </button>`;
  }).join('');

  return `
  <div class="card cal-header">
    <button data-action="cal-prev">${ICONS.left}</button>
    <span class="month-label">${y}년 ${m + 1}월</span>
    <button data-action="cal-next">${ICONS.right}</button>
  </div>
  <div class="card">
    <div class="cal-grid">${['일', '월', '화', '수', '목', '금', '토'].map((d) => `<div class="cal-weekday">${d}</div>`).join('')}</div>
    <div class="cal-grid">${cellsHtml}</div>
  </div>
  <div class="legend">
    <div class="legend-item"><span class="legend-dot" style="background:var(--good)"></span>좋음</div>
    <div class="legend-item"><span class="legend-dot" style="background:var(--okay)"></span>그럭저럭</div>
    <div class="legend-item"><span class="legend-dot" style="background:var(--bad)"></span>나쁨</div>
  </div>
  <p class="legend-hint">날짜를 누르면 그날의 리포트를 볼 수 있어요</p>
  `;
}

function renderReport() {
  const ref = state.reportRef;
  let dates, label;
  if (state.reportPeriod === 'day') { dates = [ref]; label = formatKoreanDate(ref); }
  else if (state.reportPeriod === 'week') { dates = getWeekRange(ref); label = `${dates[0]} ~ ${dates[6]}`; }
  else { dates = getMonthDates(ref); const d = parseDate(ref); label = `${d.getFullYear()}년 ${d.getMonth() + 1}월`; }

  const stats = aggregate(dates);

  return `
  <div class="period-tabs">
    ${['day', 'week', 'month'].map((p) => `<button class="chip ${state.reportPeriod === p ? 'period-on' : ''}" data-action="set-period" data-period="${p}">${p === 'day' ? '일별' : p === 'week' ? '주별' : '월별'}</button>`).join('')}
  </div>
  <div class="card nav-row">
    <button data-action="report-prev">${ICONS.left}</button>
    <span class="label">${label}</span>
    <button data-action="report-next">${ICONS.right}</button>
  </div>
  ${stats.totalEntries === 0 ? `<div class="empty"><p>이 기간엔 기록이 없어요</p></div>` : `
  <div class="card">
    <div class="stat-grid">
      <div><p class="num">${stats.totalEntries}</p><p class="lbl">끼니</p></div>
      <div><p class="num">${stats.avgFullness.toFixed(1)}</p><p class="lbl">평균 배부름</p></div>
      <div><p class="num ${stats.regretMealCount > 0 ? 'warn' : 'ok'}">${stats.regretMealCount}</p><p class="lbl">후회·과식</p></div>
    </div>
  </div>
  ${dates.length > 1 ? `<div class="card"><p class="card-title">${state.reportPeriod === 'week' ? '요일별' : '일별'} 평균 배부름</p><div class="chart-wrap"><canvas id="fullnessChart"></canvas></div></div>` : ''}
  ${Object.keys(stats.beforeCounts).length || Object.keys(stats.afterCounts).length ? `
  <div class="card">
    <p class="card-title">먹기 전 상태</p>
    <div class="freq-list">${renderFreqList(stats.beforeCounts)}</div>
    <p class="card-title" style="margin-top:14px">먹은 후 상태</p>
    <div class="freq-list">${renderFreqList(stats.afterCounts)}</div>
  </div>` : ''}
  ${state.reportPeriod === 'month' ? renderMonthlyPatterns(dates) : ''}
  <div class="card">
    <p class="card-title">코치 한마디</p>
    <p class="coach-msg">${coachMessage(stats, periodLabelText(state.reportPeriod))}</p>
  </div>
  <div class="card">
    <p class="card-title">AI 코치 피드백</p>
    <p class="card-sub">설정 탭에서 고른 모델로 더 자세한 피드백을 받아볼 수 있어요. (Netlify 환경변수 설정 필요)</p>
    <button class="btn-primary" data-action="ai-feedback" style="margin-top:8px">AI 피드백 받기</button>
    <p class="coach-msg" id="ai-feedback-result" style="display:none"></p>
  </div>
  ${state.reportPeriod === 'day' ? `
  <div class="card">
    <p class="card-title">이 날의 기록</p>
    ${(state.days[ref] || []).slice().sort((a, b) => a.time.localeCompare(b.time)).map((e) => `
      <div class="day-row"><span>${e.type} · ${e.time}</span><span>배부름 ${e.fullness}/10</span></div>
    `).join('') || '<p class="memo">기록 없음</p>'}
  </div>` : ''}
  `}
  `;
}

function renderMonthlyPatterns(dates) {
  const mealCounts = mealTypeRegretCounts(dates);
  const weekdayCounts = weekdayRegretCounts(dates);
  const wordCounts = memoWordFreq(dates);
  const blocks = [];
  if (Object.keys(mealCounts).length) {
    blocks.push(`
    <div class="card">
      <p class="card-title">끼니별 후회·과식 빈도</p>
      <div class="freq-list">${renderFreqList(mealCounts)}</div>
    </div>`);
  }
  if (Object.keys(weekdayCounts).length) {
    blocks.push(`
    <div class="card">
      <p class="card-title">요일별 후회·과식 빈도</p>
      <div class="freq-list">${renderFreqList(weekdayCounts)}</div>
    </div>`);
  }
  if (Object.keys(wordCounts).length) {
    blocks.push(`
    <div class="card">
      <p class="card-title">메모에 자주 등장한 단어</p>
      <div class="chips">${Object.entries(wordCounts).map(([w, c]) => `<span class="chip-static after">${w} ${c}</span>`).join('')}</div>
    </div>`);
  }
  return blocks.join('');
}

let reportChart = null;
function drawReportCharts() {
  const canvas = document.getElementById('fullnessChart');
  if (!canvas || typeof Chart === 'undefined') return;
  const ref = state.reportRef;
  const dates = state.reportPeriod === 'week' ? getWeekRange(ref) : getMonthDates(ref);
  const stats = aggregate(dates);
  const labels = dates.map((d) => {
    if (state.reportPeriod === 'week') return ['일', '월', '화', '수', '목', '금', '토'][parseDate(d).getDay()];
    return String(parseDate(d).getDate());
  });
  const data = stats.dailySeries.map((s) => s.avg);
  const colors = stats.dailySeries.map((s) => (s.flag ? '#C97B63' : '#6E7F5C'));
  if (reportChart) reportChart.destroy();
  reportChart = new Chart(canvas, {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 6 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      spanGaps: true,
      scales: { y: { min: 0, max: 10, ticks: { stepSize: 2 } }, x: { grid: { display: false } } },
      plugins: { legend: { display: false } },
    },
  });
}

const hungerAnswers = {};

function renderCoach() {
  const todayStats = aggregate([todayStr()]);
  const weekStats = aggregate(getWeekRange(todayStr()));
  return `
  <div class="card">
    <p class="card-title">오늘 한마디</p>
    <p class="coach-msg">${coachMessage(todayStats, '오늘은')}</p>
  </div>
  <div class="card">
    <p class="card-title">이번 주 한마디</p>
    <p class="coach-msg">${coachMessage(weekStats, '이번 주')}</p>
  </div>
  <div class="card">
    <p class="card-title">진짜 배고픔 체크</p>
    <p class="card-sub">먹기 전, 간단한 질문에 답하면 지금 허기가 어떤 종류인지 같이 살펴볼게요.</p>
    ${HUNGER_QUESTIONS.map((q, qi) => `
    <div class="field">
      <p class="field-label">${q.text}</p>
      <div class="chips" data-hunger="${qi}">
        ${q.options.map((o) => `<button class="chip" data-score="${o.score}">${o.label}</button>`).join('')}
      </div>
    </div>`).join('')}
    <button class="btn-primary" data-action="hunger-check">결과 보기</button>
    <div id="hunger-result"></div>
  </div>
  <div class="card">
    <p class="card-title">기억해두면 좋은 것</p>
    <p class="card-sub">
      배가 고프지 않아도 먹고 싶을 때는 잠깐 멈춰서 '진짜 배고픔'인지 '입 심심함·스트레스'인지 구분해보세요.<br><br>
      배부름 7~8 정도에서 한번 숨을 고르고, 더 먹을지 정해보는 것도 좋은 연습이에요.<br><br>
      후회한 끼니가 있어도 괜찮아요. 그 끼니를 기록한 것만으로도 패턴을 알아가는 중이에요.
    </p>
  </div>
  `;
}

function attachHungerListeners() {
  document.querySelectorAll('[data-hunger]').forEach((group) => {
    const qi = group.dataset.hunger;
    group.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        hungerAnswers[qi] = Number(btn.dataset.score);
        group.querySelectorAll('.chip').forEach((b) => b.classList.toggle('type-on', b === btn));
      });
    });
  });
}

function hungerResult(score) {
  if (score <= 3) return '감정적 허기일 가능성이 높아요. 지금은 배보다 마음이 허전한 신호일 수 있어요. 물 한 잔을 마시고 10분만 다른 일을 해본 뒤에 다시 물어보면 어때요?';
  if (score <= 7) return '애매한 허기예요. 진짜 배고픔인지 아직 확실하지 않아요. 가벼운 간식이나 물로 먼저 확인해보고, 그래도 배고프면 식사를 챙겨도 좋아요.';
  return '진짜 배고픔에 가까워요. 몸이 에너지를 필요로 하는 신호예요. 끼니를 챙겨 먹어도 괜찮아요.';
}

function renderSettings() {
  const provider = localStorage.getItem('aiProvider') || 'openai';
  return `
  <div class="card">
    <p class="card-title">AI 피드백</p>
    <p class="card-sub">리포트 탭의 'AI 피드백 받기'에서 사용할 모델을 골라주세요. Netlify에 해당 API 키가 설정돼 있어야 동작해요.</p>
    <div class="chips" data-group="ai-provider" style="margin-top:8px">
      <button class="chip ${provider === 'openai' ? 'type-on' : ''}" data-action="set-ai-provider" data-value="openai">OpenAI (GPT)</button>
      <button class="chip ${provider === 'anthropic' ? 'type-on' : ''}" data-action="set-ai-provider" data-value="anthropic">Anthropic (Claude)</button>
    </div>
  </div>
  <div class="card">
    <p class="card-title">알림</p>
    <p class="card-sub">앱을 닫아둬도 정해진 시간(아침 8시·점심 12시·오후 3시·저녁 6시반·밤 10시)에 알림을 받을 수 있어요. 휴대폰 홈 화면에 추가한 뒤 켜는 걸 추천해요.</p>
    <button class="btn-primary" id="push-btn" data-action="enable-push" style="margin-top:8px">알림 켜기</button>
  </div>
  <div class="card">
    <p class="card-title">데이터 백업</p>
    <p class="card-sub">기록은 이 기기에만 저장돼요. 기기를 바꾸기 전에 내보내서 보관해두세요.</p>
    <button class="btn-secondary" data-action="export-data">${ICONS.download} 내보내기 (JSON)</button>
    <label class="btn-secondary" style="display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer;">
      ${ICONS.upload} 가져오기 (JSON)
      <input type="file" accept="application/json" id="import-input" style="display:none" />
    </label>
  </div>
  `;
}

/* ===== 이벤트 ===== */
function attachMainListeners() {
  document.querySelectorAll('#app [data-action]').forEach((el) => {
    el.addEventListener('click', handleAction);
  });
}

async function handleAction(e) {
  const action = e.currentTarget.dataset.action;
  switch (action) {
    case 'set-tab':
      state.tab = e.currentTarget.dataset.tab;
      render();
      break;
    case 'open-form':
      openAddForm();
      break;
    case 'delete-entry': {
      const date = e.currentTarget.dataset.date;
      const id = Number(e.currentTarget.dataset.id);
      state.days[date] = (state.days[date] || []).filter((m) => m.id !== id);
      await dbSetDay(date, state.days[date]);
      render();
      break;
    }
    case 'cal-prev':
      state.calMonth.m -= 1;
      if (state.calMonth.m < 0) { state.calMonth.m = 11; state.calMonth.y -= 1; }
      render();
      break;
    case 'cal-next':
      state.calMonth.m += 1;
      if (state.calMonth.m > 11) { state.calMonth.m = 0; state.calMonth.y += 1; }
      render();
      break;
    case 'select-day':
      state.calSelected = e.currentTarget.dataset.date;
      state.reportRef = state.calSelected;
      state.reportPeriod = 'day';
      state.tab = 'report';
      render();
      break;
    case 'set-period':
      state.reportPeriod = e.currentTarget.dataset.period;
      render();
      break;
    case 'report-prev':
      state.reportRef = shiftRef(state.reportRef, state.reportPeriod, -1);
      render();
      break;
    case 'report-next':
      state.reportRef = shiftRef(state.reportRef, state.reportPeriod, 1);
      render();
      break;
    case 'hunger-check': {
      const total = Object.values(hungerAnswers).reduce((s, v) => s + v, 0);
      const answered = Object.keys(hungerAnswers).length;
      const resultEl = document.getElementById('hunger-result');
      if (answered < HUNGER_QUESTIONS.length) {
        resultEl.innerHTML = `<p class="coach-msg">모든 질문에 답해주시면 더 정확하게 알 수 있어요. (${answered}/${HUNGER_QUESTIONS.length})</p>`;
      } else {
        resultEl.innerHTML = `<p class="coach-msg">${hungerResult(total)}</p>`;
      }
      break;
    }
    case 'set-ai-provider':
      localStorage.setItem('aiProvider', e.currentTarget.dataset.value);
      render();
      break;
    case 'export-data':
      exportData();
      break;
    case 'enable-push':
      await enablePush();
      break;
    case 'ai-feedback':
      await requestAiFeedback(e.currentTarget);
      break;
  }
}

/* ===== 기록 추가 폼 ===== */
function renderFormSheet() {
  return `
  <div class="modal-sheet">
    <div class="modal-head">
      <h2>기록 남기기</h2>
      <button data-action="close-form">${ICONS.x}</button>
    </div>
    <div class="field">
      <p class="field-label">식사 종류</p>
      <div class="chips" data-group="type">
        ${MEAL_TYPES.map((t, i) => `<button class="chip ${i === 0 ? 'type-on' : ''}" data-value="${t}">${t}</button>`).join('')}
      </div>
    </div>
    <div class="field">
      <p class="field-label">시간</p>
      <input type="time" data-field="time" value="${nowTime()}" />
    </div>
    <div class="field">
      <p class="field-label">먹은 음식</p>
      <input type="text" data-field="food" placeholder="예: 김밥, 라면" />
    </div>
    <div class="field">
      <div class="photo-row">
        <div style="flex:1">
          <p class="field-label">먹기 전 사진</p>
          <label class="photo-input" data-photo="before">
            <span class="photo-icon">${ICONS.camera}</span>
            <img class="photo-preview" alt="" />
            <input type="file" accept="image/*" capture="environment" />
          </label>
        </div>
        <div style="flex:1">
          <p class="field-label">먹은 후 사진</p>
          <label class="photo-input" data-photo="after">
            <span class="photo-icon">${ICONS.camera}</span>
            <img class="photo-preview" alt="" />
            <input type="file" accept="image/*" capture="environment" />
          </label>
        </div>
      </div>
    </div>
    <div class="field">
      <p class="field-label">배부름 점수: <span data-fullness-val>5</span>/10</p>
      <input type="range" min="1" max="10" value="5" data-field="fullness" />
    </div>
    <div class="field">
      <p class="field-label">먹기 전 상태 (여러 개 선택 가능)</p>
      <div class="chips" data-group="before">
        ${BEFORE_STATES.map((s) => `<button class="chip" data-value="${s}">${s}</button>`).join('')}
      </div>
    </div>
    <div class="field">
      <p class="field-label">먹은 후 상태 (여러 개 선택 가능)</p>
      <div class="chips" data-group="after">
        ${AFTER_STATES.map((s) => `<button class="chip" data-value="${s}">${s}</button>`).join('')}
      </div>
    </div>
    <div class="field">
      <p class="field-label">남겼나요?</p>
      <div class="chips" data-group="leftover">
        ${LEFTOVER_OPTIONS.map((s) => `<button class="chip" data-value="${s}">${s}</button>`).join('')}
      </div>
    </div>
    <div class="field">
      <p class="field-label">먹기 전에 물을 마셨나요?</p>
      <div class="chips" data-group="water">
        <button class="chip" data-value="yes">${ICONS.droplet} 마셨어요</button>
      </div>
    </div>
    <div class="field">
      <p class="field-label">메모</p>
      <textarea rows="2" data-field="memo" placeholder="짧게 메모해도 좋아요"></textarea>
    </div>
    <button class="btn-primary" data-action="submit-form">기록 저장하기</button>
  </div>`;
}

function openAddForm() {
  const fs = {
    type: MEAL_TYPES[0], time: nowTime(), food: '', fullness: 5,
    before: [], after: [], leftover: '', memo: '', beforePhoto: null, afterPhoto: null,
    waterBefore: false, beforePhotoTime: null, afterPhotoTime: null,
  };
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = renderFormSheet();
  document.body.appendChild(overlay);
  attachFormListeners(overlay, fs);
}

function attachFormListeners(overlay, fs) {
  overlay.querySelector('[data-action="close-form"]').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelectorAll('[data-group]').forEach((group) => {
    const name = group.dataset.group;
    group.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        if (name === 'type') {
          fs.type = val;
          group.querySelectorAll('.chip').forEach((b) => b.classList.toggle('type-on', b === btn));
        } else if (name === 'leftover') {
          fs.leftover = fs.leftover === val ? '' : val;
          group.querySelectorAll('.chip').forEach((b) => b.classList.toggle('leftover-on', b.dataset.value === fs.leftover));
        } else if (name === 'before') {
          if (fs.before.includes(val)) fs.before = fs.before.filter((x) => x !== val);
          else fs.before.push(val);
          btn.classList.toggle('before-on', fs.before.includes(val));
        } else if (name === 'after') {
          if (fs.after.includes(val)) fs.after = fs.after.filter((x) => x !== val);
          else fs.after.push(val);
          const warnClass = val === '후회' || val === '더부룩함' ? 'after-warn' : 'after-on';
          btn.classList.toggle(warnClass, fs.after.includes(val));
        } else if (name === 'water') {
          fs.waterBefore = !fs.waterBefore;
          btn.classList.toggle('water-on', fs.waterBefore);
        }
      });
    });
  });

  overlay.querySelector('[data-field="time"]').addEventListener('input', (e) => (fs.time = e.target.value));
  overlay.querySelector('[data-field="food"]').addEventListener('input', (e) => (fs.food = e.target.value));
  overlay.querySelector('[data-field="memo"]').addEventListener('input', (e) => (fs.memo = e.target.value));

  const fullnessInput = overlay.querySelector('[data-field="fullness"]');
  const fullnessVal = overlay.querySelector('[data-fullness-val]');
  fullnessInput.addEventListener('input', (e) => {
    fs.fullness = Number(e.target.value);
    fullnessVal.textContent = fs.fullness;
  });

  overlay.querySelectorAll('[data-photo]').forEach((label) => {
    const which = label.dataset.photo;
    const input = label.querySelector('input');
    const icon = label.querySelector('.photo-icon');
    const img = label.querySelector('.photo-preview');
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const dataUrl = await resizeImage(file);
      if (which === 'before') { fs.beforePhoto = dataUrl; fs.beforePhotoTime = Date.now(); }
      else { fs.afterPhoto = dataUrl; fs.afterPhotoTime = Date.now(); }
      img.src = dataUrl;
      img.style.display = 'block';
      icon.style.display = 'none';
    });
  });

  overlay.querySelector('[data-action="submit-form"]').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = '저장 중...';
    const entry = { id: Date.now(), ...fs };
    const date = todayStr();
    state.days[date] = [...(state.days[date] || []), entry];
    await dbSetDay(date, state.days[date]);
    overlay.remove();
    render();
  });
}

/* ===== 데이터 백업 ===== */
function exportData() {
  const blob = new Blob([JSON.stringify(state.days, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stop-diary-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    for (const [date, entries] of Object.entries(data)) {
      if (!Array.isArray(entries)) continue;
      const existing = state.days[date] || [];
      const existingIds = new Set(existing.map((en) => en.id));
      const merged = [...existing, ...entries.filter((en) => !existingIds.has(en.id))];
      state.days[date] = merged;
      await dbSetDay(date, merged);
    }
    alert('가져오기를 완료했어요.');
    render();
  } catch (err) {
    alert('파일을 읽는 중 문제가 생겼어요. JSON 형식을 확인해주세요.');
  }
}

/* ===== 푸시 알림 ===== */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function enablePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('이 브라우저는 푸시 알림을 지원하지 않아요.');
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('알림 권한이 필요해요. 브라우저 설정에서 알림을 허용해주세요.');
    return;
  }
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }
  try {
    await fetch('/.netlify/functions/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    });
  } catch (err) {
    console.error('구독 정보 전송 실패', err);
  }
  updatePushButtonState();
}

async function updatePushButtonState() {
  const btn = document.getElementById('push-btn');
  if (!btn) return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    btn.textContent = '이 브라우저는 알림을 지원하지 않아요';
    btn.disabled = true;
    return;
  }
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      btn.textContent = '알림 켜짐 ✓';
      btn.disabled = true;
    } else {
      btn.textContent = '알림 켜기';
      btn.disabled = false;
    }
  } catch (err) {
    btn.textContent = '알림 켜기';
  }
}

/* ===== AI 피드백 ===== */
async function requestAiFeedback(btn) {
  const resultEl = document.getElementById('ai-feedback-result');
  btn.disabled = true;
  btn.textContent = '코치가 읽고 있어요...';
  const provider = localStorage.getItem('aiProvider') || 'openai';
  const ref = state.reportRef;
  let dates;
  if (state.reportPeriod === 'day') dates = [ref];
  else if (state.reportPeriod === 'week') dates = getWeekRange(ref);
  else dates = getMonthDates(ref);
  const summary = buildSummary(dates);
  try {
    const res = await fetch('/.netlify/functions/ai-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, summary, period: periodLabelText(state.reportPeriod) }),
    });
    const data = await res.json();
    resultEl.textContent = data.text || data.error || '피드백을 받지 못했어요.';
    resultEl.style.display = 'block';
  } catch (err) {
    resultEl.textContent = '오류가 발생했어요. Netlify 함수와 API 키 설정을 확인해주세요.';
    resultEl.style.display = 'block';
  }
  btn.disabled = false;
  btn.textContent = 'AI 피드백 받기';
}


async function init() {
  try {
    state.days = await dbGetAll();
  } catch (err) {
    console.error('DB 로드 실패', err);
  }
  render();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

init();
