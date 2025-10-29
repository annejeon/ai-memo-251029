import { Memo } from '@/types/memo'

/**
 * 데이터베이스 행 타입 (snake_case)
 */
export interface MemoRow {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

/**
 * 데이터베이스 삽입 타입
 */
export interface MemoInsert {
  title: string
  content: string
  category: string
  tags: string[]
}

/**
 * 데이터베이스 업데이트 타입
 */
export interface MemoUpdate {
  title?: string
  content?: string
  category?: string
  tags?: string[]
}

/**
 * DB 행을 Memo 타입으로 변환
 */
export function rowToMemo(row: MemoRow): Memo {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * 여러 DB 행을 Memo 배열로 변환
 */
export function rowsToMemos(rows: MemoRow[]): Memo[] {
  return rows.map(rowToMemo)
}

