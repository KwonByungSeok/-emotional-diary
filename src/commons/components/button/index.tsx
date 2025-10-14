"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./styles.module.css";

/**
 * Button Component Props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 variant */
  variant?: "primary" | "secondary" | "tertiary";
  /** 버튼 크기 */
  size?: "small" | "medium" | "large";
  /** 버튼 테마 */
  theme?: "light" | "dark";
  /** 버튼 children */
  children: ReactNode;
  /** 전체 너비 여부 */
  fullWidth?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 아이콘 (왼쪽) */
  iconLeft?: ReactNode;
  /** 아이콘 (오른쪽) */
  iconRight?: ReactNode;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * Button Component
 * 
 * @description
 * 완전한 variant 시스템을 갖춘 버튼 컴포넌트
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" theme="light">
 *   클릭하기
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      children,
      fullWidth = false,
      disabled = false,
      iconLeft,
      iconRight,
      isLoading = false,
      className = "",
      ...props
    },
    ref
  ) => {
    // 클래스 이름 조합
    const classNames = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      styles[`button--${theme}`],
      fullWidth && styles["button--full-width"],
      isLoading && styles["button--loading"],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className={styles.button__loader}>
            <span className={styles.button__spinner} />
          </span>
        ) : (
          <>
            {iconLeft && (
              <span className={styles.button__icon_left}>{iconLeft}</span>
            )}
            <span className={styles.button__text}>{children}</span>
            {iconRight && (
              <span className={styles.button__icon_right}>{iconRight}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
