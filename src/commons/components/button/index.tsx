import React from "react";
import styles from "./styles.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 스타일 변형
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
   * 버튼의 전체 너비 사용 여부
   */
  fullWidth?: boolean;
  
  /**
   * 버튼의 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 버튼 내부 컨텐츠
   */
  children: React.ReactNode;
}

/**
 * Button 컴포넌트
 * 
 * 다양한 variant, size, theme를 지원하는 범용 버튼 컴포넌트입니다.
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
      fullWidth = false,
      disabled = false,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    // 클래스명 조합
    const buttonClassName = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      fullWidth ? styles.fullWidth : "",
      disabled ? styles.disabled : "",
      className || "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

