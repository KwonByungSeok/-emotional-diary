"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { DiaryData } from "./index.binding.hook";

// ============================================
// Types & Interfaces
// ============================================

/**
 * 페이지네이션 훅 결과 타입
 */
export interface DiariesPaginationResult {
  /** 현재 페이지 번호 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 한 페이지당 아이템 수 */
  itemsPerPage: number;
  /** 현재 페이지에 표시할 일기 목록 */
  currentPageDiaries: DiaryData[];
  /** 페이지 변경 핸들러 */
  handlePageChange: (page: number) => void;
  /** 첫 페이지로 이동 */
  resetToFirstPage: () => void;
}

// ============================================
// Hook
// ============================================

/**
 * 일기 페이지네이션 기능 훅
 * 필터링된 일기 목록을 페이지 단위로 나누어 관리합니다.
 * 
 * @param {DiaryData[]} filteredDiaries - 페이지네이션할 일기 목록 (검색 및 필터링된 결과)
 * @param {number} itemsPerPage - 한 페이지당 표시할 일기 수 (기본값: 12)
 * @returns {DiariesPaginationResult} 페이지네이션 관련 상태와 함수를 포함한 객체
 */
export const useDiariesPagination = (
  filteredDiaries: DiaryData[],
  itemsPerPage: number = 12
): DiariesPaginationResult => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  /**
   * 전체 페이지 수 계산
   */
  const totalPages = useMemo(() => {
    if (filteredDiaries.length === 0) {
      return 1;
    }
    return Math.ceil(filteredDiaries.length / itemsPerPage);
  }, [filteredDiaries.length, itemsPerPage]);

  /**
   * 유효한 현재 페이지 계산 (필터링된 목록 변경 시 페이지 범위 자동 조정)
   */
  const validatedCurrentPage = useMemo(() => {
    const calculatedTotalPages = filteredDiaries.length === 0 
      ? 1 
      : Math.ceil(filteredDiaries.length / itemsPerPage);
    
    if (calculatedTotalPages === 0) {
      return 1;
    }
    if (currentPage > calculatedTotalPages) {
      return calculatedTotalPages;
    }
    if (currentPage < 1) {
      return 1;
    }
    return currentPage;
  }, [currentPage, filteredDiaries.length, itemsPerPage]);

  // 필터링된 목록 변경 시 현재 페이지 범위 자동 조정
  useEffect(() => {
    if (validatedCurrentPage !== currentPage) {
      setCurrentPage(validatedCurrentPage);
    }
  }, [validatedCurrentPage, currentPage]);

  /**
   * 현재 페이지에 해당하는 일기 목록 계산
   */
  const currentPageDiaries = useMemo(() => {
    const startIndex = (validatedCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDiaries.slice(startIndex, endIndex);
  }, [filteredDiaries, validatedCurrentPage, itemsPerPage]);

  /**
   * 페이지 변경 핸들러
   * 유효한 페이지 번호인지 확인 후 페이지를 변경합니다.
   * 
   * @param {number} page - 이동할 페이지 번호
   */
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === validatedCurrentPage) {
      return;
    }
    setCurrentPage(page);
  }, [totalPages, validatedCurrentPage]);

  /**
   * 첫 페이지로 이동
   * 검색이나 필터 변경 시 호출됩니다.
   */
  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage: validatedCurrentPage,
    totalPages,
    itemsPerPage,
    currentPageDiaries,
    handlePageChange,
    resetToFirstPage,
  };
};

export default useDiariesPagination;

