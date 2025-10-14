/**
 * Enum Constants
 * 프로젝트 전체에서 사용되는 열거형 데이터 정의
 */

import { ColorPrimitives } from "./color";

// ============================================
// Access Level Enum
// ============================================

/**
 * 페이지 접근 권한 타입 정의
 */
export enum AccessLevel {
  PUBLIC = "PUBLIC",
  MEMBER_ONLY = "MEMBER_ONLY",
}

/**
 * 접근 권한 라벨 맵
 */
export const AccessLevelLabelMap: Record<AccessLevel, string> = {
  [AccessLevel.PUBLIC]: "누구나",
  [AccessLevel.MEMBER_ONLY]: "회원전용",
} as const;

/**
 * 접근 권한으로 라벨 조회
 */
export const getAccessLevelLabel = (level: AccessLevel): string => {
  return AccessLevelLabelMap[level];
};

// ============================================
// Emotion Enum
// ============================================

/**
 * 감정 타입 정의
 */
export enum EmotionType {
  HAPPY = "HAPPY",
  SAD = "SAD",
  ANGRY = "ANGRY",
  SURPRISE = "SURPRISE",
  ETC = "ETC",
}

/**
 * 감정 데이터 인터페이스
 */
export interface EmotionData {
  type: EmotionType;
  label: string;
  images: {
    medium: string;
    small: string;
  };
  color: string;
}

/**
 * 감정 데이터 맵
 */
export const EmotionMap: Record<EmotionType, EmotionData> = {
  [EmotionType.HAPPY]: {
    type: EmotionType.HAPPY,
    label: "행복해요",
    images: {
      medium: "/images/emotion-happy-m.png",
      small: "/images/emotion-happy-s.png",
    },
    color: ColorPrimitives.error[600], // red60
  },
  [EmotionType.SAD]: {
    type: EmotionType.SAD,
    label: "슬퍼요",
    images: {
      medium: "/images/emotion-sad-m.png",
      small: "/images/emotion-sad-s.png",
    },
    color: ColorPrimitives.info[600], // blue60
  },
  [EmotionType.ANGRY]: {
    type: EmotionType.ANGRY,
    label: "화나요",
    images: {
      medium: "/images/emotion-angry-m.png",
      small: "/images/emotion-angry-s.png",
    },
    color: ColorPrimitives.gray[600], // gray60
  },
  [EmotionType.SURPRISE]: {
    type: EmotionType.SURPRISE,
    label: "놀랐어요",
    images: {
      medium: "/images/emotion-surprise-m.png",
      small: "/images/emotion-surprise-s.png",
    },
    color: ColorPrimitives.warning[600], // yellow60
  },
  [EmotionType.ETC]: {
    type: EmotionType.ETC,
    label: "기타",
    images: {
      medium: "/images/emotion-etc-m.png",
      small: "/images/emotion-etc-s.png",
    },
    color: ColorPrimitives.success[600], // green60
  },
} as const;

/**
 * 모든 감정 데이터를 배열로 반환
 */
export const getAllEmotions = (): EmotionData[] => {
  return Object.values(EmotionMap);
};

/**
 * 감정 타입으로 감정 데이터 조회
 */
export const getEmotionData = (type: EmotionType): EmotionData => {
  return EmotionMap[type];
};

/**
 * 감정 타입으로 라벨 조회
 */
export const getEmotionLabel = (type: EmotionType): string => {
  return EmotionMap[type].label;
};

/**
 * 감정 타입으로 색상 조회
 */
export const getEmotionColor = (type: EmotionType): string => {
  return EmotionMap[type].color;
};

/**
 * 감정 타입으로 이미지 경로 조회
 */
export const getEmotionImage = (
  type: EmotionType,
  size: "medium" | "small" = "medium"
): string => {
  return EmotionMap[type].images[size];
};

// ============================================
// Searchbar Enum
// ============================================

/**
 * 검색바 variant 타입 정의
 */
export enum SearchbarVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",
}

/**
 * 검색바 크기 타입 정의
 */
export enum SearchbarSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

/**
 * 검색바 테마 타입 정의
 */
export enum SearchbarTheme {
  LIGHT = "light",
  DARK = "dark",
}

/**
 * 검색바 variant 라벨 맵
 */
export const SearchbarVariantLabelMap: Record<SearchbarVariant, string> = {
  [SearchbarVariant.PRIMARY]: "기본",
  [SearchbarVariant.SECONDARY]: "보조",
  [SearchbarVariant.TERTIARY]: "3차",
} as const;

/**
 * 검색바 크기 라벨 맵
 */
export const SearchbarSizeLabelMap: Record<SearchbarSize, string> = {
  [SearchbarSize.SMALL]: "작음",
  [SearchbarSize.MEDIUM]: "보통",
  [SearchbarSize.LARGE]: "큼",
} as const;

/**
 * 검색바 테마 라벨 맵
 */
export const SearchbarThemeLabelMap: Record<SearchbarTheme, string> = {
  [SearchbarTheme.LIGHT]: "밝음",
  [SearchbarTheme.DARK]: "어둠",
} as const;

/**
 * 검색바 variant로 라벨 조회
 */
export const getSearchbarVariantLabel = (variant: SearchbarVariant): string => {
  return SearchbarVariantLabelMap[variant];
};

/**
 * 검색바 크기로 라벨 조회
 */
export const getSearchbarSizeLabel = (size: SearchbarSize): string => {
  return SearchbarSizeLabelMap[size];
};

/**
 * 검색바 테마로 라벨 조회
 */
export const getSearchbarThemeLabel = (theme: SearchbarTheme): string => {
  return SearchbarThemeLabelMap[theme];
};

// ============================================
// Export All
// ============================================

export const Access = {
  Level: AccessLevel,
  LabelMap: AccessLevelLabelMap,
  getLabel: getAccessLevelLabel,
} as const;

export const Emotion = {
  Type: EmotionType,
  Map: EmotionMap,
  getAll: getAllEmotions,
  getData: getEmotionData,
  getLabel: getEmotionLabel,
  getColor: getEmotionColor,
  getImage: getEmotionImage,
} as const;

export const Searchbar = {
  Variant: SearchbarVariant,
  Size: SearchbarSize,
  Theme: SearchbarTheme,
  VariantLabelMap: SearchbarVariantLabelMap,
  SizeLabelMap: SearchbarSizeLabelMap,
  ThemeLabelMap: SearchbarThemeLabelMap,
  getVariantLabel: getSearchbarVariantLabel,
  getSizeLabel: getSearchbarSizeLabel,
  getThemeLabel: getSearchbarThemeLabel,
} as const;

export default Emotion;
