import React from 'react';

const SolarSystemAnimation = () => {
  return (
    <div className="w-64 h-64 relative flex items-center justify-center">
      <style>{`
        @keyframes cosmic-pulse {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          animation: cosmic-pulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* A central glowing core */}
      <div
        className="particle bg-celestial-blue"
        style={{
          width: '80px',
          height: '80px',
          animationDuration: '4s',
          boxShadow: '0 0 20px 10px rgba(59, 130, 246, 0.3)',
        }}
      />

      {/* Surrounding particles */}
      <div
        className="particle bg-stardust-grey"
        style={{
          width: '120px',
          height: '120px',
          animationDelay: '-1s',
          animationDuration: '5s',
          opacity: 0.5,
        }}
      />
      <div
        className="particle bg-celestial-blue/50"
        style={{
          width: '160px',
          height: '160px',
          animationDelay: '-2s',
          animationDuration: '6s',
          opacity: 0.3,
        }}
      />
       <div
        className="particle border border-dashed border-stardust-grey/30"
        style={{
          width: '200px',
          height: '200px',
          animationDelay: '-3s',
          animationDuration: '7s',
          opacity: 0.2,
        }}
      />
    </div>
  );
};

export default SolarSystemAnimation;
