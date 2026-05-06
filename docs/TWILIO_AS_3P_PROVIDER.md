# Twilio as a 3P Contact Center for CIF + HIA

## Overview

This document is a walkthrough of how this widget integrates Twilio Conversations as a **third-party (3P) contact center** behind Microsoft's Channel Integration Framework (CIF) v2, and how it raises the CIF events that HIA (Help Intelligence Agent) consumes.

The widget runs as the CIF channel provider inside Dynamics. It owns the Twilio client, mediates between Twilio Conversations events and CIF, and raises the HIA conversation events so downstream HIA consumers can react to customer activity.

### Roles at a glance

| System | Responsibility |
|--------|----------------|
| **Twilio Conversations** | Source of truth for the chat: conversation roster, message stream, customer/agent identities |
| **This widget (CIF provider)** | Twilio client host. Translates Twilio events into CIF sessions and HIA events. |
| **CIF (Microsoft.CIFramework)** | Session/tab/notification lifecycle inside Dynamics, plus the `raiseEvent` channel HIA listens on |
| **HIA consumers** | Subscribe via `Microsoft.CIFramework.addHandler(...)` to `onConversationLoad` / `onCustomerMessageReceived` |

---

## Session Topology

The widget creates **two** kinds of CIF session:

| Session template | When created | Purpose |
|------------------|--------------|---------|
| `msdyn_twilio_dashboard` | Once at provider startup | Always-on dashboard tab. Lists conversations, hosts the agent UI shell. |
| `msdyn_3p_session` | Once per accepted Twilio conversation | One agent-handling session per active customer chat. |

```
  +-----------------------------------------------+
  |  Dynamics workspace                            |
  |                                                |
  |  +------------------------+                    |
  |  | msdyn_twilio_dashboard | <-- always present |
  |  +------------------------+                    |
  |                                                |
  |  +------------------------+                    |
  |  | msdyn_3p_session  conv_A |                  |
  |  +------------------------+                    |
  |                                                |
  |  +------------------------+                    |
  |  | msdyn_3p_session  conv_B | <-- one per chat |
  |  +------------------------+                    |
  +-----------------------------------------------+
```

### Bidirectional Twilio <-> CIF mapping

The widget maintains two `Map`s in [TwilioAgentPanel.tsx](../src/components/TwilioAgentPanel.tsx) so it can resolve in both directions when CIF switches focus or a Twilio message arrives:

```
sessionToConversationMap:  cifSessionId  ->  twilioConversationSid
conversationToSessionMap:  twilioConversationSid  ->  cifSessionId
```

This is what lets `onSessionSwitched` reload the right Twilio conversation, and lets a Twilio `messageAdded` event find its CIF session for focus/notification.

---

## Bootstrap: the dashboard session

The provider boots through the bootstrapper, which creates the dashboard session before any Twilio conversation exists.

