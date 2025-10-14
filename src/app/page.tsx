"use client";

import Image from "next/image";
import { Input } from "@/commons/components/input";
import { Searchbar } from "@/commons/components/searchbar";
import { Toggle } from "@/commons/components/toggle";
import { SearchbarVariant, SearchbarSize } from "@/commons/constants/enum";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* Searchbar Component Test Section */}
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold mb-4">Searchbar Component Test</h2>

          {/* Primary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Primary Variant</h3>
            <Searchbar
              variant={SearchbarVariant.PRIMARY}
              size={SearchbarSize.SMALL}
              placeholder="검색어를 입력해 주세요."
              onSearch={(value) => console.log("Search:", value)}
              onClear={() => console.log("Cleared")}
            />
            <Searchbar
              variant={SearchbarVariant.PRIMARY}
              size={SearchbarSize.MEDIUM}
              placeholder="검색어를 입력해 주세요."
              onSearch={(value) => console.log("Search:", value)}
              onClear={() => console.log("Cleared")}
            />
            <Searchbar
              variant={SearchbarVariant.PRIMARY}
              size={SearchbarSize.LARGE}
              placeholder="검색어를 입력해 주세요."
              onSearch={(value) => console.log("Search:", value)}
              onClear={() => console.log("Cleared")}
            />
          </div>

          {/* Secondary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Secondary Variant</h3>
            <Searchbar
              variant={SearchbarVariant.SECONDARY}
              size={SearchbarSize.MEDIUM}
              placeholder="검색어를 입력해 주세요."
              onSearch={(value) => console.log("Search:", value)}
              onClear={() => console.log("Cleared")}
            />
          </div>

          {/* Tertiary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tertiary Variant</h3>
            <Searchbar
              variant={SearchbarVariant.TERTIARY}
              size={SearchbarSize.MEDIUM}
              placeholder="검색어를 입력해 주세요."
              onSearch={(value) => console.log("Search:", value)}
              onClear={() => console.log("Cleared")}
            />
          </div>

          {/* Without Icons */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Without Icons</h3>
            <Searchbar
              variant={SearchbarVariant.PRIMARY}
              size={SearchbarSize.MEDIUM}
              placeholder="검색어를 입력해 주세요."
              showSearchIcon={false}
              showClearButton={false}
              onSearch={(value) => console.log("Search:", value)}
            />
          </div>

          {/* Full Width */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Full Width</h3>
            <Searchbar
              variant={SearchbarVariant.PRIMARY}
              size={SearchbarSize.MEDIUM}
              placeholder="검색어를 입력해 주세요."
              fullWidth={true}
              onSearch={(value) => console.log("Search:", value)}
              onClear={() => console.log("Cleared")}
            />
          </div>

          {/* Disabled State */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Disabled State</h3>
            <Searchbar
              variant={SearchbarVariant.PRIMARY}
              size={SearchbarSize.MEDIUM}
              placeholder="검색어를 입력해 주세요."
              disabled={true}
            />
          </div>
        </div>

        {/* Toggle Component Test Section */}
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold mb-4">Toggle Component Test</h2>

          {/* Primary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Primary Variant</h3>
            <Toggle
              variant="primary"
              size="small"
              label="Small Toggle"
              description="This is a small primary toggle"
              onChange={(checked) => console.log("Small toggle:", checked)}
            />
            <Toggle
              variant="primary"
              size="medium"
              label="Medium Toggle (Default)"
              description="This matches the Figma design"
              onChange={(checked) => console.log("Medium toggle:", checked)}
            />
            <Toggle
              variant="primary"
              size="large"
              label="Large Toggle"
              description="This is a large primary toggle"
              onChange={(checked) => console.log("Large toggle:", checked)}
            />
          </div>

          {/* Secondary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Secondary Variant</h3>
            <Toggle
              variant="secondary"
              size="medium"
              label="Secondary Toggle"
              description="This is a secondary variant"
              onChange={(checked) => console.log("Secondary toggle:", checked)}
            />
          </div>

          {/* Tertiary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tertiary Variant</h3>
            <Toggle
              variant="tertiary"
              size="medium"
              label="Tertiary Toggle"
              description="This is a tertiary variant"
              onChange={(checked) => console.log("Tertiary toggle:", checked)}
            />
          </div>

          {/* Label Position */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Label Position</h3>
            <Toggle
              variant="primary"
              size="medium"
              label="Left Label"
              labelPosition="left"
              description="Label on the left side"
              onChange={(checked) => console.log("Left label toggle:", checked)}
            />
            <Toggle
              variant="primary"
              size="medium"
              label="Right Label"
              labelPosition="right"
              description="Label on the right side"
              onChange={(checked) =>
                console.log("Right label toggle:", checked)
              }
            />
          </div>

          {/* Controlled Toggle */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Controlled Toggle</h3>
            <Toggle
              variant="primary"
              size="medium"
              label="Controlled Toggle"
              description="This toggle is controlled"
              checked={true}
              onChange={(checked) => console.log("Controlled toggle:", checked)}
            />
          </div>

          {/* Error State */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Error State</h3>
            <Toggle
              variant="primary"
              size="medium"
              label="Error Toggle"
              description="This toggle has an error"
              error={true}
              errorMessage="This field is required"
              onChange={(checked) => console.log("Error toggle:", checked)}
            />
          </div>

          {/* Disabled State */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Disabled State</h3>
            <Toggle
              variant="primary"
              size="medium"
              label="Disabled Toggle (Off)"
              description="This toggle is disabled"
              disabled={true}
            />
            <Toggle
              variant="primary"
              size="medium"
              label="Disabled Toggle (On)"
              description="This toggle is disabled but checked"
              disabled={true}
              defaultChecked={true}
            />
          </div>

          {/* Full Width */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Full Width</h3>
            <Toggle
              variant="primary"
              size="medium"
              label="Full Width Toggle"
              description="This toggle takes full width"
              fullWidth={true}
              onChange={(checked) => console.log("Full width toggle:", checked)}
            />
          </div>

          {/* No Label */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">No Label</h3>
            <Toggle
              variant="primary"
              size="medium"
              onChange={(checked) => console.log("No label toggle:", checked)}
            />
          </div>
        </div>

        {/* Input Component Test Section */}
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold mb-4">Input Component Test</h2>

          {/* Primary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Primary Variant</h3>
            <Input
              variant="primary"
              size="small"
              label="Small Input"
              placeholder="회고를 남겨보세요."
              helpText="This is a small primary input"
            />
            <Input
              variant="primary"
              size="medium"
              label="Medium Input (Default)"
              placeholder="회고를 남겨보세요."
              helpText="This matches the Figma design"
            />
            <Input
              variant="primary"
              size="large"
              label="Large Input"
              placeholder="회고를 남겨보세요."
              helpText="This is a large primary input"
            />
          </div>

          {/* Secondary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Secondary Variant</h3>
            <Input
              variant="secondary"
              size="medium"
              label="Secondary Input"
              placeholder="회고를 남겨보세요."
              helpText="This is a secondary variant"
            />
          </div>

          {/* Tertiary Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tertiary Variant</h3>
            <Input
              variant="tertiary"
              size="medium"
              label="Tertiary Input"
              placeholder="회고를 남겨보세요."
              helpText="This is a tertiary variant"
            />
          </div>

          {/* Error State */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Error State</h3>
            <Input
              variant="primary"
              size="medium"
              label="Error Input"
              placeholder="회고를 남겨보세요."
              error={true}
              errorMessage="This field is required"
            />
          </div>

          {/* Required Field */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Required Field</h3>
            <Input
              variant="primary"
              size="medium"
              label="Required Input"
              placeholder="회고를 남겨보세요."
              required={true}
              helpText="This field is required"
            />
          </div>

          {/* Full Width */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Full Width</h3>
            <Input
              variant="primary"
              size="medium"
              label="Full Width Input"
              placeholder="회고를 남겨보세요."
              fullWidth={true}
              helpText="This input takes full width"
            />
          </div>
        </div>

        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
