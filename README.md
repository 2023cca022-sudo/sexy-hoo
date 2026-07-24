# Reflex & Aim Lab (Vercel 배포 가이드)

## Vercel 배포 단계

1. **GitHub 리포지토리 생성 및 푸시**
   - 이 압축 파일 안의 내용(`index.html`, `package.json`, `api/generate.js`)을 프로젝트 디렉터리에 넣고 GitHub에 푸시합니다.

2. **Vercel 프로젝트 연동**
   - [Vercel](https://vercel.com) 로그인 후 **"Add New" -> "Project"** 클릭
   - 방금 생성한 GitHub 리포지토리를 선택하고 Import 합니다.

3. **환경변수(Environment Variables) 설정 (중요)**
   - 프로젝트 설정 화면의 **Environment Variables** 탭으로 이동합니다.
   - Key: `GEMINI_API_KEY`
   - Value: `[발급받은 Google Gemini API 키]`
   - 저장 후 **Deploy** 버튼을 누릅니다.
