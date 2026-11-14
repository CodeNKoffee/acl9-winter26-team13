// Building blocks for the student portal ("Duolingo for the kid").
// One button family, one tile family, one chip family. Colour rules from Phase 1:
// navy carries text; sky and azure only fill behind navy text or decorate; sun is
// for stars and celebration only; no red anywhere.
import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Lukki from '../Lukki';

/* ---------------- Icons (24px, 2px stroke, round) ---------------- */
const P: Record<string, string> = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  camera: 'M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  chart: 'M4 20V11m6 9V5m6 15v-6m4 6H2',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  x: 'M6 6l12 12M18 6L6 18',
  right: 'M9 5l7 7-7 7',
  down: 'M5 9l7 7 7-7',
  left: 'M15 5l-7 7 7 7',
  lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5h.01',
  paper: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
  retry: 'M4 4v6h6M20 20v-6h-6M5.6 15a7 7 0 0 0 12.3 2.4M18.4 9A7 7 0 0 0 6.1 6.6',
  megaphone: 'M3 10v4h3l7 5V5L6 10zM17 9a4 4 0 0 1 0 6',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  pencil: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  circle: 'M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14',
};
export type IconName = keyof typeof P;
export function Icon({ name, size = 22, filled = false, className = '', strokeWidth = 2.2 }: { name: IconName; size?: number; filled?: boolean; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d={P[name]} /></svg>
  );
}

/* ---------------- Buttons ---------------- */
type Kind = 'navy' | 'sky' | 'white' | 'sun';
const KIND: Record<Kind, string> = {
  navy: 'bg-navy text-white [--edge:var(--color-edge)]',
  sky: 'bg-sky text-navy [--edge:var(--color-sky-edge)]',
  white: 'bg-white text-navy border-2 border-rule [--edge:var(--color-rule-edge)]',
  sun: 'bg-sun text-navy [--edge:#D19A12]',
};
const SIZE = {
  lg: 'min-h-14 px-6 text-[17px] rounded-2xl gap-2.5',
  md: 'min-h-12 px-5 text-[15px] rounded-2xl gap-2',
};
const base = 'press inline-flex items-center justify-center font-display tracking-wide select-none disabled:bg-[#E6EEF6] disabled:text-muted disabled:[--edge:#D3DFEA] disabled:cursor-not-allowed';

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { kind?: Kind; size?: keyof typeof SIZE };
export function KidButton({ kind = 'navy', size = 'lg', className = '', ...p }: BtnProps) {
  return <button {...p} className={`${base} ${KIND[kind]} ${SIZE[size]} ${className}`} />;
}
export function KidLink({ href, kind = 'navy', size = 'lg', className = '', children, ...rest }: { href: string; kind?: Kind; size?: keyof typeof SIZE; className?: string; children: ReactNode; 'aria-label'?: string }) {
  return <Link href={href} {...rest} className={`${base} ${KIND[kind]} ${SIZE[size]} ${className}`}>{children}</Link>;
}

/* ---------------- Tiles ---------------- */
// Static tiles are flat; tiles you can tap get the pressable edge (a signifier).
export function Tile({ children, className = '', as: As = 'div', ...rest }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' | 'li'; 'aria-labelledby'?: string }) {
  return <As {...rest} className={`bg-white rounded-3xl border-2 border-rule ${className}`}>{children}</As>;
}
export function TileLink({ href, children, className = '', ...rest }: { href: string; children: ReactNode; className?: string; 'aria-label'?: string }) {
  return <Link href={href} {...rest} className={`press block bg-white rounded-3xl border-2 border-rule [--edge:var(--color-rule-edge)] ${className}`}>{children}</Link>;
}

/* ---------------- Chips and labels ---------------- */
type ChipTone = 'sky' | 'line' | 'sun' | 'navy' | 'tint';
const CHIP: Record<ChipTone, string> = {
  sky: 'bg-sky text-navy',
  line: 'bg-white text-navy ring-2 ring-inset ring-navy/20',
  sun: 'bg-sun text-navy',
  navy: 'bg-navy text-white',
  tint: 'bg-tint text-navy',
};
export function Pill({ children, tone = 'tint', className = '' }: { children: ReactNode; tone?: ChipTone; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold leading-none whitespace-nowrap ${CHIP[tone]} ${className}`}>{children}</span>;
}
export function SectionTitle({ children, id, action }: { children: ReactNode; id?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end gap-2 mb-2.5 mt-7">
      <h2 id={id} className="font-display text-[19px] leading-tight">{children}</h2>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}

/* ---------------- Progress ---------------- */
export function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-4 rounded-full bg-tint overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="relative h-full rounded-full bg-azure transition-[width] duration-500" style={{ width: `${pct}%`, minWidth: pct > 0 ? 16 : 0 }}>
        <div className="absolute left-2 right-2 top-[3px] h-[4px] rounded-full bg-white/35" />
      </div>
    </div>
  );
}

/* ---------------- Lukki speaks ---------------- */
type Mood = 'happy' | 'cheer' | 'think' | 'wave';
export function LukkiBubble({ children, mood = 'happy', size = 72, still = false }: { children: ReactNode; mood?: Mood; size?: number; still?: boolean }) {
  return (
    <div className="flex items-end gap-2.5 rise">
      <Lukki size={size} mood={mood} className={`shrink-0 ${still ? '' : 'bob'}`} />
      <div className="relative flex-1 bg-white border-2 border-rule rounded-[22px] px-4 py-3 text-[16px] leading-snug font-medium mb-2">
        {/* tail */}
        <span aria-hidden className="absolute -left-[9px] bottom-4 w-4 h-4 bg-white border-l-2 border-b-2 border-rule rotate-45 rounded-bl-[4px]" />
        <span className="relative">{children}</span>
      </div>
    </div>
  );
}

/* ---------------- Celebration stars (decorative) ---------------- */
export function StarBurst() {
  const pts = [[-110, -60], [-70, -110], [0, -130], [70, -110], [110, -60], [-120, 10], [120, 10], [-60, 50], [60, 50]];
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {pts.map(([x, y], i) => (
        <span key={i} className="burst absolute text-sun" style={{ ['--x' as string]: `${x}px`, ['--y' as string]: `${y}px`, animationDelay: `${i * 40}ms` }}>
          <Icon name="star" size={i % 3 === 0 ? 22 : 16} filled strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}
