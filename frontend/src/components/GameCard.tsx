import { type Game, SportCategory } from '../backend';
import { Button } from '@/components/ui/button';
import { Play, Smartphone, ExternalLink } from 'lucide-react';

interface GameCardProps {
    game: Game;
}

const categoryColors: Record<string, string> = {
    [SportCategory.Cricket]: 'bg-emerald-900/60 text-emerald-300 border-emerald-600/40',
    [SportCategory.Football]: 'bg-blue-900/60 text-blue-300 border-blue-600/40',
    [SportCategory.Basketball]: 'bg-orange-900/60 text-orange-300 border-orange-600/40',
    [SportCategory.Tennis]: 'bg-yellow-900/60 text-yellow-300 border-yellow-600/40',
};

const categoryEmoji: Record<string, string> = {
    [SportCategory.Cricket]: '🏏',
    [SportCategory.Football]: '⚽',
    [SportCategory.Basketball]: '🏀',
    [SportCategory.Tennis]: '🎾',
};

const fallbackImages: Record<string, string> = {
    [SportCategory.Cricket]: '/assets/generated/cricket-thumb.dim_400x250.png',
    [SportCategory.Football]: '/assets/generated/football-thumb.dim_400x250.png',
    [SportCategory.Basketball]: '/assets/generated/basketball-thumb.dim_400x250.png',
    [SportCategory.Tennis]: '/assets/generated/tennis-thumb.dim_400x250.png',
};

export default function GameCard({ game }: GameCardProps) {
    const thumbnailUrl =
        game.thumbnail?.getDirectURL() ||
        fallbackImages[game.category as string] ||
        '/assets/generated/cricket-thumb.dim_400x250.png';
    const categoryKey = game.category as unknown as string;
    const colorClass = categoryColors[categoryKey] || 'bg-muted text-foreground border-border';
    const emoji = categoryEmoji[categoryKey] || '🎮';

    const handlePlay = () => {
        const url = game.gameUrl && game.gameUrl.trim() !== '' ? game.gameUrl : null;
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const hasUrl = game.gameUrl && game.gameUrl.trim() !== '';

    return (
        <div className="game-card group relative flex flex-col rounded-xl overflow-hidden border border-border bg-card">
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-brand-surface">
                <img
                    src={thumbnailUrl}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                            fallbackImages[categoryKey] ||
                            '/assets/generated/cricket-thumb.dim_400x250.png';
                    }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

                {/* Glow overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-gold/10 via-transparent to-transparent" />

                {/* Category badge on image */}
                <div className="absolute top-3 left-3">
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}
                    >
                        {emoji} {categoryKey}
                    </span>
                </div>

                {/* Android badge */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-brand-dark/80 text-gold border border-gold/30">
                        <Smartphone size={11} />
                        Online
                    </span>
                </div>

                {/* Live indicator */}
                {hasUrl && (
                    <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-500/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            LIVE
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                <h3 className="font-heading font-bold text-lg text-foreground leading-tight group-hover:text-gold transition-colors duration-200">
                    {game.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                    {game.description}
                </p>

                {/* Play button */}
                <Button
                    onClick={handlePlay}
                    disabled={!hasUrl}
                    className={`w-full mt-1 font-heading font-bold tracking-wide transition-all duration-200 ${
                        hasUrl
                            ? 'bg-gold text-brand-dark hover:bg-gold-light glow-gold hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                    }`}
                    size="sm"
                >
                    {hasUrl ? (
                        <>
                            <Play size={15} className="mr-1.5 fill-current" />
                            Play Now
                            <ExternalLink size={12} className="ml-1.5 opacity-70" />
                        </>
                    ) : (
                        <>
                            <Play size={15} className="mr-1.5" />
                            Coming Soon
                        </>
                    )}
                </Button>
            </div>

            {/* Gold accent line at bottom */}
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500" />

            {/* Glow border on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-gold/40 shadow-[0_0_20px_rgba(0,0,0,0)] group-hover:shadow-[0_0_25px_oklch(0.78_0.16_85_/_0.25)]" />
        </div>
    );
}
