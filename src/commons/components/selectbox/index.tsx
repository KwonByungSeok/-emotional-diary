"use client";

import React, { forwardRef, useState, useRef, useEffect, useId } from "react";
import styles from "./styles.module.css";

// ============================================
// Type Definitions
// ============================================

export interface SelectOption {
  /**
   * 옵션 값
   */
  value: string;
  /**
   * 옵션 라벨 (화면에 표시되는 텍스트)
   */
  label: string;
  /**
   * 옵션 비활성화 여부
   */
  disabled?: boolean;
}

export interface SelectBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * 셀렉트박스의 시각적 스타일 variant
   */
  variant?: "primary" | "secondary" | "tertiary";

  /**
   * 셀렉트박스의 크기
   */
  size?: "small" | "medium" | "large";

  /**
   * 테마 모드
   */
  theme?: "light" | "dark";

  /**
   * 선택 가능한 옵션들
   */
  options: SelectOption[];

  /**
   * 현재 선택된 값
   */
  value?: string;

  /**
   * 기본 선택된 값
   */
  defaultValue?: string;

  /**
   * 플레이스홀더 텍스트
   */
  placeholder?: string;

  /**
   * 라벨 텍스트
   */
  label?: string;

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
   * 필수 선택 여부
   */
  required?: boolean;

  /**
   * 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;

  /**
   * 드롭다운 열림/닫힘 상태 변경 콜백
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * 값 변경 콜백
   */
  onChange?: (value: string, option: SelectOption) => void;

  /**
   * 테스트 ID (테스트 자동화용)
   */
  "data-testid"?: string;
}

// ============================================
// SelectBox Component
// ============================================

export const SelectBox = forwardRef<HTMLDivElement, SelectBoxProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      options = [],
      value,
      defaultValue,
      placeholder = "선택해주세요",
      label,
      error = false,
      errorMessage,
      helpText,
      required = false,
      disabled = false,
      fullWidth = false,
      onOpenChange,
      onChange,
      className = "",
      "data-testid": testId,
      id,
      ...props
    },
    ref
  ) => {
    // State 관리
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(
      value || defaultValue || ""
    );
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // Refs
    const selectRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // 선택된 옵션 찾기
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );

    // 유니크 ID 생성 (hydration 불일치 방지)
    const generatedId = useId();
    const selectId = id || generatedId;
    const listId = `${selectId}-list`;
    const triggerAriaLabel = `${selectId}-trigger`;

    // 클래스명 조합
    const containerClasses = [
      styles.container,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const triggerClasses = [
      styles.trigger,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      error && styles.error,
      disabled && styles.disabled,
      isOpen && styles.open,
    ]
      .filter(Boolean)
      .join(" ");

    const dropdownClasses = [
      styles.dropdown,
      styles[`theme-${theme}`],
      isOpen && styles.open,
    ]
      .filter(Boolean)
      .join(" ");

    // 드롭다운 열기/닫기 토글
    const toggleDropdown = () => {
      if (disabled) return;
      const newOpenState = !isOpen;
      setIsOpen(newOpenState);
      setFocusedIndex(-1);
      onOpenChange?.(newOpenState);
    };

    // 옵션 선택
    const selectOption = (option: SelectOption) => {
      if (option.disabled) return;

      setSelectedValue(option.value);
      setIsOpen(false);
      setFocusedIndex(-1);
      onChange?.(option.value, option);
      onOpenChange?.(false);
    };

    // 키보드 네비게이션
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (!isOpen) {
            toggleDropdown();
          } else if (focusedIndex >= 0) {
            const focusedOption = options[focusedIndex];
            if (focusedOption && !focusedOption.disabled) {
              selectOption(focusedOption);
            }
          }
          break;

        case "Escape":
          if (isOpen) {
            setIsOpen(false);
            setFocusedIndex(-1);
            onOpenChange?.(false);
            triggerRef.current?.focus();
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            toggleDropdown();
          } else {
            const nextIndex =
              focusedIndex < options.length - 1 ? focusedIndex + 1 : 0;
            setFocusedIndex(nextIndex);
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            toggleDropdown();
          } else {
            const prevIndex =
              focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
            setFocusedIndex(prevIndex);
          }
          break;

        case "Home":
          if (isOpen) {
            e.preventDefault();
            setFocusedIndex(0);
          }
          break;

        case "End":
          if (isOpen) {
            e.preventDefault();
            setFocusedIndex(options.length - 1);
          }
          break;
      }
    };

    // 외부 클릭으로 드롭다운 닫기
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setFocusedIndex(-1);
          onOpenChange?.(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen, onOpenChange]);

    // value prop이 변경될 때 내부 상태 업데이트
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    return (
      <div className={containerClasses} ref={ref} {...props}>
        {/* Label */}
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {/* Select Container */}
        <div
          ref={selectRef}
          className={styles.selectContainer}
          data-testid={testId}
        >
          {/* Trigger Button */}
          <button
            ref={triggerRef}
            type="button"
            id={selectId}
            className={triggerClasses}
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={triggerAriaLabel}
            aria-describedby={
              error && errorMessage
                ? `${selectId}-error`
                : helpText
                ? `${selectId}-help`
                : undefined
            }
          >
            <span className={styles.value}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span
              className={`${styles.arrow} ${
                isOpen ? styles.arrowUp : styles.arrowDown
              }`}
              aria-hidden="true"
            >
              <img
                src="/icons/arrow_drop_down.svg"
                alt=""
                width="8.6"
                height="4.7"
              />
            </span>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <ul
              ref={listRef}
              id={listId}
              className={dropdownClasses}
              role="listbox"
              aria-labelledby={triggerAriaLabel}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  className={`${styles.option} ${
                    option.value === selectedValue ? styles.selected : ""
                  } ${index === focusedIndex ? styles.focused : ""} ${
                    option.disabled ? styles.optionDisabled : ""
                  }`}
                  role="option"
                  aria-selected={option.value === selectedValue}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() =>
                    !option.disabled && setFocusedIndex(index)
                  }
                >
                  <span className={styles.optionText}>{option.label}</span>
                  {option.value === selectedValue && (
                    <span className={styles.optionIcon}>
                      <img
                        src="/icons/check_outline_light_xs.svg"
                        alt=""
                        width="16"
                        height="16"
                      />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Help Text */}
        {helpText && !error && (
          <div id={`${selectId}-help`} className={styles.helpText}>
            {helpText}
          </div>
        )}

        {/* Error Message */}
        {error && errorMessage && (
          <div id={`${selectId}-error`} className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

SelectBox.displayName = "SelectBox";

// ============================================
// Export
// ============================================

export default SelectBox;
