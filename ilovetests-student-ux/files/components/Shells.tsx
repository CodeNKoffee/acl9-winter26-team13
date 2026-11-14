'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useStore } from '@/lib/store';
import { Wordmark } from './ui';
import Lukki from './Lukki';

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);
const I = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  check: 'M4 12l5 5L20 6',
  text: 'M4 6h16M4 12h10M4 18h7',
  users: 'M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6m13 9v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
};

/* ---------------- Teacher: calm desktop, side menu + class tabs ---------------- */
export function TeacherShell({ children, title, actions }: { children: ReactNode; title: string; actions?: ReactNode }) {
  const path = usePathname();
  const { s, d } = useStore();
  const toCheck = Object.values(s.submissions).filter((x) => x.status === 'submitted').length;
  const toGrade = Object.values(s.submissions).filter((x) => x.status === 'checked' || x.status === 'drafted').length;
  const openFlags = s.flags.filter((f) => f.state === 'open').length;
  const items = [
    { href: '/teacher/', label: 'Home', icon: I.home },
    { href: '/teacher/check/', label: 'Check text', icon: I.text, n: toCheck },
    { href: '/teacher/grade/', label: 'Grade', icon: I.check, n: toGrade },
    { href: '/teacher/students/', label: 'Students', icon: I.users, n: openFlags },
    { href: '/teacher/release/', label: 'Release', icon: I.send },
    { href: '/teacher/audit/', label: 'Audit trail', icon: I.list },
  ];
  return (
    <div className="min-h-screen flex bg-ice">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-white border-r border-rule p-4 gap-1 sticky top-0 h-screen">
        <Link href="/" className="mb-6 px-2"><Wordmark size="text-xl" suffix="Teachers" /></Link>
        {items.map((it) => {
          const on = it.href === '/teacher/' ? path === it.href : path.startsWith(it.href);
          return (
            <Link key={it.href} href={it.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${on ? 'bg-tint text-navy' : 'text-muted hover:bg-ice'}`}>
              <Icon d={it.icon} /><span className="flex-1">{it.label}</span>
              {!!it.n && <span className="bg-navy text-white text-[11px] rounded-full px-2">{it.n}</span>}
            </Link>
          );
        })}
        <div className="mt-auto p-3 rounded-xl bg-ice text-xs text-muted">
          <div className="font-semibold text-navy mb-2">Signed in as</div>
          <div role="radiogroup" aria-label="Role" className="grid grid-cols-2 gap-1">
            {(['teacher', 'assistant'] as const).map((r) => (
              <button key={r} role="radio" aria-checked={s.role === r} onClick={() => d({ type: 'role', role: r })}
                className={`rounded-lg py-1.5 font-semibold ${s.role === r ? 'bg-navy text-white' : 'bg-white text-navy border border-rule'}`}>
                {r === 'teacher' ? 'Mrs Rasha' : 'Hatem'}
              </button>
            ))}
          </div>
          <div className="mt-2">{s.role === 'teacher' ? 'Teacher: confirms and releases.' : 'Assistant: prepares drafts; cannot confirm flags or release.'}</div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="bg-white border-b border-rule px-6 py-3 flex items-center gap-6 text-sm">
          <span className="md:hidden"><Wordmark size="text-lg" /></span>
          <span className="rounded-full border border-rule px-3 py-1 font-semibold">Year 4B ▾</span>
          <span className="hidden sm:inline text-muted">Maths · Maadi Narmer School</span>
          <span className="ml-auto text-muted hidden sm:inline">{s.role === 'teacher' ? 'Mrs Rasha ElNahas' : 'Hatem Soliman (assistant)'}</span>
        </div>
        <div className="md:hidden flex gap-2 overflow-x-auto px-4 py-2 bg-white border-b border-rule">
          {items.map((it) => <Link key={it.href} href={it.href} className="text-xs font-semibold whitespace-nowrap px-3 py-1.5 rounded-full bg-ice">{it.label}</Link>)}
        </div>
        <main className="p-6 pb-48 max-w-[1200px]">
          <div className="flex items-center gap-3 mb-5">
            <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
            <div className="ml-auto flex gap-2">{actions}</div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Parent: simple single column ---------------- */
export function ParentShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ice">
      <header className="bg-white border-b border-rule">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link href="/"><Wordmark size="text-xl" suffix="Parents" /></Link>
          <span className="ml-auto text-sm text-muted">Nour’s family</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-5 py-6">{children}</main>
    </div>
  );
}

export function LukkiSays({ children, mood = 'happy' }: { children: ReactNode; mood?: 'happy' | 'cheer' | 'think' | 'wave' }) {
  return (
    <div className="flex items-end gap-3 pop">
      <Lukki size={68} mood={mood} className="shrink-0 bob" />
      <div className="relative bg-white border-2 border-sky rounded-2xl rounded-bl-sm px-4 py-3 text-[15px] leading-snug font-medium">{children}</div>
    </div>
  );
}
