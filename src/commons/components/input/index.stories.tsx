import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./index";

// ============================================
// Meta Configuration
// ============================================

const meta: Meta<typeof Input> = {
  title: "Commons/Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 variant, size, theme를 지원하는 재사용 가능한 Input 컴포넌트입니다. 라벨, 에러 메시지, 헬프 텍스트, 아이콘 등을 지원합니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      description: "입력 필드의 시각적 스타일 variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "입력 필드의 크기",
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
    label: {
      control: { type: "text" },
      description: "라벨 텍스트",
    },
    placeholder: {
      control: { type: "text" },
      description: "플레이스홀더 텍스트",
      table: {
        defaultValue: { summary: "회고를 남겨보세요." },
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
    helpText: {
      control: { type: "text" },
      description: "헬프 텍스트",
    },
    required: {
      control: { type: "boolean" },
      description: "필수 입력 여부",
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
  },
  tags: ["autodocs"],
};

export default meta;

// ============================================
// Story Types
// ============================================

type Story = StoryObj<typeof Input>;

// ============================================
// Default Story
// ============================================

export const Default: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    label: "입력 필드",
    placeholder: "회고를 남겨보세요.",
    error: false,
    required: false,
    disabled: false,
    fullWidth: false,
  },
};

// ============================================
// Variant Stories
// ============================================

export const Primary: Story = {
  args: {
    label: "Primary Input",
    variant: "primary",
    theme: "light",
    placeholder: "Primary 스타일 입력 필드",
  },
};

export const Secondary: Story = {
  args: {
    label: "Secondary Input",
    variant: "secondary",
    theme: "light",
    placeholder: "Secondary 스타일 입력 필드",
  },
};

export const Tertiary: Story = {
  args: {
    label: "Tertiary Input",
    variant: "tertiary",
    theme: "light",
    placeholder: "Tertiary 스타일 입력 필드",
  },
};

// ============================================
// Size Stories
// ============================================

export const Small: Story = {
  args: {
    label: "Small Input",
    size: "small",
    variant: "primary",
    placeholder: "작은 크기 입력 필드",
  },
};

export const Medium: Story = {
  args: {
    label: "Medium Input",
    size: "medium",
    variant: "primary",
    placeholder: "중간 크기 입력 필드",
  },
};

export const Large: Story = {
  args: {
    label: "Large Input",
    size: "large",
    variant: "primary",
    placeholder: "큰 크기 입력 필드",
  },
};

// ============================================
// Theme Stories
// ============================================

