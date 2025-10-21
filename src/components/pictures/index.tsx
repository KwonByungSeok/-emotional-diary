import React from "react";
import styles from "./styles.module.css";

// ============================================
// Types & Interfaces
// ============================================

export interface PicturesProps {
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 테스트용 data-testid */
  "data-testid"?: string;
}

// ============================================
// Pictures Component
// ============================================

export const Pictures: React.FC<PicturesProps> = ({ 
  className = "", 
  "data-testid": dataTestId 
}) => {
  // 컨테이너 클래스명 조합
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} data-testid={dataTestId}>
      {/* Gap 1 */}
      <div className={styles.gap}></div>
      
      {/* Filter Section */}
      <div className={styles.filter}>
        <div className={styles.filterContent}>
          {/* 필터 컨텐츠가 들어갈 영역 */}
        </div>
      </div>
      
      {/* Gap 2 */}
      <div className={styles.gapSecond}></div>
      
      {/* Main Section */}
      <div className={styles.main}>
        <div className={styles.mainContent}>
          {/* 메인 컨텐츠가 들어갈 영역 */}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Export
// ============================================

export default Pictures;
