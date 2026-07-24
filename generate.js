import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // POST 요청 검증
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { reactionTime, aimScore, mode } = req.body;

  // API 키 환경변수 확인
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    let prompt = '';
    if (mode === 'reaction') {
      prompt = `사용자의 반응속도 테스트 결과는 ${reactionTime}ms 입니다. 
이 기록에 대해 재치 있고 칭찬이나 피드백을 주는 짧은 분석 한마디(2~3문장, 한국어)를 작성해 주세요.`;
    } else if (mode === 'aim') {
      prompt = `사용자의 10초 에임 테스트 결과는 ${aimScore}점(클릭 수)입니다. 
이 에임 점수에 대해 게이머 스타일로 위트 있는 평가와 조언 한마디(2~3문장, 한국어)를 작성해 주세요.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'AI 분석 생성 중 오류가 발생했습니다.' });
  }
}
