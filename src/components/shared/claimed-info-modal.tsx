"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ClaimSuccessModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.45 },
      scalar: 1.1,
    });

    confetti({
      particleCount: 25,
      spread: 100,
      origin: { y: 0.5 },
      shapes: ["circle"],
      colors: ["#a855f7", "#22c55e", "#f59e0b"],
    });
  }, [open]);

  if (!open) return null;

  const circleStyle = `
    @keyframes draw-circle {
      to {
        stroke-dashoffset: 0;
      }
    }
    .animate-draw-circle {
      animation: draw-circle 0.6s ease-out forwards;
    }
  `;

  const checkStyle = `
    @keyframes draw-check {
      to {
        stroke-dashoffset: 0;
      }
    }
    .animate-draw-check {
      animation: draw-check 0.4s ease-out 0.4s forwards;
    }
  `;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{circleStyle}</style>
      <style>{checkStyle}</style>

      <div onClick={onClose} className="absolute inset-0 bg-black/30" />

      <div className="relative bg-white w-[92%] max-w-lg rounded-2xl p-10 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        <div className="flex justify-center mb-6">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="overflow-visible"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="270 260"
              strokeDashoffset="260"
              className="animate-draw-circle"
              style={{
                transform: "rotate(-25deg)",
                transformOrigin: "60px 60px",
              }}
            />
            <path
              d="M35 57 L52 74 L108 19"
              fill="none"
              stroke="#22c55e"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="115"
              strokeDashoffset="115"
              className="animate-draw-check"
            />
          </svg>
        </div>

        <h2 className="text-xl font-extrabold text-purple-600 mb-4">
          Level Up! 🎉
        </h2>

        <p className="text-2xl font-extrabold text-purple-500 mb-4">
          +5 Points
        </p>

        <div className="flex justify-center gap-3 text-2xl mb-6">✨ 💎 🎯</div>

        <p className="text-gray-600 text-lg">
          You've claimed your daily points! Come back tomorrow for more!
        </p>
      </div>
    </div>
  );
}
