'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Memo, MemoFormData } from '@/types/memo'
import { MemoRow, rowsToMemos, rowToMemo } from '@/lib/supabase/types'

/**
 * 모든 메모 조회
 */
export async function getMemos(): Promise<Memo[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<MemoRow[]>()

    if (error) {
      console.error('Error fetching memos:', error)
      throw new Error(`메모를 불러오는데 실패했습니다: ${error.message}`)
    }

    return rowsToMemos(data || [])
  } catch (error) {
    console.error('Failed to get memos:', error)
    throw error
  }
}

/**
 * 특정 메모 조회
 */
export async function getMemoById(id: string): Promise<Memo | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .single<MemoRow>()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // 메모를 찾지 못함
      }
      console.error('Error fetching memo:', error)
      throw new Error(`메모를 불러오는데 실패했습니다: ${error.message}`)
    }

    return data ? rowToMemo(data) : null
  } catch (error) {
    console.error('Failed to get memo:', error)
    throw error
  }
}

/**
 * 메모 생성
 */
export async function createMemo(formData: MemoFormData): Promise<Memo> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('memos')
      .insert({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      })
      .select()
      .single<MemoRow>()

    if (error) {
      console.error('Error creating memo:', error)
      throw new Error(`메모를 생성하는데 실패했습니다: ${error.message}`)
    }

    revalidatePath('/')
    return rowToMemo(data)
  } catch (error) {
    console.error('Failed to create memo:', error)
    throw error
  }
}

/**
 * 메모 업데이트
 */
export async function updateMemo(
  id: string,
  formData: MemoFormData
): Promise<Memo> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('memos')
      .update({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      })
      .eq('id', id)
      .select()
      .single<MemoRow>()

    if (error) {
      console.error('Error updating memo:', error)
      throw new Error(`메모를 수정하는데 실패했습니다: ${error.message}`)
    }

    revalidatePath('/')
    return rowToMemo(data)
  } catch (error) {
    console.error('Failed to update memo:', error)
    throw error
  }
}

/**
 * 메모 삭제
 */
export async function deleteMemo(id: string): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('memos').delete().eq('id', id)

    if (error) {
      console.error('Error deleting memo:', error)
      throw new Error(`메모를 삭제하는데 실패했습니다: ${error.message}`)
    }

    revalidatePath('/')
  } catch (error) {
    console.error('Failed to delete memo:', error)
    throw error
  }
}

/**
 * 카테고리별 메모 조회
 */
export async function getMemosByCategory(category: string): Promise<Memo[]> {
  try {
    const supabase = await createClient()

    const query = supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false })

    if (category !== 'all') {
      query.eq('category', category)
    }

    const { data, error } = await query.returns<MemoRow[]>()

    if (error) {
      console.error('Error fetching memos by category:', error)
      throw new Error(`메모를 불러오는데 실패했습니다: ${error.message}`)
    }

    return rowsToMemos(data || [])
  } catch (error) {
    console.error('Failed to get memos by category:', error)
    throw error
  }
}

/**
 * 메모 검색
 */
export async function searchMemos(query: string): Promise<Memo[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('memos')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .returns<MemoRow[]>()

    if (error) {
      console.error('Error searching memos:', error)
      throw new Error(`메모를 검색하는데 실패했습니다: ${error.message}`)
    }

    return rowsToMemos(data || [])
  } catch (error) {
    console.error('Failed to search memos:', error)
    throw error
  }
}

