import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FilterBar, { type FilterState } from '@/components/FilterBar';
import VideoCard from '@/components/VideoCard';
import EmptyState from '@/components/EmptyState';
import AdminPanel from '@/components/AdminPanel';
import ThemeSelector from '@/components/ThemeSelector';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getVideos, createVideo, updateVideo, toggleVideoVisibility, type Video } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { user, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ sortBy: 'newest' });
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (user && !isAdmin) {
      setLocation('/feedback');
    }
  }, [user, isAdmin, setLocation]);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await getVideos();
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
  };

  const handleAddVideo = async (videoData: any) => {
    try {
      if (editingVideo) {
        // Update existing video
        await updateVideo(editingVideo.id, videoData);
        toast({
          title: 'Success',
          description: 'Video updated successfully!',
        });
      } else {
        // Create new video
        await createVideo(videoData);
        toast({
          title: 'Success',
          description: 'Video added successfully!',
        });
      }
      
      await loadVideos();
      setShowAdminPanel(false);
      setEditingVideo(null);
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: 'Error',
        description: 'Failed to save video. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditVideo = (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      setEditingVideo(video);
      setShowAdminPanel(true);
    }
  };

  const handleToggleVisibility = async (videoId: string, isPublic: boolean) => {
    try {
      await toggleVideoVisibility(videoId, isPublic);
      await loadVideos();
      toast({
        title: 'Sucesso',
        description: isPublic ? 'Vídeo agora está visível ao público' : 'Vídeo ocultado do público',
      });
    } catch (error) {
      console.error('Error toggling video visibility:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao alterar visibilidade. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleClosePanel = () => {
    setShowAdminPanel(false);
    setEditingVideo(null);
  };

  const getAvailableSubTags = () => {
    const subTags = new Set<string>();
    videos
      .filter((v) => !filters.mainTag || v.mainTag === filters.mainTag)
      .forEach((v) => v.subTags.forEach((t) => subTags.add(t)));
    return Array.from(subTags);
  };

  const filteredVideos = videos
    .filter((video) => {
      // Filter out non-public videos for non-admin users
      if (!isAdmin && !video.isPublic) return false;
      return true;
    })
    .filter((video) => {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16 md:pt-20">
        <Hero onSearch={setSearchQuery} />

        <div className="py-4 px-4 md:px-8 max-w-7xl mx-auto flex justify-end">
          <ThemeSelector />
        </div>

        <FilterBar onFilterChange={setFilters} availableSubTags={getAvailableSubTags()} />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          {isAdmin && (
            <div className="flex justify-center mb-8">
              <Button
                size="lg"
                className="gap-2 shadow-lg"
                onClick={() => setShowAdminPanel(true)}
                data-testid="button-add-video"
              >
                <Plus className="h-5 w-5" />
                Adicionar Vídeo
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredVideos.map((video) => (
                <VideoCard 
                  key={video.id} 
                  {...video} 
                  isAdmin={isAdmin}
                  onEdit={handleEditVideo}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {showAdminPanel && (
        <AdminPanel
          onClose={handleClosePanel}
          onSubmit={handleAddVideo}
          editingVideo={editingVideo}
        />
      )}
    </div>
  );
}
