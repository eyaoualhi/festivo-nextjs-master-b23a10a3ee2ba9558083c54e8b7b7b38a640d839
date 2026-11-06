import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonClasses";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
};

export default function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
