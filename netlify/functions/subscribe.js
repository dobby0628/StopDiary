// netlify/functions/subscribe.js
// 브라우저의 푸시 구독 정보를 Netlify Blobs에 저장합니다.
// Netlify에 배포된 환경에서는 별도 설정 없이 동작합니다.

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let sub;
  try {
    sub = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: '요청 형식이 올바르지 않아요.' }) };
  }

  if (!sub || !sub.endpoint) {
    return { statusCode: 400, body: JSON.stringify({ error: '구독 정보가 올바르지 않아요.' }) };
  }

  try {
    const store = getStore('push-subscriptions');
    const key = Buffer.from(sub.endpoint).toString('base64').replace(/[/+=]/g, '_').slice(0, 180);
    await store.setJSON(key, sub);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
