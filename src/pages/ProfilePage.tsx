import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getMe } from "@/api/meApi";
import { ApiError } from "@/lib/api";
import { type AuthUser } from "@/types/auth";
import { formatPhoneNumber } from "@/utils/phone";

const ACCOUNT_TYPE_LABEL: Record<AuthUser["account_type"], string> = {
  household_owner: "가구 소유자",
  family_member: "가족·보호자",
};

function formatJoinedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

// 명세 §4.4 GET /me — 조회 전용. 이름·전화번호 수정 API는 명세에 없어 수정 기능 없음.
export default function ProfilePage() {
  const [me, setMe] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getMe()
      .then((res) => {
        if (alive) setMe(res);
      })
      .catch((e) => {
        if (alive)
          setError(
            e instanceof ApiError ? e.message : "정보를 불러오지 못했어요.",
          );
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="개인정보 조회" />

      <div className="px-5 py-4">
        {loading ? (
          <p className="m-0 py-10 text-center text-body-02 text-gray-300">
            불러오는 중…
          </p>
        ) : error ? (
          <p className="m-0 py-10 text-center text-body-02 text-red-200">
            {error}
          </p>
        ) : me ? (
          <dl className="m-0 flex flex-col rounded-2xl bg-white px-5 py-1 shadow-02">
            <InfoRow label="로그인 아이디" value={me.login_id} />
            <InfoRow label="이름" value={me.name} />
            <InfoRow
              label="휴대폰 번호"
              value={formatPhoneNumber(me.phone_number)}
            />
            <InfoRow
              label="계정 유형"
              value={ACCOUNT_TYPE_LABEL[me.account_type]}
              last={!me.created_at}
            />
            {me.created_at && (
              <InfoRow
                label="가입일"
                value={formatJoinedDate(me.created_at)}
                last
              />
            )}
          </dl>
        ) : null}
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  last?: boolean;
}

function InfoRow({ label, value, last }: InfoRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-4 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <dt className="m-0 text-body-01 text-gray-300">{label}</dt>
      <dd className="m-0 text-body-01 text-gray-600">{value}</dd>
    </div>
  );
}
