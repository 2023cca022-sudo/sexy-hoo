# 서우 여드름 짜기 챌린지

시간 안에 서우 얼굴에 생긴 여드름을 최대한 많이 클릭해서 터뜨리는 미니 게임입니다.
게임을 시작하기 전, 오늘 여드름이 어떤 상태인지 문장으로 설명하면 Gemini API가
여드름의 개수·위치·크기·제한 시간을 자동으로 생성해줍니다.

## 폴더 구조

```
seou-acne-game/
├─ index.html        # 프론트엔드 (정적 파일, 빌드 과정 없음)
├─ api/
│  └─ generate.js     # Gemini API를 호출하는 Vercel 서버리스 함수
└─ package.json
```

- 프론트엔드는 순수 HTML/CSS/JS 한 파일로 되어 있어 별도 빌드 없이 그대로 정적 파일로 배포됩니다.
- `/api/generate` 로 오는 POST 요청을 `api/generate.js`가 처리하며, 이 함수만 서버(Vercel Functions) 위에서 실행됩니다.

## Vercel 배포 방법

1. 이 폴더를 GitHub 저장소로 올리거나, `vercel` CLI로 폴더 자체를 배포합니다.
   ```bash
   npm i -g vercel
   cd seou-acne-game
   vercel
   ```
2. Vercel 프로젝트 대시보드 → **Settings → Environment Variables** 에서
   `GEMINI_API_KEY` 라는 이름으로 발급받은 Gemini API 키를 등록합니다.
   (Production / Preview / Development 환경에 모두 추가해두는 것을 권장합니다.)
3. 환경변수 등록 후 다시 배포(재배포)하면 `/api/generate`가 정상적으로 Gemini API를 호출합니다.

## 로컬에서 테스트하기

```bash
npm i -g vercel
cd seou-acne-game
vercel dev
```

`vercel dev`는 `api/` 폴더의 서버리스 함수와 정적 파일을 함께 실행해주므로,
로컬에서도 실제 배포와 동일한 구조로 테스트할 수 있습니다.
로컬 테스트 시에는 프로젝트 루트에 `.env` 파일을 만들고 아래처럼 키를 넣어주세요.
(`.env`는 git에 커밋하지 마세요.)

```
GEMINI_API_KEY=여기에_발급받은_키
```

## 동작 방식 요약

1. 사용자가 시작 화면에서 "이마 위주로 여드름이 많이 났어" 같은 문장을 입력합니다.
2. 프론트엔드가 `/api/generate`에 `{ prompt }`를 POST로 보냅니다.
3. `api/generate.js`가 `GEMINI_API_KEY`로 Gemini API를 호출해, 여드름 개수·위치(x,y)·크기·
   제한 시간을 담은 JSON을 받아옵니다.
4. 프론트엔드는 이 JSON을 바탕으로 서우 얼굴 위에 여드름을 순차적으로 생성하고,
   플레이어는 제한 시간 동안 클릭으로 여드름을 터뜨립니다.
5. Gemini 호출이 실패하거나 형식이 맞지 않으면, 프론트엔드가 자체적으로 임의 데이터를
   생성해 게임이 끊기지 않도록 처리합니다(fallback).

## 참고

- 여기서 등장하는 "서우"는 CSS 도형으로 그린 가상의 캐릭터이며, 실존 인물과 무관합니다.
- Gemini 모델명(`gemini-2.0-flash`)은 `api/generate.js` 상단의 `GEMINI_MODEL` 상수에서 바꿀 수 있습니다.
