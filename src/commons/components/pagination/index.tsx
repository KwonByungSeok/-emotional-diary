"use client";

import React from "react";
import { useTheme } from "next-themes";
import styles from "./styles.module.css";

// ============================================
// Types & Interfaces
// ============================================

export interface PaginationProps {
  /** 현재 페이지 번호 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 시 호출되는 콜백 함수 */
  onPageChange: (page: number) => void;
  /** 컴포넌트 variant */
  variant?: "primary" | "secondary" | "tertiary";
  /** 컴포넌트 크기 */
  size?: "small" | "medium" | "large";
  /** 테마 강제 지정 (선택사항) */
  theme?: "light" | "dark";
  /** 표시할 최대 페이지 버튼 수 */
  maxVisiblePages?: number;
  /** 이전/다음 버튼 표시 여부 */
  showNavigationButtons?: boolean;
  /** 첫 페이지/마지막 페이지로 이동 버튼 표시 여부 */
  showBoundaryButtons?: boolean;
  /** 생략 표시(...) 사용 여부 */
  showEllipsis?: boolean;
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 비활성화 상태 */
  disabled?: boolean;
}

// ============================================
// Pagination Component
// ============================================

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = "primary",
  size = "medium",
  theme,
  maxVisiblePages = 5,
  showNavigationButtons = true,
  showBoundaryButtons = false,
  showEllipsis = true,
  className = "",
  disabled = false,
}) => {
  const { theme: systemTheme } = useTheme();
  const currentTheme = theme || systemTheme || "light";

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * 표시할 페이지 번호 배열을 생성합니다.
   */
  const getVisiblePages = (): (number | "ellipsis")[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // 끝에서 시작점 조정
    if (end === totalPages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    // 첫 페이지와 생략 표시
    if (showEllipsis && start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("ellipsis");
      }
    }

    // 중간 페이지들
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // 마지막 페이지와 생략 표시
    if (showEllipsis && end < totalPages) {
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  /**
   * 페이지 변경 핸들러
   */
  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  /**
   * 이전 페이지로 이동
   */
  const handlePrevious = () => {
    handlePageChange(currentPage - 1);
  };

  /**
   * 다음 페이지로 이동
   */
  const handleNext = () => {
    handlePageChange(currentPage + 1);
  };

  /**
   * 첫 페이지로 이동
   */
  const handleFirst = () => {
    handlePageChange(1);
  };

  /**
   * 마지막 페이지로 이동
   */
  const handleLast = () => {
    handlePageChange(totalPages);
  };

  // ============================================
  // CSS Classes
  // ============================================

  const containerClasses = [
    styles.pagination,
    styles[`pagination--${variant}`],
    styles[`pagination--${size}`],
    styles[`pagination--${currentTheme}`],
    disabled && styles["pagination--disabled"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const visiblePages = getVisiblePages();

  // ============================================
  // Render
  // ============================================

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={containerClasses}
      role="navigation"
      aria-label="페이지네이션"
      data-testid="pagination"
    >
      <ul className={styles.pagination__list} data-testid="pagination-list">
        {/* 첫 페이지 버튼 */}
        {showBoundaryButtons && (
          <li className={styles.pagination__item}>
            <button
              type="button"
              className={`${styles.pagination__button} ${styles["pagination__button--boundary"]}`}
              onClick={handleFirst}
              disabled={disabled || currentPage === 1}
              aria-label="첫 페이지로 이동"
              data-testid="pagination-first-button"
            >
              <svg
                className={styles.pagination__icon}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41z"
                  fill="currentColor"
                />
                <path d="M6 6h2v12H6V6z" fill="currentColor" />
              </svg>
            </button>
          </li>
        )}

        {/* 이전 페이지 버튼 */}
        {showNavigationButtons && (
          <li className={styles.pagination__item}>
            <button
              type="button"
              className={`${styles.pagination__button} ${styles["pagination__button--navigation"]}`}
              onClick={handlePrevious}
              disabled={disabled || currentPage === 1}
              aria-label="이전 페이지로 이동"
              data-testid="pagination-prev-button"
            >
              <svg
                className={styles.pagination__icon}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </li>
        )}

        {/* 페이지 번호들 */}
        {visiblePages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`} className={styles.pagination__item}>
                <span
                  className={styles.pagination__ellipsis}
                  aria-hidden="true"
                >
                  ...
                </span>
              </li>
            );
          }

          const isActive = page === currentPage;

          return (
            <li key={page} className={styles.pagination__item}>
              <button
                type="button"
                className={`${styles.pagination__button} ${
                  styles["pagination__button--page"]
                } ${isActive ? styles["pagination__button--active"] : ""}`}
                onClick={() => handlePageChange(page)}
                disabled={disabled}
                aria-label={`${page}페이지로 이동`}
                aria-current={isActive ? "page" : undefined}
                data-testid={`pagination-page-button-${page}`}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* 다음 페이지 버튼 */}
        {showNavigationButtons && (
          <li className={styles.pagination__item}>
            <button
              type="button"
              className={`${styles.pagination__button} ${styles["pagination__button--navigation"]}`}
              onClick={handleNext}
              disabled={disabled || currentPage === totalPages}
              aria-label="다음 페이지로 이동"
              data-testid="pagination-next-button"
            >
              <svg
                className={styles.pagination__icon}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </li>
        )}

        {/* 마지막 페이지 버튼 */}
        {showBoundaryButtons && (
          <li className={styles.pagination__item}>
            <button
              type="button"
              className={`${styles.pagination__button} ${styles["pagination__button--boundary"]}`}
              onClick={handleLast}
              disabled={disabled || currentPage === totalPages}
              aria-label="마지막 페이지로 이동"
              data-testid="pagination-last-button"
            >
              <svg
                className={styles.pagination__icon}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41z"
                  fill="currentColor"
                />
                <path d="M16 6h2v12h-2V6z" fill="currentColor" />
              </svg>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

// ============================================
// Exports
// ============================================

export default Pagination;

// Hook for easier usage
export const usePagination = (initialPage: number = 1, totalPages: number) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);

  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const goToFirst = React.useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLast = React.useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const goToPrevious = React.useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNext = React.useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  return {
    currentPage,
    handlePageChange,
    goToFirst,
    goToLast,
    goToPrevious,
    goToNext,
  };
};
