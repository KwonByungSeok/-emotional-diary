"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { URL } from "@/commons/constants/url";

// ============================================
// Schema & Types
// ============================================

/**
 * 로그인 폼 스키마
 */
const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요").email("올바른 이메일 형식이 아닙니다").refine(
    (email) => email.includes("@"),
    { message: "이메일에 '@'가 포함되어야 합니다" }
  ),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

/**
 * 로그인 폼 데이터 타입
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 로그인 API 응답 타입
 */
interface LoginResponse {
  accessToken: string;
}

/**
 * 사용자 정보 API 응답 타입
 */
interface UserResponse {
  _id: string;
  name: string;
}

// ============================================
// API Functions
// ============================================

/**
 * 로그인 API 호출
 */
const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await fetch("https://main-practice.codebootcamp.co.kr/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            accessToken
          }
        }
      `,
      variables: {
        email: data.email,
        password: data.password,
      },
    }),
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || "로그인에 실패했습니다");
  }

  return result.data.loginUser;
};

/**
 * 로그인된 사용자 정보 조회 API 호출
 */
const fetchUserLoggedIn = async (accessToken: string): Promise<UserResponse> => {
  const response = await fetch("https://main-practice.codebootcamp.co.kr/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
        query FetchUserLoggedIn {
          fetchUserLoggedIn {
            _id
            name
          }
        }
      `,
    }),
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || "사용자 정보 조회에 실패했습니다");
  }

  return result.data.fetchUserLoggedIn;
};

// ============================================
// Hook
// ============================================

/**
 * 로그인 폼 훅
 */
export const useAuthLoginForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  // React Hook Form 설정
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, formState: { isValid, errors }, watch, control } = form;

  // 폼 값 감시
  const watchedValues = watch();
  const isFormFilled = watchedValues.email && watchedValues.password;

  // 로그인 mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (loginResponse) => {
      try {
        // 로컬 스토리지에 accessToken 저장
        localStorage.setItem("accessToken", loginResponse.accessToken);

        // 사용자 정보 조회
        const userResponse = await fetchUserLoggedIn(loginResponse.accessToken);
        
        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem("user", JSON.stringify({
          _id: userResponse._id,
          name: userResponse.name,
        }));

        // 성공 모달 표시
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인 성공"
            content="로그인이 완료되었습니다."
            onConfirm={() => {
              closeAllModals();
              router.push(URL.DIARIES.LIST);
            }}
            data-testid="login-success-modal"
          />
        );
      } catch {
        // 사용자 정보 조회 실패 시 실패 모달 표시
        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="로그인 실패"
            content="사용자 정보를 가져오는데 실패했습니다."
            onConfirm={() => {
              closeAllModals();
            }}
            data-testid="login-error-modal"
          />
        );
      }
    },
    onError: (error) => {
      // 로그인 실패 모달 표시
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="로그인 실패"
          content={error.message || "로그인에 실패했습니다."}
          onConfirm={() => {
            closeAllModals();
          }}
          data-testid="login-error-modal"
        />
      );
    },
  });

  // 폼 제출 핸들러
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return {
    // Form 관련
    control,
    errors,
    onSubmit,
    isValid,
    isFormFilled,
    
    // Loading 상태
    isLoading: loginMutation.isPending,
    
    // Form methods (control 제외)
    register: form.register,
    setValue: form.setValue,
    getValues: form.getValues,
    reset: form.reset,
    clearErrors: form.clearErrors,
    setError: form.setError,
    trigger: form.trigger,
    formState: form.formState,
  };
};