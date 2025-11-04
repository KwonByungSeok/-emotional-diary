"use client";

import React from "react";
import Image from "next/image";
import { Searchbar } from "@/commons/components/searchbar";
import { SelectBox } from "@/commons/components/selectbox";
import { Button } from "@/commons/components/button";
import { Pagination } from "@/commons/components/pagination";
import {
  EmotionType,
  getAllEmotions,
  getEmotionLabel,
  getEmotionColor,
  getEmotionImage,
  SearchbarVariant,
  SearchbarSize,
  SearchbarTheme,
} from "@/commons/constants/enum";
import { useDiaryModalLink } from "./hooks/index.link.modal.hook";
import { useDiariesBinding } from "./hooks/index.binding.hook";
import { useDiaryLinkRouting } from "./hooks/index.link.routing.hook";
import { useDiariesSearch } from "./hooks/index.search.hook";
import styles from "./styles.module.css";

// ============================================
// Types & Interfaces
// ============================================

export interface DiariesProps {
  /** 추가 CSS 클래스명 */
  className?: string;
  /** 테스트용 data-testid */
  "data-testid"?: string;
}

interface DiaryCardProps {
  id: number;
  emotion: EmotionType;
  title: string;
  date: string;
  imageUrl: string;
  onDelete?: () => void;
  onClick?: () => void;
}

// ============================================
// DiaryCard Component
// ============================================

