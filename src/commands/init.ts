import { Command } from 'commander';
import { StorageManager } from '../storage/index.js';
import { IDE_NAME_ENUM } from '@haitai-social/pit-history-utils/dist/types/vibe-history-content.js';

export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize pit project configuration')
    .option('--ide <ide>', `Specify IDE (supported: ${IDE_NAME_ENUM.join(', ')})`, 'cursor')
    .action(async (options) => {
      try {
        await initProject(options.ide);
      } catch (error) {
        console.error('Initialization failed:', (error as Error).message);
        process.exit(1);
      }
    });
}

async function initProject(ide: string): Promise<void> {
  if (!IDE_NAME_ENUM.includes(ide as typeof IDE_NAME_ENUM[number])) {
    throw new Error(`Unsupported IDE: ${ide}. Supported IDEs: ${IDE_NAME_ENUM.join(', ')}`);
  }

  const storageManager = new StorageManager();
  const projectRoot = storageManager.getWorkspacePath();

  console.log(`Initializing project configuration...`);
  console.log(`Project root: ${projectRoot}`);
  console.log(`Target IDE: ${ide}`);

  await storageManager.initialize(ide as typeof IDE_NAME_ENUM[number]);
  console.log('✓ .pit directory initialized');

  if (ide === 'cursor') {
    await storageManager.createCursorMcpConfig();
    console.log('✓ Cursor MCP config created: .cursor/mcp.json');
  }

  console.log('🎉 Project initialization complete!');
}
