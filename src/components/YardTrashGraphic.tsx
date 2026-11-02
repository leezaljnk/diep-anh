import React from 'react';

interface YardTrashGraphicProps {
  iconType: string;
  visualVariant?: number;
  className?: string;
}

const VARIANT_COLORS: Record<string, string[]> = {
  yard_flower_petals: ['#F472B6', '#C084FC', '#FB7185'],
  yard_grass: ['#22C55E', '#84CC16', '#16A34A'],
  yard_plastic_cup: ['#38BDF8', '#34D399', '#A78BFA'],
  yard_plastic_lid: ['#A78BFA', '#FB7185', '#38BDF8'],
  yard_plastic_spoon: ['#F472B6', '#60A5FA', '#FACC15'],
  yard_food_container: ['#34D399', '#60A5FA', '#FB7185'],
};

export const YardTrashGraphic: React.FC<YardTrashGraphicProps> = ({
  iconType,
  visualVariant = 0,
  className = 'w-12 h-12',
}) => {
  const colors = VARIANT_COLORS[iconType];
  const color = colors ? colors[visualVariant % colors.length] : '#22C55E';

  switch (iconType) {
    case 'yard_flower_petals':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((petal) => (
            <ellipse key={petal} cx="30" cy="17" rx="7" ry="11" transform={`rotate(${petal * 72} 30 30)`} fill={color} stroke="#BE185D" strokeWidth="1.5" />
          ))}
          <circle cx="30" cy="30" r="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <circle cx="28" cy="29" r="1" fill="#713F12" />
          <circle cx="32" cy="29" r="1" fill="#713F12" />
          <path d="M 27 33 Q 30 36 33 33" fill="none" stroke="#713F12" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'yard_twig':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M 12 47 Q 26 32 47 12 M 26 34 L 21 20 M 34 27 L 46 29" fill="none" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
          <path d="M 26 30 Q 14 25 18 18 Q 27 18 28 28 M 38 24 Q 40 13 48 15 Q 50 23 40 27" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
        </svg>
      );
    case 'yard_grass':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M 10 47 Q 15 29 20 43 Q 20 22 27 42 Q 31 18 35 42 Q 43 25 42 44 Q 51 32 49 48 Z" fill={color} stroke="#15803D" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 14 48 Q 30 44 47 48" fill="none" stroke="#854D0E" strokeWidth="3" strokeLinecap="round" />
          <circle cx="19" cy="39" r="1.5" fill="#FEF3C7" />
          <circle cx="38" cy="37" r="1.5" fill="#FEF3C7" />
        </svg>
      );
    case 'yard_pine_cone':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M 30 9 Q 45 18 45 39 Q 42 52 30 54 Q 18 52 15 39 Q 15 18 30 9 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <path d="M 21 20 Q 30 25 39 20 M 17 30 Q 30 36 43 30 M 17 40 Q 30 46 43 40 M 24 49 Q 30 52 36 49" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
          <path d="M 30 10 L 30 49" fill="none" stroke="#92400E" strokeWidth="2" />
        </svg>
      );
    case 'yard_acorn':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M 30 18 Q 47 20 44 38 Q 41 51 30 53 Q 19 51 16 38 Q 13 20 30 18 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
          <path d="M 15 25 Q 30 10 45 25 L 42 32 Q 30 26 18 32 Z" fill="#92400E" stroke="#78350F" strokeWidth="2" />
          <path d="M 30 18 Q 29 12 35 9" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="26" cy="37" r="2" fill="#FDE68A" />
          <circle cx="34" cy="37" r="2" fill="#FDE68A" />
          <path d="M 26 43 Q 30 46 34 43" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'yard_plastic_cup':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M 16 16 H 44 L 39 50 Q 30 55 21 50 Z" fill="#E0F2FE" stroke="#0369A1" strokeWidth="2.5" />
          <path d="M 19 31 H 41 L 39 48 Q 30 52 22 48 Z" fill={color} opacity="0.9" />
          <ellipse cx="30" cy="16" rx="14" ry="4" fill="#BAE6FD" stroke="#0369A1" strokeWidth="2" />
          <circle cx="27" cy="27" r="1.5" fill="#0C4A6E" />
          <circle cx="33" cy="27" r="1.5" fill="#0C4A6E" />
          <path d="M 27 30 Q 30 33 33 30" fill="none" stroke="#0C4A6E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'yard_plastic_lid':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <ellipse cx="30" cy="34" rx="23" ry="13" fill={color} stroke="#6D28D9" strokeWidth="2.5" />
          <ellipse cx="30" cy="30" rx="23" ry="13" fill="#EDE9FE" stroke="#6D28D9" strokeWidth="2.5" />
          <ellipse cx="30" cy="30" rx="15" ry="7" fill={color} opacity="0.85" />
          <circle cx="27" cy="29" r="1.5" fill="#4C1D95" />
          <circle cx="33" cy="29" r="1.5" fill="#4C1D95" />
          <path d="M 27 33 Q 30 36 33 33" fill="none" stroke="#4C1D95" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'yard_plastic_spoon':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M 28 31 L 31 52 Q 32 56 35 53 L 39 31 Q 51 25 46 15 Q 42 6 34 10 Q 24 5 18 14 Q 12 25 28 31 Z" fill={color} stroke="#BE185D" strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="33" cy="18" rx="7" ry="9" fill="#FDF2F8" opacity="0.75" />
          <circle cx="29" cy="19" r="1.5" fill="#831843" />
          <circle cx="36" cy="19" r="1.5" fill="#831843" />
          <path d="M 30 24 Q 33 27 36 24" fill="none" stroke="#831843" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'yard_broken_ruler':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M 12 20 H 35 L 31 27 L 39 34 L 34 41 H 12 Z" fill="#FDE047" stroke="#A16207" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 39 34 L 45 27 L 52 33 V 41 H 34 Z" fill="#FDE047" stroke="#A16207" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 17 23 V 29 M 22 23 V 27 M 27 23 V 29 M 32 23 V 27 M 39 36 V 40 M 44 35 V 40 M 49 35 V 40" stroke="#854D0E" strokeWidth="1.5" />
          <circle cx="22" cy="34" r="1.5" fill="#713F12" />
          <circle cx="28" cy="34" r="1.5" fill="#713F12" />
          <path d="M 22 38 Q 25 41 28 38" fill="none" stroke="#713F12" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'yard_food_container':
      return (
        <svg className={`${className} drop-shadow-md`} viewBox="0 0 60 60" aria-hidden="true">
          <path d="M 12 25 Q 12 21 17 21 H 43 Q 48 21 48 25 L 44 47 Q 43 51 39 51 H 21 Q 17 51 16 47 Z" fill={color} stroke="#047857" strokeWidth="2.5" />
          <path d="M 10 20 Q 10 15 16 15 H 44 Q 50 15 50 20 V 24 H 10 Z" fill="#D1FAE5" stroke="#047857" strokeWidth="2.5" />
          <path d="M 20 32 Q 25 27 30 32 Q 35 27 40 32 Q 39 41 30 43 Q 21 41 20 32 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          <circle cx="27" cy="34" r="1" fill="#713F12" />
          <circle cx="33" cy="34" r="1" fill="#713F12" />
          <path d="M 27 38 Q 30 40 33 38" fill="none" stroke="#713F12" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return <span className="text-3xl">🗑️</span>;
  }
};
