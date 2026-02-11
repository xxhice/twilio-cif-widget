/**
 * @fileoverview Type definitions for HIA Conversation Events
 * @see docs/HIA_CONVERSATION_EVENTS.md for full CIF contract documentation
 */

/**
 * Base interface for all HIA conversation events
 */
export interface IHIABaseEvent<T extends string, D> {
  eventName: T;
  eventData: D;
}

/**
 * Event data for conversation load event
 */
export interface IConversationLoadEventData {
  /** Unique identifier for the conversation session */
  conversationId: string;

  /** Intent category or family identifier for routing and classification */
  intentFamilyId: string;
}

/**
 * Event data for customer message received event
 */
export interface ICustomerMessageReceivedEventData {
  /** Reference to the conversation */
  conversationId: string;

  /** Unique identifier of the customer's message */
  messageId: string;

  /** ISO 8601 formatted UTC timestamp when the customer message was received (Optional) */
  timestamp?: string;
}

/**
 * Conversation load event - triggered when a conversation is initialized
 */
export interface IConversationLoadEvent
  extends IHIABaseEvent<"onConversationLoad", IConversationLoadEventData> {}

/**
 * Customer message received event - triggered when a customer sends a message
 * This event signals that intent re-evaluation should be performed
 */
export interface ICustomerMessageReceivedEvent
  extends IHIABaseEvent<"onCustomerMessageReceived", ICustomerMessageReceivedEventData> {}

/**
 * Union type of all HIA conversation events
 */
export type HIAConversationEvent = IConversationLoadEvent | ICustomerMessageReceivedEvent;

/**
 * Type guard to check if an event is a conversation load event
 */
export function isConversationLoadEvent(event: any): event is IConversationLoadEvent {
  return (
    event?.eventName === "onConversationLoad" &&
    typeof event?.eventData?.conversationId === "string" &&
    event.eventData.conversationId.length > 0 &&
    typeof event?.eventData?.intentFamilyId === "string"
  );
}

/**
 * Type guard to check if an event is a customer message received event
 */
export function isCustomerMessageReceivedEvent(event: any): event is ICustomerMessageReceivedEvent {
  return (
    event?.eventName === "onCustomerMessageReceived" &&
    typeof event?.eventData?.conversationId === "string" &&
    event.eventData.conversationId.length > 0 &&
    typeof event?.eventData?.messageId === "string" &&
    event.eventData.messageId.length > 0 &&
    // Timestamp is optional - validate only if provided
    (event.eventData.timestamp === undefined ||
     (typeof event.eventData.timestamp === "string" && !isNaN(Date.parse(event.eventData.timestamp))))
  );
}

/**
 * Event handler type for HIA conversation events
 */
export type HIAConversationEventHandler = (eventData: string) => Promise<void>;

/**
 * Constants for HIA conversation event names
 */
export const HIAConversationEventNames = {
  CONVERSATION_LOAD: "onConversationLoad" as const,
  CUSTOMER_MESSAGE_RECEIVED: "onCustomerMessageReceived" as const,
} as const;

/**
 * Type for HIA conversation event name literals
 */
export type HIAConversationEventName =
  (typeof HIAConversationEventNames)[keyof typeof HIAConversationEventNames];

/**
 * Outbound message to PCF controls with intent suggestions
 */
export interface IIntentSuggestionReadyMessage {
  /** Fixed message type identifier */
  type: "INTENT_SUGGESTION_READY";

  /** Conversation identifier */
  conversationId: string;

  /** Intent API response data (plugin response) */
  suggestion: any;

  /** Message ID that triggered the intent re-evaluation */
  messageId: string;

  /** When the suggestions were generated */
  timestamp: Date;
}

/**
 * Type guard to check if a message is an intent suggestion ready message
 */
export function isIntentSuggestionReadyMessage(message: any): message is IIntentSuggestionReadyMessage {
  return (
    message?.type === "INTENT_SUGGESTION_READY" &&
    typeof message?.conversationId === "string" &&
    message.conversationId.length > 0 &&
    message?.suggestion !== undefined &&
    typeof message?.messageId === "string" &&
    message.messageId.length > 0 &&
    message?.timestamp instanceof Date
  );
}
