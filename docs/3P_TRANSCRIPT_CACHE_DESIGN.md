# 3P Transcript Cache - Design Document

## Table of Contents

- [Status](#status)
- [Problem Statement](#problem-statement)
- [Race Condition Analysis](#race-condition-analysis-transcript-ahead-of-trigger)
- [Goals & Non-Goals](#goals--non-goals)
- [Why Transcript-Only Cache](#why-transcript-only-cache)
- [Architecture](#architecture)
- [Cache Design](#cache-design)
- [Cache Hit/Miss Logic](#cache-hitmiss-logic)
- [Interface Definitions](#interface-definitions)
- [Cache Lifecycle](#cache-lifecycle)
- [Edge Cases](#edge-cases)
- [Observability](#observability)
- [Future Considerations](#future-considerations)

---

## Status

| Field | Value |
|-------|-------|
| **Status** | Implementable for V1 |
| **Decision** | Transcript-only cache is safe. Intent core evaluates the full transcript holistically and does not use the triggering `messageId` to scope evaluation. |

---

## Problem Statement

Every `onCustomerMessageReceived` CIF event currently triggers a 3P connector API call to fetch the conversation transcript for intent re-evaluation. This is redundant when:

1. **Duplicate events** - The same `messageId` triggers multiple events (CIF retries, UI re-renders)
2. **Already-covered messages** - The triggering `messageId` is already present in a previously fetched transcript (e.g., the transcript fetch for msg1 returned a transcript that already includes msg2 due to timing)
3. **Multiple clients on same conversation** - Multiple browser tabs or multiple agents viewing the same conversation each trigger independent fetches for the same transcript data

These redundant calls increase latency, consume 3P API rate limits, and add unnecessary connector load.

---

## Race Condition Analysis: Transcript Ahead of Trigger

> **Reviewed and resolved.** Does NOT block implementation.

### The Scenario

The CIF event `messageId` and the 3P transcript response are not atomic. The transcript can advance during an in-flight fetch:

```
Timeline:
──────────────────────────────────────────────────────────────────►

1. CIF event arrives:       messageId = 1
2. Plugin fires 3P API call ─────────────────► (in-flight)
3.                           Customer sends message ID 2
4.                                      3P API returns transcript
                                        containing [msg1, msg2]
                                        (msg2 arrived before API responded)
```

### Why This Is Safe

Intent core evaluates the **full transcript** it receives without using the triggering `messageId` to scope the evaluation.

```
Step 1: CIF event msg1 → fetch → transcript = [msg1, msg2]
Step 2: Intent core evaluates [msg1, msg2] → suggestion S1 (msg2 IS evaluated)
Step 3: CIF event msg2 → CACHE HIT → return cached [msg1, msg2]
Step 4: Intent core evaluates [msg1, msg2] → suggestion S2

S1 ≈ S2 (same transcript = same evaluation)
```

No context is lost. The cache hit is correct and saves a redundant 3P API call.

### Coupling Assumption

This **only holds** as long as intent core does not use the triggering `messageId` to scope evaluation. If intent core ever changes to evaluate only from a specific message forward or frame suggestions around a trigger point, the cache logic must be revisited.

### Cache Value by Scenario

| Scenario | Cache Hit? | Correct? | Saves API Call? |
|----------|-----------|----------|----------------|
| Normal new message (no race) | Miss | N/A | No |
| Duplicate event (same msgId) | Hit | Yes | Yes |
| Race condition (transcript ahead of trigger) | Hit | **Yes** | **Yes** |
| Paginated old pages | Hit | Yes | Yes |
| Transfer / agent rejoin | Hit | Yes | Yes |

---

## Goals & Non-Goals

### Goals

- Eliminate redundant 3P connector API calls when the cached transcript already covers the triggering message
- Provide near-zero latency cache-hit path
- Maintain data correctness - never serve stale data when fresh data is needed
- Provider-agnostic, aligned with the existing SPI contract

### Non-Goals

- Persistent/durable caching across service restarts (in-memory only)
- Caching intent evaluation / LLM results (see [Why Transcript-Only](#why-transcript-only-cache))
- Modifying the 3P connector SPI contract

---

## Why Transcript-Only Cache

The cache stores **only** the 3P transcript, not downstream results (LLM/intent responses). Three reasons:

**1. Reusability** - The 3P transcript service may be extracted and consumed by services beyond intent core (analytics, QA review, compliance, etc.). The cache should not be coupled to any single downstream consumer.

**2. Failure isolation** - The 3P connector call and the intent/LLM evaluation are independent operations with different failure modes. If intent evaluation fails, the transcript should remain cached. On retry, the cached transcript is served (skipping the 3P call) and only intent evaluation is retried.

**3. Transcript is deterministic, intent evaluation is not** - The same transcript is always the same factual data. But the same transcript sent to intent core twice may produce **different** results - updated models, newly mined data, time-based recalculations, tuned confidence thresholds, etc. Caching the intent result at this layer would incorrectly assume `same transcript = same evaluation`.

If intent core wants to cache its own LLM results, that is the responsibility of the intent service layer, not this transcript cache.

### Why Not a Combined Transcript + LLM Cache?

A combined cache introduces **partial state**. Transcript fetch and intent evaluation have independent success/failure:

| Transcript fetch | Intent eval | Cache state |
|-----------------|-------------|-------------|
| Success | Success | Both populated |
| Success | Failure | Transcript populated, LLM result null |
| Failure | N/A | Nothing cached |

This results in two independent validity checks in one data structure - effectively two logical caches sharing a struct. Keeping them separate is clearer about ownership and avoids refactoring if the transcript service is later extracted for other consumers.

---

## Architecture

### Current (No Cache)

```
  CLIENT                                    SERVICE
  ──────                                    ───────
  onCustomerMessageReceived
  (conversationId, triggeringMessageId)
        │
        ▼
  Service call ──────────────────────►  3P Connector API Call
  (conversationId,                      (ALWAYS called, even
   triggeringMessageId)                  if redundant)
                                              │
                                              ▼
                                        Intent Evaluation API
                                              │
                                              ▼
  sendIntentSuggestionToPCF()  ◄────── Return suggestions
```

### Proposed (With Cache)

The cache lives at the **service layer** so it benefits all clients (multiple browser tabs, multiple agents on the same conversation).

```
  CLIENT                                    SERVICE
  ──────                                    ───────
  onCustomerMessageReceived
  (conversationId, triggeringMessageId)
        │
        ▼
  Service call ──────────────────────►  Transcript Cache Layer
  (conversationId,                      ┌──────────────────────────┐
   triggeringMessageId)                 │ triggeringMessageId in   │
                                        │ messageIdIndex Set?      │
                                        └────┬─────────────┬───────┘
                                          MISS│          HIT│
                                              ▼             ▼
                                        3P Connector   Return cached
                                        API Call       transcript
                                              │        (skip 3P call)
                                              ▼             │
                                        Update cache        │
                                              │             │
                                              ▼             ▼
                                        Intent Evaluation API
                                              │
                                              ▼
  sendIntentSuggestionToPCF()  ◄────── Return suggestions
```

---

## Cache Design

### Cache Structure

Each conversation gets a single cache entry. Key: `conversationId`.

```
TranscriptCacheStore (Map)
  │
  ├── "conv_123" ──► TranscriptCacheEntry
  │                    ├── spiResponse: ITranscriptSPIResponse
  │                    ├── messageIdIndex: Set<string>        (O(1) lookup)
  │                    ├── lastTriggeringMessageId: "msg_005"
  │                    ├── lastFetchedAt: 1708771800000
  │                    ├── fetchCount: 3
  │                    └── cacheHitCount: 7
```

The `messageIdIndex` is a `Set<string>` of all messageIds in the cached transcript. The SPI contract guarantees `messageId` uniqueness within a conversation (composite key: `conversationId + messageId`), so `Set.has()` gives us O(1) cache-hit determination.

---

## Cache Hit/Miss Logic

```
                    ┌─────────────────────────┐
                    │  Incoming Event          │
                    │  messageId: "msg_005"    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Cache entry exists for   │
                    │ this conversationId?     │
                    └────────┬───────┬─────────┘
                          NO │       │ YES
                             │       │
                             ▼       ▼
                    ┌──────────┐  ┌────────────────────────┐
                    │CACHE MISS│  │ messageId === last      │
                    │Fetch from│  │ TriggeringMessageId?    │
                    │3P API    │  └──────┬──────────┬───────┘
                    └──────────┘      YES│          │NO
                                         │          │
                                         ▼          ▼
                               ┌──────────┐  ┌────────────────────┐
                               │CACHE HIT │  │ messageId exists in │
                               │Duplicate │  │ messageIdIndex Set? │
                               │event     │  └──────┬─────────┬───┘
                               └──────────┘      YES│         │NO
                                                    │         │
                                                    ▼         ▼
                                          ┌──────────┐  ┌──────────┐
                                          │CACHE HIT │  │CACHE MISS│
                                          │Already   │  │New msg,  │
                                          │covered   │  │fetch from│
                                          └──────────┘  │3P API    │
                                                        └──────────┘
```

| Condition | Result | Reason |
|-----------|--------|--------|
| No cache entry for conversationId | **MISS** | First fetch for this conversation |
| `messageId === lastTriggeringMessageId` | **HIT** | Duplicate event for same message |
| `messageId` found in `messageIdIndex` | **HIT** | Message already in cached transcript |
| `messageId` not in `messageIdIndex` | **MISS** | New message not yet fetched |

**On MISS**: Fetch from 3P connector, update cache (full replacement with new SPI response, rebuild `messageIdIndex`), then pass transcript to intent evaluation.

**On HIT**: Return cached transcript directly, pass to intent evaluation. Skip 3P connector call.

---

## Interface Definitions

```typescript
interface ITranscriptCacheEntry {
  conversationId: string;
  spiResponse: ITranscriptSPIResponse;
  messageIdIndex: Set<string>;
  lastTriggeringMessageId: string;
  lastFetchedAt: number;
  fetchCount: number;
  cacheHitCount: number;
}

interface ITranscriptCacheResult {
  hit: boolean;
  spiResponse: ITranscriptSPIResponse | null;
  reason: "no_entry" | "duplicate_trigger" | "message_covered" | "new_message";
}

/** Maps to the SPI JSON schema top-level response */
interface ITranscriptSPIResponse {
  version: string;
  conversationId: string;
  messages: INormalizedMessage[];
  syncMetadata?: { hasMore: boolean };
}

/** Maps to the SPI NormalizedMessage definition */
interface INormalizedMessage {
  user: "customer" | "agent" | "bot" | "system";
  text: string;
  messageId: string;
  messageType: "text" | "rich_content" | "other";
  datetime?: string;
  speakerName?: string;
}
```

### TranscriptCacheService API

| Method | Description |
|--------|-------------|
| `getTranscript(conversationId, triggeringMessageId)` | Returns `ITranscriptCacheResult` - checks cache using the logic above |
| `updateCache(conversationId, spiResponse, triggeringMessageId)` | Stores SPI response, rebuilds `messageIdIndex`, updates metadata |
| `clearCache(conversationId?)` | Clears specific conversation or all entries |
| `getStats(conversationId)` | Returns `fetchCount`, `cacheHitCount`, `cachedMessageCount`, `lastFetchedAt` |

---

## Cache Lifecycle

### Creation & Updates

- Created on the **first cache miss** for a conversation
- On each subsequent miss, the entry is **fully replaced** (not merged) because the 3P connector returns the full transcript per SPI contract
- Full replacement ensures `messageIdIndex` is always consistent with stored messages

### Invalidation

| Trigger | Action |
|---------|--------|
| Conversation ended (no active clients) | `clearCache(conversationId)` |
| TTL expiration (configurable, e.g. 30 min idle) | `clearCache(conversationId)` |
| Manual clear (debugging) | `clearCache()` |

Since the cache lives server-side, invalidation is not tied to individual client CIF session events. A TTL-based idle expiration ensures entries are cleaned up when conversations go inactive.

### Memory

- ~50-100 KB per conversation (200 messages)
- ~1-2 MB total for 20 concurrent conversations
- Released when conversations close

---

## Edge Cases

### 1. Concurrent Events for Same Conversation

Two `onCustomerMessageReceived` events fire nearly simultaneously with different messageIds. Use a per-conversation fetch lock (promise-based) to ensure only one 3P API call is in flight at a time. The second event waits for the first fetch to complete, then re-checks cache (which should now be a hit since the transcript from the first fetch likely includes both messages).

### 2. SPI `hasMore: true` (Pagination)

V1 scope is to only fetch the latest page. The cache stores whatever the connector returns - `messageIdIndex` accurately reflects what was returned. If pagination support is added later, the cache would need to merge pages rather than fully replace.

### 3. Triggering MessageId Not in 3P Transcript

The message was very recently sent and the 3P system hasn't propagated it. This is a valid cache miss. The `lastTriggeringMessageId` check provides a safety net: a duplicate event for the same trigger will still be a cache hit even if the messageId is not in the transcript's `messageIdIndex`.

### 4. Agent Messages Between Customer Messages

Cache only triggers on `onCustomerMessageReceived`. Agent messages don't trigger cache checks but are included in the transcript when fetched. This is correct - the full transcript always contains all message types.

### 5. Out-of-Order Event Delivery

If msg_005 arrives before msg_003: msg_005 triggers a fetch (cache has [msg_001...msg_005]), then when msg_003 arrives late it's already in `messageIdIndex` → cache hit. Correct behavior.

---

## Observability

All cache operations log with `[HIA][Cache]` prefix:

```
[HIA][Cache] HIT (duplicate_trigger) conv=conv_123 msgId=msg_005
[HIA][Cache] HIT (message_covered) conv=conv_123 msgId=msg_003
[HIA][Cache] MISS (no_entry) conv=conv_123 msgId=msg_001
[HIA][Cache] MISS (new_message) conv=conv_123 msgId=msg_006
[HIA][Cache] UPDATE conv=conv_123 msgCount=15 triggerMsgId=msg_006
[HIA][Cache] CLEAR conv=conv_123
```

The `getStats()` method provides per-conversation metrics: `fetchCount`, `cacheHitCount`, `cachedMessageCount`, `hitRate`.

---

## Interaction with Existing Caching

| Cache | Layer | Purpose |
|-------|-------|---------|
| `conversationCache` (existing) | Client (CIF widget) | Prevent duplicate `onConversationLoad` processing |
| `TranscriptCacheService` (new) | Service | Prevent redundant 3P transcript connector calls |

Different layers, complementary purposes, no overlap.

---

## Future Considerations

### V1.1: Transcript Cache Enhancements

1. **Paginated old pages** - Cache immutable old transcript pages. Page 1 doesn't change when fetching page 2.
2. **Transfer / agent rejoin** - Serve cached transcript immediately when an agent joins a previously fetched conversation. Intent evaluation still runs fresh.
3. **Multi-CSR support** - Avoid redundant parallel 3P connector calls when multiple agents are on the same conversation. Requires multi-request support (not currently implemented).

### Other

4. **Incremental cache updates** - Merge new messages into existing cache when the 3P connector supports delta fetches.
5. **Shared cache across tabs** - `BroadcastChannel` or `SharedWorker` to synchronize cache entries.
6. **Configurable cache behavior** - Allow disabling the cache for debugging or when real-time freshness is critical.
