import { SingleChat } from './common.js';

/**
 * 对话内容结构
 * 包含聊天记录列表
 */
export interface ConversationContent {
  /** 聊天记录列表 */
  chat_list: SingleChat[];
}

/**
 * 完整的对话结构
 * 包含版本信息和对话内容
 */
export interface Conversation {
  /** 对话格式版本 */
  version: string;
  /** 对话内容 */
  content: ConversationContent;
}

/**
 * 元数据结构
 * 管理对话队列信息
 */
export interface Meta {
  /** 对话文件队列，按时间排序（最新在前） */
  conversation_queue: string[];
}
