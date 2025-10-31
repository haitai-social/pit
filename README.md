# Pit - AI Conversation History Management Tool

💡`pit` stand for `prompt git`.

🕳️ A command-line tool for managing conversation history and chat logs.

## 🚀 MCP Server Support

**NEW!** Pit now supports running as an MCP (Model Context Protocol) Server, allowing seamless integration with Claude Desktop and other AI assistants for automatic conversation recording.

### Quick MCP Setup

1. Install Pit globally: `npm install -g @haitai-social/pit`
2. Add to Claude Desktop config:
   ```json
   {
     "mcpServers": {
       "pit": {
         "command": "pit",
         "args": ["mcp"]
       }
     }
   }
   ```
3. Restart Claude Desktop

See [MCP_INSTALL.md](./MCP_INSTALL.md) for detailed setup instructions.

## Installation

```bash
npm install -g @haitai-social/pit
```

## Usage

### CLI Usage

#### Add Chat Record

Add a single chat record to conversation history:

```bash
pit add user "Hello, how are you?"
pit add assistant "I'm doing well, thank you!"
pit add --conversation my-chat tool "Function executed successfully"
```

#### View Help

```bash
pit help
```

### MCP Server Usage

When running as an MCP server, Pit provides the `pit_add_chat_history` tool that can be called by AI assistants to automatically record conversations.

See [MCP_INSTALL.md](./MCP_INSTALL.md) for MCP server setup and usage details.

## JSON File Format

The input JSON file should have the following structure:

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

### Supported Role Types

- `user`: User message
- `assistant`: Assistant reply
- `tool`: Tool execution result

## Storage Structure

Data is stored in the `.pit/` folder under the user's home directory:

```
~/.pit/
├── meta.json              # Metadata file
├── conversation1.json     # Conversation file 1
├── conversation2.json     # Conversation file 2
└── ...
```

### meta.json Structure

```json
{
  "conversation_queue": ["conversation1.json", "conversation2.json"]
}
```

### conversation.json Structure

```json
{
  "version": "v0",
  "content": {
    "chat_list": [
      {
        "role": "user",
        "content": "Message content"
      }
    ]
  }
}
```

## Contributing

Issues and Pull Requests are welcome at the [GitHub repository](https://github.com/haitai-social/pit).
