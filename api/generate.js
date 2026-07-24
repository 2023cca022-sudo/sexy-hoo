// Vercel Serverless Function (Gemini API 연동)
const GEMINI_MODEL = "gemini-2.0-flash";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY 환경변수가 설정되지 않았습니다." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const userPrompt = (body && body.prompt ? String(body.prompt) : "").slice(0, 300);

  const systemInstruction = `너는 "서우 여드름 짜기 챌린지" 게임의 스테이지 데이터 생성기다.
사용자의 입력을 기반으로 가상의 얼굴에 생성될 여드름의 개수, 제한시간, 위치 좌표를 JSON 형태로 반환하라.

반드시 다음 스키마를 만족하는 JSON 단 하나만 출력해야 한다 (마크다운 포맷이나 설명문 금지):
{
  "count": number (10~40 범위의 정수),
  "duration": number (15~40 범위의 초 단위 정수),
  "spots": [
    {
      "region": "forehead" | "cheek-left" | "cheek-right" | "chin" | "nose",
      "x": number (20~80 사이의 %, 얼굴 영역 안쪽),
      "y": number (20~80 사이의 %, 얼굴 영역 안쪽),
      "size": "small" | "medium" | "large"
    }
  ]
}

- 사용자가 특정 부위를 지정하면 해당 region으로 spots의 60% 이상을 집중시켜라.
- "많이", "폭발" 등의 키워드가 있으면 count를 25 이상으로 늘려라.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userPrompt || "얼굴에 여드름 15개 골고루 생성해줘" }] }],
          systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("유효한 응답 텍스트가 없습니다.");

    const parsed = JSON.parse(rawText.trim());
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Generate API Error:", err.message);
    return res.status(500).json({ error: "여드름 생성 중 오류가 발생했습니다." });
  }
};