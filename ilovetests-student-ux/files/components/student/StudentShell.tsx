'use client';
// Student shell: phone-first, playful. The page scrolls inside the frame, so the
// tab bar is always in reach. The bell opens Nour's messages from Mrs Rasha.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useStore } from '@/lib/store';
import { Wordmark } from '../ui';
import { Icon, Pill, type IconName } from './Kid';

const InboxCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useInbox = () => useContext(InboxCtx);

export function iconFor(href: string): IconName {
  if (href.includes('results')) return 'star';
  if (href.includes('practice')) return 'target';
  return 'paper';
}

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: '/student/', label: 'Home', icon: 'home' },
  { href: '/student/hand-in/', label: 'Hand in', icon: 'camera' },
  { href: '/student/practice/', label: 'Practice', icon: 'star' },
  { href: '/student/progress/', label: 'Progress', icon: 'chart' },
];

export function StudentShell({ children, title, kicker }: { children: ReactNode; title?: string; kicker?: string }) {
  const path = usePathname();
  const { s } = useStore();
  const [inbox, setInbox] = useState(false);
  const bell = useRef<HTMLButtonElement>(null);
  const unread = s.notifs.filter((n) => n.to === 'student' && !n.read).length;
  const flag = s.flags.find((f) => f.id === 'f-nour');
  const practiceNew = flag?.state === 'confirmed' && s.practiceDone === 0;
  const open = useCallback(() => setInbox(true), []);
  const close = useCallback(() => { setInbox(false); bell.current?.focus(); }, []);

  return (
    <InboxCtx.Provider value={{ open }}>
      <div className="kid min-h-dvh flex justify-center md:items-center md:py-8 bg-ice relative">
        {/* the soft sky glow from our report covers, behind the phone on wide screens */}
        <div aria-hidden className="hidden md:block fixed -top-48 -right-40 w-[720px] h-[720px] rounded-full bg-[radial-gradient(circle,#A9D5F8_0%,rgba(169,213,248,0)_66%)]" />
        <div aria-hidden className="hidden md:block fixed -bottom-64 -left-48 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,#D7EAFB_0%,rgba(215,234,251,0)_66%)]" />

        <div className="relative w-full max-w-[430px] h-dvh md:h-[min(880px,calc(100dvh-4rem))] bg-cream md:rounded-[44px] md:border-[3px] md:border-navy md:shadow-[0_40px_80px_-32px_rgba(16,44,65,.45)] flex flex-col overflow-hidden">
          <header className="flex items-center gap-3 px-5 pt-4 pb-2 bg-cream z-10">
            <Link href="/" aria-label="iLoveTests start page" className="rounded-lg"><Wordmark size="text-[22px]" /></Link>
            <span className="ml-auto text-[13px] font-semibold text-muted hidden min-[360px]:inline">Nour · 4B</span>
            <button ref={bell} type="button" onClick={open} aria-haspopup="dialog"
              aria-label={unread ? `Messages, ${unread} new` : 'Messages'}
              className="press relative grid place-items-center w-11 h-11 rounded-2xl bg-white border-2 border-rule [--edge:var(--color-rule-edge)]">
              <Icon name="bell" size={20} />
              {unread > 0 && <span aria-hidden className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-navy text-white text-[12px] font-bold grid place-items-center ring-2 ring-cream">{unread}</span>}
            </button>
          </header>

          <main className="flex-1 overflow-y-auto overscroll-contain px-5 pb-36" id="main">
            {(title || kicker) && (
              <div className="pt-1 pb-3">
                {kicker && <p className="text-[13px] font-semibold text-muted">{kicker}</p>}
                {title && <h1 className="font-display text-[28px] leading-[1.1]">{title}</h1>}
              </div>
            )}
            {children}
          </main>

          <nav aria-label="Student" className="absolute inset-x-0 bottom-0 z-20 bg-white border-t-2 border-rule px-2 pt-1.5 pb-[max(10px,env(safe-area-inset-bottom))] grid grid-cols-4">
            {tabs.map((t) => {
              const on = t.href === '/student/' ? path === t.href || path === '/student' : path.startsWith(t.href.slice(0, -1));
              const dot = t.href === '/student/practice/' && practiceNew && !on;
              return (
                <Link key={t.href} href={t.href} aria-current={on ? 'page' : undefined}
                  className="flex flex-col items-center gap-0.5 py-1 rounded-2xl min-h-[56px]">
                  <span className={`relative grid place-items-center w-14 h-9 rounded-2xl transition-colors ${on ? 'bg-sky text-navy' : 'text-muted'}`}>
                    <Icon name={t.icon} size={22} strokeWidth={on ? 2.5 : 2} />
                    {dot && <span className="absolute top-0.5 right-2.5 w-2.5 h-2.5 rounded-full bg-sun ring-2 ring-white"><span className="sr-only">new practice</span></span>}
                  </span>
                  <span className={`text-[12px] ${on ? 'font-extrabold text-navy' : 'font-semibold text-muted'}`}>{t.label}</span>
                </Link>
              );
            })}
          </nav>

          {inbox && <Inbox onClose={close} />}
        </div>
      </div>
    </InboxCtx.Provider>
  );
}

function Inbox({ onClose }: { onClose: () => void }) {
  const { s } = useStore();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const notifs = s.notifs.filter((n) => n.to === 'student');
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    closeBtn.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && box.current) { // keep focus inside the sheet
        const f = Array.from(box.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button type="button" aria-label="Close messages" tabIndex={-1} onClick={onClose} className="fade absolute inset-0 bg-navy/45 cursor-default" />
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="inbox-title" className="sheet relative bg-cream rounded-t-[32px] max-h-[78%] flex flex-col shadow-[0_-12px_40px_rgba(16,44,65,.25)]">
        <div aria-hidden className="mx-auto mt-2.5 w-12 h-1.5 rounded-full bg-rule" />
        <div className="flex items-center px-5 pt-3 pb-2">
          <h2 id="inbox-title" className="font-display text-[22px]">Messages</h2>
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close messages" className="ml-auto grid place-items-center w-11 h-11 rounded-2xl hover:bg-tint">
            <Icon name="x" />
          </button>
        </div>
        <ul className="overflow-y-auto px-5 pb-8 space-y-2.5">
          {notifs.map((n) => (
            <li key={n.id}>
              <Link href={n.href} onClick={onClose}
                className={`press flex items-center gap-3 rounded-2xl px-3.5 py-3 border-2 [--edge:var(--color-rule-edge)] ${n.read ? 'bg-white border-rule' : 'bg-tint border-sky'}`}>
                <span className={`grid place-items-center w-11 h-11 shrink-0 rounded-xl ${n.read ? 'bg-ice' : 'bg-white'}`}><Icon name={iconFor(n.href)} /></span>
                <span className={`flex-1 text-[15px] leading-snug ${n.read ? '' : 'font-bold'}`}>{n.text}</span>
                {!n.read && <Pill tone="navy">New</Pill>}
                <Icon name="right" size={18} className="shrink-0 text-muted" />
              </Link>
            </li>
          ))}
          {s.announced.map((a) => (
            <li key={a} className="flex items-center gap-3 rounded-2xl px-3.5 py-3 border-2 border-rule bg-white">
              <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-ice"><Icon name="megaphone" /></span>
              <span className="flex-1 text-[15px] leading-snug"><span className="block text-[12px] font-bold text-muted">Note to the whole class</span>{a}</span>
            </li>
          ))}
          {notifs.length === 0 && s.announced.length === 0 && <li className="text-center text-muted py-6">No messages yet.</li>}
        </ul>
      </div>
    </div>
  );
}
