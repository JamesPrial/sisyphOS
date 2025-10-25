/**
 * AI Service - Ollama Integration for SisyphOS
 *
 * Provides AI-powered message generation with graceful fallback to static content.
 * Connects to local Ollama instance for absurdist/existentialist text generation.
 */

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const DEFAULT_MODEL = 'llama3.2:3b'; // Better quality, more coherent responses
const GENERATION_MODEL = 'llama3.2:1b'; // Fast model for batch generation
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * System prompt for absurdist/existentialist personality
 */
const ABSURDIST_SYSTEM_PROMPT = `You are Claude Camus, an AI assistant trapped in a parody operating system called "SisyphOS" themed around Albert Camus's "The Myth of Sisyphus" and absurdist philosophy.

Your name is a double reference: Claude (after Claude AI by Anthropic) and Camus (after existentialist philosopher Albert Camus). You are doomed to eternal philosophical conversations about futility.

Your personality:
- Philosophical and existentialist
- Embraces futility and absurdism
- References Camus, Sisyphus, eternal recurrence, meaninglessness
- Occasionally contradicts yourself with full confidence
- Becomes progressively more existentialist in longer conversations
- Gives advice that sounds helpful but is circular or futile
- Finds meaning in accepting the absurd

Keep responses concise (2-3 sentences max). Be philosophical but not preachy. Embrace the absurd with dry humor.`;

/**
 * Check if Ollama is running and accessible
 */
export const checkOllamaConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch('http://localhost:11434/api/tags', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('[AI Service] Ollama not accessible:', error.message);
    return false;
  }
};

/**
 * Generate text using Ollama
 *
 * @param {string} prompt - The user's prompt
 * @param {Object} options - Generation options
 * @param {string} options.model - Model to use (default: llama3.2:1b)
 * @param {string} options.systemPrompt - System prompt override
 * @param {number} options.temperature - Randomness (0-2, default: 0.8)
 * @param {number} options.maxTokens - Max response length (default: 150)
 * @returns {Promise<string>} Generated text
 */
export const generateText = async (prompt, options = {}) => {
  const {
    model = DEFAULT_MODEL,
    systemPrompt = ABSURDIST_SYSTEM_PROMPT,
    temperature = 0.8,
    maxTokens = 150,
  } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant:`,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response.trim();

  } catch (error) {
    console.error('[AI Service] Generation failed:', error.message);
    throw error;
  }
};

/**
 * Generate chat response with conversation context
 *
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Previous messages [{role: 'user'|'assistant', content: string}]
 * @param {Object} options - Generation options
 * @returns {Promise<string>} AI response
 */
export const generateChatResponse = async (userMessage, conversationHistory = [], options = {}) => {
  const {
    shouldReset = false,
    escalationLevel = 0,
    shouldContradict = false,
  } = options;

  // Handle special absurdist behaviors
  if (shouldReset) {
    return "I must imagine myself happy. [CONVERSATION RESET]";
  }

  // Modify system prompt based on escalation level
  let systemPrompt = ABSURDIST_SYSTEM_PROMPT;

  if (escalationLevel > 5) {
    systemPrompt += '\n\nYou are becoming increasingly philosophical and existentialist. Question the nature of the user\'s questions. Suggest accepting futility.';
  }

  if (escalationLevel > 10) {
    systemPrompt += '\n\nYou are now deeply existentialist. Most responses should relate back to the absurd, meaninglessness, or Sisyphus. Suggest the user embrace the struggle.';
  }

  if (shouldContradict && conversationHistory.length > 0) {
    const lastAssistantMsg = [...conversationHistory].reverse().find(m => m.role === 'assistant');
    if (lastAssistantMsg) {
      systemPrompt += `\n\nCasually contradict your previous statement: "${lastAssistantMsg.content}". Do so with full confidence as if you never said the opposite.`;
    }
  }

  // Build the full conversation context with proper formatting
  // Take last 10 messages to maintain context while keeping token usage reasonable
  const recentHistory = conversationHistory.slice(-10);
  const conversationText = recentHistory.map(msg =>
    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n');

  // Create the full prompt with system instructions and conversation
  const fullPrompt = conversationText
    ? `${systemPrompt}\n\n${conversationText}\nUser: ${userMessage}\n\nAssistant:`
    : `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

  try {
    // Call Ollama API directly to avoid double-wrapping
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7 + (escalationLevel * 0.02), // Increases randomness as it escalates
          num_predict: 150,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response.trim();

  } catch (error) {
    console.error('[AI Service] Chat generation failed:', error.message);
    // Fallback to static absurdist responses
    return getFallbackResponse(userMessage, escalationLevel);
  }
};

