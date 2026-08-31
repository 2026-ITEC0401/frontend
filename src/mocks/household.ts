import type {
  HouseholdLinkPreview,
  HouseholdLinkResponse,
  AddressSearchItem,
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
export const mockAddressResults: AddressSearchItem[] = [
  {
    postal_code: "05029",
    road_address: "서울특별시 광진구 능동로 120",
    building_name: "건국대학교",
    detail_supported: false,
    provider_reference: {
      adm_cd: "1121510700",
      road_name_code: "112153104007",
      underground: "0",
      building_main_no: 120,
      building_sub_no: 0,
      apartment: false,
    },
  },
  {
    postal_code: "05030",
    road_address: "서울특별시 광진구 능동로 120-1",
    building_name: "건국대학교병원",
    detail_supported: false,
    provider_reference: {
      adm_cd: "1121510700",
      road_name_code: "112153104007",
      underground: "0",
      building_main_no: 120,
      building_sub_no: 1,
      apartment: false,
    },
  },
  {
    postal_code: "04987",
    road_address: "서울특별시 광진구 능동로34길 120",
    building_name: null,
    detail_supported: false,
    provider_reference: {
      adm_cd: "1121510200",
      road_name_code: "112154112144",
      underground: "0",
      building_main_no: 120,
      building_sub_no: 0,
      apartment: false,
    },
  },
];
