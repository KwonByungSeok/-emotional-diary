"use client";

import React, { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth.provider";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { URL } from "@/commons/constants/url";

// ============================================
// Type Definitions
// ============================================

/**
 * Window 인터페이스 확장 (테스트 환경 변수 추가)
 */
declare global {
  interface Window {
    /**
     * 테스트 환경에서 로그인 검사 패스 여부
     * - true 또는 undefined: 로그인 검사 패스
     * - false: 로그인 검사 수행
     */
    __TEST_BYPASS__?: boolean;
  }
}

/**
 * 인가 실패 처리 옵션
 */
export interface GuardOptions {
  /**
   * 모달 제목 (기본값: "로그인 필요")
   */
  title?: string;

  /**
   * 모달 내용 (기본값: "로그인하시겠습니까?")
   */
  content?: string;

  /**
   * 확인 버튼 텍스트 (기본값: "로그인하러가기")
   */
  confirmText?: string;

  /**
   * 취소 버튼 텍스트 (기본값: "취소")
   */
  cancelText?: string;
}

// ============================================
// Helper Functions
// ============================================

/**
 * 테스트 환경 여부 확인
 */
const isTestEnv = (): boolean => {
  return process.env.NEXT_PUBLIC_TEST_ENV === "test";
};

/**
 * 테스트 바이패스 여부 확인
 */
const shouldBypassAuth = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const isTest = isTestEnv();
  
  // 실제 환경: 항상 비로그인 유저를 기본으로 하여 로그인 검사 수행
  if (!isTest) {
    return false;
  }
  
  // 테스트 환경: 기본적으로 로그인 유저로 간주하여 패스
  // 단, window.__TEST_BYPASS__가 false이면 검사 수행
  if (window.__TEST_BYPASS__ === false) {
    return false;
  }
  
  // 테스트 환경에서 window.__TEST_BYPASS__가 undefined이거나 true인 경우 패스
  return true;
};

// ============================================
// Auth Guard Hook
// ============================================

/**
 * 인증 가드 훅
 * 함수 호출 시점에 권한을 검증하고, 권한이 없는 경우 모달을 노출합니다.
 * 
 * @returns 인가 검증 함수
 * 
 * @example
 * ```tsx
 * const { checkAuth } = useAuthGuard();
 * 
 * const handleAction = () => {
 *   if (!checkAuth()) {
 *     return; // 인가 실패 시 함수 실행 중단
 *   }
 *   // 인가 성공 시 로직 실행
 *   console.log("인가된 액션 실행");
 * };
 * ```
 */
export const useAuthGuard = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { openModal, closeAllModals } = useModal();
  
  // 모달이 이미 표시되었는지 추적 (같은 상황에서 다시 나타나지 않도록)
  const hasShownModalRef = useRef(false);

  /**
   * 인가 검증 함수
   * @param options - 인가 실패 시 모달 옵션
   * @returns 인가 성공 여부
   */
  const checkAuth = useCallback((options?: GuardOptions): boolean => {
    // 테스트 환경에서 바이패스 가능한 경우
    if (shouldBypassAuth()) {
      return true;
    }

    // 로그인 여부 확인
    if (isLoggedIn) {
      // 로그인 상태이면 인가 성공
      hasShownModalRef.current = false; // 성공 시 모달 표시 플래그 리셋
      return true;
    }

    // 비로그인 상태이면 인가 실패
    // 모달이 이미 표시된 경우 다시 표시하지 않음
    if (hasShownModalRef.current) {
      return false;
    }

    // 모달 옵션 설정
    const {
      title = "로그인 필요",
      content = "로그인하시겠습니까?",
      confirmText = "로그인하러가기",
      cancelText = "취소",
    } = options || {};

    // 모달 표시 플래그 설정
    hasShownModalRef.current = true;

    // 로그인하시겠습니까 모달 노출
    openModal(
      <Modal
        variant="info"
        actions="dual"
        title={title}
        content={content}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          // '로그인하러가기' 클릭
          // 1. 열려있는 모든 모달을 닫기
          closeAllModals();
          // 2. 로그인 페이지로 이동
          router.push(URL.AUTH.LOGIN);
          // 모달 표시 플래그 리셋
          hasShownModalRef.current = false;
        }}
        onCancel={() => {
          // '취소' 클릭
          // 1. 열려있는 모든 모달을 닫기
          closeAllModals();
          // 모달 표시 플래그 리셋
          hasShownModalRef.current = false;
        }}
        data-testid="auth-required-modal"
      />
    );

    return false;
  }, [isLoggedIn, openModal, closeAllModals, router]);

  return {
    checkAuth,
  };
};

// ============================================
// Export
// ============================================

export default useAuthGuard;
