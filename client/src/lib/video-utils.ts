// Utility functions for video operations
import type { Video } from '@/types/video';
import type { FilterState } from '@/components/FilterBar';

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function getYouTubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match?.[1] || '';
}

/**
 * Gets YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Gets YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

/**
 * Filters and sorts videos based on filter state
 */
export function filterAndSortVideos(
  videos: Video[],
  filters: FilterState,
  searchQuery: string,
  isAdmin: boolean
): Video[] {
  return videos
    .filter((video) => {
      // Filter out non-public videos for non-admin users
      if (!isAdmin && !video.isPublic) return false;
      return true;
    })
    .filter((video) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          video.title.toLowerCase().includes(query) ||
          video.subTags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter((video) => {
      // Tag and rating filters
      if (filters.mainTag && video.mainTag !== filters.mainTag) return false;
      if (filters.subTag && !video.subTags.includes(filters.subTag)) return false;
      if (filters.rating && video.rating < filters.rating) return false;
      return true;
    })
    .sort((a, b) => {
      // 1. Pinned videos first
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

      // 2. Sponsored videos next (gold > silver > bronze)
      if (a.isSponsored !== b.isSponsored) return a.isSponsored ? -1 : 1;

      if (a.isSponsored && b.isSponsored) {
        const ribbonOrder = { gold: 1, silver: 2, bronze: 3 };
        const aOrder = ribbonOrder[a.ribbonColor as keyof typeof ribbonOrder] || 4;
        const bOrder = ribbonOrder[b.ribbonColor as keyof typeof ribbonOrder] || 4;
        if (aOrder !== bOrder) return aOrder - bOrder;

        // Within same sponsor tier, sort by rating
        return b.rating - a.rating;
      }

      // 3. Apply user-selected sort for non-sponsored videos
      switch (filters.sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'highestRated':
          return b.rating - a.rating;
        case 'lowestRated':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
}

