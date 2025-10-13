"use client";

import React from "react";
import styles from "./styles.module.css";

/**
 * Input Component Props
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Input variant 타입
   * - primary: 주요 입력
   * - secondary: 보조 입력
   * - tertiary: 3순위 입력
   */
  variant?: "primary" | "secondary" | "tertiary";

  /**
   * Input 사이즈
   * - small: 작은 크기
   * - medium: 중간 크기 (기본값)
   * - large: 큰 크기
   */
  size?: "small" | "medium" | "large";

  /**
   * 테마 모드
   * - light: 라이트 모드
   * - dark: 다크 모드
   */
  theme?: "light" | "dark";

  /**
   * Input 비활성화 여부
   */
  disabled?: boolean;

  /**
   * 에러 상태 여부
   */
  error?: boolean;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * Input Component
 *
 * @description
 * variant, size, theme을 지원하는 범용 Input 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Input
 *   variant="primary"
 *   size="medium"
 *   theme="light"
 *   placeholder="입력하세요"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      disabled = false,
      error = false,
      className = "",
      type = "text",
      ...restProps
    },
    ref
  ) => {
    // 클래스명 조합
    const inputClasses = [
      styles.input,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      disabled && styles.disabled,
      error && styles.error,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        disabled={disabled}
        {...restProps}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;

