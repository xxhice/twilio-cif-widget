# HIA Conversation Events - Documentation Guide

## 📚 What's Included

This package includes comprehensive documentation and TypeScript support for HIA conversation events in the CIF 2.0 Provider framework.

---

## 📁 Files Created

### Documentation

1. **[HIA_CONVERSATION_EVENTS.md](./HIA_CONVERSATION_EVENTS.md)** - Complete CIF contract specification
   - Full event schemas with all field descriptions
   - Usage examples and code samples
   - Error handling patterns
   - Performance considerations
   - Testing guidelines

2. **[HIA_EVENTS_QUICK_REFERENCE.md](./HIA_EVENTS_QUICK_REFERENCE.md)** - Quick reference guide
   - Event names and payloads
   - Common usage patterns
   - Bootstrap examples

### TypeScript Interfaces

3. **[IHIAConversationEvents.ts](../src/interfaces/IHIAConversationEvents.ts)** - Type definitions
   - `IConversationLoadEvent` - Conversation load event interface
   - `ICustomerMessageReceivedEvent` - Customer message received event interface
   - `isConversationLoadEvent()` - Type guard for validation
   - `isCustomerMessageReceivedEvent()` - Type guard for validation
   - `HIAConversationEventNames` - Event name constants

### Helper Utilities

4. **[HIAConversationEventHelper.ts](../src/common/utility/HIAConversationEventHelper.ts)** - Helper class
   - `initialize()` - Register event handlers
   - `onConversationLoad()` - Add custom conversation load handler
   - `onCustomerMessageReceived()` - Add custom customer message handler
   - `raiseConversationLoad()` - Raise conversation load event
   - `raiseCustomerMessageReceived()` - Raise customer message received event
   - Caching and debouncing utilities

---

## 🎯 Event Summary

### Inbound Event 1: `onConversationLoad`

**Triggered when:** A conversation is loaded or initialized

**Purpose:** Set intent family context for subsequent intent re-evaluation API calls

**Required Fields:**
- `conversationId` (string) - Unique conversation identifier
- `intentFamilyId` (string) - Intent category/family ID

**Example:**
```json
{
  "eventName": "onConversationLoad",
  "eventData": {
    "conversationId": "73265873246328746478346384",
    "intentFamilyId": "29f3abe8-350e-4960-a229-1ea4c9633883"
  }
}
```

---

### Inbound Event 2: `onCustomerMessageReceived`

**Triggered when:** A customer sends a message (NOT agent messages or edits)

**Purpose:** Trigger intent re-evaluation and fetch updated agent suggestions

**Required Fields:**
- `conversationId` (string) - Reference to the conversation
- `messageId` (string) - ID of the customer's message

**Optional Fields:**
- `timestamp` (string) - ISO 8601 UTC timestamp

**Example:**
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

---

### Outbound Message 3: `INTENT_SUGGESTION_READY`

**Sent when:** After successfully fetching intent suggestions from API

**Purpose:** Notify PCF controls that intent predictions are ready for rendering

**Required Fields:**
- `type` (string) - Fixed value: "INTENT_SUGGESTION_READY"
- `conversationId` (string) - Conversation identifier
- `suggestion` (any) - Intent API response data
- `messageId` (string) - Message ID that triggered re-evaluation
- `timestamp` (Date) - When suggestions were generated

**Example:**
```typescript
{
  type: "INTENT_SUGGESTION_READY",
  conversationId: "73265873246328746478346384",
  suggestion: {
    predictedIntent: "billing.inquiry",
    confidence: 0.87,
    suggestedResponses: ["I can help you with your billing question."]
  },
  messageId: "msg_1707588310_abc123",
  timestamp: new Date("2026-02-10T19:25:15Z")
}
```

---

## 🚀 Quick Start

### 1. Initialize Event Handlers

In your application bootstrapper or initialization code:

```typescript
import { HIAConversationEventHelper } from './common/utility/HIAConversationEventHelper';

// Initialize during app startup
HIAConversationEventHelper.initialize();
```

### 2. Add Custom Handlers

```typescript
// Listen for conversation load events - set intent family context
HIAConversationEventHelper.onConversationLoad(async (event) => {
  console.log('Conversation loaded:', event.eventData.conversationId);

  // Set conversation context for intent API calls
  await setConversationContext({
    conversationId: event.eventData.conversationId,
    intentFamilyId: event.eventData.intentFamilyId
  });
});

// Listen for customer messages - trigger intent re-evaluation
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

### 3. Raise Events

```typescript
// Raise conversation load
await HIAConversationEventHelper.raiseConversationLoad(
  '73265873246328746478346384',
  '29f3abe8-350e-4960-a229-1ea4c9633883'
);

