import Link from "next/link";
import type { ComponentProps } from "react";

type TextLinkProps = ComponentProps<typeof Link>;

export default function TextLink({ className = "", ...props }: TextLinkProps) {
  return (
    <Link
      className={`rounded font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`.trim()}
      {...props}
    />
  );
}
