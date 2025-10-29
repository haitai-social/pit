const fs = require('fs-extra');
const path = require('path');

class StorageManager {
  constructor() {
    this.workspace = this.findWorkspace();
    this.pitDir = path.join(this.workspace, '.pit');
    this.metaFile = path.join(this.pitDir, 'meta.json');
  }

  /**
   * 查找 workspace 路径
   * 优先找到 .git 所在文件夹，否则使用当前工作目录
   */
  findWorkspace() {
    let currentDir = process.cwd();

    // 向上查找 .git 目录
    while (currentDir !== path.dirname(currentDir)) {
      const gitPath = path.join(currentDir, '.git');
      if (fs.existsSync(gitPath)) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }

    // 如果没有找到 .git，使用当前工作目录
    return process.cwd();
  }

  /**
   * 初始化 .pit 目录和 meta.json 文件
   */
  async initialize() {
    try {
      await fs.ensureDir(this.pitDir);
      
      // 检查 meta.json 是否存在，不存在则创建
      if (!(await fs.pathExists(this.metaFile))) {
        const initialMeta = {
          latest_conversation: []
        };
        await fs.writeJson(this.metaFile, initialMeta, { spaces: 2 });
      }
    } catch (error) {
      throw new Error(`Failed to initialize storage: ${error.message}`);
    }
  }

  /**
   * 读取 meta.json 文件
   */
  async readMeta() {
    try {
      return await fs.readJson(this.metaFile);
    } catch (error) {
      throw new Error(`Failed to read meta file: ${error.message}`);
    }
  }

  /**
   * 写入 meta.json 文件
   */
  async writeMeta(data) {
    try {
      await fs.writeJson(this.metaFile, data, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to write meta file: ${error.message}`);
    }
  }

  /**
   * 读取 conversation 文件
   */
  async readConversation(conversationName) {
    const conversationPath = path.join(this.pitDir, `${conversationName}.json`);
    try {
      if (await fs.pathExists(conversationPath)) {
        return await fs.readJson(conversationPath);
      } else {
        // 如果文件不存在，创建新的 conversation 结构
        const newConversation = {
          version: "v0",
          content: {
            chat_list: []
          }
        };
        await fs.writeJson(conversationPath, newConversation, { spaces: 2 });
        return newConversation;
      }
    } catch (error) {
      throw new Error(`Failed to read conversation ${conversationName}: ${error.message}`);
    }
  }

  /**
   * 写入 conversation 文件
   */
  async writeConversation(conversationName, data) {
    const conversationPath = path.join(this.pitDir, `${conversationName}.json`);
    try {
      await fs.writeJson(conversationPath, data, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to write conversation ${conversationName}: ${error.message}`);
    }
  }

  /**
   * 更新 latest_conversation 列表（FIFO 逻辑）
   */
  async updateLatestConversation(conversationName) {
    try {
      const meta = await this.readMeta();
      const fileName = `${conversationName}.json`;
      
      // 移除已存在的相同文件名（如果有的话）
      meta.latest_conversation = meta.latest_conversation.filter(name => name !== fileName);
      
      // 添加到列表开头
      meta.latest_conversation.unshift(fileName);
      
      // 如果列表过长，可以限制数量（可选）
      const MAX_RECENT_CONVERSATIONS = 10;
      if (meta.latest_conversation.length > MAX_RECENT_CONVERSATIONS) {
        meta.latest_conversation = meta.latest_conversation.slice(0, MAX_RECENT_CONVERSATIONS);
      }
      
      await this.writeMeta(meta);
    } catch (error) {
      throw new Error(`Failed to update latest conversation: ${error.message}`);
    }
  }
}

module.exports = { StorageManager };
