import { SingleChatType } from '@haitai-social/pit-history-utils';
import { StorageManager } from '../storage/index.js';

export async function appendVibeHistory(conversationName: string, singleChat: SingleChatType): Promise<void> {
  const storage = new StorageManager();

  try {
    await storage.initialize();

    if (!singleChat || typeof singleChat !== 'object') {
      throw new Error('Invalid singleChat format: must be an object');
    }
    if (singleChat.content === undefined || singleChat.content === null) {
      throw new Error('Invalid content: content field is required');
    }
    if (!singleChat.name || typeof singleChat.name !== 'string') {
      throw new Error('Invalid name: name field is required and must be a string');
    }
    singleChat.is_select = true

    const conversation = await storage.readConversation(conversationName);
    conversation.appendChatHistory(singleChat);
    await storage.writeConversation(conversationName, conversation);
    await storage.updateLatestConversation(conversationName);
    
    console.log(`✅ Successfully appended chat to conversation "${conversationName}"`);
    console.log(`   Role: ${singleChat.role}`);
    const contentPreview = typeof singleChat.content === 'string' 
      ? singleChat.content.slice(0, 100) + '...' 
      : JSON.stringify(singleChat.content).slice(0, 100) + '...';
    console.log(`   Content: ${contentPreview}`);
    
  } catch (error) {
    console.error(`❌ Failed to append vibe history: ${(error as Error).message}`);
    throw error;
  }
}
