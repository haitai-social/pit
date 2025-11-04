import fs from 'fs-extra';
import * as path from 'path';
import { Meta } from '../types/index.js';
import { VibeHistoryModel } from '@haitai-social/pit-history-utils';
import { VibeHistoryContentSchema, IDE_NAME_ENUM } from '@haitai-social/pit-history-utils/dist/types/vibe-history-content.js';

export class StorageManager {
  private workspace: string;
  private pitDir: string;
  private metaFile: string;
  private cachedMeta: Meta | null = null;

  constructor() {
    this.workspace = this.findWorkspace();
    this.pitDir = path.join(this.workspace, '.pit');
    this.metaFile = path.join(this.pitDir, 'meta.json');
  }

  private findWorkspace(): string {
    let currentDir = process.cwd();

    let searchDir = currentDir;
    while (searchDir !== path.dirname(searchDir)) {
      const pitPath = path.join(searchDir, '.pit');
      if (fs.pathExistsSync(pitPath)) {
        return searchDir;
      }
      searchDir = path.dirname(searchDir);
    }

    searchDir = currentDir;
    while (searchDir !== path.dirname(searchDir)) {
      const gitPath = path.join(searchDir, '.git');
      if (fs.pathExistsSync(gitPath)) {
        return searchDir;
      }
      searchDir = path.dirname(searchDir);
    }

    return process.cwd();
  }

  async initialize(ide?: string): Promise<void> {
    try {
      await fs.ensureDir(this.pitDir);
      if (!(await fs.pathExists(this.metaFile))) {
        const initialMeta: Meta = {
          conversation_queue: [],
          current_ide: (ide || 'cursor') as typeof IDE_NAME_ENUM[number]
        };
        await fs.writeJson(this.metaFile, initialMeta, { spaces: 2 });
        this.cachedMeta = initialMeta;
      } else {
        // 如果 meta 文件已存在但没有 current_ide 字段，则更新它
        this.cachedMeta = await this.readMeta();
      }
      if (ide && this.cachedMeta.current_ide !== ide) {
        this.cachedMeta.current_ide = ide as typeof IDE_NAME_ENUM[number];
        await this.writeMeta(this.cachedMeta);
      }
    } catch (error) {
      throw new Error(`Failed to initialize storage: ${(error as Error).message}`);
    }
  }

  async readMeta(): Promise<Meta> {
    if (this.cachedMeta) {
      return this.cachedMeta;
    }
    try {
      this.cachedMeta = await fs.readJson(this.metaFile) as Meta;
      return this.cachedMeta;
    } catch (error) {
      throw new Error(`Failed to read meta file: ${(error as Error).message}`);
    }
  }

  async writeMeta(data: Meta): Promise<void> {
    try {
      await fs.writeJson(this.metaFile, data, { spaces: 2 });
      this.cachedMeta = data;
    } catch (error) {
      throw new Error(`Failed to write meta file: ${(error as Error).message}`);
    }
  }

  async readConversation(conversationName: string): Promise<VibeHistoryModel> {
    const conversationPath = path.join(this.pitDir, `${conversationName}.json`);
    try {
      if (await fs.pathExists(conversationPath)) {
        const jsonData = await fs.readJson(conversationPath);
        return VibeHistoryModel.fromJson(JSON.stringify(jsonData));
      } else {
        const meta = await this.readMeta();
        const initialContent = VibeHistoryContentSchema.parse({
          ide_name: meta.current_ide,
          chat_list: []
        });
        const newConversation = new VibeHistoryModel(initialContent);
        await fs.writeFile(conversationPath, newConversation.toJSON());
        return newConversation;
      }
    } catch (error) {
      throw new Error(`Failed to read conversation ${conversationName}: ${(error as Error).message}`);
    }
  }

  async writeConversation(conversationName: string, data: VibeHistoryModel): Promise<void> {
    const conversationPath = path.join(this.pitDir, `${conversationName}.json`);
    try {
      await fs.writeFile(conversationPath, data.toJSON());
    } catch (error) {
      throw new Error(`Failed to write conversation ${conversationName}: ${(error as Error).message}`);
    }
  }

  async updateLatestConversation(conversationName: string): Promise<void> {
    try {
      const meta = await this.readMeta();
      const fileName = `${conversationName}.json`;

      meta.conversation_queue = meta.conversation_queue.filter(name => name !== fileName);
      meta.conversation_queue.unshift(fileName);

      const MAX_RECENT_CONVERSATIONS = 10;
      if (meta.conversation_queue.length > MAX_RECENT_CONVERSATIONS) {
        meta.conversation_queue = meta.conversation_queue.slice(0, MAX_RECENT_CONVERSATIONS);
      }

      await this.writeMeta(meta);
    } catch (error) {
      throw new Error(`Failed to update latest conversation: ${(error as Error).message}`);
    }
  }

  async createCursorMcpConfig(): Promise<void> {
    try {
      const cursorDir = path.join(this.workspace, '.cursor');
      await fs.ensureDir(cursorDir);
      const mcpConfigPath = path.join(cursorDir, 'mcp.json');

      let existingConfig = {};
      if (await fs.pathExists(mcpConfigPath)) {
        try {
          existingConfig = await fs.readJson(mcpConfigPath);
        } catch (error) {
          existingConfig = {};
        }
      }

      const mcpConfig = {
        ...existingConfig,
        mcpServers: {
          ...((existingConfig as any).mcpServers || {}),
          'pit-mcp': {
            command: "pit",
            args: ["mcp"]
          }
        }
      };

      await fs.writeJson(mcpConfigPath, mcpConfig, { spaces: 2 });

    } catch (error) {
      throw new Error(`Failed to create Cursor MCP config: ${(error as Error).message}`);
    }
  }

  getWorkspacePath(): string {
    return this.workspace;
  }
}
