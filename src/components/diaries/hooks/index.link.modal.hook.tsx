"use client";

import { useCallback } from "react";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import { DiariesNew } from "@/components/diaries-new";

// ============================================
// Type Definitions
// ============================================

interface DiaryModalLinkResult {
  openDiaryWriteModal: () => void;
  closeDiaryWriteModal: () => void;
}

// ============================================
// Custom Hooks
// ============================================

/**
 * 일기쓰기 모달 링크 훅
 * 모달을 열고 닫는 기능을 제공합니다.
 * 권한 검사를 통해 비로그인 유저는 로그인 요청 모달을, 로그인 유저는 일기쓰기 모달을 표시합니다.
 * 
 * @returns {DiaryModalLinkResult} 모달 열기/닫기 함수를 포함한 객체
 */
export const useDiaryModalLink = (): DiaryModalLinkResult => {
  const { openModal, closeModal } = useModal();
  const { checkAuth } = useAuthGuard();

  /**
   * 일기쓰기 모달을 엽니다.
   * 권한 검사를 통해 비로그인 유저는 로그인 요청 모달을, 로그인 유저는 일기쓰기 모달을 표시합니다.
   */
  const openDiaryWriteModal = useCallback((): void => {
    // 권한 검사: 로그인 유저인 경우에만 일기쓰기 모달 열기
    if (checkAuth()) {
      openModal(<DiariesNew />);
    }
    // 비로그인 유저인 경우 checkAuth()가 false를 반환하고 로그인 요청 모달을 표시함
  }, [checkAuth, openModal]);

  /**
   * 모달을 닫습니다.
   * 현재 열려있는 모달을 닫습니다.
   */
  const closeDiaryWriteModal = useCallback((): void => {
    closeModal();
  }, [closeModal]);

  return {
    openDiaryWriteModal,
    closeDiaryWriteModal,
  };
};

// ============================================
// Export
// ============================================

export default useDiaryModalLink;
