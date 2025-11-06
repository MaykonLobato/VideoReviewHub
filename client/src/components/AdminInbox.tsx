import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, MailOpen, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getFeedbacks, markFeedbackAsRead } from '@/lib/firestore';
import type { Feedback } from '@/types/feedback';

export default function AdminInbox() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  const loadFeedbacks = async () => {
    try {
      const data = await getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    setMarkingAsRead(id);
    try {
      await markFeedbackAsRead(id);
      await loadFeedbacks(); // Reload to show updated status
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const unreadCount = feedbacks.filter(f => !f.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No feedback yet</h3>
        <p className="text-muted-foreground">
          User feedback and comments will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Inbox</h3>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {feedbacks.map((feedback) => (
            <Card 
              key={feedback.id} 
              className={`transition-all ${!feedback.isRead ? 'bg-primary/5 border-primary/30' : ''}`}
              data-testid={`feedback-${feedback.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{feedback.userName}</CardTitle>
                      {!feedback.isRead && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {feedback.userEmail} • {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  {!feedback.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkAsRead(feedback.id)}
                      disabled={markingAsRead === feedback.id}
                      data-testid={`button-mark-read-${feedback.id}`}
                    >
                      <MailOpen className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">About video:</p>
                  <p className="font-medium">{feedback.videoTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Comment:</p>
                  <p className="text-sm leading-relaxed">{feedback.comment}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
