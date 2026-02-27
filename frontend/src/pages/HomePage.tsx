import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Gamepad2, Trophy, Smartphone, Zap, Star, ChevronRight, Crown, Medal, Users, Wifi, Award } from 'lucide-react';
import { useGetAllGames, useGetTopScores } from '../hooks/useQueries';
import GameCard from '../components/GameCard';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
    {
        icon: Smartphone,
        title: 'Online & Live',
        description: 'All games are live online — play instantly from any browser, no download needed.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-900/20 border-emerald-700/30',
    },
    {
        icon: Zap,
        title: 'Fast & Thrilling',
        description: 'Experience lightning-fast gameplay with smooth controls and immersive sports action.',
        color: 'text-gold',
        bg: 'bg-gold/10 border-gold/20',
    },
    {
        icon: Trophy,
        title: 'Compete & Win',
        description: 'Climb the leaderboard, beat high scores, and prove you are the ultimate sports champion.',
        color: 'text-brand-red-bright',
        bg: 'bg-brand-red/10 border-brand-red/20',
    },
];

const sports = [
    { emoji: '🏏', name: 'Cricket', color: 'from-emerald-900/60 to-emerald-800/30' },
    { emoji: '⚽', name: 'Football', color: 'from-blue-900/60 to-blue-800/30' },
    { emoji: '🏀', name: 'Basketball', color: 'from-orange-900/60 to-orange-800/30' },
    { emoji: '🏎️', name: 'Racing', color: 'from-red-900/60 to-red-800/30' },
    { emoji: '🏸', name: 'Badminton', color: 'from-purple-900/60 to-purple-800/30' },
    { emoji: '🎯', name: 'Shooting', color: 'from-yellow-900/60 to-yellow-800/30' },
];

const r2sSports = [
    { emoji: '🏏', name: 'Cricket', desc: 'Hit sixes, bowl fast, and lead your team to victory.' },
    { emoji: '⚽', name: 'Football', desc: 'Score goals, defend, and win championships.' },
    { emoji: '🏀', name: 'Basketball', desc: 'Dunk, dribble, and dominate the court.' },
    { emoji: '🏎️', name: 'Racing', desc: 'Speed through challenging tracks & unlock cool vehicles.' },
    { emoji: '🏸', name: 'Badminton', desc: 'Smash and serve like a pro.' },
    { emoji: '🎯', name: 'Shooting', desc: 'Test your aim and reflexes.' },
];

const r2sFeatures = [
    { icon: Gamepad2, text: 'Multiple sports in a single app' },
    { icon: Zap, text: 'Smooth controls & realistic physics' },
    { icon: Wifi, text: 'Offline & online play' },
    { icon: Award, text: 'Unlock achievements and rewards' },
    { icon: Users, text: 'Compete with friends & global leaderboard' },
];

const categoryEmoji: Record<string, string> = {
    Cricket: '🏏',
    Football: '⚽',
    Basketball: '🏀',
    Tennis: '🎾',
    Racing: '🏎️',
    Badminton: '🏸',
    Shooting: '🎯',
};

