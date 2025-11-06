import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/lib/i18n';

export default function ThemeSelector() {
  const { language, theme, setTheme } = useApp();
  const t = translations[language];

  const themes = [
    { value: 'caribbean' as const, name: t.themes.caribbean, color: 'bg-[hsl(189,85%,42%)]' },
    { value: 'tropical' as const, name: t.themes.tropical, color: 'bg-[hsl(335,80%,52%)]' },
    { value: 'sunset' as const, name: t.themes.sunset, color: 'bg-[hsl(15,85%,55%)]' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-theme-selector">
          <Palette className="h-4 w-4 mr-2" />
          {themes.find((t) => t.value === theme)?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            data-testid={`button-theme-${t.value}`}
          >
            <div className={`w-4 h-4 rounded-full mr-2 ${t.color}`} />
            {t.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
