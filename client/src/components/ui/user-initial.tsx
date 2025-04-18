interface UserInitialProps {
    name: string
    size?: "sm" | "md" | "lg" | "xl"
    className?: string
  }
  
  export default function UserInitial({ name, size = "md", className = "" }: UserInitialProps) {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
  
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-lg",
      xl: "h-32 w-32 text-4xl",
    }
  
    return (
      <div
        className={`rounded-full bg-purple-700 text-white flex items-center justify-center ${sizeClasses[size]} ${className}`}
        aria-label={name}
      >
        {initials}
      </div>
    )
  }
  
  