function FeaturedGamesSkeleton() {
    return (
        <div className="flex gap-5 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shrink-0 w-64 rounded-xl overflow-hidden border border-border bg-card">
                    <Skeleton className="h-40 w-full bg-muted/40" />
                    <div className="p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-muted/40" />
                        <Skeleton className="h-8 w-full bg-muted/40" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function HomePage() {
    const { data: games, isLoading: gamesLoading } = useGetAllGames();
    const { data: scores, isLoading: scoresLoading } = useGetTopScores();

    const featuredGames = games ? games.slice(0, 6) : [];
    const topPlayer = scores && scores.length > 0 ? scores[0] : null;

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0">
                    <img
                        src="/assets/generated/hero-banner.dim_1200x400.png"
                        alt="VIPbansal Sports Hero"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-brand-dark/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative container mx-auto px-4 py-24 md:py-36">
                    <div className="max-w-2xl">
                        {/* Brand badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-sm font-heading font-semibold mb-6">
                            <Star size={14} className="fill-current" />
                            Premium Sports Gaming
                        </div>

                        {/* Brand name */}
                        <h1 className="font-brand text-5xl md:text-7xl font-black tracking-wider text-gold mb-2 leading-none">
                            VIPbansal
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-gold to-brand-red rounded-full mb-6" />

                        {/* Tagline */}
                        <p className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
                            Online Sports Games{' '}
                            <span className="text-gold">Khelo</span>
                        </p>
                        <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed">
                            Discover the ultimate collection of online sports games. Cricket, Football, Basketball, Racing, Badminton, Shooting — play them all and dominate the leaderboard!
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link to="/games">
                                <Button
                                    size="lg"
                                    className="bg-gold text-brand-dark font-heading font-bold text-base tracking-wide hover:bg-gold-light glow-gold transition-all duration-200 px-8"
                                >
                                    <Gamepad2 size={20} className="mr-2" />
                                    Browse Games
                                </Button>
                            </Link>
                            <Link to="/leaderboard">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-gold/40 text-gold hover:bg-gold/10 hover:border-gold font-heading font-bold text-base tracking-wide transition-all duration-200 px-8"
                                >
                                    <Trophy size={20} className="mr-2" />
                                    Leaderboard
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Player Ticker */}
            {(topPlayer || scoresLoading) && (
                <section className="bg-gradient-to-r from-brand-red/20 via-brand-surface to-gold/10 border-y border-gold/20 py-3 overflow-hidden">
                    <div className="container mx-auto px-4">
                        {scoresLoading ? (
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-5 w-48 bg-muted/40" />
                            </div>
                        ) : topPlayer ? (
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2 shrink-0">
                                    <Crown size={16} className="text-gold fill-current" />
                                    <span className="font-heading font-bold text-gold text-sm tracking-wide uppercase">
                                        Top Player
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-gold/30 shrink-0" />
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-heading font-bold text-foreground text-sm">
                                        {topPlayer.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {categoryEmoji[topPlayer.category as unknown as string] || '🎮'}{' '}
                                        {topPlayer.category as unknown as string}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold">
                                        <Medal size={11} />
                                        {Number(topPlayer.score).toLocaleString()} pts
                                    </span>
                                </div>
                                <div className="ml-auto shrink-0">
                                    <Link to="/leaderboard">
                                        <span className="text-xs text-gold/70 hover:text-gold transition-colors font-heading cursor-pointer">
                                            View all →
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </section>
            )}

            {/* R2S Sports Champion Pro Section */}
            <section className="py-16 bg-brand-surface/60 border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-red/15 border border-brand-red/30 text-brand-red-bright text-sm font-heading font-semibold mb-4">
                                <Trophy size={14} className="fill-current" />
                                R2S Sports Champion Pro
                            </div>
                            <h2 className="font-brand text-3xl md:text-4xl font-black text-gold tracking-wide mb-3">
                                The Ultimate Multi-Sports Experience
                            </h2>
                            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                                Step into the world of R2S Sports Champion Pro – the ultimate multi-sports gaming experience! 🎮
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                            {/* Sports List */}
                            <div>
                                <h3 className="font-heading font-bold text-lg text-foreground mb-5 flex items-center gap-2">
                                    <span className="text-gold">Play Your Favorite Sports</span>
                                    <span className="text-muted-foreground text-sm font-normal">— anytime, anywhere</span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {r2sSports.map((sport) => (
                                        <div
                                            key={sport.name}
                                            className="flex items-start gap-3 p-4 rounded-xl bg-background/60 border border-border hover:border-gold/40 hover:bg-gold/5 transition-all duration-200 group"
                                        >
                                            <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200">
                                                {sport.emoji}
                                            </span>
                                            <div>
                                                <p className="font-heading font-bold text-foreground group-hover:text-gold transition-colors text-sm">
                                                    {sport.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                                                    {sport.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features List */}
                            <div>
                                <h3 className="font-heading font-bold text-lg text-gold mb-5">
                                    ✅ Key Features
                                </h3>
                                <ul className="space-y-3 mb-8">
                                    {r2sFeatures.map((feat) => {
                                        const Icon = feat.icon;
                                        return (
                                            <li
                                                key={feat.text}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border border-border"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                                                    <Icon size={16} className="text-gold" />
                                                </div>
                                                <span className="text-sm text-foreground font-heading font-medium">
                                                    {feat.text}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* CTA */}
                                <div className="relative rounded-xl overflow-hidden border border-gold/30 bg-gradient-to-br from-brand-dark to-brand-surface p-6 text-center">
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-brand-red/5" />
                                    <div className="relative">
                                        <p className="font-heading font-bold text-foreground mb-1 text-base">
                                            Join the community of sports champions!
                                        </p>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Experience the thrill of victory 🏆
                                        </p>
                                        <Link to="/games">
                                            <Button
                                                size="sm"
                                                className="bg-gold text-brand-dark font-heading font-bold tracking-wide hover:bg-gold-light glow-gold transition-all duration-200"
                                            >
                                                <Gamepad2 size={16} className="mr-2" />
                                                Play Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Games Section */}
            <section className="py-14 relative overflow-hidden">
                {/* Background banner */}
                <div className="absolute inset-0 opacity-10">
                    <img
                        src="/assets/generated/featured-games-banner.dim_1200x300.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
                </div>

                <div className="relative container mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-heading font-semibold mb-2">
                                <Zap size={12} className="fill-current" />
                                Featured
                            </div>
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                                Featured <span className="text-gold">Games</span>
                            </h2>
                        </div>
                        <Link to="/games">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold font-heading font-semibold"
                            >
                                View All
                                <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </Link>
                    </div>

                    {gamesLoading && <FeaturedGamesSkeleton />}

                    {!gamesLoading && featuredGames.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            <Gamepad2 size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="font-heading">Games coming soon!</p>
                        </div>
                    )}

                    {!gamesLoading && featuredGames.length > 0 && (
                        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                            {featuredGames.map((game) => (
                                <div key={String(game.id)} className="shrink-0 w-72 snap-start">
                                    <GameCard game={game} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Sports Categories */}
            <section className="py-16 bg-brand-surface/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Sports <span className="text-gold">Categories</span>
                        </h2>
                        <p className="text-muted-foreground">Choose your favorite sport and start playing</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {sports.map((sport) => (
                            <Link key={sport.name} to="/games">
                                <div
                                    className={`group relative rounded-xl p-6 bg-gradient-to-br ${sport.color} border border-border hover:border-gold/40 transition-all duration-200 cursor-pointer text-center card-hover`}
                                >
                                    <div className="text-4xl mb-3">{sport.emoji}</div>
                                    <p className="font-heading font-bold text-base text-foreground group-hover:text-gold transition-colors">
                                        {sport.name}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Why <span className="text-gold">VIPbansal</span>?
                        </h2>
                        <p className="text-muted-foreground">The best online sports gaming platform</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className={`rounded-xl p-6 border ${feature.bg} transition-all duration-200 hover:scale-[1.02]`}
                                >
                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-background/50">
                                        <Icon size={24} className={feature.color} />
                                    </div>
                                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 bg-brand-surface/50">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-2xl overflow-hidden border border-gold/20 bg-gradient-to-r from-brand-dark to-brand-surface p-10 text-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-brand-red/5" />
                        <div className="relative">
                            <h2 className="font-brand text-3xl md:text-4xl font-black text-gold mb-3 tracking-wide">
                                Ready to Play?
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                Join thousands of players on VIPbansal and experience the thrill of online sports gaming.
                            </p>
                            <Link to="/games">
                                <Button
                                    size="lg"
                                    className="bg-gold text-brand-dark font-heading font-bold text-base tracking-wide hover:bg-gold-light glow-gold transition-all duration-200 px-10"
                                >
                                    Start Playing
                                    <ChevronRight size={20} className="ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
