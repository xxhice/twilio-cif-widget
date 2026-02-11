# HIA Conversation Events - CIF Contract

## Overview

This document defines CIF event contract for HIA conversation events within the CIF 2.0 Provider framework. These events enable real-time communication between the conversation system and integrated applications.

This contract includes:
- **Inbound Events** (from CIF framework): `onConversationLoad`, `onCustomerMessageReceived`
- **Outbound Messages** (to PCF controls): `INTENT_SUGGESTION_READY`

---

## Event Catalog

### Inbound Events (CIF → Event Handlers)

### 1. `onConversationLoad`

**Description:** Triggered when a conversation is loaded or initialized in the system. This event signals that a conversation context has been established and is ready for interaction.

**Event Type:** Lifecycle Event
**Frequency:** Once per conversation session initialization

#### Event Schema

```typescript
interface ConversationLoadEvent {
  eventName: "onConversationLoad";
  eventData: {
    conversationId: string;        // Unique identifier for the conversation
    intentFamilyId: string;        // Category or intent classification identifier
  };
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `eventName` | `string` | ✅ Yes | Fixed value: `"onConversationLoad"` |
| `eventData.conversationId` | `string` | ✅ Yes | Globally unique identifier (GUID/UUID) for the conversation session. Must be consistent throughout the conversation lifecycle. |
| `eventData.intentFamilyId` | `string` | ✅ Yes | Identifier representing the conversation's intent category or family. Used for routing, analytics, and workflow determination. |

#### Example Payload

```json
{
  "eventName": "onConversationLoad",
  "eventData": {
    "conversationId": "73265873246328746478346384",
    "intentFamilyId": "29f3abe8-350e-4960-a229-1ea4c9633883"
  }
}
```

#### Usage Example

```typescript
// Listening for conversation load events
Microsoft.CIFramework.addHandler("onConversationLoad", async (eventData: string) => {
  const event = JSON.parse(eventData);

  console.log(`Conversation ${event.eventData.conversationId} loaded`);
  console.log(`Intent Family: ${event.eventData.intentFamilyId}`);

  // Set the intent family context for this conversation
  // This will be used for all subsequent intent re-evaluation API calls
  await setConversationContext({
    conversationId: event.eventData.conversationId,
    intentFamilyId: event.eventData.intentFamilyId
  });

  // Optionally: Fetch initial intent and suggestions
  const initialIntent = await fetchLatestIntentAndSuggestions({
    conversationId: event.eventData.conversationId,
    intentFamilyId: event.eventData.intentFamilyId
  });

  console.log(`Conversation initialized with intent family: ${event.eventData.intentFamilyId}`);
});
```

#### Business Rules

- **Idempotency:** Multiple load events for the same `conversationId` should be handled gracefully (deduplicated or ignored)
- **Timing:** This event should be the first event fired for a new conversation session
- **State Transition:** Receiving this event indicates the conversation is in `ACTIVE` state

---

### 2. `onCustomerMessageReceived`

**Description:** Triggered when a customer sends a new message in the conversation. This event signals that intent re-evaluation should be performed to fetch updated intent predictions and agent suggestions based on the customer's latest input.

**Event Type:** Message Event
**Frequency:** Once per customer message
**Trigger Condition:** Only fires for customer messages (not agent messages, edits, or deletions)

#### Event Schema

```typescript
interface CustomerMessageReceivedEvent {
  eventName: "onCustomerMessageReceived";
  eventData: {
    conversationId: string;        // Reference to the conversation
    messageId: string;         // Identifier of the most recent message
    timestamp?: string;            // ISO 8601 formatted timestamp (UTC) - Optional
  };
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `eventName` | `string` | ✅ Yes | Fixed value: `"onCustomerMessageReceived"` |
| `eventData.conversationId` | `string` | ✅ Yes | Reference to the conversation that was updated. Must match a previously loaded conversation. |
| `eventData.messageId` | `string` | ✅ Yes | Unique identifier of the customer's message that triggered intent re-evaluation. |
| `eventData.timestamp` | `string` | ⚪ Optional | ISO 8601 formatted UTC timestamp when the customer message was received. Format: `YYYY-MM-DDTHH:mm:ssZ`. If not provided, the receiver should use the current time. |

#### Example Payload

```json
{
  "eventName": "onCustomerMessageReceived",
  "eventData": {
    "conversationId": "73265873246328746478346384",
    "messageId": "msg_1707588310_abc123",
    "timestamp": "2026-02-10T19:25:10Z"
  }
}
```

**Example without timestamp:**
```json
{
  "eventName": "onCustomerMessageReceived",
  "eventData": {
    "conversationId": "73265873246328746478346384",
    "messageId": "msg_1707588310_abc123"
  }
}
```

#### Usage Example

```typescript
// Listening for customer messages to trigger intent re-evaluation
Microsoft.CIFramework.addHandler("onCustomerMessageReceived", async (eventData: string) => {
  const event = JSON.parse(eventData);

  console.log(`Customer message received in conversation ${event.eventData.conversationId}`);
  console.log(`Message ID: ${event.eventData.messageId}`);

  // Use provided timestamp or current time
  const eventTime = event.eventData.timestamp || new Date().toISOString();

  // Trigger intent re-evaluation API call
  const intentResponse = await fetchLatestIntentAndSuggestions({
    conversationId: event.eventData.conversationId,
    messageId: event.eventData.messageId,
    timestamp: eventTime
  });

  // Update agent UI with new intent predictions and suggestions
  updateAgentSuggestions({
    intent: intentResponse.predictedIntent,
    confidence: intentResponse.confidence,
    suggestedResponses: intentResponse.suggestions
  });

  console.log(`Intent re-evaluation completed: ${intentResponse.predictedIntent}`);
});
```

#### Business Rules

- **Customer Messages Only:** This event fires ONLY when a customer sends a message, not for agent messages, system messages, edits, or deletions
- **Intent Re-evaluation Trigger:** Each event should trigger a call to your intent prediction API to get updated suggestions
- **Ordering:** Events are emitted in chronological order. If `timestamp` is provided, use it; otherwise, use message receive time
- **Deduplication:** Consumers should handle duplicate events using `messageId` as a deduplication key
- **Correlation:** `conversationId` must reference a conversation previously loaded via `onConversationLoad`
- **Context Requirement:** The `intentFamilyId` from `onConversationLoad` should be used as context for intent API calls

---

### Outbound Messages (Event Handlers → PCF Controls)

### 3. `INTENT_SUGGESTION_READY` (Outbound to PCF Control)

**Description:** Sent to PCF (PowerApps Component Framework) controls after successfully fetching intent suggestions from the API. This message notifies rendering components that new intent predictions and agent suggestions are ready to be displayed.

**Event Type:** Outbound Message to PCF Control
**Frequency:** Once per intent re-evaluation API response
**Direction:** From event handler → To PCF control

#### Message Schema

```typescript
interface IntentSuggestionReadyMessage {
  type: "INTENT_SUGGESTION_READY";
  conversationId: string;        // Conversation identifier
  suggestion: any;               // Intent API response data (plugin response)
  messageId: string;             // Message ID that triggered the intent re-evaluation
  timestamp: Date;               // When the suggestions were generated
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `string` | ✅ Yes | Fixed value: `"INTENT_SUGGESTION_READY"` |
| `conversationId` | `string` | ✅ Yes | Reference to the conversation. Matches the conversation from `onCustomerMessageReceived`. |
| `suggestion` | `any` | ✅ Yes | The intent API response data containing predictions, confidence scores, and suggested responses. Structure depends on your intent plugin implementation. |
| `messageId` | `string` | ✅ Yes | The customer message ID that triggered the intent re-evaluation. Used for correlation. |
| `timestamp` | `Date` | ✅ Yes | JavaScript Date object representing when the suggestions were generated. |

#### Example Payload

```typescript
{
  type: "INTENT_SUGGESTION_READY",
  conversationId: "73265873246328746478346384",
  suggestion: {
    predictedIntent: "billing.inquiry",
    confidence: 0.87,
    suggestedResponses: [
      "I can help you with your billing question.",
      "Let me look up your account details."
    ],
    metadata: {
      intentFamilyId: "29f3abe8-350e-4960-a229-1ea4c9633883",
      modelVersion: "v2.1"
    }
  },
  messageId: "msg_1707588310_abc123",
  timestamp: new Date("2026-02-10T19:25:15Z")
}
```

#### Usage Example

```typescript
// Complete workflow: Receive customer message → Call intent API → Send to PCF control
Microsoft.CIFramework.addHandler("onCustomerMessageReceived", async (eventData: string) => {
  const event = JSON.parse(eventData);

  try {
    // Step 1: Trigger intent re-evaluation API call
    const intentResponse = await fetchLatestIntentAndSuggestions({
      conversationId: event.eventData.conversationId,
      messageId: event.eventData.messageId,
      timestamp: event.eventData.timestamp || new Date().toISOString()
    });

    // Step 2: Send suggestions to PCF control for rendering
    const message: IntentSuggestionReadyMessage = {
      type: "INTENT_SUGGESTION_READY",
      conversationId: event.eventData.conversationId,
      suggestion: intentResponse,
      messageId: event.eventData.messageId,
      timestamp: new Date()
    };

    // Send to PCF control via postMessage or custom channel
    window.parent.postMessage(message, "*");

    console.log(`Intent suggestions sent to PCF control for rendering`);
  } catch (error) {
    console.error("Failed to fetch or send intent suggestions", error);
    // Handle error - potentially send error message to PCF control
  }
});
```

#### Business Rules

- **Trigger Condition:** This message is sent ONLY after a successful intent API call
- **Error Handling:** If the intent API call fails, this message should NOT be sent. Consider sending an error message instead.
- **Correlation:** The `messageId` should match the `messageId` from the triggering `onCustomerMessageReceived` event
- **Timing:** Send this message immediately after receiving the intent API response to minimize latency
- **PCF Integration:** The receiving PCF control must be listening for messages with `type: "INTENT_SUGGESTION_READY"`

#### PCF Control Implementation

The PCF control should listen for these messages:

```typescript
// In your PCF control
window.addEventListener("message", (event: MessageEvent) => {
  if (event.data?.type === "INTENT_SUGGESTION_READY") {
    const message = event.data as IntentSuggestionReadyMessage;

    // Verify this message is for the current conversation
    if (message.conversationId === this.currentConversationId) {
      // Render the intent suggestions in your UI
      this.renderSuggestions({
        intent: message.suggestion.predictedIntent,
        confidence: message.suggestion.confidence,
        responses: message.suggestion.suggestedResponses
      });

      console.log(`Rendered suggestions for message ${message.messageId}`);
    }
  }
});
```

---

## Common Patterns

### Event Handler Registration

All HIA conversation events should be registered during provider initialization:

```typescript
// In your bootstrapper or initialization code
export class HIAEventBootstrapper {
  static initialize(): void {
    // Register conversation load handler
    CIFV2.getInstance().addHandler(
      "onConversationLoad",
      this.handleConversationLoad.bind(this)
    );

    // Register customer message handler
    CIFV2.getInstance().addHandler(
      "onCustomerMessageReceived",
      this.handleCustomerMessageReceived.bind(this)
    );
  }

