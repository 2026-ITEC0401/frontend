import { useState } from "react";
import Header from "@/components/Header";
import {
  MOCK_MY_USER_ID,
  mockInviteCode,
  mockMembers,
} from "@/mocks/household";
import { type HouseholdMember } from "@/types/household";
import { formatPhoneNumber } from "@/utils/phone";

export default function FamilySettingsPage() {
  // GET /households/{id}/members 연동 지점 (지금은 mock)
  const [members, setMembers] = useState<HouseholdMember[]>(mockMembers);
  const [editing, setEditing] = useState<HouseholdMember | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const isOwner =
    members.find((m) => m.user_id === MOCK_MY_USER_ID)?.role === "owner";

  // PATCH .../display-name — 현재 사용자 화면에만 적용되는 별칭
  const saveName = (userId: string, name: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.user_id === userId ? { ...m, display_name: name } : m)),
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 pb-25">
      <Header title="가족 설정" />

      <div className="flex flex-1 flex-col px-5 py-4">
        <div className="flex flex-col gap-3">
          {members.map((member) => (
            <MemberCard
              key={member.user_id}
              member={member}
              isMe={member.user_id === MOCK_MY_USER_ID}
              onEdit={() => setEditing(member)}
            />
          ))}
        </div>

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

      {editing && (
        <EditNameModal
          member={editing}
          onSave={(name) => {
            saveName(editing.user_id, name);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {showInvite && (
        <InviteCodeModal
          code={mockInviteCode}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}

interface MemberCardProps {
  member: HouseholdMember;
  isMe: boolean;
  onEdit: () => void;
}

function MemberCard({ member, isMe, onEdit }: MemberCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-02">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-subtitle-03 text-gray-600">
            {member.display_name}
          </span>
          {isMe && (
            <span className="shrink-0 rounded-full bg-main-100 px-2 py-0.5 text-label-06 text-yellow-300">
              나
            </span>
          )}
        </div>
        <span className="text-body-02 text-gray-300">
          {formatPhoneNumber(member.phone_number)}
        </span>
      </div>

      {/* 본인 카드는 이름 편집 불가 (다른 구성원 별칭만 변경) */}
      {!isMe && (
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
  onSave: (name: string) => void;
  onClose: () => void;
}

function EditNameModal({ member, onSave, onClose }: EditNameModalProps) {
  const [value, setValue] = useState(member.display_name);
  const trimmed = value.trim();

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
            disabled={trimmed.length === 0}
            onClick={() => onSave(trimmed)}
            className="h-12 flex-1 cursor-pointer rounded-lg bg-gray-500 text-label-03 text-white disabled:opacity-40"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

interface InviteCodeModalProps {
  code: string;
  onClose: () => void;
}

// 명세 §5.2 초대 코드: 영문 대문자·숫자 6자리
function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function InviteCodeModal({ code, onClose }: InviteCodeModalProps) {
  // POST .../invite-code/rotate 연동 지점 (지금은 mock 재생성)
  const [current, setCurrent] = useState(code);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(current);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 접근이 막힌 환경에서는 무시
    }
  };

  const rotateCode = () => {
    setCurrent(generateInviteCode());
    setCopied(false);
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
          가족에게 이 코드를 공유하세요. 24시간 동안 유효해요.
        </p>

        <div className="rounded-xl bg-gray-100 py-5 text-center text-head-02 tracking-[0.3em] text-gray-600">
          {current}
        </div>

        <button
          type="button"
          onClick={rotateCode}
          className="self-center cursor-pointer bg-transparent text-body-03 text-gray-300 underline"
        >
          코드 재발급
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
            className="h-12 flex-1 cursor-pointer rounded-lg bg-gray-500 text-label-03 text-white"
          >
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>
    </div>
  );
}
