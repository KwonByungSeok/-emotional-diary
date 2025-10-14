import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination } from "./index";
import { useState } from "react";

// ============================================
// Meta Configuration
// ============================================

const meta: Meta<typeof Pagination> = {
  title: "Commons/Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 variant, size, theme를 지원하는 재사용 가능한 Pagination 컴포넌트입니다. 페이지 네비게이션, 생략 표시, 경계 버튼 등을 지원합니다.",
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      description: "현재 페이지 번호 (1부터 시작)",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "전체 페이지 수",
      table: {
        defaultValue: { summary: "10" },
      },
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      description: "페이지네이션의 시각적 스타일 variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "페이지네이션의 크기",
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
    maxVisiblePages: {
      control: { type: "number", min: 3, max: 10 },
      description: "표시할 최대 페이지 버튼 수",
      table: {
        defaultValue: { summary: "5" },
      },
    },
    showNavigationButtons: {
      control: { type: "boolean" },
      description: "이전/다음 버튼 표시 여부",
      table: {
        defaultValue: { summary: "true" },
      },
    },
    showBoundaryButtons: {
      control: { type: "boolean" },
      description: "첫 페이지/마지막 페이지로 이동 버튼 표시 여부",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    showEllipsis: {
      control: { type: "boolean" },
      description: "생략 표시(...) 사용 여부",
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
    onPageChange: {
      action: "pageChanged",
      description: "페이지 변경 시 호출되는 콜백 함수",
    },
  },
  tags: ["autodocs"],
};

export default meta;

// ============================================
// Story Types
// ============================================

type Story = StoryObj<typeof Pagination>;

// ============================================
// Interactive Wrapper Component
// ============================================

const InteractivePagination = (args: React.ComponentProps<typeof Pagination>) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    args.onPageChange?.(page);
  };

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
};

// ============================================
// Default Story
// ============================================

export const Default: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 1,
    totalPages: 10,
    variant: "primary",
    size: "medium",
    theme: "light",
    maxVisiblePages: 5,
    showNavigationButtons: true,
    showBoundaryButtons: false,
    showEllipsis: true,
    disabled: false,
  },
};

// ============================================
// Variant Stories
// ============================================

export const Primary: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    variant: "primary",
    theme: "light",
  },
};

export const Secondary: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    variant: "secondary",
    theme: "light",
  },
};

export const Tertiary: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    variant: "tertiary",
    theme: "light",
  },
};

// ============================================
// Size Stories
// ============================================

export const Small: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    size: "small",
    variant: "primary",
  },
};

export const Medium: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    size: "medium",
    variant: "primary",
  },
};

export const Large: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    size: "large",
    variant: "primary",
  },
};

// ============================================
// Theme Stories
// ============================================

export const LightTheme: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    theme: "light",
    variant: "primary",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkTheme: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    theme: "dark",
    variant: "primary",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// ============================================
// State Stories
// ============================================

export const Disabled: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 10,
    disabled: true,
    variant: "primary",
  },
};

export const FirstPage: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 1,
    totalPages: 10,
    variant: "primary",
  },
};

export const LastPage: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 10,
    totalPages: 10,
    variant: "primary",
  },
};

export const MiddlePage: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 5,
    totalPages: 10,
    variant: "primary",
  },
};

// ============================================
// Page Count Stories
// ============================================

export const FewPages: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 2,
    totalPages: 3,
    variant: "primary",
  },
};

export const ManyPages: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 15,
    totalPages: 50,
    variant: "primary",
  },
};

export const SinglePage: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 1,
    totalPages: 1,
    variant: "primary",
  },
};

// ============================================
// Option Stories
// ============================================

export const WithBoundaryButtons: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 5,
    totalPages: 20,
    showBoundaryButtons: true,
    variant: "primary",
  },
};

export const WithoutNavigationButtons: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 5,
    totalPages: 10,
    showNavigationButtons: false,
    variant: "primary",
  },
};

export const WithoutEllipsis: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 5,
    totalPages: 20,
    showEllipsis: false,
    variant: "primary",
  },
};

export const CustomMaxVisiblePages: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 10,
    totalPages: 50,
    maxVisiblePages: 7,
    variant: "primary",
  },
};

export const MinimalPagination: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 5,
    showNavigationButtons: false,
    showBoundaryButtons: false,
    showEllipsis: false,
    variant: "primary",
  },
};

// ============================================
// Combination Stories
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Primary Variant</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          variant="primary"
          theme="light"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Secondary Variant</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          variant="secondary"
          theme="light"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Tertiary Variant</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          variant="tertiary"
          theme="light"
          onPageChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Small Size</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          size="small"
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Medium Size</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          size="medium"
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Large Size</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          size="large"
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Light Theme</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          theme="light"
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Dark Theme</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          theme="dark"
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Normal State</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Disabled State</h3>
        <InteractivePagination
          currentPage={3}
          totalPages={10}
          disabled
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>First Page</h3>
        <InteractivePagination
          currentPage={1}
          totalPages={10}
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Last Page</h3>
        <InteractivePagination
          currentPage={10}
          totalPages={10}
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllOptions: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Default Options</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={20}
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>With Boundary Buttons</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={20}
          showBoundaryButtons
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Without Navigation Buttons</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={20}
          showNavigationButtons={false}
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Without Ellipsis</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={20}
          showEllipsis={false}
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "8px" }}>Custom Max Visible Pages (7)</h3>
        <InteractivePagination
          currentPage={10}
          totalPages={50}
          maxVisiblePages={7}
          variant="primary"
          onPageChange={() => {}}
        />
      </div>
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
  render: InteractivePagination,
  args: {
    currentPage: 1,
    totalPages: 20,
    variant: "primary",
    showBoundaryButtons: true,
  },
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll("button");
    if (buttons.length > 0) {
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          console.log("Pagination button clicked!");
        });
      });
    }
  },
};

// ============================================
// Real-world Examples
// ============================================

export const BlogPagination: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 3,
    totalPages: 15,
    variant: "secondary",
    size: "medium",
    showBoundaryButtons: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "블로그 게시물 목록에서 사용하는 일반적인 페이지네이션 예시입니다.",
      },
    },
  },
};

export const AdminPanelPagination: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 8,
    totalPages: 100,
    variant: "primary",
    size: "small",
    showBoundaryButtons: true,
    maxVisiblePages: 7,
  },
  parameters: {
    docs: {
      description: {
        story: "관리자 패널에서 사용하는 고급 페이지네이션 예시입니다.",
      },
    },
  },
};

export const MobilePagination: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 2,
    totalPages: 8,
    variant: "tertiary",
    size: "small",
    showBoundaryButtons: false,
    maxVisiblePages: 3,
  },
  parameters: {
    docs: {
      description: {
        story: "모바일 환경에 최적화된 간단한 페이지네이션 예시입니다.",
      },
    },
  },
};
