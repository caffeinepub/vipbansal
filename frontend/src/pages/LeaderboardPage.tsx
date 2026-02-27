import { useGetTopScores } from '../hooks/useQueries';
import LeaderboardTable from '../components/LeaderboardTable';
import ScoreSubmissionForm from '../components/ScoreSubmissionForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LeaderboardPage() {
    const { data: scores, isLoading, isError, refetch, isFetching } = useGetTopScores();

    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <section className="relative py-14 bg-brand-surface/60 border-b border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-brand-red/5" />
                <div className="relative container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-sm font-heading font-semibold mb-4">
                        <Trophy size={14} />
                        Hall of Champions
                    </div>
                    <h1 className="font-brand text-4xl md:text-5xl font-black text-gold tracking-wider mb-3">
                        Leaderboard
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Top players across all sports. Compete, score high, and claim your spot at the top!
                    </p>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Leaderboard Table */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <Trophy size={22} className="text-gold" />
                                    <h2 className="font-heading text-2xl font-bold text-foreground">
                                        Top <span className="text-gold">10</span> Players
                                    </h2>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetch()}
                                    disabled={isFetching}
                                    className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold font-heading font-semibold gap-2 transition-all duration-200"
                                >
                                    <RefreshCw
                                        size={14}
                                        className={isFetching ? 'animate-spin' : ''}
                                    />
                                    {isFetching ? 'Refreshing...' : 'Refresh'}
                                </Button>
                            </div>

                            {isError && (
                                <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                                    <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="font-heading text-lg">Failed to load scores.</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => refetch()}
                                        className="mt-4 border-gold/30 text-gold hover:bg-gold/10"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}

                            {isLoading && (
                                <div className="rounded-xl border border-border bg-card overflow-hidden">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-4 p-4 border-b border-border last:border-0"
                                        >
                                            <Skeleton className="w-8 h-8 rounded-full bg-muted/40" />
                                            <Skeleton className="h-4 w-32 bg-muted/40" />
                                            <Skeleton className="h-4 w-20 bg-muted/40 ml-auto" />
                                            <Skeleton className="h-4 w-16 bg-muted/40" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoading && !isError && (
                                <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
                                    <LeaderboardTable scores={scores || []} />
                                </div>
                            )}
                        </div>

                        {/* Score Submission Form */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="rounded-xl border border-gold/30 bg-card p-6 shadow-[0_0_30px_oklch(0.78_0.16_85_/_0.08)]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <PlusCircle size={22} className="text-gold" />
                                        <h2 className="font-heading text-xl font-bold text-foreground">
                                            Submit <span className="text-gold">Score</span>
                                        </h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                                        Played a game? Submit your score and compete with players worldwide!
                                    </p>
                                    <ScoreSubmissionForm />
                                </div>

                                {/* Stats card */}
                                {!isLoading && scores && scores.length > 0 && (
                                    <div className="mt-4 rounded-xl border border-border bg-card p-5">
                                        <h3 className="font-heading font-bold text-base text-foreground mb-3">
                                            Quick Stats
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Total Players</span>
                                                <span className="font-semibold text-gold">{scores.length}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Top Score</span>
                                                <span className="font-semibold text-gold">
                                                    {Number(scores[0]?.score || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Champion</span>
                                                <span className="font-semibold text-gold truncate max-w-[120px]">
                                                    {scores[0]?.username || '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
