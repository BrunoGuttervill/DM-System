const base = {
  width: 18, height: 18, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
}

export const IconDashboard = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5"/>
    <rect x="14" y="3" width="7" height="5" rx="1.5"/>
    <rect x="14" y="12" width="7" height="9" rx="1.5"/>
    <rect x="3" y="16" width="7" height="5" rx="1.5"/>
  </svg>
)

export const IconBell = (p) => (
  <svg {...base} {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

export const IconWheat = (p) => (
  <svg {...base} {...p}>
    <path d="M12 22V4"/>
    <path d="M8 8c0-2 1.8-4 4-4s4 2 4 4-1.8 3-4 3-4-1-4-3z"/>
    <path d="M8 14c0-2 1.8-4 4-4s4 2 4 4-1.8 3-4 3-4-1-4-3z"/>
    <path d="M9 22h6"/>
  </svg>
)

export const IconBox = (p) => (
  <svg {...base} {...p}>
    <path d="M21 8l-9-5-9 5 9 5 9-5z"/>
    <path d="M3 8v8l9 5 9-5V8"/>
    <path d="M12 13v8"/>
  </svg>
)

export const IconClipboard = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2"/>
    <rect x="9" y="2" width="6" height="4" rx="1"/>
    <path d="M9 12h6M9 16h6"/>
  </svg>
)

export const IconFactory = (p) => (
  <svg {...base} {...p}>
    <path d="M3 21V10l6 4v-4l6 4V7l6 4v10H3z"/>
    <path d="M7 21v-4M12 21v-4M17 21v-4"/>
  </svg>
)

export const IconTruck = (p) => (
  <svg {...base} {...p}>
    <rect x="1" y="7" width="14" height="10" rx="1.5"/>
    <path d="M15 10h4l3 3v4h-7z"/>
    <circle cx="6" cy="19" r="1.8"/>
    <circle cx="17.5" cy="19" r="1.8"/>
  </svg>
)

export const IconTrendingUp = (p) => (
  <svg {...base} {...p}>
    <polyline points="3 17 9 11 13 15 21 6"/>
    <polyline points="14 6 21 6 21 13"/>
  </svg>
)

export const IconSettings = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3.2"/>
    <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2.06 2.06 0 1 1-2.92 2.92l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.6a2.06 2.06 0 1 1-4.12 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2.06 2.06 0 1 1-2.92-2.92l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H2.4a2.06 2.06 0 1 1 0-4.12h.09a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.88l-.06-.06A2.06 2.06 0 1 1 6.56 3.98l.06.06a1.7 1.7 0 0 0 1.87.34h.08a1.7 1.7 0 0 0 1-1.55V2.4a2.06 2.06 0 1 1 4.12 0v.09a1.7 1.7 0 0 0 1 1.55h.09a1.7 1.7 0 0 0 1.87-.34l.06-.06a2.06 2.06 0 1 1 2.92 2.92l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.55 1H21.6a2.06 2.06 0 1 1 0 4.12h-.09a1.7 1.7 0 0 0-1.55 1z"/>
  </svg>
)

export const IconLogout = (p) => (
  <svg {...base} {...p}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
)

export const IconLogo = (p) => (
  <svg {...base} viewBox="0 0 24 24" {...p}>
    <path d="M4 11h16a1 1 0 0 1 1 1c0 5-4 8-9 8s-9-3-9-8a1 1 0 0 1 1-1z"/>
    <path d="M8 11c0-3 1-5 1-7M12 11c0-3.5 1.5-5.5 1.5-8M16 11c0-3 1-5 1-7"/>
  </svg>
)

export const IconAlertTriangle = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3 1 21h22L12 3z"/>
    <line x1="12" y1="9" x2="12" y2="14"/>
    <line x1="12" y1="17.5" x2="12.01" y2="17.5"/>
  </svg>
)

export const IconAlertCircle = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="7.5" x2="12" y2="13"/>
    <line x1="12" y1="16.5" x2="12.01" y2="16.5"/>
  </svg>
)

export const IconClock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

export const IconDollarSign = (p) => (
  <svg {...base} {...p}>
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5.5c0-1.9-2.2-3.5-5-3.5s-5 1.4-5 3.2c0 4.3 10 2 10 6.3 0 1.8-2.2 3.2-5 3.2s-5-1.6-5-3.5"/>
  </svg>
)

export const IconUser = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>
  </svg>
)

export const IconPalette = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.2 4.2 0 0 0 21.5 11c0-5-4.3-9-9.5-9z"/>
    <circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="7.5" cy="7" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="5.5" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="16.5" cy="7.5" r="1.2" fill="currentColor" stroke="none"/>
  </svg>
)

export const IconSun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4.5"/>
    <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/>
  </svg>
)

export const IconMoon = (p) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>
  </svg>
)

export const IconLock = (p) => (
  <svg {...base} {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
  </svg>
)

export const IconKey = (p) => (
  <svg {...base} {...p}>
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2l-9.6 9.6"/>
    <path d="M15.5 7.5l3 3L22 7l-3-3"/>
  </svg>
)

export const IconSmartphone = (p) => (
  <svg {...base} {...p}>
    <rect x="6" y="2" width="12" height="20" rx="2.5"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)

export const IconTrash = (p) => (
  <svg {...base} {...p}>
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

export const IconInfo = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="11" x2="12" y2="16.5"/>
    <line x1="12" y1="7.5" x2="12.01" y2="7.5"/>
  </svg>
)

export const IconEdit = (p) => (
  <svg {...base} {...p}>
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
)

export const IconCheck = (p) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export const IconSearch = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)