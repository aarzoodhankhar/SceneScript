import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle, Clock, Zap } from "lucide-react";
import ImageDropzone from "../components/ImageDropzone";
import LabelBadge from "../components/LabelBadge";
import ConfidenceBar from "../components/ConfidenceBar";
import { moderateSingle } from "../api";
import { DEV_KEY } from "../config";

export default function ModeratePage() {
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
      const { data } = await moderateSingle(apiKey, image, text);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Send className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Input</h3>
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
              className="w-full bg-[#0d1117] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium uppercase tracking-wide">API Key</label>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#0d1117] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs font-mono text-slate-400 focus:outline-none focus:border-purple-500/60 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !image || !text.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-b from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-3 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-200"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? "Analyzing meme..." : "Run Analysis"}
          </button>
        </form>
      </div>

      {/* Result Panel */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Result</h3>
        </div>

        {!result && !error && !loading && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
              <Send className="w-5 h-5 text-purple-400 opacity-50" />
            </div>
            <p className="text-slate-600 text-sm">Submit an image and text to see the classification result here.</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-slate-500 text-sm">Running KID-VLM inference...</p>
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

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Text Signal", value: result.text_signal },
                { label: "Model", value: result.model_version },
                { label: "Architecture", value: "KID-VLM" },
                { label: "Modality", value: "Vision + Language" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#0d1117] rounded-xl p-3 border border-white/[0.05]">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm text-slate-200 font-medium capitalize">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#0d1117] rounded-xl p-3 border border-white/[0.05]">
              <p className="text-[10px] text-slate-600 uppercase tracking-wide mb-1.5">Raw Response</p>
              <pre className="text-xs text-slate-400 font-mono overflow-x-auto">
                {JSON.stringify({ label: result.label, confidence: result.confidence, text_signal: result.text_signal }, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
