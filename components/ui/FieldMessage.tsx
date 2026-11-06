import { CircleAlert } from "lucide-react";

type FieldMessageProps = {
  id: string;
  error?: string;
  hint?: string;
};

export default function FieldMessage({ id, error, hint }: FieldMessageProps) {
  if (error) {
    return (
      <p id={id} className="flex items-center gap-1.5 text-xs text-danger">
        <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
        {error}
      </p>
    );
  }

  return (
    <p id={id} className="text-xs text-muted">
      {hint}
    </p>
  );
}
