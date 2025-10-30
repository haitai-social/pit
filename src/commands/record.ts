import * as fs from 'fs-extra';
import * as path from 'path';
import { appendVibeHistory } from '../core/vibeHistory';
import { SingleChat, CommandOptions } from '../types';

/**
 * JSON文件数据结构
 */
interface JsonData {
  chat_list: SingleChat[];
}

/**
 * record 命令处理器
 * 处理 `pit record --json xxx.json` 命令
 */
export async function recordCommand(options: CommandOptions): Promise<void> {
  try {
    // 检查是否提供了 --json 参数
    if (!options.json) {
      console.error('❌ Error: --json parameter is required');
      console.log('Usage: pit record --json <file.json>');
      process.exit(1);
    }

    const jsonFilePath = path.resolve(options.json);
    
    // 检查 JSON 文件是否存在
    if (!(await fs.pathExists(jsonFilePath))) {
      console.error(`❌ Error: JSON file not found: ${jsonFilePath}`);
      process.exit(1);
    }

    console.log(`📖 Reading JSON file: ${jsonFilePath}`);
    
    // 读取并解析 JSON 文件
    let jsonData: JsonData;
    try {
      jsonData = await fs.readJson(jsonFilePath) as JsonData;
    } catch (error) {
      console.error(`❌ Error: Failed to parse JSON file: ${(error as Error).message}`);
      process.exit(1);
    }

    // 验证 JSON 结构
    if (!jsonData.chat_list || !Array.isArray(jsonData.chat_list)) {
      console.error('❌ Error: Invalid JSON structure. Expected format: {"chat_list": [...]}');
      process.exit(1);
    }

    const chatList = jsonData.chat_list;
    console.log(`📋 Found ${chatList.length} chat records`);

    if (chatList.length === 0) {
      console.log('⚠️  No chat records to process');
      return;
    }

    // 从文件名生成 conversation 名称（去掉扩展名）
    const conversationName = path.basename(jsonFilePath, path.extname(jsonFilePath));
    
    console.log(`🗂️  Processing conversation: "${conversationName}"`);
    console.log('🔄 Appending chat records...');

    // 遍历 chat_list 并调用 appendVibeHistory
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < chatList.length; i++) {
      const singleChat = chatList[i];
      
      try {
        console.log(`   Processing record ${i + 1}/${chatList.length}...`);
        await appendVibeHistory(conversationName, singleChat);
        successCount++;
      } catch (error) {
        console.error(`   ❌ Error processing record ${i + 1}: ${(error as Error).message}`);
        errorCount++;
      }
    }

    // 显示处理结果
    console.log('\n📊 Processing Summary:');
    console.log(`   ✅ Successfully processed: ${successCount} records`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} records`);
    }
    console.log(`   🗂️  Conversation: "${conversationName}"`);

    if (successCount > 0) {
      console.log('\n🎉 All done! Chat records have been saved to your .pit directory.');
    }

  } catch (error) {
    console.error(`❌ Unexpected error: ${(error as Error).message}`);
    process.exit(1);
  }
}
