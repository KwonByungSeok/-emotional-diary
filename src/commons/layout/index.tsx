import React from "react";
import styles from "./styles.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>Header Area</header>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Banner */}
      <section className={styles.banner}>Banner Area</section>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Navigation */}
      <nav className={styles.navigation}>Navigation Area</nav>

      {/* Children Content */}
      <main className={styles.children}>{children}</main>

      {/* Footer */}
      <footer className={styles.footer}>Footer Area</footer>
    </div>
  );
}
