import { useState, useCallback, useRef, useMemo } from "react";
import { Search, RotateCcw, Copy, Loader2, XCircle, Download, History } from "lucide-react";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import AssetTypeButton from "@/components/AssetTypeButton";
import StatusIndicator from "@/components/StatusIndicator";
import ActionButton from "@/components/ActionButton";
import ResultCard from "@/components/ResultCard";
import BackgroundEffects from "@/components/BackgroundEffects";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type AssetType = "TW" | "FW" | "DW" | "O";
type Status = "ready" | "scanning" | "error" | "complete";

interface AssetTypeConfig {
  code: AssetType;
  label: string;
}

interface ValidatedUrl {
  url: string;
  region: string;
  isWorking: boolean;
  isStore?: boolean;
}

const assetTypes: AssetTypeConfig[] = [
  { code: "TW", label: "Token Wheel" },
  { code: "FW", label: "Faded Wheel" },
  { code: "DW", label: "Double Wheel" },
  { code: "O", label: "Other Royale" },
];

const regions = ["SG", "IND", "EU", "NA"];
const numbers = [1, 2, 3, 4, 5, 6];

const generateAssetUrls = (name: string, type: AssetType): { url: string; region: string; isStore?: boolean }[] => {
  const urls: { url: string; region: string; isStore?: boolean }[] = [];
  const cleanName = name.replace(/\s+/g, '');

  // Store Assets (shown first, no region/number variations)
  urls.push(
    { url: `https://dl.ak.freefiremobile.com/common/Local/IND/config/${cleanName}-256x107_en.png`, region: "Store", isStore: true },
    { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/252x256_${cleanName}_en.jpg`, region: "Store", isStore: true },
    { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/1500x750_${cleanName}_en.jpg`, region: "Store", isStore: true }
  );

  // Splash Banner (shown for all types)
  urls.push(
    { url: `https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_${cleanName}_en.jpg`, region: "Splash", isStore: true }
  );

  if (type === "TW") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/TW${num}_${cleanName}Tab${region}_en.jpg`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/TW${num}_${cleanName}Title${region}_en.png`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/TW${num}_${cleanName}LobbyBG${region}_en.jpg`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/TW${num}_${cleanName}BG${region}_en.png`, region }
        );
      });
    });
  } else if (type === "FW") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/FW${num}_${cleanName}Tab${region}_en.jpg`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/FW${num}_${cleanName}BG${region}_en.jpg`, region },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/FW${num}_${cleanName}Title${region}_en.png`, region }
        );
      });
    });
  } else if (type === "DW") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/DW${num}_${cleanName}Tab${region}_en.jpg`, region },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/DW${num}_${cleanName}_1_1750x1070_LRBG${region}_en.jpg`, region },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/DW${num}_${cleanName}_1600x590_BG${region}_en.png`, region },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/DW${num}_${cleanName}_492x70_Title${region}_en.png`, region }
        );
      });
    });
  } else if (type === "O") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/O${num}_${cleanName}Tab${region}_en.jpg`, region },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/O${num}_${cleanName}Poster${region}_en.png`, region },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/O${num}_${cleanName}BG${region}_en.jpg`, region }
        );
      });
    });
  }

  return urls;
};

const checkImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000);
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
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
  const [progress, setProgress] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const cancelRef = useRef(false);

  const handleSearch = useCallback(() => {
    if (!assetName.trim()) {
      toast({
        title: "Enter asset name",
        description: "Please enter an asset name to search",
        variant: "destructive",
      });
      return;
    }
    // Reset previous selection to allow new search
    setSelectedType(null);
    setResults([]);
    setStatus("ready");
    setShowTypeSelector(true);
  }, [assetName]);

  const handleTypeSelect = async (type: AssetType) => {
    setSelectedType(type);
    setShowTypeSelector(false); // Close selector after selection
    setStatus("scanning");
    setResults([]);
    setSelectedRegion(null);
    setProgress(0);
    cancelRef.current = false;

    const generatedUrls = generateAssetUrls(assetName, type);
    const validatedResults: ValidatedUrl[] = [];
    const totalUrls = generatedUrls.length;

    for (let i = 0; i < totalUrls; i += 25) {
      if (cancelRef.current) {
        setStatus("ready");
        setSelectedType(null);
        toast({ title: "Scan cancelled" });
        return;
      }
      const batch = generatedUrls.slice(i, i + 25);
      const batchResults = await Promise.all(
        batch.map(async ({ url, region, isStore }) => ({
          url,
          region,
          isStore,
          isWorking: await checkImageUrl(url),
        }))
      );
      validatedResults.push(...batchResults);
      setProgress(Math.round((validatedResults.length / totalUrls) * 100));
    }

    const sortedResults = validatedResults.filter(r => r.isWorking).sort((a, b) => {
      if (a.isStore && !b.isStore) return -1;
      if (!a.isStore && b.isStore) return 1;
      return 0;
    });

    setResults(sortedResults.map(r => ({ ...r, isWorking: true })));
    setStatus("complete");

    toast({
      title: "Scan complete",
      description: `Found ${sortedResults.length} working links`,
    });
  };

  const handleCancelScan = () => {
    cancelRef.current = true;
  };

  const handleReset = () => {
    setAssetName("");
    setSelectedType(null);
    setStatus("ready");
    setResults([]);
    setShowTypeSelector(false);
    setSelectedRegion(null);
    setProgress(0);
    cancelRef.current = false;
  };

  const filteredResults = useMemo(() => 
    selectedRegion ? results.filter(r => r.region === selectedRegion) : results,
    [results, selectedRegion]
  );

  const uniqueRegions = useMemo(() => [...new Set(results.map(r => r.region))], [results]);

  const handleCopyAll = useCallback(async () => {
    if (filteredResults.length === 0) return;
    await navigator.clipboard.writeText(filteredResults.map(r => r.url).join("\n"));
    toast({
      title: "Copied!",
      description: "All working links copied to clipboard",
    });
  }, [filteredResults]);

  const handleDownloadAll = useCallback(async () => {
    if (filteredResults.length === 0) return;
    toast({ title: "Starting download...", description: "Preparing images" });
    
    for (const result of filteredResults.slice(0, 10)) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.url.split('/').pop() || 'image';
      link.target = '_blank';
      link.click();
    }
    
    toast({ title: "Download started", description: `Opening ${Math.min(filteredResults.length, 10)} images` });
  }, [filteredResults]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="relative z-10">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* Title */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-foreground mb-2">
              FF Asset{" "}
              <span className="text-primary neon-text">Finder</span>
            </h1>
            <p className="text-muted-foreground font-rajdhani">Find & Preview Free Fire Assets</p>
          </div>

          {/* Search Card */}
          <div 
            className={cn(
              "neon-border rounded-xl p-6 mb-6",
              "bg-card/80 backdrop-blur-md",
              "animate-fade-in-up"
            )}
          >
            <h2 className="text-lg font-rajdhani font-semibold text-foreground mb-4">
              Enter Asset Name
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  value={assetName}
                  onChange={setAssetName}
                  placeholder="e.g. VacationRing, Cobra, BPS36"
                />
              </div>
              
              <ActionButton
                onClick={handleSearch}
                icon={Search}
                disabled={!assetName.trim()}
              >
                Find Assets
              </ActionButton>
            </div>

            <div className="mt-4">
              <StatusIndicator status={status} />
            </div>
          </div>

          {/* Type Selector or Selected Type Display */}
          {showTypeSelector && !selectedType && (
            <div className="neon-border rounded-xl p-6 mb-6 bg-card/80 backdrop-blur-md">
              <h2 className="text-lg font-rajdhani font-semibold text-foreground mb-4">
                Select Asset Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {assetTypes.map((type) => (
                  <AssetTypeButton
                    key={type.code}
                    code={type.code}
                    label={type.label}
                    isSelected={false}
                    onClick={() => handleTypeSelect(type.code)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Selected Type with Progress */}
          {selectedType && (
            <div className="neon-border rounded-xl p-4 mb-6 bg-card/80 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-rajdhani text-muted-foreground">Selected:</span>
                  <span className="font-orbitron font-bold text-primary px-3 py-1 bg-primary/20 rounded">
                    {assetTypes.find(t => t.code === selectedType)?.label}
                  </span>
                </div>
                {status === "scanning" && (
                  <button
                    onClick={handleCancelScan}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors text-sm font-rajdhani"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
              {status === "scanning" && (
                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm font-rajdhani text-muted-foreground">Scanning...</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          )}

          {/* Results */}
          <div 
            className={cn(
              "neon-border rounded-xl p-6",
              "bg-card/80 backdrop-blur-md",
              "animate-fade-in-up"
            )}
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
                          ? "bg-primary text-primary-foreground neon-glow" 
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
                            ? "bg-primary text-primary-foreground neon-glow" 
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
                <ActionButton
                  variant="secondary"
                  onClick={handleDownloadAll}
                  icon={Download}
                  disabled={filteredResults.length === 0}
                >
                  Download
                </ActionButton>
              </div>
            </div>

            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.map((result, index) => (
                  <ResultCard
                    key={result.url}
                    url={result.url}
                    type={result.isStore ? "Store" : (selectedType || "")}
                    index={index}
                    region={result.region}
                    isWorking={result.isWorking}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                  <span className="font-rajdhani typing-animation">
                    {status === "complete" ? "No Links Found" : "Enter asset name to find links"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-primary/20">
          <p className="text-foreground font-rajdhani text-base">
            © 2024 <span className="text-primary font-bold neon-text">LEAKS OF FF</span> - All Rights Reserved
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;