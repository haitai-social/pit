import * as path from 'path';
import { appendVibeHistory } from '../core/vibeHistory.js';
import { StorageManager } from '../storage/index.js';
import { RoleEnum, SingleChat, CommandOptions } from '../types/index.js';

/**
 * add 命令处理器
 * 处理 `pit add [--conversation conv_name] <role> <content>` 命令
 */
export async function addCommand(role: string, content: string, options: CommandOptions): Promise<void> {
  try {
    // 验证必需参数
    if (!role) {
      console.error('❌ Error: <role> parameter is required');
      console.log('Usage: pit add [--conversation conv_name] <role> <content>');
      process.exit(1);
    }

    if (!content) {
      console.error('❌ Error: <content> parameter is required');
      console.log('Usage: pit add [--conversation conv_name] <role> <content>');
      process.exit(1);
    }

    // 验证 role 参数
    const validRoles: RoleEnum[] = ['user', 'assistant', 'tool'];
    if (!validRoles.includes(role as RoleEnum)) {
      console.error(`❌ Error: Invalid role "${role}". Must be one of: ${validRoles.join(', ')}`);
      process.exit(1);
    }

    const storage = new StorageManager();
    
    // 初始化存储目录
    await storage.initialize();

    // 确定 conversation 名称
    const conversationName = await determineConversationName(storage, options.conversation, content);

    console.log(`📝 Adding chat record to conversation: "${conversationName}"`);
    console.log(`   Role: ${role}`);
    console.log(`   Content: ${content.length > 100 ? content.slice(0, 100) + '...' : content}`);

    // 构造 singleChat 结构
    const singleChat: SingleChat = {
      role: role as RoleEnum,
      content: content
    };

    // 调用 appendVibeHistory 方法
    await appendVibeHistory(conversationName, singleChat);

    console.log(`\n🎉 Successfully added chat record to "${conversationName}"!`);

  } catch (error) {
    console.error(`❌ Failed to add chat record: ${(error as Error).message}`);
    process.exit(1);
  }
}

/**
 * 确定要使用的 conversation 名称
 */
async function determineConversationName(storage: StorageManager, specifiedConversation: string | undefined, content: string): Promise<string> {
  // 如果指定了 conversation 名称，直接使用
  if (specifiedConversation) {
    return specifiedConversation;
  }

  try {
    // 尝试读取 meta.json
    const meta = await storage.readMeta();
    
    // 如果 conversation_queue 存在且非空，使用第一个
    if (meta.conversation_queue && meta.conversation_queue.length > 0) {
      const latestFile = meta.conversation_queue[0];
      // 返回文件名（去掉 .json 扩展名）
      return path.basename(latestFile, '.json');
    }
    
    // 如果 conversation_queue 为空，创建默认 conversation
    return await createDefaultConversation(storage, content);
    
  } catch (error) {
    // 如果读取 meta.json 失败（比如文件不存在），创建默认 conversation
    return await createDefaultConversation(storage, content);
  }
}

/**
 * 创建默认的 conversation
 */
async function createDefaultConversation(storage: StorageManager, content: string): Promise<string> {
  // 使用 content 的前20个字符作为默认名称
  const defaultName = content.slice(0, 20).replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '-');
  
  // 确保名称不为空
  const conversationName = defaultName || 'default_conversation';
  
  console.log(`🆕 Creating new default conversation: "${conversationName}"`);
  
  // 更新 meta.json 中的 conversation_queue
  try {
    const meta = await storage.readMeta();
    const fileName = `${conversationName}.json`;
    
    // 如果列表中还没有这个文件，添加到开头
    if (!meta.conversation_queue.includes(fileName)) {
      meta.conversation_queue.unshift(fileName);
    }
    
    await storage.writeMeta(meta);
  } catch (error) {
    // 如果读取失败，创建新的 meta.json
    const newMeta = {
      conversation_queue: [`${conversationName}.json`]
    };
    await storage.writeMeta(newMeta);
  }
  
  return conversationName;
}
