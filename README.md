\# Pipecat — BAML vs. Vanilla Prompting (Voice Agent)



This repo compares the same voice intake flow implemented two ways:

\- \*\*Vanilla\*\* — free-form system prompt  

\- \*\*BAML\*\* — structured spec (slots \& states)



Both modes write JSONL logs to `./logs`, and `eval/metrics.ts` computes side-by-side stats

(turns, latency, slot coverage).



---



\## Quick Start (Windows PowerShell)



> Requires Node.js 18+ and `npm`.



```powershell

\# Install deps

npm ci



