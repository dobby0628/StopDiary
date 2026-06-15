// netlify/functions/ai-feedback.js
// 클라이언트는 이 함수만 호출하고, 실제 API 키는 절대 브라우저에 노출되지 않습니다.
// Netlify 대시보드 > Site configuration > Environment variables 에서
//   OPENAI_API_KEY   (OpenAI 사용 시)
//   ANTHROPIC_API_KEY (Anthropic/Claude 사용 시)
// 를 등록해주세요. 둘 중 사용할 것만 등록하면 됩니다.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: '요청 형식이 올바르지 않아요.' }) };
  }

  const { provider, summary, period } = body;

  const prompt = `너는 식습관 코치야. 사용자는 의지박약을 탓하지 않고, 식사 리듬을 잡고 폭식을 줄이려는 사람이야. 아래는 ${period || ''} 기록 요약이야.

${summary || '기록 없음'}

이 기록을 보고 비난하지 말고, 4~5문장 정도로 따뜻하지만 구체적인 피드백을 줘. 잘한 점 1개, 패턴(스트레스·심심함으로 먹은 끼니, 후회한 끼니, 식사 시간 등)이 보이면 짚어주고, 다음에 시도해볼 작은 한 가지를 제안해줘.`;

  try {
    let text;

    if (provider === 'anthropic') {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) {
        return { statusCode: 500, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY가 Netlify 환경변수에 설정되지 않았어요.' }) };
      }
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        return { statusCode: 502, body: JSON.stringify({ error: `Anthropic API 오류: ${errText}` }) };
      }
      const data = await res.json();
      text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
    } else {
      const key = process.env.OPENAI_API_KEY;
      if (!key) {
        return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY가 Netlify 환경변수에 설정되지 않았어요.' }) };
      }
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        return { statusCode: 502, body: JSON.stringify({ error: `OpenAI API 오류: ${errText}` }) };
      }
      const data = await res.json();
      text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text || '피드백을 받지 못했어요.' }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
