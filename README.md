# 서율 앱

사용자가 "서율"을 입력하면 AI가 "야호"라고 답하는 간단한 웹앱입니다.

## 구조
- `index.html` : 프론트엔드 (입력창 + 버튼 + 결과 표시)
- `api/generate.js` : Gemini API를 호출하는 Vercel 서버리스 함수
- `vercel.json` : Vercel 배포 설정

## 배포 방법 (Vercel)

1. 이 폴더를 GitHub 저장소로 올리거나, Vercel CLI로 바로 배포합니다.
   ```
   npm install -g vercel
   vercel
   ```
2. Vercel 프로젝트 설정 → **Environment Variables** 에서 다음을 추가합니다.
   - Key: `GEMINI_API_KEY`
   - Value: 본인의 Gemini API 키
   (API 키는 코드에 직접 넣지 않고 이 환경변수를 통해서만 읽습니다.)
3. 배포가 완료되면 발급된 URL로 접속해서 "서율"을 입력하고 확인 버튼을 눌러보세요.

## 로컬 테스트
Vercel CLI로 로컬에서도 실행할 수 있습니다.
```
vercel dev
```
실행 전에 `.env` 파일 또는 터미널 환경변수로 `GEMINI_API_KEY`를 설정해야 합니다.
