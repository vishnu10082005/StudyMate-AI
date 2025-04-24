"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
<SwitchPrimitive.Root
  data-slot="switch"
  className={cn(
    "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
    "data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted/40",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  {...props}
>
  <SwitchPrimitive.Thumb
    data-slot="switch-thumb"
    className={cn(

      "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
      "data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-500",
      "data-[state=checked]:bg-white dark:data-[state=checked]:bg-white",
      "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
    )}
  />
</SwitchPrimitive.Root>

  )
}

export { Switch }
