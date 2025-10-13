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

/**
 * 모달 컨텍스트 타입 정의
 */
interface ModalContextType {
  isOpen: boolean;
  content: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

/**
 * 모달 컨텍스트 생성
 */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * 모달 컨텍스트 훅
 */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

/**
 * 모달 프로바이더 Props
 */
interface ModalProviderProps {
  children: ReactNode;
}

/**
 * 모달 프로바이더 컴포넌트
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 Portal 렌더링
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 모달 열기
  const openModal = useCallback((modalContent: ReactNode) => {
    setContent(modalContent);
    setIsOpen(true);
  }, []);

  // 모달 닫기
  const closeModal = useCallback(() => {
    setIsOpen(false);
    // 애니메이션을 위한 딜레이 후 content 제거
    setTimeout(() => {
      setContent(null);
    }, 200);
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // body 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeModal]);

  // backdrop 클릭으로 모달 닫기
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    },
    [closeModal]
  );

  const modalValue: ModalContextType = {
    isOpen,
    content,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={modalValue}>
      {children}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className={`
              fixed inset-0 z-[9999] 
              flex items-center justify-center
              bg-black/50
              transition-opacity duration-200
              ${isOpen ? "opacity-100" : "opacity-0"}
            `}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`
                bg-white dark:bg-gray-800 
                rounded-lg shadow-xl
                transition-all duration-200
                ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </div>
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
