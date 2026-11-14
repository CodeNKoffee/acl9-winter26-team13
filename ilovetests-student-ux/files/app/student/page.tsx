'use client';
import Link from 'next/link';
import { StudentShell, useInbox, iconFor } from '@/components/student/StudentShell';
import { Icon, KidLink, LukkiBubble, Pill, SectionTitle, Tile, TileLink } from '@/components/student/Kid';
import { LearningPath, Tracker } from '@/components/student/Bits';
import { useStore } from '@/lib/store';

export default function StudentHome() {
  return (
    <StudentShell>
      <HomeBody />
    </StudentShell>
  );
}

function HomeBody() {
  const { s, ready } = useStore();
  const inbox = useInbox();
  const sub = s.submissions['nour-frac'];
  const flag = s.flags.find((f) => f.id === 'f-nour')!;
  const due = sub.status === 'due';
  const released = sub.status === 'released';
  const waiting = !due && !released;
  const practice = flag.state === 'confirmed';
  const resultsNew = s.notifs.some((n) => n.id === 'n-res' && !n.read);
  const notifs = s.notifs.filter((n) => n.to === 'student');
  const preview = [...notifs.filter((n) => !n.read), ...notifs.filter((n) => n.read)].slice(0, 2);
  const total = notifs.length + s.announced.length;

  if (!ready) return <div className="h-[60vh]" aria-busy="true" />;

  return (
    <>
      <section className="pt-1">
        <p className="text-[13px] font-semibold text-muted">Year 4B · Mrs Rasha’s class</p>
        <h1 className="font-display text-[34px] leading-[1.05] mb-4">Hi Nour!</h1>
        {due && <LukkiBubble mood="wave">You have <b>1 thing</b> to hand in. Let’s do it together!</LukkiBubble>}
        {waiting && <LukkiBubble mood="think">Great job handing it in! Mrs Rasha is checking it now.</LukkiBubble>}
        {released && <LukkiBubble mood="cheer">Your Fractions quiz is back. Let’s see what you did well!</LukkiBubble>}
      </section>

      {/* The one thing to do now */}
      <section aria-label="To do" className="mt-5">
        {due && (
          <div className="rise relative overflow-hidden rounded-[28px] bg-navy text-white p-5">
            <span aria-hidden className="absolute -right-10 -top-12 w-40 h-40 rounded-full bg-sky/15" />
            <span aria-hidden className="absolute right-6 top-6 text-sun"><Icon name="star" size={18} filled strokeWidth={1.5} /></span>
            <span aria-hidden className="absolute right-14 top-14 text-sky/70"><Icon name="star" size={12} filled strokeWidth={1.5} /></span>
            <div className="relative">
              <Pill tone="sun"><Icon name="clock" size={14} strokeWidth={2.6} />Due Sunday</Pill>
              <h2 className="font-display text-[26px] leading-tight mt-3">Fractions quiz</h2>
              <p className="text-[14px] text-white/85 mt-1">Maths · 5 questions · 2 pages</p>
              <KidLink href="/student/hand-in/" kind="sky" className="w-full mt-5"><Icon name="camera" />Hand in my work</KidLink>
            </div>
          </div>
        )}

        {waiting && (
          <Tile className="rise p-5">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display text-[20px]">Fractions quiz</h2>
              <Pill tone="sky" className="ml-auto"><Icon name="check" size={14} strokeWidth={3} />Handed in</Pill>
            </div>
            <Tracker status={sub.status} />
          </Tile>
        )}

        {released && (
          <Link href="/student/results/" className="press rise relative block overflow-hidden rounded-[28px] bg-sky text-navy p-5 [--edge:var(--color-sky-edge)]">
            <span aria-hidden className="absolute -right-8 -bottom-10 w-36 h-36 rounded-full bg-white/25" />
            <span aria-hidden className="absolute right-5 top-5 flex gap-1 text-sun drop-shadow-[0_1px_0_rgba(16,44,65,.35)]">
              <Icon name="star" size={20} filled strokeWidth={1.5} /><Icon name="star" size={26} filled strokeWidth={1.5} /><Icon name="star" size={20} filled strokeWidth={1.5} />
            </span>
            <div className="relative">
              {resultsNew ? <Pill tone="navy">New</Pill> : <Pill tone="line" className="bg-white/70">Back from Mrs Rasha</Pill>}
              <h2 className="font-display text-[26px] leading-tight mt-3">Your quiz is back!</h2>
              <p className="text-[15px] mt-1 font-medium">You got lots right. Lukki has tips for you.</p>
              <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[16px] tracking-wide">See my feedback <Icon name="right" size={18} strokeWidth={3} /></span>
            </div>
          </Link>
        )}
      </section>

      {practice && (
        <TileLink href="/student/practice/" className="mt-4 p-4 flex items-center gap-3.5">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-sun text-navy shrink-0"><Icon name="star" size={28} filled strokeWidth={1.6} /></span>
          <span className="flex-1">
            <span className="block text-[12px] font-bold text-muted">Mrs Rasha picked this for you</span>
            <span className="block font-display text-[18px] leading-tight">Practise comparing fractions</span>
            <span className="block text-[13px] text-muted mt-0.5">{s.practiceDone > 0 ? 'Done once. Play again any time!' : '3 quick games · no marks'}</span>
          </span>
          <Icon name="right" className="text-muted shrink-0" />
        </TileLink>
      )}

      {total > 0 && (
        <section aria-labelledby="msgs">
          <SectionTitle id="msgs" action={
            <button type="button" onClick={inbox.open} className="min-h-11 px-1 text-[14px] font-bold underline underline-offset-4">See all {total}</button>
          }>From Mrs Rasha</SectionTitle>
          <ul className="space-y-2.5">
            {preview.map((n) => (
              <li key={n.id}>
                <Link href={n.href} className={`press flex items-center gap-3 rounded-2xl px-3.5 py-3 border-2 [--edge:var(--color-rule-edge)] ${n.read ? 'bg-white border-rule' : 'bg-tint border-sky'}`}>
                  <span className={`grid place-items-center w-10 h-10 shrink-0 rounded-xl ${n.read ? 'bg-ice' : 'bg-white'}`}><Icon name={iconFor(n.href)} size={20} /></span>
                  <span className={`flex-1 text-[15px] leading-snug ${n.read ? '' : 'font-bold'}`}>{n.text}</span>
                  {!n.read && <Pill tone="navy">New</Pill>}
                </Link>
              </li>
            ))}
            {s.announced.slice(-1).map((a) => (
              <li key={a} className="flex items-center gap-3 rounded-2xl px-3.5 py-3 border-2 border-rule bg-white">
                <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-ice"><Icon name="megaphone" size={20} /></span>
                <span className="flex-1 text-[15px] leading-snug"><span className="block text-[12px] font-bold text-muted">Note to the whole class</span>{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="path">
        <SectionTitle id="path">My learning path</SectionTitle>
        <p className="text-[14px] text-muted -mt-1.5 mb-3">The star is what to practise next. Tap it to play. No marks!</p>
        <Tile className="pt-4 pb-6 px-2 bg-[linear-gradient(180deg,#fff_0%,#F8FBFE_100%)]">
          <div className="flex items-center gap-2 mx-2 mb-1 rounded-2xl bg-navy text-white px-4 py-3">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/10 text-sky"><Icon name="target" size={20} /></span>
            <span><span className="block text-[12px] font-semibold text-sky">Year 4 Maths · Term 1</span><span className="block font-display text-[17px] leading-tight">Numbers and fractions</span></span>
          </div>
          <LearningPath gapOpen={!(released && flag.state === 'dismissed')} />
        </Tile>
      </section>
    </>
  );
}
