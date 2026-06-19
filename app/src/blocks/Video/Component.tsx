import React from 'react'

type VideoProps = {
  heading?: string | null
  provider: 'youtube' | 'rutube' | 'vk' | 'kinescope'
  url: string
  ratio?: '16:9' | '4:3' | '1:1' | '9:16' | null
  caption?: string | null
}

function toEmbedUrl(provider: VideoProps['provider'], url: string): string | null {
  try {
    if (provider === 'youtube') {
      const m =
        url.match(/[?&]v=([\w-]{6,})/) ||
        url.match(/youtu\.be\/([\w-]{6,})/) ||
        url.match(/youtube\.com\/embed\/([\w-]{6,})/) ||
        url.match(/youtube\.com\/shorts\/([\w-]{6,})/)
      if (m) return `https://www.youtube.com/embed/${m[1]}`
    }
    if (provider === 'rutube') {
      const m =
        url.match(/rutube\.ru\/video\/([\w]{6,})/) ||
        url.match(/rutube\.ru\/play\/embed\/([\w]{6,})/)
      if (m) return `https://rutube.ru/play/embed/${m[1]}`
    }
    if (provider === 'vk') {
      const m = url.match(/video(-?\d+)_(\d+)/)
      if (m) return `https://vk.com/video_ext.php?oid=${m[1]}&id=${m[2]}&hd=2`
    }
    if (provider === 'kinescope') {
      const m = url.match(/kinescope\.io\/(?:embed\/)?([\w-]{8,})/)
      if (m) return `https://kinescope.io/embed/${m[1]}`
    }
  } catch {
    // ignore
  }
  return null
}

function ratioPadding(ratio: VideoProps['ratio']): string {
  switch (ratio) {
    case '4:3':
      return '75%'
    case '1:1':
      return '100%'
    case '9:16':
      return '177.78%'
    case '16:9':
    default:
      return '56.25%'
  }
}

function providerLabel(provider: VideoProps['provider']): string {
  return (
    {
      youtube: 'YouTube',
      rutube: 'Rutube',
      vk: 'VK Видео',
      kinescope: 'Kinescope',
    }[provider] || 'Видео'
  )
}

export function Video({ heading, provider, url, ratio, caption }: VideoProps) {
  const embed = toEmbedUrl(provider, url)
  if (!embed) return null

  return (
    <section className="section" id="video">
      <div className="container">
        {heading && (
          <div className="section-head center reveal">
            <span className="eyebrow center">Видео</span>
            <h2>{heading}</h2>
          </div>
        )}
        <figure className="video reveal">
          <div
            className="player"
            style={{
              aspectRatio: 'auto',
              height: 0,
              paddingBottom: ratioPadding(ratio),
              maxWidth: ratio === '9:16' ? 480 : undefined,
              marginInline: 'auto',
            }}
          >
            <span className="provider">{providerLabel(provider)} · {ratio || '16:9'}</span>
            <iframe
              src={embed}
              title={caption || heading || 'Видео'}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
            />
          </div>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      </div>
    </section>
  )
}
