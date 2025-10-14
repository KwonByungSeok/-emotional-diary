"use client";

import React, { forwardRef, useState } from "react";
import styles from "./styles.module.css";

// ============================================
// Type Definitions
// ============================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * 입력 필드의 시각적 스타일 variant
   */
  variant?: "primary" | "secondary" | "tertiary";

  /**
   * 입력 필드의 크기
   */
  size?: "small" | "medium" | "large";

  /**
   * 테마 모드
   */
  theme?: "light" | "dark";

  /**
   * 라벨 텍스트
   */
  label?: string;

  /**
   * 플레이스홀더 텍스트
   */
  placeholder?: string;

  /**
   * 에러 상태
   */
  error?: boolean;

  /**
   * 에러 메시지
   */
  errorMessage?: string;

  /**
   * 헬프 텍스트
   */
  helpText?: string;

  /**
   * 필수 입력 여부
   */
  required?: boolean;

  /**
   * 왼쪽 아이콘 (선택사항)
   */
  leftIcon?: React.ReactNode;

  /**
   * 오른쪽 아이콘 (선택사항)
   */
  rightIcon?: React.ReactNode;

  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;

  /**
   * 테스트 ID (테스트 자동화용)
   */
  "data-testid"?: string;
}

// ============================================
// Input Component
// ============================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      label,
      placeholder = "회고를 남겨보세요.",
      error = false,
      errorMessage,
      helpText,
      required = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      "data-testid": testId,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // 고유 ID 생성 (label과 input 연결용)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // 컨테이너 클래스명 조합
    const containerClasses = [
      styles.container,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      error && styles.error,
      disabled && styles.disabled,
      isFocused && styles.focused,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // 입력 필드 클래스명 조합
    const inputClasses = [
      styles.input,
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
    ]
      .filter(Boolean)
      .join(" ");

    // 라벨 클래스명 조합
    const labelClasses = [styles.label, required && styles.required]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className={styles.asterisk}>*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className={styles.inputWrapper}>
          {/* Left Icon */}
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            data-testid={testId}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>

        {/* Helper Text or Error Message */}
        {(helpText || errorMessage) && (
          <div className={styles.messageContainer}>
            {error && errorMessage ? (
              <span className={styles.errorMessage}>{errorMessage}</span>
            ) : (
              helpText && <span className={styles.helpText}>{helpText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ============================================
// Export
// ============================================

export default Input;
