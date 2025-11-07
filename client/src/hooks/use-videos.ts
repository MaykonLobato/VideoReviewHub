import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVideos } from '@/lib/firestore';
import type { Video } from '@/types/video';
import { useAuth } from '@/contexts/AuthContext';

export function useVideos() {
  const { isAdmin, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: videos = [],
    isLoading,
    error,
  } = useQuery<Video[]>({
    queryKey: ['videos', isAdmin],
    queryFn: () => getVideos(isAdmin),
    enabled: !authLoading, // Wait for auth to finish loading
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loadVideos = () => {
    queryClient.invalidateQueries({ queryKey: ['videos'] });
  };

  return { videos, isLoading, loadVideos, error };
}

