# Pit - 对话历史管理工具

🕳️ 一个用于管理对话历史和聊天记录的命令行工具。

## 安装

```bash
npm install -g @haitai-social/pit
```

## 使用方法

### 记录对话

使用 `pit record --json` 命令从 JSON 文件中导入聊天记录：

```bash
pit record --json conversation.json
```

### 查看帮助

```bash
pit help
```

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
  "latest_conversation": ["conversation1.json", "conversation2.json"]
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

## 开发

### 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/haitai-social/pit.git
cd pit
```

2. 安装依赖：
```bash
npm install
```

3. 本地测试：
```bash
npm link
pit help
```

### 发布

```bash
npm publish
```

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request 到 [GitHub 仓库](https://github.com/haitai-social/pit)。
