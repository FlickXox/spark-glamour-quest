import { ExternalLink, Copy, Check, ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  url: string;
  type: string;
  index: number;
  region?: string;
  isWorking?: boolean;
  category?: string;
}

const ResultCard = ({ url, type, index, region, category }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={cn(
        "group relative rounded-lg overflow-hidden",
        "bg-card border border-border/50",
        "hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20",
        "transition-all duration-300 transform hover:-translate-y-1"
      )}
    >
      {/* Image preview - exact size */}
      <div className="bg-secondary relative overflow-hidden min-h-[100px]">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center min-h-[100px]">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={url}
              alt={`Asset ${type}`}
              className={cn(
                "w-full h-auto block transition-opacity duration-200",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full min-h-[100px] flex flex-col items-center justify-center text-muted-foreground gap-2 py-8">
            <ImageOff className="w-8 h-8" />
            <span className="font-rajdhani text-sm">Preview unavailable</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className={cn(
          "absolute inset-0 bg-background/90 backdrop-blur-sm",
          "flex items-center justify-center gap-3",
          "opacity-0 group-hover:opacity-100 transition-all duration-300"
        )}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "p-3 rounded-lg bg-primary text-primary-foreground",
              "hover:scale-110 transition-transform duration-200",
              "neon-glow"
            )}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={handleCopy}
            className={cn(
              "p-3 rounded-lg bg-secondary text-secondary-foreground",
              "hover:scale-110 transition-transform duration-200"
            )}
          >
            {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="p-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-orbitron font-bold px-2 py-1 rounded",
            type === "Splash" 
              ? "bg-purple-500/20 text-purple-400"
              : type === "Store" 
                ? "bg-amber-500/20 text-amber-400" 
                : "bg-primary/20 text-primary"
          )}>
            {type}
          </span>
          {category && category !== "Store" && category !== "Splash" && (
            <span className="text-xs font-orbitron font-bold px-2 py-1 rounded bg-secondary text-secondary-foreground">
              {category}
            </span>
          )}
          {region && region !== "Store" && region !== "Splash" && (
            <span className="text-xs font-rajdhani px-2 py-1 rounded bg-muted text-muted-foreground">
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