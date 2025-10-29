const { StorageManager } = require('../storage');

/**
 * appendVibeHistory 函数：将单个聊天记录添加到指定的 conversation 中
 * @param {string} conversationName - conversation 名称
 * @param {Object} singleChat - 单个聊天记录对象，格式：{role: "user"|"assistant"|"tool", content: xxxx}
 */
async function appendVibeHistory(conversationName, singleChat) {
  const storage = new StorageManager();
  
  try {
    // 初始化存储目录
    await storage.initialize();
    
    // 验证 singleChat 格式
    if (!singleChat || typeof singleChat !== 'object') {
      throw new Error('Invalid singleChat format: must be an object');
    }
    
    if (!singleChat.role || !['user', 'assistant', 'tool'].includes(singleChat.role)) {
      throw new Error('Invalid role: must be one of "user", "assistant", "tool"');
    }
    
    if (singleChat.content === undefined || singleChat.content === null) {
      throw new Error('Invalid content: content field is required');
    }
    
    // 读取现有的 conversation 数据
    const conversation = await storage.readConversation(conversationName);
    
    // 确保 conversation 结构正确
    if (!conversation.content) {
      conversation.content = { chat_list: [] };
    }
    if (!conversation.content.chat_list) {
      conversation.content.chat_list = [];
    }
    
    // 添加新的 chat 记录到 chat_list 末尾
    conversation.content.chat_list.push(singleChat);
    
    // 保存更新后的 conversation
    await storage.writeConversation(conversationName, conversation);
    
    // 按 FIFO 逻辑更新 meta.json 中的 latest_conversation
    await storage.updateLatestConversation(conversationName);
    
    console.log(`✅ Successfully appended chat to conversation "${conversationName}"`);
    console.log(`   Role: ${singleChat.role}`);
    console.log(`   Content: ${typeof singleChat.content === 'string' ? singleChat.content.slice(0, 100) + '...' : JSON.stringify(singleChat.content).slice(0, 100) + '...'}`);
    
  } catch (error) {
    console.error(`❌ Failed to append vibe history: ${error.message}`);
    throw error;
  }
}

module.exports = { appendVibeHistory };
