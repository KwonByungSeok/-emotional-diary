"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/commons/components/button";
import { EmotionType, getEmotionData, getEmotionImage, getEmotionLabel } from "@/commons/constants/enum";
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

// Mock 데이터 인터페이스
interface DiaryDetailData {
  id: string;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Mock Data
// ============================================

const mockDiaryData: DiaryDetailData = {
  id: "1",
  title: "오늘은 정말 특별한 하루였어요",
  content: "오늘은 정말 특별한 하루였어요. 아침에 일어나서 창문을 열었는데, 비가 그치고 맑은 하늘이 보였습니다. 그 순간 마음이 한결 가벼워지는 것을 느꼈어요. 오후에는 오랜만에 만난 친구와 함께 카페에서 이야기를 나누며 즐거운 시간을 보냈습니다. 이런 작은 행복들이 모여서 하루를 특별하게 만들어 주는 것 같아요. 앞으로도 이런 소중한 순간들을 놓치지 않고 기록하고 싶습니다.",
  emotion: EmotionType.HAPPY,
  createdAt: "2024. 07. 12",
  updatedAt: "2024-07-12"
};

// ============================================
// DiariesDetail Component
// ============================================

export const DiariesDetail: React.FC<DiariesDetailProps> = ({
  className,
  id,
}) => {
  // TODO: 향후 실제 데이터 fetching에서 id 사용
  const diaryData = { ...mockDiaryData, id: id || mockDiaryData.id };
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

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {/* Gap: 1168 * 64 */}
      <div className={styles.gap64}></div>
      
      {/* Detail Title: 1168 * 84 */}
      <div className={styles.detailTitle}>
        <div className={styles.titleSection}>
          <h1 className={styles.titleText}>{diaryData.title}</h1>
        </div>
        <div className={styles.emotionDateSection}>
          <div className={styles.emotionInfo}>
            <Image
              src={getEmotionImage(diaryData.emotion, "medium")}
              alt={getEmotionLabel(diaryData.emotion)}
              width={32}
              height={32}
              className={styles.emotionIcon}
            />
            <span 
              className={styles.emotionText}
              style={{ color: emotionData.color }}
            >
              {getEmotionLabel(diaryData.emotion)}
            </span>
          </div>
          <div className={styles.dateInfo}>
            <span className={styles.createdDate}>{diaryData.createdAt}</span>
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
        <div className={styles.contentText}>
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
            size="medium"
            theme="light"
            onClick={handleEdit}
          >
            수정
          </Button>
          <Button
            variant="tertiary"
            size="medium"
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
        <textarea 
          placeholder="회고를 작성해주세요..."
          className={styles.textarea}
        />
      </div>
      
      {/* Gap: 1168 * 16 */}
      <div className={styles.gap16}></div>
      
      {/* Retrospect List: 1168 * 72 */}
      <div className={styles.retrospectList}>
        <div className={styles.retrospectItem}>
          <span className={styles.retrospectDate}>2024-01-01</span>
          <p className={styles.retrospectContent}>첫 번째 회고 내용입니다.</p>
        </div>
        <div className={styles.retrospectItem}>
          <span className={styles.retrospectDate}>2024-01-02</span>
          <p className={styles.retrospectContent}>두 번째 회고 내용입니다.</p>
        </div>
      </div>
    </div>
  );
};

export default DiariesDetail;
