import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const terreiroButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-amber-600 text-white hover:bg-amber-700",
        axe: "bg-blue-700 text-white hover:bg-blue-800",
        orisha: "bg-green-700 text-white hover:bg-green-800",
        ritual: "bg-red-700 text-white hover:bg-red-800",
        outline:
          "border-2 border-amber-600 bg-transparent text-amber-600 hover:bg-amber-50",
        ghost: "hover:bg-amber-50 text-amber-700",
        link: "text-amber-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface TerreiroButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof terreiroButtonVariants> {
  asChild?: boolean
}

const TerreiroButton = React.forwardRef<HTMLButtonElement, TerreiroButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(terreiroButtonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
TerreiroButton.displayName = "TerreiroButton"

export { TerreiroButton, terreiroButtonVariants } 