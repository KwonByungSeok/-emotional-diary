"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/commons/components/button";
import { Input } from "@/commons/components/input";
import { getEmotionData, getEmotionImage, getEmotionLabel } from "@/commons/constants/enum";
import { useDiaryBinding } from "./hooks/index.binding.hook";
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


// 회고 데이터 인터페이스
interface RetrospectData {
  id: string;
  content: string;
  createdAt: string;
}

// ============================================
// DiariesDetail Component
// ============================================

export const DiariesDetail: React.FC<DiariesDetailProps> = ({
  className,
  id,
}) => {
  // 실제 데이터 바인딩
  const { diaryData, isLoading, error } = useDiaryBinding(id);
  
  // 회고 입력 상태 관리
  const [retrospectInput, setRetrospectInput] = useState("");
  const [retrospectList, setRetrospectList] = useState<RetrospectData[]>([]);
  
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
    // TODO: 수정 기능 구현
    console.log("수정 버튼 클릭");
  };

  const handleDelete = () => {
    // TODO: 삭제 기능 구현
    console.log("삭제 버튼 클릭");
  };

  const handleRetrospectSubmit = () => {
    if (retrospectInput.trim()) {
      const newRetrospect: RetrospectData = {
        id: Date.now().toString(),
        content: retrospectInput.trim(),
        createdAt: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\./g, '. ').replace(/ /g, '')
      };
      setRetrospectList(prev => [newRetrospect, ...prev]);
      setRetrospectInput("");
    }
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
      
      {/* Gap: 1168 * 24 */}
      <div className={styles.gap24}></div>
      
      {/* Retrospect Input: 1168 * 85 */}
      <div className={styles.retrospectInput}>
        <div className={styles.retrospectLabel}>회고</div>
        <div className={styles.retrospectInputContainer}>
          <Input
            variant="primary"
            size="medium"
            theme="light"
            placeholder="회고를 남겨보세요."
            value={retrospectInput}
            onChange={(e) => setRetrospectInput(e.target.value)}
            className="flex-1"
            fullWidth={false}
          />
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleRetrospectSubmit}
            className="w-[51px]"
          >
            입력
          </Button>
        </div>
      </div>
      
      {/* Gap: 1168 * 16 */}
      <div className={styles.gap16}></div>
      
      {/* Retrospect List: 1168 * 72 */}
      <div className={styles.retrospectList}>
        {retrospectList.map((retrospect, index) => (
          <div key={retrospect.id}>
            <div className={styles.retrospectItem}>
              <span className={styles.retrospectContent}>{retrospect.content}</span>
              <span className={styles.retrospectDate}>[{retrospect.createdAt}]</span>
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
