# 백엔드 최종 기능 점검 체크리스트

프론트 연동 코드(`src/api/*`, `src/lib/ws.ts`, `src/lib/api.ts`)에서 실제 호출하는 엔드포인트 기준.
명세에는 있지만 프론트가 아직 연동하지 않은 API는 포함되어 있지 않다.

## 0. 우선 점검 (시간이 부족할 때)

- [ ] E2E 흐름: 회원가입 → 가구 연동 → 주소 등록 → 메인 3분기 → 실시간 알림 수신 → 읽음 처리
- [ ] 기기 `connection` / `settings` PATCH 응답 바디 스키마 확정 (명세에 미정의)

## 1. 인증

### 회원가입 — `POST /auth/signup` (SignupFormPage)

- [ ] 신규 가구 생성 케이스 가입 성공
- [ ] 가족 구성원(초대 코드) 케이스 가입 성공
- [ ] 가입 직후 access / refresh 토큰 발급
- [ ] 검증 실패 시 `field_errors` 형식 (중복 ID, 비밀번호 규칙 등)

### 로그인 — `POST /auth/login` (LoginPage)

- [ ] 정상 로그인 및 토큰 발급
- [ ] 잘못된 ID·비밀번호 시 에러 `code` / `message`

### 토큰 재발급 — `POST /auth/refresh` (전역, 401 시 자동)

- [ ] access 만료 → 재발급 → 원 요청 재시도 성공
- [ ] refresh 만료 시 재발급 실패 → `/login` 이동

### 로그아웃 — `POST /auth/logout` (SettingsPage)

- [ ] 204 응답
- [ ] 로그아웃 후 해당 refresh 토큰 무효화

## 2. 내 정보

### 내 정보 조회 — `GET /me` (SettingsPage, ProfilePage)

- [ ] 응답 필드가 화면 표시 항목과 일치

### 비밀번호 변경 — `PATCH /me/password` (PasswordSettingsPage)

- [ ] 정상 변경 후 새 비밀번호로 로그인
- [ ] 현재 비밀번호 불일치 에러
- [ ] 새 비밀번호 검증 실패 에러

## 3. 가구 / 온보딩

### 현재 가구 조회 — `GET /households/current` (MainPage)

- [ ] 미연동(`household_link_status: "unlinked"`) 분기
- [ ] 연동 + 주소 미등록 분기
- [ ] 정상(연동 + 주소 등록) 분기

### 초대 코드 미리보기 — `POST /households/link/preview` (InviteCodePage)

- [ ] 유효한 코드로 가구 미리보기
- [ ] 잘못된·만료된 코드 에러

### 가구 연동 — `POST /households/link` (HouseholdLinkPage)

- [ ] 정상 연동
- [ ] 이미 연동된 사용자가 재시도할 때 에러
- [ ] 재발급 이전의 구 코드로 시도할 때 에러

### 도로명주소 검색 — `POST /households/{id}/address-search/roads` (HouseholdAddressPage)

- [ ] owner 검색 성공
- [ ] 구성원 호출 시 403
- [ ] 검색 결과 없음 응답
- [ ] `page: 1, page_size: 10` 고정 호출로 문제없는지

### 긴급 주소 등록·수정 — `PATCH /households/{id}/emergency-address` (HouseholdAddressPage)

- [ ] owner 등록 성공
- [ ] owner 수정 성공
- [ ] 구성원 호출 시 403
- [ ] 검색 결과의 `provider_reference`를 그대로 전달해 저장되는지

### 긴급 주소 조회 — `GET /households/{id}/emergency-address` (EmergencyActions)

- [ ] 등록된 주소 조회
- [ ] 미등록 상태 응답 형태 확인 (404 인지 빈 값인지)

## 4. 가족 설정 (FamilySettingsPage)

### 구성원 목록 — `GET /households/{id}/members`

- [ ] 목록 조회 및 owner / 구성원 구분 필드

