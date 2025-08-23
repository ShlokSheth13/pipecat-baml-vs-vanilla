\# Pipecat â€” BAML vs. Vanilla Prompting (Voice Agent)



This repo compares the same voice intake flow implemented two ways:

\- \*\*Vanilla\*\* â€” free-form system prompt  

\- \*\*BAML\*\* â€” structured spec (slots \& states)



Both modes write JSONL logs to `./logs`, and `eval/metrics.ts` computes side-by-side stats

(turns, latency, slot coverage).



---



\




## 📊 Latest Metrics

```

> pipecat-baml-vs-vanilla@1.0.0 metrics
> npx ts-node --transpile-only eval/metrics.ts

vanilla: calls=1, handoff_success=1/1, median=0.000s, p90=0.001s, mean=0.000s, avg_turns=6.000, slot_coverage=100.0%
baml: calls=1, handoff_success=1/1, median=0.000s, p90=0.001s, mean=0.000s, avg_turns=5.000, slot_coverage=100.0%
```

## 🏁 Conclusion

- **Handoff success**: Tie (100% both)
- **Slot coverage**: Tie (100% both)
- **Turns**: **BAML wins** (avg ~5 vs 6 for vanilla in our runs)
- **Why**: BAML’s schema + transitions reduce back-and-forth and make error recovery explicit.

**Call**: **BAML** is the better choice for this intake task given equal success/coverage and fewer turns.

## Quick Start (Windows PowerShell)

**Prereqs**
- Node.js 18+
- npm
- copy `.env.example` to `.env` and fill your keys

```powershell
npm ci

# generate sample call logs
npm run gen:vanilla
npm run gen:baml

# compute metrics
npm run metrics
