import { Gamepad2 } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <Gamepad2 className="w-8 h-8 text-primary transition-all duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-orbitron font-bold text-primary neon-text">FF</span>
            <span className="text-2xl font-orbitron font-bold text-foreground">ASSETS</span>
            <span className="text-2xl font-orbitron font-bold text-primary neon-text">FINDER</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
