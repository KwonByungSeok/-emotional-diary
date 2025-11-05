/**
 * 일기 Mock 데이터 생성 스크립트
 * 페이지네이션 테스트를 위해 여러 개의 일기 데이터를 생성하고 로컬스토리지에 저장합니다.
 * 
 * 사용법:
 * 1. 브라우저 개발자 도구 콘솔에서 실행
 * 2. 또는 Node.js 환경에서 실행 (브라우저 localStorage API가 필요하므로 권장하지 않음)
 */

// 감정 타입 정의
const EmotionType = {
  HAPPY: "HAPPY",
  SAD: "SAD",
  ANGRY: "ANGRY",
  SURPRISE: "SURPRISE",
  ETC: "ETC",
};

// 일기 제목 템플릿
const titleTemplates = [
  "오늘의 하루",
  "특별한 하루",
  "기억에 남는 날",
  "새로운 경험",
  "좋은 하루",
  "힘든 하루",
  "즐거운 하루",
  "평범한 하루",
  "감동적인 하루",
  "배움의 하루",
  "여행의 하루",
  "친구들과의 하루",
  "가족과의 하루",
  "혼자만의 하루",
  "도전의 하루",
  "성취의 하루",
  "휴식의 하루",
  "활동적인 하루",
  "조용한 하루",
  "바쁜 하루",
];

// 일기 내용 템플릿
const contentTemplates = [
  "오늘은 정말 특별한 하루였어요. 많은 일들이 있었지만, 그 중에서도 가장 기억에 남는 순간은...",
  "하루 종일 다양한 경험을 했습니다. 아침에는 일찍 일어나서 산책을 다녔고, 오후에는 친구들을 만났어요.",
  "오늘 하루는 평소와는 다른 느낌이었습니다. 새로운 것을 배우고 경험하는 시간이었어요.",
  "오늘은 정말 많은 일이 있었습니다. 좋은 일도 있고, 힘든 일도 있었지만 모두 의미 있는 시간이었어요.",
  "하루 종일 집에서 쉬었습니다. 책을 읽고, 음악을 들으며 여유롭게 시간을 보냈어요.",
  "오늘은 친구들과 함께 시간을 보냈습니다. 맛있는 음식을 먹고, 이야기를 나누며 즐거운 하루를 보냈어요.",
  "새로운 곳을 탐험하는 하루였습니다. 예상치 못한 발견들이 많아서 재미있었어요.",
  "오늘은 조금 힘든 하루였지만, 그럼에도 불구하고 의미 있는 시간이었습니다.",
  "하루 종일 바쁘게 보냈지만, 모든 일을 마무리하고 나니 뿌듯한 느낌이 들었어요.",
  "오늘은 정말 감동적인 하루였습니다. 예상치 못한 선물을 받아서 기뻤어요.",
];

/**
 * 감정 타입을 랜덤하게 선택
 */
function getRandomEmotion() {
  const emotions = Object.values(EmotionType);
  return emotions[Math.floor(Math.random() * emotions.length)];
}

/**
 * 날짜를 생성 (과거 날짜들)
 */
function generateDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

/**
 * 일기 데이터 생성
 */
function generateDiary(id, daysAgo) {
  const titleIndex = Math.floor(Math.random() * titleTemplates.length);
  const contentIndex = Math.floor(Math.random() * contentTemplates.length);
  
  // 제목에 번호 추가로 구분
  const title = `${titleTemplates[titleIndex]} ${id}`;
  
  // 내용에 약간의 변화 주기
  const content = `${contentTemplates[contentIndex]} 오늘은 ${daysAgo}일 전이었고, 이 순간을 기록하고 싶었어요.`;
  
  return {
    id: id,
    title: title,
    content: content,
    emotion: getRandomEmotion(),
    createdAt: generateDate(daysAgo),
  };
}

/**
 * Mock 데이터 생성 및 로컬스토리지에 저장
 */
function generateMockDiaries(count = 25) {
  const diaries = [];
  
  // 25개의 일기 데이터 생성 (페이지네이션 테스트용: 12개씩 3페이지)
  for (let i = 1; i <= count; i++) {
    const daysAgo = count - i; // 가장 오래된 일기가 0번 인덱스
    diaries.push(generateDiary(i, daysAgo));
  }
  
  // 로컬스토리지에 저장
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('diaries', JSON.stringify(diaries));
    console.log(`✅ ${count}개의 일기 데이터가 로컬스토리지에 저장되었습니다.`);
    console.log('저장된 데이터:', diaries);
    return diaries;
  } else {
    console.error('❌ localStorage를 사용할 수 없습니다. 브라우저 환경에서 실행해주세요.');
    return null;
  }
}

// 브라우저 환경에서 실행
if (typeof window !== 'undefined') {
  // 기본적으로 25개 생성 (페이지당 12개이므로 3페이지)
  generateMockDiaries(25);
  
  // 전역 함수로도 등록
  window.generateMockDiaries = generateMockDiaries;
  console.log('💡 사용법: generateMockDiaries(25) - 원하는 개수를 지정할 수 있습니다.');
} else {
  // Node.js 환경에서는 실행하지 않음
  console.log('이 스크립트는 브라우저 환경에서 실행해야 합니다.');
  console.log('브라우저 개발자 도구 콘솔에서 다음 코드를 실행하세요:');
  console.log('');
  console.log('generateMockDiaries(25)');
}

