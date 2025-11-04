import { IDE_NAME_ENUM } from "@haitai-social/pit-history-utils/dist/types/vibe-history-content.js";

/**
 * 元数据结构
 * 管理对话队列信息
 */
export interface Meta {
  conversation_queue: string[];

  current_ide: (typeof IDE_NAME_ENUM)[number];
}
