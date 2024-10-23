import * as React from "react"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"


export default function PremiumDashboardButton({
  children,
  className,
  ...props
}) {
  return (
    <Button
      className={cn(
        "bg-gradient-to-r from-amber-500 to-yellow-500",
        "text-black font-semibold",
        "border-2 border-yellow-600",
        "hover:from-amber-600 hover:to-yellow-600",
        "hover:border-yellow-700",
        "transition-all duration-300 ease-in-out",
        "shadow-lg hover:shadow-amber-500/50",
        "flex items-center space-x-2",
        "px-4 py-2 rounded-md",
        className
      )}
      {...props}
    >
      <Crown className="w-5 h-5" />
      <span>{children}</span>
    </Button>
  )
}

function Component() {
  return (
    <div className="flex items-center justify-center p-8 bg-gray-900">
      <PremiumDashboardButton>Premium Access</PremiumDashboardButton>
    </div>
  )
}