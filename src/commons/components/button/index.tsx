"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { useTheme } from "next-themes";
import styles from "./styles.module.css";

// ============================================
// Type Definitions
// ============================================

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonTheme = "light" | "dark";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 스타일 variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * 버튼의 크기
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * 버튼의 테마 (명시하지 않으면 시스템 테마 사용)
   */
  theme?: ButtonTheme;

  /**
   * 버튼 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * 버튼 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 버튼 내부 컨텐츠
   */
  children: ReactNode;

  /**
   * 왼쪽 아이콘
   */
  leftIcon?: ReactNode;

  /**
   * 오른쪽 아이콘
   */
  rightIcon?: ReactNode;

  /**
   * 클릭 핸들러
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// ============================================
// Button Component
// ============================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme,
      disabled = false,
      fullWidth = false,
      children,
      leftIcon,
      rightIcon,
      className = "",
      onClick,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const { theme: systemTheme } = useTheme();

    // theme prop이 주어지면 그것을 사용하고, 아니면 시스템 테마 사용
    const activeTheme = theme || (systemTheme as ButtonTheme) || "light";

    // 클래스명 조합
    const buttonClassNames = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${activeTheme}`],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // 클릭 핸들러
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClassNames}
        disabled={disabled}
        onClick={handleClick}
        aria-disabled={disabled}
        {...rest}
      >
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        <span className={styles.content}>{children}</span>
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
