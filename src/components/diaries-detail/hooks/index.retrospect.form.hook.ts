"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

// ============================================
// Types & Interfaces
// ============================================

/**
 * 회고 데이터 타입
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 폼 데이터 타입
 */
export interface RetrospectFormData {
  content: string;
}

/**
 * 폼 검증 스키마
 */
const retrospectFormSchema = z.object({
  content: z.string().min(1, "회고를 입력해주세요.").trim(),
});

// ============================================
// Hook
// ============================================

/**
 * 회고 등록 폼 훅
 * 
 * @param diaryId - 일기 ID
 * @param onSaved - 저장 완료 후 콜백 함수 (선택사항)
 * @returns {UseRetrospectFormResult} 폼 관련 함수와 상태를 포함한 객체
 */
export interface UseRetrospectFormResult {
  register: ReturnType<typeof useForm<RetrospectFormData>>["register"];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: ReturnType<typeof useForm<RetrospectFormData>>["formState"]["errors"];
  isFormValid: boolean;
  watchedValues: RetrospectFormData;
}

export const useRetrospectForm = (
  diaryId: number,
  onSaved?: () => void
): UseRetrospectFormResult => {
  const router = useRouter();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<RetrospectFormData>({
    resolver: zodResolver(retrospectFormSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  // 현재 폼 값들 감시
  const watchedValues = watch();

  /**
   * 로컬스토리지에서 기존 회고 데이터 가져오기
   */
  const getExistingRetrospects = (): RetrospectData[] => {
    try {
      const existingData = localStorage.getItem("retrospects");
      return existingData ? JSON.parse(existingData) : [];
    } catch (error) {
      console.error("로컬스토리지 데이터 읽기 실패:", error);
      return [];
    }
  };

  /**
   * 새로운 ID 생성
   */
  const generateNewId = (existingRetrospects: RetrospectData[]): number => {
    if (existingRetrospects.length === 0) {
      return 1;
    }
    const maxId = Math.max(...existingRetrospects.map(retrospect => retrospect.id));
    return maxId + 1;
  };

  /**
   * 로컬스토리지에 회고 저장
   */
  const saveRetrospectToStorage = (retrospectData: RetrospectData): void => {
    try {
      const existingRetrospects = getExistingRetrospects();
      const updatedRetrospects = [...existingRetrospects, retrospectData];
      localStorage.setItem("retrospects", JSON.stringify(updatedRetrospects));
    } catch (error) {
      console.error("로컬스토리지 저장 실패:", error);
      throw new Error("회고 저장에 실패했습니다.");
    }
  };

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: RetrospectFormData) => {
    try {
      const existingRetrospects = getExistingRetrospects();
      const newId = generateNewId(existingRetrospects);
      
      const newRetrospect: RetrospectData = {
        id: newId,
        content: data.content,
        diaryId: diaryId,
        createdAt: new Date().toISOString(),
      };

      saveRetrospectToStorage(newRetrospect);
      reset(); // 폼 초기화
      
      // 저장 완료 콜백 호출
      if (onSaved) {
        onSaved();
      }
      
      // 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("회고 등록 실패:", error);
      // 에러 처리 (필요시 에러 모달 표시)
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isFormValid: isValid,
    watchedValues,
  };
};

export default useRetrospectForm;

