import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Inbox, Archive } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/lib/i18n';
import { isValidYouTubeUrl } from '@/lib/video-utils';
import { Badge } from '@/components/ui/badge';
import AdminInbox from '@/components/AdminInbox';
import AdminArchived from '@/components/AdminArchived';
import LocationInput from '@/components/LocationInput';
import type { Video, Location, CreateVideoInput } from '@/types/video';
import { useFeedbacks } from '@/hooks/use-feedbacks';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  onClose: () => void;
  onSubmit: (video: CreateVideoInput) => void;
  editingVideo?: Video | null;
}

export default function AdminPanel({
  onClose,
  onSubmit,
  editingVideo,
}: AdminPanelProps) {
  const { language } = useApp();
  const t = translations[language];
  const { unreadCount } = useFeedbacks();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    youtubeUrl: '',
    title: '',
    mainTag: '',
    subTags: [] as string[],
    rating: 5,
    isSponsored: false,
    ribbonColor: 'gold',
    isPinned: false,
    isPublic: true,
    location: null as Location | null,
  });

  const [newSubTag, setNewSubTag] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingVideo) {
      setFormData({
        youtubeUrl: editingVideo.youtubeUrl,
        title: editingVideo.title,
        mainTag: editingVideo.mainTag,
        subTags: editingVideo.subTags || [],
        rating: editingVideo.rating,
        isSponsored: editingVideo.isSponsored,
        ribbonColor: editingVideo.ribbonColor || 'gold',
        isPinned: editingVideo.isPinned,
        isPublic:
          editingVideo.isPublic !== undefined ? editingVideo.isPublic : true,
        location: editingVideo.location || null,
      });
    }
  }, [editingVideo]);

  const availableSubTags = {
    Tourist: ['Restaurant', 'Beach', 'Hotel', 'Activities', 'Shopping'],
    Resident: [
      'Supermarket',
      'Healthcare',
      'Services',
      'Community',
      'Education',
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate YouTube URL
    if (!isValidYouTubeUrl(formData.youtubeUrl)) {
      toast({
        title: '⚠️ URL Inválida',
        description: 'Por favor, insira uma URL válida do YouTube',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    // Convert null to undefined for location
    const submitData = {
      ...formData,
      location: formData.location || undefined,
    };
    onSubmit(submitData);
  };

  const addSubTag = (tag: string) => {
    if (tag && !formData.subTags.includes(tag)) {
      setFormData({ ...formData, subTags: [...formData.subTags, tag] });
    }
    setNewSubTag('');
  };

  const removeSubTag = (tag: string) => {
    setFormData({
      ...formData,
      subTags: formData.subTags.filter((t) => t !== tag),
    });
  };

  const isEditing = !!editingVideo;
  const panelTitle = isEditing ? 'Edit Video' : t.admin.title;
  const submitButtonText = isEditing ? 'Update Video' : t.admin.submit;

  return (
    <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <Card className='w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-3xl font-bold' data-testid='text-admin-title'>
            {panelTitle}
          </h2>
          <Button
            variant='ghost'
            size='icon'
            onClick={onClose}
            data-testid='button-close-admin'
          >
            <X className='h-5 w-5' />
          </Button>
        </div>

        <Tabs
          defaultValue='videos'
          className='flex-1 flex flex-col overflow-hidden'
        >
          <TabsList className='mx-6 mt-4'>
            <TabsTrigger value='videos' data-testid='tab-videos'>
              {isEditing ? 'Edit Video' : t.admin.addVideo}
            </TabsTrigger>
            <TabsTrigger
              value='inbox'
              className='relative'
              data-testid='tab-inbox'
            >
              <Inbox className='h-4 w-4 mr-2' />
              Inbox
              {unreadCount > 0 && (
                <Badge
                  variant='destructive'
                  className='ml-2 h-5 min-w-5 rounded-full px-1.5'
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value='archived' data-testid='tab-archived'>
              <Archive className='h-4 w-4 mr-2' />
              Archived
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='videos'
            className='flex-1 overflow-y-auto p-6 m-0'
          >
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <Label htmlFor='youtubeUrl'>{t.admin.videoUrl}</Label>
                <Input
                  id='youtubeUrl'
                  type='url'
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeUrl: e.target.value })
                  }
                  placeholder='https://youtube.com/watch?v=... ou https://youtu.be/...'
                  required
                  className={formData.youtubeUrl && !isValidYouTubeUrl(formData.youtubeUrl) ? 'border-destructive' : ''}
                  data-testid='input-youtube-url'
                />
                {formData.youtubeUrl && !isValidYouTubeUrl(formData.youtubeUrl) && (
                  <p className="text-sm text-destructive mt-1">
                    ⚠️ URL do YouTube inválida
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor='title'>{t.admin.videoTitle}</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='Best beachfront restaurant in Curaçao'
                  required
                  data-testid='input-title'
                />
              </div>

              <div>
                <Label htmlFor='mainTag'>{t.admin.mainTag}</Label>
                <Select
                  value={formData.mainTag}
                  onValueChange={(v) =>
                    setFormData({ ...formData, mainTag: v, subTags: [] })
                  }
                >
                  <SelectTrigger data-testid='select-admin-main-tag'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Tourist'>{t.filters.tourist}</SelectItem>
                    <SelectItem value='Resident'>
                      {t.filters.resident}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.mainTag && (
                <div>
                  <Label>{t.admin.subTags}</Label>
                  <div className='flex flex-wrap gap-2 mb-3'>
                    {formData.subTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='gap-1'
                        data-testid={`badge-selected-${tag}`}
                      >
                        {tag}
                        <X
                          className='h-3 w-3 cursor-pointer hover-elevate'
                          onClick={() => removeSubTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className='flex gap-2 flex-wrap'>
                    {availableSubTags[
                      formData.mainTag as keyof typeof availableSubTags
                    ]?.map((tag) => (
                      <Button
                        key={tag}
                        type='button'
                        variant={
                          formData.subTags.includes(tag) ? 'default' : 'outline'
                        }
                        size='sm'
                        onClick={() =>
                          formData.subTags.includes(tag)
                            ? removeSubTag(tag)
                            : addSubTag(tag)
                        }
                        data-testid={`button-subtag-${tag}`}
                      >
                        {formData.subTags.includes(tag) ? '✓ ' : '+ '}
                        {tag}
                      </Button>
                    ))}
                  </div>
                  <div className='flex gap-2 mt-3'>
                    <Input
                      placeholder='Custom sub-tag'
                      value={newSubTag}
                      onChange={(e) => setNewSubTag(e.target.value)}
                      data-testid='input-custom-subtag'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => addSubTag(newSubTag)}
                      disabled={!newSubTag}
                      data-testid='button-add-custom-subtag'
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor='rating'>{t.admin.rating}</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(v) =>
                    setFormData({ ...formData, rating: parseInt(v) })
                  }
                >
                  <SelectTrigger data-testid='select-rating'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r} {r === 1 ? 'star' : 'stars'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center justify-between'>
                <Label htmlFor='isSponsored'>{t.admin.isSponsored}</Label>
                <Switch
                  id='isSponsored'
                  checked={formData.isSponsored}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isSponsored: checked })
                  }
                  data-testid='switch-sponsored'
                />
              </div>

              {formData.isSponsored && (
                <div>
                  <Label htmlFor='ribbonColor'>{t.admin.ribbonColor}</Label>
                  <Select
                    value={formData.ribbonColor}
                    onValueChange={(v) =>
                      setFormData({ ...formData, ribbonColor: v })
                    }
                  >
                    <SelectTrigger data-testid='select-ribbon-color'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='gold'>{t.admin.gold}</SelectItem>
                      <SelectItem value='silver'>{t.admin.silver}</SelectItem>
                      <SelectItem value='bronze'>{t.admin.bronze}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className='flex items-center justify-between'>
                <Label htmlFor='isPinned'>{t.admin.isPinned}</Label>
                <Switch
                  id='isPinned'
                  checked={formData.isPinned}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPinned: checked })
                  }
                  data-testid='switch-pinned'
                />
              </div>

              <LocationInput
                value={formData.location}
                onChange={(location) => setFormData({ ...formData, location })}
              />

              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  className='flex-1'
                  data-testid='button-cancel'
                >
                  {t.admin.cancel}
                </Button>
                <Button
                  type='submit'
                  className='flex-1'
                  data-testid='button-submit-video'
                >
                  {submitButtonText}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value='inbox' className='flex-1 overflow-y-auto p-6 m-0'>
            <AdminInbox />
          </TabsContent>

          <TabsContent
            value='archived'
            className='flex-1 overflow-y-auto p-6 m-0'
          >
            <AdminArchived />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
