import { cn } from "@/lib/utils";

type Status = "ready" | "scanning" | "error" | "complete";

interface StatusIndicatorProps {
  status: Status;
  message?: string;
}

const statusConfig = {
  ready: {
    color: "text-primary",
    bgColor: "bg-primary",
    label: "Ready",
  },
  scanning: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-400",
    label: "Scanning...",
  },
  error: {
    color: "text-destructive",
    bgColor: "bg-destructive",
    label: "Error",
  },
  complete: {
    color: "text-primary",
    bgColor: "bg-primary",
    label: "Complete",
  },
};

const StatusIndicator = ({ status, message }: StatusIndicatorProps) => {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground font-rajdhani text-sm">Status:</span>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={cn("w-2 h-2 rounded-full", config.bgColor)} />
          {status === "scanning" && (
            <div className={cn(
              "absolute inset-0 w-2 h-2 rounded-full animate-ping",
              config.bgColor
            )} />
          )}
          {status === "ready" && (
            <div className={cn(
              "absolute -inset-1 rounded-full opacity-50 animate-pulse",
              config.bgColor,
              "blur-sm"
            )} />
          )}
        </div>
        <span className={cn("font-rajdhani font-semibold text-sm", config.color)}>
          {message || config.label}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;
