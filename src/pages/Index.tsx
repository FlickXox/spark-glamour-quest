import { useState, useCallback } from "react";
import { Search, RotateCcw, Copy, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import AssetTypeButton from "@/components/AssetTypeButton";
import StatusIndicator from "@/components/StatusIndicator";
import ActionButton from "@/components/ActionButton";
import ResultCard from "@/components/ResultCard";
import BackgroundEffects from "@/components/BackgroundEffects";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type AssetType = "TW" | "FW" | "DW" | "O";
type Status = "ready" | "scanning" | "error" | "complete";

interface AssetTypeConfig {
  code: AssetType;
  label: string;
  patterns: string[];
}

const assetTypes: AssetTypeConfig[] = [
  { code: "TW", label: "Token Wheel (TW)", patterns: ["TW"] },
  { code: "FW", label: "Faded Wheel (FW)", patterns: ["FW"] },
  { code: "DW", label: "Step Up (DW)", patterns: ["DW"] },
  { code: "O", label: "Other Royale (O)", patterns: ["O"] },
];

const regions = ["SG", "IND", "EU", "NA"];
const numbers = [1, 2, 3, 4, 5, 6];

const generateAssetUrls = (name: string, type: AssetType): string[] => {
  const urls: string[] = [];

  if (type === "TW") {
    // Token Wheel patterns
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          `https://dl.dir.freefiremobile.com/common/Local/${region}/config/TW${num}_${name}Tab${region}_en.jpg`,
          `https://dl.dir.freefiremobile.com/common/Local/${region}/config/TW${num}_${name}Title${region}_en.png`,
          `https://dl.dir.freefiremobile.com/common/Local/${region}/config/TW${num}_${name}LobbyBG${region}_en.jpg`,
          `https://dl.dir.freefiremobile.com/common/Local/${region}/config/TW${num}_${name}BG${region}_en.png`
        );
      });
    });
  } else if (type === "FW") {
    // Faded Wheel patterns
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          `https://dl.dir.freefiremobile.com/common/Local/${region}/config/FW${num}_${name}Tab${region}_en.jpg`,
          `https://dl.dir.freefiremobile.com/common/Local/${region}/config/FW${num}_${name}BG${region}_en.jpg`,
          `https://dl.dir.freefiremobile.com/common/Local/${region}/config/FW${num}_${name}Title${region}_en.png`
        );
      });
    });
  } else {
    // Fallback for other types
    urls.push(
      `https://dl.dir.freefiremobile.com/common/web_event/${name}_${type}_1.png`,
      `https://dl.dir.freefiremobile.com/common/web_event/${name}_${type}_2.png`
    );
  }

  return urls;
};

const Index = () => {
  const [assetName, setAssetName] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [status, setStatus] = useState<Status>("ready");
  const [results, setResults] = useState<string[]>([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!assetName.trim()) {
      toast({
        title: "Enter asset name",
        description: "Please enter an asset name to search",
        variant: "destructive",
      });
      return;
    }
    setShowTypeSelector(true);
  }, [assetName]);

  const handleTypeSelect = async (type: AssetType) => {
    setSelectedType(type);
    setStatus("scanning");
    setResults([]);

    // Simulate scanning
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate mock results
    const generatedUrls = generateAssetUrls(assetName, type);
    setResults(generatedUrls);
    setStatus("complete");

    toast({
      title: "Scan complete",
      description: `Generated ${generatedUrls.length} potential asset links`,
    });
  };

  const handleReset = () => {
    setAssetName("");
    setSelectedType(null);
    setStatus("ready");
    setResults([]);
    setShowTypeSelector(false);
  };

  const handleCopyAll = async () => {
    if (results.length === 0) return;
    await navigator.clipboard.writeText(results.join("\n"));
    toast({
      title: "Copied!",
      description: "All links copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundEffects />
      
      <div className="relative z-10">
        <Header />

        <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Title */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-foreground mb-2">
              Asset Link{" "}
              <span className="text-primary neon-text">Validator</span>
              {" & "}
              <span className="text-primary neon-text">Preview</span>
            </h1>
          </div>

          {/* Search Card */}
          <div 
            className={cn(
              "neon-border rounded-xl p-6 mb-6",
              "bg-card/60 backdrop-blur-sm",
              "animate-fade-in-up"
            )}
            style={{ animationDelay: "100ms" }}
          >
            <h2 className="text-lg font-rajdhani font-semibold text-foreground mb-4">
              1. Enter Asset Name
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  value={assetName}
                  onChange={setAssetName}
                  placeholder="Enter name part (e.g., VacationRing or Cobra)"
                />
              </div>
              
              <ActionButton
                onClick={handleSearch}
                icon={Search}
                disabled={!assetName.trim()}
              >
                Next: Select Type
              </ActionButton>
            </div>

            <div className="mt-4">
              <StatusIndicator status={status} />
            </div>
          </div>

          {/* Type Selector */}
          {showTypeSelector && (
            <div 
              className={cn(
                "neon-border rounded-xl p-6 mb-6",
                "bg-card/60 backdrop-blur-sm",
                "animate-fade-in-up"
              )}
            >
              <h2 className="text-lg font-rajdhani font-semibold text-foreground mb-4">
                2. Select Asset Type to Scan
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {assetTypes.map((type) => (
                  <AssetTypeButton
                    key={type.code}
                    code={type.code}
                    label={type.label}
                    isSelected={selectedType === type.code}
                    onClick={() => handleTypeSelect(type.code)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div 
            className={cn(
              "neon-border rounded-xl p-6",
              "bg-card/60 backdrop-blur-sm",
              "animate-fade-in-up"
            )}
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-rajdhani font-semibold text-foreground">
                Working Links ({results.length})
              </h2>
              
              <div className="flex items-center gap-2">
                <ActionButton
                  variant="ghost"
                  onClick={handleReset}
                  icon={RotateCcw}
                >
                  Reset
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  onClick={handleCopyAll}
                  icon={Copy}
                  disabled={results.length === 0}
                >
                  Copy All Links
                </ActionButton>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((url, index) => (
                  <ResultCard
                    key={url}
                    url={url}
                    type={selectedType || ""}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                  <ChevronRight className="w-4 h-4" />
                  <span className="font-rajdhani">
                    Enter event name (e.g., <code className="text-primary">VacationRing</code> or <code className="text-primary">BPS36</code>).
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border/30">
          <p className="text-muted-foreground font-rajdhani text-sm">
            © <span className="text-primary font-semibold">@LEAKS OF FF</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
