import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

// ============================================
// Types
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonTheme = 'light' | 'dark';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 변형 (기본값: 'primary')
   */
  variant?: ButtonVariant;
  
  /**
   * 버튼 크기 (기본값: 'medium')
   */
  size?: ButtonSize;
  
  /**
   * 테마 (기본값: 'light')
   */
  theme?: ButtonTheme;
  
  /**
   * 비활성화 상태
   */
  disabled?: boolean;
  
  /**
   * 전체 너비 사용
   */
  fullWidth?: boolean;
  
  /**
   * 버튼 내용
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
   * 추가 CSS 클래스명
   */
  className?: string;
}

// ============================================
// Component
// ============================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      disabled = false,
      fullWidth = false,
      children,
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    // 버튼 클래스명 조합
    const buttonClasses = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      styles[`button--${theme}`],
      fullWidth && styles['button--full-width'],
      disabled && styles['button--disabled'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span className={styles.button__icon}>{leftIcon}</span>}
        <span className={styles.button__content}>{children}</span>
        {rightIcon && <span className={styles.button__icon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

