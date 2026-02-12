import {
  Button,
  Spinner,
  Text,
  Textarea,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Client, Conversation, Message } from '@twilio/conversations';

import { CIFV2 } from '../cif/CIFV2';
import { GlobalStore } from '../common/GlobalStore/GlobalStore';
import { GlobalStoreParameters } from '../common/GlobalStore/GlobalStoreParameters';
import { HIAConversationEventHelper } from '../common/utility/HIAConversationEventHelper';
import { INotificationTemplate } from '../interfaces/INotificationTemplate';
import React from 'react';
import { Send24Regular, ArrowClockwise24Regular } from '@fluentui/react-icons';
import { Utils } from '../common/utility/Utils';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...shorthands.overflow('hidden'),
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  infoSection: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.padding('12px'),
    marginBottom: '12px',
    ...shorthands.borderRadius('4px'),
    ...shorthands.border('1px', 'solid', tokens.colorBrandStroke1),
  },
  messagesContainer: {
    flexGrow: 1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius('4px'),
    ...shorthands.padding('15px'),
    marginBottom: '15px',
    backgroundColor: tokens.colorNeutralBackground3,
    overflowY: 'auto',
    scrollbarWidth: 'thin',
  },
  message: {
    ...shorthands.margin('10px', '0'),
    ...shorthands.padding('10px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  },
  messageMe: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    marginLeft: '40px',
  },
  messageOther: {
    backgroundColor: tokens.colorNeutralBackground2,
    marginRight: '40px',
  },
  messageSystem: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    ...shorthands.borderColor(tokens.colorPaletteGreenBorder1),
    textAlign: 'center',
    marginLeft: '0',
    marginRight: '0',
    fontSize: '13px',
    color: tokens.colorPaletteGreenForeground2,
  },
  messageAuthor: {
    fontWeight: 'bold',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '5px',
  },
  messageBody: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
  },
  messageTime: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground4,
    marginTop: '5px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    columnGap: '8px',
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke1),
  },
  inputField: {
    flexGrow: 1,
    minHeight: '40px',
    maxHeight: '120px',
  },
  sendButton: {
    minWidth: '40px',
    height: '40px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
  },
  notification: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    ...shorthands.padding('12px'),
    marginBottom: '12px',
    ...shorthands.borderRadius('4px'),
    ...shorthands.border('1px', 'solid', tokens.colorPaletteGreenBorder1),
    color: tokens.colorPaletteGreenForeground1,
    fontWeight: 'bold',
  },
  pendingNotification: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.padding('16px'),
    marginBottom: '12px',
    ...shorthands.borderRadius('4px'),
    ...shorthands.border('2px', 'solid', tokens.colorBrandStroke1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: '12px',
  },
  pendingNotificationText: {
    flexGrow: 1,
    fontWeight: 'bold',
    color: tokens.colorBrandForeground1,
  },
  waitingMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
    color: tokens.colorNeutralForeground3,
  },
  dashboardPage: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  dashboardHeader: {
    marginBottom: '20px',
  },
  dashboardTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  conversationList: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  conversationItem: {
    position: 'relative',
    ...shorthands.padding('16px'),
    ...shorthands.margin('0', '0', '12px', '0'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
      boxShadow: tokens.shadow4,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  conversationInfo: {
    flexGrow: 1,
    paddingRight: '24px',
  },
  deleteButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    minWidth: '24px',
    height: '24px',
    ...shorthands.padding('0'),
    fontSize: '16px',
    color: tokens.colorNeutralForeground3,
    '&:hover': {
      color: tokens.colorPaletteRedForeground1,
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
  backButton: {
    marginBottom: '8px',
    alignSelf: 'flex-start',
  },
});

interface TwilioMessage {
  author: string;
  body: string;
  dateCreated: Date;
}

interface ParticipantMap {
  [identity: string]: string;
}

interface ConversationInfo {
  sid: string;
  friendlyName: string;
  attributes?: any;
}

interface PendingConversation {
  conversation: Conversation;
  info: ConversationInfo;
}

const TwilioAgentPanel: React.FC = () => {
  const styles = useStyles();
  const [agentIdentity] = React.useState<string>('agent123');
  const [intentFamilyId] = React.useState<string>('14f7c663-ed81-46d4-8cec-4cb1432bce57'); // Intent family for this conversation
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<TwilioMessage[]>([]);
  const [messageInput, setMessageInput] = React.useState<string>('');
  const [conversation, setConversation] = React.useState<Conversation | null>(null);
  const [currentIdentity, setCurrentIdentity] = React.useState<string>('');
  const [conversations, setConversations] = React.useState<ConversationInfo[]>([]);
  const [activeConversationSid, setActiveConversationSid] = React.useState<string | null>(null);
  const [client, setClient] = React.useState<Client | null>(null);
  const [pendingConversation, setPendingConversation] = React.useState<PendingConversation | null>(null);
  const [participantNames, setParticipantNames] = React.useState<ParticipantMap>({});
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'conversation'>('dashboard');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const TOKEN_URL = 'https://chattryoutautogeneratedauthservice-6300.twil.io/token';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to get friendly name
  const getFriendlyName = (author: string): string => {
    // Check participant names from conversation attributes
    if (participantNames[author]) {
      return participantNames[author];
    }

    // Fallback logic
    if (author === agentIdentity) {
      return 'You';
    } else if (author.startsWith('agent')) {
      return 'Jane W. (Customer Support)';
    } else if (author.startsWith('customer_')) {
      return 'Customer';
    }
    return author;
  };

  // Function to load and display a conversation
  const loadConversation = React.useCallback(async (conv: Conversation) => {
    try {
      setMessages([]);
      setConversation(conv);
      setActiveConversationSid(conv.sid);

      // Load participant names from Twilio User objects
      try {
        const participants = await conv.getParticipants();
        const nameMap: ParticipantMap = {};

        for (const participant of participants) {
          if (participant.identity) {
            // Get user info which includes friendly name
            try {
              const user = await participant.getUser();
              if (user && user.friendlyName) {
                nameMap[participant.identity] = user.friendlyName;
                console.log(`Loaded friendly name for ${participant.identity}: ${user.friendlyName}`);
              }
            } catch (userError) {
              console.log(`No user object found for ${participant.identity}, will use fallback`);
            }
          }
        }

        // Also try to load from conversation attributes as fallback
        const attrs = conv.attributes
          ? (typeof conv.attributes === 'string' ? JSON.parse(conv.attributes) : conv.attributes)
          : {};
        if (attrs.participants) {
          // Merge attributes with Twilio user data, preferring Twilio user data
          setParticipantNames({ ...attrs.participants, ...nameMap });
        } else {
          setParticipantNames(nameMap);
        }
      } catch (e) {
        console.error('Error loading participant names:', e);
      }

      // Load message history
      const messagesResponse = await conv.getMessages();
      const loadedMessages: TwilioMessage[] = messagesResponse.items.map((msg: Message) => ({
        author: msg.author || 'Unknown',
        body: msg.body || '',
        dateCreated: msg.dateCreated || new Date(),
      }));
      setMessages(loadedMessages);

      // 🔥 CIF Integration: Raise onConversationLoad event
      await HIAConversationEventHelper.raiseConversationLoad(
        conv.sid,
        intentFamilyId
      );
      console.log('[HIA] onConversationLoad event raised', { conversationId: conv.sid, intentFamilyId });

      // Listen for new messages (remove old listener first if exists)
      conv.removeAllListeners('messageAdded');
      conv.on('messageAdded', async (message: Message) => {
        const newMsg: TwilioMessage = {
          author: message.author || 'Unknown',
          body: message.body || '',
          dateCreated: message.dateCreated || new Date(),
        };
        setMessages((prev) => [...prev, newMsg]);

        // 🔥 CIF Integration: Raise onCustomerMessageReceived event for customer messages
        if (message.author !== agentIdentity) {
          const messageId = message.sid || `msg_${Date.now()}`;
          const timestamp = message.dateCreated?.toISOString();

          await HIAConversationEventHelper.raiseCustomerMessageReceived(
            conv.sid,
            messageId,
            timestamp
          );
          console.log('[HIA] onCustomerMessageReceived event raised', {
            conversationId: conv.sid,
            messageId,
            timestamp,
            author: message.author,
          });
        }
      });
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError(err instanceof Error ? err.message : 'Error loading conversation');
    }
  }, [agentIdentity, intentFamilyId]);

  // Function to accept a pending conversation
  const acceptConversation = React.useCallback(async (pending: PendingConversation) => {
    try {
      setPendingConversation(null);
      setIsLoading(true);

      // Load the conversation in the same session (no new session creation)
      console.log('[CIF] Loading conversation in current session:', pending.conversation.sid);
      await loadConversation(pending.conversation);

      // Switch to conversation view
      setCurrentView('conversation');

      // Send agent greeting message
      try {
        await pending.conversation.sendMessage('👋 Hello! I\'m your support agent. How can I help you today?');
        console.log('✅ Agent greeting sent');
      } catch (error) {
        console.error('Failed to send agent greeting:', error);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error accepting conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to accept conversation');
      setIsLoading(false);
    }
  }, [loadConversation]);

  React.useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch token
        const response = await fetch(`${TOKEN_URL}?identity=${encodeURIComponent(agentIdentity)}`);

        if (!response.ok) {
          throw new Error(`Failed to get token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Create Twilio Conversations client
        const twilioClient = await Client.create(data.token);
        setClient(twilioClient);
        setCurrentIdentity(agentIdentity);

        console.log('✅ Twilio client initialized');

        // 🔥 Check if opened with a correlation ID (conversation SID) from Dynamics
        const urlParams = new URLSearchParams(window.location.search);
        const correlationId = urlParams.get('correlationId') || urlParams.get('conversationId');

        if (correlationId) {
          console.log('[CIF] Widget opened with correlation ID:', correlationId);
          try {
            // Load the specific conversation
            const conv = await twilioClient.getConversationBySid(correlationId);
            console.log('[CIF] Loading conversation from Dynamics:', conv.sid);

            // CIF session should already exist (created by Dynamics), just load the conversation
            await loadConversation(conv);
            setCurrentView('conversation');
            setIsLoading(false);
            return; // Skip the rest of initialization
          } catch (error) {
            console.error('[CIF] Failed to load conversation from correlation ID:', error);
            // Continue with normal initialization
          }
        }

        // Load existing conversations
        const subscribedConversations = await twilioClient.getSubscribedConversations();
        const convList: ConversationInfo[] = subscribedConversations.items.map((conv: Conversation) => ({
          sid: conv.sid,
          friendlyName: conv.friendlyName || conv.sid,
          attributes: conv.attributes,
        }));

        setConversations(convList);
        console.log(`📋 Found ${convList.length} existing conversations`);

        // DO NOT auto-load existing conversations
        // Conversations should only be loaded when:
        // 1. Agent accepts a new incoming conversation (via Accept button)
        // 2. Widget is opened through Dynamics notification flow with correlationId
        // 3. Agent selects a conversation from the dashboard

        // If there are existing conversations, show the dashboard automatically
        if (convList.length > 0) {
          console.log('📋 Existing conversations found. Opening dashboard...');
          setCurrentView('dashboard');
        }

        // 🔥 Listen for when agent is added to new conversations
        twilioClient.on('conversationJoined', async (conv: Conversation) => {
          console.log('🔔 New conversation joined:', conv.sid);

          const convInfo: ConversationInfo = {
            sid: conv.sid,
            friendlyName: conv.friendlyName || conv.sid,
            attributes: conv.attributes,
          };

          setConversations((prev) => [...prev, convInfo]);

          // 🔥 Trigger CIF notification instead of showing custom UI
          try {
            if (!Utils.isCIFAvailable()) {
              console.warn('[CIF] CIF not available, falling back to pending conversation UI');
              setPendingConversation({ conversation: conv, info: convInfo });
              return;
            }

            const notificationTemplate = GlobalStore.getInstance().get(GlobalStoreParameters.NOTIFICATION_TEMPLATE) as INotificationTemplate;

            // Get customer name from attributes for notification
            let customerName = 'Customer';
            try {
              const attrs = conv.attributes
                ? (typeof conv.attributes === 'string' ? JSON.parse(conv.attributes) : conv.attributes)
                : {};
              if (attrs.customerName) {
                customerName = attrs.customerName;
              }
            } catch (e) {
              console.error('Error parsing conversation attributes:', e);
            }

            const cancellationToken = Utils.generateUUID();
            const correlationId = conv.sid; // Use conversation SID as correlation ID

            console.log(`[CIF] Triggering notification for ${customerName} (${correlationId})`);

            // Trigger CIF notification - this will show in Dynamics
            const resultJSON = await CIFV2.getInstance().notifyEvent(
              notificationTemplate.uniqueName,
              cancellationToken,
              correlationId
            );

            const result = JSON.parse(resultJSON);
            console.log('[CIF] Notification result:', result);

             // Check if agent accepted the notification
            if (result.actionName === 'Accept') {
              console.log('[CIF] Agent accepted notification, loading conversation in current session...');

              // Load the conversation in the same session (no new session creation)
              await loadConversation(conv);
              setCurrentView('conversation');

              // Send agent greeting message
              // try {
              //   await conv.sendMessage('👋 Hello! this is Jane. How can I help you today?');
              //   console.log('✅ Agent greeting sent');
              // } catch (error) {
              //   console.error('Failed to send agent greeting:', error);
              // }
            } else {
              console.log('[CIF] Agent rejected or timeout on notification');
            }
          } catch (error) {
            console.error('[CIF] Error triggering notification:', error);
            // Fallback to pending conversation UI
            setPendingConversation({ conversation: conv, info: convInfo });
          }
        });

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [agentIdentity, TOKEN_URL, loadConversation]);

  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (text && conversation) {
      try {
        await conversation.sendMessage(text);
        setMessageInput('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteConversation = async (conversationSid: string) => {
    if (!client) return;

    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
      return;
    }

    try {
      const conv = await client.getConversationBySid(conversationSid);
      await conv.delete();

      // Remove from list
      setConversations(prev => prev.filter(c => c.sid !== conversationSid));

      // If this was the active conversation, go back to dashboard
      if (activeConversationSid === conversationSid) {
        setConversation(null);
        setActiveConversationSid(null);
        setMessages([]);
        setCurrentView('dashboard');
      }

      console.log('✅ Conversation deleted:', conversationSid);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleJoinConversation = async (conversationSid: string) => {
    if (!client) return;

    try {
      const conv = await client.getConversationBySid(conversationSid);
      await loadConversation(conv);
      setCurrentView('conversation');
    } catch (error) {
      console.error('Error joining conversation:', error);
      alert('Failed to join conversation: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleRefreshConversations = async () => {
    if (!client) return;

    try {
      console.log('🔄 Refreshing conversations...');
      const subscribedConversations = await client.getSubscribedConversations();
      const convList: ConversationInfo[] = subscribedConversations.items.map((conv: Conversation) => ({
        sid: conv.sid,
        friendlyName: conv.friendlyName || conv.sid,
        attributes: conv.attributes,
      }));

      setConversations(convList);
      console.log(`✅ Refreshed: Found ${convList.length} conversations`);
    } catch (error) {
      console.error('Error refreshing conversations:', error);
      alert('Failed to refresh conversations: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" label="Connecting to Twilio chat..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingContainer}>
        <Text className={styles.errorText}>Error: {error}</Text>
      </div>
    );
  }

  // Dashboard View - Show all conversations
  if (currentView === 'dashboard') {
    return (
      <div className={styles.container}>
        <div className={styles.dashboardPage}>
          <div className={styles.dashboardHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div className={styles.dashboardTitle}>Conversation Dashboard</div>
              <Button
                appearance="subtle"
                icon={<ArrowClockwise24Regular />}
                onClick={handleRefreshConversations}
                title="Refresh conversations"
              >
                Refresh
              </Button>
            </div>
            <Text>
              <strong>👤 Logged in as:</strong> {currentIdentity}
            </Text>
            <Text>
              <strong>📋 Total Conversations:</strong> {conversations.length}
            </Text>
          </div>

          {pendingConversation && (
            <div className={styles.pendingNotification}>
              <div className={styles.pendingNotificationText}>
                🔔 New conversation: {pendingConversation.info.friendlyName}
              </div>
              <Button
                appearance="primary"
                onClick={() => acceptConversation(pendingConversation)}
              >
                Accept
              </Button>
            </div>
          )}

          <div className={styles.conversationList}>
            {conversations.length === 0 ? (
              <div className={styles.waitingMessage}>
                <Text>No conversations available.</Text>
                <Text size={300}>Waiting for incoming conversations...</Text>
              </div>
            ) : (
              conversations.map((conv) => {
                let customerName = 'Unknown Customer';
                let customerEmail = '';

                try {
                  const attrs = conv.attributes
                    ? (typeof conv.attributes === 'string' ? JSON.parse(conv.attributes) : conv.attributes)
                    : {};
                  customerName = attrs.customerName || 'Unknown Customer';
                  customerEmail = attrs.customerEmail || '';
                } catch (e) {
                  console.error('Error parsing conversation attributes:', e);
                }

                return (
                  <div
                    key={conv.sid}
                    className={styles.conversationItem}
                    onClick={() => handleJoinConversation(conv.sid)}
                  >
                    <Button
                      appearance="subtle"
                      size="small"
                      icon={<span>×</span>}
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.sid);
                      }}
                      title="Delete conversation"
                    />
                    <div className={styles.conversationInfo}>
                      <Text weight="semibold" size={400}>
                        {conv.friendlyName || 'Untitled Conversation'}
                      </Text>
                      <br />
                      <Text size={300}>
                        <strong>Customer:</strong> {customerName}
                        {customerEmail && ` (${customerEmail})`}
                      </Text>
                      <br />
                      <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                        {conv.sid}
                      </Text>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Conversation View - Show active conversation
  if (currentView === 'conversation' && conversation) {
    return (
      <div className={styles.container}>
        <div className={styles.chatContainer}>
          <Button
            appearance="transparent"
            size="small"
            onClick={() => setCurrentView('dashboard')}
            className={styles.backButton}
          >
            ← Back to Dashboard
          </Button>

          {pendingConversation && (
            <div className={styles.pendingNotification}>
              <div className={styles.pendingNotificationText}>
                🔔 New conversation: {pendingConversation.info.friendlyName}
              </div>
              <Button
                appearance="primary"
                onClick={() => acceptConversation(pendingConversation)}
              >
                Accept Conversation
              </Button>
            </div>
          )}

          <div className={styles.infoSection}>
            <Text weight="semibold">👤 Logged in as: </Text>
            <Text>{currentIdentity}</Text>
            <br />
            <Text weight="semibold">💬 Active Conversation: </Text>
            <Text style={{ fontSize: '11px' }}>{activeConversationSid}</Text>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((msg, index) => {
              // Check if it's a system message
              const isSystemMessage = msg.body.startsWith('✅') || msg.body.includes('agent has been notified') || msg.body.includes('has closed the conversation');
              const displayName = getFriendlyName(msg.author);

              return (
                <div
                  key={index}
                  className={`${styles.message} ${
                    isSystemMessage
                      ? styles.messageSystem
                      : msg.author === currentIdentity
                      ? styles.messageMe
                      : styles.messageOther
                  }`}
                >
                  {!isSystemMessage && (
                    <>
                      <div className={styles.messageAuthor}>{displayName}</div>
                      <div className={styles.messageBody}>{msg.body}</div>
                      <div className={styles.messageTime}>
                        {msg.dateCreated.toLocaleTimeString()}
                      </div>
                    </>
                  )}
                  {isSystemMessage && (
                    <div className={styles.messageBody}>{msg.body}</div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <Textarea
              className={styles.inputField}
              value={messageInput}
              onChange={(_, data) => setMessageInput(data.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              resize="vertical"
              appearance="outline"
            />
            <Button
              appearance="primary"
              icon={<Send24Regular />}
              onClick={handleSendMessage}
              className={styles.sendButton}
              disabled={!messageInput.trim()}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default view - show dashboard
  return (
    <div className={styles.container}>
      <div className={styles.dashboardPage}>
        <div className={styles.waitingMessage}>
          <Spinner size="large" />
          <Text>Initializing...</Text>
        </div>
      </div>
    </div>
  );
};

export default TwilioAgentPanel;
