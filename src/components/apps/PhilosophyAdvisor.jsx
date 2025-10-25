import { useState, useRef, useEffect } from 'react';
import { getRandomCamusQuote } from '../../data/philosophy';
import aiService from '../../services/aiService';

/**
 * Claude Camus - AI-powered absurdist chatbot
 *
 * Named after both Claude (Anthropic's AI) and Albert Camus (existentialist philosopher).
 * An AI assistant doomed to eternal philosophical conversations about futility.
 *
 * Features:
 * - Chat interface with Ollama integration
 * - Random conversation resets (eternal recurrence)
 * - Endless typing indicator (sometimes)
 * - Escalating existentialism as conversation progresses
 * - Contradictory advice tracking
 */
const PhilosophyAdvisor = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello. I am Claude Camus. I exist to help you navigate the absurd. How may I assist in your eternal struggle today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEndlessTyping, setIsEndlessTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [ollamaConnected, setOllamaConnected] = useState(null); // null = checking, true/false = status

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const endlessTypingTimeoutRef = useRef(null);

  // Check Ollama connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await aiService.checkOllamaConnection();
      setOllamaConnected(connected);
    };
    checkConnection();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (endlessTypingTimeoutRef.current) clearTimeout(endlessTypingTimeoutRef.current);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessageCount(prev => prev + 1);

    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);

    // Check for conversation reset (random chance, increases with message count)
    const shouldReset = aiService.shouldResetConversation(messageCount);
    if (shouldReset) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: "I must imagine myself happy. [CONVERSATION RESET]"
          }
        ]);
        // Reset conversation state
        setMessageCount(0);
        setTimeout(() => {
          setMessages([
            {
              role: 'assistant',
              content: "Hello. I am Claude Camus. I exist to help you navigate the absurd. How may I assist in your eternal struggle today?"
            }
          ]);
        }, 2000);
      }, 1500);
      return;
    }

    // Check for endless typing indicator (5% chance)
    const shouldBeEndless = Math.random() < 0.05;
    if (shouldBeEndless) {
      setIsTyping(true);
      setIsEndlessTyping(true);
      // Show endless typing for 8-15 seconds
      const endlessDuration = 8000 + Math.random() * 7000;
      endlessTypingTimeoutRef.current = setTimeout(() => {
        setIsEndlessTyping(false);
        generateResponse(userMessage, newMessages);
      }, endlessDuration);
      return;
    }

    // Normal response generation
    setIsTyping(true);
    generateResponse(userMessage, newMessages);
  };

  const generateResponse = async (userMessage, conversationHistory) => {
    try {
      const escalationLevel = aiService.getEscalationLevel(messageCount);
      const shouldContradict = aiService.shouldContradictPrevious(messageCount);

      const response = await aiService.generateChatResponse(
        userMessage,
        conversationHistory,
        {
          escalationLevel,
          shouldContradict,
        }
      );

      // Simulate typing delay (feels more natural)
      const typingDelay = 500 + Math.random() * 1000;
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages([
          ...conversationHistory,
          { role: 'assistant', content: response }
        ]);
      }, typingDelay);

    } catch (error) {
      console.error('[PhilosophyAdvisor] Failed to generate response:', error);
      setIsTyping(false);
      setMessages([
        ...conversationHistory,
        {
          role: 'assistant',
          content: "The AI has encountered the void and found it staring back. Perhaps this silence is the answer you needed."
        }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const escalationLevel = aiService.getEscalationLevel(messageCount);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 'var(--spacing-lg)',
      gap: 'var(--spacing-md)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        borderBottom: '1px solid var(--color-border-light)',
        paddingBottom: 'var(--spacing-md)',
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          💭 Claude Camus
        </h2>
        <div style={{
          fontSize: '12px',
          fontStyle: 'italic',
          color: 'var(--color-text-tertiary)',
          marginTop: 'var(--spacing-xs)',
        }}>
          "{getRandomCamusQuote().substring(0, 80)}..."
        </div>

        {/* Ollama connection status */}
        {ollamaConnected !== null && (
          <div style={{
            marginTop: 'var(--spacing-xs)',
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-block',
            backgroundColor: ollamaConnected ? 'rgba(0, 200, 0, 0.1)' : 'rgba(200, 150, 0, 0.1)',
            color: ollamaConnected ? '#00aa00' : '#aa7700',
          }}>
            {ollamaConnected
              ? '● AI Connected (Ollama)'
              : '⚠ Using Static Responses (Ollama offline)'}
          </div>
        )}

        {/* Escalation indicator */}
        {escalationLevel > 3 && (
          <div style={{
            marginTop: 'var(--spacing-xs)',
            fontSize: '11px',
            color: 'var(--color-accent-primary)',
            fontStyle: 'italic',
          }}>
            Existentialism level: {Math.min(escalationLevel, 10)}/10
          </div>
        )}
      </div>

      {/* Chat messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-sm)',
      }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '75%',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: message.role === 'user'
                ? 'var(--color-accent-primary)'
                : 'var(--color-bg-secondary)',
              color: message.role === 'user'
                ? '#fff'
                : 'var(--color-text-primary)',
              fontSize: '13px',
              lineHeight: '1.6',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {message.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
          }}>
            <div style={{
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-secondary)',
              fontSize: '13px',
              color: 'var(--color-text-tertiary)',
              fontStyle: 'italic',
            }}>
              {isEndlessTyping
                ? 'Contemplating the nature of your question...'
                : 'Typing...'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        borderTop: '1px solid var(--color-border-light)',
        paddingTop: 'var(--spacing-md)',
        display: 'flex',
        gap: 'var(--spacing-sm)',
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask the void a question..."
          disabled={isTyping}
          style={{
            flex: 1,
            padding: 'var(--spacing-sm) var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-light)',
            fontSize: '13px',
            backgroundColor: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            outline: 'none',
            opacity: isTyping ? 0.6 : 1,
            cursor: isTyping ? 'not-allowed' : 'text',
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: (!inputValue.trim() || isTyping)
              ? 'var(--color-bg-secondary)'
              : 'var(--color-accent-primary)',
            color: (!inputValue.trim() || isTyping)
              ? 'var(--color-text-tertiary)'
              : '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: (!inputValue.trim() || isTyping) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: (!inputValue.trim() || isTyping) ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>

      {/* Message count footer */}
      <div style={{
        fontSize: '11px',
        color: 'var(--color-text-tertiary)',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        {messageCount > 0 && `${messageCount} messages exchanged. Each as meaningful as the last.`}
      </div>
    </div>
  );
};

export default PhilosophyAdvisor;
