import { NextResponse } from 'next/server'

const ACCESS_KEY = 'baccd941-ff2f-422a-a7f1-992c69c20a90'
const BASE_URL = 'https://wvw4hutwne.execute-api.ap-northeast-1.amazonaws.com/v1/'

// GETパラメータ from, to を受け取る想定
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  if (!from || !to) {
    return new NextResponse(JSON.stringify({ error: 'Missing query parameters "from" or "to"' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const labelUrl = `${BASE_URL}disagg_label?k=${ACCESS_KEY}`
  const powerUrl = `${BASE_URL}disagg_power?k=${ACCESS_KEY}&bin=15min&from=${from}&to=${to}`

  try {
    const [labelRes, powerRes] = await Promise.all([
      fetch(labelUrl),
      fetch(powerUrl),
    ])

    if (!labelRes.ok) {
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch labels' }), { status: 500 })
    }

    if (!powerRes.ok) {
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch disagg_power' }), { status: 500 })
    }

    const labelData = await labelRes.json()
    const disaggData = await powerRes.json()

    // CORSヘッダーを付与（基本的に同一オリジンなら不要だが、他用途のために付ける例）
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    return new NextResponse(JSON.stringify({ labelData, disaggData }), { status: 200, headers })
  } catch (error) {
    console.error('API Proxy Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
