"use client";

import { useRouter } from "next/navigation";
import { URL } from "@/commons/constants/url";

// ============================================
// Types & Interfaces
// ============================================

/**
 * 라우팅 훅 결과 타입
 */
export interface DiaryLinkRoutingResult {
  navigateToDiaryDetail: (id: string | number) => void;
}

// ============================================
// Hook
// ============================================

/**
 * 일기 카드 클릭시 상세 페이지로 이동하는 라우팅 훅
 * Next.js 라우터를 사용하여 일기 상세 페이지로 이동하는 기능을 제공합니다.
 * 
 * @returns {DiaryLinkRoutingResult} 일기 상세 페이지 이동 함수를 포함한 객체
 */
export const useDiaryLinkRouting = (): DiaryLinkRoutingResult => {
  const router = useRouter();

  /**
   * 일기 상세 페이지로 이동
   * URL 상수를 사용하여 하드코딩을 방지하고 일기 상세 페이지로 이동합니다.
   * 
   * @param id - 일기 ID (문자열 또는 숫자)
   */
  const navigateToDiaryDetail = (id: string | number): void => {
    const detailPath = URL.DIARIES.DETAIL(id);
    router.push(detailPath);
  };

  return {
    navigateToDiaryDetail,
  };
};

export default useDiaryLinkRouting;