### 표시 이름 변경 — `PATCH /households/{id}/members/{user_id}/display-name`

- [ ] 정상 변경
- [ ] 빈 값·길이 초과 검증 에러

### 표시 이름 초기화 — `DELETE /households/{id}/members/{user_id}/display-name`

- [ ] 응답 코드 (204 여부)
- [ ] 초기화 후 기본 이름으로 복귀

### 초대 코드 조회 — `GET /households/{id}/invite-code`

- [ ] 조회 성공
- [ ] 권한 범위 확인 (owner 전용인지)

### 초대 코드 재발급 — `POST /households/{id}/invite-code/rotate`

- [ ] 새 코드 발급
- [ ] 구 코드 즉시 무효화

## 5. 기기

### 기기 목록 — `GET /households/{id}/devices` (MainPage, SettingsPage, DeviceListPage, DeviceSettingPage)

- [ ] 목록 조회
- [ ] `ui_status` 값 종류 확정 (`connected` 외)

### 연결 on/off·재연결 — `PATCH /households/{id}/devices/{device_id}/connection`

- [ ] `enabled: true / false` 반영
- [ ] 응답 바디 스키마 확정
- [ ] 변경 후 WS `device.status_changed` 수신

### LED 알림 설정 — `PATCH /households/{id}/devices/{device_id}/settings`

- [ ] `led_alert_enabled` 반영 및 재조회 시 유지
- [ ] 응답 바디 스키마 확정

## 6. 알림

### 최신 알림 — `GET /households/{id}/alarms/latest` (MainPage)

- [ ] 최신 알림 조회
- [ ] 알림 0건일 때 응답 형태

### 알림 내역 — `GET /households/{id}/alarms/history` (AlertsPage)

- [ ] 목록 조회 및 정렬 순서
- [ ] 페이지네이션 유무 (프론트는 파라미터 없이 호출)

### 알림 상세 — `GET /households/{id}/alarms/{alarm_id}` (AlertInfoPage)

- [ ] 상세 조회
- [ ] 없는 ID → 404 (프론트가 404로 분기)

### 안 읽은 개수 — `GET /households/{id}/alarms/unread-count` (MainPage)

- [ ] 개수 조회
- [ ] 읽음 처리 후 0으로 감소

### 읽음 처리 — `PATCH /households/{id}/alarms/seen` (AlertsPage)

- [ ] 요청 바디 없이 호출 성공
- [ ] `last_seen_at`이 서버 시각 기준으로 저장

## 7. 실시간 (WebSocket) — `/ws/households/{id}`

사용 화면: MainPage, DeviceListPage, DeviceSettingPage

- [ ] 연결 직후 `{type: "auth", access_token}` 전송 → `connection.ready` 수신
- [ ] `connection.ready`에 초기 `devices` 포함
- [ ] `alarm.created`: 실제 감지 시 메인 화면 반영
- [ ] `alarm.created` 수신과 unread-count 증가 일치
- [ ] `device.status_changed`: 기기 전원·연결 변경 시 `ui_status` 갱신
- [ ] 만료·잘못된 토큰일 때 close code / reason
- [ ] 서버 idle timeout, ping/pong 정책 확인 (프론트에 재연결 로직 없음)

## 8. 공통

- [ ] 에러 응답 형식 `{code, message, field_errors, request_id}`이 모든 엔드포인트에서 일관 (프론트가 `message`를 그대로 노출)
- [ ] 401이 토큰 만료에만 사용되는지 (프론트는 인증 요청의 401에 무조건 refresh 시도)
- [ ] 다른 가구의 `household_id`로 접근 시 403 / 404
- [ ] CORS 설정
- [ ] 배포 환경 `VITE_API_BASE_URL` / `VITE_WS_BASE_URL`(wss) 값

## 점검 중 발견 사항

| 항목 | 내용 | 담당 | 상태 |
| ---- | ---- | ---- | ---- |
|      |      |      |      |
