
import { cn } from "@/lib/utils";

interface CardIconProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CardIcon({ 
  children, 
  variant = "primary", 
  size = "md",
  className 
}: CardIconProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full",
        size === "sm" && "p-1", 
        size === "md" && "p-1.5", 
        size === "lg" && "p-2",
        variant === "primary" && "bg-primary/10 text-primary",
        variant === "secondary" && "bg-secondary/10 text-secondary",
        variant === "outline" && "border border-muted text-muted-foreground",
        variant === "ghost" && "text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}
