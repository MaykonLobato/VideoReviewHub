import { useApp } from '@/contexts/AppContext';
import { translations } from '@/lib/i18n';
import emptyStateImg from '@assets/generated_images/Empty_state_video_search_b0053d9f.png';

export default function EmptyState() {
  const { language } = useApp();
  const t = translations[language];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <img
        src={emptyStateImg}
        alt="No videos found"
        className="w-32 h-32 mb-6 opacity-50"
        data-testid="img-empty-state"
      />
      <h3 className="text-2xl font-semibold mb-2" data-testid="text-empty-title">
        {t.empty.title}
      </h3>
      <p className="text-muted-foreground text-center max-w-md" data-testid="text-empty-subtitle">
        {t.empty.subtitle}
      </p>
    </div>
  );
}
