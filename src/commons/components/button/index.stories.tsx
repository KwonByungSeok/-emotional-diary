import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./index";

// ============================================
// Meta Configuration
// ============================================

const meta: Meta<typeof Button> = {
  title: "Commons/Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 variant, size, theme를 지원하는 재사용 가능한 Button 컴포넌트입니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      description: "버튼의 시각적 스타일 variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "버튼의 크기",
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
    loading: {
      control: { type: "boolean" },
      description: "로딩 상태",
      table: {
        defaultValue: { summary: "false" },
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
    iconPosition: {
      control: { type: "select" },
      options: ["left", "right"],
      description: "아이콘 위치",
      table: {
        defaultValue: { summary: "left" },
      },
    },
    children: {
      control: { type: "text" },
      description: "버튼 텍스트",
    },
  },
  tags: ["autodocs"],
};

export default meta;

// ============================================
// Story Types
// ============================================

type Story = StoryObj<typeof Button>;

// ============================================
// Default Story
// ============================================

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "medium",
    theme: "light",
    loading: false,
    disabled: false,
    fullWidth: false,
    iconPosition: "left",
  },
};

// ============================================
// Variant Stories
// ============================================

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    theme: "light",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    theme: "light",
  },
};

export const Tertiary: Story = {
  args: {
    children: "Tertiary Button",
    variant: "tertiary",
    theme: "light",
  },
};

// ============================================
// Size Stories
// ============================================

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "small",
    variant: "primary",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium Button",
    size: "medium",
    variant: "primary",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "large",
    variant: "primary",
  },
};

// ============================================
// Theme Stories
// ============================================

export const LightTheme: Story = {
  args: {
    children: "Light Theme Button",
    theme: "light",
    variant: "primary",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkTheme: Story = {
  args: {
    children: "Dark Theme Button",
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

export const Loading: Story = {
  args: {
    children: "Loading Button",
    loading: true,
    variant: "primary",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
    variant: "primary",
  },
};

export const LoadingDisabled: Story = {
  args: {
    children: "Loading Disabled",
    loading: true,
    disabled: true,
    variant: "primary",
  },
};

// ============================================
// Icon Stories
// ============================================

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 3.5a.5.5 0 0 1 .5.5v3.5h3.5a.5.5 0 0 1 0 1H8.5V13a.5.5 0 0 1-1 0V8.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
);

export const WithIconLeft: Story = {
  args: {
    children: "Add Item",
    icon: <PlusIcon />,
    iconPosition: "left",
    variant: "primary",
  },
};

export const WithIconRight: Story = {
  args: {
    children: "Search",
    icon: <SearchIcon />,
    iconPosition: "right",
    variant: "secondary",
  },
};

export const IconOnly: Story = {
  args: {
    children: "",
    icon: <PlusIcon />,
    iconPosition: "left",
    variant: "tertiary",
    size: "small",
  },
};

// ============================================
// Layout Stories
// ============================================

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
    variant: "primary",
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
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button variant="primary" theme="light">
        Primary Light
      </Button>
      <Button variant="secondary" theme="light">
        Secondary Light
      </Button>
      <Button variant="tertiary" theme="light">
        Tertiary Light
      </Button>
      <Button variant="primary" theme="dark">
        Primary Dark
      </Button>
      <Button variant="secondary" theme="dark">
        Secondary Dark
      </Button>
      <Button variant="tertiary" theme="dark">
        Tertiary Dark
      </Button>
    </div>
  ),
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Button size="small" variant="primary">
        Small
      </Button>
      <Button size="medium" variant="primary">
        Medium
      </Button>
      <Button size="large" variant="primary">
        Large
      </Button>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button variant="primary">Normal</Button>
      <Button variant="primary" loading>
        Loading
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button variant="secondary" loading disabled>
        Loading Disabled
      </Button>
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
    children: "Click Me!",
    variant: "primary",
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      button.addEventListener("click", () => {
        alert("Button clicked!");
      });
    }
  },
};
