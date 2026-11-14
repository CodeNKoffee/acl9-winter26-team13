'use client';
import { useState } from 'react';
import { StudentShell } from '@/components/student/StudentShell';
import { Icon, KidButton, KidLink, Pill, Progress, StarBurst, Tile } from '@/components/student/Kid';
import Lukki from '@/components/Lukki';
import { practiceItems } from '@/lib/data';
import { useStore } from '@/lib/store';

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const parse = (f: string) => f.split('/').map(Number) as [number, number];

function Bar({ n, dn, label, onTint = false }: { n: number; dn: number; label?: string; onTint?: boolean }) {
  return (
    <div className="flex gap-[3px]" role="img" aria-label={label ?? `${n} of ${dn} parts filled`}>
      {Array.from({ length: dn }).map((_, i) => <div key={i} className={`h-7 flex-1 rounded-[6px] ${i < n ? 'bg-sky' : onTint ? 'bg-white' : 'bg-tint'}`} />)}
    </div>
  );
}

function Option({ f, state, onPick, disabled }: { f: string; state: 'idle' | 'picked' | 'right' | 'wrong'; onPick: () => void; disabled: boolean }) {
  const [n, dn] = parse(f);
  const ring = { idle: 'border-rule bg-white [--edge:var(--color-rule-edge)]', picked: 'border-navy bg-tint [--edge:var(--color-navy)]', right: 'border-navy bg-tint [--edge:var(--color-navy)]', wrong: 'border-rule bg-white [--edge:var(--color-rule-edge)]' }[state];
  return (
    <button type="button" onClick={onPick} disabled={disabled} aria-pressed={state === 'picked' || state === 'right'}
      className={`press w-full rounded-3xl border-[3px] p-4 text-left disabled:cursor-default ${ring}`}>
      <div className="flex items-center">
        <span className="font-display text-[36px] leading-none">{f}</span>
        {state === 'right' && <Pill tone="sky" className="ml-auto"><Icon name="check" size={13} strokeWidth={3.2} />Bigger</Pill>}
        {state === 'wrong' && <Pill tone="line" className="ml-auto">Not this one</Pill>}
        {state === 'picked' && <span className="ml-auto grid place-items-center w-8 h-8 rounded-full bg-navy text-white"><Icon name="check" size={18} strokeWidth={3} /></span>}
      </div>
      <div className="mt-3"><Bar n={n} dn={dn} onTint={state === 'picked' || state === 'right'} label={`${f}: ${n} of ${dn} equal parts`} /></div>
    </button>
  );
}

export default function Practice() {
  return (
    <StudentShell>
      <Game />
    </StudentShell>
  );
}

function Game() {
  const { d } = useStore();
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<'a' | 'b' | null>(null);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const item = practiceItems[i];
  const right = pick === item?.bigger;

  if (done) {
    return (
      <div className="space-y-5 pt-2 rise">
        <div className="relative text-center pt-3">
          <StarBurst />
          <Lukki size={128} mood="cheer" className="mx-auto bob" />
          <h1 className="font-display text-[30px] mt-2">Practice done!</h1>
          <div className="flex justify-center gap-1.5 mt-2 text-sun" aria-label="3 stars">
            {[0, 1, 2].map((k) => <Icon key={k} name="star" size={k === 1 ? 40 : 32} filled strokeWidth={1.4} className="drop-shadow-[0_2px_0_#D19A12]" />)}
          </div>
        </div>
        <Tile className="p-5">
          <h2 className="font-display text-[17px]">The trick</h2>
          <p className="text-[16px] leading-snug mt-1">Make the bottom numbers the same. Then the bigger top number wins.</p>
        </Tile>
        <p className="text-[14px] text-muted text-center">This was practice. No marks are recorded.</p>
        <div className="grid gap-3">
          <KidButton kind="white" size="md" onClick={() => { setI(0); setPick(null); setChecked(false); setDone(false); }}><Icon name="retry" size={18} />Play again</KidButton>
          <KidLink href="/student/" className="w-full"><Icon name="home" />Back home</KidLink>
        </div>
      </div>
    );
  }

  const [an, ad] = parse(item.a), [bn, bd] = parse(item.b);
  const common = (ad * bd) / gcd(ad, bd);
  // After Check, only the child's own pick changes: the right answer is not given away on a miss.
  const stateOf = (k: 'a' | 'b') => (pick !== k ? 'idle' : !checked ? 'picked' : right ? 'right' : 'wrong');
  const next = () => {
    if (i + 1 < practiceItems.length) { setI(i + 1); setPick(null); setChecked(false); }
    else { d({ type: 'practice' }); setDone(true); }
  };

  return (
    <div className="pt-1">
      <div className="flex items-center gap-3">
        <div className="flex-1"><Progress value={i + (checked && right ? 1 : 0)} max={practiceItems.length} label="Practice progress" /></div>
        <span className="text-[14px] font-bold tabular-nums">{i + 1} of {practiceItems.length}</span>
      </div>
      <p className="text-[13px] font-semibold text-muted mt-4">Practice · comparing fractions</p>
      <h1 className="font-display text-[26px] leading-tight">Which fraction is bigger?</h1>

      <div className="grid gap-3 mt-4" role="group" aria-label="Pick the bigger fraction">
        <Option f={item.a} state={stateOf('a')} disabled={checked} onPick={() => setPick('a')} />
        <Option f={item.b} state={stateOf('b')} disabled={checked} onPick={() => setPick('b')} />
      </div>

      {!checked && (
        <KidButton className="w-full mt-5" disabled={pick === null} onClick={() => setChecked(true)}>Check</KidButton>
      )}

      {checked && (
        <div className={`rise mt-5 rounded-[26px] p-4 border-2 ${right ? 'bg-tint border-sky' : 'bg-white border-rule'}`} role="status">
          <div className="flex items-center gap-2">
            <Lukki size={52} mood={right ? 'cheer' : 'think'} className="shrink-0" />
            <h2 className="font-display text-[22px]">{right ? 'Yes! Well done!' : 'Not yet!'}</h2>
          </div>
          <p className="text-[15px] leading-snug mt-2 font-medium">{right ? item.tip : `Tip: ${item.tip}`}</p>
          {/* Same-size pieces: the idea behind the tip, drawn */}
          <div className={`mt-3 rounded-2xl p-3 space-y-2 ${right ? 'bg-white' : 'bg-ice'}`}>
            <p className="text-[12px] font-bold">Same-size pieces ({common} parts)</p>
            <div className="grid grid-cols-[52px_1fr] items-center gap-2">
              <span className="font-display text-[15px]">{an * (common / ad)}/{common}</span><Bar n={an * (common / ad)} dn={common} />
              <span className="font-display text-[15px]">{bn * (common / bd)}/{common}</span><Bar n={bn * (common / bd)} dn={common} />
            </div>
          </div>
          {right
            ? <KidButton className="w-full mt-4" onClick={next}>{i + 1 < practiceItems.length ? 'Next one' : 'Finish'}</KidButton>
            : <KidButton kind="white" className="w-full mt-4" onClick={() => { setPick(null); setChecked(false); }}><Icon name="retry" />Try again</KidButton>}
        </div>
      )}

      <p className="text-[13px] text-muted text-center mt-5">Practice is never marked.</p>
    </div>
  );
}
