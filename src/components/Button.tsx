type ButtonVariant = "primary" | "dark" | "outline-dark" | "outline-light";

interface ButtonProps {
  children: React.ReactNode;
  variant: ButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const BASE_STYLE =
  "w-full h-14 rounded-xl text-subtitle-01 cursor-pointer disabled:cursor-not-allowed";
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-main-200 text-gray-400 disabled:opacity-50",
  dark: "bg-gray-500 text-gray-100 disabled:bg-gray-200",
  "outline-dark":
    "bg-transparent border border-gray-500 text-gray-500 disabled:opacity-50",
  "outline-light":
    "bg-transparent border border-gray-100 text-gray-100 disabled:opacity-50",
};

export default function Button({
  children,
  variant,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE_STYLE} ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </button>
  );
}
