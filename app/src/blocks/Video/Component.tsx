import React from 'react'

import styles from './Component.module.css'

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

export function Video({ heading, provider, url, ratio, caption }: VideoProps) {
  const embed = toEmbedUrl(provider, url)
  if (!embed) return null

  const ratioClass =
    ratio === '4:3'
      ? styles.ratio43
      : ratio === '1:1'
        ? styles.ratio11
        : ratio === '9:16'
          ? styles.ratio916
          : styles.ratio169

  return (
    <section className={styles.root}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <figure className={styles.frame}>
        <div className={ratioClass}>
          <iframe
            className={styles.iframe}
            src={embed}
            title={caption || heading || 'Видео'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    </section>
  )
}
