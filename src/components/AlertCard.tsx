import UrgentImg from "../assets/Urgent_icon.svg";
import GeneralImg from "../assets/General_icon.svg";
import { type CommonData } from "../types/alert";

interface AlertCardProps extends CommonData {
  time: string;
}

export default function AlertCard({
  time,
  location,
  sound,
  type,
}: AlertCardProps) {
  const isUrgent = type === "Urgent";

  return (
    <div
      className={`flex items-center gap-5 rounded-[30px] p-5 my-2 shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all duration-200 ease-in-out ${
        isUrgent ? "bg-[#C23030] text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-[15px] p-2 ${
          isUrgent ? "bg-[#941A1A]" : "bg-[#F1F1F1]"
        }`}
      >
        <img
          src={isUrgent ? UrgentImg : GeneralImg}
          className="w-[45px] object-contain"
        ></img>
      </div>
      <div className="text-xl leading-[1.3] font-semibold">
        <span className="text-2xl">{sound} 감지</span>
        <br />
        <span
          className={isUrgent ? "text-[rgba(255,255,255,0.7)]" : "text-[#6b6b6b]"}
        >
          {time} {location}
        </span>
      </div>
    </div>
  );
}
