/**
 * Typography Constants
 * 프로젝트 전체에서 사용되는 타이포그래피 토큰 정의
 * 한글/영문 폰트 분리 및 모바일/데스크톱 반응형을 지원합니다.
 */

// ============================================
// Font Family (폰트 패밀리)
// ============================================

export const FontFamily = {
  // 한글 폰트
  korean: {
    primary:
      "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    secondary: "'Noto Sans KR', sans-serif",
    mono: "'D2Coding', 'Courier New', monospace",
  },
  // 영문 폰트
  english: {
    primary:
      "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    secondary: "'Roboto', sans-serif",
    mono: "'Fira Code', 'Monaco', 'Courier New', monospace",
  },
  // 기본 폰트 (한글 우선)
  default:
    "'Pretendard Variable', 'Pretendard', 'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
} as const;

// ============================================
// Font Weight (폰트 두께)
// ============================================

export const FontWeight = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
} as const;

// ============================================
// Font Size Primitives (기본 폰트 크기)
// ============================================

export const FontSizePrimitives = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px
  "8xl": "6rem", // 96px
  "9xl": "8rem", // 128px
} as const;

// ============================================
// Line Height Primitives (기본 행간)
// ============================================

export const LineHeightPrimitives = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
} as const;

// ============================================
// Letter Spacing Primitives (기본 자간)
// ============================================

export const LetterSpacingPrimitives = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

// ============================================
// Typography Scale (타이포그래피 스케일)
// ============================================

interface TypographyStyle {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
}

interface ResponsiveTypographyStyle {
  mobile: TypographyStyle;
  desktop: TypographyStyle;
}