export const LightTheme: Story = {
  args: {
    label: "Light Theme Input",
    theme: "light",
    variant: "primary",
    placeholder: "라이트 테마 입력 필드",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkTheme: Story = {
  args: {
    label: "Dark Theme Input",
    theme: "dark",
    variant: "primary",
    placeholder: "다크 테마 입력 필드",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// ============================================
// State Stories
// ============================================

export const WithLabel: Story = {
  args: {
    label: "라벨이 있는 입력 필드",
    variant: "primary",
    placeholder: "라벨과 함께 표시되는 입력 필드",
  },
};

export const Required: Story = {
  args: {
    label: "필수 입력 필드",
    required: true,
    variant: "primary",
    placeholder: "반드시 입력해야 하는 필드",
  },
};

export const WithHelpText: Story = {
  args: {
    label: "도움말이 있는 입력 필드",
    helpText: "이 필드는 선택사항입니다.",
    variant: "primary",
    placeholder: "도움말 텍스트가 표시되는 입력 필드",
  },
};

export const Error: Story = {
  args: {
    label: "에러 상태 입력 필드",
    error: true,
    errorMessage: "올바른 값을 입력해주세요.",
    variant: "primary",
    placeholder: "에러 상태의 입력 필드",
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성화된 입력 필드",
    disabled: true,
    variant: "primary",
    placeholder: "비활성화된 입력 필드",
  },
};

// ============================================
// Icon Stories
// ============================================

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.827 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
  </svg>
);

export const WithLeftIcon: Story = {
  args: {
    label: "왼쪽 아이콘이 있는 입력 필드",
    leftIcon: <SearchIcon />,
    variant: "primary",
    placeholder: "검색어를 입력하세요",
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "오른쪽 아이콘이 있는 입력 필드",
    rightIcon: <EyeIcon />,
    variant: "primary",
    placeholder: "비밀번호를 입력하세요",
  },
};

export const WithBothIcons: Story = {
  args: {
    label: "양쪽 아이콘이 있는 입력 필드",
    leftIcon: <UserIcon />,
    rightIcon: <EyeIcon />,
    variant: "primary",
    placeholder: "사용자명을 입력하세요",
  },
};

// ============================================
// Layout Stories
// ============================================

export const FullWidth: Story = {
  args: {
    label: "전체 너비 입력 필드",
    fullWidth: true,
    variant: "primary",
    placeholder: "전체 너비를 사용하는 입력 필드",
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
      <Input
        label="Primary Light"
        variant="primary"
        theme="light"
        placeholder="Primary Light 스타일"
      />
      <Input
        label="Secondary Light"
        variant="secondary"
        theme="light"
        placeholder="Secondary Light 스타일"
      />
      <Input
        label="Tertiary Light"
        variant="tertiary"
        theme="light"
        placeholder="Tertiary Light 스타일"
      />
      <Input
        label="Primary Dark"
        variant="primary"
        theme="dark"
        placeholder="Primary Dark 스타일"
      />
      <Input
        label="Secondary Dark"
        variant="secondary"
        theme="dark"
        placeholder="Secondary Dark 스타일"
      />
      <Input
        label="Tertiary Dark"
        variant="tertiary"
        theme="dark"
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
      <Input
        label="Small Size"
        size="small"
        variant="primary"
        placeholder="작은 크기 입력 필드"
      />
      <Input
        label="Medium Size"
        size="medium"
        variant="primary"
        placeholder="중간 크기 입력 필드"
      />
      <Input
        label="Large Size"
        size="large"
        variant="primary"
        placeholder="큰 크기 입력 필드"
      />
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
      <Input
        label="Normal State"
        variant="primary"
        placeholder="정상 상태 입력 필드"
      />
      <Input
        label="Required Field"
        required
        variant="primary"
        placeholder="필수 입력 필드"
      />
      <Input
        label="With Help Text"
        helpText="이 필드는 선택사항입니다."
        variant="primary"
        placeholder="도움말이 있는 입력 필드"
      />
      <Input
        label="Error State"
        error
        errorMessage="올바른 값을 입력해주세요."
        variant="primary"
        placeholder="에러 상태 입력 필드"
      />
      <Input
        label="Disabled State"
        disabled
        variant="primary"
        placeholder="비활성화된 입력 필드"
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const WithIcons: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
      }}
    >
      <Input
        label="Search Input"
        leftIcon={<SearchIcon />}
        variant="primary"
        placeholder="검색어를 입력하세요"
      />
      <Input
        label="Password Input"
        rightIcon={<EyeIcon />}
        variant="primary"
        placeholder="비밀번호를 입력하세요"
      />
      <Input
        label="User Input"
        leftIcon={<UserIcon />}
        rightIcon={<EyeIcon />}
        variant="primary"
        placeholder="사용자명을 입력하세요"
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
    label: "Interactive Input",
    variant: "primary",
    placeholder: "입력해보세요!",
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector("input");
    if (input) {
      input.addEventListener("focus", () => {
        console.log("Input focused!");
      });
      input.addEventListener("blur", () => {
        console.log("Input blurred!");
      });
      input.addEventListener("change", (e) => {
        console.log("Input changed:", (e.target as HTMLInputElement).value);
      });
    }
  },
};

// ============================================
// Form Example Story
// ============================================

export const FormExample: Story = {
  render: () => (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "400px",
      }}
    >
      <Input
        label="이름"
        required
        variant="primary"
        placeholder="이름을 입력하세요"
        helpText="실명을 입력해주세요"
      />
      <Input
        label="이메일"
        required
        variant="primary"
        placeholder="이메일을 입력하세요"
        type="email"
      />
      <Input
        label="비밀번호"
        required
        variant="primary"
        placeholder="비밀번호를 입력하세요"
        type="password"
        rightIcon={<EyeIcon />}
      />
      <Input
        label="전화번호"
        variant="secondary"
        placeholder="전화번호를 입력하세요"
        type="tel"
        helpText="선택사항입니다"
      />
      <Input
        label="주소"
        variant="tertiary"
        placeholder="주소를 입력하세요"
        fullWidth
      />
    </form>
  ),
  parameters: {
    layout: "padded",
  },
};
