interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? "bg-main-200" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all duration-200 ${
          checked ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}
