import fs from "fs";
import path from "path";

type Ev = { ts:number; kind:string; payload:any };

function load(file: string): Ev[] {
  return fs.readFileSync(file, "utf8").trim().split("\n").map(l => JSON.parse(l));
}

function perTurnLatency(ev: Ev[]) {
  const asr: Record<number, number> = {};
  const tts: Record<number, number> = {};
  for (const e of ev) {
    if (e.kind === "asr_final") asr[e.payload.turn] = e.ts;
    if (e.kind === "tts_start")  tts[e.payload.turn] = e.ts;
  }
  const diffs:number[] = [];
  for (const k of Object.keys(asr)) {
    const t = Number(k);
    if (tts[t] != null) diffs.push(tts[t] - asr[t]);
  }
  return diffs;
}

function pct(xs:number[], p:number) {
  if (!xs.length) return NaN;
  const a=[...xs].sort((x,y)=>x-y);
  const i = Math.min(a.length-1, Math.max(0, Math.ceil(p*(a.length-1))));
  return a[i];
}
const median = (xs:number[]) => pct(xs, 0.5);
const mean   = (xs:number[]) => xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : NaN;

function pickLast<T extends Ev>(ev:T[], kind:string): T | undefined {
  for (let i=ev.length-1; i>=0; i--) if (ev[i].kind === kind) return ev[i];
  return undefined;
}
function getPath(obj:any, pathStr:string){
  return pathStr.split(".").reduce((o,k)=> (o&&o[k]!=null ? o[k] : undefined), obj);
}

function slotCoverage(captured:any){
  if (!captured) return {have:0,total:0, pct:NaN};

  const base = ["product","zip","current_insurer","accidents_3yr","email"];
  let req = [...base];
  const product = (captured.product||"").toString().toLowerCase();
  if (product === "auto") req.push("vehicle.year","vehicle.make","vehicle.model");

  let have = 0;
  for (const key of req) {
    const v = getPath(captured, key);
    if (v!==undefined && v!==null && `${v}`.trim()!=="") have++;
  }
  return { have, total: req.length, pct: req.length? (100*have/req.length) : NaN };
}

const dir = "./logs";
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".jsonl")) : [];

const groups: Record<string,string[]> = { vanilla:[], baml:[] };
for (const f of files) (f.startsWith("baml-") ? groups.baml : groups.vanilla).push(path.join(dir,f));

for (const mode of Object.keys(groups)) {
  const latAll:number[] = [];
  let turnsTotal = 0;
  let handoffs = 0;
  let coverSum = 0, coverN = 0;

  for (const fp of groups[mode]) {
    const ev = load(fp);
    latAll.push(...perTurnLatency(ev));

    // turns ~ number of ASR finals (or fallback to llm_response count)
    const turns = ev.filter(e => e.kind==="asr_final").length || ev.filter(e => e.kind==="llm_response").length;
    turnsTotal += turns;

    const hand = pickLast(ev,"handoff");
    if (hand?.payload?.success) handoffs++;

    const lastSlots = (pickLast(ev,"handoff")?.payload?.captured) ?? (pickLast(ev,"slot_update")?.payload?.captured);
    const cov = slotCoverage(lastSlots);
    if (!isNaN(cov.pct)) { coverSum += cov.pct; coverN++; }
  }

  const calls = groups[mode].length;
  const med = median(latAll), p90 = pct(latAll,0.9), avg = mean(latAll);
  const avgTurns = calls ? (turnsTotal/calls) : NaN;
  const avgCov   = coverN ? (coverSum/coverN) : NaN;

  const fmt = (x:number) => isNaN(x) ? "n/a" : x.toFixed(3);
  const fmtPct = (x:number) => isNaN(x) ? "n/a" : x.toFixed(1)+"%";

  console.log(`${mode}: calls=${calls}, handoff_success=${handoffs}/${calls}, median=${fmt(med)}s, p90=${fmt(p90)}s, mean=${fmt(avg)}s, avg_turns=${fmt(avgTurns)}, slot_coverage=${fmtPct(avgCov)}`);
}
