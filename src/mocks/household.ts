import type {
  HouseholdLinkPreview,
  HouseholdLinkResponse,
} from "@/types/household";

// 명세 §5.3 POST /households/link/preview — 연동 가능한 가구 미리보기
export const mockLinkPreview: HouseholdLinkPreview = {
  linkable: true,
  household: {
    name: "복현동 장원석 가구",
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
