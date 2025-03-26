export default function EnergyOverlay() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none bg-[url('/energy-grid.png')] animate-energyShift opacity-30 mix-blend-screen" />
  );
}
