import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Archive, ArchiveRestore } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { unarchiveFeedback } from '@/lib/firestore';
import { getUserFriendlyErrorMessage } from '@/lib/error-handler';
import { useFeedbacks } from '@/hooks/use-feedbacks';
import { useToast } from '@/hooks/use-toast';

export default function AdminArchived() {
  const { feedbacks, isLoading, loadFeedbacks } = useFeedbacks(true);
  const { toast } = useToast();
  const [unarchiving, setUnarchiving] = useState<string | null>(null);

  // Filter only archived feedbacks
  const archivedFeedbacks = feedbacks.filter(f => f.isArchived);

  const handleUnarchive = async (id: string) => {
    setUnarchiving(id);
    try {
      await unarchiveFeedback(id);
      await loadFeedbacks(); // Reload to update list
    } catch (error) {
      toast({
        title: '❌ Erro',
        description: getUserFriendlyErrorMessage(error),
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setUnarchiving(null);
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
            <Card key={i} className="p-6 opacity-75">
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

  if (archivedFeedbacks.length === 0) {
    return (
      <div className="text-center py-12">
        <Archive className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No archived feedback</h3>
        <p className="text-muted-foreground">
          Archived messages will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Archived</h3>
          <p className="text-sm text-muted-foreground">
            {archivedFeedbacks.length} archived message{archivedFeedbacks.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {archivedFeedbacks.map((feedback, index) => (
            <Card
              key={feedback.id}
              className="transition-all opacity-75 animate-in fade-in slide-in-from-right-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`archived-feedback-${feedback.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{feedback.userName}</CardTitle>
                      <Badge variant="secondary" className="text-xs">Archived</Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {feedback.userEmail} • {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUnarchive(feedback.id)}
                    disabled={unarchiving === feedback.id}
                    data-testid={`button-unarchive-${feedback.id}`}
                    title="Unarchive"
                  >
                    <ArchiveRestore className="h-4 w-4" />
                  </Button>
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

