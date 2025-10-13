/**
 * URL 경로 상수 및 메타데이터 관리
 */

import { AccessLevel } from "./enum";

// 페이지 레이아웃 설정 타입
export interface PageLayout {
  header: {
    visible: boolean;
    logo: boolean;
    darkModeToggle: boolean;
  };
  banner: boolean;
  navigation: boolean;
  footer: boolean;
}

// URL 메타데이터 타입
export interface UrlMetadata {
  path: string;
  accessLevel: AccessLevel;
  layout: PageLayout;
}

/**
 * URL 경로 상수
 */
export const URL = {
  // 인증 관련
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },

  // 일기 관련
  DIARIES: {
    LIST: "/diaries",
    /**
     * 일기 상세 페이지 경로 생성
     * @param id - 일기 ID
     * @returns 일기 상세 페이지 경로
     */
    DETAIL: (id: string | number): string => `/diaries/${id}`,
  },

  // 사진 관련
  PICTURES: {
    LIST: "/pictures",
  },
} as const;

/**
 * URL별 메타데이터
 */
export const URL_METADATA: Record<string, UrlMetadata> = {
  // 로그인
  "/auth/login": {
    path: "/auth/login",
    accessLevel: AccessLevel.PUBLIC,
    layout: {
      header: {
        visible: false,
        logo: false,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: false,
    },
  },

  // 회원가입
  "/auth/signup": {
    path: "/auth/signup",
    accessLevel: AccessLevel.PUBLIC,
    layout: {
      header: {
        visible: false,
        logo: false,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: false,
    },
  },

  // 일기목록
  "/diaries": {
    path: "/diaries",
    accessLevel: AccessLevel.PUBLIC,
    layout: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  },

  // 일기상세 (다이나믹 라우팅)
  "/diaries/[id]": {
    path: "/diaries/[id]",
    accessLevel: AccessLevel.MEMBER_ONLY,
    layout: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: true,
    },
  },

  // 사진목록
  "/pictures": {
    path: "/pictures",
    accessLevel: AccessLevel.PUBLIC,
    layout: {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  },
};

/**
 * 현재 경로의 메타데이터 가져오기
 * @param pathname - 현재 경로
 * @returns URL 메타데이터 또는 undefined
 */
export const getUrlMetadata = (pathname: string): UrlMetadata | undefined => {
  // 정확한 경로 매칭
  if (URL_METADATA[pathname]) {
    return URL_METADATA[pathname];
  }

  // 다이나믹 라우팅 패턴 매칭
  if (pathname.startsWith("/diaries/") && pathname !== "/diaries") {
    return URL_METADATA["/diaries/[id]"];
  }

  return undefined;
};

/**
 * 접근 권한 체크
 * @param pathname - 현재 경로
 * @param isLoggedIn - 로그인 상태
 * @returns 접근 가능 여부
 */
export const checkAccess = (pathname: string, isLoggedIn: boolean): boolean => {
  const metadata = getUrlMetadata(pathname);

  if (!metadata) {
    return true; // 메타데이터가 없으면 기본적으로 허용
  }

  if (metadata.accessLevel === AccessLevel.MEMBER_ONLY) {
    return isLoggedIn;
  }

  return true; // public은 항상 접근 가능
};

/**
 * 레이아웃 설정 가져오기
 * @param pathname - 현재 경로
 * @returns 페이지 레이아웃 설정 또는 기본값
 */
export const getPageLayout = (pathname: string): PageLayout => {
  const metadata = getUrlMetadata(pathname);

  if (!metadata) {
    // 기본 레이아웃 설정
    return {
      header: {
        visible: true,
        logo: true,
        darkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    };
  }

  return metadata.layout;
};
