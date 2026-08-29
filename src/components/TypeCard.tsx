interface TypeCardProps {
  title: string;
  description: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export default function TypeCard({
  title,
  description,
  isSelected,
  onClick,
}: TypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-2xl bg-white p-5  text-left ${
        isSelected ? "border-2 border-main-200" : "border-2 border-border"
      }`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          isSelected ? "border-gray-500" : "border-gray-200"
        }`}
      >
        {isSelected && <div className="h-3 w-3 rounded-full bg-gray-500" />}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-head-03 text-gray-500">{title}</p>
        <p className="text-label-02 text-gray-300">{description}</p>
      </div>
    </button>
  );
}
