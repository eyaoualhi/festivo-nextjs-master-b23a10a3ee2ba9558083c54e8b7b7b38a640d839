"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff, Lock, type LucideIcon } from "lucide-react";
import FieldMessage from "@/components/ui/FieldMessage";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  labelAction?: ReactNode;
  hint?: string;
  error?: string;
  showLabel: string;
  hideLabel: string;
  children?: ReactNode;
};

export default function PasswordField({
  id,
  label,
  icon: Icon = Lock,
  labelAction,
  hint,
  error,
  showLabel,
  hideLabel,
  children,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const messageId = error || hint ? `${id}-message` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="group relative">
        <Icon
          aria-hidden="true"
          className={`pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 transition-colors ${
            error ? "text-danger" : "text-muted group-focus-within:text-primary"
          }`}
        />
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={`min-h-12 w-full rounded-xl border bg-card px-12 text-sm text-ink shadow-xs transition placeholder:text-muted/70 hover:border-line-strong focus:ring-4 focus:outline-none ${
            error
              ? "border-danger focus:border-danger focus:ring-danger/15"
              : "border-line focus:border-primary focus:ring-primary/15"
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          aria-controls={id}
          className="absolute end-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-5" />
          ) : (
            <Eye aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>
      {messageId && <FieldMessage id={messageId} error={error} hint={hint} />}
      {children}
    </div>
  );
}
