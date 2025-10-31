import { PitMCPServer } from '../mcp/server.js';

/**
 * mcp 命令处理器
 * 处理 `pit mcp` 命令，启动 MCP 服务器
 */
export async function mcpCommand(): Promise<void> {
  try {
    console.log('🚀 Starting Pit MCP Server...');

    const server = new PitMCPServer();
    await server.run();

  } catch (error) {
    console.error(`❌ Failed to start MCP server: ${(error as Error).message}`);
    process.exit(1);
  }
}
