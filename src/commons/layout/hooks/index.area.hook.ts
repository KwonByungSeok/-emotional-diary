"use client";

import { usePathname } from 'next/navigation';
import { getPageLayout, PageLayout } from '../../constants/url';

// ============================================
// Type Definitions
// ============================================

interface AreaResult {
  showHeader: boolean;
  showLogo: boolean;
  showBanner: boolean;
  showNavigation: boolean;
  showFooter: boolean;
}

// ============================================
// Custom Hooks
// ============================================

/**
 * 페이지 레이아웃 영역 노출 제어 Hook
 * URL 기반으로 header, banner, navigation, footer 영역의 노출 여부를 관리
 * 
 * @returns {AreaResult} 각 영역의 노출 여부를 포함한 객체
 */
export const useArea = (): AreaResult => {
  const pathname = usePathname();
  
  // 현재 경로의 레이아웃 설정 가져오기
  const layout: PageLayout = getPageLayout(pathname);
  
  return {
    // Header 영역 노출 여부
    showHeader: layout.header.visible,
    showLogo: layout.header.logo,
    
    // Banner 영역 노출 여부
    showBanner: layout.banner,
    
    // Navigation 영역 노출 여부
    showNavigation: layout.navigation,
    
    // Footer 영역 노출 여부
    showFooter: layout.footer,
  };
};
