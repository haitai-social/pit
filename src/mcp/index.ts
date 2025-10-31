export { PitMCPServer } from './server.js';

// 如果直接运行此文件，启动服务器
if (import.meta.url === `file://${process.argv[1]}`) {
  import('./server.js').then(({ PitMCPServer }) => {
    const server = new PitMCPServer();
    server.run().catch((error) => {
      console.error('启动 Pit MCP Server 失败:', error);
      process.exit(1);
    });
  }).catch((error) => {
    console.error('导入 PitMCPServer 失败:', error);
    process.exit(1);
  });
}
