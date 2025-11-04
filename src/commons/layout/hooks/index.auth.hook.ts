"use client";

import { useAuth } from '@/commons/providers/auth/auth.provider';

// ============================================
// Type Definitions
// ============================================

interface AuthHookResult {
  /**
   * 현재 로그인 상태
   */
  isLoggedIn: boolean;

  /**
   * 현재 로그인한 사용자 정보
   */
  user: { _id: string; name: string } | null;

  /**
   * 로그인 페이지로 이동하는 함수
   */
  handleLogin: () => void;

  /**
   * 로그아웃 처리하는 함수
   */
  handleLogout: () => void;
}

// ============================================
// Custom Hooks
// ============================================

/**
 * 인증 관련 기능을 제공하는 Hook
 * 인증 프로바이더의 기능을 활용하여 로그인/로그아웃 기능을 제공합니다.
 * 
 * @returns {AuthHookResult} 로그인 상태와 인증 관련 함수들을 포함한 객체
 */
export const useAuthHook = (): AuthHookResult => {
  const { isLoggedIn, user, login, logout } = useAuth();

  /**
   * 로그인 페이지로 이동하는 함수
   */
  const handleLogin = () => {
    login();
  };

  /**
   * 로그아웃 처리하는 함수
   */
  const handleLogout = () => {
    logout();
  };

  return {
    isLoggedIn,
    user,
    handleLogin,
    handleLogout,
  };
};
