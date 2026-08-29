interface InputProps {
  id: string;
  label: string;
  type: "text" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
}

export default function Input({
  id,
  type,
  value,
  label,
  onChange,
  placeholder,
  autoComplete,
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-14 w-full rounded-xl border border-border bg-white px-4 text-body-01 outline-none focus:border-main-200 placeholder:text-gray-200"
      />
    </div>
  );
}
