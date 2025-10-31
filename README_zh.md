# Pit - 对话历史管理工具

🕳️ 一个用于管理对话历史和聊天记录的命令行工具。

## 🚀 MCP Server 支持

**新增！** Pit 现在支持作为 MCP (Model Context Protocol) Server 运行，可以与 Claude Desktop 和其他 AI 助手无缝集成，实现自动对话记录。

### 快速 MCP 设置

1. 全局安装 Pit: `npm install -g @haitai-social/pit`
2. 添加到 Claude Desktop 配置:
   ```json
   {
     "mcpServers": {
       "pit": {
         "command": "npx",
         "args": ["-y", "@haitai-social/pit", "start:mcp"]
       }
     }
   }
   ```
3. 重启 Claude Desktop

详细设置说明请查看 [MCP_INSTALL.md](./MCP_INSTALL.md)。

## 安装

```bash
npm install -g @haitai-social/pit
```

## 使用方法

### CLI 使用

#### 添加聊天记录

添加单个聊天记录到对话历史：

```bash
pit add user "你好，你怎么样？"
pit add assistant "我很好，谢谢！"
pit add --conversation my-chat tool "函数执行成功"
```

#### 查看帮助

```bash
pit help
```

### MCP Server 使用

作为 MCP server 运行时，Pit 提供 `pit_add_chat_history` 工具，AI 助手可以调用它来自动记录对话。

MCP server 的设置和使用详情请查看 [MCP_INSTALL.md](./MCP_INSTALL.md)。

## JSON 文件格式

输入的 JSON 文件应该具有以下结构：

```json
{
  "chat_list": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    },
    {
      "role": "assistant", 
      "content": "I'm doing well, thank you!"
    },
    {
      "role": "tool",
      "content": "Function executed successfully"
    }
  ]
}
```

### 支持的角色类型

- `user`: 用户消息
- `assistant`: 助手回复
- `tool`: 工具执行结果

## 存储结构

数据存储在用户主目录的 `.pit/` 文件夹中：

```
~/.pit/
├── meta.json              # 元数据文件
├── conversation1.json     # 对话文件1
├── conversation2.json     # 对话文件2
└── ...
```

### meta.json 结构

```json
{
  "conversation_queue": ["conversation1.json", "conversation2.json"]
}
```

### conversation.json 结构

```json
{
  "version": "v0",
  "content": {
    "chat_list": [
      {
        "role": "user",
        "content": "消息内容"
      }
    ]
  }
}
```

## 贡献

欢迎提交 Issue 和 Pull Request 到 [GitHub 仓库](https://github.com/haitai-social/pit)。