  private static async handleConversationLoad(eventData: string): Promise<void> {
    const event = JSON.parse(eventData);
    // Handle conversation load logic
  }

  private static async handleCustomerMessageReceived(eventData: string): Promise<void> {
    const event = JSON.parse(eventData);
    // Handle customer message logic
  }
}
```

### Raising Events (Provider to System)

If your provider needs to raise these events:

```typescript
// Raising a conversation load event
const conversationLoadPayload = {
  eventName: "onConversationLoad",
  eventData: {
    conversationId: "73265873246328746478346384",
    intentFamilyId: "healthcare.general.inquiry"
  }
};

await CIFV2.getInstance().raiseEvent(
  "onConversationLoad",
  JSON.stringify(conversationLoadPayload)
);

// Raising a customer messaged event (with timestamp)
const customerMessagePayload = {
  eventName: "onCustomerMessageReceived",
  eventData: {
    conversationId: "73265873246328746478346384",
    messageId: generateMessageId(),
    timestamp: new Date().toISOString()
  }
};

await CIFV2.getInstance().raiseEvent(
  "onCustomerMessageReceived",
  JSON.stringify(customerMessagePayload)
);

// Raising a customer messaged event (without timestamp)
const customerMessagePayloadSimple = {
  eventName: "onCustomerMessageReceived",
  eventData: {
    conversationId: "73265873246328746478346384",
    messageId: generateMessageId()
  }
};

await CIFV2.getInstance().raiseEvent(
  "onCustomerMessageReceived",
  JSON.stringify(customerMessagePayloadSimple)
);
```

---

## Error Handling

### Invalid Event Data

Consumers must validate event data before processing:

```typescript
function validateConversationLoadEvent(event: any): boolean {
  return (
    event?.eventName === "onConversationLoad" &&
    typeof event?.eventData?.conversationId === "string" &&
    event.eventData.conversationId.length > 0 &&
    typeof event?.eventData?.intentFamilyId === "string"
  );
}

Microsoft.CIFramework.addHandler("onConversationLoad", async (eventData: string) => {
  try {
    const event = JSON.parse(eventData);

    if (!validateConversationLoadEvent(event)) {
      console.error("Invalid conversation load event", event);
      return;
    }

    // Process valid event
    await processConversationLoad(event);
  } catch (error) {
    console.error("Error handling conversation load event", error);
  }
});
```

### Event Processing Failures

Implement graceful degradation when event processing fails:

```typescript
Microsoft.CIFramework.addHandler("onCustomerMessageReceived", async (eventData: string) => {
  try {
    const event = JSON.parse(eventData);

    // Attempt to fetch and update transcript
    const message = await fetchMessageById(event.eventData.messageId);
    updateTranscript(message);
  } catch (error) {
    console.error("Failed to process customer message", error);

    // Fallback: fetch entire transcript
    try {
      await refetchEntireTranscript(event.eventData.conversationId);
    } catch (fallbackError) {
      console.error("Fallback transcript fetch also failed", fallbackError);
      // Display user-friendly error message
      showNotification("Unable to update conversation. Please refresh.");
    }
  }
});
```

---

## Performance Considerations

### Throttling and Debouncing

For high-frequency customer messages, implement debouncing:

```typescript
let customerMessageTimer: NodeJS.Timeout | null = null;

Microsoft.CIFramework.addHandler("onCustomerMessageReceived", async (eventData: string) => {
  const event = JSON.parse(eventData);

  // Clear previous timer
  if (customerMessageTimer) {
    clearTimeout(customerMessageTimer);
  }

  // Debounce updates to avoid excessive UI refreshes
  customerMessageTimer = setTimeout(async () => {
    await updateTranscriptUI(event.eventData.conversationId);
  }, 300); // 300ms debounce
});
```

### Caching

Maintain a local cache to minimize redundant API calls:

```typescript
const conversationCache = new Map<string, ConversationData>();

Microsoft.CIFramework.addHandler("onConversationLoad", async (eventData: string) => {
  const event = JSON.parse(eventData);
  const { conversationId } = event.eventData;

  // Check cache first
  if (conversationCache.has(conversationId)) {
    console.log("Conversation already loaded (cached)");
    return;
  }

  // Load and cache conversation data
  const conversationData = await loadConversationData(event.eventData);
  conversationCache.set(conversationId, conversationData);
});
```

---

## Testing

### Mock Event Data

Use these mock payloads for testing:

```typescript
// Test data for conversation load
export const MOCK_CONVERSATION_LOAD = {
  eventName: "onConversationLoad",
  eventData: {
    conversationId: "test-conv-12345",
    intentFamilyId: "test.intent.family"
  }
};

// Test data for customer message (with timestamp)
export const MOCK_CUSTOMER_MESSAGE = {
  eventName: "onCustomerMessageReceived",
  eventData: {
    conversationId: "test-conv-12345",
    messageId: "test-msg-67890",
    timestamp: "2026-02-10T12:05:00Z"
  }
};

// Test data for customer message (without timestamp)
export const MOCK_CUSTOMER_MESSAGE_NO_TIMESTAMP = {
  eventName: "onCustomerMessageReceived",
  eventData: {
    conversationId: "test-conv-12345",
    messageId: "test-msg-67890"
  }
};
```

### Manual Event Triggering

For development and testing:

```typescript
// Simulate conversation load
async function simulateConversationLoad() {
  await CIFV2.getInstance().raiseEvent(
    "onConversationLoad",
    JSON.stringify(MOCK_CONVERSATION_LOAD)
  );
}

// Simulate customer message (with timestamp)
async function simulateCustomerMessage() {
  await CIFV2.getInstance().raiseEvent(
    "onCustomerMessageReceived",
    JSON.stringify(MOCK_CUSTOMER_MESSAGE)
  );
}

// Simulate customer message (without timestamp)
async function simulateCustomerMessageSimple() {
  await CIFV2.getInstance().raiseEvent(
    "onCustomerMessageReceived",
    JSON.stringify(MOCK_CUSTOMER_MESSAGE_NO_TIMESTAMP)
  );
}
```

---

## Versioning and Compatibility

### Schema Version

**Current Version:** `1.0`

### Breaking Changes

Breaking changes will be communicated through:
1. Major version increments
2. Minimum 6-month deprecation notice
3. Migration guides

### Backward Compatibility

- New optional fields may be added without version increment
- Required fields will never be removed in minor versions
- Field types will never change within the same major version

---

## Support and Contact

For questions, issues, or feature requests related to HIA conversation events:

- **Documentation:** [Link to internal wiki or documentation site]
- **Issue Tracker:** [Link to issue tracking system]
- **Team Contact:** [Team email or Slack channel]

---

## Appendix

### Related Events

- `onConversationClosed` - Conversation termination
- `onParticipantJoined` - New participant added to conversation
- `onParticipantLeft` - Participant removed from conversation
- `onMessageSent` - Individual message transmission
- `onMessageReceived` - Individual message reception

### Reference Implementation

See [`HIATestingPanel.tsx`](../src/components/HIATestingPanel.tsx) for a working example of conversation event handling.

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-10 | Initial SPI contract definition |

---

**Document Status:** ✅ Approved
**Last Updated:** 2026-02-10
**Maintained By:** CIF Integration Team
