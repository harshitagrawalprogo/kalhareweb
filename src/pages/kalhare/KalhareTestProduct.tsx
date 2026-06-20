import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Barcode, Search, Camera, CameraOff, ExternalLink, RotateCcw } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface BarcodeRecord {
  barcode_id: string;
  drive_link: string;
  label: string;
}

declare global {
  interface Window {
    BarcodeDetector?: new (opts: { formats: string[] }) => {
      detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>;
    };
  }
}

export default function KalhareTestProduct() {
  const [input, setInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<BarcodeRecord | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "notfound">("idle");
  const [cameraAvailable, setCameraAvailable] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    inputRef.current?.focus();
    if (typeof window !== "undefined" && window.BarcodeDetector) {
      setCameraAvailable(true);
    }
    return () => stopCamera();
  }, []);

  const lookup = useCallback(async (barcode: string) => {
    const val = barcode.trim();
    if (!val) return;
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch(`/api/barcodes?barcode=${encodeURIComponent(val)}`);
      if (res.ok) {
        setResult(await res.json());
        setStatus("found");
      } else {
        setStatus("notfound");
      }
    } catch {
      setStatus("notfound");
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") lookup(input);
  };

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setScanning(false);
  };

  const startCamera = async () => {
    if (!window.BarcodeDetector) return;
    try {
      const detector = new window.BarcodeDetector({ formats: ["code_128", "ean_13", "ean_8", "code_39", "qr_code"] });
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);

      const detect = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0) {
            const val = codes[0].rawValue;
            setInput(val);
            stopCamera();
            lookup(val);
            return;
          }
        } catch {}
        rafRef.current = requestAnimationFrame(detect);
      };
      rafRef.current = requestAnimationFrame(detect);
    } catch {
      setCameraAvailable(false);
    }
  };

  const reset = () => {
    setInput("");
    setResult(null);
    setStatus("idle");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <section className="min-h-screen bg-navy-950 pt-24 pb-20 px-6">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <Barcode size={22} className="text-gold" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-white mb-3">Product Lookup</h1>
          <p className="text-white/40 font-body text-sm leading-relaxed max-w-sm mx-auto">
            Scan a product barcode or type the barcode number to retrieve its associated document.
          </p>
        </motion.div>

        {/* Camera view */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mb-5 overflow-hidden"
            >
              <div className="relative bg-black aspect-video">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                {/* Scan target overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-2/3 h-14">
                    <div className="absolute inset-0 border border-gold/60" />
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-0.5 bg-gold/70"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>
                <div className="absolute top-0 inset-x-0 bg-linear-to-b from-black/60 to-transparent py-2">
                  <p className="text-gold/80 text-[10px] font-body tracking-[0.35em] uppercase text-center">Scanning &mdash; Hold barcode in frame</p>
                </div>
              </div>
              <button
                onClick={stopCamera}
                className="w-full flex items-center justify-center gap-2 border-x border-b border-white/10 text-white/40 text-xs font-body tracking-[0.15em] uppercase py-2.5 hover:bg-white/4 transition-colors"
              >
                <CameraOff size={12} /> Stop Camera
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="space-y-3 mb-8"
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scan or type barcode number..."
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3.5 text-sm font-body font-mono focus:outline-none focus:border-gold/40 transition-colors"
            />
            <button
              onClick={() => lookup(input)}
              disabled={status === "loading"}
              className="bg-gold text-ink px-5 flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 shrink-0"
            >
              <Search size={16} />
            </button>
          </div>

          {cameraAvailable && !scanning && (
            <button
              onClick={startCamera}
              className="w-full flex items-center justify-center gap-2 border border-gold/20 text-gold/65 text-xs font-body tracking-[0.2em] uppercase py-3 hover:bg-gold/8 transition-colors"
            >
              <Camera size={13} /> Use Camera
            </button>
          )}
        </motion.div>

        {/* Result area */}
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-white/15 border-t-gold rounded-full animate-spin" />
            </motion.div>
          )}

          {status === "found" && result && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="border border-gold/25 bg-gold/4 p-7 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-body tracking-[0.4em] uppercase text-gold/50 mb-1.5">Product Found</p>
                  <p className="font-heading font-bold text-white text-xl leading-snug">
                    {result.label || result.barcode_id}
                  </p>
                  {result.label && (
                    <p className="text-white/35 text-xs font-body font-mono mt-1">{result.barcode_id}</p>
                  )}
                </div>
                <div className="w-9 h-9 border border-gold/25 flex items-center justify-center shrink-0">
                  <Barcode size={15} className="text-gold" />
                </div>
              </div>

              <div className="h-px bg-gold/12" />

              <a
                href={result.drive_link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-gold text-ink text-xs font-body font-bold tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-white transition-colors duration-300 w-full"
              >
                <ExternalLink size={13} /> Open Drive Document
              </a>

              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 w-full text-white/30 text-xs font-body tracking-[0.15em] uppercase py-2 hover:text-white/60 transition-colors"
              >
                <RotateCcw size={11} /> Scan Another
              </button>
            </motion.div>
          )}

          {status === "notfound" && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="border border-white/8 p-8 text-center space-y-3"
            >
              <p className="text-white/35 font-body text-sm">
                No product found for <span className="font-mono text-white/55">{input}</span>
              </p>
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 mx-auto text-white/25 text-xs font-body tracking-[0.15em] uppercase py-1 hover:text-white/50 transition-colors"
              >
                <RotateCcw size={11} /> Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}