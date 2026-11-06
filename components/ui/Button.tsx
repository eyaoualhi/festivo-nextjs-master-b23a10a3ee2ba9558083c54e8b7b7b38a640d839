import type { ButtonHTMLAttributes } from "react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonClasses";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}
