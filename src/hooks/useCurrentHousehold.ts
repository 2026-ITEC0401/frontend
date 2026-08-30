import { useEffect, useState } from "react";
import { getCurrentHousehold } from "@/api/householdApi";
import { ApiError } from "@/lib/api";
import type {
  CurrentHouseholdResponse,
  HouseholdRole,
} from "@/types/household";

interface CurrentHouseholdState {
  data: CurrentHouseholdResponse | null;
  role: HouseholdRole | null;
  isOwner: boolean;
  loading: boolean;
  error: string | null;
}

// 명세 §5.1 GET /households/current 공유 훅.
// owner/member 분기(§10.2)와 가구 표시 정보를 여러 화면에서 재사용한다.
export function useCurrentHousehold(): CurrentHouseholdState {
  const [data, setData] = useState<CurrentHouseholdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getCurrentHousehold()
      .then((res) => {
        if (alive) setData(res);
      })
      .catch((e) => {
        if (!alive) return;
        setError(
          e instanceof ApiError ? e.message : "가구 정보를 불러오지 못했어요.",
        );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const role = data?.membership?.role ?? null;
  return { data, role, isOwner: role === "owner", loading, error };
}
