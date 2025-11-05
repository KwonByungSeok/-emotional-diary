"use client";

import { useState, useMemo } from "react";

// ============================================
// Types & Interfaces
// ============================================

/**
 * 필터 타입
 */
export type FilterType = "default" | "landscape" | "portrait";

/**
 * 이미지 사이즈 타입
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * 필터 옵션 타입
 */
export interface FilterOption {
  value: FilterType;
  label: string;
}

/**
 * 필터 훅 반환 타입
 */
export interface UsePictureFilterResult {
  /** 현재 선택된 필터 타입 */
  filterType: FilterType;
  /** 필터 변경 함수 */
  setFilterType: (type: FilterType) => void;
  /** 현재 필터에 맞는 이미지 사이즈 */
  imageSize: ImageSize;
  /** 필터 옵션 목록 */
  filterOptions: FilterOption[];
  /** 반응형 이미지 사이즈 가져오기 함수 */
  getImageSize: (isMobile: boolean) => ImageSize;
}

// ============================================
// Constants
// ============================================

/** 필터별 이미지 사이즈 매핑 - 모바일용 (피그마 디자인 기준) */
export const MOBILE_FILTER_IMAGE_SIZES: Record<FilterType, ImageSize> = {
  default: { width: 280, height: 280 },    // 피그마 기본형: 280x280px
  landscape: { width: 280, height: 210 },  // 피그마 가로형: 280x210px  
  portrait: { width: 280, height: 372 },   // 피그마 세로형: 280x372px
};

/** 필터별 이미지 사이즈 매핑 - 데스크톱용 (더 큰 사이즈) */
export const DESKTOP_FILTER_IMAGE_SIZES: Record<FilterType, ImageSize> = {
  default: { width: 640, height: 640 },    // 데스크톱 기본형: 640x640px
  landscape: { width: 640, height: 480 },  // 데스크톱 가로형: 640x480px  
  portrait: { width: 480, height: 640 },   // 데스크톱 세로형: 480x640px
};

/** 필터 옵션 목록 */
export const FILTER_OPTIONS: FilterOption[] = [
  { value: "default", label: "기본" },
  { value: "landscape", label: "가로형" },
  { value: "portrait", label: "세로형" },
];

// ============================================
// Custom Hooks
// ============================================

/**
 * 강아지 사진 필터 훅
 * 
 * 필터 타입에 따라 이미지 사이즈를 관리합니다.
 * 
 * @param {FilterType} initialFilter - 초기 필터 타입 (기본값: "default")
 * @returns {UsePictureFilterResult} 필터 상태와 사이즈 정보
 */
export const usePictureFilter = (initialFilter: FilterType = "default"): UsePictureFilterResult => {
  const [filterType, setFilterType] = useState<FilterType>(initialFilter);

  // 반응형 이미지 사이즈 가져오기 함수
  const getImageSize = useMemo(() => {
    return (isMobile: boolean): ImageSize => {
      return isMobile 
        ? MOBILE_FILTER_IMAGE_SIZES[filterType]
        : DESKTOP_FILTER_IMAGE_SIZES[filterType];
    };
  }, [filterType]);

  // 기본 이미지 사이즈 (데스크톱 기준)
  const imageSize = useMemo(() => {
    return DESKTOP_FILTER_IMAGE_SIZES[filterType];
  }, [filterType]);

  return {
    filterType,
    setFilterType,
    imageSize,
    filterOptions: FILTER_OPTIONS,
    getImageSize,
  };
};
