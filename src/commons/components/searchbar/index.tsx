"use client";

import React, { forwardRef, useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { SearchbarVariant, SearchbarSize, SearchbarTheme } from "@/commons/constants/enum";

// ============================================
// Type Definitions
// ============================================

export interface SearchbarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * 검색바의 시각적 스타일 variant
   */
  variant?: SearchbarVariant;

  /**
   * 검색바의 크기
   */
  size?: SearchbarSize;

  /**
   * 테마 모드
   */
  theme?: SearchbarTheme;

  /**
   * 플레이스홀더 텍스트
   */
  placeholder?: string;

  /**
   * 검색 아이콘 표시 여부
   */
  showSearchIcon?: boolean;

  /**
   * 클리어 버튼 표시 여부
   */
  showClearButton?: boolean;

  /**
   * 검색 실행 콜백 함수
   */
  onSearch?: (value: string) => void;

  /**
   * 클리어 콜백 함수
   */
  onClear?: () => void;

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
// Searchbar Component
// ============================================

export const Searchbar = forwardRef<HTMLInputElement, SearchbarProps>(
  (
    {
      variant = SearchbarVariant.PRIMARY,
      size = SearchbarSize.MEDIUM,
      theme = SearchbarTheme.LIGHT,
      placeholder = "검색어를 입력해 주세요.",
      showSearchIcon = true,
      showClearButton = true,
      onSearch,
      onClear,
      fullWidth = false,
      className = "",
      disabled,
      "data-testid": testId,
      id,
      value,
      onChange,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");

    // 고유 ID 생성
    const searchbarId =
      id || `searchbar-${Math.random().toString(36).substr(2, 9)}`;

    // 컨테이너 클래스명 조합
    const containerClasses = [
      styles.container,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
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
      showSearchIcon && styles.hasSearchIcon,
      showClearButton && inputValue && styles.hasClearButton,
    ]
      .filter(Boolean)
      .join(" ");

    // 검색 실행 함수
    const handleSearch = () => {
      if (onSearch) {
        onSearch(String(inputValue));
      }
    };

    // 클리어 함수
    const handleClear = () => {
      setInputValue("");
      if (onClear) {
        onClear();
      }
      // 포커스 유지
      if (ref && "current" in ref && ref.current) {
        ref.current.focus();
      }
    };

    // 입력값 변경 처리
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      if (onChange) {
        onChange(e);
      }
    };

    // 키보드 이벤트 처리
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <div className={containerClasses}>
        <div className={styles.inputWrapper}>
          {/* Search Icon */}
          {showSearchIcon && (
            <button
              type="button"
              className={styles.searchIcon}
              onClick={handleSearch}
              disabled={disabled}
              aria-label="검색"
            >
              <Image
                src="/icons/search_outline_light_m.svg"
                alt="검색"
                width={24}
                height={24}
                className={styles.searchIconImage}
              />
            </button>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={searchbarId}
            type="text"
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            data-testid={testId}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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

          {/* Clear Button */}
          {showClearButton && inputValue && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="검색어 지우기"
            >
              <Image
                src="/icons/close_outline_light_s.svg"
                alt="지우기"
                width={20}
                height={20}
                className={styles.clearButtonImage}
              />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Searchbar.displayName = "Searchbar";

// ============================================
// Export
// ============================================

export default Searchbar;
