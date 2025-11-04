import * as path from 'path';
import { appendVibeHistory } from '../core/vibe-history.js';
import { StorageManager } from '../storage/index.js';
import { CommandOptions } from '../types/index.js';
import { SingleChatSchema } from '@haitai-social/pit-history-utils';
import { ROLE_ENUM } from '@haitai-social/pit-history-utils/dist/types/single-chat.js';
import { IDE_NAME_ENUM } from '@haitai-social/pit-history-utils/dist/types/vibe-history-content.js';

export async function addCommand(role: string, name: string, content: string, options: CommandOptions): Promise<void> {
  try {
    if (!role) {
      console.error('❌ Error: <role> parameter is required');
      console.log('Usage: pit add [--conversation conv_name] <role> <name> <content>');
      process.exit(1);
    }

    if (!name) {
      console.error('❌ Error: <name> parameter is required');
      console.log('Usage: pit add [--conversation conv_name] <role> <name> <content>');
      process.exit(1);
    }

    if (!content) {
      console.error('❌ Error: <content> parameter is required');
      console.log('Usage: pit add [--conversation conv_name] <role> <name> <content>');
      process.exit(1);
    }

    const validRoles: typeof ROLE_ENUM[number][] = ['user', 'assistant', 'tool'];
    if (!validRoles.includes(role as typeof ROLE_ENUM[number])) {
      console.error(`❌ Error: Invalid role "${role}". Must be one of: ${validRoles.join(', ')}`);
      process.exit(1);
    }

    const storage = new StorageManager();
    await storage.initialize();

    const conversationName = await determineConversationName(storage, options.conversation, content);

    console.log(`📝 Adding chat record to conversation: "${conversationName}"`);
    console.log(`   Role: ${role}`);
    console.log(`   Name: ${name}`);
    console.log(`   Content: ${content.length > 100 ? content.slice(0, 100) + '...' : content}`);

    const singleChat = SingleChatSchema.parse({
      role: role as typeof ROLE_ENUM[number],
      name: name,
      content: content,
      is_select: true
    });

    await appendVibeHistory(conversationName, singleChat);

    console.log(`\n🎉 Successfully added chat record to "${conversationName}"!`);

  } catch (error) {
    console.error(`❌ Failed to add chat record: ${(error as Error).message}`);
    process.exit(1);
  }
}

async function determineConversationName(storage: StorageManager, specifiedConversation: string | undefined, content: string): Promise<string> {
  if (specifiedConversation) {
    return specifiedConversation;
  }

  try {
    const meta = await storage.readMeta();
    if (meta.conversation_queue && meta.conversation_queue.length > 0) {
      const latestFile = meta.conversation_queue[0];
      return path.basename(latestFile, '.json');
    }
    return await createDefaultConversation(storage, content);
  } catch (error) {
    return await createDefaultConversation(storage, content);
  }
}

async function createDefaultConversation(storage: StorageManager, content: string): Promise<string> {
  const defaultName = content.slice(0, 20).replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '-');
  const conversationName = defaultName || 'default_conversation';
  console.log(`🆕 Creating new default conversation: "${conversationName}"`);
  try {
    const meta = await storage.readMeta();
    const fileName = `${conversationName}.json`;
    if (!meta.conversation_queue.includes(fileName)) {
      meta.conversation_queue.unshift(fileName);
    }
    await storage.writeMeta(meta);
  } catch (error) {
    const newMeta = {
      conversation_queue: [`${conversationName}.json`],
      current_ide: 'cursor' as typeof IDE_NAME_ENUM[number]
    };
    await storage.writeMeta(newMeta);
  }
  return conversationName;
}
