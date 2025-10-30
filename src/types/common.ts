/**
 * 角色枚举类型
 * 定义聊天记录中支持的角色类型
 */
export type RoleEnum = 'user' | 'assistant' | 'tool';

/**
 * 单个聊天记录的结构定义
 * 包含角色和内容两个字段
 */
export interface SingleChat {
  /** 聊天角色：用户、助手或工具 */
  role: RoleEnum;
  /** 聊天内容，可以是字符串或任意对象 */
  content: string | any;
}

/**
 * 命令选项接口
 * 用于处理命令行参数
 */
export interface CommandOptions {
  /** 指定的对话名称 */
  conversation?: string;
  /** JSON文件路径（用于record命令） */
  json?: string;
}
