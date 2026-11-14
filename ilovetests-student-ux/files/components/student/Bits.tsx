'use client';
import Link from 'next/link';
import { gapPath } from '@/lib/data';
import type { Status } from '@/lib/store';
import { Icon } from './Kid';

/* ---------------- Where is my work? (visibility of system status) ---------------- */
export function Tracker({ status }: { status: Status }) {
  const back = status === 'released';
  const steps = [
    { t: 'Handed in', d: 'Fractions quiz · 2 pages', state: 'done' as const },
    { t: back ? 'Checked by Mrs Rasha' : 'Mrs Rasha is checking it', d: back ? 'She checked every answer' : 'She reads every answer first', state: back ? 'done' as const : 'now' as const },
    { t: 'Back to you', d: back ? 'Lukki has tips for you' : 'You will get a message', state: back ? 'done' as const : 'later' as const },
  ];
  return (
    <ol className="relative" aria-label="Where your quiz is">
      {steps.map((x, i) => (
        <li key={x.t} className="relative flex gap-3 pb-4 last:pb-0" aria-current={x.state === 'now' ? 'step' : undefined}>
          {i < steps.length - 1 && <span aria-hidden className={`absolute left-[15px] top-8 bottom-0 w-[3px] rounded-full ${x.state === 'done' ? 'bg-sky' : 'bg-rule'}`} />}
          <span className={`relative z-10 grid place-items-center w-[33px] h-[33px] shrink-0 rounded-full ${x.state === 'done' ? 'bg-sky text-navy' : x.state === 'now' ? 'bg-white ring-[3px] ring-navy' : 'bg-white ring-2 ring-rule'}`}>
            {x.state === 'done' && <Icon name="check" size={18} strokeWidth={3} />}
            {x.state === 'now' && <span className="pulse-dot w-3 h-3 rounded-full bg-navy" />}
          </span>
          <span className="pt-1">
            <span className={`block text-[15px] leading-tight ${x.state === 'later' ? 'font-semibold text-muted' : 'font-bold'}`}>
              {x.t}{x.state === 'done' && <span className="sr-only"> (done)</span>}{x.state === 'now' && <span className="sr-only"> (now)</span>}
            </span>
            <span className="block text-[13px] text-muted mt-0.5">{x.d}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Gap Map as a learning path ---------------- */
const W = 280, STEP = 118, TOP = 70, R = 36;
const OFF = [-60, 30, 70, 30, -60];

export function LearningPath({ gapOpen }: { gapOpen: boolean }) {
  const nodes = gapPath.map((g, i) => {
    const kind = g.state === 'done' ? 'done' : g.state === 'gap' && gapOpen ? 'gap' : 'later';
    return { ...g, kind, x: W / 2 + OFF[i % OFF.length], y: TOP + i * STEP };
  });
  const H = TOP + (nodes.length - 1) * STEP + R + 24;
  const seg = (a: (typeof nodes)[number], b: (typeof nodes)[number]) => `M${a.x} ${a.y} C${a.x} ${a.y + STEP / 2}, ${b.x} ${b.y - STEP / 2}, ${b.x} ${b.y}`;

  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <svg aria-hidden width={W} height={H} className="absolute inset-0">
        {nodes.slice(1).map((b, i) => {
          const a = nodes[i];
          const solid = a.kind === 'done' && b.kind !== 'later';
          return <path key={i} d={seg(a, b)} fill="none" strokeLinecap="round" stroke={solid ? '#6EB9F2' : '#C3D3E2'} strokeWidth={solid ? 8 : 6} strokeDasharray={solid ? undefined : '0.1 14'} />;
        })}
      </svg>
      <ol className="absolute inset-0" aria-label="My learning path">
        {nodes.map((n) => {
          const labelLeft = n.x > W / 2;
          const sub = n.kind === 'done' ? 'Done' : n.kind === 'gap' ? 'Practise next' : 'Coming later';
          const circle = (
            <span className={`press grid place-items-center rounded-full ${n.kind === 'done' ? 'bg-sky text-navy [--edge:var(--color-sky-edge)]' : n.kind === 'gap' ? 'bg-sun text-navy [--edge:#D19A12] ring-[7px] ring-tint' : 'bg-[#E6EEF6] text-muted [--edge:#D3DFEA]'}`}
              style={{ width: R * 2, height: R * 2 }}>
              <Icon name={n.kind === 'done' ? 'check' : n.kind === 'gap' ? 'star' : 'lock'} size={n.kind === 'later' ? 24 : 30} strokeWidth={n.kind === 'done' ? 3.2 : 2.4} filled={n.kind === 'gap'} />
            </span>
          );
          const label = (
            <span className={`absolute top-1/2 -translate-y-1/2 w-[128px] ${labelLeft ? 'right-[calc(100%+12px)] text-right' : 'left-[calc(100%+12px)]'}`}>
              <span className={`block text-[15px] leading-tight ${n.kind === 'later' ? 'font-semibold text-muted' : 'font-extrabold'}`}>{n.topic}</span>
              {n.kind === 'gap'
                ? <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-navy text-white text-[12px] font-bold px-2.5 py-1">Practise next</span>
                : <span className="block text-[12px] font-semibold text-muted mt-0.5">{sub}</span>}
            </span>
          );
          const pos = { left: n.x - R, top: n.y - R, width: R * 2, height: R * 2 };
          return (
            <li key={n.topic} className="absolute" style={pos}>
              {n.kind === 'later'
                ? <span className="relative block" aria-label={`${n.topic}: coming later`}>{circle}{label}</span>
                : <Link href={n.kind === 'gap' ? '/student/practice/' : '/student/progress/'} className="relative block rounded-full" aria-label={`${n.topic}: ${sub}`}>{circle}{label}</Link>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------- Score ring ---------------- */
export function ScoreRing({ got, max, size = 132 }: { got: number; max: number; size?: number }) {
  const sw = 14, r = (size - sw) / 2, c = 2 * Math.PI * r;
  const off = c * (1 - got / max);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E3F0FB" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#4790CD" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} className="ring-draw" style={{ ['--full' as string]: c }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-[40px] leading-none tabular-nums">{got}</div>
          <div className="text-[13px] font-bold text-muted mt-1">out of {max}</div>
        </div>
      </div>
    </div>
  );
}
