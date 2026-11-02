import React from 'react';
import { GameMode } from '../types';
import { Star, Mic, FileCode, RotateCcw, Hand, Bot, Camera, Trash2, FolderUp, Shirt, Globe, Sparkles } from 'lucide-react';

interface TopBarProps {
  readOnly?: boolean;
  score: number;
  maxScore: number;
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  onOpenSortingGame: () => void;
  onOpenVoiceStudio: () => void;
  onOpenScratchModal: () => void;
  onOpenOfflineHtmlModal?: () => void;
  onOpenMascotModal: () => void;
  onOpenCostumesModal: () => void;
  onOpenTrashBinModal: () => void;
  onOpenTrashItemsModal: () => void;
  onRestart: () => void;
  hasCustomVoice: boolean;
  customMascotUrl: string | null;
  hasCustomBins: boolean;
  customTrashCount: number;
  totalTrashCount: number;
  customCostumesCount: number;
  totalCostumesCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  readOnly = false,
  score,
  maxScore,
  gameMode,
  onSelectGameMode,
  onOpenSortingGame,
  onOpenVoiceStudio,
  onOpenScratchModal,
  onOpenOfflineHtmlModal,
  onOpenMascotModal,
  onOpenCostumesModal,
  onOpenTrashBinModal,
  onOpenTrashItemsModal,
  onRestart,
  hasCustomVoice,
  customMascotUrl,
  hasCustomBins,
  customTrashCount,
  totalTrashCount,
  customCostumesCount,
  totalCostumesCount,
}) => {
  const avatarSrc = customMascotUrl || './images/kien-sang-main.png';

  return (
    <header className="relative z-40 bg-white/90 backdrop-blur-md border-b-2 border-amber-300 shadow-sm px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
      {/* Brand & Tên game (Click avatar để đổi ảnh Kiến Sáng) */}
      <div className="flex items-center gap-2.5">
        <button
          disabled={readOnly}
          onClick={onOpenMascotModal}
          title="Bấm để tải ảnh kien-sang-main.png của bạn"
          className="relative group w-11 h-11 rounded-2xl bg-amber-100 border-2 border-orange-300 p-0.5 flex items-center justify-center shadow-md overflow-hidden shrink-0 hover:border-orange-500 transition-transform active:scale-95 cursor-pointer"
        >
          <img
            src={avatarSrc}
            alt="Robot Kiến Sáng (kien-sang-main.png)"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Camera className="w-4 h-4" />
          </div>
        </button>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Robot Kiến Sáng
            </h1>
            <button
              hidden={readOnly}
              onClick={onOpenMascotModal}
              title="Đổi ảnh bạn Kiến Sáng chuẩn kien-sang-main.png"
              className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300 transition"
            >
              📷 kien-sang-main.png
            </button>
          </div>
          <p className="text-[11px] font-bold text-orange-600">
            Thử tài Phân loại Rác • Lớp 2A5
          </p>
        </div>
      </div>

      {/* Chọn một trong các màn chơi */}
      <div className="flex flex-wrap items-center justify-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
        <button
          onClick={() => onSelectGameMode('drag')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
            gameMode === 'drag'
              ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Bé chạm và kéo rác vào thùng, hoặc nhấn giữ chuột để kéo"
        >
          <Hand className="w-3.5 h-3.5" />
          <span>Bé tự kéo thả</span>
        </button>

        <button
          onClick={() => onSelectGameMode('command')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition ${
            gameMode === 'command'
              ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Bé chạm hoặc bấm chọn rác rồi chạm hoặc bấm thùng, Kiến Sáng sẽ chạy lại nhặt"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Nhờ Kiến Sáng</span>
        </button>
        <button
          type="button"
          onClick={onOpenSortingGame}
          className="flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black text-emerald-800 transition hover:bg-white hover:text-emerald-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          title="Mở màn chơi mới: Thử tài phân loại rác"
        >
          <Sparkles className="h-4 w-4 text-emerald-700" />
          <span>Thử tài phân loại rác</span>
        </button>
      </div>

      {/* Bộ đếm sao: 10 sao chiến thắng */}
      <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-2xl border-2 border-amber-300 shadow-sm">
        <Star className="w-5 h-5 fill-amber-400 text-amber-500 animate-pulse" />
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-amber-900">Sao:</span>
          <span className="text-base font-black text-amber-600">{score}</span>
          <span className="text-xs font-bold text-amber-800">/ {maxScore}</span>
        </div>
        {/* Progress bar nhỏ */}
        <div className="w-16 h-2 bg-amber-200 rounded-full overflow-hidden hidden sm:block">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${Math.min(100, (score / maxScore) * 100)}%` }}
          />
        </div>
      </div>

      {/* Các nút công cụ: Đổi ảnh k-v-2 + Thu âm giọng bé + Tải file Scratch */}
      <div className={readOnly ? 'hidden' : 'flex items-center gap-2'}>
        <button
          onClick={onOpenCostumesModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition shadow-sm border ${
            customCostumesCount > 0
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
          }`}
          title="Xưởng 12 bước tìm rác & 15 nhóm cầm rác Scratch của Bạn Kiến Sáng"
        >
          <Shirt className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">Trang Phục Bạn Kiến</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              customCostumesCount > 0
                ? 'bg-emerald-200 text-emerald-900'
                : 'bg-amber-200 text-amber-900'
            }`}
          >
            {customCostumesCount > 0 ? `${customCostumesCount}/${totalCostumesCount}` : 'Trang phục'}
          </span>
        </button>

        <button
          onClick={onOpenTrashBinModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition shadow-sm border ${
            hasCustomBins
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-teal-50 text-teal-900 border-teal-300 hover:bg-teal-100'
          }`}
          title="Tải ảnh cho 2 thùng rác (hữu cơ & tái chế)"
        >
          <Trash2 className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">2 Thùng rác</span>
          {hasCustomBins && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
        </button>

        <button
          onClick={onOpenTrashItemsModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition shadow-sm border ${
            customTrashCount > 0
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
          }`}
          title="Tải 16 hình ảnh rác thực tế (8 hữu cơ + 8 vô cơ)"
        >
          <FolderUp className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden sm:inline">Ảnh 16 rác</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              customTrashCount > 0
                ? 'bg-emerald-200 text-emerald-900'
                : 'bg-amber-200 text-amber-900'
            }`}
          >
            {customTrashCount > 0 ? `${customTrashCount}/${totalTrashCount}` : '16'}
          </span>
        </button>

        <button
          onClick={onOpenVoiceStudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition shadow-sm border ${
            hasCustomVoice
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
          }`}
          title="Thu âm chính giọng bé lồng vào nhân vật"
        >
          <Mic className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Giọng bé</span>
          {hasCustomVoice && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
        </button>

        <button
          onClick={onOpenOfflineHtmlModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm transition cursor-pointer"
          title="Xuất game ra 1 tệp HTML duy nhất để chơi offline không cần mạng"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-200" />
          <span className="hidden md:inline">Xuất</span>
          <span>HTML Offline</span>
        </button>

        <button
          onClick={onOpenScratchModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition"
          title="Tải tệp .sb3 để mở trong Scratch Web"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Tải file Scratch (.sb3)</span>
        </button>

        <button
          onClick={onRestart}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="Chơi lại từ đầu"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      {readOnly && <button onClick={onRestart} title="Chơi lại từ đầu"
        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100">
        <RotateCcw className="w-4 h-4" />
      </button>}
    </header>
  );
};
