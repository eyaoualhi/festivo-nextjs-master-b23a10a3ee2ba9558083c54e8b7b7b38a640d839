import type { InputHTMLAttributes } from "react";
import { CircleAlert, type LucideIcon } from "lucide-react";
import FieldMessage from "@/components/ui/FieldMessage";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  hint?: string;
  error?: string;
};

export default function TextField({
  id,
  label,
  icon: Icon,
  hint,
  error,
  type = "text",
  ...props
}: TextFieldProps) {
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
        <input
          id={id}
          name={id}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={`min-h-12 w-full rounded-xl border bg-card px-4 text-sm text-ink shadow-xs transition placeholder:text-muted/70 hover:border-line-strong focus:ring-4 focus:outline-none ${
            Icon ? "ps-12" : ""
          } ${
            error
              ? "border-danger pe-12 focus:border-danger focus:ring-danger/15"
              : "border-line focus:border-primary focus:ring-primary/15"
          }`}
          {...props}
        />
        {error && (
          <CircleAlert
            aria-hidden="true"
            className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-danger"
          />
        )}
      </div>
      {messageId && <FieldMessage id={messageId} error={error} hint={hint} />}
    </div>
  );
}
