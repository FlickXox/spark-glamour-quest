import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  url: string;
  type: string;
  index: number;
  region?: string;
  isWorking?: boolean;
}

const ResultCard = ({ url, type, index, region, isWorking = true }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={cn(
        "group relative rounded-lg overflow-hidden",
        "bg-card border border-border/30",
        "hover:border-primary/50 transition-all duration-300",
        "animate-fade-in-up"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image preview */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {!imageError ? (
          <img
            src={url}
            alt={`Asset ${type}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="font-rajdhani">Preview unavailable</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className={cn(
          "absolute inset-0 bg-background/80 backdrop-blur-sm",
          "flex items-center justify-center gap-3",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        )}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "p-2 rounded-lg bg-primary text-primary-foreground",
              "hover:bg-primary/80 transition-colors duration-200"
            )}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-lg bg-secondary text-secondary-foreground",
              "hover:bg-secondary/80 transition-colors duration-200"
            )}
          >
            {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-orbitron font-bold px-2 py-1 rounded bg-primary/20 text-primary">
            {type}
          </span>
          {region && (
            <span className="text-xs font-orbitron font-bold px-2 py-1 rounded bg-accent/20 text-accent-foreground">
              {region}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-rajdhani">
          #{index + 1}
        </span>
      </div>
    </div>
  );
};

export default ResultCard;
