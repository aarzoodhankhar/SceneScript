import { useState } from "react";
import { Shield, Lightbulb, Layers, GitBranch, ExternalLink, Cpu, BookOpen } from "lucide-react";
import ModeratePage from "./pages/ModeratePage";
import ExplainPage from "./pages/ExplainPage";
import BatchPage from "./pages/BatchPage";

const TABS = [
  { id: "moderate", label: "Moderate", icon: Shield, Page: ModeratePage },
  { id: "explain", label: "Explain", icon: Lightbulb, Page: ExplainPage },
  { id: "batch", label: "Batch", icon: Layers, Page: BatchPage },
];

const STATS = [
  { label: "Accuracy", value: "77%" },
  { label: "Dataset", value: "8.5K memes" },
  { label: "Architecture", value: "KID-VLM" },
  { label: "Modality", value: "Vision + Language" },
];

export default function App() {
  const [active, setActive] = useState("moderate");
  const current = TABS.find((t) => t.id === active);

  return (
    <div className="min-h-screen bg-[#080b12]">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#080b12]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-900/50">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-[#080b12]" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight text-sm">SceneScript</span>
              <span className="ml-2 text-[10px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/20 font-mono">
                v1.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://scenescript-api.onrender.com/docs"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> API Docs
            </a>
            <a
              href="https://github.com/aarzoodhankhar/SceneScript"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <GitBranch className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-xs text-purple-400 mb-4">
            <Cpu className="w-3 h-3" />
            Research Project · KID-VLM · Aug – Dec 2025
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Multimodal Toxic Meme Detection
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Knowledge-Infused Distilled Vision-Language Model combining{" "}
            <span className="text-slate-300">CLIP</span>,{" "}
            <span className="text-slate-300">ViT</span>, and{" "}
            <span className="text-slate-300">BERT</span>{" "}
            with multimodal fusion for hate speech detection in memes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-center"
            >
              <p className="text-xl font-bold text-white tracking-tight">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tech stack pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["CLIP", "ViT", "BERT", "ResNet50", "SVM", "TF-IDF", "Knowledge Distillation", "PyTorch", "FastAPI"].map((t) => (
            <span
              key={t}
              className="text-[11px] bg-slate-800/80 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/60 font-mono"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1 mb-6 flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active === id
                  ? "bg-gradient-to-b from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Page content */}
        <div className="pb-16">
          <current.Page />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KID-VLM: Knowledge Infusion & Distillation for Detection of Indecent Memes</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://scenescript-api.onrender.com/docs" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> API
            </a>
            <a href="https://github.com/aarzoodhankhar/SceneScript" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors flex items-center gap-1">
              <GitBranch className="w-3 h-3" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
