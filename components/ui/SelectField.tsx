import type { SelectHTMLAttributes } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import FieldMessage from "@/components/ui/FieldMessage";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: LucideIcon;
  hint?: string;
  error?: string;
};

export default function SelectField({
  id,
  label,
  options,
  placeholder,
  icon: Icon,
  hint,
  error,
  ...props
}: SelectFieldProps) {
  const messageId = error || hint ? `${id}-message` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="group relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className={`pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 transition-colors ${
              error ? "text-danger" : "text-muted group-focus-within:text-primary"
            }`}
          />
        )}
        <select
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={`min-h-12 w-full appearance-none rounded-xl border bg-card pe-12 text-sm text-ink shadow-xs transition hover:border-line-strong focus:ring-4 focus:outline-none ${
            Icon ? "ps-12" : "ps-4"
          } ${
            error
              ? "border-danger focus:border-danger focus:ring-danger/15"
              : "border-line focus:border-primary focus:ring-primary/15"
          }`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-muted"
        />
      </div>
      {messageId && <FieldMessage id={messageId} error={error} hint={hint} />}
    </div>
  );
}
