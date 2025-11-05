# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e3]:
    - banner [ref=e4]:
      - link "민지의 다이어리" [ref=e5] [cursor=pointer]:
        - /url: /diaries
        - generic [ref=e6]: 민지의 다이어리
      - button "로그인" [ref=e7] [cursor=pointer]:
        - generic [ref=e8]: 로그인
    - generic [ref=e10]:
      - img "배너 이미지"
    - navigation [ref=e12]:
      - generic [ref=e13]:
        - link "일기보관함" [ref=e14] [cursor=pointer]:
          - /url: /diaries
          - generic [ref=e15]: 일기보관함
        - link "사진보관함" [ref=e16] [cursor=pointer]:
          - /url: /pictures
          - generic [ref=e17]: 사진보관함
    - main [ref=e18]:
      - main [ref=e19]:
        - button "기본" [ref=e26] [cursor=pointer]:
          - generic [ref=e27]: 기본
  - contentinfo [ref=e45]:
    - generic [ref=e46]:
      - heading "민지의 다이어리" [level=3] [ref=e47]
      - paragraph [ref=e48]: "대표 : {name}"
      - paragraph [ref=e49]: "Copyright © 2024. {name} Co., Ltd."
```