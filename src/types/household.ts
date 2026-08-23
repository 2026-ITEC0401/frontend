// 명세 §5 역할. owner = 청각장애인 당사자, member = 가족·보호자
export type HouseholdRole = "owner" | "member";

// 명세 §5.8 긴급 신고 주소 (가구 단위 저장)
export interface EmergencyAddress {
  postal_code: string;
  road_address: string;
  detail_address: string;
}

// 명세 §5.5 가족 구성원
export interface HouseholdMember {
  user_id: string;
  display_name: string;
  phone_number: string;
  role: HouseholdRole;
}
