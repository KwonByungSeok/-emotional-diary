"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { EmotionType } from "@/commons/constants/enum";
import { URL } from "@/commons/constants/url";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";

// ============================================
// Types & Schema
// ============================================

/**
 * 일기 데이터 타입
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
export interface DiaryFormData {
  title: string;
  content: string;
  emotion: EmotionType;
}

/**
 * 폼 검증 스키마
 */
const diaryFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요.").trim(),
  content: z.string().min(1, "내용을 입력해주세요.").trim(),
  emotion: z.nativeEnum(EmotionType).refine((val) => val !== undefined, {
    message: "감정을 선택해주세요.",
  }),
});

// ============================================
// Hook
// ============================================

/**
 * 일기 등록 폼 훅
 */
export const useDiaryForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<DiaryFormData>({
    resolver: zodResolver(diaryFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      emotion: undefined,
    },
  });

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
   * 새로운 ID 생성
   */
  const generateNewId = (existingDiaries: DiaryData[]): number => {
    if (existingDiaries.length === 0) {
      return 1;
    }
    const maxId = Math.max(...existingDiaries.map(diary => diary.id));
    return maxId + 1;
  };

  /**
   * 로컬스토리지에 일기 저장
   */
  const saveDiaryToStorage = (diaryData: DiaryData): void => {
    try {
      const existingDiaries = getExistingDiaries();
      const updatedDiaries = [...existingDiaries, diaryData];
      localStorage.setItem("diaries", JSON.stringify(updatedDiaries));
    } catch (error) {
      console.error("로컬스토리지 저장 실패:", error);
      throw new Error("일기 저장에 실패했습니다.");
    }
  };

  /**
   * 등록 완료 모달 표시
   */
  const showSuccessModal = (diaryId: number) => {
    const handleConfirm = () => {
      closeAllModals();
      router.push(URL.DIARIES.DETAIL(diaryId));
    };

    openModal(
      <Modal
        variant="info"
        actions="single"
        title="등록 완료"
        content="일기가 성공적으로 등록되었습니다."
        confirmText="확인"
        onConfirm={handleConfirm}
        data-testid="diary-success-modal"
      />
    );
  };

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: DiaryFormData) => {
    try {
      const existingDiaries = getExistingDiaries();
      const newId = generateNewId(existingDiaries);
      
      const newDiary: DiaryData = {
        id: newId,
        title: data.title,
        content: data.content,
        emotion: data.emotion,
        createdAt: new Date().toISOString(),
      };

      saveDiaryToStorage(newDiary);
      showSuccessModal(newId);
      reset(); // 폼 초기화
    } catch (error) {
      console.error("일기 등록 실패:", error);
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
    // Form 관련
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    watchedValues,
    
    // 헬퍼 함수들
    setEmotion,
    reset,
    
    // 상태
    isFormValid: isValid,
  };
};

export default useDiaryForm;
