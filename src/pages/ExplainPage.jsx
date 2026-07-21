import { useState } from "react";
import { Loader2, Lightbulb, AlertCircle, Clock, Info } from "lucide-react";
import ImageDropzone from "../components/ImageDropzone";
import LabelBadge from "../components/LabelBadge";
import ConfidenceBar from "../components/ConfidenceBar";
import { explainSingle } from "../api";
import { DEV_KEY } from "../config";

export default function ExplainPage() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [apiKey, setApiKey] = useState(DEV_KEY);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image || !text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data } = await explainSingle(apiKey, image, text);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }

  function highlightText(raw, topWords) {
    if (!topWords?.length) return raw;
    return raw.split(/(\s+)/).map((word, i) => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, "");
      const idx = topWords.findIndex((w) => w.toLowerCase() === clean);
      if (idx === -1) return <span key={i}>{word}</span>;
      const opacity = [1, 0.75, 0.55][idx] ?? 0.4;
      return (
        <mark
          key={i}
          className="rounded px-0.5 text-amber-200"
          style={{ background: `rgba(251,191,36,${opacity * 0.3})`, borderBottom: `2px solid rgba(251,191,36,${opacity})` }}
        >
          {word}
        </mark>
      );
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Input</h3>
        </div>

        <div className="flex items-start gap-2 bg-amber-500/8 border border-amber-500/15 rounded-xl px-3 py-2.5">
          <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-400/80 leading-relaxed">
            Uses CLIP cosine similarity to attribute which words drive the hateful classification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageDropzone onFile={setImage} file={image} />

          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium uppercase tracking-wide">Meme Text / Caption</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text overlaid on the meme..."
              rows={3}
              className="w-full bg-[#0d1117] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/15 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium uppercase tracking-wide">API Key</label>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs font-mono text-slate-400 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !image || !text.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-3 rounded-xl shadow-lg shadow-amber-900/20 transition-all duration-200"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
            {loading ? "Computing attribution..." : "Explain Decision"}
          </button>
        </form>
      </div>

      {/* Result */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Attribution</h3>
        </div>

        {!result && !error && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5 text-amber-400 opacity-50" />
            </div>
            <p className="text-slate-600 text-sm">Submit to see which words contributed to the classification.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-slate-500 text-sm">Computing CLIP word attribution...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl p-4">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <LabelBadge label={result.label} confidence={result.confidence} />
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {result.latency_ms}ms
              </div>
            </div>

            <ConfidenceBar value={result.confidence} />

            {result.explanation && (
              <>
                <div className="bg-[#0d1117] rounded-xl p-4 border border-white/[0.05]">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wide mb-2">Highlighted Text</p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {highlightText(text, result.explanation.top_words)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wide">Word Attribution Scores</p>
                  {result.explanation.top_words.map((w, i) => (
                    <div key={w} className="bg-[#0d1117] rounded-xl px-4 py-3 border border-white/[0.05] flex items-center gap-3">
                      <span className="text-sm font-mono text-amber-300 w-20 shrink-0">{w}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
                          style={{ width: `${result.explanation.weights[i] * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-mono w-10 text-right">
                        {(result.explanation.weights[i] * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
