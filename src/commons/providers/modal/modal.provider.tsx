"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

// ============================================
// Type Definitions
// ============================================

/**
 * 모달 아이템 타입 정의
 */
interface ModalItem {
  /**
   * 모달의 고유 식별자
   */
  id: string;
  
  /**
   * 모달에 표시될 콘텐츠
   */
  content: ReactNode;
  
  /**
   * 모달의 z-index 값
   */
  zIndex: number;
}

/**
 * 모달 컨텍스트 타입 정의
 */
interface ModalContextType {
  /**
   * 현재 열린 모달들의 배열
   */
  modals: ModalItem[];
  
  /**
   * 새 모달을 열고 고유 ID를 반환하는 함수
   */
  openModal: (content: ReactNode) => string;
  
  /**
   * 특정 모달을 닫는 함수 (ID가 없으면 최신 모달 닫기)
   */
  closeModal: (id?: string) => void;
  
  /**
   * 모든 모달을 닫는 함수
   */
  closeAllModals: () => void;
}

/**
 * 모달 프로바이더 Props 타입 정의
 */
interface ModalProviderProps {
  /**
   * 자식 컴포넌트들
   */
  children: ReactNode;
}

// ============================================
// Context & Hook
// ============================================

/**
 * 모달 컨텍스트 생성
 */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * 모달 컨텍스트 훅
 * @returns 모달 컨텍스트 값
 * @throws Error - ModalProvider 외부에서 사용 시 에러 발생
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

// ============================================
// Modal Provider Component
// ============================================

/**
 * 모달 프로바이더 컴포넌트
 * 중첩 모달 스택을 관리하고 전역 모달 상태를 제공합니다.
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // ============================================
  // Modal Control Functions
  // ============================================

  /**
   * 특정 모달을 닫는 함수
   * @param id - 닫을 모달의 ID (없으면 최신 모달 닫기)
   */
  const closeModal = useCallback((id?: string) => {
    if (id) {
      setModals(prev => prev.filter(modal => modal.id !== id));
    } else {
      // ID가 없으면 가장 최근 모달 닫기
      setModals(prev => prev.slice(0, -1));
    }
  }, []);

  /**
   * 새 모달을 열고 고유 ID를 반환하는 함수
   * @param modalContent - 모달에 표시될 콘텐츠
   * @returns 생성된 모달의 고유 ID
   */
  const openModal = useCallback((modalContent: ReactNode): string => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setModals(prev => {
      const zIndex = 9999 + prev.length;
      return [...prev, { id, content: modalContent, zIndex }];
    });
    return id;
  }, []);

  /**
   * 모든 모달을 닫는 함수
   */
  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  /**
   * backdrop 클릭으로 모달 닫기 핸들러
   * @param e - 마우스 이벤트
   * @param modalId - 닫을 모달의 ID
   */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, modalId: string) => {
      if (e.target === e.currentTarget) {
        closeModal(modalId);
      }
    },
    [closeModal]
  );

  // ============================================
  // Effects
  // ============================================

  /**
   * 클라이언트 사이드에서만 Portal 렌더링을 위한 마운트 상태 관리
   */
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  /**
   * ESC 키로 모달 닫기 및 body 스크롤 제어
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modals.length > 0) {
        closeModal();
      }
    };

    if (modals.length > 0) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [modals.length, closeModal]);

  // ============================================
  // Context Value
  // ============================================

  const modalValue: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };

  // ============================================
  // Render
  // ============================================

  return (
    <ModalContext.Provider value={modalValue}>
      {children}
      {mounted && modals.map((modal) =>
        createPortal(
          <div
            key={modal.id}
            className={styles.backdrop}
            style={{ zIndex: modal.zIndex }}
            onClick={(e) => handleBackdropClick(e, modal.id)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={styles.content}
              onClick={(e) => e.stopPropagation()}
            >
              {modal.content}
            </div>
          </div>,
          document.body
        )
      )}
    </ModalContext.Provider>
  );
};

// ============================================
// Export
// ============================================

export default ModalProvider;
