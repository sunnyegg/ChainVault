import { useEffect, useRef, useState } from 'react';

export const CryptoBackgroundSVG = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 30;
      const y = ((e.clientY / innerHeight) - 0.5) * 30;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 opacity-30 pointer-events-none transition-transform duration-100"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id="network"
            x1="0"
            y1="0"
            x2="1440"
            y2="900"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FCD535" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FCD535" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        <path
          d="M0 100H1440M0 300H1440M0 500H1440M0 700H1440M240 0V900M480 0V900M720 0V900M960 0V900M1200 0V900"
          stroke="url(#network)"
          strokeWidth="1.5"
        />

        {/* Crypto Nodes */}
        <circle cx="240" cy="100" r="5" fill="#FCD535" />
        <circle cx="480" cy="500" r="5" fill="#FCD535" />
        <circle cx="720" cy="300" r="5" fill="#FCD535" />
        <circle cx="960" cy="700" r="5" fill="#FCD535" />
        <circle cx="1200" cy="100" r="5" fill="#FCD535" />
        <circle cx="960" cy="300" r="5" fill="#FCD535" />
        <circle cx="720" cy="700" r="5" fill="#FCD535" />

        {/* Connecting Lines */}
        <line x1="240" y1="100" x2="720" y2="300" stroke="#FCD535" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="720" y1="300" x2="960" y2="700" stroke="#FCD535" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="960" y1="700" x2="480" y2="500" stroke="#FCD535" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="480" y1="500" x2="240" y2="100" stroke="#FCD535" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