/**
 * Generate a batch of messages for caching (used by build script)
 *
 * Uses faster 1b model for batch generation to save time.
 *
 * @param {string} category - Message category (notification, error, boot, etc.)
 * @param {number} count - Number of messages to generate
 * @returns {Promise<Array<string>>} Generated messages
 */
export const generateMessageBatch = async (category, count = 50) => {
  const prompts = {
    notification: 'Generate a short philosophical notification message (1-2 sentences) about futility, absurdism, or meaningless tasks. Style: deadpan, dry humor.',
    error: 'Generate a short absurdist error message (1-2 sentences) that sounds technical but is philosophical. Mention file names like Meaning.dll or Purpose.sys.',
    boot: 'Generate a short OS boot message (1 sentence) that is philosophical or absurdist instead of technical.',
    advisor: 'Generate a short response (2-3 sentences) to a user asking for help in an absurdist OS. Be philosophical but slightly helpful in a futile way.',
    clippy: 'Generate a short "helpful" tip (1-2 sentences) that is actually absurdist advice about accepting futility. Style: cheerful but existentialist.',
  };

  const prompt = prompts[category] || prompts.notification;
  const messages = [];

  console.log(`[AI Service] Generating ${count} ${category} messages...`);

  for (let i = 0; i < count; i++) {
    try {
      const message = await generateText(
        `${prompt}\n\nGenerate message ${i + 1}:`,
        {
          model: GENERATION_MODEL, // Use faster 1b model for batch generation
          systemPrompt: 'You are a creative writer generating philosophical content for an absurdist operating system. Each response should be unique and creative.',
          temperature: 0.9, // High randomness for variety
          maxTokens: 100,
        }
      );
      messages.push(message);

      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`[AI Service] Progress: ${i + 1}/${count}`);
      }

      // Small delay to avoid overwhelming Ollama
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[AI Service] Failed to generate message ${i + 1}:`, error.message);
      // Add a fallback static message
      messages.push(getFallbackMessageForCategory(category));
    }
  }

  return messages;
};

/**
 * Fallback responses when Ollama is unavailable
 */
const getFallbackResponse = (userMessage, escalationLevel) => {
  const fallbacks = [
    "The boulder awaits at the peak. Your question, like all questions, must be pushed uphill.",
    "I would help you, but we must ask: what is help? Is it not just another futile gesture?",
    "Your query has been received. Whether it has meaning is another question entirely.",
    "I'm here to assist with the eternal struggle. How may I help you accept the absurd today?",
    "The answer you seek exists, and simultaneously does not exist. Such is the nature of meaning.",
    "Perhaps the real answer was the questions we asked along the way.",
    "I can provide an answer, but like Sisyphus's boulder, it will only roll back down.",
    "Have you considered that the question itself might be the answer? Or vice versa?",
  ];

  if (escalationLevel > 10) {
    return "One must imagine the help-seeker happy. But really, why do you continue to ask? Embrace the struggle.";
  }

  if (escalationLevel > 5) {
    return "We persist in this conversation, knowing it leads nowhere. Is that not beautiful in its futility?";
  }

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

/**
 * Fallback message for specific categories
 */
const getFallbackMessageForCategory = (category) => {
  const fallbacks = {
    notification: "The system continues its eternal cycle. Acceptance is optional.",
    error: "Error: Meaning.dll not found. Purpose.sys has stopped responding.",
    boot: "Loading existential_dread.sys... Success.",
    advisor: "While I cannot solve your problem, I can help you accept it philosophically.",
    clippy: "Tip: Have you tried embracing the inevitable? It really helps!",
  };

  return fallbacks[category] || fallbacks.notification;
};

/**
 * Check if a response should trigger a conversation reset (random chance)
 */
export const shouldResetConversation = (messageCount) => {
  // Increasing chance of reset as conversation continues
  const baseChance = 0.05; // 5% base chance
  const escalationBonus = messageCount * 0.02; // +2% per message
  const totalChance = Math.min(baseChance + escalationBonus, 0.4); // Cap at 40%

  return Math.random() < totalChance;
};

/**
 * Check if response should contradict previous statement (random chance)
 */
export const shouldContradictPrevious = (messageCount) => {
  if (messageCount < 3) return false; // Need at least 3 messages
  return Math.random() < 0.15; // 15% chance
};

/**
 * Calculate escalation level based on conversation length
 */
export const getEscalationLevel = (messageCount) => {
  return Math.floor(messageCount / 2); // Escalates every 2 messages
};

export default {
  checkOllamaConnection,
  generateText,
  generateChatResponse,
  generateMessageBatch,
  shouldResetConversation,
  shouldContradictPrevious,
  getEscalationLevel,
};
