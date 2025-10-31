"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";
import { useLinkRouting } from "./hooks/index.link.routing.hook";
import { useArea } from "./hooks/index.area.hook";
import { useAuth } from "@/commons/providers/auth/auth.provider";
import { Button } from "@/commons/components/button";

// ============================================
// Type Definitions
// ============================================

interface LayoutProps {
  children: React.ReactNode;
}

// ============================================
// Layout Component
// ============================================

export default function Layout({ children }: LayoutProps) {
  const { activeTab, getLogoNavigationPath, getTabNavigationPath } = useLinkRouting();
  const { showHeader, showLogo, showBanner, showNavigation, showFooter } = useArea();
  const { isLoggedIn, user } = useAuth();

  return (
    <>
      <div className={styles.container}>
        {/* ============================================
            Header Section
            ============================================ */}
        {showHeader && (
          <header className={styles.header}>
            {showLogo && (
              <Link href={getLogoNavigationPath()} className={styles.logo} data-testid="logo-link">
                <span className={styles.logoText}>민지의 다이어리</span>
              </Link>
            )}
            {/* ============================================
                Auth Status Section
                ============================================ */}
            {isLoggedIn && user && (
              <div className={styles.authStatus}>
                <span className={styles.userName}>{user.name}</span>
                <Button
                  variant="secondary"
                  theme="light"
                  size="medium"
                  onClick={() => {}}
                  className={styles.logoutButton}
                  data-testid="logout-button"
                >
                  로그아웃
                </Button>
              </div>
            )}
          </header>
        )}

        {/* ============================================
            Gap Section
            ============================================ */}
        {showHeader && <div className={styles.gap}></div>}

        {/* ============================================
            Banner Section
            ============================================ */}
        {showBanner && (
          <section className={styles.banner}>
            <Image
              src="/images/banner.png"
              alt="배너 이미지"
              fill
              className={styles.bannerImage}
              priority
            />
          </section>
        )}

        {/* ============================================
            Gap Section
            ============================================ */}
        {showBanner && <div className={styles.gap}></div>}

        {/* ============================================
            Navigation Section
            ============================================ */}
        {showNavigation && (
          <nav className={styles.navigation}>
            <div className={styles.tabContainer}>
              <Link 
                href={getTabNavigationPath('diaries')} 
                className={`${styles.tab} ${activeTab === 'diaries' ? styles.activeTab : ''}`} 
                data-testid="diaries-tab"
              >
                <span 
                  className={`${styles.tabText} ${
                    activeTab === 'diaries' ? styles.tabTextActive : styles.tabTextInactive
                  }`}
                  data-testid="diaries-tab-text"
                >
                  일기보관함
                </span>
              </Link>
              <Link 
                href={getTabNavigationPath('pictures')} 
                className={`${styles.tab} ${activeTab === 'pictures' ? styles.activeTab : ''}`} 
                data-testid="pictures-tab"
              >
                <span 
                  className={`${styles.tabText} ${
                    activeTab === 'pictures' ? styles.tabTextActive : styles.tabTextInactive
                  }`}
                  data-testid="pictures-tab-text"
                >
                  사진보관함
                </span>
              </Link>
            </div>
          </nav>
        )}

        {/* ============================================
            Children Content Section
            ============================================ */}
        <main className={styles.children}>{children}</main>
      </div>

      {/* ============================================
          Footer Section (Container 밖으로 분리)
          ============================================ */}
      {showFooter && (
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <h3 className={styles.footerTitle}>민지의 다이어리</h3>
            <p className={styles.footerInfo}>대표 : {"{name}"}</p>
            <p className={styles.footerCopyright}>
              Copyright © 2024. {"{name}"} Co., Ltd.
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
