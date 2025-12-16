import { cn } from "@/lib/utils";

interface AssetTypeButtonProps {
  code: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const AssetTypeButton = ({ code, label, isSelected, onClick }: AssetTypeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-4 py-3 rounded-lg font-rajdhani font-medium text-sm",
        "transition-all duration-300 overflow-hidden group",
        "border",
        isSelected
          ? "bg-primary/20 border-primary text-primary neon-glow"
          : "bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
      )}
    >
      {/* Animated background on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0",
        "translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
      )} />
      
      <span className={cn(
        "font-orbitron font-bold text-xs px-2 py-0.5 rounded",
        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
      )}>
        {code}
      </span>
      <span className="relative z-10">{label}</span>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-pulse-glow" />
      )}
    </button>
  );
};

export default AssetTypeButton;
