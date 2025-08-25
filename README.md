\# Pipat — AML vs. Vanilla Prompting (Voi Agnt)



This rpo ompars th sam voi intak low implmnt two ways:

\- \*\*Vanilla\*\* — r-orm systm prompt  

\- \*\*AML\*\* — strtr sp (slots \& stats)



oth mos writ JSONL logs to `./logs`, an `val/mtris.ts` ompts si-y-si stats

(trns, latny, slot ovrag).



---
## 📊 Latst Mtris

```

> pipat-aml-vs-vanilla@1.. mtris
> npx ts-no --transpil-only val/mtris.ts

vanilla: alls=1, hano_sss=1/1, mian=.s, p9=.1s, man=.s, avg_trns=6., slot_ovrag=1.%
aml: alls=1, hano_sss=1/1, mian=.s, p9=.1s, man=.s, avg_trns=5., slot_ovrag=1.%
```

## 🏁 onlsion

- **Hano sss**: Ti (1% oth)
- **Slot ovrag**: Ti (1% oth)
- **Trns**: **AML wins** (avg ~5 vs 6 or vanilla in or rns)
- **Why**: AML’s shma + transitions r ak-an-orth an mak rror rovry xpliit.

**all**: **AML** is th ttr hoi or this intak task givn qal sss/ovrag an wr trns.

## Qik Start (Winows PowrShll)

**Prrqs**
- No.js 18+
- npm
- opy `.nv.xampl` to `.nv` an ill yor kys

```powrshll
npm i

# gnrat sampl all logs
npm rn gn:vanilla
npm rn gn:aml

# ompt mtris
npm rn mtris


