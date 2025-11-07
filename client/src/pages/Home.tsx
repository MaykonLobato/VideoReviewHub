import { useState, useEffect, useMemo } from 'react';
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
import {
  createVideo,
  updateVideo,
  toggleVideoVisibility,
} from '@/lib/firestore';
import { filterAndSortVideos } from '@/lib/video-utils';
import type { Video, CreateVideoInput, UpdateVideoInput } from '@/types/video';
import { useToast } from '@/hooks/use-toast';
import { useVideos } from '@/hooks/use-videos';

export default function Home() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { videos, isLoading, loadVideos, error } = useVideos();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ sortBy: 'newest' });
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Show error toast if videos query fails
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load videos. Please refresh the page.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleAddVideo = async (
    videoData: CreateVideoInput | UpdateVideoInput
  ) => {
    try {
      if (editingVideo) {
        // Update existing video
        await updateVideo(editingVideo.id, videoData as UpdateVideoInput);
        toast({
          title: 'Success',
          description: 'Video updated successfully!',
        });
      } else {
        // Create new video
        await createVideo(videoData as CreateVideoInput);
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
    const video = videos.find((v) => v.id === videoId);
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
        description: isPublic
          ? 'Vídeo agora está visível ao público'
          : 'Vídeo ocultado do público',
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

  const getAvailableSubTags = useMemo(() => {
    const subTags = new Set<string>();
    videos
      .filter((v) => !filters.mainTag || v.mainTag === filters.mainTag)
      .forEach((v) => v.subTags.forEach((t) => subTags.add(t)));
    return Array.from(subTags);
  }, [videos, filters.mainTag]);

  const filteredVideos = useMemo(
    () => filterAndSortVideos(videos, filters, searchQuery, isAdmin),
    [videos, filters, searchQuery, isAdmin]
  );

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <div className='pt-16 md:pt-20'>
        <Hero onSearch={setSearchQuery} />

        <div className='py-4 px-4 md:px-8 max-w-7xl mx-auto flex justify-end'>
          <ThemeSelector />
        </div>

        <FilterBar
          onFilterChange={setFilters}
          availableSubTags={getAvailableSubTags}
        />

        <div className='max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20'>
          {isAdmin && (
            <div className='flex justify-center mb-8'>
              <Button
                size='lg'
                className='gap-2 shadow-lg'
                onClick={() => setShowAdminPanel(true)}
                data-testid='button-add-video'
              >
                <Plus className='h-5 w-5' />
                Adicionar Vídeo
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className='flex items-center justify-center py-20'>
              <Loader2 className='h-12 w-12 animate-spin text-primary' />
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  {...video}
                  isAdmin={isAdmin}
                  isAuthenticated={!!user}
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
