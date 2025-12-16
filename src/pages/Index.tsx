import { useState, useCallback } from "react";
import { Search, RotateCcw, Copy, ChevronRight, X } from "lucide-react";
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

interface ValidatedUrl {
  url: string;
  region: string;
  isWorking: boolean;
}

const assetTypes: AssetTypeConfig[] = [
  { code: "TW", label: "Token Wheel (TW)", patterns: ["TW"] },
  { code: "FW", label: "Faded Wheel (FW)", patterns: ["FW"] },
  { code: "DW", label: "Step Up (DW)", patterns: ["DW"] },
  { code: "O", label: "Other Royale (O)", patterns: ["O"] },
];

const regions = ["SG", "IND", "EU", "NA"];
const numbers = [1, 2, 3, 4, 5, 6];

const generateAssetUrls = (name: string, type: AssetType): { url: string; region: string }[] => {
  const urls: { url: string; region: string }[] = [];
  const cleanName = name.replace(/\s+/g, ''); // Remove all spaces

  if (type === "TW") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl.dir.freefiremobile.com/common/Local/${region}/config/TW${num}_${cleanName}Tab${region}_en.jpg`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/${region}/config/TW${num}_${cleanName}Title${region}_en.png`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/${region}/config/TW${num}_${cleanName}LobbyBG${region}_en.jpg`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/${region}/config/TW${num}_${cleanName}BG${region}_en.png`, region }
        );
      });
    });
  } else if (type === "FW") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl.dir.freefiremobile.com/common/Local/${region}/config/FW${num}_${cleanName}Tab${region}_en.jpg`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/${region}/config/FW${num}_${cleanName}BG${region}_en.jpg`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/${region}/config/FW${num}_${cleanName}Title${region}_en.png`, region }
        );
      });
    });
  } else {
    urls.push(
      { url: `https://dl.dir.freefiremobile.com/common/web_event/${cleanName}_${type}_1.png`, region: "Global" },
      { url: `https://dl.dir.freefiremobile.com/common/web_event/${cleanName}_${type}_2.png`, region: "Global" }
    );
  }

  return urls;
};

const checkImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const Index = () => {
  const [assetName, setAssetName] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [status, setStatus] = useState<Status>("ready");
  const [results, setResults] = useState<ValidatedUrl[]>([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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
    setSelectedRegion(null);

    const generatedUrls = generateAssetUrls(assetName, type);
    
    // Validate all URLs
    const validatedResults: ValidatedUrl[] = [];
    
    toast({
      title: "Validating links...",
      description: `Checking ${generatedUrls.length} URLs`,
    });

    // Check URLs in parallel (batch of 10)
    for (let i = 0; i < generatedUrls.length; i += 10) {
      const batch = generatedUrls.slice(i, i + 10);
      const results = await Promise.all(
        batch.map(async ({ url, region }) => ({
          url,
          region,
          isWorking: await checkImageUrl(url),
        }))
      );
      validatedResults.push(...results);
    }

    setResults(validatedResults);
    setStatus("complete");

    const workingCount = validatedResults.filter(r => r.isWorking).length;
    toast({
      title: "Scan complete",
      description: `Found ${workingCount} working links out of ${validatedResults.length}`,
    });
  };

  const handleCancelType = () => {
    setShowTypeSelector(false);
    setSelectedType(null);
  };

  const handleReset = () => {
    setAssetName("");
    setSelectedType(null);
    setStatus("ready");
    setResults([]);
    setShowTypeSelector(false);
    setSelectedRegion(null);
  };

  const workingResults = results.filter(r => r.isWorking);
  const filteredResults = selectedRegion 
    ? workingResults.filter(r => r.region === selectedRegion)
    : workingResults;

  const handleCopyAll = async () => {
    if (filteredResults.length === 0) return;
    await navigator.clipboard.writeText(filteredResults.map(r => r.url).join("\n"));
    toast({
      title: "Copied!",
      description: "All working links copied to clipboard",
    });
  };

  const uniqueRegions = [...new Set(workingResults.map(r => r.region))];

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
              1. Enter Asset Name (No spaces needed)
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  value={assetName}
                  onChange={setAssetName}
                  placeholder="Enter name (e.g., VacationRing or Cobra)"
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-rajdhani font-semibold text-foreground">
                  2. Select Asset Type to Scan
                </h2>
                <button
                  onClick={handleCancelType}
                  className="p-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-rajdhani font-semibold text-foreground">
                Working Links ({filteredResults.length})
              </h2>
              
              <div className="flex items-center gap-2 flex-wrap">
                {/* Region Filter */}
                {uniqueRegions.length > 0 && (
                  <div className="flex items-center gap-1 mr-2">
                    <button
                      onClick={() => setSelectedRegion(null)}
                      className={cn(
                        "px-3 py-1.5 rounded text-xs font-orbitron font-bold transition-all",
                        !selectedRegion 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      ALL
                    </button>
                    {uniqueRegions.map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={cn(
                          "px-3 py-1.5 rounded text-xs font-orbitron font-bold transition-all",
                          selectedRegion === region 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                )}
                
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
                  disabled={filteredResults.length === 0}
                >
                  Copy All
                </ActionButton>
              </div>
            </div>

            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.map((result, index) => (
                  <ResultCard
                    key={result.url}
                    url={result.url}
                    type={selectedType || ""}
                    index={index}
                    region={result.region}
                    isWorking={result.isWorking}
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
