"use client";

import { useCallback } from "react";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";

// ============================================
// Types & Interfaces
// ============================================

export interface UseModalCloseResult {
  /**
   * 등록취소모달을 여는 함수
   */
  openCancelModal: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 일기쓰기 모달의 닫기 기능을 관리하는 훅
 * 닫기 버튼 클릭 시 등록취소모달을 열고, 해당 모달의 액션을 처리합니다.
 * 
 * @returns {UseModalCloseResult} 등록취소모달 열기 함수를 포함한 객체
 */
export const useModalClose = (): UseModalCloseResult => {
  const { openModal, closeModal } = useModal();

  /**
   * 등록취소모달을 여는 함수
   * 일기쓰기폼모달(부모) 위에 등록취소모달(자식)을 2중 모달로 overlay합니다.
   */
  const openCancelModal = useCallback((): void => {
    const cancelModalContent = (
      <Modal
        variant="info"
        actions="dual"
        title="등록을 취소하시겠습니까?"
        content="작성 중인 내용이 모두 사라집니다."
        confirmText="등록취소"
        cancelText="계속작성"
        onConfirm={() => {
          // 등록취소모달(자식)과 일기쓰기폼모달(부모)를 모두 종료
          closeModal(); // 등록취소모달 닫기
          closeModal(); // 일기쓰기폼모달 닫기
        }}
        onCancel={() => {
          // 등록취소모달(자식)만 종료
          closeModal();
        }}
        data-testid="diaries-cancel-modal"
      />
    );

    openModal(cancelModalContent);
  }, [openModal, closeModal]);

  return {
    openCancelModal,
  };
};

// ============================================
// Export
// ============================================

export default useModalClose;
