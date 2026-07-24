// /api/generate.js
// Vercel Serverless Function
const GEMINI_MODEL = "gemini-2.0-flash";
const REGIONS = ["forehead", "cheek-left", "cheek-right", "chin", "nose"];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "서버에 GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.",
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const userPrompt = (body && body.prompt ? String(body.prompt) : "").slice(0, 500);

  const systemInstruction = `너는 "서우 여드름 짜기 챌린지"라는 웹 게임의 데이터 생성기다.
사용자가 오늘 서우 얼굴에 어떤 여드름이 났는지 자유롭게 설명하면,
그 설명을 바탕으로 게임에 사용할 여드름 배치 데이터를 JSON으로만 만들어야 한다.

규칙:
- 오직 아래 스키마를 따르는 JSON 객체 하나만 출력한다. 코드블록, 설명, 접두어를 절대 붙이지 않는다.
- count: 5~40 사이의 정수 (생성할 여드름 총 개수)
- duration: 15~60 사이의 정수 (게임 제한 시간, 초)
- spots: 길이가 count와 같은 배열. 각 원소는:
  - region: "forehead" | "cheek-left" | "cheek-right" | "chin" | "nose" 중 하나
  - x: 8~92 사이의 숫자 (얼굴 영역 내 가로 위치, %)
  - y: 8~92 사이의 숫자 (얼굴 영역 내 세로 위치, %)
  - size: "small" | "medium" | "large" 중 하나

사용자가 특정 부위(이마, 볼, 턱, 코)를 언급하면 해당 region에 spots를 더 많이 배치하고,
"많이"라고 하면 count를 높게, "적게"/"조금"이라고 하면 count를 낮게 설정한다.
"빨리"/"짧게"라고 하면 duration을 낮게, 언급이 없으면 30 정도로 설정한다.
사용 가능한 region 값: ${REGIONS.join(", ")}`;

  const userText = userPrompt
    ? `사용자 설명: "${userPrompt}"`
    : `사용자 설명이 없다. 얼굴 전체에 골고루 여드름 15개, duration 30으로 생성하라.`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: userText }],
      },
    ],
    systemInstruction: {
      role: "system",
      parts: [{ text: systemInstruction }],
    },
    generationConfig: {
      temperature: 0.9,
      responseMimeType: "application/json",
    },
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return res.status(502).json({ error: "Gemini API 호출에 실패했습니다." });
    }

    const data = await geminiRes.json();
    const rawText =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!rawText) {
      return res.status(502).json({ error: "Gemini 응답에서 데이터를 찾을 수 없습니다." });
    }

    const cleaned = rawText.trim().replace(/^```json\s*|```$/g, "");
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON parse error:", e, cleaned);
      return res.status(502).json({ error: "Gemini 응답 JSON 파싱에 실패했습니다." });
    }

    const spots = Array.isArray(parsed.spots) ? parsed.spots : [];
    if (spots.length === 0) {
      return res.status(502).json({ error: "생성된 여드름 데이터가 비어 있습니다." });
    }

    return res.status(200).json({
      count: parsed.count || spots.length,
      duration: parsed.duration || 30,
      spots,
    });
  } catch (err) {
    console.error("Unexpected error calling Gemini:", err);
    return res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
  }
};