import React from 'react';
import { ActiveTrashItem, TrashItemDef } from '../types';
import { YardTrashGraphic } from './YardTrashGraphic';

interface TrashItemViewProps {
  item?: ActiveTrashItem;
  definition: TrashItemDef;
  isSelected?: boolean;
  isDragging?: boolean;
  isPickingUp?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const TrashItemView: React.FC<TrashItemViewProps> = ({
  item,
  definition,
  isSelected = false,
  isDragging = false,
  isPickingUp = false,
  onPointerDown,
  onClick,
  style,
}) => {
  // Render realistic vector icon for trash item
  const renderItemGraphic = () => {
    if (definition.iconType.startsWith('yard_')) {
      return <YardTrashGraphic iconType={definition.iconType} visualVariant={item?.visualVariant} />;
    }

    switch (definition.iconType) {
      case 'banana':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path
              d="M 15 18 Q 30 12 45 28 Q 50 42 32 50 Q 12 45 12 30 Z"
              fill="#FACC15"
              stroke="#CA8A04"
              strokeWidth="2.5"
            />
            <path d="M 45 28 Q 54 35 48 45" stroke="#CA8A04" strokeWidth="2.5" fill="none" />
            <circle cx="15" cy="20" r="3" fill="#854D0E" />
          </svg>
        );
      case 'apple':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <circle cx="30" cy="32" r="18" fill="#EF4444" stroke="#B91C1C" strokeWidth="2.5" />
            <path d="M 38 18 Q 42 30 38 45" fill="#FEF2F2" />
            <circle cx="33" cy="30" r="2" fill="#451A03" />
            <path d="M 30 14 Q 30 8 36 6" stroke="#78350F" strokeWidth="3" fill="none" />
            <path d="M 35 10 Q 42 9 40 15 Z" fill="#22C55E" />
          </svg>
        );
      case 'bread':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path
              d="M 12 42 Q 10 24 30 20 Q 50 20 48 42 Z"
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="2.5"
            />
            <line x1="22" y1="28" x2="26" y2="38" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            <line x1="32" y1="28" x2="36" y2="38" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'leaf':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path
              d="M 15 45 Q 12 20 45 15 Q 48 40 15 45 Z"
              fill="#10B981"
              stroke="#047857"
              strokeWidth="2.5"
            />
            <path d="M 15 45 L 42 18" stroke="#047857" strokeWidth="2" />
            <path d="M 26 34 L 32 30" stroke="#047857" strokeWidth="1.5" />
            <path d="M 32 28 L 38 24" stroke="#047857" strokeWidth="1.5" />
          </svg>
        );
      case 'watermelon':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path d="M 10 25 A 22 22 0 0 0 50 25 Z" fill="#EF4444" stroke="#047857" strokeWidth="4" />
            <circle cx="22" cy="30" r="1.5" fill="#000000" />
            <circle cx="30" cy="34" r="1.5" fill="#000000" />
            <circle cx="38" cy="30" r="1.5" fill="#000000" />
          </svg>
        );
      case 'orange':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="18" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            <circle cx="30" cy="15" r="2" fill="#15803D" />
            <path d="M 30 15 Q 36 12 36 18 Z" fill="#22C55E" />
          </svg>
        );
      case 'milk':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <polygon points="20,16 40,16 43,24 17,24" fill="#60A5FA" />
            <rect x="17" y="24" width="26" height="30" rx="3" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
            <rect x="20" y="32" width="20" height="12" rx="2" fill="#3B82F6" />
            <text x="30" y="41" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
              MILK
            </text>
            <line x1="33" y1="8" x2="31" y2="18" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'bottle':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <rect x="26" y="10" width="8" height="5" rx="1" fill="#0284C7" />
            <rect x="27" y="15" width="6" height="6" fill="#BAE6FD" />
            <rect x="22" y="21" width="16" height="32" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
            <rect x="22" y="32" width="16" height="9" fill="#38BDF8" />
          </svg>
        );
      case 'can':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <ellipse cx="30" cy="16" rx="10" ry="4" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
            <rect x="20" y="16" width="20" height="28" fill="#FB7185" stroke="#BE123C" strokeWidth="2" />
            <ellipse cx="30" cy="44" rx="10" ry="4" fill="#BE123C" />
            <text x="30" y="32" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
              COLA
            </text>
          </svg>
        );
      case 'paper':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <rect x="18" y="12" width="24" height="34" rx="2" fill="#FAF5FF" stroke="#8B5CF6" strokeWidth="2.5" />
            <line x1="22" y1="20" x2="38" y2="20" stroke="#C4B5FD" strokeWidth="2" />
            <line x1="22" y1="26" x2="38" y2="26" stroke="#C4B5FD" strokeWidth="2" />
            <line x1="22" y1="32" x2="32" y2="32" stroke="#C4B5FD" strokeWidth="2" />
          </svg>
        );
      case 'box':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <polygon points="15,22 30,12 45,22 30,32" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
            <polygon points="15,22 30,32 30,48 15,38" fill="#D97706" stroke="#B45309" strokeWidth="2" />
            <polygon points="45,22 30,32 30,48 45,38" fill="#B45309" stroke="#92400E" strokeWidth="2" />
          </svg>
        );
      case 'cup':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <polygon points="18,18 42,18 38,48 22,48" fill="#FCE7F3" stroke="#DB2777" strokeWidth="2.5" />
            <ellipse cx="30" cy="18" rx="12" ry="3" fill="#F472B6" />
            <line x1="32" y1="8" x2="28" y2="38" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'fishbone':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            {/* Xương cá */}
            <line x1="12" y1="30" x2="48" y2="30" stroke="#CBD5E1" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="12,30 20,23 20,37" fill="#94A3B8" />
            <line x1="26" y1="20" x2="30" y2="40" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="34" y1="20" x2="38" y2="40" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="42" y1="22" x2="44" y2="38" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="48,30 54,22 54,38" fill="#64748B" />
          </svg>
        );
      case 'vegetable':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            {/* Rau củ dập héo */}
            <path
              d="M 16 38 Q 12 18 30 14 Q 46 16 44 38 Q 30 46 16 38 Z"
              fill="#86EFAC"
              stroke="#16A34A"
              strokeWidth="2.5"
            />
            <path d="M 30 46 L 30 18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 30 32 Q 40 28 42 22" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
            <path d="M 30 36 Q 20 32 18 26" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'plastic_bag':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            {/* Túi nilon */}
            <path
              d="M 18 24 C 18 14 26 14 26 24 L 26 26 L 34 26 L 34 24 C 34 14 42 14 42 24 L 46 48 C 46 52 42 54 30 54 C 18 54 14 52 14 48 Z"
              fill="#E9D5FF"
              stroke="#9333EA"
              strokeWidth="2.5"
            />
            <line x1="20" y1="36" x2="40" y2="36" stroke="#C084FC" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
        );
      case 'straw':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            {/* Ống hút nhựa */}
            <path
              d="M 16 12 L 26 24 L 44 48"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 17 13 L 26 24 L 43 47"
              fill="none"
              stroke="#EC4899"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'yard_leaf': {
        const leafColors = ['#22C55E', '#84CC16', '#FACC15'];
        const fill = leafColors[(item?.visualVariant ?? 0) % leafColors.length];
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path d="M 12 46 Q 14 17 48 12 Q 48 42 12 46 Z" fill={fill} stroke="#15803D" strokeWidth="2.5" />
            <path d="M 13 46 L 43 17 M 24 36 L 22 26 M 33 28 L 32 20" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
            <circle cx="37" cy="25" r="2" fill="#FEF3C7" />
          </svg>
        );
      }
      case 'yard_twig':
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path d="M 12 47 Q 26 32 47 12 M 26 34 L 21 20 M 34 27 L 46 29" fill="none" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
            <path d="M 26 30 Q 14 25 18 18 Q 27 18 28 28 M 38 24 Q 40 13 48 15 Q 50 23 40 27" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
          </svg>
        );
      case 'yard_flower': {
        const petals = ['#F472B6', '#C084FC', '#FB7185'];
        const petalColor = petals[(item?.visualVariant ?? 0) % petals.length];
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            {[0, 1, 2, 3, 4].map((petal) => {
              const angle = petal * 72;
              return <ellipse key={petal} cx="30" cy="17" rx="7" ry="11" transform={`rotate(${angle} 30 30)`} fill={petalColor} stroke="#BE185D" strokeWidth="1.5" />;
            })}
            <circle cx="30" cy="30" r="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <circle cx="28" cy="29" r="1" fill="#713F12" />
            <circle cx="32" cy="29" r="1" fill="#713F12" />
            <path d="M 27 33 Q 30 36 33 33" fill="none" stroke="#713F12" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      }
      case 'yard_orange_peel': {
        const peelColors = ['#FB923C', '#F97316', '#FBBF24'];
        const peelColor = peelColors[(item?.visualVariant ?? 0) % peelColors.length];
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path d="M 13 35 Q 20 12 40 20 Q 53 29 43 43 Q 28 54 15 43 Z" fill={peelColor} stroke="#C2410C" strokeWidth="2.5" />
            <path d="M 26 18 Q 30 10 37 14 Q 34 20 29 21" fill="#4D7C0F" stroke="#3F6212" strokeWidth="1.5" />
            <circle cx="24" cy="31" r="2" fill="#FED7AA" />
            <circle cx="37" cy="36" r="2" fill="#FED7AA" />
            <circle cx="30" cy="44" r="1.5" fill="#FED7AA" />
          </svg>
        );
      }
      case 'yard_bottle': {
        const bottleColors = ['#38BDF8', '#34D399', '#A78BFA'];
        const bottleColor = bottleColors[(item?.visualVariant ?? 0) % bottleColors.length];
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path d="M 25 9 H 35 V 17 L 40 23 V 48 Q 40 53 35 53 H 25 Q 20 53 20 48 V 23 L 25 17 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
            <path d="M 22 31 H 38 V 46 Q 38 50 34 50 H 26 Q 22 50 22 46 Z" fill={bottleColor} opacity="0.9" />
            <rect x="25" y="7" width="10" height="5" rx="1.5" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
            <path d="M 25 25 Q 28 22 31 25" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      }
      case 'yard_can': {
        const canColors = ['#FB7185', '#60A5FA', '#A3E635'];
        const canColor = canColors[(item?.visualVariant ?? 0) % canColors.length];
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <ellipse cx="30" cy="15" rx="13" ry="5" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <path d="M 17 15 V 44 Q 17 50 30 50 Q 43 50 43 44 V 15" fill={canColor} stroke="#475569" strokeWidth="2.5" />
            <ellipse cx="30" cy="44" rx="13" ry="5" fill={canColor} stroke="#475569" strokeWidth="2" />
            <path d="M 25 27 Q 30 23 35 27 Q 33 35 30 35 Q 27 35 25 27 Z" fill="#FEF3C7" />
            <circle cx="28" cy="29" r="1" fill="#78350F" />
            <circle cx="32" cy="29" r="1" fill="#78350F" />
            <path d="M 28 32 Q 30 34 32 32" fill="none" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );
      }
      case 'yard_wrapper': {
        const wrapperColors = ['#A78BFA', '#F472B6', '#38BDF8'];
        const wrapperColor = wrapperColors[(item?.visualVariant ?? 0) % wrapperColors.length];
        return (
          <svg className="w-12 h-12 drop-shadow-md" viewBox="0 0 60 60">
            <path d="M 14 24 L 21 18 L 39 18 L 46 24 L 41 30 L 47 36 L 40 43 L 20 43 L 13 36 L 19 30 Z" fill={wrapperColor} stroke="#6D28D9" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M 22 23 Q 30 20 38 23 L 36 38 Q 30 41 24 38 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="28" cy="29" r="1.5" fill="#713F12" />
            <circle cx="33" cy="29" r="1.5" fill="#713F12" />
            <path d="M 28 33 Q 30 35 33 33" fill="none" stroke="#713F12" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      }
      default:
        return <div className="text-3xl">🗑️</div>;
    }
  };

  return (
    <div
      role="button"
      data-trash-instance-id={item?.instanceId}
      data-picking-up={isPickingUp || undefined}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onClick={onClick}
      style={{
        ...style,
        transform: `rotate(${item?.rotation ?? 0}deg) ${isSelected ? 'scale(1.22)' : isDragging ? 'scale(1.15)' : 'scale(1)'}`,
        touchAction: 'none',
      }}
      className={`mobile-game-trash-item ${isPickingUp ? 'trash-pickup' : ''} group absolute cursor-grab active:cursor-grabbing select-none flex flex-col items-center justify-center p-1.5 rounded-2xl transition-[transform,filter] duration-200 ${
        isSelected
          ? 'drop-shadow-[0_0_16px_rgba(250,204,21,0.9)] animate-pulse'
          : isDragging
          ? 'drop-shadow-2xl z-50 opacity-95 scale-110'
          : 'hover:scale-110 hover:drop-shadow-xl'
      }`}
    >
      {/* Vòng hào quang phát sáng khi được bé click chọn trong Chế độ 2 */}
      {isSelected && (
        <div className="absolute -inset-2 rounded-full border-2 border-yellow-400 animate-ping pointer-events-none" />
      )}

      {/* Đồ họa rác: Ảnh tùy chỉnh do người dùng tải lên HOẶC icon vector mặc định */}
      <div className="relative flex items-center justify-center min-w-[50px] min-h-[50px]">
        {definition.customImageUrl ? (
          <img
            src={definition.customImageUrl}
            alt={definition.nameVi}
            className="w-14 h-14 object-contain drop-shadow-md pointer-events-none select-none transition-transform group-hover:scale-105"
            onError={(e) => {
              // Fallback to vector graphic if image fails to load
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          renderItemGraphic()
        )}
      </div>

      {/* Nhãn tên rõ ràng cho bé lớp 1 */}
      <div className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/85 text-white text-[11px] font-bold tracking-tight whitespace-nowrap shadow">
        {definition.nameVi}
      </div>

      {/* Nhắc nhở khi đang chọn */}
      {isSelected && (
        <span className="absolute -top-6 bg-yellow-400 text-yellow-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow animate-bounce">
          Đã chọn! Bấm vào thùng ➡️
        </span>
      )}
    </div>
  );
};
