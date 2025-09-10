import React, { useState, useEffect } from 'react';

const Astrolabe = ({ score = 750, size = "normal" }) => {
  const isSmall = size === "small";
  const containerSize = isSmall ? "w-24 h-24" : "w-56 h-56";

  const radius = isSmall ? 28 : 48;
  const strokeWidth = isSmall ? 8 : 10;
  const circumference = 2 * Math.PI * radius;
  const percentage = score / 1000;

  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStrokeDashoffset(circumference - percentage * circumference);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, percentage, circumference]);

  const svgSize = isSmall ? 96 : 224;
  const viewBoxSize = (radius + strokeWidth/2) * 2 + 8;
  const center = viewBoxSize / 2;

  return (
    <div className={`relative ${containerSize} flex items-center justify-center`}>
      {/* Circle progress ring */}
      <svg
        width={svgSize}
        height={svgSize}
        className="absolute transform -rotate-90"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#27272a"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#38BDF8"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Centered score text */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white">
        <span className={`${isSmall ? 'text-lg font-semibold' : 'text-5xl font-bold'} leading-none`}>
          {score}
        </span>
      </div>
    </div>
  );
};


export default Astrolabe;