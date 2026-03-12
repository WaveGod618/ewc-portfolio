# SMT Reverse-Engineering Spec

## Goal

Rebuild the SMT portion of the closed-source `ICT SMT [Pro]` behavior closely enough to be useful, without pretending to recover the exact proprietary code.

This spec is intentionally limited to the SMT engine only.
It excludes iFVG, RR, dashboards, and session graphics.

## Publicly Observable Features

From public descriptions and landing pages, the SMT engine appears to include:

- automatic pair mapping
- same-exchange / same-provider matching
- intrabar SMT detection
- confirmed-on-close SMT detection
- depth sensitivity: `Small / Medium / Large`
- optional `2-candle SMT`
- `one SMT per pivot`
- optional deletion of irrelevant SMTs
- optional session filtering

These are behavioral observations, not source-confirmed implementation details.

## Engineering Assumptions

The most defensible implementation model is:

1. Maintain confirmed pivot highs and lows for the chart symbol.
2. Maintain confirmed pivot highs and lows for the comparison symbol.
3. Scan a rolling window of recent pivot pairs, not just the last pair.
4. Match pivots by time within a configurable bar tolerance.
5. Detect bearish and bullish divergence from opposite structural behavior.
6. Suppress duplicate SMTs from the same anchor pivot.
7. Optionally preview an intrabar SMT before the pivot is finalized.

## Core Definitions

### Confirmed Bearish SMT

At highs:

- chart makes `HH` and comparison makes `LH`, or
- chart makes `LH` and comparison makes `HH`

This is a high-side divergence and should be labeled bearish.

### Confirmed Bullish SMT

At lows:

- chart makes `LL` and comparison makes `HL`, or
- chart makes `HL` and comparison makes `LL`

This is a low-side divergence and should be labeled bullish.

### One SMT Per Pivot

Once an SMT is emitted for the chart pivot at `pivotIndex`, do not emit another SMT of the same direction from that same chart pivot anchor.

### Delete Irrelevant

This should be treated as a later feature.
Recommended future rule:

- if a newer pivot pair invalidates the prior SMT narrative before expansion, remove or fade the older drawing

Do not implement this in v1 unless the baseline SMT matches visually first.

## Depth Model

Recommended v1 mapping:

- `Small = pivot length 2`
- `Medium = pivot length 3`
- `Large = pivot length 5`

This mapping is inference from public descriptions, not source-confirmed.

## Pair Mapping

Recommended v1 behavior:

- use explicit user-selected comparison symbol

Recommended v2 behavior:

- infer comparison root from current root
- keep same provider / same exchange when possible

Examples:

- `ES -> NQ`
- `MES -> MNQ`
- `NQ -> ES`
- `MNQ -> MES`

## State Model

### Confirmed SMT Engine

1. update chart pivots
2. update comparison pivots
3. scan recent chart high pivot pairs for bearish SMT
4. scan recent chart low pivot pairs for bullish SMT
5. match comparison pivots by time tolerance
6. suppress duplicates
7. draw line and label

### Intrabar SMT Engine

Treat as separate from confirmed SMT.

Recommended later design:

1. use most recent confirmed pivot as anchor
2. compare current running bar high/low on chart vs comparison
3. raise a preview flag if divergence exists before close
4. confirm or cancel when bar closes

Do not mix intrabar logic into the confirmed pivot engine in v1.

## Recommended v1 Scope

Implement only:

- user-selected comparison symbol
- confirmed pivot SMT
- depth modes
- pivot scan window
- time tolerance
- one SMT per pivot
- label + line output

Exclude:

- intrabar
- delete irrelevant
- auto mapping
- session filters
- iFVG

## Test Protocol

Use replay mode and log:

- symbol
- comparison symbol
- timeframe
- direction
- chart pivot indices
- comparison pivot indices
- whether the SMT matches the target indicator visually

Validate on:

- `ES 5m` vs `NQ 5m`
- `MES 5m` vs `MNQ 5m`

Only after confirmed SMT is visually close should intrabar and 2-candle modes be added.
