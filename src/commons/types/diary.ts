import { EmotionType } from "@/commons/constants/enum";

// ============================================
// Diary Types
// ============================================

/**
 * 일기 데이터 타입 (로컬스토리지와 일치)
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

// ============================================
// Export
// ============================================

export default DiaryData;
