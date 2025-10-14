"use client";

import { useState } from "react";
import Button from "@/commons/components/button";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className={`min-h-screen p-8 ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Button Component Demo
          </h1>
          <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            모든 variant, size, theme 조합을 확인할 수 있습니다.
          </p>
          
          {/* Theme Toggle */}
          <div className="mt-6 flex gap-4">
            <Button
              variant="secondary"
              size="medium"
              theme={theme}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </Button>
          </div>
        </div>

        {/* Button Grid */}
        <div className="space-y-12">
          {/* Light Theme Buttons */}
          <section>
            <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Light Theme
            </h2>
            
            {/* Primary Variant */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Primary
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="small" theme="light">
                  Small Button
                </Button>
                <Button variant="primary" size="medium" theme="light">
                  Medium Button
                </Button>
                <Button variant="primary" size="large" theme="light">
                  Large Button
                </Button>
                <Button variant="primary" size="medium" theme="light" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>

            {/* Secondary Variant */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Secondary
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="small" theme="light">
                  Small Button
                </Button>
                <Button variant="secondary" size="medium" theme="light">
                  Medium Button
                </Button>
                <Button variant="secondary" size="large" theme="light">
                  Large Button
                </Button>
                <Button variant="secondary" size="medium" theme="light" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>

            {/* Tertiary Variant */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Tertiary
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="tertiary" size="small" theme="light">
                  Small Button
                </Button>
                <Button variant="tertiary" size="medium" theme="light">
                  Medium Button
                </Button>
                <Button variant="tertiary" size="large" theme="light">
                  Large Button
                </Button>
                <Button variant="tertiary" size="medium" theme="light" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>
          </section>

          {/* Dark Theme Buttons */}
          <section>
            <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Dark Theme
            </h2>
            
            {/* Primary Variant */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Primary
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="small" theme="dark">
                  Small Button
                </Button>
                <Button variant="primary" size="medium" theme="dark">
                  Medium Button
                </Button>
                <Button variant="primary" size="large" theme="dark">
                  Large Button
                </Button>
                <Button variant="primary" size="medium" theme="dark" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>

            {/* Secondary Variant */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Secondary
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" size="small" theme="dark">
                  Small Button
                </Button>
                <Button variant="secondary" size="medium" theme="dark">
                  Medium Button
                </Button>
                <Button variant="secondary" size="large" theme="dark">
                  Large Button
                </Button>
                <Button variant="secondary" size="medium" theme="dark" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>

            {/* Tertiary Variant */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Tertiary
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="tertiary" size="small" theme="dark">
                  Small Button
                </Button>
                <Button variant="tertiary" size="medium" theme="dark">
                  Medium Button
                </Button>
                <Button variant="tertiary" size="large" theme="dark">
                  Large Button
                </Button>
                <Button variant="tertiary" size="medium" theme="dark" disabled>
                  Disabled Button
                </Button>
              </div>
            </div>
          </section>

          {/* Full Width Example */}
          <section>
            <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Full Width Example
            </h2>
            <div className="space-y-4 max-w-md">
              <Button variant="primary" size="medium" theme={theme} fullWidth>
                Full Width Primary
              </Button>
              <Button variant="secondary" size="medium" theme={theme} fullWidth>
                Full Width Secondary
              </Button>
              <Button variant="tertiary" size="medium" theme={theme} fullWidth>
                Full Width Tertiary
              </Button>
            </div>
          </section>

          {/* Interactive Examples */}
          <section>
            <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Interactive Examples
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="medium"
                theme={theme}
                onClick={() => alert("Primary button clicked!")}
              >
                Click Me (Primary)
              </Button>
              <Button
                variant="secondary"
                size="medium"
                theme={theme}
                onClick={() => alert("Secondary button clicked!")}
              >
                Click Me (Secondary)
              </Button>
              <Button
                variant="tertiary"
                size="medium"
                theme={theme}
                onClick={() => alert("Tertiary button clicked!")}
              >
                Click Me (Tertiary)
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
