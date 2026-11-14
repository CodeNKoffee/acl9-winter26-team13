'use client';
import { useEffect, useState } from 'react';
import { StudentShell } from '@/components/student/StudentShell';
import { Icon, KidLink, LukkiBubble, Pill, SectionTitle, Tile } from '@/components/student/Kid';
import { ScoreRing, Tracker } from '@/components/student/Bits';
import { useStore, total, maxOf } from '@/lib/store';
import { exams } from '@/lib/data';

export default function Results() {
  return (
    <StudentShell>
      <ResultsBody />
    </StudentShell>
  );
}

function ResultsBody() {
  const { s, d, ready } = useStore();
  const sub = s.submissions['nour-frac'];
  const released = sub.status === 'released';
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => { if (ready && released) d({ type: 'read', to: 'student' }); }, [ready, released, d]);
  const flag = s.flags.find((f) => f.id === 'f-nour')!;
  const exam = exams.frac;

  if (!ready) return <div className="h-[60vh]" aria-busy="true" />;

  if (!released) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-[28px] leading-tight">My results</h1>
        <LukkiBubble mood="think">Your Fractions quiz isn’t back yet. Mrs Rasha checks every answer before you see it.</LukkiBubble>
        {sub.status !== 'due' && <Tile className="p-5"><Tracker status={sub.status} /></Tile>}
        <KidLink href="/student/" kind="white" size="md" className="w-full"><Icon name="home" size={18} />Back home</KidLink>
      </div>
    );
  }

  const rows = sub.answers.map((a, i) => {
    const q = exam.questions[i];
    const got = a.marks.reduce((x, y) => x + y, 0);
    const max = q.steps.reduce((x, y) => x + y.marks, 0);
    return { a, q, got, max, full: got === max };
  });
  const right = rows.filter((r) => r.full).length;
  const strong = [...new Set(rows.filter((r) => r.full).map((r) => r.q.concept))];
  const next = [...new Set(rows.filter((r) => !r.full).map((r) => r.q.concept))];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[13px] font-semibold text-muted">Maths · Year 4B</p>
        <h1 className="font-display text-[28px] leading-tight">Fractions quiz</h1>
      </div>

      {/* Encouragement first, then the score */}
      <LukkiBubble mood="cheer">Great effort, Nour! You got <b>{right} of {rows.length}</b> questions fully right. Your adding and simplifying are super strong.</LukkiBubble>

      <Tile className="p-5 rise">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-3">
          <h2 className="font-display text-[18px] whitespace-nowrap mr-auto">Your score</h2>
          <Pill tone="tint"><Icon name="check" size={13} strokeWidth={3.2} />Checked by Mrs Rasha</Pill>
        </div>
        <div className="flex items-center gap-5">
          <ScoreRing got={total(sub)} max={maxOf('frac')} size={124} />
          <div className="min-w-0">
            <p className="font-display text-[30px] leading-none">{right} of {rows.length}</p>
            <p className="text-[15px] text-muted mt-1.5 leading-snug">questions fully right</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          <div>
            <h3 className="text-[13px] font-bold mb-1.5">You’re great at</h3>
            <div className="flex flex-wrap gap-1.5">{strong.map((c) => <Pill key={c} tone="sky"><Icon name="star" size={12} filled strokeWidth={1.5} />{c}</Pill>)}</div>
          </div>
          <div>
            <h3 className="text-[13px] font-bold mb-1.5">Let’s practise</h3>
            <div className="flex flex-wrap gap-1.5">{next.map((c) => <Pill key={c} tone="line"><Icon name="target" size={12} />{c}</Pill>)}</div>
          </div>
        </div>
      </Tile>

      {sub.comment && (
        <Tile className="p-4 flex gap-3">
          <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-navy text-white font-display text-[18px]" aria-hidden>R</span>
          <div>
            <h2 className="text-[13px] font-bold text-muted">Mrs Rasha says</h2>
            <p className="text-[16px] font-medium leading-snug mt-0.5">“{sub.comment}”</p>
          </div>
        </Tile>
      )}

      <section aria-labelledby="qs">
        <SectionTitle id="qs">Question by question</SectionTitle>
        <ol className="space-y-3">
          {rows.map(({ a, q, got, max, full }) => {
            const isOpen = open === a.qid;
            return (
              <li key={a.qid}>
                <Tile as="article" className={`p-4 ${full ? '' : 'border-sky'}`} aria-labelledby={`q-${a.qid}`}>
                  <div className="flex items-start gap-3">
                    <span className={`grid place-items-center w-9 h-9 shrink-0 rounded-xl font-display text-[16px] ${full ? 'bg-sky' : 'bg-tint'}`} aria-hidden>{q.n}</span>
                    <div className="flex-1 min-w-0">
                      <h3 id={`q-${a.qid}`} className="text-[15px] font-semibold leading-snug"><span className="sr-only">Question {q.n}: </span>{q.prompt}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        {full
                          ? <Pill tone="sky"><Icon name="check" size={13} strokeWidth={3.2} />Got it</Pill>
                          : <Pill tone="line"><Icon name="circle" size={13} strokeWidth={2.6} />Not yet</Pill>}
                        <span className="text-[12px] font-semibold text-muted">{got} of {max} {max === 1 ? 'mark' : 'marks'}</span>
                      </div>
                    </div>
                  </div>
                  <p className={`mt-3 text-[15px] leading-snug ${full ? 'text-muted' : ''}`}>{a.comment}</p>
                  {!full && (
                    <>
                      <button type="button" onClick={() => setOpen(isOpen ? null : a.qid)} aria-expanded={isOpen} aria-controls={`fix-${a.qid}`}
                        className="mt-2 inline-flex items-center gap-1.5 min-h-11 font-display text-[15px] tracking-wide underline underline-offset-4">
                        How to fix it <Icon name="down" size={18} strokeWidth={3} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div id={`fix-${a.qid}`} className="rise mt-1 rounded-2xl bg-ice p-4 space-y-3">
                          <div>
                            <h4 className="text-[12px] font-bold text-muted">You wrote</h4>
                            <p className="font-hand text-[22px] leading-tight text-[#1d3d8f]">{a.written.join('  ·  ')}</p>
                          </div>
                          <div>
                            <h4 className="text-[12px] font-bold text-muted mb-1.5">Step by step</h4>
                            <ul className="space-y-1.5">
                              {q.steps.map((st, k) => {
                                const ok = a.marks[k] >= st.marks;
                                return (
                                  <li key={k} className="flex items-start gap-2.5 text-[14px] leading-snug">
                                    <span className={`grid place-items-center w-6 h-6 shrink-0 rounded-full mt-px ${ok ? 'bg-sky' : 'bg-white ring-2 ring-navy/25'}`}>
                                      {ok && <Icon name="check" size={14} strokeWidth={3.2} />}
                                    </span>
                                    <span><b>{ok ? 'You did this: ' : 'Not yet: '}</b>{st.label.replace(/^(Method|Answer): /, '')}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className="rounded-xl bg-white border-2 border-rule px-3 py-2.5">
                            <h4 className="text-[12px] font-bold text-muted">The right way</h4>
                            <p className="text-[15px] font-semibold">{q.answer}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Tile>
              </li>
            );
          })}
        </ol>
      </section>

      {flag.state === 'confirmed' && (
        <div className="relative overflow-hidden rounded-[28px] bg-navy text-white p-5">
          <span aria-hidden className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-sky/15" />
          <div className="relative">
            <Pill tone="sun"><Icon name="star" size={13} filled strokeWidth={1.5} />Practice for you</Pill>
            <p className="text-[16px] leading-snug mt-3">{flag.note}</p>
            <KidLink href="/student/practice/" kind="sky" className="w-full mt-4"><Icon name="star" />Practise comparing fractions</KidLink>
            <p className="text-[13px] text-white/85 text-center mt-2">No marks. Just for you.</p>
          </div>
        </div>
      )}
    </div>
  );
}
