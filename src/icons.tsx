// Iconos propios en SVG (trazo, sin relleno) en vez de emoji — mismo grid
// 24x24, mismo grosor de trazo, para que se vean como un set coherente.
type IconProps = { size?: number }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconArrowLeft({ size = 16 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} strokeWidth={2}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

export function IconArrowUpRight({ size = 18 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} strokeWidth={1.8}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )
}

export function IconPlus({ size = 16 }: IconProps) {
  return (
    <svg {...base} width={size} height={size} strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconTrash({ size = 16 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </svg>
  )
}

export function IconCalendar({ size = 14 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  )
}

export function IconGauge({ size = 14 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l3-4" />
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconPin({ size = 14 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

export function IconCar({ size = 24 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M3 13l1.4-4.4A2 2 0 0 1 6.3 7h11.4a2 2 0 0 1 1.9 1.6L21 13" />
      <path d="M2.5 13h19v3.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16H5.5v.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V13z" />
      <circle cx="7" cy="17" r="1.5" />
      <circle cx="17" cy="17" r="1.5" />
    </svg>
  )
}

export function IconRunner({ size = 24 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="14.5" cy="4.2" r="1.7" fill="currentColor" stroke="none" />
      <path d="M11 8.2l3 1.8 1 4.4 3.2 2.3" />
      <path d="M8.6 21l2-5.4-1.7-3.2" />
      <path d="M5.8 13.4l3-2 2.2 1.6" />
    </svg>
  )
}

export function IconMountain({ size = 24 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M2 19h20L15 6l-4 6-2-2z" />
    </svg>
  )
}

export function IconGear({ size = 21 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  )
}

export function IconOilDrop({ size = 21 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z" />
    </svg>
  )
}

export function IconClipboardCheck({ size = 21 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 13l2 2 4-4" />
    </svg>
  )
}

export function IconWrench({ size = 21 }: IconProps) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z" />
    </svg>
  )
}
