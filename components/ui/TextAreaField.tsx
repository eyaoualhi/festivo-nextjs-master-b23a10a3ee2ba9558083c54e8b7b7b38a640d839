import type { TextareaHTMLAttributes } from "react";
import FieldMessage from "@/components/ui/FieldMessage";

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export default function TextAreaField({ id, label, hint, error, ...props }: TextAreaFieldProps) {
  const messageId = error || hint ? `${id}-message` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        className={`w-full resize-y rounded-xl border bg-card px-4 py-3 text-sm text-ink shadow-xs transition placeholder:text-muted/70 hover:border-line-strong focus:ring-4 focus:outline-none ${
          error
            ? "border-danger focus:border-danger focus:ring-danger/15"
            : "border-line focus:border-primary focus:ring-primary/15"
        }`}
        {...props}
      />
      {messageId && <FieldMessage id={messageId} error={error} hint={hint} />}
    </div>
  );
}
