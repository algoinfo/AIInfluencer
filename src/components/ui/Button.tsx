import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-[#0a0a0c] hover:bg-accent-strong hover:text-[#0a0a0c] shadow-[0_0_40px_rgba(216,255,62,0.18)]",
  secondary:
    "border border-border-strong bg-transparent text-fg hover:bg-white/[0.04]",
  ghost: "bg-white/[0.04] text-fg hover:bg-white/[0.08]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-[0.95rem]",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = [
    "inline-flex items-center justify-center rounded-full font-medium tracking-tight transition-all duration-300 ease-out",
    "active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
    "disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");

  if ("href" in props && props.href) {
    const { href, external } = props as ButtonAsLink;
    if (external || href.startsWith("http")) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
