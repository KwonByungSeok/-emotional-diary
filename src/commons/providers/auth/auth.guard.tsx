"use client";

import React, {
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth.provider";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { checkAccess, URL } from "@/commons/constants/url";

// ============================================
// Type Definitions
// ============================================

interface AuthGuardProps {
  /**
   * 자식 컴포넌트들
   */
  children: ReactNode;
}

// ============================================
// Auth Guard Component
// ============================================

/**
 * 인증 가드 컴포넌트
 * 페이지 접근 권한을 검증하고, 권한이 없는 경우 로그인 페이지로 리다이렉트합니다.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { openModal, closeAllModals } = useModal();
  
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasShownModal, setHasShownModal] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // ============================================
  // Auth Provider Initialization Check
  // ============================================

  /**
   * AuthProvider 초기화 완료 확인
   * 최초 마운트 시 localStorage에서 토큰 확인을 통해 초기화 완료 여부 확인
   */
  useEffect(() => {
    // 클라이언트 사이드에서만 동작
    if (typeof window === "undefined") return;

    // 짧은 지연 후 초기화 완료로 간주
    // AuthProvider의 useEffect가 실행될 시간을 확보
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // ============================================
  // Authorization Check
  // ============================================

  /**
   * 권한 검증 로직
   * AuthProvider 초기화가 완료된 후에만 권한을 검증합니다.
   */
  useEffect(() => {
    // 초기화가 완료되지 않았으면 대기
    if (!isInitialized) {
      return;
    }

    // 테스트 환경 체크
    const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === "test";
    
    if (isTestEnv) {
      // 테스트 환경: 항상 로그인된 유저로 간주
      setIsChecking(false);
      setIsAuthorized(true);
      return;
    }

    // 실제 환경: 권한 검증 진행
    const hasAccess = checkAccess(pathname, isLoggedIn);
    
    if (hasAccess) {
      setIsChecking(false);
      setIsAuthorized(true);
    } else {
      // 권한이 없는 경우
      setIsChecking(false);
      setIsAuthorized(false);

      // 해당 경로에서 모달이 아직 보여지지 않았을 때만 표시
      if (!hasShownModal.includes(pathname)) {
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인 필요"
            content="이 페이지에 접근하려면 로그인이 필요합니다."
            confirmText="확인"
            onConfirm={() => {
              // 모든 모달 닫기
              closeAllModals();
              // 로그인 페이지로 이동
              window.location.href = URL.AUTH.LOGIN;
            }}
            data-testid="auth-required-modal"
          />
        );
        
        setHasShownModal(prev => [...prev, pathname]);
      }
    }
  }, [pathname, isLoggedIn, hasShownModal, isInitialized, openModal, closeAllModals]);

  // ============================================
  // Render
  // ============================================

  // 권한 검증 중이거나 권한이 없는 경우 빈 화면 표시
  if (isChecking || !isAuthorized) {
    return null;
  }

  // 권한이 있는 경우 children 렌더링
  return <>{children}</>;
};

// ============================================
// Export
// ============================================

export default AuthGuard;
