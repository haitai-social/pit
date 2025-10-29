#!/usr/bin/env node

const { program } = require('commander');
const { recordCommand } = require('../src/commands/record');
const { helpCommand } = require('../src/commands/help');

// 设置程序基本信息
program
  .name('pit')
  .description('A CLI tool for managing conversation history and chat records')
  .version('1.0.0');

// 注册 record 命令
program
  .command('record')
  .description('Record chat conversations from JSON file')
  .option('--json <file>', 'JSON file containing chat conversations')
  .action(recordCommand);

// 注册 help 命令
program
  .command('help')
  .description('Show help information')
  .action(helpCommand);

// 当没有命令时显示帮助
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
