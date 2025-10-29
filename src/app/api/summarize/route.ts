import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 요청 바디 파싱
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: '요약할 내용이 제공되지 않았습니다.' },
        { status: 400 }
      )
    }

    // Google GenAI 초기화
    const ai = new GoogleGenAI({ apiKey })

    // 메모 요약 요청
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: `다음 메모를 간결하고 명확하게 요약해주세요. 핵심 내용을 3-5문장으로 정리해주세요:\n\n${content}`,
    })

    // 응답 확인
    if (!response.text) {
      return NextResponse.json(
        { error: '요약 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      summary: response.text,
    })
  } catch (error) {
    console.error('Gemini API 오류:', error)
    return NextResponse.json(
      {
        error: '요약 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    )
  }
}

