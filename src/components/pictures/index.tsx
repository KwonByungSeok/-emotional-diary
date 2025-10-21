"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { SelectBox } from "@/commons/components/selectbox";

// ============================================
// Types & Interfaces
// ============================================

export interface PicturesProps {
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 테스트용 data-testid */
  "data-testid"?: string;
}

interface DogPicture {
  id: number;
  src: string;
  alt: string;
}

// ============================================
// Mock Data
// ============================================

const filterOptions = [
  { value: "all", label: "기본" },
  { value: "recent", label: "최신순" },
  { value: "popular", label: "인기순" },
  { value: "random", label: "랜덤" }
];

const mockPictures: DogPicture[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  src: "/images/dog-1.jpg",
  alt: `강아지 사진 ${index + 1}`
}));

// ============================================
// Pictures Component
// ============================================

export const Pictures: React.FC<PicturesProps> = ({ className = "", "data-testid": dataTestId }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // 컨테이너 클래스명 조합
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    // 필터링 로직은 추후 구현
  };

  return (
    <div className={containerClasses} data-testid={dataTestId}>
      {/* Gap 1 */}
      <div className={styles.gap}></div>

      {/* Filter Section */}
      <div className={styles.filter}>
        <div className={styles.filterContent}>
          <SelectBox
            variant="primary"
            theme="light"
            size="medium"
            options={filterOptions}
            value={selectedFilter}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            data-testid="pictures-filter"
          />
        </div>
      </div>

      {/* Gap 2 */}
      <div className={styles.gapSecond}></div>

      {/* Main Section */}
      <div className={styles.main}>
        <div className={styles.mainContent}>
          <div className={styles.pictureGrid}>
            {mockPictures.map((picture) => (
              <div key={picture.id} className={styles.pictureItem}>
                <img
                  src={picture.src}
                  alt={picture.alt}
                  className={styles.pictureImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Export
// ============================================

export default Pictures;
