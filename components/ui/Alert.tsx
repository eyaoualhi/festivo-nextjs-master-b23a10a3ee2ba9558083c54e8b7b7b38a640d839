import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";

type AlertTone = "info" | "error" | "success";

type AlertProps = {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
};

const styles: Record<AlertTone, { box: string; icon: LucideIcon; iconColor: string }> = {
  info: { box: "border-primary/15 bg-primary-soft", icon: Info, iconColor: "text-primary" },
  error: { box: "border-danger/20 bg-danger-soft", icon: CircleAlert, iconColor: "text-danger" },
  success: {
    box: "border-success/20 bg-success-soft",
    icon: CircleCheck,
    iconColor: "text-success",
  },
};

export default function Alert({ tone = "info", title, children }: AlertProps) {
  const { box, icon: Icon, iconColor } = styles[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex gap-3 rounded-xl border p-4 ${box}`}
    >
      <Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${iconColor}`} />
      <div className="flex flex-col gap-0.5">
        <p className={`text-sm font-semibold ${tone === "error" ? "text-danger" : "text-ink"}`}>
          {title}
        </p>
        {children && <div className="text-xs leading-relaxed text-muted">{children}</div>}
      </div>
    </div>
  );
}
