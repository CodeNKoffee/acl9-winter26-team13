'use client';
import { useState } from 'react';
import { StudentShell } from '@/components/student/StudentShell';
import { Icon, LukkiBubble, Pill, SectionTitle, Tile } from '@/components/student/Kid';
import { useStore, total, maxOf } from '@/lib/store';
import { nourHistory } from '@/lib/data';

export default function Progress() {
  return (
    <StudentShell title="My progress" kicker="Maths · this year">
      <Body />
    </StudentShell>
  );
}

function Body() {
  const { s } = useStore();
  const sub = s.submissions['nour-frac'];
  const released = sub.status === 'released';
  const rows = nourHistory.map((h) => ({ name: h.exam, date: h.date, pct: h.score }));
  if (released) rows.push({ name: 'Fractions quiz', date: 'Nov', pct: Math.round((total(sub) / maxOf('frac')) * 100) });
  const last = rows.length - 1;
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? last;

  // Skills: words carry the meaning; the meter only repeats it.
  const skills = [
    { name: 'Adding fractions', level: 3, text: 'Always right' },
    { name: 'Times tables', level: released ? 3 : 2, text: released ? 'Right this time' : 'Getting there' },
    { name: 'Simplifying fractions', level: released ? 3 : 2, text: released ? 'Right this time' : 'Getting there' },
    { name: 'Comparing fractions', level: 1, text: 'Your next goal', goal: true },
  ];

  return (
    <div className="space-y-4">
      <LukkiBubble still>Every exam you hand in adds a step to your path.</LukkiBubble>

      <Tile as="section" className="p-4 pt-5" aria-labelledby="chart-title">
        <h2 id="chart-title" className="font-display text-[18px] px-1">My scores</h2>
        <p className="text-[13px] text-muted px-1" aria-live="polite">
          <b className="text-navy">{rows[shown].name}</b> · {rows[shown].date} · {rows[shown].pct}%
        </p>
        <div className="relative mt-4 h-44 pl-8" onMouseLeave={() => setHover(null)}>
          {/* recessive grid */}
          {[100, 50, 0].map((g) => (
            <div key={g} aria-hidden className="absolute left-0 right-0 flex items-center gap-1.5" style={{ bottom: `${g}%`, transform: 'translateY(50%)' }}>
              <span className="w-6 text-right text-[11px] font-semibold text-muted tabular-nums">{g}</span>
              <span className={`flex-1 h-px ${g === 0 ? 'bg-navy/30' : 'bg-rule'}`} />
            </div>
          ))}
          <div className="relative h-full flex items-end gap-[6px] pl-1.5">
            {rows.map((r, i) => (
              <button key={r.name} type="button" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} onClick={() => setHover(i)}
                aria-label={`${r.name}, ${r.date}: ${r.pct}%`}
                className="group relative flex-1 h-full flex items-end justify-center rounded-t-md">
                {i === shown && (
                  <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy text-white text-[12px] font-bold px-2 py-1 tabular-nums" style={{ bottom: `calc(${r.pct}% + 8px)` }}>
                    {r.pct}%
                  </span>
                )}
                <span className={`block w-full max-w-[40px] rounded-t-[4px] transition-colors ${i === last ? 'bg-azure' : i === shown ? 'bg-[#5BAAE8]' : 'bg-sky'}`} style={{ height: `${r.pct}%` }} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-[6px] pl-[38px] mt-2" aria-hidden>
          {rows.map((r, i) => <span key={r.name} className={`flex-1 text-center text-[12px] ${i === last ? 'font-extrabold' : 'font-semibold text-muted'}`}>{r.date}</span>)}
        </div>

        {/* the same numbers as a list (the chart's table view) */}
        <ol className="mt-4 border-t-2 border-ice pt-2">
          {rows.map((r, i) => (
            <li key={r.name} className="flex items-center gap-2 py-2 text-[14px] border-b border-ice last:border-0">
              <span className="w-9 text-[12px] font-semibold text-muted">{r.date}</span>
              <span className={`flex-1 ${i === last ? 'font-bold' : ''}`}>{r.name}</span>
              {i === last && released && <Pill tone="sun">New</Pill>}
              <span className="font-display text-[16px] tabular-nums w-12 text-right">{r.pct}%</span>
            </li>
          ))}
        </ol>
      </Tile>

      <section aria-labelledby="skills">
        <SectionTitle id="skills">Getting stronger</SectionTitle>
        <Tile as="div" className="p-2">
          <ul>
            {skills.map((k) => (
              <li key={k.name} className="flex items-center gap-3 p-3 rounded-2xl">
                <span className={`grid place-items-center w-11 h-11 shrink-0 rounded-2xl ${k.goal ? 'bg-sun' : 'bg-sky'}`}>
                  <Icon name={k.goal ? 'star' : 'check'} size={k.goal ? 22 : 20} filled={k.goal} strokeWidth={k.goal ? 1.6 : 3} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-bold leading-tight">{k.name}</span>
                  <span className="block text-[13px] text-muted">{k.text}</span>
                </span>
                <span className="flex gap-1" role="img" aria-label={`Level ${k.level} of 3`}>
                  {[1, 2, 3].map((l) => <span key={l} className={`w-3 h-6 rounded-full ${l <= k.level ? 'bg-azure' : 'bg-tint'}`} />)}
                </span>
              </li>
            ))}
          </ul>
        </Tile>
      </section>
    </div>
  );
}
