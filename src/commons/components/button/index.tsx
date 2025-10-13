"use client";

import React from "react";
import styles from "./styles.module.css";

/**
 * Button Component Props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 variant 타입
   * - primary: 주요 액션
   * - secondary: 보조 액션
   * - tertiary: 3순위 액션
   */
  variant?: "primary" | "secondary" | "tertiary";

  /**
   * 버튼 사이즈
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
   * 버튼 비활성화 여부
   */
  disabled?: boolean;

  /**
   * 버튼 내부 콘텐츠
   */
  children: React.ReactNode;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * Button Component
 * 
 * @description
 * variant, size, theme을 지원하는 범용 버튼 컴포넌트입니다.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" theme="light">
 *   클릭하세요
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      disabled = false,
      children,
      className = "",
      type = "button",
      ...restProps
    },
    ref
  ) => {
    // 클래스명 조합
    const buttonClasses = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled}
        {...restProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

