import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Modal } from "./index";

// ============================================
// Meta Configuration
// ============================================

const meta: Meta<typeof Modal> = {
  title: "Commons/Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "다양한 variant, actions, theme를 지원하는 재사용 가능한 Modal 컴포넌트입니다. 사용자 확인, 경고, 정보 전달 등의 용도로 사용됩니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["info", "danger"],
      description: "모달의 시각적 스타일 variant",
      table: {
        defaultValue: { summary: "info" },
      },
    },
    actions: {
      control: { type: "select" },
      options: ["single", "dual"],
      description: "액션 버튼의 개수",
      table: {
        defaultValue: { summary: "single" },
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
    title: {
      control: { type: "text" },
      description: "모달 제목",
    },
    content: {
      control: { type: "text" },
      description: "모달 내용",
    },
    confirmText: {
      control: { type: "text" },
      description: "확인 버튼 텍스트",
      table: {
        defaultValue: { summary: "확인" },
      },
    },
    cancelText: {
      control: { type: "text" },
      description: "취소 버튼 텍스트",
      table: {
        defaultValue: { summary: "취소" },
      },
    },
    onConfirm: {
      action: "confirmed",
      description: "확인 버튼 클릭 핸들러",
    },
    onCancel: {
      action: "cancelled",
      description: "취소 버튼 클릭 핸들러 (dual actions일 때만 사용)",
    },
    className: {
      control: { type: "text" },
      description: "추가 CSS 클래스명",
    },
    "data-testid": {
      control: { type: "text" },
      description: "테스트 ID (테스트 자동화용)",
    },
  },
  tags: ["autodocs"],
};

export default meta;

// ============================================
// Story Types
// ============================================

type Story = StoryObj<typeof Modal>;

// ============================================
// Default Story
// ============================================

export const Default: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "기본 모달",
    content: "이것은 기본 모달입니다. 확인 버튼을 클릭하여 닫을 수 있습니다.",
    confirmText: "확인",
    cancelText: "취소",
    onConfirm: () => console.log("확인 버튼 클릭됨"),
    onCancel: () => console.log("취소 버튼 클릭됨"),
  },
};

// ============================================
// Variant Stories
// ============================================

export const Info: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "정보 모달",
    content: "이것은 정보를 전달하는 모달입니다. 일반적인 알림이나 안내사항에 사용됩니다.",
    confirmText: "확인",
    onConfirm: () => console.log("정보 모달 확인"),
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    actions: "dual",
    theme: "light",
    title: "위험 모달",
    content: "이것은 위험한 작업에 대한 경고 모달입니다. 신중하게 결정해주세요.",
    confirmText: "삭제",
    cancelText: "취소",
    onConfirm: () => console.log("위험 작업 확인"),
    onCancel: () => console.log("위험 작업 취소"),
  },
};

// ============================================
// Actions Stories
// ============================================

export const SingleAction: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "단일 액션 모달",
    content: "이 모달은 확인 버튼 하나만 가지고 있습니다. 간단한 알림에 적합합니다.",
    confirmText: "확인",
    onConfirm: () => console.log("단일 액션 확인"),
  },
};

export const DualAction: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "이중 액션 모달",
    content: "이 모달은 확인과 취소 버튼을 모두 가지고 있습니다. 사용자가 선택할 수 있습니다.",
    confirmText: "확인",
    cancelText: "취소",
    onConfirm: () => console.log("이중 액션 확인"),
    onCancel: () => console.log("이중 액션 취소"),
  },
};

// ============================================
// Theme Stories
// ============================================

export const LightTheme: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "라이트 테마 모달",
    content: "이것은 라이트 테마의 모달입니다. 밝은 배경에 적합합니다.",
    confirmText: "확인",
    onConfirm: () => console.log("라이트 테마 확인"),
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkTheme: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "dark",
    title: "다크 테마 모달",
    content: "이것은 다크 테마의 모달입니다. 어두운 배경에 적합합니다.",
    confirmText: "확인",
    onConfirm: () => console.log("다크 테마 확인"),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// ============================================
// Content Stories
// ============================================

export const LongContent: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "긴 내용 모달",
    content: "이것은 매우 긴 내용을 포함하는 모달입니다. 여러 줄의 텍스트가 포함될 수 있으며, 모달의 높이가 자동으로 조정됩니다. 사용자는 스크롤을 통해 전체 내용을 확인할 수 있습니다. 이런 긴 내용은 주로 약관, 정책, 상세한 안내사항 등을 표시할 때 사용됩니다.",
    confirmText: "확인",
    onConfirm: () => console.log("긴 내용 모달 확인"),
  },
};

export const ShortContent: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "짧은 내용",
    content: "짧은 메시지입니다.",
    confirmText: "확인",
    onConfirm: () => console.log("짧은 내용 모달 확인"),
  },
};

// ============================================
// Custom Button Text Stories
// ============================================

export const CustomButtonText: Story = {
  args: {
    variant: "danger",
    actions: "dual",
    theme: "light",
    title: "커스텀 버튼 텍스트",
    content: "버튼 텍스트를 사용자가 원하는 대로 변경할 수 있습니다.",
    confirmText: "예, 삭제합니다",
    cancelText: "아니오, 취소합니다",
    onConfirm: () => console.log("커스텀 확인"),
    onCancel: () => console.log("커스텀 취소"),
  },
};

