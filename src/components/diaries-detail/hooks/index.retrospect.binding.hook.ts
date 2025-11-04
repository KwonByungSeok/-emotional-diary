"use client";

import { useState, useEffect, useCallback } from "react";
import { RetrospectData } from "./index.retrospect.form.hook";

// ============================================
// Types & Interfaces
// ============================================

/**
 * 회고 바인딩 훅 결과 타입
 */
export interface RetrospectBindingResult {
  retrospectList: RetrospectData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 회고 데이터 바인딩 훅
 * 다이나믹 라우팅된 [id]를 사용하여 로컬스토리지에서 해당 diaryId의 회고 데이터를 가져옵니다.
 * 
 * @param diaryId - 일기 ID (숫자)
 * @returns {RetrospectBindingResult} 회고 리스트와 로딩 상태를 포함한 객체
 */
export const useRetrospectBinding = (diaryId: number): RetrospectBindingResult => {
  const [retrospectList, setRetrospectList] = useState<RetrospectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬스토리지에서 회고 데이터 가져오기
   */
  const loadRetrospects = useCallback((): void => {
    try {
      setIsLoading(true);
      setError(null);

      // diaryId가 없으면 빈 배열 반환
      if (!diaryId || diaryId === 0) {
        setRetrospectList([]);
        setIsLoading(false);
        return;
      }

      // 로컬스토리지에서 데이터 가져오기
      const storedData = localStorage.getItem("retrospects");
      if (!storedData) {
        setRetrospectList([]);
        setIsLoading(false);
        return;
      }

      let allRetrospects: RetrospectData[];
      try {
        allRetrospects = JSON.parse(storedData);
      } catch {
        // JSON 파싱 실패 시 빈 배열 반환
        setRetrospectList([]);
        setIsLoading(false);
        return;
      }

      // 현재 diaryId에 해당하는 회고만 필터링
      const filteredRetrospects = allRetrospects.filter(
        (retrospect) => retrospect.diaryId === diaryId
      );

      setRetrospectList(filteredRetrospects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "회고 데이터를 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      setRetrospectList([]);
    } finally {
      setIsLoading(false);
    }
  }, [diaryId]);

  /**
   * 데이터 다시 가져오기
   */
  const refetch = (): void => {
    loadRetrospects();
  };

  // 컴포넌트 마운트 시 및 diaryId 변경 시 데이터 가져오기
  useEffect(() => {
    loadRetrospects();
  }, [loadRetrospects]);

  return {
    retrospectList,
    isLoading,
    error,
    refetch,
  };
};

export default useRetrospectBinding;

