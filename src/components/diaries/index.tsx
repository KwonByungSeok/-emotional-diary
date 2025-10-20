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
import styles from "./styles.module.css";

// ============================================
// Types & Interfaces
// ============================================

export interface DiariesProps {
  /** 추가 CSS 클래스명 */
  className?: string;
}

interface DiaryCardProps {
  emotion: EmotionType;
  title: string;
  date: string;
  imageUrl: string;
  onDelete?: () => void;
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
}) => {

  return (
    <div className={styles.diaryCard}>
      {/* 이미지 영역 */}
      <div className={styles.cardImage}>
        <Image 
          src={imageUrl} 
          alt={title}
          width={274}
          height={208}
          style={{ objectFit: 'cover' }}
        />
        {/* 삭제 버튼 */}
        <button className={styles.deleteButton} onClick={onDelete}>
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
          >
            {getEmotionLabel(emotion)}
          </span>
          <span className={styles.dateLabel}>{date}</span>
        </div>

        {/* 제목 */}
        <div className={styles.cardTitle}>
          <span className={styles.titleText}>{title}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Diaries Component
// ============================================

export const Diaries: React.FC<DiariesProps> = ({ className = "" }) => {
  // 상태 관리
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 10; // 임시값

  // 모달 링크 훅
  const { openDiaryWriteModal } = useDiaryModalLink();

  // Mock 데이터 생성 - 피그마 디자인 순서대로
  const mockDiaries = [
    // Row 1
    {
      id: 1,
      emotion: EmotionType.SAD,
      title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.SAD, "medium"),
    },
    {
      id: 2,
      emotion: EmotionType.SURPRISE,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.SURPRISE, "medium"),
    },
    {
      id: 3,
      emotion: EmotionType.ANGRY,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.ANGRY, "medium"),
    },
    {
      id: 4,
      emotion: EmotionType.HAPPY,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.HAPPY, "medium"),
    },
    // Row 2
    {
      id: 5,
      emotion: EmotionType.ETC,
      title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.ETC, "medium"),
    },
    {
      id: 6,
      emotion: EmotionType.SURPRISE,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.SURPRISE, "medium"),
    },
    {
      id: 7,
      emotion: EmotionType.ANGRY,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.ANGRY, "medium"),
    },
    {
      id: 8,
      emotion: EmotionType.HAPPY,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.HAPPY, "medium"),
    },
    // Row 3
    {
      id: 9,
      emotion: EmotionType.SAD,
      title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.SAD, "medium"),
    },
    {
      id: 10,
      emotion: EmotionType.SURPRISE,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.SURPRISE, "medium"),
    },
    {
      id: 11,
      emotion: EmotionType.ANGRY,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.ANGRY, "medium"),
    },
    {
      id: 12,
      emotion: EmotionType.HAPPY,
      title: "타이틀 영역 입니다.",
      date: "2024. 03. 12",
      imageUrl: getEmotionImage(EmotionType.HAPPY, "medium"),
    },
  ];

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
    setSearchValue(value);
    console.log("검색어:", value);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    console.log("필터 변경:", value);
  };

  // 일기쓰기 버튼 핸들러
  const handleWriteDiary = () => {
    openDiaryWriteModal();
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
    <div className={containerClasses} data-testid="diaries-page">
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
        {/* 일기 카드 그리드 */}
        <div className={styles.diaryGrid}>
          {/* Row 1 */}
          <div className={styles.diaryRow}>
            <div className={styles.diaryRowInner}>
              <DiaryCard
                emotion={mockDiaries[0].emotion}
                title={mockDiaries[0].title}
                date={mockDiaries[0].date}
                imageUrl={mockDiaries[0].imageUrl}
              />
              <DiaryCard
                emotion={mockDiaries[1].emotion}
                title={mockDiaries[1].title}
                date={mockDiaries[1].date}
                imageUrl={mockDiaries[1].imageUrl}
              />
            </div>
            <div className={styles.diaryRowInner}>
              <DiaryCard
                emotion={mockDiaries[2].emotion}
                title={mockDiaries[2].title}
                date={mockDiaries[2].date}
                imageUrl={mockDiaries[2].imageUrl}
              />
              <DiaryCard
                emotion={mockDiaries[3].emotion}
                title={mockDiaries[3].title}
                date={mockDiaries[3].date}
                imageUrl={mockDiaries[3].imageUrl}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className={styles.diaryRow}>
            <div className={styles.diaryRowInner}>
              <DiaryCard
                emotion={mockDiaries[4].emotion}
                title={mockDiaries[4].title}
                date={mockDiaries[4].date}
                imageUrl={mockDiaries[4].imageUrl}
              />
              <DiaryCard
                emotion={mockDiaries[5].emotion}
                title={mockDiaries[5].title}
                date={mockDiaries[5].date}
                imageUrl={mockDiaries[5].imageUrl}
              />
            </div>
            <div className={styles.diaryRowInner}>
              <DiaryCard
                emotion={mockDiaries[6].emotion}
                title={mockDiaries[6].title}
                date={mockDiaries[6].date}
                imageUrl={mockDiaries[6].imageUrl}
              />
              <DiaryCard
                emotion={mockDiaries[7].emotion}
                title={mockDiaries[7].title}
                date={mockDiaries[7].date}
                imageUrl={mockDiaries[7].imageUrl}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className={styles.diaryRow}>
            <div className={styles.diaryRowInner}>
              <DiaryCard
                emotion={mockDiaries[8].emotion}
                title={mockDiaries[8].title}
                date={mockDiaries[8].date}
                imageUrl={mockDiaries[8].imageUrl}
              />
              <DiaryCard
                emotion={mockDiaries[9].emotion}
                title={mockDiaries[9].title}
                date={mockDiaries[9].date}
                imageUrl={mockDiaries[9].imageUrl}
              />
            </div>
            <div className={styles.diaryRowInner}>
              <DiaryCard
                emotion={mockDiaries[10].emotion}
                title={mockDiaries[10].title}
                date={mockDiaries[10].date}
                imageUrl={mockDiaries[10].imageUrl}
              />
              <DiaryCard
                emotion={mockDiaries[11].emotion}
                title={mockDiaries[11].title}
                date={mockDiaries[11].date}
                imageUrl={mockDiaries[11].imageUrl}
              />
            </div>
          </div>
        </div>
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