export const SaveChanges: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "변경사항 저장",
    content: "변경사항을 저장하시겠습니까?",
    confirmText: "저장",
    cancelText: "저장하지 않음",
    onConfirm: () => console.log("변경사항 저장"),
    onCancel: () => console.log("저장 취소"),
  },
};

// ============================================
// Combination Stories
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <Modal
        variant="info"
        actions="single"
        theme="light"
        title="Info Single"
        content="정보 모달 (단일 액션)"
        confirmText="확인"
        onConfirm={() => console.log("Info Single")}
      />
      <Modal
        variant="info"
        actions="dual"
        theme="light"
        title="Info Dual"
        content="정보 모달 (이중 액션)"
        confirmText="확인"
        cancelText="취소"
        onConfirm={() => console.log("Info Dual Confirm")}
        onCancel={() => console.log("Info Dual Cancel")}
      />
      <Modal
        variant="danger"
        actions="single"
        theme="light"
        title="Danger Single"
        content="위험 모달 (단일 액션)"
        confirmText="확인"
        onConfirm={() => console.log("Danger Single")}
      />
      <Modal
        variant="danger"
        actions="dual"
        theme="light"
        title="Danger Dual"
        content="위험 모달 (이중 액션)"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => console.log("Danger Dual Confirm")}
        onCancel={() => console.log("Danger Dual Cancel")}
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <Modal
        variant="info"
        actions="single"
        theme="light"
        title="Light Theme"
        content="라이트 테마 모달"
        confirmText="확인"
        onConfirm={() => console.log("Light Theme")}
      />
      <Modal
        variant="info"
        actions="single"
        theme="dark"
        title="Dark Theme"
        content="다크 테마 모달"
        confirmText="확인"
        onConfirm={() => console.log("Dark Theme")}
      />
    </div>
  ),
  parameters: {
    layout: "padded",
    backgrounds: { default: "light" },
  },
};

export const AllActions: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <Modal
        variant="info"
        actions="single"
        theme="light"
        title="Single Action"
        content="단일 액션 모달"
        confirmText="확인"
        onConfirm={() => console.log("Single Action")}
      />
      <Modal
        variant="info"
        actions="dual"
        theme="light"
        title="Dual Action"
        content="이중 액션 모달"
        confirmText="확인"
        cancelText="취소"
        onConfirm={() => console.log("Dual Action Confirm")}
        onCancel={() => console.log("Dual Action Cancel")}
      />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

// ============================================
// Real-world Examples
// ============================================

export const DeleteConfirmation: Story = {
  args: {
    variant: "danger",
    actions: "dual",
    theme: "light",
    title: "정말 삭제하시겠습니까?",
    content: "이 작업은 되돌릴 수 없습니다. 선택한 항목이 영구적으로 삭제됩니다.",
    confirmText: "삭제",
    cancelText: "취소",
    onConfirm: () => console.log("항목 삭제됨"),
    onCancel: () => console.log("삭제 취소됨"),
  },
};

export const SuccessNotification: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "성공적으로 완료되었습니다",
    content: "요청하신 작업이 성공적으로 완료되었습니다.",
    confirmText: "확인",
    onConfirm: () => console.log("성공 알림 확인"),
  },
};

export const WarningMessage: Story = {
  args: {
    variant: "danger",
    actions: "single",
    theme: "light",
    title: "주의사항",
    content: "이 작업을 수행하기 전에 중요한 데이터를 백업해주세요.",
    confirmText: "계속 진행",
    onConfirm: () => console.log("경고 확인"),
  },
};

export const InformationDialog: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "새로운 기능 안내",
    content: "새로운 기능이 추가되었습니다. 자세한 내용을 확인하시겠습니까?",
    confirmText: "자세히 보기",
    cancelText: "나중에",
    onConfirm: () => console.log("자세히 보기"),
    onCancel: () => console.log("나중에 보기"),
  },
};

// ============================================
// Interactive Story
// ============================================

export const Interactive: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "인터랙티브 모달",
    content: "이 모달은 클릭 이벤트를 처리합니다. 버튼을 클릭해보세요!",
    confirmText: "확인",
    cancelText: "취소",
    onConfirm: () => alert("확인 버튼이 클릭되었습니다!"),
    onCancel: () => alert("취소 버튼이 클릭되었습니다!"),
  },
  play: async ({ canvasElement }) => {
    const confirmButton = canvasElement.querySelector('[data-testid*="confirm"]');
    const cancelButton = canvasElement.querySelector('[data-testid*="cancel"]');
    
    if (confirmButton) {
      confirmButton.addEventListener("click", () => {
        console.log("Interactive modal confirm clicked!");
      });
    }
    
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        console.log("Interactive modal cancel clicked!");
      });
    }
  },
};

// ============================================
// Accessibility Story
// ============================================

export const Accessibility: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "접근성 테스트 모달",
    content: "이 모달은 접근성 기능을 테스트하기 위한 모달입니다. 키보드 네비게이션과 스크린 리더 지원을 확인해보세요.",
    confirmText: "확인",
    cancelText: "취소",
    onConfirm: () => console.log("접근성 테스트 확인"),
    onCancel: () => console.log("접근성 테스트 취소"),
    "data-testid": "accessibility-modal",
  },
  parameters: {
    docs: {
      description: {
        story: "이 모달은 접근성 기능을 테스트하기 위한 것입니다. ARIA 속성과 키보드 네비게이션을 확인해보세요.",
      },
    },
  },
};
