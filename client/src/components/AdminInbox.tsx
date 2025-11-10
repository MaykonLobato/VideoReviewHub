import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, MailOpen, Archive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { markFeedbackAsRead, archiveFeedback } from '@/lib/firestore';
import { getUserFriendlyErrorMessage } from '@/lib/error-handler';
import { useFeedbacks } from '@/hooks/use-feedbacks';
import { useToast } from '@/hooks/use-toast';

export default function AdminInbox() {
  const { feedbacks, isLoading, loadFeedbacks, unreadCount } = useFeedbacks(false);
  const { toast } = useToast();
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string) => {
    setMarkingAsRead(id);
    try {
      await markFeedbackAsRead(id);
      await loadFeedbacks(); // Reload to show updated status
    } catch (error) {
      toast({
        title: '❌ Erro',
        description: getUserFriendlyErrorMessage(error),
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleArchive = async (id: string) => {
    setArchiving(id);
    try {
      await archiveFeedback(id);
      await loadFeedbacks(); // Reload to remove from inbox
    } catch (error) {
      toast({
        title: '❌ Erro',
        description: getUserFriendlyErrorMessage(error),
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setArchiving(null);
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
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
          {feedbacks.map((feedback, index) => (
            <Card
              key={feedback.id}
              className={`transition-all animate-in fade-in slide-in-from-right-4 duration-300 ${!feedback.isRead ? 'bg-primary/5 border-primary/30' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
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
                  <div className="flex gap-2">
                    {!feedback.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(feedback.id)}
                        disabled={markingAsRead === feedback.id}
                        data-testid={`button-mark-read-${feedback.id}`}
                        title="Mark as read"
                      >
                        <MailOpen className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArchive(feedback.id)}
                      disabled={archiving === feedback.id}
                      data-testid={`button-archive-${feedback.id}`}
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
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
