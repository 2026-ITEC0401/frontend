import { type SignupResponse } from "@/types/signup";

// 명세 §4.1 POST /auth/signup 신규 가구 가입 응답
// 가구가 생성되며 household_id가 발급되고 role은 owner
export const mockSignupNewHousehold: SignupResponse = {
  user: {
    user_id: "user-a1b2",
    login_id: "hearo_user01",
    name: "홍길동",
    phone_number: "+821012345678",
    account_type: "household_owner",
    household_id: "home-a1b2c3",
    role: "owner",
    household_link_status: "linked",
    created_at: "2026-08-29T03:00:00Z",
  },
  tokens: {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    token_type: "bearer",
    expires_in: 900,
  },
};

// 명세 §4.1 가족·보호자 가입 응답
// 미연동 상태로 생성되며, 초대 코드 입력 후 연동된다
export const mockSignupFamilyMember: SignupResponse = {
  user: {
    user_id: "user-a1b3",
    login_id: "hearo_user02",
    name: "김가족",
    phone_number: "+821012345679",
    account_type: "family_member",
    household_id: null,
    role: null,
    household_link_status: "unlinked",
    created_at: "2026-08-29T03:00:00Z",
  },
  tokens: {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    token_type: "bearer",
    expires_in: 900,
  },
};
