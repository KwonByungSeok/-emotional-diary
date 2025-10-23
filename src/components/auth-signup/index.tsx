"use client";

import React from "react";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { useSignupForm } from "./hooks/index.form.hook";
import styles from "./styles.module.css";

// ============================================
// Type Definitions
// ============================================

export interface AuthSignupProps {
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

// ============================================
// AuthSignup Component
// ============================================

export const AuthSignup: React.FC<AuthSignupProps> = ({ className = "" }) => {
  const { register, handleSubmit, errors, isButtonEnabled, isSubmitting } = useSignupForm();

  return (
    <div className={`${styles.container} ${className}`} data-testid="auth-signup-container">
      {/* Card Container */}
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            새로운 계정을 만들어 시작해보세요
          </p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className={styles.inputGroup}>
          <Input
            {...register("email")}
            variant="primary"
            theme="light"
            size="medium"
            label="이메일"
            placeholder="이메일을 입력해주세요"
            type="email"
            required
            className={styles.input}
            error={!!errors.email}
            errorMessage={errors.email?.message}
            data-testid="email-input"
          />
        </div>

        {/* Password Input */}
        <div className={styles.inputGroup}>
          <Input
            {...register("password")}
            variant="primary"
            theme="light"
            size="medium"
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            type="password"
            required
            className={styles.input}
            error={!!errors.password}
            errorMessage={errors.password?.message}
            data-testid="password-input"
          />
        </div>

        {/* Confirm Password Input */}
        <div className={styles.inputGroup}>
          <Input
            {...register("passwordConfirm")}
            variant="primary"
            theme="light"
            size="medium"
            label="비밀번호 재입력"
            placeholder="비밀번호를 다시 입력해주세요"
            type="password"
            required
            className={styles.input}
            error={!!errors.passwordConfirm}
            errorMessage={errors.passwordConfirm?.message}
            data-testid="passwordConfirm-input"
          />
        </div>

        {/* Name Input */}
        <div className={styles.inputGroup}>
          <Input
            {...register("name")}
            variant="primary"
            theme="light"
            size="medium"
            label="이름"
            placeholder="이름을 입력해주세요"
            type="text"
            required
            className={styles.input}
            error={!!errors.name}
            errorMessage={errors.name?.message}
            data-testid="name-input"
          />
        </div>

        {/* Submit Button */}
        <div className={styles.buttonGroup}>
          <Button
            type="submit"
            variant="primary"
            theme="light"
            size="large"
            fullWidth
            disabled={!isButtonEnabled}
            className={styles.submitButton}
            data-testid="signup-submit-button"
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </Button>
        </div>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            이미 계정이 있으신가요?{" "}
            <a href="/auth/login" className={styles.loginLink}>
              로그인하기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

AuthSignup.displayName = "AuthSignup";

// ============================================
// Export
// ============================================

export default AuthSignup;
