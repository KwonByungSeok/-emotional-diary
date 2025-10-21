"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

// ============================================
// Constants
// ============================================

/** 강아지 사진 개수 */
export const DOG_PICTURES_COUNT = 6;

/** 무한 스크롤 임계점 (마지막에서 몇 개 남았을 때 로드할지) */
export const SCROLL_THRESHOLD = 2;

/** API 재시도 횟수 */
export const API_RETRY_COUNT = 1;

/** API 재시도 지연 시간 (ms) */
export const API_RETRY_DELAY = 500;

/** React Query 캐시 시간 (ms) */
export const STALE_TIME = 1000 * 60 * 5; // 5분
export const GC_TIME = 1000 * 60 * 10; // 10분

// ============================================
// Types & Interfaces
// ============================================

/**
 * Dog API 응답 타입
 */
export interface DogApiResponse {
  message: string[];
  status: "success" | "error";
}

/**
 * 강아지 사진 데이터 타입
 */
export interface DogPicture {
  id: string;
  url: string;
  alt: string;
}

/**
 * 무한 스크롤 훅 옵션
 */
export interface UseInfiniteScrollOptions {
  threshold?: number; // 스크롤 임계점 (마지막에서 몇 개 남았을 때 로드할지)
  enabled?: boolean;
}

// ============================================
// API Functions
// ============================================

/**
 * 강아지 사진 API 호출 함수
 */
const fetchDogPictures = async (count: number = DOG_PICTURES_COUNT): Promise<DogApiResponse> => {
  const response = await fetch(`https://dog.ceo/api/breeds/image/random/${count}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

// ============================================
// Custom Hooks
// ============================================

/**
 * 강아지 사진 조회 훅 (초기 로드용)
 */
export const useDogPictures = (count: number = DOG_PICTURES_COUNT) => {
  return useQuery({
    queryKey: ["dogPictures", count],
    queryFn: () => fetchDogPictures(count),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: API_RETRY_COUNT,
    retryDelay: API_RETRY_DELAY,
  });
};

/**
 * 무한 스크롤 강아지 사진 조회 훅
 */
export const useInfiniteDogPictures = (count: number = DOG_PICTURES_COUNT) => {
  return useInfiniteQuery({
    queryKey: ["infiniteDogPictures", count],
    queryFn: () => fetchDogPictures(count),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 성공적으로 데이터를 받았으면 다음 페이지 번호 반환
      return lastPage.status === "success" ? allPages.length : undefined;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: API_RETRY_COUNT,
    retryDelay: API_RETRY_DELAY,
  });
};

/**
 * 무한 스크롤 감지 훅
 */
export const useInfiniteScroll = (
  fetchNextPage: () => void,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  options: UseInfiniteScrollOptions = {}
) => {
  const { enabled = true } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        enabled
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    const currentTriggerRef = triggerRef.current;
    
    if (currentTriggerRef) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
        rootMargin: "100px",
      });
      
      observerRef.current.observe(currentTriggerRef);
    }

    return () => {
      if (observerRef.current && currentTriggerRef) {
        observerRef.current.unobserve(currentTriggerRef);
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, enabled]);

  return { triggerRef };
};

/**
 * 강아지 사진 데이터 변환 함수
 */
export const transformDogPictures = (data: DogApiResponse[], startIndex: number = 0): DogPicture[] => {
  const allPictures: DogPicture[] = [];
  let currentIndex = startIndex;

  data.forEach((page) => {
    if (page.status === "success" && page.message) {
      page.message.forEach((url) => {
        allPictures.push({
          id: `dog-${currentIndex}`,
          url,
          alt: `강아지 사진 ${currentIndex + 1}`,
        });
        currentIndex++;
      });
    }
  });

  return allPictures;
};

/**
 * 메인 강아지 사진 바인딩 훅
 */
export const usePicturesBinding = () => {
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteDogPictures(DOG_PICTURES_COUNT);

  // 무한 스크롤 설정
  const { triggerRef } = useInfiniteScroll(
    fetchNextPage,
    hasNextPage || false,
    isFetchingNextPage,
    { threshold: SCROLL_THRESHOLD, enabled: !isLoading }
  );

  // 데이터 변환
  const pictures = infiniteData?.pages 
    ? transformDogPictures(infiniteData.pages)
    : [];

  // 로딩 스플래시용 배열 생성 (DOG_PICTURES_COUNT개 고정)
  const loadingPlaceholders = Array.from({ length: DOG_PICTURES_COUNT }, (_, index) => ({
    id: `loading-${index}`,
    url: "",
    alt: `로딩 중 ${index + 1}`,
  }));

  return {
    pictures,
    loadingPlaceholders,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage: hasNextPage || false,
    triggerRef,
    fetchNextPage,
  };
};