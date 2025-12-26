"use client";

import { useEffect, useState } from "react";

export default function RewardCoin() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // trigger on every refresh
    setAnimate(false);
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  return (
    <div className="relative w-12 h-12 perspective">
      <div className={`coin ${animate ? "coin-animate" : ""}`}>
        {/* Coin face */}
        <div className="coin-face">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer ring */}
            <circle cx="50" cy="50" r="48" fill="#FFD84D" />
            <circle cx="50" cy="50" r="42" fill="#FFC933" />

            {/* Star */}
            <polygon
              points="50,28 56,42 72,44 60,54 63,70 50,61 37,70 40,54 28,44 44,42"
              fill="#FF9F1C"
            />
          </svg>
        </div>

        {/* White wave overlay */}
        <div className="coin-wave" />
      </div>
    </div>
  );
}
