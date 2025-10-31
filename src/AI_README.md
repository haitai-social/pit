# Pit项目 src/ 目录架构文档 (AI助手专用)

> ⚠️ **重要提醒**: 当项目架构发生变更时，请及时更新本文件以保持信息同步。

## 项目概述

Pit是一个用于管理对话历史和聊天记录的CLI工具，采用TypeScript开发，提供结构化的会话存储和管理功能。

## src/ 目录结构和功能

```
src/                            # TypeScript源代码目录
├── types/                      # 类型定义收敛目录
│   ├── common.ts              # 基础公共类型定义
│   ├── conversation.ts        # 对话相关类型定义
│   └── index.ts               # 类型统一导出文件
├── commands/                  # CLI命令处理器
│   ├── add.ts                # 添加单条聊天记录命令
│   └── help.ts               # 帮助信息命令
├── core/                     # 核心业务逻辑
│   └── vibeHistory.ts        # 聊天记录操作的核心逻辑
├── storage/                  # 存储管理层
│   └── index.ts              # 存储管理器，处理文件系统操作
└── cli.ts                    # CLI入口点(TypeScript版本)
```

## 核心类型定义

项目中的类型定义按语义拆分到不同文件中：

### types/common.ts - 基础公共类型
- **RoleEnum**: `'user' | 'assistant' | 'tool'` - 聊天角色枚举
- **SingleChat**: `{role: RoleEnum, content: string | any}` - 单条聊天记录结构
- **CommandOptions**: 命令行参数选项接口

### types/conversation.ts - 对话相关类型
- **ConversationContent**: 包含chat_list的对话内容结构
- **Conversation**: 完整的对话结构，包含版本和内容
- **Meta**: 元数据结构，管理对话队列

### types/index.ts - 统一导出
- 统一导出所有类型定义，方便其他模块引用

## 各层次职责

### CLI层 (`cli.ts`)
- 命令行接口入口点，使用Commander.js进行命令解析

### 命令处理层 (`commands/`)
- **add.ts**: 处理单条记录添加，支持自动conversation命名
- **help.ts**: 提供帮助信息显示

### 业务逻辑层 (`core/`)
- **vibeHistory.ts**: 核心的聊天记录追加逻辑，负责数据验证、格式化和存储调用

### 存储层 (`storage/`)
- **StorageManager类**: 封装所有文件系统操作，自动发现workspace，管理.pit目录结构

## 代码风格和三方库习惯

### 导入/导出规范
```typescript
// 使用命名导出(推荐)
export class StorageManager {}
export function appendVibeHistory() {}

// 导入三方库
import * as fs from 'fs-extra';
import * as path from 'path';
import { program } from 'commander';

// 导入项目类型
import { RoleEnum, SingleChat } from '../types';
```

### 主要三方库
- **fs-extra**: 文件系统操作增强库
- **commander**: CLI框架
- **typescript**: TypeScript编译器

### 控制台输出规范
- 使用emoji增强用户体验: ✅ ❌ 📝 🎉 📋 等
- 错误消息以 `❌ Error:` 开头
- 成功消息以 `✅` 开头

---

**维护提醒**: 当项目架构发生变更时，请及时更新本文档以保持信息同步。
