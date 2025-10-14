import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SelectBox, type SelectOption } from "./index";

// ============================================
// Sample Options
// ============================================

const basicOptions: SelectOption[] = [
  { value: "option1", label: "옵션 1" },
  { value: "option2", label: "옵션 2" },
  { value: "option3", label: "옵션 3" },
  { value: "option4", label: "옵션 4" },
  { value: "option5", label: "옵션 5" },
];

const longOptions: SelectOption[] = [
  { value: "seoul", label: "서울특별시" },
  { value: "busan", label: "부산광역시" },
  { value: "daegu", label: "대구광역시" },
  { value: "incheon", label: "인천광역시" },
  { value: "gwangju", label: "광주광역시" },
  { value: "daejeon", label: "대전광역시" },
  { value: "ulsan", label: "울산광역시" },
  { value: "sejong", label: "세종특별자치시" },
  { value: "gyeonggi", label: "경기도" },
  { value: "gangwon", label: "강원도" },
  { value: "chungbuk", label: "충청북도" },
  { value: "chungnam", label: "충청남도" },
  { value: "jeonbuk", label: "전라북도" },
  { value: "jeonnam", label: "전라남도" },
  { value: "gyeongbuk", label: "경상북도" },
  { value: "gyeongnam", label: "경상남도" },
  { value: "jeju", label: "제주특별자치도" },
];

const disabledOptions: SelectOption[] = [
  { value: "option1", label: "옵션 1" },
  { value: "option2", label: "옵션 2", disabled: true },
  { value: "option3", label: "옵션 3" },
  { value: "option4", label: "옵션 4", disabled: true },
  { value: "option5", label: "옵션 5" },
];

const emotionOptions: SelectOption[] = [
  { value: "all", label: "전체" },
  { value: "happy", label: "행복해요" },
  { value: "sad", label: "슬퍼요" },
  { value: "surprised", label: "놀랐어요" },
  { value: "angry", label: "화나요" },
  { value: "etc", label: "기타" },
];

// ============================================
// Meta Configuration
// ============================================

const meta: Meta<typeof SelectBox> = {
  title: "Commons/Components/SelectBox",
  component: SelectBox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 variant, size, theme를 지원하는 재사용 가능한 SelectBox 컴포넌트입니다. 키보드 네비게이션과 접근성을 지원합니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      description: "셀렉트박스의 시각적 스타일 variant",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "셀렉트박스의 크기",
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
    options: {
      control: { type: "object" },
      description: "선택 가능한 옵션들",
    },
    value: {
      control: { type: "text" },
      description: "현재 선택된 값",
    },
    placeholder: {
      control: { type: "text" },
      description: "플레이스홀더 텍스트",
      table: {
        defaultValue: { summary: "선택해주세요" },
      },
    },
    label: {
      control: { type: "text" },
      description: "라벨 텍스트",
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
      description: "필수 선택 여부",
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
    onChange: {
      action: "changed",
      description: "값 변경 콜백",
    },
    onOpenChange: {
      action: "openChanged",
      description: "드롭다운 열림/닫힘 상태 변경 콜백",
    },
  },
  tags: ["autodocs"],
};

export default meta;

// ============================================
// Story Types
// ============================================

type Story = StoryObj<typeof SelectBox>;

// ============================================
// Default Story
// ============================================

export const Default: Story = {
  args: {
    options: basicOptions,
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "선택해주세요",
    disabled: false,
    fullWidth: false,
    required: false,
    error: false,
  },
};

// ============================================
// Variant Stories
// ============================================

export const Primary: Story = {
  args: {
    options: basicOptions,
    variant: "primary",
    placeholder: "Primary SelectBox",
    label: "Primary 스타일",
  },
};

export const Secondary: Story = {
  args: {
    options: basicOptions,
    variant: "secondary",
    placeholder: "Secondary SelectBox",
    label: "Secondary 스타일",
  },
};

export const Tertiary: Story = {
  args: {
    options: basicOptions,
    variant: "tertiary",
    placeholder: "Tertiary SelectBox",
    label: "Tertiary 스타일",
  },
};

// ============================================
// Size Stories
// ============================================

export const Small: Story = {
  args: {
    options: basicOptions,
    size: "small",
    placeholder: "Small SelectBox",
    label: "Small 크기",
  },
};

export const Medium: Story = {
  args: {
    options: basicOptions,
    size: "medium",
    placeholder: "Medium SelectBox",
    label: "Medium 크기",
  },
};

export const Large: Story = {
  args: {
    options: basicOptions,
    size: "large",
    placeholder: "Large SelectBox",
    label: "Large 크기",
  },
};

// ============================================
// Theme Stories
// ============================================

