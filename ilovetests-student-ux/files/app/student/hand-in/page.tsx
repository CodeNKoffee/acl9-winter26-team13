'use client';
import { useEffect, useRef, useState } from 'react';
import { StudentShell } from '@/components/student/StudentShell';
import { Icon, KidButton, KidLink, LukkiBubble, Pill, StarBurst, Tile } from '@/components/student/Kid';
import { Tracker } from '@/components/student/Bits';
import Lukki from '@/components/Lukki';
import Scan from '@/components/Scan';
import { useStore, type AnswerState } from '@/lib/store';

const PAGES = [['q1', 'q2', 'q3'], ['q4', 'q5']];
const STEPS = ['Pick', 'Photos', 'Check', 'Send'];
type Shot = { page: number; blurry: boolean; src?: string };

// A simple sharpness check that runs in the browser: the variance of the Laplacian
// on a small grey copy of the photo. Low variance means few sharp edges, so blurry.
// The photo never leaves the device.
const SHARP_MIN = 40;
async function sharpness(file: File) {
  const bmp = await createImageBitmap(file);
  const w = 256, h = Math.max(1, Math.round((bmp.height / bmp.width) * w));
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
  let sum = 0, sq = 0, n = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x; const l = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w];
    sum += l; sq += l * l; n++;
  }
  return n ? sq / n - (sum / n) ** 2 : 0;
}

export default function HandIn() {
  return (
    <StudentShell title="Hand in my work" kicker="Maths · Fractions quiz">
      <Wizard />
    </StudentShell>
  );
}

