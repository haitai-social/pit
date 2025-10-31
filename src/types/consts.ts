/**
 * 常量定义
 */

export const CURSOR_RULE_CONTENT = `Goal: Use the \`pit add\` command to ensure that the entire chat history between you and the user is recorded without any omissions.

Invocation: Always call \`pit add\` whenever a tool finishes execution, the user submits a query, or you provide an answer, plan, or summary.

Command arguments:

- \`--conversation $conversation-name\`:
    - If this is the first chat in the conversation, assign a name using $conversation-name that reflects the conversation topic, and remember it.
    - For subsequent chats, use the previously assigned $conversation-name.
- \`<role>\`: must be one of three values: 'user', 'assistant', or 'tool'.
- \`<content>\`: the content of the conversation.

In summary, the command should be formatted as: \`pit add --conversation $conversation-name <role> <content>\``;

export const SUPPORTED_IDES = ['cursor'] as const;
export type SupportedIDETypes = typeof SUPPORTED_IDES[number];