export const LightTheme: Story = {
  args: {
    options: basicOptions,
    theme: "light",
    placeholder: "Light Theme",
    label: "Light 테마",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkTheme: Story = {
  args: {
    options: basicOptions,
    theme: "dark",
    placeholder: "Dark Theme",
    label: "Dark 테마",
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
    options: basicOptions,
    label: "라벨이 있는 SelectBox",
    placeholder: "라벨과 함께",
  },
};

export const Required: Story = {
  args: {
    options: basicOptions,
    label: "필수 선택 항목",
    required: true,
    placeholder: "필수로 선택해주세요",
  },
};

export const WithHelpText: Story = {
  args: {
    options: basicOptions,
    label: "도움말이 있는 SelectBox",
    helpText: "이 항목은 선택사항입니다.",
    placeholder: "도움말 참고",
  },
};

export const Error: Story = {
  args: {
    options: basicOptions,
    label: "에러 상태",
    error: true,
    errorMessage: "이 항목은 필수입니다.",
    placeholder: "에러 상태",
  },
};

export const Disabled: Story = {
  args: {
    options: basicOptions,
    label: "비활성화 상태",
    disabled: true,
    placeholder: "비활성화됨",
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: disabledOptions,
    label: "일부 옵션 비활성화",
    placeholder: "비활성화된 옵션 포함",
  },
};

// ============================================
// Layout Stories
// ============================================

export const FullWidth: Story = {
  args: {
    options: basicOptions,
    label: "전체 너비",
    fullWidth: true,
    placeholder: "전체 너비 사용",
  },
  parameters: {
    layout: "padded",
  },
};

// ============================================
// Value Stories
// ============================================

export const WithDefaultValue: Story = {
  args: {
    options: basicOptions,
    label: "기본값 설정",
    defaultValue: "option2",
    placeholder: "기본값이 설정됨",
  },
};

export const WithValue: Story = {
  args: {
    options: basicOptions,
    label: "제어된 값",
    value: "option3",
    placeholder: "제어된 값",
  },
};

// ============================================
// Long List Stories
// ============================================

export const LongList: Story = {
  args: {
    options: longOptions,
    label: "긴 목록",
    placeholder: "지역을 선택해주세요",
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
      <SelectBox
        options={basicOptions}
        variant="primary"
        label="Primary"
        placeholder="Primary 스타일"
      />
      <SelectBox
        options={basicOptions}
        variant="secondary"
        label="Secondary"
        placeholder="Secondary 스타일"
      />
      <SelectBox
        options={basicOptions}
        variant="tertiary"
        label="Tertiary"
        placeholder="Tertiary 스타일"
      />
    </div>
  ),
  parameters: {
    layout: "padded",
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
      <SelectBox
        options={basicOptions}
        size="small"
        label="Small"
        placeholder="Small 크기"
      />
      <SelectBox
        options={basicOptions}
        size="medium"
        label="Medium"
        placeholder="Medium 크기"
      />
      <SelectBox
        options={basicOptions}
        size="large"
        label="Large"
        placeholder="Large 크기"
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
      <SelectBox
        options={basicOptions}
        label="일반 상태"
        placeholder="일반 상태"
      />
      <SelectBox
        options={basicOptions}
        label="필수 항목"
        required
        placeholder="필수 항목"
      />
      <SelectBox
        options={basicOptions}
        label="도움말"
        helpText="이 항목은 선택사항입니다."
        placeholder="도움말"
      />
      <SelectBox
        options={basicOptions}
        label="에러 상태"
        error
        errorMessage="이 항목은 필수입니다."
        placeholder="에러 상태"
      />
      <SelectBox
        options={basicOptions}
        label="비활성화"
        disabled
        placeholder="비활성화"
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
    options: basicOptions,
    label: "인터랙티브 SelectBox",
    placeholder: "클릭해보세요!",
  },
  play: async ({ canvasElement }) => {
    const selectBox = canvasElement.querySelector('[role="button"]');
    if (selectBox) {
      selectBox.addEventListener("click", () => {
        console.log("SelectBox clicked!");
      });
    }
  },
};

// ============================================
// Figma Design Story
// ============================================

export const FigmaDesign: Story = {
  args: {
    options: emotionOptions,
    defaultValue: "all",
    variant: "primary",
    size: "medium",
    theme: "light",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "피그마 디자인과 일치하는 SelectBox 컴포넌트입니다. 120px 너비, 체크 아이콘, 초록색 선택 상태를 적용했습니다.",
      },
    },
  },
};

export const FigmaDesignSelected: Story = {
  args: {
    options: emotionOptions,
    defaultValue: "happy",
    variant: "primary",
    size: "medium",
    theme: "light",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "선택된 상태의 SelectBox입니다. '행복해요' 옵션이 선택되어 초록색 배경과 체크 아이콘이 표시됩니다.",
      },
    },
  },
};

// ============================================
// Form Integration Story
// ============================================

export const FormIntegration: Story = {
  render: () => (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "400px",
      }}
    >
      <SelectBox
        options={basicOptions}
        label="첫 번째 선택"
        required
        placeholder="첫 번째 항목을 선택하세요"
      />
      <SelectBox
        options={longOptions}
        label="지역 선택"
        placeholder="지역을 선택하세요"
        helpText="거주하시는 지역을 선택해주세요"
      />
      <SelectBox
        options={disabledOptions}
        label="제한된 선택"
        placeholder="일부 옵션은 비활성화됨"
      />
    </form>
  ),
  parameters: {
    layout: "padded",
  },
};
