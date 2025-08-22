# Prompt Differences (Vanilla vs BAML)

## Vanilla system prompt (anilla_system.txt)
- You are an insurance intake agent. Collect:
  - product (auto/home), zip (5-digit), vehicle year/make/model (if auto),
  - current_insurer (yes/no), accidents_3yr (int), email (contact).
- Ask one at a time; confirm ambiguity; never invent.
- After each answer output captured JSON; at the end read back final JSON and say **"handoff complete"**.

## BAML spec (aml_spec.yaml)
- **Slots**: product enum [auto, home]; zip /^\d{5}$/; vehicle.year/make/model (only if auto);
  current_insurer: boolean; accidents_3yr: int; email (pattern: email).
- **Transitions**: when complete → read back JSON → then say "handoff complete".
- **Policies**: validate formats; re-ask on error; confirm all slots before handoff.

**Key differences**: BAML encodes validation + transitions declaratively; vanilla relies on prose rules.
