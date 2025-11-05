"use client";

import React, { useCallback } from "react";

import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { DiaryData } from "@/commons/types/diary";

// ============================================
// Type Definitions
// ============================================


/**
 * 일기 삭제 훅 반환 타입
 */
export interface DiariesDeleteResult {
  /**
   * 일기 삭제 함수
   * @param diaryId - 삭제할 일기 ID
   */
  deleteDiary: (diaryId: number) => void;
}

// ============================================
// Helper Functions
// ============================================

/**
 * 로컬스토리지에서 일기 목록 조회
 */
const getDiariesFromStorage = (): DiaryData[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const diariesJson = localStorage.getItem("diaries");
    if (!diariesJson) return [];
    
    const diaries = JSON.parse(diariesJson);
    return Array.isArray(diaries) ? diaries : [];
  } catch (error) {
    console.error("일기 데이터 조회 실패:", error);
    return [];
  }
};

/**
 * 로컬스토리지에 일기 목록 저장
 */
const saveDiariesToStorage = (diaries: DiaryData[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("diaries", JSON.stringify(diaries));
  } catch (error) {
    console.error("일기 데이터 저장 실패:", error);
  }
};

/**
 * 특정 ID의 일기 삭제
 */
const removeDiaryById = (diaryId: number): void => {
  const diaries = getDiariesFromStorage();
  const filteredDiaries = diaries.filter(diary => diary.id !== diaryId);
  saveDiariesToStorage(filteredDiaries);
};

// ============================================
// Delete Hook
// ============================================

/**
 * 일기 삭제 훅
 * 권한 검사 후 삭제 모달을 표시하고, 확인 시 일기를 삭제합니다.
 * 
 * @returns 일기 삭제 관련 함수들
 * 
 * @example
 * ```tsx
 * const { deleteDiary } = useDiariesDelete();
 * 
 * const handleDelete = () => {
 *   deleteDiary(diaryId);
 * };
 * ```
 */
export const useDiariesDelete = (): DiariesDeleteResult => {
  const { checkAuth } = useAuthGuard();
  const { openModal, closeAllModals } = useModal();

  /**
   * 일기 삭제 함수
   */
  const deleteDiary = useCallback((diaryId: number) => {
    // 권한 검사
    if (!checkAuth({
      title: "로그인 필요",
      content: "일기를 삭제하려면 로그인이 필요합니다.",
      confirmText: "로그인하러가기",
      cancelText: "취소"
    })) {
      return;
    }

    // 삭제 확인 모달 표시
    openModal(
      React.createElement(Modal, {
        variant: "danger",
        actions: "dual",
        title: "일기 삭제",
        content: "일기를 삭제 하시겠어요?",
        confirmText: "삭제",
        cancelText: "취소",
        onConfirm: () => {
          // 삭제 실행
          removeDiaryById(diaryId);
          
          // 모달 닫기
          closeAllModals();
          
          // 페이지 새로고침
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        },
        onCancel: () => {
          // 모달 닫기
          closeAllModals();
        },
        "data-testid": "diary-delete-modal"
      })
    );
  }, [checkAuth, openModal, closeAllModals]);

  return {
    deleteDiary,
  };
};

// ============================================
// Export
// ============================================

export default useDiariesDelete;