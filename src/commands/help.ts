/**
 * help 命令处理器
 * 处理 `pit help` 命令
 */
export function helpCommand(): void {
  console.log(`
🕳️  Pit - Conversation History Manager v1.0.3
=============================================

DESCRIPTION:
  A CLI tool for managing conversation history and chat records.
  
USAGE:
  pit <command> [options]

COMMANDS:
  record --json <file>                   Record chat conversations from JSON file
  add [--conversation <name>] <role> <name> <content>   Add a single chat record to conversation
  mcp                                    Start MCP (Model Context Protocol) server
  help                                   Show this help information

OPTIONS:
  --json <file>          JSON file containing chat conversations
  --conversation <name>  Conversation name (optional, defaults to latest)
  --version              Show version number

EXAMPLES:
  # Record conversations from a JSON file
  pit record --json conversation.json

  # Add a user message to the latest conversation
  pit add user "user_001" "Hello, how are you?"

  # Add an assistant response to a specific conversation
  pit add --conversation "my-chat" assistant "claude-4.5-sonnet" "I'm doing well, thank you!"

  # Add a tool result
  pit add tool "read_file" "Function executed successfully"

  # Start MCP server
  pit mcp

  # Show help information
  pit help

  # Show version
  pit --version

JSON FILE FORMAT:
  The JSON file should have the following structure:
  {
    "chat_list": [
      {
        "role": "user",
        "name": "user_001",
        "content": "Hello, how are you?"
      },
      {
        "role": "assistant",
        "name": "assistant_001",
        "content": "I'm doing well, thank you!"
      },
      {
        "role": "tool",
        "name": "tool_001",
        "content": "Function executed successfully"
      }
    ]
  }

ROLES:
  user        - Messages from the user
  assistant   - Responses from AI assistant
  tool        - Tool execution results

STORAGE:
  - Data is stored in .pit/ directory (in current workspace or git root)
  - Each conversation is saved as a separate JSON file
  - Meta information is stored in .pit/meta.json
  - Conversations are managed with FIFO queue logic

For more information, visit: https://github.com/haitai-social/pit
`);
}
