import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { href?: string; variant?: "primary" | "secondary" | "ghost"; };
const styles = { primary: "bg-sage-700 text-white shadow-soft hover:bg-sage-500", secondary: "bg-white text-ink ring-1 ring-sage-100 hover:bg-sage-50", ghost: "bg-transparent text-slateblue hover:bg-sage-50" };
export function Button({ href, variant = "primary", className = "", children, ...props }: Props) {
  const cls = `inline-flex min-h-11 items-center justify-center rounded-2xl px-5 py-3 text-center text-sm font-bold transition ${styles[variant]} ${className}`;
  if (href) return <Link className={cls} href={href}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}
