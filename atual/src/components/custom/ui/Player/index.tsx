"use client"

interface PlayerProps {
  url: string
  title?: string
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`
      }
    }
    
    return null
  } catch {
    return null
  }
}

export default function Player({ url, title = "Vídeo" }: PlayerProps) {
  const embedUrl = getYouTubeEmbedUrl(url)
  
  if (!embedUrl) {
    return (
      <div className="aspect-video flex items-center justify-center bg-muted rounded-lg border">
        <p className="text-muted-foreground text-sm">Link do YouTube inválido</p>
      </div>
    )
  }

  return (
    <div className="aspect-video">
      <iframe
        src={embedUrl}
        className="w-full h-full rounded-lg border"
        allowFullScreen
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  )
}
