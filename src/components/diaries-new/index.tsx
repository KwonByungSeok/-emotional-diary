"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { EmotionType, getAllEmotions } from "@/commons/constants/enum";
import { useModalClose } from "./hooks/index.link.modal.close.hook";
import { useDiaryForm } from "./hooks/index.form.hook";

// ============================================
// Types & Interfaces
// ============================================

export interface DiariesNewProps {
  /** 추가 CSS 클래스명 */
  className?: string;
}

// ============================================
// DiariesNew Component
// ============================================

export const DiariesNew: React.FC<DiariesNewProps> = ({ className = "" }) => {
  // 반응형 상태 관리
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // 폼 훅
  const {
    register,
    handleSubmit,
    errors,
    isFormValid,
    watchedValues,
    setEmotion,
  } = useDiaryForm();

  // 모달 훅
  const { openCancelModal } = useModalClose();

  // 감정 데이터
  const emotions = getAllEmotions();

  // 컨테이너 클래스명 조합
  const containerClasses = [styles.wrapper, className]
    .filter(Boolean)
    .join(" ");

  // 감정 선택 핸들러
  const handleEmotionSelect = (emotionType: EmotionType) => {
    setEmotion(emotionType);
  };

  // 닫기 핸들러
  const handleClose = () => {
    openCancelModal();
  };

  return (
    <div className={containerClasses} data-testid="diaries-new-modal">
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerTitle}>일기 쓰기</span>
      </div>

      {/* Gap 1 */}
      <div className={styles.gap1}></div>

      {/* Emotion Box */}
      <div className={styles.emotionBox}>
        <span className={styles.emotionTitle}>오늘 기분은 어땠나요?</span>
        <div className={styles.emotionRadioGroup}>
          {emotions.map((emotion) => (
            <label key={emotion.type} className={styles.emotionRadioItem}>
              <input
                type="radio"
                name="emotion"
                value={emotion.type}
                checked={watchedValues.emotion === emotion.type}
                onChange={() => handleEmotionSelect(emotion.type)}
                className={styles.emotionRadioInput}
                data-testid={`emotion-${emotion.type.toLowerCase()}`}
              />
              <span className={styles.emotionRadioLabel}>{emotion.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gap 2 */}
      <div className={styles.gap2}></div>

      {/* Input Title */}
      <div className={styles.inputTitle}>
        <Input
          label="제목"
          placeholder={isMobile ? "제목을 입력해 주세요." : "제목을 입력합니다."}
          {...register("title")}
          variant="primary"
          theme="light"
          size="medium"
          fullWidth={isMobile}
          data-testid="diary-title-input"
        />
        {errors.title && (
          <span className={styles.errorMessage} data-testid="title-error">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Gap 3 */}
      <div className={styles.gap3}></div>

      {/* Input Content */}
      <div className={styles.inputContent}>
        <label className={styles.contentLabel}>내용</label>
        <textarea
          placeholder={isMobile ? "내용을 입력해 주세요." : "내용을 입력합니다."}
          {...register("content")}
          className={styles.contentTextarea}
          rows={5}
          data-testid="diary-content-textarea"
        />
        {errors.content && (
          <span className={styles.errorMessage} data-testid="content-error">
            {errors.content.message}
          </span>
        )}
      </div>

      {/* Gap 4 */}
      <div className={styles.gap4}></div>

      {/* Footer */}
      <div className={styles.footer}>
        <Button
          variant="secondary"
          theme="light"
          size="large"
          onClick={handleClose}
          fullWidth={isMobile}
        >
          닫기
        </Button>
        <Button
          variant="primary"
          theme="light"
          size="large"
          onClick={handleSubmit}
          disabled={!isFormValid}
          data-testid="diaries-submit-button"
          fullWidth={isMobile}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
};

// ============================================
// Export
// ============================================

export default DiariesNew;
