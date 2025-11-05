"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { EmotionType } from "@/commons/constants/enum";
import { URL } from "@/commons/constants/url";

// ============================================
// Types & Interfaces
// ============================================

/**
 * 일기 데이터 타입 (로컬스토리지와 일치)
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 삭제 훅 결과 타입
 */
export interface UseDiaryDeleteResult {
  /**
   * 일기를 삭제하는 함수
   * 로컬스토리지에서 해당 일기를 제거하고 /diaries 페이지로 이동합니다.
   */
  deleteDiary: (diaryId: number) => void;
}

// ============================================
// Hook
// ============================================

/**
 * 일기 삭제 훅
 * 로컬스토리지에서 일기를 삭제하고 일기 목록 페이지로 이동합니다.
 * 
 * @returns {UseDiaryDeleteResult} 삭제 함수를 포함한 객체
 */
export const useDiaryDelete = (): UseDiaryDeleteResult => {
  const router = useRouter();

  /**
   * 로컬스토리지에서 기존 일기 데이터 가져오기
   */
  const getExistingDiaries = (): DiaryData[] => {
    try {
      const existingData = localStorage.getItem("diaries");
      return existingData ? JSON.parse(existingData) : [];
    } catch (error) {
      console.error("로컬스토리지 데이터 읽기 실패:", error);
      return [];
    }
  };

  /**
   * 일기 삭제 함수
   * 로컬스토리지에서 해당 일기를 제거하고 /diaries 페이지로 이동합니다.
   * 
   * @param diaryId - 삭제할 일기 ID
   */
  const deleteDiary = useCallback((diaryId: number): void => {
    try {
      const existingDiaries = getExistingDiaries();
      
      // 해당 ID의 일기를 제거
      const filteredDiaries = existingDiaries.filter(
        (diary) => diary.id !== diaryId
      );
      
      // 로컬스토리지에 업데이트된 일기 목록 저장
      localStorage.setItem("diaries", JSON.stringify(filteredDiaries));
      
      // 일기 목록 페이지로 이동
      router.push(URL.DIARIES.LIST);
    } catch (error) {
      console.error("일기 삭제 실패:", error);
      throw new Error("일기 삭제에 실패했습니다.");
    }
  }, [router]);

  return {
    deleteDiary,
  };
};

export default useDiaryDelete;

