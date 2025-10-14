import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Toggle } from "./index";

// ============================================
// Meta Configuration
// ============================================

const meta: Meta<typeof Toggle> = {
  title: "Commons/Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 variant, size, theme를 지원하는 재사용 가능한 Toggle 컴포넌트입니다. 토글 버튼만으로 완전히 동작하며 라벨 없이 사용됩니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      description: "토글의 시각적 스타일 variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "토글의 크기",
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
    checked: {
      control: { type: "boolean" },
      description: "토글 상태 (제어 컴포넌트)",
    },
    defaultChecked: {
      control: { type: "boolean" },
      description: "기본 토글 상태 (비제어 컴포넌트)",
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
    error: {
      control: { type: "boolean" },
      description: "에러 상태",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    errorMessage: {
      control: { type: "text" },
      description: "에러 메시지",
    },
    fullWidth: {
      control: { type: "boolean" },
      description: "전체 너비 사용 여부",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Stories
// ============================================

/**
 * 기본 토글 컴포넌트입니다. 라벨 없이 토글 버튼만으로 동작합니다.
 */
export const Default: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    defaultChecked: false,
    disabled: false,
    error: false,
    fullWidth: false,
  },
};

/**
 * Primary variant 토글입니다.
 */
export const Primary: Story = {
  args: {
    ...Default.args,
    variant: "primary",
    defaultChecked: true,
  },
};

/**
 * Secondary variant 토글입니다.
 */
export const Secondary: Story = {
  args: {
    ...Default.args,
    variant: "secondary",
    defaultChecked: true,
  },
};

/**
 * Tertiary variant 토글입니다.
 */
export const Tertiary: Story = {
  args: {
    ...Default.args,
    variant: "tertiary",
    defaultChecked: true,
  },
};

/**
 * Small 크기 토글입니다.
 */
export const Small: Story = {
  args: {
    ...Default.args,
    size: "small",
  },
};

/**
 * Medium 크기 토글입니다.
 */
export const Medium: Story = {
  args: {
    ...Default.args,
    size: "medium",
  },
};

/**
 * Large 크기 토글입니다.
 */
export const Large: Story = {
  args: {
    ...Default.args,
    size: "large",
  },
};

/**
 * Light 테마 토글입니다.
 */
export const LightTheme: Story = {
  args: {
    ...Default.args,
    theme: "light",
    defaultChecked: true,
  },
};

/**
 * Dark 테마 토글입니다.
 */
export const DarkTheme: Story = {
  args: {
    ...Default.args,
    theme: "dark",
    defaultChecked: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * 체크된 상태의 토글입니다.
 */
export const Checked: Story = {
  args: {
    ...Default.args,
    defaultChecked: true,
  },
};

/**
 * 비활성화된 토글입니다.
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    defaultChecked: true,
  },
};

/**
 * 에러 상태의 토글입니다.
 */
export const WithError: Story = {
  args: {
    ...Default.args,
    error: true,
    errorMessage: "이 옵션을 활성화해야 합니다.",
  },
};

/**
 * 전체 너비를 사용하는 토글입니다.
 */
export const FullWidth: Story = {
  args: {
    ...Default.args,
    fullWidth: true,
  },
};

/**
 * 제어 컴포넌트로 사용하는 토글입니다.
 */
export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Toggle
          {...args}
          checked={checked}
          onChange={(newChecked) => setChecked(newChecked)}
        />
        <p>현재 상태: {checked ? "켜짐" : "꺼짐"}</p>
      </div>
    );
  },
  args: {
    ...Default.args,
  },
};

/**
 * 다양한 크기와 variant를 보여주는 토글 그리드입니다.
 */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        alignItems: "center",
      }}
    >
      {/* Primary */}
      <Toggle variant="primary" size="small" defaultChecked />
      <Toggle variant="primary" size="medium" defaultChecked />
      <Toggle variant="primary" size="large" defaultChecked />

      {/* Secondary */}
      <Toggle variant="secondary" size="small" defaultChecked />
      <Toggle variant="secondary" size="medium" defaultChecked />
      <Toggle variant="secondary" size="large" defaultChecked />

      {/* Tertiary */}
      <Toggle variant="tertiary" size="small" defaultChecked />
      <Toggle variant="tertiary" size="medium" defaultChecked />
      <Toggle variant="tertiary" size="large" defaultChecked />
    </div>
  ),
};
