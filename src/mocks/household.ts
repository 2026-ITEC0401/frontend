import { type EmergencyAddress, type HouseholdMember } from "@/types/household";
import { type AuthUser } from "@/types/auth";

// 명세 §4.4 GET /me — 개인정보 조회(읽기 전용) 표시용 mock
export const mockMyProfile: AuthUser = {
  user_id: "user-owner",
  login_id: "hearo_user01",
  name: "장원석",
  phone_number: "+821012345678",
  account_type: "household_owner",
  household_id: "home-a1b2c3",
  role: "owner",
  household_link_status: "linked",
  created_at: "2026-08-17T03:00:00Z",
};

// 현재 로그인한 사용자. "user-member-1"로 바꾸면 보호자 화면을 확인할 수 있다.
export const MOCK_MY_USER_ID = "user-owner";

// 명세 §5.2 초대 코드 (owner 전용, 6자리 영문 대문자·숫자)
export const mockInviteCode = "A7K2M9";

export const mockEmergencyAddress: EmergencyAddress = {
  postal_code: "41566",
  road_address: "대구광역시 북구 대학로 80",
  detail_address: "101동 902호",
};

export const mockMembers: HouseholdMember[] = [
  {
    user_id: "user-owner",
    display_name: "장원석",
    phone_number: "+821012345678",
    role: "owner",
  },
  {
    user_id: "user-member-1",
    display_name: "김가족",
    phone_number: "+821098765432",
    role: "member",
  },
  {
    user_id: "user-member-2",
    display_name: "이보호",
    phone_number: "+821055551234",
    role: "member",
  },
];
