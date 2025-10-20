import { usePathname } from 'next/navigation';
import { URL } from '@/commons/constants/url';

// ============================================
// Type Definitions
// ============================================

type TabType = 'diaries' | 'pictures';

interface ActiveTabResult {
  activeTab: TabType;
  pathname: string;
}

interface LinkRoutingResult {
  activeTab: TabType;
  getLogoNavigationPath: () => string;
  getTabNavigationPath: (tab: TabType) => string;
}

// ============================================
// Custom Hooks
// ============================================

/**
 * 현재 경로에 따른 활성 탭을 관리하는 훅
 * 
 * @returns {ActiveTabResult} activeTab과 pathname을 포함한 객체
 */
export const useActiveTab = (): ActiveTabResult => {
  const pathname = usePathname();

  /**
   * 현재 경로에 따른 활성 탭을 결정하는 함수
   * 
   * @returns {TabType} 현재 활성화된 탭 타입
   */
  const determineActiveTab = (): TabType => {
    if (pathname.startsWith('/diaries')) {
      return 'diaries';
    }
    if (pathname.startsWith('/pictures')) {
      return 'pictures';
    }
    return 'diaries'; // 기본값
  };

  return {
    activeTab: determineActiveTab(),
    pathname,
  };
};

/**
 * 라우팅 관련 유틸리티 훅
 * 
 * @returns {LinkRoutingResult} 활성 탭과 네비게이션 함수들을 포함한 객체
 */
export const useLinkRouting = (): LinkRoutingResult => {
  const { activeTab } = useActiveTab();

  /**
   * 로고 클릭 시 일기목록 페이지로 이동하는 경로를 반환
   * 
   * @returns {string} 일기목록 페이지 경로
   */
  const getLogoNavigationPath = (): string => {
    return URL.DIARIES.LIST;
  };

  /**
   * Navigation 탭 클릭 시 해당 페이지로 이동하는 경로를 반환
   * 
   * @param {TabType} tab - 이동할 탭 타입
   * @returns {string} 해당 탭의 페이지 경로
   */
  const getTabNavigationPath = (tab: TabType): string => {
    switch (tab) {
      case 'diaries':
        return URL.DIARIES.LIST;
      case 'pictures':
        return URL.PICTURES.LIST;
      default:
        return URL.DIARIES.LIST;
    }
  };

  return {
    activeTab,
    getLogoNavigationPath,
    getTabNavigationPath,
  };
};
