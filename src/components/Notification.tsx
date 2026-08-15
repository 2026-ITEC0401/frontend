import bellImg from "@/assets/bell.svg";

interface NotificationProps {
  unreadCount: number;
}

export default function Notification({ unreadCount }: NotificationProps) {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex flex-col text-[28px] font-light text-white">
        <p className="m-0 leading-[1.4]">
          확인하지 않은
          <br />
          <span className="font-semibold">{unreadCount}개의 알람</span>이
          있어요!
        </p>
      </div>
      {/* 종 이미지가 카드를 뚫고 나가지 않도록 크기를 딱 잡아줍니다. */}
      <img
        src={bellImg}
        alt="알람 아이콘"
        className="h-auto w-[70px] object-contain"
      />
    </div>
  );
}
