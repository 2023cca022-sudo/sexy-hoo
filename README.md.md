# 🫧 서우 여드름 짜기 챌린지 (Pop Pop Seou)

Google Gemini API와 파스텔 모던 UI 디자인을 결합한 인터랙티브 미니 웹 게임 프로젝트입니다.

---

## 🚀 주요 특징

1. **AI 맞춤형 스테이지 생성**
   - Gemini 2.0 Flash를 활용하여 텍스트 입력만으로 여드름의 빈도, 위치, 게임 시간을 동적으로 구성합니다.
2. **타임어택 & 반응속도 측정 모드**
   - 터치 및 클릭 연타 인터랙션 기반의 콤보 시스템
   - 밀리초(ms) 단위의 반응 속도 테스트 알고리즘 제공

---

## 🛠 배포 방법 (Vercel)

1. 리포지토리를 GitHub에 Push합니다.
2. [Vercel](https://vercel.com)에 로그인 후 해당 리포지토리를 Import합니다.
3. **Environment Variables** 메뉴에서 다음 변수를 추가합니다:
   - `GEMINI_API_KEY`: Google AI Studio에서 발급받은 API 키
4. 배포(Deploy) 버튼을 클릭합니다.