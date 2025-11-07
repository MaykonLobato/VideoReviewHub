import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFeedbacks } from '@/lib/firestore';
import type { Feedback } from '@/types/feedback';

export function useFeedbacks(includeArchived: boolean = false) {
  const queryClient = useQueryClient();

  const {
    data: feedbacks = [],
    isLoading,
  } = useQuery<Feedback[]>({
    queryKey: ['feedbacks', includeArchived],
    queryFn: () => getFeedbacks(includeArchived),
    staleTime: 2 * 60 * 1000, // 2 minutes - feedbacks change more frequently
  });

  const loadFeedbacks = () => {
    queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
  };

  const unreadCount = feedbacks.filter(f => !f.isRead && !f.isArchived).length;

  return { feedbacks, isLoading, loadFeedbacks, unreadCount };
}

