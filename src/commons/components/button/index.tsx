import React, { forwardRef } from "react";
import styles from "./styles.module.css";

// ============================================
// Type Definitions
// ============================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 스타일 variant
   */
  variant?: "primary" | "secondary" | "tertiary";

  /**
   * 버튼의 크기
   */
  size?: "small" | "medium" | "large";

  /**
   * 테마 모드
   */
  theme?: "light" | "dark";

  /**
   * 버튼 텍스트
   */
  children: React.ReactNode;

  /**
   * 로딩 상태
   */
  loading?: boolean;

  /**
   * 아이콘 (선택사항)
   */
  icon?: React.ReactNode;

  /**
   * 아이콘 위치
   */
  iconPosition?: "left" | "right";

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
// Button Component
// ============================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      children,
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      className = "",
      disabled,
      "data-testid": testId,
      ...props
    },
    ref
  ) => {
    // 클래스명 조합
    const buttonClasses = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      loading && styles.loading,
      disabled && styles.disabled,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // 로딩 또는 비활성화 상태일 때 disabled 처리
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        data-testid={testId}
        {...props}
      >
        {loading ? (
          <span className={styles.loadingSpinner} />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className={styles.iconLeft}>{icon}</span>
            )}
            <span className={styles.text}>{children}</span>
            {icon && iconPosition === "right" && (
              <span className={styles.iconRight}>{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ============================================
// Export
// ============================================

export default Button;
