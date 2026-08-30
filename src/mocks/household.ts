import type {
  HouseholdLinkPreview,
  HouseholdLinkResponse,
  AddressSearchResult,
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

// 도로명 검색 결과 목업
export const mockAddressResults: AddressSearchResult[] = [
  {
    postal_code: "05029",
    road_address: "서울특별시 광진구 능동로 120",
    jibun_address: "서울특별시 광진구 화양동 1",
  },
  {
    postal_code: "05026",
    road_address: "서울특별시 광진구 능동로 110",
    jibun_address: "서울특별시 광진구 화양동 27-1",
  },
  {
    postal_code: "05028",
    road_address: "서울특별시 광진구 능동로 116",
    jibun_address: "서울특별시 광진구 화양동 4-5",
  },
  {
    postal_code: "05030",
    road_address: "서울특별시 광진구 능동로 124",
    jibun_address: "서울특별시 광진구 화양동 12",
  },
  {
    postal_code: "05031",
    road_address: "서울특별시 광진구 능동로 131",
    jibun_address: "서울특별시 광진구 화양동 18-3",
  },
];
