"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
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
 * 
 * @returns {DiaryModalLinkResult} 모달 열기/닫기 함수를 포함한 객체
 */
export const useDiaryModalLink = (): DiaryModalLinkResult => {
  const { openModal, closeModal } = useModal();

  /**
   * 일기쓰기 모달을 엽니다.
   * DiariesNew 컴포넌트를 모달로 표시합니다.
   */
  const openDiaryWriteModal = (): void => {
    openModal(<DiariesNew />);
  };

  /**
   * 모달을 닫습니다.
   * 현재 열려있는 모달을 닫습니다.
   */
  const closeDiaryWriteModal = (): void => {
    closeModal();
  };

  return {
    openDiaryWriteModal,
    closeDiaryWriteModal,
  };
};
