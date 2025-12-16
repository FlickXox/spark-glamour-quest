const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Simple gradient background - no animations for performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      
      {/* Static gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/3 rounded-full blur-[80px]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
    </div>
  );
};

export default BackgroundEffects;