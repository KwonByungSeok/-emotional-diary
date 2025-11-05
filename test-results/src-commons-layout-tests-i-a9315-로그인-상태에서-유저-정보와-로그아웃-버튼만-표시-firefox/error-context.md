# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - main [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - heading "로그인" [level=1] [ref=e8]
        - paragraph [ref=e9]: 계정에 로그인하여 서비스를 이용해보세요
      - generic [ref=e10]:
        - generic [ref=e12]:
          - generic [ref=e13]: 이메일*
          - textbox "이메일*" [ref=e15]:
            - /placeholder: 이메일을 입력해주세요
            - text: a@c.com
        - generic [ref=e17]:
          - generic [ref=e18]: 비밀번호*
          - textbox "비밀번호*" [ref=e20]:
            - /placeholder: 비밀번호를 입력해주세요
            - text: 1234qwer
        - button "로그인" [ref=e22] [cursor=pointer]:
          - generic [ref=e23]: 로그인
      - paragraph [ref=e25]:
        - text: 아직 계정이 없으신가요?
        - link "회원가입하기" [ref=e26] [cursor=pointer]:
          - /url: /auth/signup
  - dialog [ref=e27]:
    - dialog "로그인 성공" [ref=e29]:
      - generic [ref=e30]:
        - heading "로그인 성공" [level=2] [ref=e31]
        - paragraph [ref=e32]: 로그인이 완료되었습니다.
      - button "확인" [ref=e34] [cursor=pointer]:
        - generic [ref=e35]: 확인
```