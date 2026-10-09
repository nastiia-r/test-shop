import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props: IconProps) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const CloseIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export const HeartIcon = ({ filled, ...props }: IconProps & { filled?: boolean }) => (
  <Svg {...props} fill={filled ? 'currentColor' : 'none'}>
    <path d="M19.5 12.6 12 20l-7.5-7.4A4.8 4.8 0 0 1 12 6.3a4.8 4.8 0 0 1 7.5 6.3Z" />
  </Svg>
);

export const DownloadIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 20h14" />
  </Svg>
);

export const ChevronLeftIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);

export const ChevronRightIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);

export const MapPinIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Svg>
);

export const CalendarIcon = (props: IconProps) => (
  <Svg {...props}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M16 3v4M8 3v4M4 10h16" />
  </Svg>
);

export const CameraIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
);

export const ShieldIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const ExternalIcon = (props: IconProps) => (
  <Svg {...props}>
    <path d="M14 5h5v5M19 5l-8 8M18 14v5H5V6h5" />
  </Svg>
);

export const GridComfortIcon = (props: IconProps) => (
  <Svg {...props} strokeWidth={1.8}>
    <rect x="3" y="3" width="5" height="11" rx="1" />
    <rect x="10" y="3" width="5" height="7" rx="1" />
    <rect x="17" y="3" width="4" height="13" rx="1" />
    <rect x="3" y="16" width="5" height="5" rx="1" />
    <rect x="10" y="12" width="5" height="9" rx="1" />
  </Svg>
);

export const GridDenseIcon = (props: IconProps) => (
  <Svg {...props} strokeWidth={1.6}>
    <path d="M3 3h2.4v8H3zM7.2 3h2.4v5H7.2zM11.4 3h2.4v9h-2.4zM15.6 3H18v6h-2.4zM19.8 3H21v10h-1.2z" />
    <path d="M3 13h2.4v8H3zM7.2 10h2.4v11H7.2zM11.4 14h2.4v7h-2.4zM15.6 11H18v10h-2.4z" />
  </Svg>
);

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="#111" />
      <path d="M9 23V9h7.5a4.5 4.5 0 0 1 0 9H13" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="21.5" cy="22" r="2" fill="#fff" />
    </svg>
  );
}
