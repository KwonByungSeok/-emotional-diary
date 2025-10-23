"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { URL } from "@/commons/constants/url";
import { useState } from "react";

// ============================================
// Schema Definitions
// ============================================

/**
 * 회원가입 폼 검증 스키마
 */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다")
    .refine((email) => email.includes("@"), {
      message: "이메일에 '@'가 포함되어야 합니다",
    }),
  password: z
    .string()
    .min(8, "비밀번호는 8자리 이상이어야 합니다")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "영문과 숫자를 포함해야 합니다"),
  passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  name: z.string().min(1, "이름을 입력해주세요"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["passwordConfirm"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// ============================================
// API Types
// ============================================

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

interface CreateUserResponse {
  _id: string;
  email: string;
  name: string;
}

// ============================================
// API Functions
// ============================================

/**
 * 회원가입 API 호출 함수
 */
const createUser = async (input: CreateUserInput): Promise<CreateUserResponse> => {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation CreateUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            _id
            email
            name
          }
        }
      `,
      variables: {
        createUserInput: input,
      },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "회원가입에 실패했습니다");
  }

  return result.data.createUser;
};

// ============================================
// Hook
// ============================================

/**
 * 회원가입 폼 훅
 */
export const useSignupForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const [hasShownSuccessModal, setHasShownSuccessModal] = useState(false);
  const [hasShownErrorModal, setHasShownErrorModal] = useState(false);

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  // 모든 필드 값 감시
  const watchedValues = watch();
  const allFieldsFilled = 
    watchedValues.email && 
    watchedValues.password && 
    watchedValues.passwordConfirm && 
    watchedValues.name;

  // 회원가입 mutation
  const signupMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      if (!hasShownSuccessModal) {
        setHasShownSuccessModal(true);
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="회원가입 완료"
            content="회원가입이 성공적으로 완료되었습니다."
            onConfirm={() => {
              closeAllModals();
              router.push(URL.AUTH.LOGIN);
            }}
            data-testid="signup-success-modal"
          />
        );
      }
    },
    onError: (error) => {
      if (!hasShownErrorModal) {
        setHasShownErrorModal(true);
        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="회원가입 실패"
            content={error.message || "회원가입에 실패했습니다. 다시 시도해주세요."}
            onConfirm={() => {
              closeAllModals();
              setHasShownErrorModal(false); // 에러 모달은 다시 보여질 수 있도록 리셋
            }}
            data-testid="signup-error-modal"
          />
        );
      }
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: SignupFormData) => {
    // 이메일에 timestamp 추가하여 중복 방지
    const timestamp = Date.now();
    const emailWithTimestamp = data.email.replace("@", `+${timestamp}@`);
    
    signupMutation.mutate({
      email: emailWithTimestamp,
      password: data.password,
      name: data.name,
    });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitting: signupMutation.isPending,
    isButtonEnabled: allFieldsFilled && isValid && !signupMutation.isPending,
  };
};
