"use client";

import { useState, useEffect, useCallback } from "react";
import { EmotionType } from "@/commons/constants/enum";

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
 * 바인딩 훅 결과 타입
 */
export interface DiaryBindingResult {
  diaryData: DiaryData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 일기 상세 데이터 바인딩 훅
 * 다이나믹 라우팅된 [id]를 사용하여 로컬스토리지에서 실제 데이터를 가져옵니다.
 * 
 * @param id - 일기 ID (문자열)
 * @returns {DiaryBindingResult} 일기 데이터와 로딩 상태를 포함한 객체
 */
export const useDiaryBinding = (id?: string): DiaryBindingResult => {
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬스토리지에서 일기 데이터 가져오기
   */
  const fetchDiaryData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // ID가 없으면 에러
      if (!id) {
        throw new Error("일기 ID가 제공되지 않았습니다.");
      }

      // 로컬스토리지에서 데이터 가져오기
      const storedData = localStorage.getItem("diaries");
      if (!storedData) {
        throw new Error("저장된 일기 데이터가 없습니다.");
      }

      let diaries: DiaryData[];
      try {
        diaries = JSON.parse(storedData);
      } catch {
        throw new Error("일기 데이터를 불러오는 중 오류가 발생했습니다");
      }
      
      // ID에 해당하는 일기 찾기
      const targetId = parseInt(id, 10);
      const foundDiary = diaries.find(diary => diary.id === targetId);
      
      if (!foundDiary) {
        throw new Error(`ID ${id}에 해당하는 일기를 찾을 수 없습니다.`);
      }

      setDiaryData(foundDiary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "일기 데이터를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      setDiaryData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  /**
   * 데이터 다시 가져오기
   */
  const refetch = (): void => {
    fetchDiaryData();
  };

  // 컴포넌트 마운트 시 및 ID 변경 시 데이터 가져오기
  useEffect(() => {
    fetchDiaryData();
  }, [id, fetchDiaryData]);

  return {
    diaryData,
    isLoading,
    error,
    refetch,
  };
};

export default useDiaryBinding;