function Wizard() {
  const { s, d, ready } = useStore();
  const sub = s.submissions['nour-frac'];
  const [step, setStep] = useState(0);
  const [shots, setShots] = useState<Shot[]>([]);
  const [tries, setTries] = useState(0);
  const [flash, setFlash] = useState(0);
  const [checking, setChecking] = useState(false);
  const [reading, setReading] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  // Opened after handing in (or after a reload): show where the quiz is, not the wizard again.
  useEffect(() => { if (ready && sub.status !== 'due') setStep(4); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => shots.forEach((x) => x.src && URL.revokeObjectURL(x.src)), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (step !== 2) return;
    setChecking(true);
    const t = setTimeout(() => setChecking(false), 1100);
    return () => clearTimeout(t);
  }, [step]);

  const current = PAGES.findIndex((_, p) => !shots.some((x) => x.page === p));
  const blurry = shots.find((x) => x.blurry);

  const snap = () => {
    // Simulated camera: the first photo of page 2 comes out blurry, so the blur check can catch it.
    const isBlurry = current === 1 && tries === 0;
    setShots([...shots, { page: current, blurry: isBlurry }]);
    if (isBlurry) setTries(1);
    setFlash((k) => k + 1);
  };
  const pick = async (list: FileList | null) => {
    if (!list?.length) return;
    setReading(true);
    let next = [...shots];
    for (const f of Array.from(list)) {
      const page = PAGES.findIndex((_, p) => !next.some((x) => x.page === p));
      if (page < 0) break;
      let isBlurry = true;
      try { isBlurry = (await sharpness(f)) < SHARP_MIN; } catch { /* not an image we can read: ask for a retake */ }
      next = [...next, { page, blurry: isBlurry, src: URL.createObjectURL(f) }];
    }
    setShots(next); setReading(false);
    if (file.current) file.current.value = '';
  };
  const retake = () => { setShots(shots.filter((x) => !x.blurry)); setStep(1); };

  if (!ready) return <div className="h-[60vh]" aria-busy="true" />;

  return (
    <div>
      {step < 4 && (
        <ol className="grid grid-cols-4 gap-1.5 mb-5" aria-label={`Step ${step + 1} of 4: ${STEPS[step]}`}>
          {STEPS.map((t, i) => (
            <li key={t} aria-current={i === step ? 'step' : undefined} className="text-center">
              <div className={`h-3 rounded-full transition-colors ${i <= step ? 'bg-azure' : 'bg-tint'}`} />
              <span className={`mt-1.5 inline-flex items-center gap-1 text-[12px] ${i === step ? 'font-extrabold text-navy' : i < step ? 'font-semibold text-navy' : 'font-semibold text-muted'}`}>
                {i < step ? <Icon name="check" size={13} strokeWidth={3.2} /> : <span>{i + 1}</span>}{t}
              </span>
            </li>
          ))}
        </ol>
      )}

      {step === 0 && (
        <div className="space-y-4 rise">
          <LukkiBubble still>Which work are you handing in?</LukkiBubble>
          <div role="radiogroup" aria-label="Work to hand in">
            <button type="button" role="radio" aria-checked="true" onClick={() => setStep(1)}
              className="press w-full text-left flex items-center gap-3.5 rounded-3xl border-[3px] border-navy bg-white p-4 [--edge:var(--color-navy)]">
              <span className="grid place-items-center w-14 h-14 rounded-2xl bg-tint shrink-0"><Icon name="paper" size={26} /></span>
              <span className="flex-1">
                <span className="block font-display text-[19px] leading-tight">Fractions quiz</span>
                <span className="block text-[13px] text-muted mt-0.5">Due Sunday · 2 pages · Mrs Rasha</span>
              </span>
              <span className="grid place-items-center w-8 h-8 rounded-full bg-navy text-white shrink-0"><Icon name="check" size={18} strokeWidth={3} /></span>
            </button>
          </div>
          <Tile className="p-4">
            <h2 className="font-display text-[16px] mb-2">Tips for a clear photo</h2>
            <ul className="space-y-2 text-[14px]">
              <li className="flex items-center gap-2.5"><span className="grid place-items-center w-8 h-8 rounded-xl bg-ice shrink-0"><Icon name="paper" size={17} /></span>Lay the page flat on the table</li>
              <li className="flex items-center gap-2.5"><span className="grid place-items-center w-8 h-8 rounded-xl bg-ice shrink-0"><Icon name="eye" size={17} /></span>Use good light, no shadows</li>
              <li className="flex items-center gap-2.5"><span className="grid place-items-center w-8 h-8 rounded-xl bg-ice shrink-0"><Icon name="camera" size={17} /></span>Fit the whole page in the frame</li>
            </ul>
          </Tile>
          <KidButton className="w-full" onClick={() => setStep(1)}>Next: take photos</KidButton>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          {current >= 0 ? (
            <div className="rise relative rounded-[30px] bg-navy p-3 pb-4 overflow-hidden" role="group" aria-label="Camera">
              <div className="flex items-center justify-between px-2 pt-1">
                <Pill tone="sun">Page {current + 1} of 2</Pill>
                <span className="text-[13px] text-white/85">{reading ? 'Lukki is checking…' : 'Fit the whole page'}</span>
              </div>
              <div className="relative mx-1 mt-3 rounded-2xl bg-[#1B3A54] p-4">
                <div className="rotate-[-1.2deg]"><Scan examId="frac" answers={sub.answers as AnswerState[]} compact only={PAGES[current]} /></div>
                {['left-1.5 top-1.5 border-l-4 border-t-4 rounded-tl-xl', 'right-1.5 top-1.5 border-r-4 border-t-4 rounded-tr-xl', 'left-1.5 bottom-1.5 border-l-4 border-b-4 rounded-bl-xl', 'right-1.5 bottom-1.5 border-r-4 border-b-4 rounded-br-xl'].map((c) => (
                  <span key={c} aria-hidden className={`absolute w-8 h-8 border-sky ${c}`} />
                ))}
                {flash > 0 && <span key={flash} aria-hidden className="flash absolute inset-0 rounded-2xl bg-white opacity-0" />}
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center px-2">
                <button type="button" onClick={() => file.current?.click()} disabled={reading}
                  className="justify-self-start flex flex-col items-center gap-1 text-white min-h-11 rounded-xl px-1">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/12 ring-1 ring-white/25"><Icon name="image" /></span>
                  <span className="text-[12px] font-semibold">My photos</span>
                </button>
                <button type="button" onClick={snap} disabled={reading} aria-label={`Take photo of page ${current + 1}`}
                  className="grid place-items-center w-[78px] h-[78px] rounded-full bg-white ring-[6px] ring-sky transition-transform active:scale-90 disabled:opacity-50">
                  <span className="w-[58px] h-[58px] rounded-full border-[3px] border-navy/15" />
                </button>
                <span />
              </div>
              <input ref={file} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => pick(e.target.files)} />
            </div>
          ) : (
            <LukkiBubble mood="cheer">Both pages are in! Let’s check them.</LukkiBubble>
          )}
          <Thumbs shots={shots} answers={sub.answers} />
          {current < 0 && <KidButton className="w-full" onClick={() => setStep(2)}>Next: check my pages</KidButton>}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {checking ? (
            <>
              <LukkiBubble mood="think">Let me look at your pages…</LukkiBubble>
              <Thumbs shots={shots} answers={sub.answers} big scanning />
            </>
          ) : blurry ? (
            <>
              <LukkiBubble mood="think"><b>Page {blurry.page + 1} is blurry.</b> I can’t read it yet. Can you take it again?</LukkiBubble>
              <Thumbs shots={shots} answers={sub.answers} big />
              <KidButton className="w-full" onClick={retake}><Icon name="retry" />Take page {blurry.page + 1} again</KidButton>
            </>
          ) : (
            <>
              <LukkiBubble mood="cheer">All pages are clear. I can read every answer!</LukkiBubble>
              <Thumbs shots={shots} answers={sub.answers} big />
              <KidButton className="w-full" onClick={() => setStep(3)}>Next: send</KidButton>
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 rise">
          <Tile className="p-5">
            <h2 className="font-display text-[20px]">Ready to send</h2>
            <div className="flex items-center gap-3 mt-3 rounded-2xl bg-ice px-3 py-2.5">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-navy text-white font-display text-[17px]" aria-hidden>R</span>
              <span className="text-[15px]"><span className="block text-[12px] font-bold text-muted">To</span><b>Mrs Rasha</b></span>
              <span className="ml-auto text-[13px] font-semibold text-muted">Fractions quiz · 2 pages</span>
            </div>
            <div className="mt-4"><Thumbs shots={shots} answers={sub.answers} /></div>
            <p className="text-[14px] text-muted mt-4">Mrs Rasha checks it first. You’ll see your result after she does.</p>
          </Tile>
          <KidButton className="w-full" onClick={() => { d({ type: 'submit', id: 'nour-frac' }); setJustSent(true); setStep(4); }}><Icon name="send" />Send to Mrs Rasha</KidButton>
          <KidButton kind="white" size="md" className="w-full" onClick={() => setStep(2)}><Icon name="left" size={18} />Back</KidButton>
        </div>
      )}

      {step === 4 && (
        sub.status === 'released' ? (
          <div className="space-y-4 pt-2 rise">
            <LukkiBubble mood="happy">Nothing to hand in right now. Your Fractions quiz is already back!</LukkiBubble>
            <KidLink href="/student/results/" className="w-full"><Icon name="star" />See my feedback</KidLink>
          </div>
        ) : (
          <div className="space-y-5 pt-2 rise">
            <div className="relative text-center pt-2">
              {justSent && <StarBurst />}
              <Lukki size={128} mood="cheer" className="mx-auto bob" />
              <h2 className="font-display text-[30px] mt-2">{justSent ? 'Sent!' : 'All handed in'}</h2>
              <p className="text-[16px] text-muted mt-1">{justSent ? 'Well done, Nour. Mrs Rasha will check your quiz soon.' : 'Mrs Rasha has your Fractions quiz.'}</p>
            </div>
            <Tile className="p-5 text-left"><Tracker status={sub.status} /></Tile>
            <KidLink href="/student/" kind="white" size="md" className="w-full"><Icon name="home" size={18} />Back home</KidLink>
          </div>
        )
      )}
    </div>
  );
}

function Thumbs({ shots, answers, big = false, scanning = false }: { shots: Shot[]; answers: AnswerState[]; big?: boolean; scanning?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-3" aria-label="Your pages">
      {PAGES.map((qs, p) => {
        const sh = shots.find((x) => x.page === p);
        return (
          <li key={p} className="relative">
            <div className={`relative overflow-hidden rounded-2xl ${big ? 'h-44' : 'h-28'} ${sh ? (sh.blurry && !scanning ? 'ring-[3px] ring-navy bg-white' : 'ring-2 ring-rule bg-white') : 'border-2 border-dashed border-rule bg-ice grid place-items-center'}`}>
              {sh ? (
                sh.src
                  ? <img src={sh.src} alt={`Your photo of page ${p + 1}`} className="w-full h-full object-cover" style={{ filter: sh.blurry && !scanning ? 'blur(1.5px)' : undefined }} />
                  : <div className="p-1.5 pointer-events-none"><Scan examId="frac" answers={answers} compact blur={sh.blurry} only={qs} /></div>
              ) : <span className="text-[13px] font-bold text-muted">Page {p + 1}</span>}
              {scanning && sh && <span aria-hidden className="scanline absolute inset-x-2 h-1 rounded-full bg-azure shadow-[0_0_12px_2px_rgba(110,185,242,.8)]" />}
            </div>
            {sh && !scanning && (
              <span className="absolute left-2 bottom-2">
                {sh.blurry ? <Pill tone="navy">! Too blurry</Pill> : <Pill tone="sky"><Icon name="check" size={13} strokeWidth={3.2} />Page {p + 1}</Pill>}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
