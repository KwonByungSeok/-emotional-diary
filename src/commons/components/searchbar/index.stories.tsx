import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Searchbar } from "./index";
import { SearchbarVariant, SearchbarSize, SearchbarTheme } from "@/commons/constants/enum";

// ============================================
// Meta Configuration
// ============================================

const meta: Meta<typeof Searchbar> = {
  title: "Commons/Components/Searchbar",
  component: Searchbar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 variant, size, theme를 지원하는 재사용 가능한 Searchbar 컴포넌트입니다. 검색 아이콘과 클리어 버튼을 포함합니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      description: "검색바의 시각적 스타일 variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "검색바의 크기",
      table: {
        defaultValue: { summary: "medium" },
      },
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
      description: "테마 모드",
      table: {
        defaultValue: { summary: "light" },
      },
    },
    placeholder: {
      control: { type: "text" },
      description: "플레이스홀더 텍스트",
      table: {
        defaultValue: { summary: "검색어를 입력해 주세요." },
      },
    },
    showSearchIcon: {
      control: { type: "boolean" },
      description: "검색 아이콘 표시 여부",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    showClearButton: {
      control: { type: "boolean" },
      description: "클리어 버튼 표시 여부",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "비활성화 상태",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    fullWidth: {
      control: { type: "boolean" },
      description: "전체 너비 사용 여부",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onSearch: {
      action: "검색 실행",
      description: "검색 실행 콜백 함수",
    },
    onClear: {
      action: "클리어 실행",
      description: "클리어 콜백 함수",
    },
  },
  tags: ["autodocs"],
};

export default meta;

// ============================================
// Story Types
// ============================================

type Story = StoryObj<typeof Searchbar>;

// ============================================
// Default Story
// ============================================

export const Default: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    size: SearchbarSize.MEDIUM,
    theme: SearchbarTheme.LIGHT,
    placeholder: "검색어를 입력해 주세요.",
    showSearchIcon: true,
    showClearButton: true,
    disabled: false,
    fullWidth: false,
  },
};

// ============================================
// Variant Stories
// ============================================

export const Primary: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    theme: SearchbarTheme.LIGHT,
    placeholder: "Primary 스타일 검색바",
  },
};

export const Secondary: Story = {
  args: {
    variant: SearchbarVariant.SECONDARY,
    theme: SearchbarTheme.LIGHT,
    placeholder: "Secondary 스타일 검색바",
  },
};

export const Tertiary: Story = {
  args: {
    variant: SearchbarVariant.TERTIARY,
    theme: SearchbarTheme.LIGHT,
    placeholder: "Tertiary 스타일 검색바",
  },
};

// ============================================
// Size Stories
// ============================================

export const Small: Story = {
  args: {
    size: SearchbarSize.SMALL,
    variant: SearchbarVariant.PRIMARY,
    placeholder: "작은 크기 검색바",
  },
};

export const Medium: Story = {
  args: {
    size: SearchbarSize.MEDIUM,
    variant: SearchbarVariant.PRIMARY,
    placeholder: "중간 크기 검색바",
  },
};

export const Large: Story = {
  args: {
    size: SearchbarSize.LARGE,
    variant: SearchbarVariant.PRIMARY,
    placeholder: "큰 크기 검색바",
  },
};

// ============================================
// Theme Stories
// ============================================

export const LightTheme: Story = {
  args: {
    theme: SearchbarTheme.LIGHT,
    variant: SearchbarVariant.PRIMARY,
    placeholder: "라이트 테마 검색바",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: SearchbarTheme.DARK,
    variant: SearchbarVariant.PRIMARY,
    placeholder: "다크 테마 검색바",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// ============================================
// Feature Stories
// ============================================

export const WithoutSearchIcon: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    showSearchIcon: false,
    placeholder: "검색 아이콘 없는 검색바",
  },
};

export const WithoutClearButton: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    showClearButton: false,
    placeholder: "클리어 버튼 없는 검색바",
  },
};

export const WithoutBothIcons: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    showSearchIcon: false,
    showClearButton: false,
    placeholder: "아이콘 없는 검색바",
  },
};

// ============================================
// State Stories
// ============================================

export const Disabled: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    disabled: true,
    placeholder: "비활성화된 검색바",
  },
};

export const WithValue: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    placeholder: "값이 있는 검색바",
    value: "검색어 예시",
  },
};

// ============================================
// Layout Stories
// ============================================

export const FullWidth: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    fullWidth: true,
    placeholder: "전체 너비 검색바",
  },
  parameters: {
    layout: "padded",
  },
};

