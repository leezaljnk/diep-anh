import React from 'react';

interface ClassroomBackgroundProps {
  onVisitYard: () => void;
  onVisitGarden: () => void;
}

export const ClassroomBackground: React.FC<ClassroomBackgroundProps> = ({ onVisitYard, onVisitGarden }) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Tường lớp học lớp 1 - màu vàng kem ấm áp */}
      <div className="absolute inset-x-0 top-0 h-[65%] bg-gradient-to-b from-[#FEF9C3] via-[#FEF08A]/70 to-[#FDE047]/40 border-b-8 border-[#94A3B8]">
        {/* Hàng gạch viền ốp chân tường màu ngọc bích nhạt */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 border-t border-emerald-300 opacity-80" />
      </div>

      {/* Sàn lớp học - gạch men sạch sáng bóng */}
      <div data-trash-play-area className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-b from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8]">
        {/* Kẻ ô gạch hoa lớp học */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Cửa sổ lớp học bên góc trái */}
      <div className="classroom-window absolute top-6 left-6 hidden md:block w-36 h-48 bg-sky-100 rounded-t-full border-4 border-amber-800 shadow-md overflow-hidden opacity-90">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col justify-end items-center pb-2">
          {/* Cành phượng đỏ mùa hè ngoài sân trường */}
          <div className="text-2xl animate-pulse">🌿🌸</div>
          <span className="text-[10px] font-bold text-sky-800 bg-white/70 px-1 rounded mt-1">Sân trường</span>
        </div>
        <button
          type="button"
          aria-label="Đi ra sân trường"
          title="Bấm để ra sân trường"
          onClick={onVisitYard}
          className="pointer-events-auto absolute inset-0 z-10 cursor-pointer rounded-t-full bg-transparent focus-visible:outline focus-visible:outline-4 focus-visible:outline-yellow-400"
        />
        {/* Khung ô cửa sổ */}
        <div className="pointer-events-none absolute inset-0 z-20 border-r-2 border-b-2 border-amber-800" style={{ left: '50%', top: '50%' }} />
      </div>

      {/* Cửa sổ bên phải */}
      <div className="classroom-window absolute top-6 right-6 hidden md:block w-36 h-48 bg-sky-100 rounded-t-full border-4 border-amber-800 shadow-md overflow-hidden opacity-90">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-amber-50 flex flex-col justify-end items-center pb-2">
          <div className="text-2xl">☀️🌳</div>
          <span className="text-[10px] font-bold text-sky-800 bg-white/70 px-1 rounded mt-1">Nắng ấm</span>
        </div>
        <button
          type="button"
          aria-label="Đến khu vườn Nắng Ấm"
          title="Bấm để cùng Kiến Sáng dọn rác trong khu vườn"
          onClick={onVisitGarden}
          className="pointer-events-auto absolute inset-0 z-10 cursor-pointer rounded-t-full bg-transparent focus-visible:outline focus-visible:outline-4 focus-visible:outline-yellow-400"
        />
      </div>

      <div className="absolute right-3 top-3 z-30 md:hidden">
        <button
          type="button"
          onClick={onVisitGarden}
          className="pointer-events-auto rounded-full border-2 border-amber-700 bg-white/95 px-3 py-2 text-xs font-black text-amber-900 shadow-lg"
        >
          ☀️ Khu vườn
        </button>
      </div>

      {/* KHUNG BẢNG ĐEN LỚP HỌC Ở GIỮA */}
      <div
        role="region"
        aria-label="Hướng dẫn chơi trên bảng phấn"
        tabIndex={0}
        data-trash-blocker
        className="mobile-classroom-board absolute top-3 left-1/2 -translate-x-1/2 w-[94%] max-w-4xl h-[52%] max-h-72 bg-[#1E293B] rounded-2xl border-[10px] border-[#78350F] shadow-2xl overflow-y-auto pointer-events-auto flex flex-col"
      >
        {/* Khung ảnh Bác Hồ & Quốc kỳ ở đỉnh giữa bảng */}
        <div className="relative shrink-0 pt-1 flex items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 bg-red-700/90 px-3 py-0.5 rounded border border-amber-400 shadow-sm">
            <span className="text-xs">⭐</span>
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wide">
              Đời Đời Nhớ Ơn Bác Hồ Vĩ Đại
            </span>
            <span className="text-xs">⭐</span>
          </div>
        </div>

        {/* Nội dung trên bảng phấn lớp 1 */}
        <div className="flex-1 shrink-0 px-4 py-1 text-center flex flex-col justify-between gap-1.5">
          <div>
            <h2 className="text-emerald-300 font-bold tracking-wider text-base sm:text-lg drop-shadow">
              LỚP 2A5 FPT SCHOOL • GIỮ GÌN VỆ SINH LỚP HỌC SẠCH ĐẸP
            </h2>
            <p className="text-amber-200 text-xs sm:text-sm font-semibold italic mt-0.5">
              "Tuổi nhỏ làm việc nhỏ – Tùy theo sức của mình"
            </p>
          </div>

          {/* Dòng chữ phấn phân loại rác hướng dẫn bé */}
          <div className="grid grid-cols-2 gap-2 text-left bg-slate-800/70 p-1.5 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="text-base sm:text-lg">🍃</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-300 leading-tight">Thùng Xanh Lá</p>
                <p className="text-[10px] sm:text-xs text-slate-300">Rác thức ăn, hoa quả, cây cỏ</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <span className="text-base sm:text-lg">♻️</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-orange-300 leading-tight">Thùng Cam / Xanh Dương</p>
                <p className="text-[10px] sm:text-xs text-slate-300">Hộp sữa, chai nhựa, lon, giấy</p>
              </div>
            </div>
            <p className="col-span-2 border-t border-slate-600 pt-1 text-[10px] sm:text-xs leading-snug text-amber-100">
              <span className="font-bold text-amber-200">Cách chơi: </span>
              Chạm kéo rác vào thùng hoặc chọn rác rồi chọn thùng để nhờ Kiến Sáng.
              <br />
              <span className="font-bold text-amber-200">Điện thoại: </span>
              Ở chế độ Nhờ Kiến Sáng, dùng các nút mũi tên và nút ✋ để nhặt / thả rác.
              <br />
              <span className="font-bold text-amber-200">Bàn phím: </span>
              Giữ phím mũi tên ⬆️⬇️➡️⬅️️ để di chuyển; Space / Enter để nhặt hoặc thả rác.
            </p>
          </div>

          {/* Khay đựng phấn và khăn lau bảng dưới mép bảng */}
          <div className="flex justify-between items-center px-4 text-xs text-slate-400 border-t border-slate-700/80 pt-0.5">
            <span className="text-[11px] text-yellow-200 font-medium">🖍️ Diệp Anh - Hải Quân - Phúc Hưng</span>
            <span className="text-[11px] text-cyan-200 font-medium">Bé ơi hãy giúp bạn Kiến Sáng nhé! 🤖</span>
          </div>
        </div>
      </div>

      {/* Dãy bàn ghế học sinh tiểu học gợi cảm giác lớp học */}
      <div className="mobile-classroom-desks absolute bottom-[28%] left-1/2 -translate-x-1/2 w-[85%] max-w-3xl flex justify-around opacity-60">
        <div data-trash-blocker className="w-28 h-8 bg-amber-700 rounded-md border-2 border-amber-900 shadow-sm" />
        <div data-trash-blocker className="w-28 h-8 bg-amber-700 rounded-md border-2 border-amber-900 shadow-sm hidden sm:block" />
        <div data-trash-blocker className="w-28 h-8 bg-amber-700 rounded-md border-2 border-amber-900 shadow-sm" />
      </div>
    </div>
  );
};
