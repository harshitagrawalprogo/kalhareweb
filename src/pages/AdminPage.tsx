import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import JsBarcode from "jsbarcode";
import { Download, Printer, Save, Trash2, ExternalLink, ArrowLeft } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface BarcodeRecord {
  id: number;
  barcode_id: string;
  drive_link: string;
  label: string;
  created_at: string;
}

export default function AdminPage() {
  const [barcodeId, setBarcodeId] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [label, setLabel] = useState("");
  const [records, setRecords] = useState<BarcodeRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => { fetchRecords(); }, []);

  useEffect(() => {
    if (!svgRef.current || !barcodeId.trim()) return;
    try {
      JsBarcode(svgRef.current, barcodeId.trim(), {
        format: "CODE128",
        width: 2.5,
        height: 90,
        displayValue: true,
        fontSize: 14,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 20,
      });
    } catch {}
  }, [barcodeId]);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/barcodes");
      if (res.ok) setRecords(await res.json());
    } catch {}
  };

  const handleSave = async () => {
    if (!barcodeId.trim() || !driveLink.trim()) {
      setErrorMsg("Barcode ID and Drive link are required.");
      setSaveState("error");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    setSaveState("idle");
    try {
      const res = await fetch("/api/barcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode_id: barcodeId.trim(), drive_link: driveLink.trim(), label: label.trim() }),
      });
      if (res.ok) {
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2500);
        fetchRecords();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Failed to save.");
        setSaveState("error");
      }
    } catch {
      setErrorMsg("Network error — check connection.");
      setSaveState("error");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete barcode ${id}?`)) return;
    await fetch("/api/barcodes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barcode_id: id }),
    });
    fetchRecords();
  };

  const downloadSvg = () => {
    if (!svgRef.current || !barcodeId.trim()) return;
    const data = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([data], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${barcodeId.trim()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printBarcode = () => {
    if (!svgRef.current || !barcodeId.trim()) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Barcode - ${barcodeId}</title>
      <style>body{margin:40px;display:flex;flex-direction:column;align-items:center;font-family:monospace;}
      .lbl{font-size:16px;font-weight:bold;margin-bottom:12px;letter-spacing:0.1em;}</style></head><body>
      ${label ? `<div class="lbl">${label}</div>` : ""}${svgData}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm font-body focus:outline-none focus:border-gold/40 transition-colors";
  const labelClass = "block text-[11px] font-body tracking-[0.2em] uppercase text-gold/50 mb-2";

  return (
    <div className="min-h-screen bg-ink text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gold/12 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/40 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <span className="h-4 w-px bg-white/15" />
            <h1 className="font-heading font-bold text-lg">Barcode Manager</h1>
            <span className="text-[10px] font-body tracking-[0.3em] uppercase text-gold/70 bg-gold/10 border border-gold/20 px-2 py-0.5">
              ADMIN
            </span>
          </div>
          <p className="text-white/25 text-xs font-body hidden sm:block">Kalhare Groups &middot; Internal</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Form + Preview */}
        <div className="grid md:grid-cols-2 gap-10 mb-14">

          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-heading font-bold text-xl mb-1">Add / Update Barcode</h2>
              <p className="text-white/35 text-sm font-body">Assign a Drive link to any barcode number. Existing IDs are overwritten.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Barcode Number *</label>
                <input type="text" value={barcodeId} onChange={e => setBarcodeId(e.target.value)} placeholder="e.g. KE-2024-001" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Google Drive Link *</label>
                <input type="url" value={driveLink} onChange={e => setDriveLink(e.target.value)} placeholder="https://drive.google.com/file/d/..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Product Label (optional)</label>
                <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. 15 KVA Transformer, Batch A" className={inputClass} />
              </div>
            </div>

            {saveState === "error" && (
              <p className="text-red-400 text-sm font-body">{errorMsg}</p>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-3 bg-gold text-ink text-xs font-body font-bold tracking-[0.2em] uppercase px-6 py-3 hover:bg-white transition-colors duration-300 disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? "Saving..." : saveState === "saved" ? "Saved!" : "Save to Database"}
            </button>
          </motion.div>

          {/* Right: Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="space-y-5"
          >
            <div>
              <h2 className="font-heading font-bold text-xl mb-1">Barcode Preview</h2>
              <p className="text-white/35 text-sm font-body">Live Code128 preview &mdash; updates as you type.</p>
            </div>

            <div className="bg-white p-6 flex items-center justify-center min-h-[168px]">
              {barcodeId.trim() ? (
                <svg ref={svgRef} />
              ) : (
                <p className="text-black/25 text-sm font-body select-none">Enter a barcode number to preview</p>
              )}
            </div>

            {barcodeId.trim() && (
              <div className="flex gap-3">
                <button
                  onClick={downloadSvg}
                  className="flex items-center gap-2 border border-gold/30 text-gold text-xs font-body tracking-[0.15em] uppercase px-4 py-2.5 hover:bg-gold/10 transition-colors"
                >
                  <Download size={12} /> Download SVG
                </button>
                <button
                  onClick={printBarcode}
                  className="flex items-center gap-2 border border-white/15 text-white/55 text-xs font-body tracking-[0.15em] uppercase px-4 py-2.5 hover:bg-white/5 transition-colors"
                >
                  <Printer size={12} /> Print
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Records table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-xl">Saved Barcodes</h2>
            <span className="text-white/25 text-sm font-body font-mono">{records.length} records</span>
          </div>

          {records.length === 0 ? (
            <div className="border border-white/8 p-14 text-center text-white/20 font-body text-sm">
              No barcodes saved yet. Add one above.
            </div>
          ) : (
            <div className="border border-white/8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    {["Barcode ID", "Label", "Drive Link", "Created", ""].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-body tracking-[0.2em] uppercase text-gold/45 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr key={r.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 !== 0 ? "bg-white/1" : ""}`}>
                      <td className="px-5 py-4 font-body font-mono text-white whitespace-nowrap">{r.barcode_id}</td>
                      <td className="px-5 py-4 text-white/45 font-body">{r.label || <span className="text-white/20">—</span>}</td>
                      <td className="px-5 py-4">
                        <a href={r.drive_link} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 text-gold/60 hover:text-gold text-xs font-body transition-colors max-w-[220px] truncate">
                          <ExternalLink size={10} className="shrink-0" />
                          {r.drive_link.length > 45 ? r.drive_link.slice(0, 45) + "..." : r.drive_link}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-white/25 text-xs font-body whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleDelete(r.barcode_id)}
                          className="text-white/15 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}