// ============================================
// Combination Stories
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
      }}
    >
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        theme={SearchbarTheme.LIGHT}
        placeholder="Primary Light 스타일"
      />
      <Searchbar
        variant={SearchbarVariant.SECONDARY}
        theme={SearchbarTheme.LIGHT}
        placeholder="Secondary Light 스타일"
      />
      <Searchbar
        variant={SearchbarVariant.TERTIARY}
        theme={SearchbarTheme.LIGHT}
        placeholder="Tertiary Light 스타일"
      />
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        theme={SearchbarTheme.DARK}
        placeholder="Primary Dark 스타일"
      />
      <Searchbar
        variant={SearchbarVariant.SECONDARY}
        theme={SearchbarTheme.DARK}
        placeholder="Secondary Dark 스타일"
      />
      <Searchbar
        variant={SearchbarVariant.TERTIARY}
        theme={SearchbarTheme.DARK}
        placeholder="Tertiary Dark 스타일"
      />
    </div>
  ),
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
      }}
    >
      <Searchbar
        size={SearchbarSize.SMALL}
        variant={SearchbarVariant.PRIMARY}
        placeholder="작은 크기 검색바"
      />
      <Searchbar
        size={SearchbarSize.MEDIUM}
        variant={SearchbarVariant.PRIMARY}
        placeholder="중간 크기 검색바"
      />
      <Searchbar size={SearchbarSize.LARGE} variant={SearchbarVariant.PRIMARY} placeholder="큰 크기 검색바" />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
      }}
    >
      <Searchbar variant={SearchbarVariant.PRIMARY} placeholder="정상 상태 검색바" />
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        placeholder="값이 있는 검색바"
        value="검색어 예시"
      />
      <Searchbar variant={SearchbarVariant.PRIMARY} placeholder="비활성화된 검색바" disabled />
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        placeholder="검색 아이콘 없는 검색바"
        showSearchIcon={false}
      />
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        placeholder="클리어 버튼 없는 검색바"
        showClearButton={false}
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const FeatureVariations: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
      }}
    >
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        placeholder="기본 검색바 (아이콘 모두 포함)"
      />
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        placeholder="검색 아이콘만 있는 검색바"
        showClearButton={false}
      />
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        placeholder="클리어 버튼만 있는 검색바"
        showSearchIcon={false}
      />
      <Searchbar
        variant={SearchbarVariant.PRIMARY}
        placeholder="아이콘 없는 검색바"
        showSearchIcon={false}
        showClearButton={false}
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

// ============================================
// Interactive Story
// ============================================

export const Interactive: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    placeholder: "상호작용 가능한 검색바",
  },
  play: async ({ canvasElement }) => {
    const searchbar = canvasElement.querySelector("input");
    const searchButton = canvasElement.querySelector('[aria-label="검색"]');
    const clearButton = canvasElement.querySelector(
      '[aria-label="검색어 지우기"]'
    );

    if (searchbar) {
      searchbar.addEventListener("focus", () => {
        console.log("Searchbar focused!");
      });
      searchbar.addEventListener("blur", () => {
        console.log("Searchbar blurred!");
      });
      searchbar.addEventListener("change", (e) => {
        console.log("Searchbar changed:", (e.target as HTMLInputElement).value);
      });
      searchbar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          console.log("Search executed:", (e.target as HTMLInputElement).value);
        }
      });
    }

    if (searchButton) {
      searchButton.addEventListener("click", () => {
        console.log("Search button clicked!");
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", () => {
        console.log("Clear button clicked!");
      });
    }
  },
};

// ============================================
// Real World Example Stories
// ============================================

export const HeaderSearchbar: Story = {
  args: {
    variant: SearchbarVariant.SECONDARY,
    size: SearchbarSize.MEDIUM,
    placeholder: "제품, 브랜드, 키워드 검색",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export const MobileSearchbar: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    size: SearchbarSize.LARGE,
    placeholder: "검색어를 입력하세요",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const CompactSearchbar: Story = {
  args: {
    variant: SearchbarVariant.TERTIARY,
    size: SearchbarSize.SMALL,
    placeholder: "빠른 검색",
    showClearButton: false,
  },
  parameters: {
    layout: "padded",
  },
};

// ============================================
// Accessibility Story
// ============================================

export const AccessibilityExample: Story = {
  args: {
    variant: SearchbarVariant.PRIMARY,
    placeholder: "접근성을 고려한 검색바",
    "data-testid": "searchbar-accessibility",
    id: "main-searchbar",
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "이 검색바는 접근성을 고려하여 구현되었습니다. 검색 아이콘과 클리어 버튼에 적절한 aria-label이 설정되어 있습니다.",
      },
    },
  },
};
