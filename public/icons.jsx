// Minimal line icons (Lucide-style). Kept thin & understated.
const Icon = ({ d, children, size = 16, ...p }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {d ? <path d={d} /> : children}
  </svg>
);

const IHome   = (p) => <Icon {...p}><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></Icon>;
const IPlay   = (p) => <Icon {...p}><path d="M6 4l14 8-14 8z"/></Icon>;
const IChart  = (p) => <Icon {...p}><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></Icon>;
const IBook   = (p) => <Icon {...p}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></Icon>;
const IFire   = (p) => <Icon {...p}><path d="M12 3s4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-3s-1 5 2 5 0-6 1-10z"/></Icon>;
const ISettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.4l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.6 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>;
const IInbox  = (p) => <Icon {...p}><path d="M3 13h5l2 3h4l2-3h5"/><path d="M5 3h14l2 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z"/></Icon>;
const IUsers  = (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></Icon>;
const IPlus   = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IArrow  = (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Icon>;
const ISearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>;
const IBell   = (p) => <Icon {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></Icon>;
const IEdit   = (p) => <Icon {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></Icon>;
const ITrash  = (p) => <Icon {...p}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></Icon>;
const ICheck  = (p) => <Icon {...p}><path d="M5 12l5 5L20 7"/></Icon>;
const IX      = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>;
const IChevR  = (p) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>;
const IChevD  = (p) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>;
const IFilter = (p) => <Icon {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></Icon>;
const IFlag   = (p) => <Icon {...p}><path d="M4 22V4"/><path d="M4 4h14l-2 4 2 4H4"/></Icon>;
const ISpark  = (p) => <Icon {...p}><path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5z"/><path d="M19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z"/></Icon>;
const IClock  = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IMore   = (p) => <Icon {...p}><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></Icon>;

Object.assign(window, {
  IHome, IPlay, IChart, IBook, IFire, ISettings, IInbox, IUsers,
  IPlus, IArrow, ISearch, IBell, IEdit, ITrash, ICheck, IX, IChevR, IChevD,
  IFilter, IFlag, ISpark, IClock, IMore
});
