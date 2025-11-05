"use client";

import { useState, useCallback } from "react";
import { DiaryData } from "@/commons/types/diary";

// ============================================
// Types & Interfaces
// ============================================

/**
 * 검색 훅 결과 타입
 */
export interface DiariesSearchResult {
  searchTerm: string;
  filteredDiaries: DiaryData[];
  executeSearch: (term: string) => void;
  clearSearch: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 일기 검색 기능 훅
 * 검색어를 받아서 title에 포함된 일기만 필터링하여 반환합니다.
 * 
 * @param {DiaryData[]} diaries - 검색할 일기 목록
 * @returns {DiariesSearchResult} 검색어와 필터링된 일기 목록을 포함한 객체
 */
export const useDiariesSearch = (diaries: DiaryData[]): DiariesSearchResult => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  /**
   * 검색 실행 함수
   * 검색어가 빈 문자열이면 모든 일기를 반환하고,
   * 검색어가 있으면 title에 검색어가 포함된 일기만 필터링합니다.
   * 
   * @param {string} term - 검색어
   */
  const executeSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  /**
   * 검색 초기화 함수
   */
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  /**
   * 검색어로 필터링된 일기 목록
   * - 검색어가 빈 문자열이면 모든 일기 반환
   * - 검색어가 있으면 title에 검색어가 포함된 일기만 반환 (대소문자 구분 없음)
   */
  const filteredDiaries = searchTerm.trim() === ""
    ? diaries
    : diaries.filter((diary) =>
        diary.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return {
    searchTerm,
    filteredDiaries,
    executeSearch,
    clearSearch,
  };
};

export default useDiariesSearch;

