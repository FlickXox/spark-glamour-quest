import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { Search, RotateCcw, Copy, Loader2, XCircle } from "lucide-react";
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

// AssetType moved below
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
  isSplash?: boolean;
  category?: string;
}

type AssetType = "TW" | "FW" | "DW" | "O" | "MS" | "SH";

const assetTypes: AssetTypeConfig[] = [
  { code: "TW", label: "Token Wheel" },
  { code: "FW", label: "Faded Wheel" },
  { code: "DW", label: "Double Wheel" },
  { code: "O", label: "Other Royale" },
  { code: "MS", label: "Moco Store" },
  { code: "SH", label: "Store Highlight" },
];

const regions = ["SG", "IND", "EU", "NA"];
const numbers = [1, 2, 3, 4, 5, 6];

const generateAssetUrls = (name: string, type: AssetType): { url: string; region: string; isStore?: boolean; isSplash?: boolean; category?: string }[] => {
  const urls: { url: string; region: string; isStore?: boolean; isSplash?: boolean; category?: string }[] = [];
  const cleanName = name.replace(/\s+/g, '');

  // Splash Banner (shown first)
  urls.push(
    { url: `https://dl.dir.freefiremobile.com/common/Local/BD/Splashanno/1750x1070_${cleanName}_en.jpg`, region: "Splash", isSplash: true, category: "Splash" }
  );

  // Store Assets
  urls.push(
    { url: `https://dl.ak.freefiremobile.com/common/Local/IND/config/${cleanName}-256x107_en.png`, region: "Store", isStore: true, category: "Store" },
    { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/252x256_${cleanName}_en.jpg`, region: "Store", isStore: true, category: "Store" },
    { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/1500x750_${cleanName}_en.jpg`, region: "Store", isStore: true, category: "Store" },
    { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/512x182_${cleanName}_en.png`, region: "Store", isStore: true, category: "Store" }
  );

  // IND Store Assets
  urls.push(
    { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/${cleanName}-256x107IND_en.png`, region: "IND Store", isStore: true, category: "IND Store" },
    { url: `https://dl-tata.freefireind.in/common/Local/IND/config/252x256_${cleanName}IND_en.jpg`, region: "IND Store", isStore: true, category: "IND Store" },
    { url: `https://dl-tata.freefireind.in/common/Local/IND/config/1500x750_${cleanName}IND_en.jpg`, region: "IND Store", isStore: true, category: "IND Store" },
    { url: `https://dl-tata.freefireind.in/common/Local/IND/config/512x182_${cleanName}IND_en.png`, region: "IND Store", isStore: true, category: "IND Store" },
    { url: `https://dl-tata.freefireind.in/common/Local/IND/config/660x108_${cleanName}IND_en.png`, region: "IND Store", isStore: true, category: "IND Store" }
  );

  if (type === "TW") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/TW${num}_${cleanName}Tab${region}_en.jpg`, region, category: "Tab" },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/TW${num}_${cleanName}Title${region}_en.png`, region, category: "Title" },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/TW${num}_${cleanName}LobbyBG${region}_en.jpg`, region, category: "LobbyBG" },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/TW${num}_${cleanName}BG${region}_en.png`, region, category: "BG" }
        );
      });
    });
  } else if (type === "FW") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/FW${num}_${cleanName}Tab${region}_en.jpg`, region, category: "Tab" },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/FW${num}_${cleanName}BG${region}_en.jpg`, region, category: "BG" },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/FW${num}_${cleanName}Title${region}_en.png`, region, category: "Title" }
        );
      });
    });
  } else if (type === "DW") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/DW${num}_${cleanName}Tab${region}_en.jpg`, region, category: "Tab" },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/DW${num}_${cleanName}_1_1750x1070_LRBG${region}_en.jpg`, region, category: "LRBG" },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/DW${num}_${cleanName}_1600x590_BG${region}_en.png`, region, category: "BG" },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/DW${num}_${cleanName}_492x70_Title${region}_en.png`, region, category: "Title" }
        );
      });
    });
  } else if (type === "O") {
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/O${num}_${cleanName}Tab${region}_en.jpg`, region, category: "Tab" },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/O${num}_${cleanName}Poster${region}_en.png`, region, category: "Poster" },
          { url: `https://dl-tata.freefireind.in/common/Local/IND/config/O${num}_${cleanName}BG${region}_en.jpg`, region, category: "BG" }
        );
      });
    });
  } else if (type === "MS") {
    // Moco Store
    regions.forEach((region) => {
      numbers.forEach((num) => {
        urls.push(
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/Moco${num}_${cleanName}Tab${region}_en.jpg`, region, category: "Tab" },
          { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/Moco${num}_${cleanName}Title${region}_en.png`, region, category: "Title" }
        );
      });
    });
  } else if (type === "SH") {
    // Store Highlight - Only store assets, no other URLs
    return [
      { url: `https://dl.ak.freefiremobile.com/common/Local/IND/config/${cleanName}-256x107_en.png`, region: "Store", isStore: true, category: "Store" },
      { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/252x256_${cleanName}_en.jpg`, region: "Store", isStore: true, category: "Store" },
      { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/1500x750_${cleanName}_en.jpg`, region: "Store", isStore: true, category: "Store" },
      { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/512x182_${cleanName}_en.png`, region: "Store", isStore: true, category: "Store" },
      { url: `https://dl.dir.freefiremobile.com/common/Local/IND/config/${cleanName}-256x107IND_en.png`, region: "IND Store", isStore: true, category: "IND Store" },
      { url: `https://dl-tata.freefireind.in/common/Local/IND/config/252x256_${cleanName}IND_en.jpg`, region: "IND Store", isStore: true, category: "IND Store" },
      { url: `https://dl-tata.freefireind.in/common/Local/IND/config/1500x750_${cleanName}IND_en.jpg`, region: "IND Store", isStore: true, category: "IND Store" },
      { url: `https://dl-tata.freefireind.in/common/Local/IND/config/512x182_${cleanName}IND_en.png`, region: "IND Store", isStore: true, category: "IND Store" },
      { url: `https://dl-tata.freefireind.in/common/Local/IND/config/660x108_${cleanName}IND_en.png`, region: "IND Store", isStore: true, category: "IND Store" },
    ];
  }

  return urls;
};

const checkImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      img.src = "";
      resolve(false);
    }, 1500);
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
  const [isShaking, setIsShaking] = useState(false);
  const cancelRef = useRef(false);
  const isScanning = useRef(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSoundRef.current = new Audio('/sounds/click.mp3');
    clickSoundRef.current.volume = 0.5;
  }, []);

  const playClickSound = useCallback(() => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  }, []);

  const handleSearch = useCallback(() => {
    playClickSound();
    if (!assetName.trim()) {
      toast({
        title: "Enter asset name",
        description: "Please enter an asset name to search",
        variant: "destructive",
      });
      return;
    }
    // Cancel any ongoing scan
    if (isScanning.current) {
      cancelRef.current = true;
    }
    // Reset state for new search
    setSelectedType(null);
    setResults([]);
    setStatus("ready");
    setProgress(0);
    setShowTypeSelector(true);
  }, [assetName, playClickSound]);

  const handleTypeSelect = async (type: AssetType) => {
    playClickSound();
    if (isScanning.current) return;
    
    setSelectedType(type);
    setShowTypeSelector(false);
    setStatus("scanning");
    setResults([]);
    setSelectedRegion(null);
    setProgress(0);
    cancelRef.current = false;
    isScanning.current = true;

    const generatedUrls = generateAssetUrls(assetName, type);
    const validatedResults: ValidatedUrl[] = [];
    const totalUrls = generatedUrls.length;

    try {
      // Process all URLs in parallel for maximum speed
      const batchSize = 50;
      for (let i = 0; i < totalUrls; i += batchSize) {
        if (cancelRef.current) {
          setStatus("ready");
          setSelectedType(null);
          isScanning.current = false;
          toast({ title: "Scan cancelled" });
          return;
        }
        const batch = generatedUrls.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async ({ url, region, isStore, isSplash, category }) => ({
            url,
            region,
            isStore,
            isSplash,
            category,
            isWorking: await checkImageUrl(url),
          }))
        );
        validatedResults.push(...batchResults);
        setProgress(Math.round((validatedResults.length / totalUrls) * 100));
      }

      const sortedResults = validatedResults.filter(r => r.isWorking).sort((a, b) => {
        if (a.isSplash && !b.isSplash) return -1;
        if (!a.isSplash && b.isSplash) return 1;
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
    } finally {
      isScanning.current = false;
    }
  };

  const handleCancelScan = () => {
    playClickSound();
    cancelRef.current = true;
  };

  const handleReset = () => {
    playClickSound();
    cancelRef.current = true;
    isScanning.current = false;
    setIsShaking(true);
    
    setTimeout(() => {
      setAssetName("");
      setSelectedType(null);
      setStatus("ready");
      setResults([]);
      setShowTypeSelector(false);
      setSelectedRegion(null);
      setProgress(0);
    }, 100);

    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  const filteredResults = useMemo(() => 
    selectedRegion ? results.filter(r => r.region === selectedRegion) : results,
    [results, selectedRegion]
  );

  const uniqueRegions = useMemo(() => [...new Set(results.map(r => r.region))], [results]);

  const groupedResults = useMemo(() => {
    const grouped: Record<string, ValidatedUrl[]> = {};
    filteredResults.forEach(r => {
      const cat = r.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(r);
    });
    return grouped;
  }, [filteredResults]);

  const handleCopyAll = useCallback(async () => {
    playClickSound();
    if (filteredResults.length === 0) return;
    
    const categoryOrder = ["Splash", "Store", "IND Store", "Tab", "Title", "LobbyBG", "LRBG", "BG", "Poster"];
    let output = "";
    
    categoryOrder.forEach(cat => {
      if (groupedResults[cat] && groupedResults[cat].length > 0) {
        output += `${cat}:\n${groupedResults[cat].map(r => r.url).join("\n")}\n\n`;
      }
    });
    
    Object.keys(groupedResults).forEach(cat => {
      if (!categoryOrder.includes(cat)) {
        output += `${cat}:\n${groupedResults[cat].map(r => r.url).join("\n")}\n\n`;
      }
    });
    
    await navigator.clipboard.writeText(output.trim());
    toast({
      title: "Copied!",
      description: "All working links copied with categories",
    });
  }, [filteredResults, groupedResults, playClickSound]);

  const handleCopyCategory = useCallback(async (category: string) => {
    playClickSound();
    const links = groupedResults[category];
    if (!links || links.length === 0) return;
    
    const output = `${category}:\n${links.map(r => r.url).join("\n")}`;
    await navigator.clipboard.writeText(output);
    toast({
      title: `${category} Copied!`,
      description: `${links.length} links copied`,
    });
  }, [groupedResults, playClickSound]);


  const categoryOrder = ["Splash", "Store", "IND Store", "Tab", "Title", "LobbyBG", "LRBG", "BG", "Poster"];

  return (
    <div className={cn("min-h-screen bg-background relative overflow-hidden", isShaking && "earthquake")}>
      <BackgroundEffects />
      
      <div className="relative z-10">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* Title */}
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-gff font-bold text-foreground mb-2">
              FF Asset{" "}
              <span className="text-primary neon-text">Finder</span>
            </h1>
            <p className="text-muted-foreground">Find & Preview Free Fire Assets</p>
          </div>

          {/* Search Card */}
          <div 
            className={cn(
              "neon-border rounded-xl p-6 mb-6",
              "bg-card/80 backdrop-blur-md",
              "animate-fade-in-up"
            )}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Enter Asset Name
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  value={assetName}
                  onChange={setAssetName}
                  placeholder="e.g. VacationRing, BPS37"
                />
              </div>
              
              <ActionButton
                onClick={handleSearch}
                icon={Search}
                disabled={!assetName.trim() || status === "scanning"}
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
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Select Asset Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
                  <span className="text-sm text-muted-foreground">Selected:</span>
                  <span className="font-orbitron font-bold text-primary px-3 py-1 bg-primary/20 rounded">
                    {assetTypes.find(t => t.code === selectedType)?.label}
                  </span>
                </div>
                {status === "scanning" && (
                  <button
                    onClick={handleCancelScan}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors text-sm"
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
                    <span className="text-sm text-muted-foreground">Scanning...</span>
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
              <h2 className="text-lg font-semibold text-foreground">
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
              </div>
            </div>

            {/* Category Copy Buttons */}
            {filteredResults.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-primary/20">
                {categoryOrder.map(cat => (
                  groupedResults[cat] && groupedResults[cat].length > 0 && (
                    <button
                      key={cat}
                      onClick={() => handleCopyCategory(cat)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-secondary-foreground text-sm transition-all hover:scale-105"
                    >
                      <Copy className="w-3 h-3" />
                      {cat} ({groupedResults[cat].length})
                    </button>
                  )
                ))}
              </div>
            )}

            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.map((result, index) => (
                  <ResultCard
                    key={result.url}
                    url={result.url}
                    type={result.isSplash ? "Splash" : result.isStore ? "Store" : (selectedType || "")}
                    index={index}
                    region={result.region}
                    isWorking={result.isWorking}
                    category={result.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                  <span className="typing-animation">
                    {status === "complete" ? "No Links Found" : "Enter asset name to find links"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-primary/20">
          <p className="text-foreground text-base">
            © 2026 <span className="text-primary font-bold neon-text">LEAKS OF FF</span> - All Rights Reserved
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;