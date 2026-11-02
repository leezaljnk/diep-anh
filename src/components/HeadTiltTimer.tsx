import React, { useId } from 'react';
import { Sparkles } from 'lucide-react';
import { HEAD_TILT_QUESTION_SECONDS, HEAD_TILT_WARNING_SECONDS } from '../utils/headTiltSorting';

interface HeadTiltTimerProps {
  secondsRemaining: number;
  running: boolean;
}

export const HeadTiltTimer: React.FC<HeadTiltTimerProps> = ({ secondsRemaining, running }) => {
  const maskId = useId();
  const remaining = Math.max(0, Math.min(HEAD_TILT_QUESTION_SECONDS, secondsRemaining));
  const warning = remaining <= HEAD_TILT_WARNING_SECONDS && remaining > 0;
  const progress = remaining / HEAD_TILT_QUESTION_SECONDS * 100;

  return (
    <div role="timer" aria-live="off" aria-label={`Thời gian còn lại: ${remaining} giây`} className="relative grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 shadow-[inset_0_0_0_1px_#fed7aa,0_3px_0_#fed7aa] sm:size-20 sm:rounded-3xl">
      <svg viewBox="0 0 100 100" aria-hidden="true" className={`absolute inset-0 size-full overflow-visible ${warning && running ? 'head-tilt-timer-heartbeat' : ''}`}>
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="12" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress} transform="rotate(-90 50 50)" className={remaining === HEAD_TILT_QUESTION_SECONDS ? '' : 'head-tilt-timer-ring'} />
          </mask>
        </defs>
        <circle cx="50" cy="50" r="31" className="fill-white/90" />
        <circle cx="50" cy="50" r="38" fill="none" strokeWidth="8" pathLength="120" strokeDasharray="1 1" className="stroke-orange-200" />
        <circle cx="50" cy="50" r="38" fill="none" strokeWidth="8" pathLength="120" strokeDasharray="1 1" transform="rotate(-90 50 50)" mask={`url(#${maskId})`} className={`${warning ? 'stroke-rose-500' : 'stroke-orange-500'} ${remaining === 0 ? 'opacity-0' : ''}`} />
      </svg>
      <Sparkles className="absolute -right-1 -top-1 size-4 fill-amber-300 text-orange-600 sm:size-5" aria-hidden="true" />
      <span className={`relative flex flex-col items-center gap-0.5 ${warning ? 'text-rose-950' : 'text-orange-950'}`} aria-hidden="true">
        <span className="text-2xl font-black leading-none tabular-nums sm:text-3xl">{remaining}</span>
        <span className="text-[10px] font-bold leading-none">giây</span>
      </span>
    </div>
  );
};
