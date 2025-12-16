const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.02) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] animate-float" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
      
      {/* Scan lines */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 2px, hsl(var(--foreground)) 4px)',
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background)) 100%)',
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
