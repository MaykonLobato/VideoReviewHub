import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/lib/i18n';
import heroImage from '@assets/generated_images/Curaçao_Punda_colorful_waterfront_a2f480e7.png';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const { language } = useApp();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');

  const trendingSearches = ['Beach', 'Restaurant', 'Diving', 'Shopping', 'Hotels'];

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    onSearch(searchTerm);
    if (query) setSearchQuery(query);
  };

  return (
    <div className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {t.hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          {t.hero.subtitle}
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-300" />
              <div className="relative flex gap-3 bg-white dark:bg-card rounded-2xl p-2 shadow-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t.hero.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-14 text-base border-0 focus-visible:ring-0 bg-transparent"
                    data-testid="input-search"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={() => handleSearch()}
                  className="h-14 px-8 rounded-xl"
                  data-testid="button-search"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Trending:</span>
            </div>
            {trendingSearches.map((term) => (
              <Badge
                key={term}
                variant="secondary"
                className="cursor-pointer hover-elevate active-elevate-2 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                onClick={() => handleSearch(term)}
                data-testid={`badge-trending-${term}`}
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