const DiaryCard: React.FC<DiaryCardProps> = ({
  emotion,
  title,
  date,
  imageUrl,
  onDelete,
  onClick,
}) => {

  return (
    <div 
      className={styles.diaryCard} 
      data-testid="diary-card"
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div className={styles.cardImage}>
        <Image 
          src={imageUrl} 
          alt={title}
          width={274}
          height={208}
          style={{ objectFit: 'cover' }}
          data-testid="diary-image"
        />
        {/* 삭제 버튼 */}
        <button 
          className={styles.deleteButton} 
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className={styles.cardContent}>
        {/* 감정 & 날짜 */}
        <div className={styles.cardMeta}>
          <span
            className={styles.emotionLabel}
            style={{ color: getEmotionColor(emotion) }}
            data-testid="diary-emotion"
          >
            {getEmotionLabel(emotion)}
          </span>
          <span className={styles.dateLabel} data-testid="diary-date">{date}</span>
        </div>

        {/* 제목 */}
        <div className={styles.cardTitle}>
          <span className={styles.titleText} data-testid="diary-title">{title}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Date Formatting Utility
// ============================================

const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ============================================
// Diaries Component
// ============================================

export const Diaries: React.FC<DiariesProps> = ({ className = "", "data-testid": dataTestId }) => {
  // 상태 관리
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);

  // 모달 링크 훅
  const { openDiaryWriteModal } = useDiaryModalLink();
  
  // 바인딩 훅
  const { diaries, isLoading, error, refetch } = useDiariesBinding();

  // 검색 훅
  const { filteredDiaries, executeSearch, clearSearch } = useDiariesSearch(diaries);

  // 라우팅 훅
  const { navigateToDiaryDetail } = useDiaryLinkRouting();

  // 페이지네이션 계산 (필터링된 일기 목록 기준)
  const itemsPerPage = 12; // 한 페이지당 12개 (3행 x 4개)
  const totalPages = Math.ceil(filteredDiaries.length / itemsPerPage);
  
  // 현재 페이지에 해당하는 일기 데이터
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageDiaries = filteredDiaries.slice(startIndex, endIndex);
  
  // 일기 데이터를 카드 형태로 변환
  const diaryCards = currentPageDiaries.map((diary) => ({
    id: diary.id,
    emotion: diary.emotion,
    title: diary.title.length > 30 ? diary.title.substring(0, 30) + "..." : diary.title,
    date: formatDateToYYYYMMDD(diary.createdAt),
    imageUrl: getEmotionImage(diary.emotion, "medium"),
  }));

  // 필터 옵션 생성
  const filterOptions = [
    { value: "all", label: "전체" },
    ...getAllEmotions().map((emotion) => ({
      value: emotion.type,
      label: emotion.label,
    })),
  ];

  // 검색 핸들러
  const handleSearch = (value: string) => {
    executeSearch(value);
    // 검색 실행 시 첫 페이지로 이동
    setCurrentPage(1);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    console.log("필터 변경:", value);
  };

  // 일기쓰기 버튼 핸들러
  const handleWriteDiary = () => {
    openDiaryWriteModal();
    // 모달이 닫힌 후 데이터 새로고침을 위해 refetch 호출
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("페이지 변경:", page);
  };

  // 컨테이너 클래스명 조합
  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} data-testid={dataTestId}>
      {/* Gap 1 */}
      <div className={styles.gap}></div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        {/* Left Group: Filter + Search */}
        <div className={styles.leftGroup}>
          {/* Filter SelectBox */}
          <SelectBox
            variant="primary"
            size="medium"
            theme="light"
            options={filterOptions}
            value={selectedFilter}
            onChange={handleFilterChange}
            placeholder="전체"
            className={styles.filterSelect}
          />

          {/* Searchbar */}
          <Searchbar
            variant={SearchbarVariant.PRIMARY}
            size={SearchbarSize.MEDIUM}
            theme={SearchbarTheme.LIGHT}
            placeholder="검색어를 입력해 주세요."
            onSearch={handleSearch}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => {
              setSearchValue("");
              clearSearch();
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>

        {/* Right Group: Write Button */}
        <Button
          variant="primary"
          size="large"
          theme="light"
          onClick={handleWriteDiary}
          className={styles.writeButton}
          data-testid="diary-write-button"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 13H6C5.71667 13 5.47917 12.9042 5.2875 12.7125C5.09583 12.5208 5 12.2833 5 12C5 11.7167 5.09583 11.4792 5.2875 11.2875C5.47917 11.0958 5.71667 11 6 11H11V6C11 5.71667 11.0958 5.47917 11.2875 5.2875C11.4792 5.09583 11.7167 5 12 5C12.2833 5 12.5208 5.09583 12.7125 5.2875C12.9042 5.47917 13 5.71667 13 6V11H18C18.2833 11 18.5208 11.0958 18.7125 11.2875C18.9042 11.4792 19 11.7167 19 12C19 12.2833 18.9042 12.5208 18.7125 12.7125C18.5208 12.9042 18.2833 13 18 13H13V18C13 18.2833 12.9042 18.5208 12.7125 18.7125C12.5208 18.9042 12.2833 19 12 19C11.7167 19 11.4792 18.9042 11.2875 18.7125C11.0958 18.5208 11 18.2833 11 18V13Z"
                fill="currentColor"
              />
            </svg>
          }
          iconPosition="left"
        >
          일기쓰기
        </Button>
      </div>

      {/* Gap 2 */}
      <div className={styles.gap2}></div>

      {/* Main Content Section */}
      <div className={styles.mainSection}>
        {/* 로딩 상태 */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingText}>일기를 불러오는 중...</div>
          </div>
        )}
        
        {/* 에러 상태 */}
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorText} data-testid="error-message">{error}</div>
            <button onClick={refetch} className={styles.retryButton}>
              다시 시도
            </button>
          </div>
        )}
        
        {/* 일기 카드 그리드 */}
        {!isLoading && !error && (
          <div className={styles.diaryGrid}>
            {diaryCards.length === 0 ? (
              <div className={styles.emptyContainer} data-testid="empty-state">
                <div className={styles.emptyText}>작성된 일기가 없습니다.</div>
                <button onClick={handleWriteDiary} className={styles.writeFirstButton}>
                  첫 번째 일기 작성하기
                </button>
              </div>
            ) : (
              // 일기 카드들을 행별로 렌더링
              Array.from({ length: Math.ceil(diaryCards.length / 4) }, (_, rowIndex) => (
                <div key={rowIndex} className={styles.diaryRow}>
                  <div className={styles.diaryRowInner}>
                    {diaryCards.slice(rowIndex * 4, rowIndex * 4 + 2).map((card) => (
                      <DiaryCard
                        key={card.id}
                        id={card.id}
                        emotion={card.emotion}
                        title={card.title}
                        date={card.date}
                        imageUrl={card.imageUrl}
                        onClick={() => navigateToDiaryDetail(card.id)}
                      />
                    ))}
                  </div>
                  <div className={styles.diaryRowInner}>
                    {diaryCards.slice(rowIndex * 4 + 2, rowIndex * 4 + 4).map((card) => (
                      <DiaryCard
                        key={card.id}
                        id={card.id}
                        emotion={card.emotion}
                        title={card.title}
                        date={card.date}
                        imageUrl={card.imageUrl}
                        onClick={() => navigateToDiaryDetail(card.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Gap 3 */}
      <div className={styles.gap3}></div>

      {/* Pagination Section */}
      <div className={styles.paginationSection}>
        <Pagination
          variant="primary"
          size="medium"
          theme="light"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxVisiblePages={5}
          showNavigationButtons={true}
          showBoundaryButtons={false}
          showEllipsis={false}
          className={styles.paginationContainer}
        />
      </div>

      {/* Gap 4 */}
      <div className={styles.gap4}></div>
    </div>
  );
};

// ============================================
// Export
// ============================================

export default Diaries;
