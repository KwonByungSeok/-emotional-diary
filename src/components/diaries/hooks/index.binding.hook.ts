"use client";

import { useState, useEffect, useCallback } from "react";

import { EmotionType } from "@/commons/constants/enum";
import { DiaryData } from "@/commons/types/diary";

// ============================================
// Types & Interfaces
// ============================================


/**
 * 바인딩 훅 결과 타입
 */
export interface DiariesBindingResult {
  diaries: DiaryData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 일기 목록 데이터 바인딩 훅
 * 로컬스토리지에서 실제 일기 데이터를 가져와서 목록으로 반환합니다.
 * 
 * @returns {DiariesBindingResult} 일기 목록 데이터와 로딩 상태를 포함한 객체
 */
export const useDiariesBinding = (): DiariesBindingResult => {
  const [diaries, setDiaries] = useState<DiaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬스토리지에서 일기 목록 데이터 가져오기
   */
  const fetchDiariesData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // 로컬스토리지에서 데이터 가져오기
      const storedData = localStorage.getItem("diaries");
      if (!storedData) {
        // 데이터가 없으면 빈 배열로 설정
        setDiaries([]);
        return;
      }

      let diariesData: DiaryData[];
      try {
        diariesData = JSON.parse(storedData);
      } catch {
        throw new Error("일기 데이터를 불러오는 중 오류가 발생했습니다");
      }
      
      // 데이터 유효성 검사
      if (!Array.isArray(diariesData)) {
        throw new Error("일기 데이터 형식이 올바르지 않습니다");
      }

      // 각 일기 데이터의 유효성 검사
      const validDiaries = diariesData.filter((diary) => {
        return (
          diary &&
          typeof diary.id === "number" &&
          typeof diary.title === "string" &&
          typeof diary.content === "string" &&
          Object.values(EmotionType).includes(diary.emotion) &&
          typeof diary.createdAt === "string"
        );
      });

      setDiaries(validDiaries);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "일기 데이터를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      setDiaries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 데이터 다시 가져오기
   */
  const refetch = (): void => {
    fetchDiariesData();
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchDiariesData();
  }, [fetchDiariesData]);

  return {
    diaries,
    isLoading,
    error,
    refetch,
  };
};

export default useDiariesBinding;