// Display (대형 제목)
export const DisplayScale = {
  display1: {
    mobile: {
      fontSize: FontSizePrimitives["4xl"],
      lineHeight: LineHeightPrimitives.tight,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
    desktop: {
      fontSize: FontSizePrimitives["6xl"],
      lineHeight: LineHeightPrimitives.tight,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
  },
  display2: {
    mobile: {
      fontSize: FontSizePrimitives["3xl"],
      lineHeight: LineHeightPrimitives.tight,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
    desktop: {
      fontSize: FontSizePrimitives["5xl"],
      lineHeight: LineHeightPrimitives.tight,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
  },
  display3: {
    mobile: {
      fontSize: FontSizePrimitives["2xl"],
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
    desktop: {
      fontSize: FontSizePrimitives["4xl"],
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
  },
} as const;

// Heading (제목)
export const HeadingScale = {
  h1: {
    mobile: {
      fontSize: FontSizePrimitives["2xl"],
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
    desktop: {
      fontSize: FontSizePrimitives["3xl"],
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
  },
  h2: {
    mobile: {
      fontSize: FontSizePrimitives.xl,
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
    desktop: {
      fontSize: FontSizePrimitives["2xl"],
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.bold,
      letterSpacing: LetterSpacingPrimitives.tight,
    },
  },
  h3: {
    mobile: {
      fontSize: FontSizePrimitives.lg,
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.semiBold,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.xl,
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.semiBold,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
  h4: {
    mobile: {
      fontSize: FontSizePrimitives.base,
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.semiBold,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.lg,
      lineHeight: LineHeightPrimitives.snug,
      fontWeight: FontWeight.semiBold,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
  h5: {
    mobile: {
      fontSize: FontSizePrimitives.sm,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.semiBold,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.base,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.semiBold,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
  h6: {
    mobile: {
      fontSize: FontSizePrimitives.xs,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.semiBold,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.sm,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.semiBold,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
} as const;

// Body (본문)
export const BodyScale = {
  large: {
    mobile: {
      fontSize: FontSizePrimitives.base,
      lineHeight: LineHeightPrimitives.relaxed,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.lg,
      lineHeight: LineHeightPrimitives.relaxed,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
  medium: {
    mobile: {
      fontSize: FontSizePrimitives.sm,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.base,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
  small: {
    mobile: {
      fontSize: FontSizePrimitives.xs,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.sm,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
} as const;

// Label (라벨)
export const LabelScale = {
  large: {
    mobile: {
      fontSize: FontSizePrimitives.base,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.medium,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.base,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.medium,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
  medium: {
    mobile: {
      fontSize: FontSizePrimitives.sm,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.medium,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.sm,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.medium,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
  small: {
    mobile: {
      fontSize: FontSizePrimitives.xs,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.medium,
      letterSpacing: LetterSpacingPrimitives.wide,
    },
    desktop: {
      fontSize: FontSizePrimitives.xs,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.medium,
      letterSpacing: LetterSpacingPrimitives.wide,
    },
  },
} as const;

// Caption (캡션)
export const CaptionScale = {
  large: {
    mobile: {
      fontSize: FontSizePrimitives.sm,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.sm,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
  medium: {
    mobile: {
      fontSize: FontSizePrimitives.xs,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
    desktop: {
      fontSize: FontSizePrimitives.xs,
      lineHeight: LineHeightPrimitives.normal,
      fontWeight: FontWeight.regular,
      letterSpacing: LetterSpacingPrimitives.normal,
    },
  },
} as const;

// ============================================
// Type Definitions
// ============================================

export type FontFamilyType = typeof FontFamily;
export type FontWeightType = typeof FontWeight;
export type FontSizeType = typeof FontSizePrimitives;
export type LineHeightType = typeof LineHeightPrimitives;
export type LetterSpacingType = typeof LetterSpacingPrimitives;
export type DisplayScaleType = typeof DisplayScale;
export type HeadingScaleType = typeof HeadingScale;
export type BodyScaleType = typeof BodyScale;
export type LabelScaleType = typeof LabelScale;
export type CaptionScaleType = typeof CaptionScale;
export type DeviceMode = "mobile" | "desktop";

// ============================================
// Utility Functions
// ============================================

/**
 * 디바이스 모드에 따라 적절한 타이포그래피 스타일을 반환합니다.
 * @param scale - 타이포그래피 스케일 (예: DisplayScale.display1)
 * @param mode - 'mobile' 또는 'desktop'
 * @returns 타이포그래피 스타일 객체
 */
export const getTypographyStyle = (
  scale: ResponsiveTypographyStyle,
  mode: DeviceMode
): TypographyStyle => {
  return scale[mode];
};

/**
 * CSS 변수 이름을 생성합니다.
 * @param category - 타이포그래피 카테고리 (예: 'heading', 'body')
 * @param name - 타이포그래피 이름 (예: 'h1', 'large')
 * @param property - CSS 속성 (예: 'fontSize', 'lineHeight')
 * @returns CSS 변수 이름 (예: '--heading-h1-font-size')
 */
export const getCssVariableName = (
  category: string,
  name: string,
  property: string
): string => {
  return `--${category}-${name}-${property}`;
};

/**
 * CSS 변수를 사용하는 문자열을 반환합니다.
 * @param category - 타이포그래피 카테고리
 * @param name - 타이포그래피 이름
 * @param property - CSS 속성
 * @returns CSS var() 함수 문자열
 */
export const useCssVariable = (
  category: string,
  name: string,
  property: string
): string => {
  return `var(${getCssVariableName(category, name, property)})`;
};

/**
 * 타이포그래피 스타일을 CSS 속성 객체로 변환합니다.
 * @param style - 타이포그래피 스타일
 * @param fontFamily - 폰트 패밀리 (선택)
 * @returns CSS 속성 객체
 */
export const getTypographyCss = (
  style: TypographyStyle,
  fontFamily?: string
): React.CSSProperties => {
  return {
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
    ...(fontFamily && { fontFamily }),
  };
};

/**
 * 언어에 따라 적절한 폰트 패밀리를 반환합니다.
 * @param lang - 'ko' (한글) 또는 'en' (영문)
 * @returns 폰트 패밀리 문자열
 */
export const getFontFamily = (lang: "ko" | "en" = "ko"): string => {
  return lang === "ko" ? FontFamily.korean.primary : FontFamily.english.primary;
};

// ============================================
// Export All
// ============================================

export const Typography = {
  fontFamily: FontFamily,
  fontWeight: FontWeight,
  fontSize: FontSizePrimitives,
  lineHeight: LineHeightPrimitives,
  letterSpacing: LetterSpacingPrimitives,
  display: DisplayScale,
  heading: HeadingScale,
  body: BodyScale,
  label: LabelScale,
  caption: CaptionScale,
  getStyle: getTypographyStyle,
  getCss: getTypographyCss,
  cssVar: getCssVariableName,
  useCssVar: useCssVariable,
  getFontFamily: getFontFamily,
} as const;

export default Typography;
