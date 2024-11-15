import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url)
    console.log(searchParams)
    return NextResponse.json({ message: `Form is get` }, { status: 200 })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    console.log(body)
    return NextResponse.json({ message: `Form is post` }, { status: 200 })
}