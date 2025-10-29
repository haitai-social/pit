# Pit - Conversation History Management Tool

🕳️ A command-line tool for managing conversation history and chat logs.

## Installation

```bash
npm install -g @haitai-social/pit
```

## Usage

### Record Conversation

Use the `pit record --json` command to import chat logs from a JSON file:

```bash
pit record --json conversation.json
```

### View Help

```bash
pit help
```

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
