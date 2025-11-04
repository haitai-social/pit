
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
