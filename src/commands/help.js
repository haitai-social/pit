/**
 * help 命令处理器
 * 处理 `pit help` 命令
 */
function helpCommand() {
  console.log(`
🕳️  Pit - Conversation History Manager v1.0.0
=============================================

DESCRIPTION:
  A CLI tool for managing conversation history and chat records.
  
USAGE:
  pit <command> [options]

COMMANDS:
  record --json <file>    Record chat conversations from JSON file
  help                    Show this help information

OPTIONS:
  --json <file>          JSON file containing chat conversations
  --version              Show version number

EXAMPLES:
  # Record conversations from a JSON file
  pit record --json conversation.json
  
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

STORAGE:
  - Data is stored in ~/.pit/ directory
  - Each conversation is saved as a separate JSON file
  - Meta information is stored in ~/.pit/meta.json

For more information, visit: https://github.com/haitai-social/pit
`);
}

module.exports = { helpCommand };
