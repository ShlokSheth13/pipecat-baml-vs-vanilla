# Pipecat — BAML vs. Vanilla Prompting (Voice Agent)

This repo compares the same voice intake flow implemented two ways:

- **Vanilla** — free-form system prompt
- **BAML** — structured spec (slots & states)

Both modes write JSONL logs to `./logs`, and `eval/metrics.ts` computes side-by-side stats (turns, latency, slot coverage).

## 📊 Latest Metrics

> pipecat-baml-vs-vanilla@1.0.0 metrics  
> npx ts-node --transpile-only eval/metrics.ts

## 🏁 Conclusion
- **Handoff success:** Tie (100% both)
- **Slot coverage:** Tie (100% both)
- **Turns:** **BAML wins** (avg ~5 vs 6 for vanilla in our runs)
