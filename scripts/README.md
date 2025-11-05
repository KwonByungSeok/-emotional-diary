# 일기 Mock 데이터 생성 스크립트

페이지네이션 테스트를 위한 일기 mock 데이터를 생성하는 스크립트입니다.

## 사용 방법

### 방법 1: HTML 파일 사용 (권장)

1. `scripts/load-mock-diaries.html` 파일을 브라우저에서 엽니다.
2. 생성할 일기 개수를 입력합니다 (기본값: 25개).
3. "일기 데이터 생성" 버튼을 클릭합니다.
4. 애플리케이션을 새로고침하면 생성된 데이터를 확인할 수 있습니다.

### 방법 2: 브라우저 콘솔에서 직접 실행

1. 개발 서버를 실행합니다 (`npm run dev`).
2. 브라우저 개발자 도구를 엽니다 (F12 또는 Cmd+Option+I).
3. Console 탭에서 아래 코드를 붙여넣고 실행합니다:

```javascript
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
  "오늘의 하루", "특별한 하루", "기억에 남는 날", "새로운 경험", "좋은 하루",
  "힘든 하루", "즐거운 하루", "평범한 하루", "감동적인 하루", "배움의 하루",
  "여행의 하루", "친구들과의 하루", "가족과의 하루", "혼자만의 하루", "도전의 하루",
  "성취의 하루", "휴식의 하루", "활동적인 하루", "조용한 하루", "바쁜 하루",
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

function getRandomEmotion() {
  const emotions = Object.values(EmotionType);
  return emotions[Math.floor(Math.random() * emotions.length)];
}

function generateDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function generateDiary(id, daysAgo) {
  const titleIndex = Math.floor(Math.random() * titleTemplates.length);
  const contentIndex = Math.floor(Math.random() * contentTemplates.length);
  const title = `${titleTemplates[titleIndex]} ${id}`;
  const content = `${contentTemplates[contentIndex]} 오늘은 ${daysAgo}일 전이었고, 이 순간을 기록하고 싶었어요.`;
  return {
    id: id,
    title: title,
    content: content,
    emotion: getRandomEmotion(),
    createdAt: generateDate(daysAgo),
  };
}

function generateMockDiaries(count = 25) {
  const diaries = [];
  for (let i = 1; i <= count; i++) {
    const daysAgo = count - i;
    diaries.push(generateDiary(i, daysAgo));
  }
  localStorage.setItem('diaries', JSON.stringify(diaries));
  console.log(`✅ ${count}개의 일기 데이터가 로컬스토리지에 저장되었습니다.`);
  return diaries;
}

// 25개의 일기 데이터 생성 (페이지당 12개이므로 약 3페이지)
generateMockDiaries(25);
```

## 데이터 포맷

생성되는 일기 데이터는 다음과 같은 구조를 가집니다:

```typescript
interface DiaryData {
  id: number;              // 일기 고유 ID
  title: string;          // 일기 제목
  content: string;        // 일기 내용
  emotion: EmotionType;   // 감정 타입 (HAPPY, SAD, ANGRY, SURPRISE, ETC)
  createdAt: string;      // 생성 날짜 (ISO 형식)
}
```

## 로컬스토리지 초기화

로컬스토리지의 일기 데이터를 삭제하려면:

```javascript
localStorage.removeItem('diaries');
```

또는 HTML 파일에서 "로컬스토리지 초기화" 버튼을 클릭합니다.

## 참고사항

- 페이지네이션은 페이지당 12개씩 표시됩니다.
- 25개의 데이터를 생성하면 약 3페이지 분량입니다.
- 생성된 데이터는 브라우저의 로컬스토리지에 저장되므로, 브라우저를 닫아도 유지됩니다.
- 다른 브라우저나 시크릿 모드에서는 별도로 생성해야 합니다.

