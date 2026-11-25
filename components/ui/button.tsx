import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Botones del prototipo de Figma Make. Las variantes antiguas de shadcn (default, outline,
// destructive, link) se conservan como alias para no romper las pantallas que ya las usan.
const primary = "bg-blue-600 text-white shadow-[0_6px_16px_-6px_rgb(37_99_235_/_0.6)] hover:bg-blue-700";
const secondary = "border border-line bg-white text-navy-900 shadow-sm hover:bg-slate-50";
const danger = "bg-red-600 text-white shadow-sm hover:bg-red-700";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary,
        secondary,
        ghost: "text-navy-900 hover:bg-slate-100",
        danger,
        // Verde 700 con texto blanco: el verde 600 no alcanza el contraste mínimo (3,3).
        success: "bg-green-700 text-white shadow-sm hover:bg-green-800",
        // Ámbar con texto navy: el blanco sobre ámbar no alcanza el contraste mínimo.
        warning: "bg-amber-400 text-navy-950 shadow-sm hover:bg-amber-500",
        dark: "bg-navy-900 text-white shadow-sm hover:bg-navy-800",
        // Alias de shadcn.
        default: primary,
        outline: secondary,
        destructive: danger,
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-lg px-3 text-xs",
        md: "h-10 rounded-xl px-4 text-sm",
        lg: "h-12 rounded-xl px-6 text-base",
        // Alias de shadcn.
        default: "h-10 rounded-xl px-4 text-sm",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
