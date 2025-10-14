# Vibe Coding Project

일기 작성 및 관리를 위한 Next.js 기반 웹 애플리케이션입니다.

## 🚀 Getting Started

개발 서버를 실행하세요:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 🏗️ 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── diaries/           # 일기 페이지
│   ├── globals.css        # 전역 스타일
│   └── layout.tsx         # 루트 레이아웃
├── commons/               # 공통 컴포넌트 및 유틸리티
│   ├── components/        # 재사용 가능한 UI 컴포넌트
│   │   ├── button/        # 버튼 컴포넌트
│   │   ├── input/         # 입력 컴포넌트
│   │   ├── pagination/    # 페이지네이션 컴포넌트
│   │   ├── searchbar/     # 검색바 컴포넌트
│   │   ├── selectbox/     # 셀렉트박스 컴포넌트
│   │   └── toggle/        # 토글 컴포넌트
│   ├── constants/         # 상수 정의
│   │   ├── color.ts       # 색상 토큰
│   │   ├── typography.ts  # 타이포그래피 토큰
│   │   ├── enum.ts        # 열거형 정의
│   │   └── url.ts         # URL 상수
│   ├── layout/            # 레이아웃 컴포넌트
│   └── providers/         # 전역 프로바이더
│       ├── modal/         # 모달 프로바이더
│       ├── next-themes/   # 테마 프로바이더
│       └── react-query/   # React Query 프로바이더
└── components/            # 페이지별 특화 컴포넌트
    └── diaries/           # 일기 관련 컴포넌트
```

## 🎯 개발 룰 시스템

### 커서룰 체계
- `@01-common.mdc`: 공통 개발 규칙
- `@02-wireframe.mdc`: 와이어프레임 구조 규칙
- `@03-ui.mdc`: UI 구현 규칙

### 피그마 연동
- **MCP 도구**: CursorTalkToFigmaMCP 활용
- **노드ID 기반**: 피그마 디자인을 노드ID로 정확히 참조
- **채널별 분리**: 각 컴포넌트별 고유 채널 사용

## 🎨 디자인 시스템

### 색상 시스템
- CSS 변수를 통한 토큰화 관리
- 라이트/다크 테마 자동 전환 지원
- 피그마 파운데이션(노드ID: 3459:1131) 기반

### 타이포그래피 시스템
- 모바일/데스크톱 반응형 지원
- 영문 타이포그래피 별도 설정 가능
- 피그마 파운데이션(노드ID: 3459:1422) 기반

### 감정(Emotion) 시스템
```typescript
enum Emotion {
  Happy    // "행복해요" - red60 - emotion-happy-*.png
  Sad      // "슬퍼요"   - blue60 - emotion-sad-*.png  
  Angry    // "화나요"   - gray60 - emotion-angry-*.png
  Surprise // "놀랐어요" - yellow60 - emotion-surprise-*.png
  Etc      // "기타"     - green60 - emotion-etc-*.png
}
```

## 🧩 컴포넌트 개발 가이드

### 공통 컴포넌트 규칙
- **Variant 시스템**: primary/secondary/tertiary
- **Size 시스템**: small/medium/large
- **Theme 시스템**: light/dark
- **Storybook**: 모든 컴포넌트 스토리 작성 필수

### 레이아웃 시스템 (1168px 기준)
```
Header (60px)
Gap (24px)
Banner (240px)
Gap (24px)
Navigation (48px)
Children (auto)
Footer (160px)
```

### 페이지 컴포넌트 시스템 (1168px 기준)
```
Gap (32px)
Search (48px)
Gap (42px)
Main (936px)
Gap (40px)
Pagination (32px)
Gap (40px)
```

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅
npm run lint

# Storybook 실행
npm run storybook

# Storybook 빌드
npm run build-storybook
```

## 🛠️ 기술 스택

- **Framework**: Next.js 14.2.32
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **State Management**: @tanstack/react-query
- **Theme**: next-themes (다크모드 지원)
- **Documentation**: Storybook
- **Testing**: Vitest
- **Linting**: ESLint

## 📋 개발 프로세스

1. **와이어프레임 구조 생성** (HTML + Flexbox)
2. **피그마 디자인 연동** (MCP 활용)
3. **스타일링 적용** (CSS Module)
4. **기능 구현** (TypeScript)
5. **스토리북 작성**
6. **테스트 작성**

## 🔍 품질 관리

- **ESLint**: 코드 품질 검사
- **TypeScript**: 타입 안전성 보장
- **Vitest**: 단위 테스트
- **Storybook**: 컴포넌트 문서화

## 📚 Learn More

Next.js에 대해 더 알아보려면 다음 리소스를 참고하세요:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js 기능 및 API 학습
- [Learn Next.js](https://nextjs.org/learn) - 인터랙티브 Next.js 튜토리얼

## 🚀 Deploy on Vercel

Next.js 앱을 배포하는 가장 쉬운 방법은 Next.js 제작자들이 만든 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)을 사용하는 것입니다.

자세한 내용은 [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)을 확인하세요.