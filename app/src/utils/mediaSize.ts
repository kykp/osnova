import type { Media } from '@/payload-types'

type SizeName = keyof NonNullable<Media['sizes']>

export type ResolvedImage = {
  url: string
  width?: number
  height?: number
}

export function pickMediaSize(media: Media | null | undefined, size: SizeName): ResolvedImage | null {
  if (!media) return null
  const variant = media.sizes?.[size]
  if (variant?.url) {
    return {
      url: variant.url,
      width: variant.width ?? undefined,
      height: variant.height ?? undefined,
    }
  }
  if (media.url) {
    return {
      url: media.url,
      width: media.width ?? undefined,
      height: media.height ?? undefined,
    }
  }
  return null
}
