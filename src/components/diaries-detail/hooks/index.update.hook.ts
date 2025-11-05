"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
 * 폼 데이터 타입
 */
export interface DiaryUpdateFormData {
  title: string;
  content: string;
  emotion: EmotionType;
}

/**
 * 폼 검증 스키마
 */
const diaryUpdateFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").trim(),
  content: z.string().min(1, "내용을 입력해주세요.").trim(),
  emotion: z.nativeEnum(EmotionType).refine((val) => val !== undefined, {
    message: "감정을 선택해주세요.",
  }),
});

/**
 * 훅 결과 타입
 */
export interface UseDiaryUpdateFormResult {
  register: ReturnType<typeof useForm<DiaryUpdateFormData>>["register"];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: ReturnType<typeof useForm<DiaryUpdateFormData>>["formState"]["errors"];
  isFormValid: boolean;
  watchedValues: DiaryUpdateFormData;
  setEmotion: (emotion: EmotionType) => void;
  reset: (values?: Partial<DiaryUpdateFormData>) => void;
}

// ============================================
// Hook
// ============================================

/**
 * 일기 수정 폼 훅
 * 
 * @param diaryId - 일기 ID
 * @param initialData - 초기 데이터 (기존 일기 데이터)
 * @param onSaved - 저장 완료 후 콜백 함수
 * @returns {UseDiaryUpdateFormResult} 폼 관련 함수와 상태를 포함한 객체
 */
export const useDiaryUpdateForm = (
  diaryId: number,
  initialData: DiaryData | null,
  onSaved?: () => void
): UseDiaryUpdateFormResult => {
  const router = useRouter();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<DiaryUpdateFormData>({
    resolver: zodResolver(diaryUpdateFormSchema),
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      emotion: initialData?.emotion || EmotionType.HAPPY,
    },
  });

  // 초기 데이터가 변경되면 폼 값 업데이트
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
        emotion: initialData.emotion,
      });
    }
  }, [initialData, reset]);

  // 현재 폼 값들 감시
  const watchedValues = watch();

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
   * 로컬스토리지에 일기 업데이트
   */
  const updateDiaryInStorage = (updatedDiary: DiaryData): void => {
    try {
      const existingDiaries = getExistingDiaries();
      const updatedDiaries = existingDiaries.map((diary) =>
        diary.id === updatedDiary.id ? updatedDiary : diary
      );
      localStorage.setItem("diaries", JSON.stringify(updatedDiaries));
    } catch (error) {
      console.error("로컬스토리지 업데이트 실패:", error);
      throw new Error("일기 수정에 실패했습니다.");
    }
  };

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: DiaryUpdateFormData) => {
    try {
      if (!initialData) {
        throw new Error("일기 데이터가 없습니다.");
      }

      const updatedDiary: DiaryData = {
        ...initialData,
        title: data.title,
        content: data.content,
        emotion: data.emotion,
      };

      updateDiaryInStorage(updatedDiary);
      
      // 저장 완료 콜백 호출
      if (onSaved) {
        onSaved();
      }
      
      // 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error("일기 수정 실패:", error);
      // 에러 처리 (필요시 에러 모달 표시)
    }
  };

  /**
   * 감정 설정 헬퍼 함수
   */
  const setEmotion = (emotion: EmotionType) => {
    setValue("emotion", emotion, { shouldValidate: true });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isFormValid: isValid,
    watchedValues,
    setEmotion,
    reset,
  };
};

export default useDiaryUpdateForm;

