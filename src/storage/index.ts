import fs from 'fs-extra';
import * as path from 'path';
import { Conversation, Meta } from '../types/index.js';

export class StorageManager {
  private workspace: string;
  private pitDir: string;
  private metaFile: string;

  constructor() {
    this.workspace = this.findWorkspace();
    this.pitDir = path.join(this.workspace, '.pit');
    this.metaFile = path.join(this.pitDir, 'meta.json');
  }

  /**
   * 查找 workspace 路径
   * 优先找 .pit 目录，再找 .git 目录，最后使用当前工作目录
   */
  private findWorkspace(): string {
    let currentDir = process.cwd();

    // 先向上查找 .pit 目录
    let searchDir = currentDir;
    while (searchDir !== path.dirname(searchDir)) {
      const pitPath = path.join(searchDir, '.pit');
      if (fs.pathExistsSync(pitPath)) {
        return searchDir;
      }
      searchDir = path.dirname(searchDir);
    }

    // 再向上查找 .git 目录
    searchDir = currentDir;
    while (searchDir !== path.dirname(searchDir)) {
      const gitPath = path.join(searchDir, '.git');
      if (fs.pathExistsSync(gitPath)) {
        return searchDir;
      }
      searchDir = path.dirname(searchDir);
    }

    // 如果都没有找到，使用当前工作目录
    return process.cwd();
  }

  /**
   * 初始化 .pit 目录和 meta.json 文件
   */
  async initialize(): Promise<void> {
    try {
      await fs.ensureDir(this.pitDir);
      
      // 检查 meta.json 是否存在，不存在则创建
      if (!(await fs.pathExists(this.metaFile))) {
        const initialMeta: Meta = {
          conversation_queue: []
        };
        await fs.writeJson(this.metaFile, initialMeta, { spaces: 2 });
      }
    } catch (error) {
      throw new Error(`Failed to initialize storage: ${(error as Error).message}`);
    }
  }

  /**
   * 读取 meta.json 文件
   */
  async readMeta(): Promise<Meta> {
    try {
      return await fs.readJson(this.metaFile) as Meta;
    } catch (error) {
      throw new Error(`Failed to read meta file: ${(error as Error).message}`);
    }
  }

  /**
   * 写入 meta.json 文件
   */
  async writeMeta(data: Meta): Promise<void> {
    try {
      await fs.writeJson(this.metaFile, data, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to write meta file: ${(error as Error).message}`);
    }
  }

  /**
   * 读取 conversation 文件
   */
  async readConversation(conversationName: string): Promise<Conversation> {
    const conversationPath = path.join(this.pitDir, `${conversationName}.json`);
    try {
      if (await fs.pathExists(conversationPath)) {
        return await fs.readJson(conversationPath) as Conversation;
      } else {
        // 如果文件不存在，创建新的 conversation 结构
        const newConversation: Conversation = {
          version: "v0",
          content: {
            chat_list: []
          }
        };
        await fs.writeJson(conversationPath, newConversation, { spaces: 2 });
        return newConversation;
      }
    } catch (error) {
      throw new Error(`Failed to read conversation ${conversationName}: ${(error as Error).message}`);
    }
  }

  /**
   * 写入 conversation 文件
   */
  async writeConversation(conversationName: string, data: Conversation): Promise<void> {
    const conversationPath = path.join(this.pitDir, `${conversationName}.json`);
    try {
      await fs.writeJson(conversationPath, data, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to write conversation ${conversationName}: ${(error as Error).message}`);
    }
  }

  /**
   * 更新 conversation_queue 列表（FIFO 逻辑）
   */
  async updateLatestConversation(conversationName: string): Promise<void> {
    try {
      const meta = await this.readMeta();
      const fileName = `${conversationName}.json`;
      
      // 移除已存在的相同文件名（如果有的话）
      meta.conversation_queue = meta.conversation_queue.filter(name => name !== fileName);
      
      // 添加到列表开头
      meta.conversation_queue.unshift(fileName);
      
      // 如果列表过长，可以限制数量（可选）
      const MAX_RECENT_CONVERSATIONS = 10;
      if (meta.conversation_queue.length > MAX_RECENT_CONVERSATIONS) {
        meta.conversation_queue = meta.conversation_queue.slice(0, MAX_RECENT_CONVERSATIONS);
      }
      
      await this.writeMeta(meta);
    } catch (error) {
      throw new Error(`Failed to update latest conversation: ${(error as Error).message}`);
    }
  }
  
  /**
   * 创建 Cursor MCP 配置文件
   */
  async createCursorMcpConfig(): Promise<void> {
    try {
      // 直接使用工作空间下的 .cursor 目录
      const cursorDir = path.join(this.workspace, '.cursor');

      // 确保 .cursor 目录存在
      await fs.ensureDir(cursorDir);

      // 创建 MCP 配置文件
      const mcpConfigPath = path.join(cursorDir, 'mcp.json');

      // 检查是否已有配置文件，如果有则合并
      let existingConfig = {};
      if (await fs.pathExists(mcpConfigPath)) {
        try {
          existingConfig = await fs.readJson(mcpConfigPath);
        } catch (error) {
          // 如果读取失败，使用空配置
          existingConfig = {};
        }
      }

      // 合并配置，确保 pit server 配置存在
      const mcpConfig = {
        ...existingConfig,
        mcpServers: {
          ...((existingConfig as any).mcpServers || {}),
          pit: {
            command: "npx",
            args: ["-y", "@haitai-social/pit", "start:mcp"]
          }
        }
      };

      await fs.writeJson(mcpConfigPath, mcpConfig, { spaces: 2 });

    } catch (error) {
      throw new Error(`Failed to create Cursor MCP config: ${(error as Error).message}`);
    }
  }

  /**
   * 获取项目根目录路径
   */
  getWorkspacePath(): string {
    return this.workspace;
  }
}
