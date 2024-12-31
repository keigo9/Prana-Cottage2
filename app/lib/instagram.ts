import type {AppLoadContext} from '@remix-run/server-runtime';

export type InstagramPost = {
  id: string;
  caption: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  comments_count: number;
  like_count: number;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnail_url?: string;
};

// キャッシュの型定義
type CacheEntry = {
  posts: InstagramPost[];
  timestamp: number;
};

let postsCache: CacheEntry | null = null;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 1日

export async function getInstagramPosts(
  context: AppLoadContext,
): Promise<InstagramPost[]> {
  // キャッシュが有効な場合はキャッシュから返す
  if (postsCache && Date.now() - postsCache.timestamp < CACHE_DURATION) {
    return postsCache.posts;
  }

  if (!context.env.INSTAGRAM_ACCESS_TOKEN) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN is not defined');
  }
  const INSTAGRAM_API_URL = `https://graph.facebook.com/v21.0/${context.env.INSTAGRAM_BUSINESS_ACCOUNT_ID}`;

  try {
    const response = await fetch(
      `${INSTAGRAM_API_URL}?fields=name,media.limit(6){ caption,media_url,thumbnail_url,permalink,like_count,comments_count,media_type}&access_token=${context.env.INSTAGRAM_ACCESS_TOKEN}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram posts');
    }
    const data = (await response.json()) as {media: {data: InstagramPost[]}};

    // キャッシュを更新
    postsCache = {
      posts: data.media.data,
      timestamp: Date.now(),
    };

    return data.media.data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}
