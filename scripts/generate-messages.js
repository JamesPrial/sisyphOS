#!/usr/bin/env node

/**
 * Message Generation Script for SisyphOS
 *
 * Uses Ollama to generate philosophical/absurdist messages at build time.
 * Saves generated content to JSON file for runtime use.
 *
 * Usage: node scripts/generate-messages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import AI service (using relative path from scripts/ to src/)
const aiServicePath = path.join(__dirname, '../src/services/aiService.js');
const aiService = await import(aiServicePath);

const OUTPUT_PATH = path.join(__dirname, '../src/data/generated-philosophy.json');

// Configuration for message generation
const MESSAGE_CONFIG = {
  notifications: { count: 30, description: 'Philosophy notifications' },
  errors: { count: 25, description: 'Absurdist error messages' },
  boot: { count: 20, description: 'System boot messages' },
  advisor: { count: 40, description: 'Advisor response templates' },
  clippy: { count: 25, description: 'Clippy helper tips' },
};

/**
 * Main generation function
 */
async function generateAllMessages() {
  console.log('\n🧠 SisyphOS Message Generator');
  console.log('================================\n');

  // Check Ollama connection
  console.log('Checking Ollama connection...');
  const isConnected = await aiService.checkOllamaConnection();

  if (!isConnected) {
    console.error('❌ ERROR: Ollama is not running!');
    console.error('');
    console.error('Please start Ollama before running this script:');
    console.error('  1. Install Ollama: https://ollama.ai');
    console.error('  2. Run: ollama pull llama3.2:1b  # Fast model for batch generation');
    console.error('  3. Run: ollama pull llama3.2:3b  # Better quality for chat');
    console.error('  4. Ollama should auto-start on port 11434');
    console.error('');
    console.error('Alternatively, build will use static fallback messages.');
    process.exit(1);
  }

  console.log('✅ Ollama connected!\n');

  const generatedMessages = {
    _metadata: {
      generatedAt: new Date().toISOString(),
      model: 'llama3.2:1b', // Fast model for batch generation
      totalMessages: 0,
    },
  };

  let totalGenerated = 0;

  // Generate messages for each category
  for (const [category, config] of Object.entries(MESSAGE_CONFIG)) {
    console.log(`\n📝 Generating ${config.count} ${config.description}...`);
    console.log('─'.repeat(50));

    try {
      const messages = await aiService.generateMessageBatch(category, config.count);
      generatedMessages[category] = messages;
      totalGenerated += messages.length;

      console.log(`✅ Generated ${messages.length} ${category} messages`);

      // Show a sample
      if (messages.length > 0) {
        console.log(`   Sample: "${messages[0].substring(0, 80)}${messages[0].length > 80 ? '...' : ''}"`);
      }
    } catch (error) {
      console.error(`❌ Failed to generate ${category}:`, error.message);
      generatedMessages[category] = [];
    }
  }

  // Update metadata
  generatedMessages._metadata.totalMessages = totalGenerated;

  // Save to file
  console.log('\n💾 Saving messages to file...');
  try {
    const jsonContent = JSON.stringify(generatedMessages, null, 2);
    fs.writeFileSync(OUTPUT_PATH, jsonContent, 'utf-8');
    console.log(`✅ Saved to: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Failed to save file:', error.message);
    process.exit(1);
  }

  // Summary
  console.log('\n📊 Generation Summary');
  console.log('================================');
  console.log(`Total messages: ${totalGenerated}`);
  console.log(`Categories: ${Object.keys(MESSAGE_CONFIG).length}`);
  console.log(`Output file: ${OUTPUT_PATH}`);
  console.log(`File size: ${(fs.statSync(OUTPUT_PATH).size / 1024).toFixed(2)} KB`);
  console.log('\n✨ Message generation complete!\n');
}

/**
 * Run the generator
 */
generateAllMessages().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
