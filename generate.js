// Vercel 서버리스 함수: /api/generate
// 사용자가 "서율"을 입력하면 "야호"라고 답하도록 Gemini API에 프롬프트를 보냅니다.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: '서버에 GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.' });
    return;
  }

  const { name } = req.body || {};
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'name 값이 필요합니다.' });
    return;
  }

  // 규칙: 사용자가 "서율"을 입력하면 "야호"라고만 답하도록 지시.
  // 그 외 입력에는 자연스럽게 짧게 응답하도록 함.
  const systemInstruction = `당신은 아주 간단한 규칙을 따르는 도우미입니다.
- 사용자의 입력이 정확히 "서율"이면 다른 말 없이 "야호"라고만 답하세요.
- 그 외의 입력이면 짧고 친근하게 한 문장으로 답하세요.
출력에는 규칙 설명이나 따옴표를 포함하지 마세요.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: name }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      res.status(502).json({ error: 'Gemini API 호출 중 오류가 발생했습니다.' });
      return;
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '(응답 없음)';

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
}
