import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const storyPath = params.path.join('/')
    
    // For now, return a simple placeholder story
    // In production, you would serve the actual uploaded story content
    const placeholderStory = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ec4899"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="white">
          Story: ${storyPath}
        </text>
      </svg>
    `
    
    return new NextResponse(placeholderStory, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error serving placeholder story:', error)
    return new NextResponse('Story not found', { status: 404 })
  }
}


