import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchInput = ({ value, onChange, placeholder, disabled }: SearchInputProps) => {
  return (
    <div className="relative group">
      {/* Glow effect on focus */}
      <div className={cn(
        "absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-lg",
        "opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300"
      )} />
      
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3.5 pl-12 rounded-lg",
            "bg-input border border-border/50",
            "text-foreground placeholder:text-muted-foreground",
            "font-rajdhani text-base",
            "focus:outline-none focus:border-primary/70",
            "transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
        
        {/* Animated scan line */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-px",
          "bg-gradient-to-r from-transparent via-primary to-transparent",
          "opacity-0 group-focus-within:opacity-100",
          "group-focus-within:animate-shimmer"
        )} 
        style={{ backgroundSize: '200% 100%' }}
        />
      </div>
    </div>
  );
};

export default SearchInput;
