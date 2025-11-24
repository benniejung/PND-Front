# ✨ 미션 제목

예상하고, 다루고, 복구하라: 에러 핸들링 리팩토링 미션

## 사이트 URL

https://p-end.netlify.app/

## 1. 프로젝트 개요

이 프로젝트는 기존 로그인/회원가입 기능 중심의 React 애플리케이션을
에러 핸들링, 입력 검증, 개발 환경, 타입 안정성 측면에서 전면 리팩토링한 프로젝트입니다.

이번 미션의 목표는 단순히 로그인 기능을 ‘작동하게 만드는 것’이 아니라,
사용자가 마주치는 흐름 하나하나를 다시 들여다보며
**에러와 친해지고, 사용자 경험을 해치지 않는 UI를 만들기 위한 리팩토링**에 있다.

그동안 대회나 단기 프로젝트 중심으로 개발을 진행해왔기 때문에, 기능 구현에 집중하느라 에러 처리나 구조적인 설계는 깊게 고민하지 못했다.

따라서 이번 기회에 이전에 했던 프로젝트 기반으로 그동안 **가볍게 넘겼던 기능들을 처리해보기로 했다. 에러핸들링, CRA에서 Vite로의 전환 이유** 등 ‘왜 이렇게 동작하는가’를 파고들며 리팩토링을 진행했다.

### 1.1 수행 내용

<b>✔ Supabase 기반 로그인/회원가입 에러 핸들링 구조 설계 및 구현</b>

- 예상 / 예기치 못한 에러 분리

- Error Factory를 통한 에러 표준화

- 사용자 친화적 에러 메시지 매핑 구축

<b>✔ React Hook Form + Zod 기반 입력 검증 고도화</b>

- 비제어 컴포넌트 기반 폼 구성

- 스키마 기반 유효성 검사

- 렌더링 / 검증 / 오류 메시지 완전 분리

<b>✔ React Query 기반 서버 에러 흐름 정리</b>

- 서버 응답을 표준 에러 객체로 변환

- 클라이언트에서 일관된 에러 처리 가능

<b>✔ CRA → Vite 마이그레이션 + TypeScript 도입</b>

- 빌드 속도 대폭 개선

- 개발 환경 최적화

- 타입 안정성 확보

```
src/
├── components/
│   └── Common/
│       └── error/
│           ├── type/
│           │   └── error.type.ts       # 에러 타입 및 코드 정의
│           └── utils/
│               └── errorFactory.ts     # 에러 변환 및 메시지 생성
├── pages/
│   ├── error/
│   │   ├── ErrorPage.tsx               # React Router 에러 바운더리
│   │   └── NotFoundPage.tsx            # 404 페이지
│   ├── login/
│   │   └── LoginPage.tsx               # 로그인 페이지 (에러 처리 예시)
│   └── signup/
│       └── SignupPage.tsx              # 회원가입 페이지 (에러 처리 예시)
└── supabase/
    └── users/
        └── hooks/
            └── useLoginMutation.ts      # React Query Mutation (에러 처리)
            └── useLogoutMutation.ts      # React Query Mutation (에러 처리)
            └── useSignupMutation.ts      # React Query Mutation (에러 처리)

```

---

## 2. 에러 처리 체크리스트

### 구현된 기능

- ✅ 타입 안전한 에러 클래스 계층 구조
- ✅ Supabase 에러를 프로젝트 표준 에러로 변환
- ✅ 사용자 친화적인 에러 메시지 제공
- ✅ React Query와의 통합
- ✅ React Router 에러 바운더리
- ✅ 컴포넌트 레벨 ErrorBoundary
- ✅ Toast 메시지를 통한 에러 표시

---

## 3. 참고 파일

### 프로젝트 내 관련 파일

- `src/components/Common/error/type/error.type.ts`: 에러 타입 정의
- `src/components/Common/error/utils/errorFactory.ts`: 에러 팩토리
- `src/pages/error/ErrorPage.tsx`: 에러 페이지
- `src/pages/login/LoginPage.tsx`: 로그인 페이지 (에러 처리 예시)
- `src/components/Login/LoginForm.tsx`: 로그인 폼 (에러 처리 예시)
- `src/supabase/users/hooks/useLoginMutaion.ts`: React Query Mutation

### 외부 라이브러리

- `@supabase/supabase-js`: Supabase 클라이언트
- `@tanstack/react-query`: 데이터 페칭 및 상태 관리
- `react-router-dom`: 라우팅 및 에러 바운더리
- `react-error-boundary`: 컴포넌트 에러 바운더리
- `react-hot-toast`: Toast 메시지
- `zod`: 폼 검증

## 🚀 기술 스택

- **React**
- **TypeScript**
- **Vite**
- **Supabase**
- **React Query**
- **React Hook Form**
- **Zod**
- **Styled-Components**
- **React Router**
