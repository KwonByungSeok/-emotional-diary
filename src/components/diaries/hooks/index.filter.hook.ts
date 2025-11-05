"use client";

import { useMemo } from "react";
import { DiaryData } from "@/commons/types/diary";
import { EmotionType } from "@/commons/constants/enum";

// ============================================
// Types & Interfaces
// ============================================

/**
 * 필터 훅 결과 타입
 */
export interface DiariesFilterResult {
  filteredDiaries: DiaryData[];
}

// ============================================
// Hook
// ============================================

/**
 * 일기 필터 기능 훅
 * 검색된 일기 목록을 emotion으로 필터링하여 반환합니다.
 * 
 * @param {DiaryData[]} diaries - 필터링할 일기 목록 (검색된 결과)
 * @param {string} selectedFilter - 선택된 필터 값 ("all" 또는 EmotionType)
 * @returns {DiariesFilterResult} 필터링된 일기 목록을 포함한 객체
 */
export const useDiariesFilter = (
  diaries: DiaryData[],
  selectedFilter: string
): DiariesFilterResult => {
  /**
   * 필터링된 일기 목록
   * - selectedFilter가 "all"이면 모든 일기 반환
   * - selectedFilter가 특정 emotion이면 해당 emotion과 일치하는 일기만 반환
   */
  const filteredDiaries = useMemo(() => {
    if (selectedFilter === "all") {
      return diaries;
    }

    // EmotionType enum 값인지 확인
    const emotionType = selectedFilter as EmotionType;
    if (Object.values(EmotionType).includes(emotionType)) {
      return diaries.filter((diary) => diary.emotion === emotionType);
    }

    // 유효하지 않은 필터 값이면 모든 일기 반환
    return diaries;
  }, [diaries, selectedFilter]);

  return {
    filteredDiaries,
  };
};

export default useDiariesFilter;

