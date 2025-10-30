#!/usr/bin/env node

import { program } from 'commander';
import { recordCommand } from './commands/record';
import { helpCommand } from './commands/help';
import { addCommand } from './commands/add';
import { registerInitCommand } from './commands/init';

// 设置程序基本信息
program
  .name('pit')
  .description('A CLI tool for managing conversation history and chat records')
  .version('1.0.4');

// 注册 record 命令
program
  .command('record')
  .description('Record chat conversations from JSON file')
  .option('--json <file>', 'JSON file containing chat conversations')
  .action(recordCommand);

// 注册 add 命令
program
  .command('add <role> <content>')
  .description('Add a single chat record to conversation history')
  .option('--conversation <name>', 'Conversation name (optional, defaults to latest)')
  .action(addCommand);

// 注册 help 命令
program
  .command('help')
  .description('Show help information')
  .action(helpCommand);

// 注册 init 命令
registerInitCommand(program);

// 当没有命令时显示帮助
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
