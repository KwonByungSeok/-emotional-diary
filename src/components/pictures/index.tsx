"use client";

import React, { useState, useEffect } from "react";
import { SelectBox } from "@/commons/components/selectbox";
import { Searchbar } from "@/commons/constants/enum";
import { usePicturesBinding } from "./hooks/index.binding.hook";
import { usePictureFilter, type FilterType } from "./hooks/index.filter.hook";
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

interface DogPicture {
  id: string;
  url: string;
  alt: string;
}

// ============================================
// Constants
// ============================================

// filterOptions는 usePictureFilter hook에서 가져옴

// ============================================
// LoadingSplash Component
// ============================================

interface LoadingSplashProps {
  item: DogPicture;
  width: number;
  height: number;
}

const LoadingSplash: React.FC<LoadingSplashProps> = ({ item, width, height }) => (
  <div key={item.id} className={styles.loadingItem} data-testid="loading-splash" style={{ width: `${width}px`, height: `${height}px` }}>
    <div className={styles.loadingSplash}></div>
  </div>
);

// ============================================
// PictureItem Component
// ============================================

interface PictureItemProps {
  picture: DogPicture;
  width: number;
  height: number;
}

const PictureItem: React.FC<PictureItemProps> = ({ picture, width, height }) => (
  <div 
    key={picture.id} 
    className={styles.pictureItem} 
    data-testid="picture-item"
    style={{ width: `${width}px`, height: `${height}px` }}
  >
    <img
      src={picture.url}
      alt={picture.alt}
      className={styles.pictureImage}
      onError={(e) => {
        // 이미지 로드 실패 시 기본 이미지로 대체
        const target = e.target as HTMLImageElement;
        target.src = "/images/dog-1.jpg";
      }}
    />
  </div>
);

// ============================================
// Pictures Component
// ============================================

export const Pictures: React.FC<PicturesProps> = ({ className = "", "data-testid": dataTestId }) => {
  // 반응형 상태 관리
  const [isMobile, setIsMobile] = useState(false);

  // 브레이크포인트 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 필터 훅
  const {
    filterType,
    setFilterType,
    imageSize,
    filterOptions,
    getImageSize,
  } = usePictureFilter();

  // 반응형 이미지 사이즈 계산
  const currentImageSize = getImageSize(isMobile);

  // 바인딩 훅
  const {
    pictures,
    loadingPlaceholders,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    triggerRef,
  } = usePicturesBinding();

  // 핸들러 함수들
  const handleFilterChange = (value: string) => {
    setFilterType(value as FilterType);
  };

  // 컨테이너 클래스명 조합
  const containerClasses = [
    styles.container, 
    isMobile ? styles.mobile : styles.desktop,
    className
  ].filter(Boolean).join(" ");

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={containerClasses} data-testid={dataTestId}>
        <div className={styles.gap}></div>
        <div className={styles.filter}>
          <div className={styles.filterContent}>
            <SelectBox
              variant="primary"
              theme={Searchbar.Theme.LIGHT}
              size={Searchbar.Size.MEDIUM}
              options={filterOptions}
              value={filterType}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              data-testid="pictures-filter"
            />
          </div>
        </div>
        <div className={styles.gapSecond}></div>
        <div className={styles.main}>
          <div className={styles.mainContent}>
            <div className={styles.pictureGrid} data-testid="pictures-grid">
              {loadingPlaceholders.map((item) => (
                <LoadingSplash key={item.id} item={item} width={currentImageSize.width} height={currentImageSize.height} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className={containerClasses} data-testid={dataTestId}>
        <div className={styles.gap}></div>
        <div className={styles.filter}>
          <div className={styles.filterContent}>
            <SelectBox
              variant="primary"
              theme={Searchbar.Theme.LIGHT}
              size={Searchbar.Size.MEDIUM}
              options={filterOptions}
              value={filterType}
              onChange={handleFilterChange}
              className={styles.filterSelect}
              data-testid="pictures-filter"
            />
          </div>
        </div>
        <div className={styles.gapSecond}></div>
        <div className={styles.main}>
          <div className={styles.mainContent}>
            <div className={styles.errorContainer} data-testid="error-message">
              사진을 불러오는 중 오류가 발생했습니다.
              <br />
              {error?.message || "알 수 없는 오류"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} data-testid={dataTestId}>
      {/* Gap 1 */}
      <div className={styles.gap}></div>

      {/* Filter Section */}
      <div className={styles.filter}>
        <div className={styles.filterContent}>
          <SelectBox
            variant="primary"
            theme={Searchbar.Theme.LIGHT}
            size={Searchbar.Size.MEDIUM}
            options={filterOptions}
            value={filterType}
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
          <div className={styles.pictureGrid} data-testid="pictures-grid">
            {/* 실제 강아지 사진들 표시 */}
            {pictures.map((picture) => (
              <PictureItem key={picture.id} picture={picture} width={currentImageSize.width} height={currentImageSize.height} />
            ))}
            
            {/* 추가 로딩 중일 때 표시 */}
            {isFetchingNextPage && loadingPlaceholders.slice(0, 3).map((item, index) => (
              <LoadingSplash key={`next-${index}`} item={{ ...item, id: `next-${index}` }} width={currentImageSize.width} height={currentImageSize.height} />
            ))}
          </div>
          
          {/* 무한 스크롤 트리거 */}
          {pictures.length > 0 && (
            <div ref={triggerRef} className={styles.scrollTrigger} data-testid="scroll-trigger" />
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Export
// ============================================

export default Pictures;
