// YouTube helpers for owner-configured public videos (e.g. the /support/
// founder video). Deliberately constrained: only normal youtube.com /
// youtu.be single-video links are accepted, and only an 11-character video id
// is extracted. Anything else returns null so the caller falls back to its
// designed placeholder — a misconfigured value can never become an arbitrary
// third-party iframe.

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Extracts the video id from a public YouTube watch/share URL, or null. */
export function youTubeVideoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:') return null;

  const host = parsed.hostname.replace(/^www\./, '');
  const segments = parsed.pathname.split('/').filter(Boolean);
  let candidate = '';

  if (host === 'youtu.be') {
    candidate = segments[0] ?? '';
  } else if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (parsed.pathname === '/watch') {
      candidate = parsed.searchParams.get('v') ?? '';
    } else {
      const kind = segments[0] ?? '';
      if (kind === 'embed' || kind === 'shorts' || kind === 'live') candidate = segments[1] ?? '';
    }
  }

  return VIDEO_ID.test(candidate) ? candidate : null;
}

/** Privacy-enhanced embed URL for a configured YouTube video, or null. */
export function youTubeEmbedUrl(url: string): string | null {
  const id = youTubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
