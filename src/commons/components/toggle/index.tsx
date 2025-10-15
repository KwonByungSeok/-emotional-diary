"use client";

import React, { forwardRef, useState, useCallback } from "react";
import styles from "./styles.module.css";

// ============================================
// Type Definitions
// ============================================

export interface ToggleProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  /**
   * 토글의 시각적 스타일 variant
   */
  variant?: "primary" | "secondary" | "tertiary";

  /**
   * 토글의 크기
   */
  size?: "small" | "medium" | "large";

  /**
   * 테마 모드
   */
  theme?: "light" | "dark";

  /**
   * 토글 상태 (제어 컴포넌트)
   */
  checked?: boolean;

  /**
   * 기본 토글 상태 (비제어 컴포넌트)
   */
  defaultChecked?: boolean;

  /**
   * 토글 상태 변경 핸들러
   */
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  /**
   * 라벨 텍스트 (사용되지 않음 - 토글 버튼만 사용)
   * @deprecated 토글 글자 제거로 인해 사용되지 않습니다
   */
  label?: string;

  /**
   * 라벨 위치 (사용되지 않음 - 토글 버튼만 사용)
   * @deprecated 토글 글자 제거로 인해 사용되지 않습니다
   */
  labelPosition?: "left" | "right";

  /**
   * 설명 텍스트 (사용되지 않음 - 토글 버튼만 사용)
   * @deprecated 토글 글자 제거로 인해 사용되지 않습니다
   */
  description?: string;

  /**
   * 에러 상태
   */
  error?: boolean;

  /**
   * 에러 메시지
   */
  errorMessage?: string;

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
// Toggle Component
// ============================================

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      checked,
      defaultChecked = false,
      onChange,
      label: _label, // eslint-disable-line @typescript-eslint/no-unused-vars
      labelPosition: _labelPosition = "right", // eslint-disable-line @typescript-eslint/no-unused-vars
      description: _description, // eslint-disable-line @typescript-eslint/no-unused-vars
      error = false,
      errorMessage,
      fullWidth = false,
      className = "",
      disabled = false,
      "data-testid": testId,
      id,
      ...props
    },
    ref
  ) => {
    // 내부 상태 관리 (비제어 컴포넌트용)
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    // 제어/비제어 컴포넌트 처리
    const isControlled = checked !== undefined;
    const toggleChecked = isControlled ? checked : internalChecked;

    // 고유 ID 생성
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

    // 토글 상태 변경 핸들러
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = event.target.checked;

        if (!isControlled) {
          setInternalChecked(newChecked);
        }

        onChange?.(newChecked, event);
      },
      [isControlled, onChange]
    );

    // 토글 스위치 클릭 핸들러
    const handleToggleClick = useCallback(
      (event: React.MouseEvent) => {
        if (disabled) return;

        event.preventDefault();
        const newChecked = !toggleChecked;

        if (!isControlled) {
          setInternalChecked(newChecked);
        }

        // 가상의 input change 이벤트 생성
        const syntheticEvent = {
          target: { checked: newChecked },
          currentTarget: { checked: newChecked },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange?.(newChecked, syntheticEvent);
      },
      [disabled, toggleChecked, isControlled, onChange]
    );

    // 컨테이너 클래스명 조합
    const containerClasses = [
      styles.container,
      styles[`theme-${theme}`],
      error && styles.error,
      disabled && styles.disabled,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // 토글 스위치 클래스명 조합
    const toggleClasses = [
      styles.toggle,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      toggleChecked && styles.checked,
      disabled && styles.disabled,
      error && styles.error,
    ]
      .filter(Boolean)
      .join(" ");

    // 토글 컨텐츠 렌더링
    const toggleContent = (
      <div className={styles.toggleWrapper}>
        <input
          ref={ref}
          id={toggleId}
          type="checkbox"
          className={styles.input}
          checked={toggleChecked}
          onChange={handleChange}
          disabled={disabled}
          data-testid={testId}
          {...props}
        />
        <div className={toggleClasses} onClick={handleToggleClick}>
          <div className={styles.thumb} />
        </div>
      </div>
    );

    return (
      <div className={containerClasses}>
        {/* 토글 스위치만 렌더링 */}
        {toggleContent}

        {/* 에러 메시지 */}
        {error && errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