[Bootstrapper.ts:129-141](../src/bootstrapper/Bootstrapper.ts#L129-L141)

```typescript
async launchProvider() {
  if (!Utils.isCIFAvailable()) return;

  await CIFV2.getInstance().createSession(
    "msdyn_twilio_dashboard",
    Utils.generateUUID(),       // correlationId
    { title: "Dashboard" }
  );
}
```

Result: a CIF session backed by the `msdyn_twilio_dashboard` template is opened. The widget mounts inside it and connects to Twilio.

---

## Per-Conversation Session Creation Flow

A `msdyn_3p_session` is **not** created automatically when a customer chat starts. The flow goes through a CIF notification first, so the agent has a chance to accept or reject.

```
  Twilio                     This widget                   CIF/Dynamics
  ------                     -----------                   ------------
  conversationJoined  ----->  correlationId = newGUID()
                              notifyEvent(template,
                              cancellationToken,
                              correlationId)
                                                       ----> Show toast
                                                             in Dynamics
                                                             (agent clicks
                                                              Accept/Reject)
                              result.actionName  <----
                                |
                                | if Accept:
                                v
                              createSession(
                                "msdyn_3p_session",
                                correlationId,    // same GUID
                                { ... }
                              )                       ----> New session tab
                                                             opens, focused
                                |
                                v
                              sessionToConversationMap
                              conversationToSessionMap
                              (record both directions)
                                |
                                v
                              raiseConversationLoad(conv.sid, intentFamilyId)
                                                       ----> HIA handler fires
                                                             (intent eval)
```

### 1. Twilio fires `conversationJoined`

When the agent's identity is added to a Twilio conversation, the SDK emits `conversationJoined`. The widget subscribes in [TwilioAgentPanel.tsx:652](../src/components/TwilioAgentPanel.tsx#L652).

### 2. Notification, not auto-session

Inside the handler, the widget calls `notifyEvent` rather than creating a session directly ([TwilioAgentPanel.tsx:692](../src/components/TwilioAgentPanel.tsx#L692)):

```typescript
const cancellationToken = Utils.generateUUID();
const correlationId = Utils.generateUUID();   // fresh GUID, reused for createSession on Accept

const resultJSON = await CIFV2.getInstance().notifyEvent(
  notificationTemplate.uniqueName,
  cancellationToken,
  correlationId
);
```

Dynamics shows a CIF toast notification using `notificationTemplate` (loaded at bootstrap from `msdyn_notificationtemplate`). The agent clicks Accept or Reject; CIF resolves the promise with `{ actionName: "Accept" | "Reject" }`.

### 3. On Accept, create the session

Only on `Accept` does the widget call `createSession` for the per-conversation tab ([TwilioAgentPanel.tsx:710](../src/components/TwilioAgentPanel.tsx#L710)):

```typescript
const sessionId = await CIFV2.getInstance().createSession(
  "msdyn_3p_session",
  correlationId,            // same GUID passed to notifyEvent above
  { /* templateParameters */ }
);
```

Notes:
- `correlationId` is the **same fresh GUID** generated for the preceding `notifyEvent`. Reusing it groups the notify and createSession calls under one correlation ID in CIF telemetry, which is the whole point of the parameter. The conversation SID is **not** used, because CIF logs the correlation ID to its telemetry pipeline and we don't want Twilio chat identifiers landing there.
- After session creation, the widget records both ends of the session<->conversation map.

### 4. Programmatic path (no notification)

There is also a path that creates the session directly without a notification step ([TwilioAgentPanel.tsx:914](../src/components/TwilioAgentPanel.tsx#L914)) - used when a session for an existing conversation needs to be re-attached (e.g., reload, multi-session cold start). There is no preceding `notifyEvent` to correlate with, so this path generates its own fresh GUID inline. Same template, same map updates.

---

## HIA Event Raising: How HIA "Sees" Twilio Activity

HIA does not subscribe to Twilio. HIA subscribes to **CIF events** that this widget raises. The widget acts as the bridge.

The full CIF event contract is documented in [HIA_CONVERSATION_EVENTS.md](./HIA_CONVERSATION_EVENTS.md). This section describes how the Twilio side feeds those events.

### Two events raised from Twilio

| Twilio trigger | CIF event raised | Helper used |
|----------------|------------------|-------------|
| Conversation loaded into the panel for the first time | `onConversationLoad` | `HIAConversationEventHelper.raiseConversationLoad` |
| Twilio `messageAdded` where `author !== agentIdentity` | `onCustomerMessageReceived` | `HIAConversationEventHelper.raiseCustomerMessageReceived` |

Both helpers ultimately call:

```typescript
Microsoft.CIFramework.raiseEvent(eventName, JSON.stringify(eventData))
```

via [CIFV2.raiseEvent](../src/cif/CIFV2.ts#L206).

### Where the events are raised

The actual raise sites live in [TwilioAgentPanel.tsx](../src/components/TwilioAgentPanel.tsx) inside the conversation-load function:

#### `onConversationLoad` - once per conversation lifecycle

[TwilioAgentPanel.tsx:380-393](../src/components/TwilioAgentPanel.tsx#L380-L393)

```typescript
// Gated by loadedConversationsRef so refocus does not re-raise
if (!loadedConversationsRef.current.has(conv.sid)) {
  await HIAConversationEventHelper.raiseConversationLoad(
    conv.sid,
    intentFamilyId
  );
  loadedConversationsRef.current.add(conv.sid);
}
```

- Fires the **first** time a Twilio conversation is hydrated into the panel.
- Subsequent CIF focus switches back to an already-loaded conversation **do not** re-raise. This matches the HIA contract idempotency rule: `onConversationLoad` is once-per-conversation, not once-per-focus.
- Payload: `{ conversationId: conv.sid, intentFamilyId }`.
- `intentFamilyId` is currently a static value held in widget state ([TwilioAgentPanel.tsx:253](../src/components/TwilioAgentPanel.tsx#L253)) - in production this would come from routing/queue metadata.

#### `onCustomerMessageReceived` - one per customer message

The Twilio `messageAdded` listener filters out agent messages and raises the event:

[TwilioAgentPanel.tsx:397-414](../src/components/TwilioAgentPanel.tsx#L397-L414)

```typescript
conv.on('messageAdded', async (message: Message) => {
  // ... append to local message state ...

  if (message.author !== agentIdentity) {        // customer-only filter
    const messageId = message.sid || `msg_${Date.now()}`;
    const timestamp = message.dateCreated?.toISOString();

    await HIAConversationEventHelper.raiseCustomerMessageReceived(
      conv.sid,
      messageId,
      timestamp
    );
  }
});
```

- Fires for every inbound (non-agent) message.
- `messageId` is the Twilio message SID; HIA consumers use this for dedup.
- `timestamp` is the Twilio `dateCreated` in ISO 8601 (optional per the HIA contract).

---

## End-to-End Sequence

A complete sequence from "customer starts chatting" to "HIA suggestion rendered":

```
   Customer       Twilio       Widget          CIF/Dynamics    HIA consumer
   --------       ------       ------          ------------    ------------
   send msg ---> conversation
                 created in
                 Twilio Flex
                 (or backend)
                      |
                      | conversationJoined
                      v
                              notifyEvent(...)
                                       ---> show toast
                                            agent clicks Accept
                              <--- {actionName:"Accept"}
                              createSession(
                                msdyn_3p_session)
                                       ---> open session tab,
                                            switch focus
                              loadConversation()
                              raiseEvent(onConversationLoad,
                                {conversationId,
                                 intentFamilyId})
                                       ---> CIF dispatches
                                                            ---> handler runs
                      |
   send msg2 -->  messageAdded
                      |
                      v
                              raiseEvent(onCustomerMessageReceived,
                                {conversationId,
                                 messageId,
                                 timestamp})
                                       ---> CIF dispatches
                                                            ---> handler runs
```

---

## Initialization Order

For HIA events to land correctly, the widget needs to:

1. **Load the CIF library** (`CIFV2.loadCIFLibrary`) - gates `Microsoft.CIFramework` availability.
2. **Load templates from Dynamics** - session, application, and notification templates are pulled from `msdyn_*template` entities at startup ([Bootstrapper.loadSessionTemplates](../src/bootstrapper/Bootstrapper.ts#L31), `loadNotificationTemplates`, `loadApplicationTemplates`).
3. **Create the dashboard session** - mounts the widget UI inside Dynamics.
4. **Initialize Twilio client** - happens inside the React component once the agent is logged in.
5. **Subscribe to Twilio events** - `conversationJoined`, per-conversation `messageAdded`.

HIA consumers (handlers registered via `addHandler`) can be initialized at any time before step 5 - typically during widget bootstrap. `HIAConversationEventHelper.initialize()` is the entry point if/when this widget itself wants to subscribe to the same events ([HIAConversationEventHelper.ts:27](../src/common/utility/HIAConversationEventHelper.ts#L27)).

---

## How to Start or Join a Chat as a Customer

The widget ships with three standalone HTML pages used to drive the customer side of a Twilio conversation. They are not loaded by the React app - open them directly in a browser (or serve them locally) to act as the customer or to manage conversations during testing.

| Page | Role | Use when |
|------|------|----------|
| [src/start-new-chat.html](../src/start-new-chat.html) | **Customer chat widget** | You want to act as a customer: start a new chat with an agent or rejoin an existing one |
| [src/twilio-chat.html](../src/twilio-chat.html) | Generic Twilio chat client | You want to join a specific conversation by SID with arbitrary credentials (developer/test) |
| [src/conversation-manager.html](../src/conversation-manager.html) | Conversation admin | List, inspect, or delete conversations on the Twilio account |

### Start a new chat (customer flow)

Open [src/start-new-chat.html](../src/start-new-chat.html) in a browser.

1. Enter your **customer name**.
2. Pick an **agent** from the dropdown (the page lists Twilio users it can route to).
3. Click **Start Chat**.

What happens under the hood ([src/start-new-chat.html:317](../src/start-new-chat.html#L317)):

```javascript
conversation = await client.createConversation({
  friendlyName: `Support Chat - ${name}`,
  attributes: { customerName: name, ... }
});
// The selected agent is added as a participant
```

This is what triggers the agent-side flow described in [Per-Conversation Session Creation Flow](#per-conversation-session-creation-flow):

- Twilio fires `conversationJoined` on the agent's client (because the agent was just added as a participant).
- The widget calls `notifyEvent` -> Dynamics shows the incoming-chat toast.
- Agent clicks **Accept** -> `msdyn_3p_session` is created -> `onConversationLoad` is raised.

The `customerName` you enter in step 1 becomes `conv.attributes.customerName`, which the agent panel reads to populate the toast and session title ([TwilioAgentPanel.tsx:679](../src/components/TwilioAgentPanel.tsx#L679)).

### Rejoin an existing chat (customer flow)

On the same [src/start-new-chat.html](../src/start-new-chat.html) page:

1. Click the **Existing Conversations** entry (or whatever the page exposes for rejoin).
2. The page lists conversations the customer identity is already a participant in ([src/start-new-chat.html:617](../src/start-new-chat.html#L617) `rejoinConversation`).
3. Click a conversation to reattach.

Rejoining does **not** re-fire `conversationJoined` on the agent side (the agent is already a participant). New customer messages still flow through `messageAdded` and produce `onCustomerMessageReceived` events normally.

### Join a specific conversation by SID (test/dev flow)

Open [src/twilio-chat.html](../src/twilio-chat.html). Useful when you have a conversation SID from elsewhere and want to attach as a chosen identity.

1. Enter a Twilio access token for the identity you want to chat as.
2. Enter the conversation SID.
3. Click **Join** - calls `client.getConversationBySid(conversationSid)` ([src/twilio-chat.html:207](../src/twilio-chat.html#L207)) and attaches.

This is the lowest-level customer/observer entry point and is most useful for reproducing scenarios where you need a specific identity in a specific conversation.

### Inspect or clean up conversations

[src/conversation-manager.html](../src/conversation-manager.html) is the admin page. Enter your Twilio Account SID + API key/secret and you can list conversations and delete them ([src/conversation-manager.html:405](../src/conversation-manager.html#L405) `deleteConversation`). Use this between test runs to clear stale state.

---

## Key Files

| File | Role |
|------|------|
| [src/bootstrapper/Bootstrapper.ts](../src/bootstrapper/Bootstrapper.ts) | Provider boot: loads templates, creates dashboard session |
| [src/cif/CIFV2.ts](../src/cif/CIFV2.ts) | Thin wrapper around `Microsoft.CIFramework`. `createSession`, `notifyEvent`, `raiseEvent`, `addHandler` live here |
| [src/components/TwilioAgentPanel.tsx](../src/components/TwilioAgentPanel.tsx) | Twilio client host. Subscribes to `conversationJoined` / `messageAdded`, drives the notify -> create-session flow, raises HIA events |
| [src/common/utility/HIAConversationEventHelper.ts](../src/common/utility/HIAConversationEventHelper.ts) | Helpers for raising and handling `onConversationLoad` / `onCustomerMessageReceived` |
| [src/start-new-chat.html](../src/start-new-chat.html) | Customer-side widget to start or rejoin a chat |
| [src/twilio-chat.html](../src/twilio-chat.html) | Generic test client - join a conversation by SID |
| [src/conversation-manager.html](../src/conversation-manager.html) | Admin page - list/delete Twilio conversations |
| [docs/HIA_CONVERSATION_EVENTS.md](./HIA_CONVERSATION_EVENTS.md) | The wire-level CIF event contract HIA depends on |

---

## Design Notes / Rationale

**Why notify-then-create instead of auto-creating sessions?**
The notification step gives Dynamics a chance to surface the incoming chat as a system toast (with Accept/Reject and customer name from `conv.attributes.customerName`). Skipping the notification would also skip the workflow CIF templates configure for incoming work. The auto-create path at line 899 is reserved for re-attach scenarios, not first-touch.

**Why one fresh GUID threaded through `notifyEvent` and `createSession`, not `conv.sid`?**
CIF logs `correlationId` to its telemetry pipeline for diagnostic grouping. Two design points fall out of that:
1. **Don't leak `conv.sid`.** Using the Twilio conversation SID would put a chat identifier into CIF telemetry. A widget-generated GUID avoids that; the session<->conversation mapping is kept locally in the widget.
2. **Reuse one GUID across the accept-flow.** The notify and the createSession that follows it on Accept are halves of the same logical operation. Generating a single GUID at the top of the handler and passing it to both calls means they share a correlation ID in telemetry — which is the entire purpose of the parameter. Generating an unrelated GUID at the createSession site (the previous behavior) leaves the two calls visibly orphaned in diagnostics.

The programmatic re-attach path (no preceding notify) generates its own fresh GUID — there's nothing to correlate with.

**Why is `onConversationLoad` gated, but `onCustomerMessageReceived` is not?**
The HIA contract treats `onConversationLoad` as a once-per-conversation lifecycle event (idempotency required by consumers). CIF, however, can re-fire focus events on the same conversation when the agent switches away and back. The widget gates on `loadedConversationsRef` to honor the contract. Customer-message events are intentionally per-message; HIA consumers are responsible for any deduplication they need on `messageId`.
