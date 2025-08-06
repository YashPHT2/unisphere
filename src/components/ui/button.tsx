import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-twitter-blue text-white hover:bg-twitter-blue-hover shadow-lg hover:shadow-xl transform hover:scale-105",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
        outline: "border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/30 text-foreground",
        secondary: "bg-white/10 backdrop-blur-md text-foreground hover:bg-white/20 border border-white/10",
        ghost: "hover:bg-white/10 backdrop-blur-sm text-foreground hover:text-twitter-blue",
        link: "text-twitter-blue underline-offset-4 hover:underline",
        glass: "glass-button text-foreground hover:text-twitter-blue",
        twitter: "bg-twitter-blue text-white hover:bg-twitter-blue-hover rounded-full font-bold transform hover:scale-105 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
