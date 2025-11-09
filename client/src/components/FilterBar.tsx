import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, SlidersHorizontal, Tag, Star, ArrowUpDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/lib/i18n';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface FilterState {
  mainTag?: string;
  subTag?: string;
  rating?: number;
  sortBy: 'newest' | 'oldest' | 'highestRated' | 'lowestRated';
}

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
  availableSubTags: string[];
}

export default function FilterBar({ onFilterChange, availableSubTags }: FilterBarProps) {
  const { language } = useApp();
  const t = translations[language];
  const [filters, setFilters] = useState<FilterState>({ sortBy: 'newest' });
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters: FilterState = { sortBy: 'newest' };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFilterCount = [filters.mainTag, filters.subTag, filters.rating].filter(Boolean).length;

  return (
    <div className="sticky top-[4rem] md:top-[5rem] z-40 bg-background/95 backdrop-blur-lg border-b shadow-sm animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2" data-testid="button-filters">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1 h-5 min-w-5 rounded-full px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6" align="start">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">Main Category</h4>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={!filters.mainTag ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('mainTag', undefined)}
                      className="flex-1"
                      data-testid="button-filter-all"
                    >
                      {t.filters.all}
                    </Button>
                    <Button
                      variant={filters.mainTag === 'Tourist' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('mainTag', 'Tourist')}
                      className="flex-1"
                      data-testid="button-filter-tourist"
                    >
                      {t.filters.tourist}
                    </Button>
                    <Button
                      variant={filters.mainTag === 'Resident' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('mainTag', 'Resident')}
                      className="flex-1"
                      data-testid="button-filter-resident"
                    >
                      {t.filters.resident}
                    </Button>
                  </div>
                </div>

                {filters.mainTag && availableSubTags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Sub Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableSubTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={filters.subTag === tag ? 'default' : 'outline'}
                          className="cursor-pointer hover-elevate active-elevate-2"
                          onClick={() => updateFilter('subTag', filters.subTag === tag ? undefined : tag)}
                          data-testid={`badge-filter-${tag}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">Minimum Rating</h4>
                  </div>
                  <div className="flex gap-2">
                    {[5, 4, 3].map((r) => (
                      <Button
                        key={r}
                        variant={filters.rating === r ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilter('rating', filters.rating === r ? undefined : r)}
                        className="flex-1"
                        data-testid={`button-rating-${r}`}
                      >
                        {r}+ ⭐
                      </Button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="w-full"
                    data-testid="button-clear-filters"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t.filters.clear}
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-2 border rounded-md px-3 h-9">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select
              value={filters.sortBy}
              onValueChange={(v) => updateFilter('sortBy', v as FilterState['sortBy'])}
            >
              <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 gap-2" data-testid="select-sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t.filters.newest}</SelectItem>
                <SelectItem value="oldest">{t.filters.oldest}</SelectItem>
                <SelectItem value="highestRated">{t.filters.highestRated}</SelectItem>
                <SelectItem value="lowestRated">{t.filters.lowestRated}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters.mainTag && (
            <Badge variant="secondary" className="gap-1" data-testid="badge-active-main">
              {filters.mainTag}
              <X
                className="h-3 w-3 cursor-pointer hover-elevate"
                onClick={() => updateFilter('mainTag', undefined)}
              />
            </Badge>
          )}

          {filters.subTag && (
            <Badge variant="secondary" className="gap-1" data-testid="badge-active-sub">
              {filters.subTag}
              <X
                className="h-3 w-3 cursor-pointer hover-elevate"
                onClick={() => updateFilter('subTag', undefined)}
              />
            </Badge>
          )}

          {filters.rating && (
            <Badge variant="secondary" className="gap-1" data-testid="badge-active-rating">
              {filters.rating}+ Stars
              <X
                className="h-3 w-3 cursor-pointer hover-elevate"
                onClick={() => updateFilter('rating', undefined)}
              />
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
