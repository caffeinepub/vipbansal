import { Link } from '@tanstack/react-router';
import { Heart, Gamepad2 } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();
    const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'vipbansal-sports');

    return (
        <footer className="border-t border-border bg-brand-surface/80 mt-auto">
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <img
                                src="/assets/generated/vipbansal-logo.dim_128x128.png"
                                alt="VIPbansal"
                                className="w-8 h-8 rounded-full border border-gold/40"
                            />
                            <span className="font-brand text-lg font-bold text-gold tracking-wider">VIPbansal</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The ultimate destination for Android sports games. Play, compete, and dominate!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-foreground mb-3 text-sm uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/games', label: 'Games' },
                                { to: '/leaderboard', label: 'Leaderboard' },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-muted-foreground hover:text-gold transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sports */}
                    <div>
                        <h4 className="font-heading font-bold text-foreground mb-3 text-sm uppercase tracking-wider">
                            Sports
                        </h4>
                        <ul className="space-y-2">
                            {['🏏 Cricket', '⚽ Football', '🏀 Basketball', '🎾 Tennis'].map((sport) => (
                                <li key={sport}>
                                    <Link
                                        to="/games"
                                        className="text-sm text-muted-foreground hover:text-gold transition-colors"
                                    >
                                        {sport}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Gamepad2 size={14} className="text-gold" />
                        <span>© {year} VIPbansal. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        Built with{' '}
                        <Heart size={13} className="text-brand-red fill-current mx-0.5" />
                        {' '}using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:text-gold-light transition-colors font-medium"
                        >
                            caffeine.ai
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
