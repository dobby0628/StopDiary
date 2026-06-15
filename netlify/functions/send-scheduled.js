// netlify/functions/send-scheduled.js
// 정해진 시간에 저장된 모든 구독자에게 알림을 보내는 스케줄 함수입니다.
// netlify.toml 에서 10분마다 실행되도록 설정되어 있습니다.
//
// 필요한 Netlify 환경변수:
//   VAPID_PUBLIC_KEY
//   VAPID_PRIVATE_KEY
// (README 안내에 따라 등록)

const webpush = require('web-push');
const { getStore } = require('@netlify/blobs');

// 한국시간(KST, UTC+9) 기준 알림 일정
const SCHEDULE = [
  { hour: 8, minute: 0, message: '아침 먹을 시간이에요. 굶지 말고 안정적으로 챙겨요.' },
  { hour: 12, minute: 0, message: '점심 시간이에요. 배부름 점수도 같이 기록해봐요.' },
  { hour: 15, minute: 0, message: '3시 허기 체크 시간이에요. 물 먼저 마셔볼까요?' },
  { hour: 18, minute: 30, message: '저녁 시간이에요. 먹기 전 상태도 가볍게 체크해봐요.' },
  { hour: 22, minute: 0, message: '하루 마무리 기록 시간이에요. 오늘 폭식이 있었나요?' },
];

exports.handler = async () => {
  const vapidPublic = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublic || !vapidPrivate) {
    return { statusCode: 200, body: 'VAPID 키가 설정되지 않아 알림을 보내지 않았어요.' };
  }
  webpush.setVapidDetails('mailto:stopdiary@example.com', vapidPublic, vapidPrivate);

  // KST = UTC + 9시간
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const h = kst.getUTCHours();
  const m = kst.getUTCMinutes();

  const match = SCHEDULE.find((s) => s.hour === h && Math.abs(s.minute - m) <= 4);
  if (!match) {
    return { statusCode: 200, body: `${h}:${m} - 보낼 알림 없음` };
  }

  const store = getStore('push-subscriptions');
  const { blobs } = await store.list();

  let sent = 0;
  for (const b of blobs) {
    const sub = await store.get(b.key, { type: 'json' });
    if (!sub) continue;
    try {
      await webpush.sendNotification(sub, JSON.stringify({ title: '멈춤일기', body: match.message }));
      sent++;
    } catch (err) {
      // 더 이상 유효하지 않은 구독은 삭제
      if (err.statusCode === 410 || err.statusCode === 404) {
        await store.delete(b.key);
      }
    }
  }

  return { statusCode: 200, body: `${h}:${m} - ${sent}명에게 발송` };
};