// Raise customer message received
await HIAConversationEventHelper.raiseCustomerMessageReceived(
  '73265873246328746478346384',
  'msg_1707588310_abc123'
);
```

---

## 🔧 Integration Checklist

- [ ] Import `HIAConversationEventHelper` in your bootstrapper
- [ ] Call `HIAConversationEventHelper.initialize()` during app startup
- [ ] Register custom handler for `onConversationLoad` to set intent family context
- [ ] Register custom handler for `onCustomerMessageReceived` to trigger intent re-evaluation
- [ ] Implement `fetchLatestIntentAndSuggestions()` API call function
- [ ] Use `HIAConversationEventHelper.sendIntentSuggestionToPCF()` to send suggestions to PCF control
- [ ] Implement PCF control message listener for `INTENT_SUGGESTION_READY`
- [ ] Implement suggestion rendering logic in PCF control
- [ ] Test event raising and handling
- [ ] Add error handling for intent API failures
- [ ] Consider debouncing for high-frequency customer messages

---

## 📖 Key Features

### Type Safety
All events are fully typed with TypeScript interfaces, providing:
- Autocomplete in your IDE
- Compile-time type checking
- Runtime validation with type guards

### Customer Message Focus
The `onCustomerMessageReceived` event:
- Only fires for customer messages (not agent messages)
- Specifically designed for intent re-evaluation triggers
- Optimized for agent suggestion workflows

### Optional Timestamps
The `onCustomerMessageReceived` event supports an optional timestamp:
- If provided, use the specified time
- If omitted, consumers should use current time
- Allows flexibility for different integration scenarios

### Naming Convention
Events follow the CIF naming convention:
- `onConversationLoad` (not `hia.conversation.load`)
- `onCustomerMessageReceived` (not `hia.conversation.transcript.updated`)
- Consistent with other CIF events: `onSessionSwitched`, `onSessionClosed`, etc.

### Field Naming
- `messageId` - Semantic field name for customer's message
- `intentFamilyId` - Context for intent API calls
- `timestamp` - Optional field only on `onCustomerMessageReceived`

### PCF Control Integration
The `INTENT_SUGGESTION_READY` outbound message:
- Sent automatically after successful intent API calls
- Uses `window.postMessage` for cross-frame communication
- Enables PCF controls to render intent suggestions
- Includes correlation fields (`messageId`, `conversationId`) for tracking
- Type-safe with `IIntentSuggestionReadyMessage` interface

---

## 🧪 Testing

Mock data is provided for testing:

```typescript
import { MOCK_CONVERSATION_LOAD, MOCK_CUSTOMER_MESSAGE } from './test-data';

// Simulate events
await CIFV2.getInstance().raiseEvent(
  "onConversationLoad",
  JSON.stringify(MOCK_CONVERSATION_LOAD)
);
```

---

## 📝 Notes

### Intent Re-evaluation Workflow

1. **Conversation Start:** `onConversationLoad` → Set intent family context
2. **Customer Message:** `onCustomerMessageReceived` → Call intent API → Send `INTENT_SUGGESTION_READY` to PCF control → PCF renders suggestions
3. **Repeat:** Each customer message triggers step 2

### Timestamp Handling
The `onCustomerMessageReceived` event includes an optional `timestamp` field:
- **When provided:** Use the specified timestamp for ordering and tracking
- **When omitted:** Receivers should use the current time (`new Date().toISOString()`)
- **Use cases for omitting:** Real-time events where current time is assumed
- **Note:** `onConversationLoad` does not include a timestamp field

### Performance Optimization
Use the debounced handler for rapid customer message bursts:
```typescript
const debouncedHandler = HIAConversationEventHelper.createDebouncedCustomerMessageHandler(
  async (event) => {
    await fetchLatestIntentAndSuggestions(event.eventData);
  },
  300
);
```

### CIF Convention Compliance
✅ Follows existing CIF patterns:
- `onSessionSwitched`
- `onSessionClosed`
- `onModeChanged`
- `onPresenceChange`

---

## 🔗 References

- **Full Contract:** [HIA_CONVERSATION_EVENTS.md](./HIA_CONVERSATION_EVENTS.md)
- **Quick Reference:** [HIA_EVENTS_QUICK_REFERENCE.md](./HIA_EVENTS_QUICK_REFERENCE.md)
- **TypeScript Types:** [IHIAConversationEvents.ts](../src/interfaces/IHIAConversationEvents.ts)
- **Helper Utilities:** [HIAConversationEventHelper.ts](../src/common/utility/HIAConversationEventHelper.ts)
- **Example Usage:** [HIATestingPanel.tsx](../src/components/HIATestingPanel.tsx)

---

## 📞 Support

For questions or issues with HIA conversation events, refer to the full documentation or contact the CIF Integration Team.

---

**Version:** 1.0
**Last Updated:** 2026-02-10
**Status:** ✅ Ready for Integration
