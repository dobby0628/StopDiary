# 멈춤일기 (PWA)

식사 기록(시간/사진/배부름/감정/물 섭취/식사 소요시간) + 달력(자동 3단계 색상) +
일·주·월간 리포트 + 코치 한마디 + 진짜 배고픔 체크 설문 + AI 피드백 + 예약 알림(푸시)
을 모두 갖춘 설치형 웹앱입니다.

* 기록 데이터는 전부 **이 브라우저(IndexedDB)** 안에만 저장됩니다.
* AI 피드백과 푸시 알림만 **Netlify Functions(서버)** 를 거치고, API 키는 서버 환경변수에만 있어서
브라우저에는 절대 노출되지 않습니다.

## 새로 추가된 기능

* **식사 소요시간**: 먹기 전/후 사진을 찍은 시각을 자동 기록해서 "먹는 데 약 N분" 표시
* **달력 3단계 색상**: 후회·과식·스트레스성 식사 비율을 기준으로 좋음(초록)/그럭저럭(주황)/나쁨(빨강) 자동 표시 (규칙 기반, API 호출 없음)
* **코치 탭 - 진짜 배고픔 체크**: 5개 질문에 답하면 감정적 허기인지 진짜 배고픔인지 판별
* **연속 기록(스트릭)**: 오늘 탭에 "N일 연속 기록 중" 표시
* **물 섭취 체크**: 기록 시 "먹기 전 물을 마셨는지" 토글
* **월간 리포트 패턴 분석**: 끼니별/요일별 후회·과식 빈도, 메모에 자주 등장한 단어
* **AI 코치 피드백**: 설정 탭에서 OpenAI(GPT) / Anthropic(Claude) 중 선택, 리포트 탭에서 "AI 피드백 받기"
* **데이터 백업**: 설정 탭에서 JSON 내보내기/가져오기
* **예약 푸시 알림**: 아침 8시 / 점심 12시 / 오후 3시 / 저녁 6시반 / 밤 10시(KST)에 자동 알림

\---

## 배포 방법

이번엔 **Functions(서버 코드)** 가 포함돼 있어서 GitHub 저장소를 통한 배포를 권장합니다
(Drag\&Drop도 가능하지만 환경변수/Functions 설정이 더 쉬움).

### 1\) GitHub에 올리기

이 폴더(`stop-diary-pwa`) 전체를 새 GitHub 저장소에 업로드합니다.

### 2\) Netlify에서 사이트 생성

1. https://app.netlify.com → "Add new site" → "Import an existing project"
2. 방금 만든 GitHub 저장소 선택
3. Build settings는 비워둬도 됩니다 (정적 파일 + Functions라 빌드 명령 없이도 동작)

   * Publish directory: `.` (루트)
4. "Deploy site" 클릭

### 3\) 환경변수 등록 (Site configuration → Environment variables)

|변수명|설명|필수 여부|
|-|-|-|
|`OPENAI\_API\_KEY`|OpenAI(GPT) 피드백을 쓸 경우|AI 피드백에서 GPT 선택 시 필요|
|`ANTHROPIC\_API\_KEY`|Anthropic(Claude) 피드백을 쓸 경우|AI 피드백에서 Claude 선택 시 필요|
|`VAPID\_PUBLIC\_KEY`|푸시 알림용 공개키 (아래 값 사용)|알림 기능 사용 시 필요|
|`VAPID\_PRIVATE\_KEY`|푸시 알림용 비공개키 (아래 값 사용, **외부 공개 금지**)|알림 기능 사용 시 필요|

이 프로젝트용으로 미리 생성해둔 VAPID 키 쌍입니다. 그대로 사용하거나, 본인 것으로 새로 만들고
싶으면 `npx web-push generate-vapid-keys`로 새로 발급한 뒤 **공개키는 `app.js`의
`VAPID\_PUBLIC\_KEY` 상수도 같이 바꿔주세요** (서버 환경변수와 클라이언트 값이 한 쌍이어야 동작).

```
VAPID\_PUBLIC\_KEY  = BJe2A5Mchz8EMA\_Td8e1yjjkfKo1WWKeAHerxo-yx1JBsTSUoqTunF4rf6m8Vc1t9FrSnSAaoC7eGl0rxtMzRKg
VAPID\_PRIVATE\_KEY = \[삽입 필요]
```

환경변수 등록 후 "Deploys" 탭에서 한 번 재배포(Trigger deploy)해주세요.

### 4\) 휴대폰에서 설치 \& 알림 켜기

1. 배포된 주소로 휴대폰 브라우저 접속 → "홈 화면에 추가"로 설치
2. 앱 실행 → **설정 탭 → "알림 켜기"** 클릭 → 알림 권한 허용
3. 이후 매일 정해진 시간에 알림이 도착합니다 (앱이 꺼져있어도 동작)

> iOS는 16.4 이상에서, \*\*홈 화면에 설치한 PWA\*\*에서만 푸시 알림이 동작합니다.
> 브라우저 탭 상태로는 iOS에서 푸시가 오지 않으니 꼭 "홈 화면에 추가" 후 사용해주세요.

\---

## 로컬에서 미리 보기

Functions까지 포함해서 테스트하려면 Netlify CLI를 사용하세요.

```bash
npm install -g netlify-cli
cd stop-diary-pwa
npm install
netlify dev
```

단순히 화면만 보고 싶다면:

```bash
python3 -m http.server 8000
```

(이 경우 Functions/푸시/AI 피드백은 동작하지 않습니다.)

\---

## 파일 구성

* `index.html`, `styles.css`, `app.js` — 앱 본체
* `manifest.json`, `sw.js`, `icons/` — PWA/오프라인/푸시 설정
* `netlify.toml` — Functions 경로 및 스케줄 설정
* `package.json` — Functions에서 쓰는 라이브러리(`web-push`, `@netlify/blobs`)
* `netlify/functions/ai-feedback.js` — AI 피드백 (OpenAI/Anthropic 키는 서버에만 존재)
* `netlify/functions/subscribe.js` — 푸시 구독 정보 저장
* `netlify/functions/send-scheduled.js` — 10분마다 실행되어 정해진 시간에 알림 발송

## 알아두면 좋은 점

* 알림 발송은 10분 주기로 시간을 확인하는 방식이라, 최대 몇 분 정도 오차가 있을 수 있어요.
* AI 피드백은 호출할 때마다 API 사용량(비용)이 발생해요. 너무 자주 누르지 않아도 괜찮아요.
* 기기를 바꾸기 전엔 설정 탭에서 "내보내기"로 백업해두세요.

