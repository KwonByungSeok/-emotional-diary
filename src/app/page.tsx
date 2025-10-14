"use client";

import React, { useState } from "react";
import Button from "@/commons/components/button";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingTest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "3rem",
        backgroundColor: theme === "light" ? "#FAFAFA" : "#0A0A0A",
        color: theme === "light" ? "#171717" : "#FAFAFA",
        transition: "all 0.3s",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Button Component Test
          </h1>
          <Button
            variant="secondary"
            size="medium"
            theme={theme}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙 다크모드" : "☀️ 라이트모드"}
          </Button>
        </div>

        {/* Primary Variant */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Primary Variant
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button variant="primary" size="small" theme={theme}>
              Small
            </Button>
            <Button variant="primary" size="medium" theme={theme}>
              Medium
            </Button>
            <Button variant="primary" size="large" theme={theme}>
              Large
            </Button>
            <Button variant="primary" size="medium" theme={theme} disabled>
              Disabled
            </Button>
            <Button
              variant="primary"
              size="medium"
              theme={theme}
              isLoading={isLoading}
              onClick={handleLoadingTest}
            >
              Loading Test
            </Button>
          </div>
        </section>

        {/* Secondary Variant */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Secondary Variant
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button variant="secondary" size="small" theme={theme}>
              Small
            </Button>
            <Button variant="secondary" size="medium" theme={theme}>
              Medium
            </Button>
            <Button variant="secondary" size="large" theme={theme}>
              Large
            </Button>
            <Button variant="secondary" size="medium" theme={theme} disabled>
              Disabled
            </Button>
            <Button
              variant="secondary"
              size="medium"
              theme={theme}
              isLoading={isLoading}
              onClick={handleLoadingTest}
            >
              Loading Test
            </Button>
          </div>
        </section>

        {/* Tertiary Variant */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Tertiary Variant
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button variant="tertiary" size="small" theme={theme}>
              Small
            </Button>
            <Button variant="tertiary" size="medium" theme={theme}>
              Medium
            </Button>
            <Button variant="tertiary" size="large" theme={theme}>
              Large
            </Button>
            <Button variant="tertiary" size="medium" theme={theme} disabled>
              Disabled
            </Button>
            <Button
              variant="tertiary"
              size="medium"
              theme={theme}
              isLoading={isLoading}
              onClick={handleLoadingTest}
            >
              Loading Test
            </Button>
          </div>
        </section>

        {/* With Icons */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            With Icons
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button
              variant="primary"
              size="medium"
              theme={theme}
              iconLeft={<span>←</span>}
            >
              이전
            </Button>
            <Button
              variant="primary"
              size="medium"
              theme={theme}
              iconRight={<span>→</span>}
            >
              다음
            </Button>
            <Button
              variant="secondary"
              size="medium"
              theme={theme}
              iconLeft={<span>✓</span>}
            >
              확인
            </Button>
            <Button
              variant="tertiary"
              size="medium"
              theme={theme}
              iconLeft={<span>+</span>}
            >
              추가
            </Button>
          </div>
        </section>

        {/* Full Width */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            Full Width
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Button
              variant="primary"
              size="medium"
              theme={theme}
              fullWidth
            >
              Full Width Primary
            </Button>
            <Button
              variant="secondary"
              size="medium"
              theme={theme}
              fullWidth
            >
              Full Width Secondary
            </Button>
            <Button
              variant="tertiary"
              size="medium"
              theme={theme}
              fullWidth
            >
              Full Width Tertiary
            </Button>
          </div>
        </section>

        {/* All Combinations */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            All Combinations (variant × size × theme)
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {["primary", "secondary", "tertiary"].map((variant) => (
              <div key={variant}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "500",
                    marginBottom: "0.5rem",
                    textTransform: "capitalize",
                  }}
                >
                  {variant}
                </h3>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {["small", "medium", "large"].map((size) => (
                    <Button
                      key={`${variant}-${size}`}
                      variant={variant as "primary" | "secondary" | "tertiary"}
                      size={size as "small" | "medium" | "large"}
                      theme={theme}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
