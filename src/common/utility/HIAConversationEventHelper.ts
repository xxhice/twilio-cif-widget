/**
 * @fileoverview Helper utilities for working with HIA Conversation Events
 * @see docs/HIA_CONVERSATION_EVENTS.md for full documentation
 */

import {
  HIAConversationEventHandler,
  HIAConversationEventNames,
  IConversationLoadEvent,
  ICustomerMessageReceivedEvent,
  IIntentSuggestionReadyMessage
} from "../../interfaces/IHIAConversationEvents";

import { CIFV2 } from "../../cif/CIFV2";

/**
 * Helper class for managing HIA conversation events
 */
export class HIAConversationEventHelper {
  private static conversationCache = new Map<string, any>();
  private static handlers = new Map<string, HIAConversationEventHandler[]>();

  /**
   * Registers all HIA conversation event handlers
   * Call this during application initialization
   */
  static initialize(): void {
    CIFV2.getInstance().addHandler(
      HIAConversationEventNames.CONVERSATION_LOAD,
      this.handleConversationLoad.bind(this)
    );

    CIFV2.getInstance().addHandler(
      HIAConversationEventNames.CUSTOMER_MESSAGE_RECEIVED,
      this.handleCustomerMessageReceived.bind(this)
    );
  }

  /**
   * Raises a conversation load event
   * @param conversationId - The conversation identifier
   * @param intentFamilyId - The intent family/category identifier
   * @returns Promise that resolves when the event is raised
   */
  static async raiseConversationLoad(
    conversationId: string,
    intentFamilyId: string
  ): Promise<boolean> {
    const event: IConversationLoadEvent = {
      eventName: HIAConversationEventNames.CONVERSATION_LOAD,
      eventData: {
        conversationId,
        intentFamilyId,
      },
    };

    return await CIFV2.getInstance().raiseEvent(
      event.eventName,
      JSON.stringify(event.eventData)
    );
  }

  /**
   * Raises a customer message received event
   * @param conversationId - The conversation identifier
   * @param messageId - The identifier of the customer's message
   * @param timestamp - Optional ISO 8601 timestamp (defaults to current time if not provided)
   * @returns Promise that resolves when the event is raised
   */
  static async raiseCustomerMessageReceived(
    conversationId: string,
    messageId: string,
    timestamp?: string
  ): Promise<boolean> {
    const event: ICustomerMessageReceivedEvent = {
      eventName: HIAConversationEventNames.CUSTOMER_MESSAGE_RECEIVED,
      eventData: {
        conversationId,
        messageId,
        ...(timestamp && { timestamp }), // Only include timestamp if provided
      },
    };

    return await CIFV2.getInstance().raiseEvent(
      event.eventName,
      JSON.stringify(event.eventData)
    );
  }

  /**
   * Internal handler for conversation load events
   */
  private static async handleConversationLoad(eventData: string): Promise<void> {
    try {
      const data = JSON.parse(eventData);

      // Validate the data has required fields
      if (!data.conversationId || !data.intentFamilyId) {
        console.error("Invalid conversation load event data", data);
        return;
      }

      console.log(
        `[HIA] Conversation loaded: ${data.conversationId}`,
        data
      );

      // Cache conversation data to prevent duplicate processing
      const { conversationId } = data;
      if (this.conversationCache.has(conversationId)) {
        console.log(`[HIA] Conversation ${conversationId} already loaded (cached)`);
        return;
      }

      this.conversationCache.set(conversationId, data);

      // Execute registered custom handlers
      const handlers = this.handlers.get(HIAConversationEventNames.CONVERSATION_LOAD) || [];
      for (const handler of handlers) {
        await handler(eventData);
      }
    } catch (error) {
      console.error("[HIA] Error handling conversation load event", error);
    }
  }

  /**
   * Internal handler for customer message received events
   */
  private static async handleCustomerMessageReceived(eventData: string): Promise<void> {
    try {
      const data = JSON.parse(eventData);

      // Validate the data has required fields
      if (!data.conversationId || !data.messageId) {
        console.error("Invalid customer message received event data", data);
        return;
      }

      console.log(
        `[HIA] Customer message received in conversation: ${data.conversationId}`,
        data
      );

      // Execute registered custom handlers
      const handlers =
        this.handlers.get(HIAConversationEventNames.CUSTOMER_MESSAGE_RECEIVED) || [];
      for (const handler of handlers) {
        await handler(eventData);
      }
    } catch (error) {
      console.error("[HIA] Error handling customer message received event", error);
    }
  }

  /**
   * Gets cached conversation data
   * @param conversationId - The conversation identifier
   * @returns The cached conversation data or null if not found
   */
  static getCachedConversation(conversationId: string): any | null {
    return this.conversationCache.get(conversationId) || null;
  }

  /**
   * Clears the conversation cache
   * @param conversationId - Optional conversation ID to clear specific entry
   */
  static clearCache(conversationId?: string): void {
    if (conversationId) {
      this.conversationCache.delete(conversationId);
    } else {
      this.conversationCache.clear();
    }
  }

  /**
   * Creates a debounced version of a customer message handler
   * Useful for preventing excessive intent re-evaluation API calls
   * @param handler - The handler to debounce
   * @param delay - Delay in milliseconds (default: 300ms)
   * @returns Debounced handler function
   */
  static createDebouncedCustomerMessageHandler(
    handler: (event: ICustomerMessageReceivedEvent) => Promise<void>,
    delay: number = 300
  ): (event: ICustomerMessageReceivedEvent) => Promise<void> {
    let timer: NodeJS.Timeout | null = null;

    return async (event: ICustomerMessageReceivedEvent) => {
      if (timer) {
        clearTimeout(timer);
      }

      return new Promise((resolve) => {
        timer = setTimeout(async () => {
          await handler(event);
          resolve();
        }, delay);
      });
    };
  }

  /**
   * Sends intent suggestion ready message to PCF control
   * @param conversationId - The conversation identifier
   * @param suggestion - The intent API response data
   * @param messageId - The message ID that triggered intent re-evaluation
   * @param targetOrigin - The target origin for postMessage (default: "*")
   */
  static sendIntentSuggestionToPCF(
    conversationId: string,
    suggestion: any,
    messageId: string,
    targetOrigin: string = "*"
  ): void {
    const message: IIntentSuggestionReadyMessage = {
      type: "INTENT_SUGGESTION_READY",
      conversationId,
      suggestion,
      messageId,
      timestamp: new Date(),
    };

    // Send to parent window (PCF control)
    if (window.parent) {
      window.parent.postMessage(message, targetOrigin);
      console.log(
        `[HIA] Intent suggestions sent to PCF control for conversation ${conversationId}`
      );
    } else {
      console.warn("[HIA] Cannot send to PCF control: window.parent is not available");
    }
  }
}
