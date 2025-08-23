# Sample Scenarios (paired runs)

Each folder contains two JSONL logs:
- anilla.jsonl — plain prompts
- aml.jsonl — BAML-guided

## 01_appointment
- Vanilla: reached in ~6 turns
- BAML: reached in ~5 turns (tighter confirmations)

## 02_hours
- Vanilla: one extra clarification
- BAML: fewer turns

## 03_callback
- Vanilla: extra confirm before handoff
- BAML: direct handoff after slots captured

## 04_error_recovery
- Vanilla: minor hesitation after mishearing
- BAML: structured re-ask → resolves quickly

## 05_offtopic
- Both: gracefully declined non-domain requests
