import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import {
  getInviteCode,
  getMembers,
  resetDisplayName,
  rotateInviteCode,
  setDisplayName,
} from "@/api/householdApi";
import { ApiError } from "@/lib/api";
import { getHouseholdId } from "@/lib/auth";
import {
  type HouseholdMember,
  type InviteCodeResponse,
} from "@/types/household";
import { formatPhoneNumber } from "@/utils/phone";

// expires_at(UTC ISO) → "8월 25일 14:03까지 유효" (Asia/Seoul 표시)
function formatExpiry(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${parts}까지 유효해요.`;
}

export default function FamilySettingsPage() {
  const householdId = getHouseholdId();
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [loading, setLoading] = useState(!!householdId);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<HouseholdMember | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const isOwner = members.some((m) => m.is_me && m.role === "owner");

  // display_name은 호출자 기준 별칭 (사용자마다 다르게 보일 수 있음)
  useEffect(() => {
    if (!householdId) return;
    let alive = true;
    getMembers(householdId)
      .then((res) => alive && setMembers(res.members))
      .catch(
        (e) =>
          alive &&
          setError(
            e instanceof ApiError
              ? e.message
              : "구성원 정보를 불러오지 못했어요.",
          ),
      )
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [householdId]);

  // 표시 이름 변경/초기화 후 재조회 (이벤트 핸들러 전용)
  const reloadMembers = useCallback(async () => {
    if (!householdId) return;
    const res = await getMembers(householdId);
    setMembers(res.members);
  }, [householdId]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="가족 설정" />

      <div className="flex flex-1 flex-col px-5 py-4">
        {!householdId ? (
          <p className="m-0 py-10 text-center text-body-02 text-gray-300">
            가구 연동이 필요합니다.
          </p>
        ) : loading ? (
          <p className="m-0 py-10 text-center text-body-02 text-gray-300">
            불러오는 중…
          </p>
        ) : error ? (
          <p className="m-0 py-10 text-center text-body-02 text-red-200">
            {error}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((member) => (
              <MemberCard
                key={member.user_id}
                member={member}
                onEdit={() => setEditing(member)}
              />
            ))}
          </div>
        )}

        {isOwner && (
          <button
            type="button"
            onClick={() => setShowInvite(true)}
            className="mt-auto h-14 cursor-pointer rounded-lg bg-gray-600 text-subtitle-02 text-white shadow-02"
          >
            초대 코드 공유
          </button>
        )}
      </div>

      {editing && householdId && (
        <EditNameModal
          member={editing}
          householdId={householdId}
          onDone={async () => {
            await reloadMembers();
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {showInvite && householdId && (
        <InviteCodeModal
          householdId={householdId}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}

interface MemberCardProps {
  member: HouseholdMember;
  onEdit: () => void;
}

function MemberCard({ member, onEdit }: MemberCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-02">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-subtitle-03 text-gray-600">
            {member.display_name}
          </span>
          {member.is_me && (
            <span className="shrink-0 rounded-full bg-main-100 px-2 py-0.5 text-label-06 text-yellow-300">
              나
            </span>
          )}
        </div>
        <span className="text-body-02 text-gray-300">
          {formatPhoneNumber(member.phone_number)}
        </span>
      </div>

      {/* 본인 카드는 편집 불가 (§9). 서버가 is_me도 can_edit=true를 주지만
          본인 별칭은 UX상 의미가 없어 프론트에서 차단한다. */}
      {!member.is_me && member.can_edit_display_name && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 cursor-pointer bg-transparent text-label-03 text-yellow-200"
        >
          이름 편집
        </button>
      )}
    </div>
  );
}

interface EditNameModalProps {
  member: HouseholdMember;
  householdId: string;
  onDone: () => void;
  onClose: () => void;
}

function EditNameModal({
  member,
  householdId,
  onDone,
  onClose,
}: EditNameModalProps) {
  const [value, setValue] = useState(member.display_name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trimmed = value.trim();

  const handleSave = async () => {
    setBusy(true);
    setError(null);
    try {
      await setDisplayName(householdId, member.user_id, trimmed);
      onDone();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "저장하지 못했어요.");
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    setError(null);
    try {
      await resetDisplayName(householdId, member.user_id);
      onDone();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "초기화하지 못했어요.");
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-8"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-80 flex-col gap-4 rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="m-0 text-subtitle-02 text-gray-600">이름 편집</p>
        <p className="m-0 text-body-03 text-gray-300">
          이 이름은 내 화면에서만 보여요.
        </p>

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={60}
          autoFocus
          className="w-full rounded-xl border border-border bg-white px-4 py-3 text-body-01 text-gray-600 outline-none focus:border-main-200"
        />

        {member.display_name_is_custom && (
          <button
            type="button"
            disabled={busy}
            onClick={handleReset}
            className="self-start cursor-pointer bg-transparent text-body-03 text-gray-300 underline disabled:opacity-40"
          >
            가입 시 이름으로 초기화
          </button>
        )}

        {error && <p className="m-0 text-body-03 text-red-200">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 cursor-pointer rounded-lg border border-gray-200 bg-white text-label-03 text-black"
          >
            취소
          </button>
          <button
            type="button"
            disabled={trimmed.length === 0 || busy}
            onClick={handleSave}
            className="h-12 flex-1 cursor-pointer rounded-lg bg-gray-500 text-label-03 text-white disabled:opacity-40"
          >
            {busy ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface InviteCodeModalProps {
  householdId: string;
  onClose: () => void;
}

function InviteCodeModal({ householdId, onClose }: InviteCodeModalProps) {
  const [invite, setInvite] = useState<InviteCodeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    getInviteCode(householdId)
      .then((res) => alive && setInvite(res))
      .catch(
        (e) =>
          alive &&
          setError(
            e instanceof ApiError ? e.message : "코드를 불러오지 못했어요.",
          ),
      )
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [householdId]);

  const copyCode = async () => {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근이 막힌 환경에서는 무시
    }
  };

  // POST .../invite-code/rotate — 되돌릴 수 없음. 기존 코드 즉시 폐기.
  const rotate = async () => {
    setRotating(true);
    setNotice(null);
    setError(null);
    try {
      const res = await rotateInviteCode(householdId);
      setInvite(res);
      setCopied(false);
      setNotice("새 코드를 발급했어요. 기존 코드는 더 이상 쓸 수 없어요.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "재발급하지 못했어요.");
    } finally {
      setRotating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-8"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-80 flex-col gap-4 rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="m-0 text-subtitle-02 text-gray-600">초대 코드</p>
        <p className="m-0 text-body-03 text-gray-300">
          가족에게 이 코드를 공유하세요.
          {invite && ` ${formatExpiry(invite.expires_at)}`}
        </p>

        <div className="rounded-xl bg-gray-100 py-5 text-center text-head-02 tracking-[0.3em] text-gray-600">
          {loading ? "…" : (invite?.invite_code ?? "------")}
        </div>

        {error && (
          <p className="m-0 text-center text-body-03 text-red-200">{error}</p>
        )}
        {notice && (
          <p className="m-0 text-center text-body-03 text-gray-400">{notice}</p>
        )}

        <button
          type="button"
          onClick={rotate}
          disabled={rotating || loading}
          className="self-center cursor-pointer bg-transparent text-body-03 text-gray-300 underline disabled:opacity-40"
        >
          {rotating ? "재발급 중…" : "코드 재발급"}
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 cursor-pointer rounded-lg border border-gray-200 bg-white text-label-03 text-black"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={copyCode}
            disabled={!invite}
            className="h-12 flex-1 cursor-pointer rounded-lg bg-gray-500 text-label-03 text-white disabled:opacity-40"
          >
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>
    </div>
  );
}
