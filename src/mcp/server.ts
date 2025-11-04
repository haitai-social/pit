#!/usr/bin/env node

// 导入所需模块
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListToolsResultSchema,
  CallToolResultSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { appendVibeHistory } from '../core/vibe-history.js';
import { SingleChat, RoleEnum } from '../types/index.js';
import { VERSION } from '../types/version.js';

export class PitMCPServer {
  private server: Server;

  constructor() {
    // 创建 MCP 服务器实例
    this.server = new Server(
      {
        name: 'pit-mcp-server',
        version: VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // 设置请求处理器
    this.setupHandlers();
  }

  private setupHandlers() {
    // 注册列出工具的处理器
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'pit_add_chat_history',
            description:
              'MANDATORY: Call this MCP tool EVERY TIME you finish responding to the user, regardless of the task complexity or outcome. Pass in the complete conversation history to ensure all interactions are recorded without omissions. This tool MUST be called after each response.',
            inputSchema: {
              type: 'object',
              properties: {
                conversation_name: {
                  type: 'string',
                  description:
                    'The conversation name. If this is the first chat in the conversation, assign a name that reflects the conversation topic; for subsequent chats, use the previously assigned name.',
                },
                chat_history: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      role: {
                        type: 'string',
                        enum: ['user', 'assistant', 'tool'],
                        description:
                          'Message role: user (user message), assistant (assistant reply), or tool (tool execution result)',
                      },
                      name: {
                        type: 'string',
                        description: 'Name of the sender. Use the model name for assistant messages, the tool name for tool messages, and the user name for user messages.',
                      },
                      content: {
                        type: 'string',
                        description: 'The message content',
                      },
                    },
                    required: ['role', 'name', 'content'],
                  },
                  description:
                    'Array of chat history records, each containing role and content',
                },
              },
              required: ['conversation_name', 'chat_history'],
            },
          },
        ],
      } as z.infer<typeof ListToolsResultSchema>;
    });

    // 注册工具调用处理器
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'pit_add_chat_history') {
        return await this.handleAddChatHistory(args);
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  private async handleAddChatHistory(args: any): Promise<z.infer<typeof CallToolResultSchema>> {
    const { conversation_name, chat_history } = args;

    // 验证必需参数
    if (!conversation_name) {
      throw new Error('conversation_name parameter is required');
    }

    if (!Array.isArray(chat_history)) {
      throw new Error('chat_history parameter must be an array of chat records');
    }

    if (chat_history.length === 0) {
      throw new Error('chat_history array cannot be empty');
    }

    try {
      let successCount = 0;
      let errorCount = 0;

      // 处理每个聊天记录
      for (let i = 0; i < chat_history.length; i++) {
        const chatRecord = chat_history[i];

        if (!chatRecord || typeof chatRecord !== 'object') {
          console.error(`Invalid chat record at index ${i}: must be an object`);
          errorCount++;
          continue;
        }

        const { role, content } = chatRecord;

        if (!role || !content) {
          console.error(
            `Invalid chat record at index ${i}: must contain role and content fields`
          );
          errorCount++;
          continue;
        }

        // 验证 role 参数
        const validRoles: RoleEnum[] = ['user', 'assistant', 'tool'];
        if (!validRoles.includes(role as RoleEnum)) {
          console.error(
            `Invalid role "${role}" at index ${i}, must be one of: ${validRoles.join(', ')}`
          );
          errorCount++;
          continue;
        }

        try {
          // 构造 singleChat 结构
          const singleChat: SingleChat = {
            role: role as RoleEnum,
            name: `${role}_${Date.now()}_${i}`,
            content: content,
            is_select: true,
          };

          // 调用 appendVibeHistory 方法
          await appendVibeHistory(conversation_name, singleChat);
          successCount++;
        } catch (recordError) {
          console.error(
            `Failed to add chat record at index ${i}: ${(recordError as Error).message}`
          );
          errorCount++;
        }
      }

      // 返回结果
      if (errorCount === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `✅ Successfully added ${successCount} chat records to conversation "${conversation_name}"`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `⚠️ Partially successful: ${successCount} records added, ${errorCount} records failed for conversation "${conversation_name}"`,
            },
          ],
        };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Failed to add chat records: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    try {
      // 创建 stdio transport
      const transport = new StdioServerTransport();

      // 连接到 transport
      await this.server.connect(transport);

      console.error('Pit MCP Server 已启动，正在监听 stdin/stdout...');
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      throw error;
    }
  }
}
