import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, ArrowLeft, LogOut } from 'lucide-react';
import { createFeedback } from '@/lib/firestore';
import type { InsertFeedback } from '@/types/feedback';

export default function Feedback() {
  const [location, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { language } = useApp();
  const t = translations[language];
  const { toast } = useToast();

  const [videoTitle, setVideoTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill video title from URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const titleParam = urlParams.get('videoTitle');
    if (titleParam) {
      setVideoTitle(decodeURIComponent(titleParam));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!videoTitle.trim() || !comment.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: InsertFeedback = {
        userEmail: user.email || '',
        userName: user.displayName || user.email || 'Anonymous',
        videoTitle: videoTitle.trim(),
        comment: comment.trim(),
      };

      await createFeedback(feedbackData);

      toast({
        title: 'Success',
        description: 'Your feedback has been submitted!',
      });

      setVideoTitle('');
      setComment('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="gap-2"
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          {user && (
            <Button
              variant="outline"
              onClick={signOut}
              className="gap-2"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>

        <div className="text-center mb-8">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2">Share Your Feedback</h1>
          <p className="text-xl text-muted-foreground">
            Tell us about your experience with Curaçao locations
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              Your feedback helps us improve and helps other visitors discover amazing places in Curaçao
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="videoTitle">Video Title / Location Name</Label>
                <Input
                  id="videoTitle"
                  placeholder="e.g., Best Beach in Willemstad, Restaurant XYZ Review"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  required
                  data-testid="input-video-title"
                />
                <p className="text-xs text-muted-foreground">
                  Which video or location are you commenting about?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Your Feedback</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your thoughts, experiences, or suggestions..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={8}
                  className="resize-none"
                  data-testid="input-comment"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 10 characters
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Signed in as: <span className="font-medium">{user?.email}</span>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  data-testid="button-submit-feedback"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Thanks for helping us make Curaçao more discoverable! 🏝️
          </p>
        </div>
      </div>
    </div>
  );
}
