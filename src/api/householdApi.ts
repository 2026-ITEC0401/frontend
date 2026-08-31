import { request } from "@/lib/api";
import type {
  CurrentHouseholdResponse,
  EmergencyAddress,
  InviteCodeResponse,
  MembersResponse,
  HouseholdLinkPreview,
  HouseholdLinkResponse,
  AddressSearchResponse,
  AddressSearchItem,
} from "@/types/household";

export async function getEmergencyAddress(household_id: string) {
  return request<EmergencyAddress>(
    `/households/${household_id}/emergency-address`,
  );
}

// 명세 §5.1 현재 가구 조회
export async function getCurrentHousehold() {
  return request<CurrentHouseholdResponse>("/households/current");
}

export async function getMembers(household_id: string) {
  return request<MembersResponse>(`/households/${household_id}/members`);
}

export async function setDisplayName(
  household_id: string,
  member_user_id: string,
  display_name: string,
) {
  return request<void>(
    `/households/${household_id}/members/${member_user_id}/display-name`,
    { method: "PATCH", body: { display_name } },
  );
}

export async function resetDisplayName(
  household_id: string,
  member_user_id: string,
) {
  return request<void>(
    `/households/${household_id}/members/${member_user_id}/display-name`,
    { method: "DELETE" },
  );
}

export async function getInviteCode(household_id: string) {
  return request<InviteCodeResponse>(`/households/${household_id}/invite-code`);
}

export async function rotateInviteCode(household_id: string) {
  return request<InviteCodeResponse>(
    `/households/${household_id}/invite-code/rotate`,
    { method: "POST" },
  );
}

// 명세 §5.3 초대 코드로 가구 미리보기
export async function linkPreview(invite_code: string) {
  return request<HouseholdLinkPreview>("/households/link/preview", {
    method: "POST",
    body: { invite_code },
  });
}

export async function link(invite_code: string) {
  return request<HouseholdLinkResponse>("/households/link", {
    method: "POST",
    body: { invite_code },
  });
}

// 명세 §5.9 도로명주소 검색 (owner 전용)
export async function searchRoadAddress(household_id: string, keyword: string) {
  return request<AddressSearchResponse>(
    `/households/${household_id}/address-search/roads`,
    {
      method: "POST",
      body: { keyword, page: 1, page_size: 10 },
    },
  );
}

// 명세 §5.8 긴급 주소 등록·수정 (owner 전용)
export async function updateEmergencyAddress(
  household_id: string,
  data: {
    postal_code: string;
    road_address: string;
    detail_address: string;
    address_provider: "juso_go_kr";
    provider_reference: AddressSearchItem["provider_reference"];
    detail_source: "manual";
  },
) {
  return request(`/households/${household_id}/emergency-address`, {
    method: "PATCH",
    body: data,
  });
}
