import { useState } from 'react';
import { useGetAllGames } from '../hooks/useQueries';
import GameCard from '../components/GameCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Gamepad2, AlertCircle, Filter } from 'lucide-react';
import { SportCategory } from '../backend';

type FilterCategory = 'All' | SportCategory;

const filterOptions: { label: string; value: FilterCategory; emoji: string }[] = [
    { label: 'All', value: 'All', emoji: '🎮' },
    { label: 'Cricket', value: SportCategory.Cricket, emoji: '🏏' },
    { label: 'Football', value: SportCategory.Football, emoji: '⚽' },
    { label: 'Basketball', value: SportCategory.Basketball, emoji: '🏀' },
    { label: 'Tennis', value: SportCategory.Tennis, emoji: '🎾' },
];

function GameCardSkeleton() {
    return (
        <div className="rounded-xl overflow-hidden border border-border bg-card">
            <Skeleton className="h-48 w-full bg-muted/40" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 bg-muted/40" />
                <Skeleton className="h-4 w-full bg-muted/40" />
                <Skeleton className="h-4 w-2/3 bg-muted/40" />
                <Skeleton className="h-9 w-full bg-muted/40 mt-2" />
            </div>
        </div>
    );
}

export default function GamesPage() {
    const { data: games, isLoading, isError } = useGetAllGames();
    const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

    const filteredGames =
        games && activeFilter !== 'All'
            ? games.filter((g) => (g.category as unknown as string) === activeFilter)
            : games;

    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <section className="relative py-14 bg-brand-surface/60 border-b border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-brand-red/5" />
                <div className="relative container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-sm font-heading font-semibold mb-4">
                        <Gamepad2 size={14} />
                        Online Sports Games
                    </div>
                    <h1 className="font-brand text-4xl md:text-5xl font-black text-gold tracking-wider mb-3">
                        Game Library
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Explore our collection of premium online sports games. Pick your sport and start playing!
                    </p>
                </div>
            </section>

            {/* Category Filter Bar */}
            <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-3 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <Filter size={16} className="text-muted-foreground shrink-0 mr-1" />
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setActiveFilter(opt.value)}
                                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-heading font-semibold border transition-all duration-200 ${
                                    activeFilter === opt.value
                                        ? 'bg-gold text-brand-dark border-gold shadow-[0_0_12px_oklch(0.78_0.16_85_/_0.4)] scale-105'
                                        : 'bg-card text-muted-foreground border-border hover:border-gold/50 hover:text-gold hover:bg-gold/5'
                                }`}
                            >
                                <span>{opt.emoji}</span>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Games Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {isError && (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                            <AlertCircle size={48} className="text-brand-red opacity-60" />
                            <p className="font-heading text-lg">Failed to load games. Please try again.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <GameCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !isError && filteredGames && filteredGames.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                            <Gamepad2 size={48} className="opacity-30" />
                            <p className="font-heading text-lg">
                                {activeFilter === 'All'
                                    ? 'No games available yet.'
                                    : `No ${activeFilter} games available yet.`}
                            </p>
                            <p className="text-sm">Check back soon for new games!</p>
                            {activeFilter !== 'All' && (
                                <button
                                    onClick={() => setActiveFilter('All')}
                                    className="mt-2 text-gold text-sm font-heading font-semibold hover:underline"
                                >
                                    View all games →
                                </button>
                            )}
                        </div>
                    )}

                    {!isLoading && !isError && filteredGames && filteredGames.length > 0 && (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-muted-foreground text-sm">
                                    Showing{' '}
                                    <span className="text-gold font-semibold">{filteredGames.length}</span>{' '}
                                    {activeFilter !== 'All' ? (
                                        <>
                                            <span className="text-gold font-semibold">{activeFilter}</span>{' '}
                                        </>
                                    ) : null}
                                    game{filteredGames.length !== 1 ? 's' : ''}
                                </p>
                                {activeFilter !== 'All' && (
                                    <button
                                        onClick={() => setActiveFilter('All')}
                                        className="text-xs text-muted-foreground hover:text-gold transition-colors font-heading"
                                    >
                                        Clear filter ✕
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredGames.map((game) => (
                                    <GameCard key={String(game.id)} game={game} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
