import React from 'react';

interface YardBackgroundProps {
  onReturnToClassroom: () => void;
}

export const YardBackground: React.FC<YardBackgroundProps> = ({ onReturnToClassroom }) => (
  <div className="absolute inset-0 overflow-hidden bg-sky-200 pointer-events-none select-none">
    <style>{`
      @keyframes flag-wave {
        0%, 100% { transform: skewY(0deg) scaleX(1); }
        50% { transform: skewY(-2deg) scaleX(.98); }
      }
      @keyframes sunshine {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(5deg); }
      }
    `}</style>
    <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-100" />
    <div data-trash-blocker className="absolute inset-x-0 top-[29%] h-[18%] bg-gradient-to-b from-amber-100 to-orange-100 border-y-4 border-amber-700">
      <div className="absolute inset-x-0 top-2 flex justify-center gap-2 text-2xl opacity-90" aria-hidden="true">
        <span>🪟</span><span>🪟</span><span>🪟</span><span>🪟</span><span>🪟</span>
      </div>
    </div>
    <div data-trash-play-area className="absolute inset-x-0 bottom-0 top-[42%] bg-gradient-to-b from-lime-300 via-green-400 to-green-600" />

    <div className="absolute left-[10%] top-[2%] text-7xl opacity-90 drop-shadow-sm sm:text-8xl" aria-hidden="true">☁️</div>
    <div className="absolute right-[12%] top-[7%] text-6xl opacity-90 drop-shadow-sm sm:text-7xl" aria-hidden="true">☁️</div>
    <div className="absolute right-[34%] top-[1%] h-24 w-24 sm:h-32 sm:w-32" style={{ animation: 'sunshine 6s ease-in-out infinite' }} aria-label="Mặt trời tỏa nắng">
      <span className="absolute inset-2 rounded-full bg-amber-300/50 blur-xl" aria-hidden="true" />
      <svg className="relative h-full w-full drop-shadow-lg" viewBox="0 0 120 120" role="img" aria-label="Mặt trời rạng rỡ">
        <g stroke="#F59E0B" strokeWidth="7" strokeLinecap="round">
          {Array.from({ length: 12 }, (_, ray) => (
            <line key={ray} x1="60" y1="6" x2="60" y2="19" transform={`rotate(${ray * 30} 60 60)`} />
          ))}
        </g>
        <circle cx="60" cy="60" r="37" fill="#FDE047" stroke="#F59E0B" strokeWidth="3" />
        <circle cx="47" cy="56" r="3" fill="#92400E" />
        <circle cx="73" cy="56" r="3" fill="#92400E" />
        <path d="M 46 69 Q 60 83 74 69" fill="none" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>

    <div className="absolute left-[8%] top-[38%] text-5xl sm:text-7xl drop-shadow-md" aria-hidden="true">🌳</div>
    <div className="absolute right-[7%] top-[37%] text-5xl sm:text-7xl drop-shadow-md" aria-hidden="true">🌳</div>
    <div className="absolute left-[20%] top-[50%] text-3xl sm:text-4xl" aria-hidden="true">🌼</div>
    <div className="absolute right-[19%] top-[53%] text-3xl sm:text-4xl" aria-hidden="true">🌷</div>

    <div className="absolute left-1/2 top-[10%] h-[29%] w-24 -translate-x-1/2 sm:w-28" aria-hidden="true">
      <svg className="h-full w-full overflow-visible drop-shadow-md" viewBox="0 0 100 160" role="img" aria-label="Lá cờ đỏ sao vàng Việt Nam">
        <title>Lá cờ đỏ sao vàng Việt Nam</title>
        <defs>
          <linearGradient id="flag-red" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#F43F3F" />
            <stop offset="1" stopColor="#C81E1E" />
          </linearGradient>
          <linearGradient id="flag-shine" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" />
            <stop offset=".48" stopColor="#fff" stopOpacity=".02" />
            <stop offset="1" stopColor="#7F1D1D" stopOpacity=".18" />
          </linearGradient>
        </defs>
        <path d="M 19 6 V 143" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
        <path d="M 19 145 Q 19 140 13 139 H 25 Q 20 141 20 145 Z" fill="#475569" />
        <circle cx="19" cy="5" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
        <g style={{ transformOrigin: '20px 40px', animation: 'flag-wave 3s ease-in-out infinite' }}>
          <path d="M 23 13 Q 50 7 83 15 L 80 58 Q 52 51 23 60 Z" fill="url(#flag-red)" stroke="#991B1B" strokeWidth="1.5" />
          <path d="M 23 13 Q 50 7 83 15 L 80 58 Q 52 51 23 60 Z" fill="url(#flag-shine)" />
          <path d="M 52 20 L 57 32 L 70 33 L 60 41 L 63 53 L 52 46 L 41 53 L 44 41 L 34 33 L 47 32 Z" fill="#FDE047" stroke="#F59E0B" strokeWidth="1" />
        </g>
      </svg>
    </div>

    <div className="absolute left-1/2 top-[47%] h-[39%] w-[58%] -translate-x-1/2 rounded-[2rem] border-4 border-white/80 bg-orange-300/90 shadow-inner sm:w-[48%]">
      <div className="absolute inset-3 rounded-[1.5rem] border-2 border-white/70" />
      <div className="absolute left-1/2 top-0 h-full border-l-2 border-white/70" />
      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70 sm:h-16 sm:w-16" />
      <div className="absolute left-1 top-1/2 h-1/3 w-[22%] -translate-y-1/2 rounded-r-full border-2 border-l-0 border-white/70" />
      <div className="absolute right-1 top-1/2 h-1/3 w-[22%] -translate-y-1/2 rounded-l-full border-2 border-r-0 border-white/70" />
      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/85 px-3 py-1 text-[10px] font-black text-orange-900 shadow sm:text-xs">
        SÂN THỂ DỤC
      </span>
    </div>

    <button
      type="button"
      onClick={onReturnToClassroom}
      className="pointer-events-auto absolute left-3 top-[13%] z-30 rounded-full border-2 border-emerald-700 bg-white/95 px-3 py-2 text-xs font-black text-emerald-900 shadow-lg transition hover:scale-105 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-yellow-400 sm:left-5 sm:px-4 sm:text-sm"
      title="Quay lại lớp học"
    >
      ← Về lớp học
    </button>
    <span className="absolute right-3 top-[13%] rounded-full bg-emerald-800/90 px-3 py-1 text-xs font-black text-white shadow sm:right-5 sm:text-sm">
      SÂN TRƯỜNG
    </span>
  </div>
);
