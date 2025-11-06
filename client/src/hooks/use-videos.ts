import { useState, useEffect, useCallback } from 'react';
import { getVideos } from '@/lib/firestore';
import type { Video } from '@/types/video';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAuth();

  const loadVideos = useCallback(async () => {
    // Wait for auth to finish loading before making the query
    if (authLoading) return;

    try {
      setIsLoading(true);
      const data = await getVideos(isAdmin);
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        title: 'Error',
        description: 'Failed to load videos. Please refresh the page.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, isAdmin, authLoading]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  return { videos, isLoading, loadVideos };
}

