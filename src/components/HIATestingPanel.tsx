import {
  Button,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  Textarea,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

import { CIFV2 } from '../cif/CIFV2';
import React from 'react';
import { SendRegular } from '@fluentui/react-icons';
import { Utils } from '../common/utility/Utils';

interface Message {
  id: string;
  user: 'customer' | 'agent';
  speakerName: string;
  text: string;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('12px'),
    height: '100%',
    boxSizing: 'border-box',
  },
  transcriptContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius('8px'),
    ...shorthands.padding('12px'),
    overflowY: 'auto',
    marginBottom: '12px',
  },
  transcriptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px',
    marginTop: 'auto',
  },
  messageBubble: {
    maxWidth: '70%',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.borderRadius('12px'),
    wordBreak: 'break-word',
  },
  customerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: tokens.colorNeutralBackground4,
    ...shorthands.borderRadius('12px', '12px', '12px', '4px'),
  },
  agentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.borderRadius('12px', '12px', '4px', '12px'),
  },
  messageSender: {
    fontSize: '11px',
    marginBottom: '2px',
    opacity: 0.7,
  },
  messageText: {
    fontSize: '14px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px',
    flexShrink: 0,
  },
  messageInputRow: {
    display: 'flex',
    columnGap: '10px',
    alignItems: 'flex-end',
  },
  messageInput: {
    flexGrow: 1,
    minHeight: '60px',
  },
  radioGroupContainer: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
  },
  resultArea: {
    minHeight: '60px',
    fontFamily: 'monospace',
    fontSize: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding('10px'),
    ...shorthands.borderRadius('4px'),
    overflowY: 'auto',
    maxHeight: '100px',
  },
  label: {
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  emptyTranscript: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: tokens.colorNeutralForeground3,
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

const ADD_MESSAGE_API_URL = 'https://poc-3p-message-api-esbee0dddzh5czd5.westus-01.azurewebsites.net/api/AddMessage';
const GET_MESSAGES_API_URL = 'https://poc-3p-message-api-esbee0dddzh5czd5.westus-01.azurewebsites.net/api/GetMessages';

const HIATestingPanel: React.FC = () => {
  const styles = useStyles();
  const [messageText, setMessageText] = React.useState<string>('');
  const [userType, setUserType] = React.useState<'customer' | 'agent'>('customer');
  const [result, setResult] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [transcript, setTranscript] = React.useState<Message[]>([]);
  const [isLoadingTranscript, setIsLoadingTranscript] = React.useState<boolean>(false);

  const fetchTranscript = async () => {
    setIsLoadingTranscript(true);
    try {
      const response = await fetch(GET_MESSAGES_API_URL);
      if (response.ok) {
        const responseBody = await response.json();
        const messages: Message[] = responseBody.messages ?? [];
        // Sort messages in descending order (newest first)
        //const sortedMessages = messages.sort((a, b) => Number(b.id) - Number(a.id));
        setTranscript(messages);
      }
    } catch (error) {
      console.error('Failed to fetch transcript:', error);
    } finally {
      setIsLoadingTranscript(false);
    }
  };

  // Fetch transcript on component mount
  React.useEffect(() => {
    fetchTranscript();
  }, []);

  const getSpeakerName = (user: 'customer' | 'agent'): string => {
    return user === 'customer' ? 'Customer' : '# Aurora User';
  };

  const generateMessageId = (): string => {
    return Date.now().toString();
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      setResult('Error: Please enter a message!');
      return;
    }

    if (!Utils.isCIFAvailable()) {
      setResult('Error: CIF is not available!');
      return;
    }

    setIsLoading(true);
    setResult('');

    const messageId = generateMessageId();
    const speakerName = getSpeakerName(userType);

    const message = {
      id: messageId,
      user: userType,
      speakerName: speakerName,
      text: messageText.trim(),
    };

    try {
      // Step 1: Call the AddMessage API
      setResult('Calling AddMessage API...');
      const apiResponse = await fetch(ADD_MESSAGE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!apiResponse.ok) {
        throw new Error(`AddMessage API failed with status: ${apiResponse.status}`);
      }

      setResult('AddMessage API called successfully. Raising CIF event...');

      // Step 2: Build the CIF event payload with only the current message
      const cifPayload = {
        conversationId: '73265873246328746478346384',
        channelId: 'lcw',
        correlationId: 'test-correlation-002',
        messages: [message],
      };

      // Step 3: Raise the CIF event
      const cifResponse = await CIFV2.getInstance().raiseEvent(
        'ChatAssistIntentRequest',
        JSON.stringify(cifPayload)
      );

      setResult(
        `Success!\n\nMessage sent:\n${JSON.stringify(message, null, 2)}\n\nCIF Payload:\n${JSON.stringify(cifPayload, null, 2)}\n\nCIF Response: ${cifResponse}`
      );

      // Refresh transcript after sending message
      await fetchTranscript();

      // Clear the input after successful send
      setMessageText('');
    } catch (error) {
      setResult(`Error: ${(error as Error).message || 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading && messageText.trim()) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.container}>
      {/* <Text size={500} className={styles.label}>
        Transcript
      </Text> */}

      <div className={styles.transcriptContainer}>
        {isLoadingTranscript ? (
          <div className={styles.loadingContainer}>
            <Spinner size="small" label="Loading transcript..." />
          </div>
        ) : transcript.length === 0 ? (
          <div className={styles.emptyTranscript}>
            {/* <Text>No messages yet. Start a conversation!</Text> */}
          </div>
        ) : (
          <div className={styles.messageList}>
            {transcript.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageBubble} ${
                  msg.user === 'customer' ? styles.customerMessage : styles.agentMessage
                }`}
              >
                <div className={styles.messageSender}>{msg.speakerName}</div>
                <div className={styles.messageText}>{msg.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <Text size={500} className={styles.label}>
        Send Message
      </Text> */}

      <div className={styles.inputContainer}>
       

        <div className={styles.messageInputRow}>
          <Textarea
            className={styles.messageInput}
            value={messageText}
            onChange={(_, data) => setMessageText(data.value)}
            placeholder="Type your message..."
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            resize="vertical"
          />
         
        </div>
      </div>
       <div className={styles.radioGroupContainer}>
          {/* <Text className={styles.sectionLabel}>Send as:</Text> */}
          <RadioGroup
            layout="horizontal"
            value={userType}
            onChange={(_, data) => setUserType(data.value as 'customer' | 'agent')}
          >
            <Radio value="customer" label="Customer" />
            <Radio value="agent" label="Agent" />
          </RadioGroup>
           <Button
            appearance="primary"
            icon={<SendRegular />}
            onClick={handleSendMessage}
            disabled={isLoading || !messageText.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>

      {/* {result && (
        <>
          <Text size={400} className={styles.label}>
            Result:
          </Text>
          <pre className={styles.resultArea}>{result}</pre>
        </>
      )} */}
    </div>
  );
};

export default HIATestingPanel;
