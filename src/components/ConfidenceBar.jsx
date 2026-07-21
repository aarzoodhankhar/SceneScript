export default function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  const gradient =
    pct > 70
      ? "from-red-600 to-red-400"
      : pct > 45
      ? "from-amber-600 to-amber-400"
      : "from-emerald-600 to-emerald-400";
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1.5">
        <span className="uppercase tracking-wide">Confidence</span>
        <span className="font-mono text-slate-400">{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${gradient}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
