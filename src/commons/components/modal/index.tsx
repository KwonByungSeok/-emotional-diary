import React, { forwardRef, useId } from "react";
import { Button } from "../button";
import styles from "./styles.module.css";

// ============================================
// Type Definitions
// ============================================

export interface ModalProps {
  /**
   * 모달의 시각적 스타일 variant
   */
  variant?: "info" | "danger";

  /**
   * 액션 버튼의 개수
   */
  actions?: "single" | "dual";

  /**
   * 테마 모드
   */
  theme?: "light" | "dark";

  /**
   * 모달 제목
   */
  title: string;

  /**
   * 모달 내용
   */
  content: string;

  /**
   * 확인 버튼 텍스트 (기본값: "확인")
   */
  confirmText?: string;

  /**
   * 취소 버튼 텍스트 (기본값: "취소")
   */
  cancelText?: string;

  /**
   * 확인 버튼 클릭 핸들러
   */
  onConfirm: () => void;

  /**
   * 취소 버튼 클릭 핸들러 (dual actions일 때만 사용)
   */
  onCancel?: () => void;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 테스트 ID (테스트 자동화용)
   */
  "data-testid"?: string;
}

// ============================================
// Modal Component
// ============================================

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      variant = "info",
      actions = "single",
      theme = "light",
      title,
      content,
      confirmText = "확인",
      cancelText = "취소",
      onConfirm,
      onCancel,
      className = "",
      "data-testid": testId,
    },
    ref
  ) => {
    // 고유 ID 생성 (접근성용)
    const modalId = useId();
    const titleId = `${modalId}-title`;
    const contentId = `${modalId}-content`;

    // 클래스명 조합
    const modalClasses = [
      styles.modal,
      styles[`variant-${variant}`],
      styles[`actions-${actions}`],
      styles[`theme-${theme}`],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={modalClasses}
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={contentId}
        data-testid={testId}
      >
        {/* 헤더 영역 */}
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <p id={contentId} className={styles.content}>
            {content}
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.actions}>
          {actions === "single" ? (
            <Button
              variant="primary"
              theme="light"
              size="medium"
              onClick={onConfirm}
              className={styles.singleButton}
              data-testid={`${testId}-confirm`}
            >
              {confirmText}
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                theme="light"
                size="medium"
                onClick={onCancel}
                className={styles.cancelButton}
                data-testid={`${testId}-cancel`}
              >
                {cancelText}
              </Button>
              <Button
                variant="primary"
                theme="light"
                size="medium"
                onClick={onConfirm}
                className={styles.confirmButton}
                data-testid={`${testId}-confirm`}
              >
                {confirmText}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

// ============================================
// Export
// ============================================

export default Modal;
