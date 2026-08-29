type ButtonVariant = "primary" | "dark" | "outline-dark" | "outline-light";

interface ButtonProps {
  children: React.ReactNode;
  variant: ButtonVariant;
  onClick: () => void;
  disabled?: boolean;
}

const BASE_STYLE = "w-full h-15 cursor-pointer rounded-xl text-subtitle-01";
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-main-200 text-gray-400",
  dark: "bg-gray-500 text-gray-100 disabled:bg-gray-200",
  "outline-dark": "bg-transparent border border-gray-500 text-gray-500",
  "outline-light": "bg-transparent border border-gray-100 text-gray-100",
};

export default function Button({
  children,
  variant,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${BASE_STYLE} ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </button>
  );
}
