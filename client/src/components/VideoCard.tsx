import { useState } from 'react';
import { useLocation } from 'wouter';
import { Star, Pin, Edit, MapPin, Play, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/lib/i18n';
import { getYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/video-utils';
import type { Location } from '@/types/video';

interface VideoCardProps {
  id: string;
  youtubeUrl: string;
  title: string;
  mainTag: string;
  subTags: string[];
  rating: number;
  isSponsored: boolean;
  ribbonColor?: string;
  isPinned: boolean;
  isPublic: boolean;
  location?: Location;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
  onEdit?: (id: string) => void;
  onToggleVisibility?: (id: string, isPublic: boolean) => void;
}

export default function VideoCard({
  id,
  youtubeUrl,
  title,
  mainTag,
  subTags,
  rating,
  isSponsored,
  ribbonColor,
  isPinned,
  isPublic,
  location,
  isAdmin = false,
  isAuthenticated = false,
  onEdit,
  onToggleVisibility,
}: VideoCardProps) {
  const [, setLocation] = useLocation();
  const { language } = useApp();
  const t = translations[language];
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = getYouTubeId(youtubeUrl);
  const thumbnailUrl = getYouTubeThumbnail(videoId);
  const embedUrl = getYouTubeEmbedUrl(videoId);

  const ribbonColors = {
    gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    silver: 'bg-gradient-to-r from-gray-300 to-gray-500',
    bronze: 'bg-gradient-to-r from-amber-600 to-amber-800',
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility?.(id, !isPublic);
  };

  const openInGoogleMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      window.open(url, '_blank');
    }
  };

  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const handleSendFeedback = (e: React.MouseEvent) => {
    e.stopPropagation();
    const encodedTitle = encodeURIComponent(title);
    setLocation(`/feedback?videoTitle=${encodedTitle}`);
  };

  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid="card-video">
      <div className="relative aspect-video">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            data-testid="iframe-player"
          />
        ) : (
          <>
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              data-testid="img-thumbnail"
            />
            <div className="absolute inset-0 hover:bg-black/50 transition-colors cursor-pointer group" onClick={handlePlayVideo} data-testid="button-play">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-primary p-4 md:p-6 shadow-xl">
                  <Play className="h-8 w-8 md:h-12 md:w-12 text-primary-foreground fill-current" />
                </div>
              </div>
            </div>
          </>
        )}

        {isPinned && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full p-1.5" data-testid="badge-pinned">
            <Pin className="h-4 w-4 fill-current" />
          </div>
        )}

        {isSponsored && ribbonColor && !isPlaying && (
          <div className={`absolute right-0 w-24 h-24 overflow-hidden pointer-events-none ${isAdmin ? 'top-12' : 'top-0'}`}>
            <div
              className={`${ribbonColors[ribbonColor as keyof typeof ribbonColors] || ribbonColors.gold} text-white text-[7px] font-bold tracking-[0.2em] uppercase py-1 shadow-lg transform rotate-45 absolute top-5 -right-7 w-32 text-center`}
              data-testid="badge-sponsored"
            >
              {t.video.sponsored}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-lg"
              onClick={handleToggleVisibility}
              data-testid={`button-visibility-${id}`}
              title={isPublic ? 'Ocultar do público' : 'Tornar visível ao público'}
            >
              {isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-lg"
              onClick={handleEdit}
              data-testid={`button-edit-${id}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg md:text-xl font-semibold line-clamp-2 flex-1" data-testid="text-title">
            {title}
          </h3>
          {isAdmin && !isPublic && (
            <Badge variant="destructive" className="text-xs shrink-0" data-testid="badge-hidden">
              <EyeOff className="h-3 w-3 mr-1" />
              Oculto
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3" data-testid="rating-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">
            ({rating} {t.video.stars})
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="default" data-testid="badge-main-tag">
            {mainTag}
          </Badge>
          {subTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs" data-testid={`badge-subtag-${tag}`}>
              {tag}
            </Badge>
          ))}
        </div>

        {location && (
          <div
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            onClick={openInGoogleMaps}
            data-testid="button-open-maps"
            title="Abrir no Google Maps"
          >
            <MapPin className="h-4 w-4" />
            <span>{location.name}</span>
          </div>
        )}

        {isAuthenticated && !isAdmin && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleSendFeedback}
              data-testid="button-send-feedback"
            >
              <MessageSquare className="h-4 w-4" />
              Send Feedback
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
