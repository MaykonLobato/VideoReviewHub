import { useState, useEffect, useCallback } from 'react';
import { getFeedbacks } from '@/lib/firestore';
import type { Feedback } from '@/types/feedback';

export function useFeedbacks(includeArchived: boolean = false) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFeedbacks(includeArchived);
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [includeArchived]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const unreadCount = feedbacks.filter(f => !f.isRead && !f.isArchived).length;

  return { feedbacks, isLoading, loadFeedbacks, unreadCount };
}

