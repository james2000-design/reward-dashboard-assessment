import { useEffect, useState } from "react";
import { X, Layers } from "lucide-react";

export default function ShareStackModal({ open, onClose }: any) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId: number | undefined;
    let timeoutId: number | undefined;

    if (open) {
      setMounted(true);
      rafId = requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      timeoutId = window.setTimeout(() => setMounted(false), 300);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          visible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-white rounded-lg shadow-2xl w-full max-w-sm pointer-events-auto transform transition-all duration-300 ${
            visible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <h2 className="text-lg font-bold text-gray-900 text-center">
              Share Your Stack
            </h2>
          </div>

          <div className="px-6 pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <Layers size={24} className="text-purple-600" />
              </div>
            </div>

            <p className="text-center text-gray-600 text-sm leading-relaxed">
              You have no stack created yet, go to Tech Stack to create one.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
