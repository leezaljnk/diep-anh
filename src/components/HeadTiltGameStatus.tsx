import React from 'react';
import { Flag, Leaf, Star } from 'lucide-react';
import { HeadTiltTimer } from './HeadTiltTimer';

interface HeadTiltGameStatusProps {
  roundNumber: number;
  totalRounds: number;
  score: number;
  secondsRemaining: number;
  running: boolean;
}

export const HeadTiltGameStatus: React.FC<HeadTiltGameStatusProps> = ({
  roundNumber, totalRounds, score, secondsRemaining, running,
}) => (
  <section aria-label="Tiến trình chơi" className="flex items-center gap-3 border-t border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-amber-50 px-3 py-2 sm:gap-6 sm:px-6 sm:py-3">
    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-200/60 text-emerald-800 max-sm:hidden" aria-hidden="true">
      <Leaf className="size-7" />
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <h2 className="inline-flex items-center gap-2 text-sm font-black text-emerald-950 sm:text-lg">
          <Flag className="size-4 text-emerald-700 sm:size-5" aria-hidden="true" />
          Câu {roundNumber}/{totalRounds}
        </h2>
        <p className="inline-flex items-center gap-1 text-xs font-bold text-amber-950 sm:gap-2 sm:text-sm">
          <Star className="size-4 fill-amber-300 text-amber-700 sm:size-5" aria-hidden="true" />
          Điểm đúng: {score}
        </p>
      </div>
      <div role="progressbar" aria-label="Hành trình phân loại" aria-valuemin={0} aria-valuemax={totalRounds} aria-valuenow={roundNumber} className="h-2 overflow-hidden rounded-full bg-emerald-100 sm:h-3">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${roundNumber / totalRounds * 100}%` }} />
      </div>
      {secondsRemaining === 0 && <p role="status" className="text-xs font-semibold text-emerald-800">Bé cứ chọn nhé, không cần vội!</p>}
    </div>
    <div className="flex shrink-0 items-center gap-3 pl-1">
      <p className="hidden text-right text-xs font-bold leading-5 text-orange-900 lg:block">Đồng hồ<br />thử thách</p>
      <HeadTiltTimer key={roundNumber} secondsRemaining={secondsRemaining} running={running} />
    </div>
  </section>
);
