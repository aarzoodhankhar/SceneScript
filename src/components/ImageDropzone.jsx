import { useRef, useState } from "react";
import { ImageIcon, Upload } from "lucide-react";

export default function ImageDropzone({ onFile, file }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onFile(f);
  }

  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 h-48 overflow-hidden
        ${drag
          ? "border-purple-400/60 bg-purple-500/8"
          : preview
          ? "border-white/10 bg-transparent"
          : "border-slate-700 hover:border-slate-500 bg-[#0d1117] hover:bg-white/[0.02]"
        }`}
    >
      {preview ? (
        <img src={preview} alt="preview" className="h-full w-full object-contain p-1" />
      ) : (
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Upload className="w-5 h-5 text-slate-500" />
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400">Drop image here</p>
            <p className="text-xs text-slate-600 mt-0.5">or click to browse · PNG, JPG, WEBP</p>
          </div>
        </div>
      )}
      {file && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-4">
          <p className="text-xs text-slate-300 truncate">{file.name}</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files[0])} />
    </div>
  );
}
