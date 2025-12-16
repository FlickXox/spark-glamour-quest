import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
}

const ActionButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  icon: Icon,
  disabled,
  className 
}: ActionButtonProps) => {
  const variants = {
    primary: cn(
      "bg-primary text-primary-foreground",
      "hover:bg-primary/90",
      "neon-glow hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
    ),
    secondary: cn(
      "bg-secondary text-secondary-foreground border border-border/50",
      "hover:border-primary/50 hover:bg-secondary/80"
    ),
    ghost: cn(
      "bg-transparent text-muted-foreground",
      "hover:text-foreground hover:bg-muted/50"
    ),
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-6 py-3 rounded-lg font-rajdhani font-semibold text-sm",
        "flex items-center justify-center gap-2",
        "transition-all duration-300",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "overflow-hidden group",
        variants[variant],
        className
      )}
    >
      {/* Shimmer effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
        "translate-x-[-100%] group-hover:translate-x-[100%]",
        "transition-transform duration-500"
      )} />
      
      {Icon && <Icon className="w-4 h-4 relative z-10" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default ActionButton;
