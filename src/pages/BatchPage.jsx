import { useState, useRef } from "react";
import { Loader2, Plus, Trash2, Layers, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import LabelBadge from "../components/LabelBadge";
import ConfidenceBar from "../components/ConfidenceBar";
import { moderateBatch } from "../api";
import { DEV_KEY } from "../config";

function BatchItem({ item, index, onChange, onRemove, result }) {
  const inputRef = useRef();
  const preview = item.image ? URL.createObjectURL(item.image) : null;

  return (
    <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-4 space-y-3 relative group">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono font-medium">#{String(index + 1).padStart(2, "0")}</span>
        <button
          onClick={() => onRemove(index)}
          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        onClick={() => inputRef.current.click()}
        className={`h-24 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden
          ${preview ? "border-transparent" : "border-slate-700 hover:border-slate-500"}`}
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="text-slate-600 text-xs">Click to upload</span>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onChange(index, "image", e.target.files[0])} />
      </div>

      <input
        value={item.text}
        onChange={(e) => onChange(index, "text", e.target.value)}
        placeholder="Meme text..."
        className="w-full bg-[#080b12] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all"
      />

      {result && (
        <div className="pt-1 space-y-2 border-t border-white/[0.05]">
          <LabelBadge label={result.label} confidence={result.confidence} />
          <ConfidenceBar value={result.confidence} />
        </div>
      )}
    </div>
  );
}

export default function BatchPage() {
  const [items, setItems] = useState([
    { image: null, text: "" },
    { image: null, text: "" },
  ]);
  const [apiKey, setApiKey] = useState(DEV_KEY);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function addItem() {
    if (items.length >= 10) return;
    setItems([...items, { image: null, text: "" }]);
  }

  function removeItem(i) {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== i));
    if (results) setResults(results.filter((_, idx) => idx !== i));
  }

  function changeItem(i, key, val) {
    setItems(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
    if (results) setResults(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const valid = items.filter((it) => it.image && it.text.trim());
    if (!valid.length) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const { data } = await moderateBatch(apiKey, valid);
      setResults(data.results);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }

  const readyCount = items.filter((it) => it.image && it.text.trim()).length;
  const hatefulCount = results?.filter((r) => r.label === "hateful").length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" /> Batch Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Analyze up to 10 memes simultaneously</p>
        </div>
        {results && (
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
              {results.length - hatefulCount} safe
            </span>
            {hatefulCount > 0 && (
              <span className="text-xs bg-red-500/15 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">
                {hatefulCount} hateful
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <BatchItem
            key={i}
            item={item}
            index={i}
            onChange={changeItem}
            onRemove={removeItem}
            result={results?.[i]}
          />
        ))}

        {items.length < 10 && (
          <button
            onClick={addItem}
            className="h-full min-h-40 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/5 text-slate-600 hover:text-purple-400 rounded-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Add item</span>
          </button>
        )}
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 space-y-4">
        <div>
          <label className="text-xs text-slate-500 mb-1.5 block font-medium uppercase tracking-wide">API Key</label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs font-mono text-slate-400 focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || readyCount === 0}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all duration-200"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
          {loading
            ? `Analyzing ${readyCount} meme${readyCount !== 1 ? "s" : ""}...`
            : `Analyze ${readyCount} meme${readyCount !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}
