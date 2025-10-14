import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>민지의 다이어리</span>
        </div>
      </header>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Banner */}
      <section className={styles.banner}>
        <Image
          src="/images/banner.png"
          alt="배너 이미지"
          fill
          className={styles.bannerImage}
          priority
        />
      </section>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.tabContainer}>
          <div className={`${styles.tab} ${styles.tabActive}`}>
            <span className={styles.tabText}>일기보관함</span>
          </div>
          <div className={styles.tab}>
            <span className={`${styles.tabText} ${styles.tabInactive}`}>
              사진보관함
            </span>
          </div>
        </div>
      </nav>

      {/* Children Content */}
      <main className={styles.children}>{children}</main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <h3 className={styles.footerTitle}>민지의 다이어리</h3>
          <p className={styles.footerInfo}>대표 : {"{name}"}</p>
          <p className={styles.footerCopyright}>
            Copyright © 2024. {"{name}"} Co., Ltd.
          </p>
        </div>
      </footer>
    </div>
  );
}
