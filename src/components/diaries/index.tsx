"use client";

import React from "react";
import { Searchbar } from "@/commons/components/searchbar";
import { Pagination } from "@/commons/components/pagination";
import styles from "./styles.module.css";

// ============================================
// Types & Interfaces
// ============================================

export interface DiariesProps {
  /** 추가 CSS 클래스명 */
  className?: string;
}

// ============================================
// Diaries Component
// ============================================

export const Diaries: React.FC<DiariesProps> = ({ className = "" }) => {
  // 임시 상태 (나중에 실제 데이터로 교체)
  const [searchValue, setSearchValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 10; // 임시값

  // 검색 핸들러
  const handleSearch = (value: string) => {
    setSearchValue(value);
    console.log("검색어:", value);
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
    <div className={containerClasses}>
      {/* Gap 1 */}
      <div className={styles.gap}></div>

      {/* Search Section */}
      <div className={styles.searchSection}>
        <Searchbar
          placeholder="일기를 검색해 보세요."
          onSearch={handleSearch}
          fullWidth
        />
      </div>

      {/* Gap 2 */}
      <div className={styles.gap2}></div>

      {/* Main Content Section */}
      <div className={styles.mainSection}>
        {/* 임시 콘텐츠 - 나중에 실제 일기 목록으로 교체 */}
        <div className={styles.placeholder}>
          <p>일기 목록이 여기에 표시됩니다.</p>
        </div>
      </div>

      {/* Gap 3 */}
      <div className={styles.gap3}></div>

      {/* Pagination Section */}
      <div className={styles.paginationSection}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
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
