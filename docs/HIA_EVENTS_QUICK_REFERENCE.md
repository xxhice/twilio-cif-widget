# HIA Conversation Events - Quick Reference

> **Full Documentation:** See [HIA_CONVERSATION_EVENTS.md](./HIA_CONVERSATION_EVENTS.md) for complete CIF contract

## Event Names

**Inbound Events (from CIF):**
```typescript
onConversationLoad
onCustomerMessageReceived
```

**Outbound Messages (to PCF Control):**
```typescript
INTENT_SUGGESTION_READY
```

## Quick Examples

### Listening to Events

```typescript
import { HIAConversationEventHelper } from '../common/utility/HIAConversationEventHelper';

// Initialize event handlers (call once during app startup)
HIAConversationEventHelper.initialize();

// Add custom handler for conversation load - set intent family context
HIAConversationEventHelper.onConversationLoad(async (event) => {
  console.log('Conversation loaded:', event.eventData.conversationId);

  // Set conversation context for intent API calls
  await setConversationContext({
    conversationId: event.eventData.conversationId,
    intentFamilyId: event.eventData.intentFamilyId
  });
});

// Add custom handler for customer messages - trigger intent re-evaluation
HIAConversationEventHelper.onCustomerMessageReceived(async (event) => {
  console.log('Customer message received:', event.eventData.messageId);

  // Trigger intent re-evaluation API call
  const intentResponse = await fetchLatestIntentAndSuggestions({
    conversationId: event.eventData.conversationId,
    messageId: event.eventData.messageId
  });

  // Send suggestions to PCF control for rendering
  HIAConversationEventHelper.sendIntentSuggestionToPCF(
    event.eventData.conversationId,
    intentResponse,
    event.eventData.messageId
  );
});
```

### Raising Events

```typescript
import { HIAConversationEventHelper } from '../common/utility/HIAConversationEventHelper';

// Raise conversation load event
await HIAConversationEventHelper.raiseConversationLoad(
  '73265873246328746478346384',              // conversationId
  '29f3abe8-350e-4960-a229-1ea4c9633883'     // intentFamilyId
);

// Raise customer message received event (with optional timestamp)
await HIAConversationEventHelper.raiseCustomerMessageReceived(
  '73265873246328746478346384',  // conversationId
  'msg_1707588310_abc123',       // messageId
  '2026-02-10T19:25:10Z'         // timestamp (optional)
);

// Raise customer message received event (without timestamp)
await HIAConversationEventHelper.raiseCustomerMessageReceived(
  '73265873246328746478346384',  // conversationId
  'msg_1707588310_abc123'        // messageId
);
```

## Event Payloads

### Conversation Load

```json
{
  "eventName": "onConversationLoad",
  "eventData": {
    "conversationId": "73265873246328746478346384",
    "intentFamilyId": "29f3abe8-350e-4960-a229-1ea4c9633883"
  }
}
```

### Customer Message Received

**With timestamp:**
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

**Without timestamp (timestamp is optional):**
```json
{
  "eventName": "onCustomerMessageReceived",
  "eventData": {
    "conversationId": "73265873246328746478346384",
    "messageId": "msg_1707588310_abc123"
  }
}
```

### Intent Suggestion Ready (Outbound to PCF)

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
    ]
  },
  messageId: "msg_1707588310_abc123",
  timestamp: new Date("2026-02-10T19:25:15Z")
}
```

## TypeScript Types

```typescript
import {
  IConversationLoadEvent,
  ICustomerMessageReceivedEvent,
  IIntentSuggestionReadyMessage,
  isConversationLoadEvent,
  isCustomerMessageReceivedEvent,
  isIntentSuggestionReadyMessage
} from '../interfaces/IHIAConversationEvents';

// Type guards for validation
if (isConversationLoadEvent(event)) {
  // TypeScript knows event is IConversationLoadEvent
}

if (isCustomerMessageReceivedEvent(event)) {
  // TypeScript knows event is ICustomerMessageReceivedEvent
}

if (isIntentSuggestionReadyMessage(message)) {
  // TypeScript knows message is IIntentSuggestionReadyMessage
}
```

## Common Patterns

### Debounced Handler (for high-frequency customer messages)

```typescript
const debouncedHandler = HIAConversationEventHelper.createDebouncedCustomerMessageHandler(
  async (event) => {
    // This will only execute once every 300ms max
    await fetchLatestIntentAndSuggestions({
      conversationId: event.eventData.conversationId,
      messageId: event.eventData.messageId
    });
  },
  300  // milliseconds
);

HIAConversationEventHelper.onCustomerMessageReceived(debouncedHandler);
```

### Caching

```typescript
// Get cached conversation data
const cachedData = HIAConversationEventHelper.getCachedConversation(conversationId);

// Clear cache
HIAConversationEventHelper.clearCache(conversationId);  // Clear specific
HIAConversationEventHelper.clearCache();  // Clear all
```

## Bootstrap Example

```typescript
// In your Bootstrapper.ts or App.tsx
import { HIAConversationEventHelper } from './common/utility/HIAConversationEventHelper';

export class Bootstrapper {
  static async bootstrap(): Promise<void> {
    // ... other initialization code

    // Initialize HIA conversation event handlers
    HIAConversationEventHelper.initialize();

    // Add your custom handlers for conversation load
    HIAConversationEventHelper.onConversationLoad(async (event) => {
      // Set intent family context for this conversation
      await setConversationContext(event.eventData);
    });

    // Add your custom handlers for customer messages
    HIAConversationEventHelper.onCustomerMessageReceived(async (event) => {
      // Trigger intent re-evaluation
      const intentResponse = await fetchLatestIntentAndSuggestions(event.eventData);

      // Send suggestions to PCF control for rendering
      HIAConversationEventHelper.sendIntentSuggestionToPCF(
        event.eventData.conversationId,
        intentResponse,
        event.eventData.messageId
      );
    });
  }
}
```

## Links

- **Full CIF Contract:** [HIA_CONVERSATION_EVENTS.md](./HIA_CONVERSATION_EVENTS.md)
- **TypeScript Interfaces:** [IHIAConversationEvents.ts](../src/interfaces/IHIAConversationEvents.ts)
- **Helper Utilities:** [HIAConversationEventHelper.ts](../src/common/utility/HIAConversationEventHelper.ts)
- **Example Implementation:** [HIATestingPanel.tsx](../src/components/HIATestingPanel.tsx)
