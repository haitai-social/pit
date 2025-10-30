import { Command } from 'commander';
import { StorageManager } from '../storage';
import { CURSOR_RULE_CONTENT, SUPPORTED_IDES, SupportedIDE } from '../types/consts';

/**
 * 初始化项目命令
 * @param program Commander 程序实例
 */
export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('初始化 pit 项目配置')
    .option('--ide <ide>', `指定 IDE (支持: ${SUPPORTED_IDES.join(', ')})`, 'cursor')
    .action(async (options) => {
      try {
        await initProject(options.ide);
      } catch (error) {
        console.error('初始化失败:', (error as Error).message);
        process.exit(1);
      }
    });
}

/**
 * 初始化项目
 * @param ide 指定的 IDE
 */
async function initProject(ide: string): Promise<void> {
  // 验证 IDE 参数
  if (!SUPPORTED_IDES.includes(ide as SupportedIDE)) {
    throw new Error(`不支持的 IDE: ${ide}. 支持的 IDE: ${SUPPORTED_IDES.join(', ')}`);
  }

  const storageManager = new StorageManager();
  const projectRoot = storageManager.getWorkspacePath();

  console.log(`正在初始化项目配置...`);
  console.log(`项目根目录: ${projectRoot}`);
  console.log(`目标 IDE: ${ide}`);

  // 初始化 .pit 目录
  await storageManager.initialize();
  console.log('✓ 已初始化 .pit 目录');

  // 根据 IDE 类型创建相应的配置文件
  if (ide === 'cursor') {
    await storageManager.createCursorRule(CURSOR_RULE_CONTENT);
    console.log('✓ 已创建 Cursor 规则文件: .cursor/rules/record-chat-history.mdc');
  }

  console.log('🎉 项目初始化完成！');
  console.log('');
  console.log('现在你可以使用以下命令开始记录对话:');
  console.log('  pit add --conversation <对话名称> <角色> <内容>');
  console.log('');
  console.log('角色选项: user, assistant, tool');
}
