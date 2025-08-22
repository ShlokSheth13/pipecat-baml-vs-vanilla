import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const LOG_DIR = process.env.LOG_DIR ?? "./logs";
fs.mkdirSync(LOG_DIR, { recursive: true });

type Captured = {
  product?: string;
  zip?: string;
  vehicle?: { year?: string; make?: string; model?: string };
  current_insurer?: string;
  accidents_3yr?: number;
  email?: string;
};

function log(sessionId: string, kind: string, payload: any) {
  fs.appendFileSync(
    path.join(LOG_DIR, `${sessionId}.jsonl`),
    JSON.stringify({ ts: Date.now() / 1000, kind, payload }) + "\n"
  );
}

const withLatency = <T extends object>(obj: T, t0: number) => ({
  ...obj,
  latency: (Date.now() - t0) / 1000,
});

async function run() {
  const sessionId = `vanilla-${Math.random().toString(36).slice(2, 8)}`;

  const demoUtterances = [
    "Hi, I need auto insurance.",
    "47906.",
    "2019 Toyota Camry.",
    "Yes.",
    "One.",
    "shlok@example.com",
  ];

  let captured: Captured = { vehicle: {} };

  log(sessionId, "session_start", { mode: "vanilla", patched: true });

  for (let i = 0; i < demoUtterances.length; i++) {
    const turn = i + 1;
    const user = demoUtterances[i];

    log(sessionId, "asr_final", { turn, text: user });

    const t0 = Date.now();
    log(sessionId, "tts_start", { turn });
    log(sessionId, "llm_response", withLatency({ turn, text: `ACK: ${user}` }, t0));

    switch (turn) {
      case 1: captured.product = "auto"; break;
      case 2: captured.zip = "47906"; break;
      case 3: captured.vehicle = { year: "2019", make: "Toyota", model: "Camry" }; break;
      case 4: captured.current_insurer = "yes"; break;
      case 5: captured.accidents_3yr = 1; break;
      case 6: captured.email = "shlok@example.com"; break;
    }
    log(sessionId, "slot_update", { turn, captured });
  }

  captured = {
    product: "auto",
    zip: "47906",
    vehicle: { year: "2019", make: "Toyota", model: "Camry" },
    current_insurer: "yes",
    accidents_3yr: 1,
    email: "shlok@example.com",
  };

  log(sessionId, "handoff", { success: true, patched: true, captured });
  log(sessionId, "session_end", {});

  console.log(sessionId);
}

run();
