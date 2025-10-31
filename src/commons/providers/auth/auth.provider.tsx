"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { URL } from "@/commons/constants/url";

// ============================================
// Type Definitions
// ============================================

/**
 * 사용자 정보 타입
 */
export interface User {
  _id: string;
  name: string;
}

/**
 * 인증 컨텍스트 타입 정의
 */
interface AuthContextType {
  /**
   * 현재 로그인 상태
   */
  isLoggedIn: boolean;

  /**
   * 현재 로그인한 사용자 정보
   */
  user: User | null;

  /**
   * 로그인 페이지로 이동하는 함수
   */
  login: () => void;

  /**
   * 로그아웃 처리하는 함수
   */
  logout: () => void;
}

/**
 * 인증 프로바이더 Props 타입 정의
 */
interface AuthProviderProps {
  /**
   * 자식 컴포넌트들
   */
  children: ReactNode;
}

// ============================================
// Context & Hook
// ============================================

/**
 * 인증 컨텍스트 생성
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 인증 컨텍스트 훅
 * @returns 인증 컨텍스트 값
 * @throws Error - AuthProvider 외부에서 사용 시 에러 발생
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// ============================================
// Helper Functions
// ============================================

/**
 * 로컬 스토리지에서 accessToken 가져오기
 */
const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 */
const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

// ============================================
// Auth Provider Component
// ============================================

/**
 * 인증 프로바이더 컴포넌트
 * 로그인 상태와 사용자 정보를 관리하고 전역 인증 상태를 제공합니다.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // ============================================
  // Auth State Update Functions
  // ============================================

  /**
   * 인증 상태를 로컬 스토리지에서 동기화
   */
  const syncAuthState = useCallback(() => {
    const token = getAccessToken();
    const userData = getUser();
    
    setIsLoggedIn(token !== null);
    setUser(userData);
  }, []);

  // ============================================
  // Auth Actions
  // ============================================

  /**
   * 로그인 페이지로 이동하는 함수
   */
  const login = useCallback(() => {
    router.push(URL.AUTH.LOGIN);
  }, [router]);

  /**
   * 로그아웃 처리하는 함수
   */
  const logout = useCallback(() => {
    // 로컬 스토리지에서 accessToken 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    
    // 상태 업데이트
    syncAuthState();
    
    // 로그인 페이지로 이동
    router.push(URL.AUTH.LOGIN);
  }, [router, syncAuthState]);

  // ============================================
  // Effects
  // ============================================

  /**
   * 초기 인증 상태 동기화
   */
  useEffect(() => {
    syncAuthState();
  }, [syncAuthState]);

  /**
   * 로컬 스토리지 변경 감지 (다른 탭의 변경 감지)
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === "user") {
        syncAuthState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [syncAuthState]);

  /**
   * 커스텀 이벤트로 같은 탭 내 로컬 스토리지 변경 감지
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCustomStorageChange = () => {
      syncAuthState();
    };

    window.addEventListener("auth-storage-change", handleCustomStorageChange);
    
    return () => {
      window.removeEventListener("auth-storage-change", handleCustomStorageChange);
    };
  }, [syncAuthState]);

  /**
   * 페이지 포커스 시 인증 상태 동기화 (같은 탭 내 변경 감지)
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocus = () => {
      syncAuthState();
    };

    window.addEventListener("focus", handleFocus);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [syncAuthState]);

  // ============================================
  // Context Value
  // ============================================

  const authValue: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  // ============================================
  // Render
  // ============================================

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// Export
// ============================================

export default AuthProvider;

