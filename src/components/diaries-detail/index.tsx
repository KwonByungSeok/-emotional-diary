"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/commons/components/button";
import { Input } from "@/commons/components/input";
import { EmotionType, getAllEmotions, getEmotionData, getEmotionImage, getEmotionLabel } from "@/commons/constants/enum";
import { useDiaryBinding } from "./hooks/index.binding.hook";
import { useRetrospectForm } from "./hooks/index.retrospect.form.hook";
import { useRetrospectBinding } from "./hooks/index.retrospect.binding.hook";
import { useDiaryUpdateForm } from "./hooks/index.update.hook";
import styles from "./styles.module.css";

// ============================================
// Types & Interfaces
// ============================================

export interface DiariesDetailProps {
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 일기 ID */
  id?: string;
}

// ============================================
// DiariesDetail Component
// ============================================

export const DiariesDetail: React.FC<DiariesDetailProps> = ({
  className,
  id,
}) => {
  // 수정 모드 상태 관리
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 실제 데이터 바인딩
  const { diaryData, isLoading, error, refetch } = useDiaryBinding(id);
  
  // 회고 폼 훅
  const diaryId = diaryData?.id || (id ? parseInt(id, 10) : 0);
  
  // 회고 데이터 바인딩 훅
  const { retrospectList, refetch: refetchRetrospects } = useRetrospectBinding(diaryId);
  
  // 일기 수정 폼 훅
  const {
    register: updateRegister,
    handleSubmit: updateHandleSubmit,
    errors: updateErrors,
    isFormValid: isUpdateFormValid,
    watchedValues: updateWatchedValues,
    setEmotion: setUpdateEmotion,
  } = useDiaryUpdateForm(diaryId, diaryData, () => {
    setIsEditMode(false);
    refetch();
  });
  
  const {
    register,
    handleSubmit,
    isFormValid,
  } = useRetrospectForm(diaryId, refetchRetrospects);
  
  // 감정 데이터
  const emotions = getAllEmotions();
  
  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={`${styles.container} ${className || ""}`} data-testid="diary-detail-container">
        <div className={styles.gap64}></div>
        <div className={styles.detailTitle}>
          <div className={styles.titleSection}>
            <h1 className={styles.titleText}>로딩 중...</h1>
          </div>
        </div>
      </div>
    );
  }
  
  // 에러 상태 처리
  if (error || !diaryData) {
    return (
      <div className={`${styles.container} ${className || ""}`} data-testid="diary-detail-container">
        <div className={styles.gap64}></div>
        <div className={styles.detailTitle}>
          <div className={styles.titleSection}>
            <h1 className={styles.titleText}>일기를 불러올 수 없습니다</h1>
            <p data-testid="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const emotionData = getEmotionData(diaryData.emotion);
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(diaryData.content);
    // TODO: 토스트 메시지 표시
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditMode(false);
  };
  
  const handleEmotionSelect = (emotionType: EmotionType) => {
    setUpdateEmotion(emotionType);
  };

  const handleDelete = () => {
    // TODO: 삭제 기능 구현
    console.log("삭제 버튼 클릭");
  };

  // 날짜 형식 변환 (ISO 문자열을 한국 형식으로)
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '. ').replace(/ /g, '').replace(/\.$/, '');
  };

  return (
    <div className={`${styles.container} ${className || ""}`} data-testid="diary-detail-container">
      {/* Gap: 1168 * 64 */}
      <div className={styles.gap64}></div>
      
      {!isEditMode ? (
        <>
          {/* Detail Title: 1168 * 84 */}
          <div className={styles.detailTitle}>
            <div className={styles.titleSection}>
              <h1 className={styles.titleText} data-testid="diary-title">{diaryData.title}</h1>
            </div>
            <div className={styles.emotionDateSection}>
              <div className={styles.emotionInfo}>
                <Image
                  src={getEmotionImage(diaryData.emotion, "small")}
                  alt={getEmotionLabel(diaryData.emotion)}
                  width={24}
                  height={24}
                  className={styles.emotionIcon}
                  data-testid="emotion-icon"
                />
                <span 
                  className={styles.emotionText}
                  style={{ color: emotionData.color }}
                  data-testid="emotion-text"
                >
                  {getEmotionLabel(diaryData.emotion)}
                </span>
              </div>
              <div className={styles.dateInfo}>
                <span className={styles.createdDate} data-testid="created-date">{formatDate(diaryData.createdAt)}</span>
                <span className={styles.dateLabel}>작성</span>
              </div>
            </div>
          </div>
          
          {/* Gap: 1168 * 24 */}
          <div className={styles.gap24}></div>
          
          {/* Detail Content: 1168 * 169 */}
          <div className={styles.detailContent}>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>내용</h2>
            </div>
            <div className={styles.contentText} data-testid="diary-content">
              {diaryData.content}
            </div>
            <div className={styles.copySection}>
              <button 
                className={styles.copyButton}
                onClick={handleCopyContent}
                title="내용 복사"
              >
                <Image
                  src="/icons/copy_outline_light_m.svg"
                  alt="복사"
                  width={24}
                  height={24}
                />
                <span className={styles.copyText}>내용 복사</span>
              </button>
            </div>
          </div>
          
          {/* Gap: 1168 * 24 */}
          <div className={styles.gap24}></div>
          
          {/* Detail Footer: 1168 * 56 */}
          <div className={styles.detailFooter}>
            <div className={styles.buttonGroup}>
              <Button
                variant="tertiary"
                size="small"
                theme="light"
                onClick={handleEdit}
              >
                수정
              </Button>
              <Button
                variant="tertiary"
                size="small"
                theme="light"
                onClick={handleDelete}
              >
                삭제
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Edit Mode: Emotion Selection */}
          <div className={styles.editEmotionSection} data-testid="edit-emotion-section">
            <span className={styles.editEmotionTitle}>오늘 기분은 어땟나요?</span>
            <div className={styles.editEmotionRadioGroup}>
              {emotions.map((emotion) => (
                <label key={emotion.type} className={styles.editEmotionRadioItem}>
                  <input
                    type="radio"
                    name="edit-emotion"
                    value={emotion.type}
                    checked={updateWatchedValues.emotion === emotion.type}
                    onChange={() => handleEmotionSelect(emotion.type)}
                    className={styles.editEmotionRadioInput}
                    data-testid={`edit-emotion-${emotion.type.toLowerCase()}`}
                  />
                  <span className={styles.editEmotionRadioLabel}>{emotion.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Gap: 1168 * 24 */}
          <div className={styles.gap24}></div>
          
          {/* Edit Mode: Title Input */}
          <div className={styles.editTitleSection}>
            <label className={styles.editLabel}>제목</label>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              placeholder="제목을 입력합니다."
              className={styles.editTitleInput}
              fullWidth={true}
              data-testid="edit-title-input"
              {...updateRegister("title")}
            />
            {updateErrors.title && (
              <span className={styles.errorMessage} data-testid="edit-title-error">
                {updateErrors.title.message}
              </span>
            )}
          </div>
          
          {/* Gap: 1168 * 24 */}
          <div className={styles.gap24}></div>
          
          {/* Edit Mode: Content Textarea */}
          <div className={styles.editContentSection}>
            <label className={styles.editLabel}>내용</label>
            <textarea
              placeholder="내용을 입력합니다."
              className={styles.editContentTextarea}
              rows={5}
              data-testid="edit-content-textarea"
              {...updateRegister("content")}
            />
            {updateErrors.content && (
              <span className={styles.errorMessage} data-testid="edit-content-error">
                {updateErrors.content.message}
              </span>
            )}
          </div>
          
          {/* Gap: 1168 * 24 */}
          <div className={styles.gap24}></div>
          
          {/* Edit Mode: Footer Buttons */}
          <div className={styles.editFooter}>
            <div className={styles.editButtonGroup}>
              <Button
                variant="secondary"
                size="large"
                theme="light"
                onClick={handleCancelEdit}
                data-testid="edit-cancel-button"
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="large"
                theme="light"
                onClick={updateHandleSubmit}
                disabled={!isUpdateFormValid}
                data-testid="edit-submit-button"
              >
                수정 하기
              </Button>
            </div>
          </div>
        </>
      )}
      
      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>
      
      {/* Retrospect Input: 1168 * 85 */}
      <div className={styles.retrospectInput}>
        <div className={styles.retrospectLabel}>회고</div>
        <form onSubmit={handleSubmit} className={styles.retrospectInputContainer}>
          <Input
            variant="primary"
            size="medium"
            theme="light"
            placeholder={isEditMode ? "수정중일땐 회고를 작성할 수 없어요." : "회고를 남겨보세요."}
            className="flex-1"
            fullWidth={false}
            data-testid="retrospect-input"
            disabled={isEditMode}
            {...register("content")}
          />
          <Button
            variant="primary"
            size="medium"
            theme="light"
            type="submit"
            disabled={!isFormValid || isEditMode}
            className="w-[51px]"
            data-testid="retrospect-submit-button"
          >
            입력
          </Button>
        </form>
      </div>
      
      {/* Gap: 1168 * 16 */}
      <div className={styles.gap16}></div>
      
      {/* Retrospect List: 1168 * 72 */}
      <div className={styles.retrospectList}>
        {retrospectList.map((retrospect, index) => (
          <div key={retrospect.id} data-testid="retrospect-item">
            <div className={styles.retrospectItem}>
              <span className={styles.retrospectContent} data-testid="retrospect-content">{retrospect.content}</span>
              <span className={styles.retrospectDate} data-testid="retrospect-date">[{formatDate(retrospect.createdAt)}]</span>
            </div>
            {index < retrospectList.length - 1 && (
              <div className={styles.retrospectDivider}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiariesDetail;
