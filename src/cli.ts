#!/usr/bin/env node

import { program } from 'commander';
import { helpCommand } from './commands/help.js';
import { addCommand } from './commands/add.js';
import { registerInitCommand } from './commands/init.js';
import { VERSION } from './types/version.js';

// 设置程序基本信息
program
  .name('pit')
  .description('A CLI tool for managing conversation history and chat records')
  .version(VERSION);

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
