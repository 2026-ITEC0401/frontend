import type {
  EmergencyAddress,
  HouseholdMember,
  HouseholdLinkPreview,
  HouseholdLinkResponse,
} from "@/types/household";

// 긴급 신고 주소 (§5.8) — 해당 화면 API 미연동(범위 외)이라 표시용 mock 유지.
export const mockEmergencyAddress: EmergencyAddress = {
  postal_code: "41566",
  road_address: "대구광역시 북구 대학로 80",
  detail_address: "101동 902호",
};

// 아래 mock은 긴급 신고 UI(EmergencyActions, 범위 외)에서만 사용한다.
// 설정 화면(구성원·프로필·초대 코드)은 실 API로 연동되어 관련 mock은 제거함.
export const MOCK_MY_USER_ID = "user-owner";

export const mockMembers: HouseholdMember[] = [
  {
    user_id: "user-owner",
    profile_name: "장원석",
    display_name: "장원석",
    display_name_is_custom: false,
    phone_number: "+821012345678",
    role: "owner",
    linked_at: "2026-08-17T03:00:00Z",
    is_me: true,
    can_edit_display_name: false,
  },
  {
    user_id: "user-member-1",
    profile_name: "김가족",
    display_name: "김가족",
    display_name_is_custom: false,
    phone_number: "+821098765432",
    role: "member",
    linked_at: "2026-08-17T04:00:00Z",
    is_me: false,
    can_edit_display_name: true,
  },
  {
    user_id: "user-member-2",
    profile_name: "이보호",
    display_name: "이보호",
    display_name_is_custom: false,
    phone_number: "+821055551234",
    role: "member",
    linked_at: "2026-08-17T04:00:00Z",
    is_me: false,
    can_edit_display_name: true,
  },
];

// 명세 §5.3 POST /households/link/preview — 연동 가능한 가구 미리보기
export const mockLinkPreview: HouseholdLinkPreview = {
  linkable: true,
  household: {
    name: "장원석 가구",
    member_count: 3,
    created_at: "2026-08-17T03:00:00Z",
  },
};

// 명세 §5.4 POST /households/link — 연동 성공 응답
export const mockLinkResponse: HouseholdLinkResponse = {
  household_link_status: "linked",
  household_id: "home-a1b2c3",
  role: "member",
  linked_at: "2026-08-17T04:00:00Z",
};
