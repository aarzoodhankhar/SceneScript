export default function LabelBadge({ label, confidence }) {
  const isHateful = label === "hateful";
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
        isHateful
          ? "bg-red-500/15 text-red-400 border border-red-500/25"
          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isHateful ? "bg-red-400" : "bg-emerald-400"}`} />
      {isHateful ? "Hateful" : "Not Hateful"}
      <span className="opacity-60 font-normal">{(confidence * 100).toFixed(1)}%</span>
    </div>
  );
}
