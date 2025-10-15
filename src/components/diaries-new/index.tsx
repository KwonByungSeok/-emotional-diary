"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { EmotionType, getAllEmotions } from "@/commons/constants/enum";

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
  // State 관리
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 감정 데이터
  const emotions = getAllEmotions();

  // 컨테이너 클래스명 조합
  const containerClasses = [styles.wrapper, className]
    .filter(Boolean)
    .join(" ");

  // 감정 선택 핸들러
  const handleEmotionSelect = (emotionType: EmotionType) => {
    setSelectedEmotion(emotionType);
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    if (!selectedEmotion || !title.trim() || !content.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    
    // TODO: 실제 등록 로직 구현
    console.log({
      emotion: selectedEmotion,
      title: title.trim(),
      content: content.trim(),
    });
  };

  // 닫기 핸들러
  const handleClose = () => {
    // TODO: 실제 닫기 로직 구현
    console.log("닫기");
  };

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>일기 쓰기</h1>
      </div>

      {/* Gap 1 */}
      <div className={styles.gap1}></div>

      {/* Emotion Box */}
      <div className={styles.emotionBox}>
        <h2 className={styles.emotionTitle}>오늘 기분은 어땠나요?</h2>
        <div className={styles.emotionRadioGroup}>
          {emotions.map((emotion) => (
            <label key={emotion.type} className={styles.emotionRadioItem}>
              <input
                type="radio"
                name="emotion"
                value={emotion.type}
                checked={selectedEmotion === emotion.type}
                onChange={() => handleEmotionSelect(emotion.type)}
                className={styles.emotionRadioInput}
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
          placeholder="제목을 입력합니다."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="primary"
          theme="light"
          size="medium"
        />
      </div>

      {/* Gap 3 */}
      <div className={styles.gap3}></div>

      {/* Input Content */}
      <div className={styles.inputContent}>
        <label className={styles.contentLabel}>내용</label>
        <textarea
          placeholder="내용을 입력합니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.contentTextarea}
          rows={5}
        />
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
        >
          닫기
        </Button>
        <Button
          variant="primary"
          theme="light"
          size="large"
          onClick={handleSubmit}
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
