import { useState } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Menu, X, Trophy, Gamepad2, Home, LogIn, UserPlus, LogOut, User, Shield, Smartphone, Swords, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';

const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/games', label: 'Games', icon: Gamepad2 },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/r2s-game', label: 'R2S Game', icon: Swords },
    { to: '/mini-cricket', label: 'Mini Cricket', icon: Dices },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { identity, clear } = useInternetIdentity();
    const queryClient = useQueryClient();
    const { data: userProfile } = useGetCallerUserProfile();
    const { data: isAdmin } = useIsCallerAdmin();

    const isAuthenticated = !!identity;

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const handleLogout = async () => {
        await clear();
        queryClient.clear();
        setMobileOpen(false);
        navigate({ to: '/' });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-brand-dark/95 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gold/60 group-hover:border-gold transition-colors">
                            <img
                                src="/assets/generated/vipbansal-logo.dim_128x128.png"
                                alt="VIPbansal Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="font-brand text-xl font-bold tracking-wider text-gold group-hover:text-gold-light transition-colors">
                            VIPbansal
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md font-heading font-semibold text-sm tracking-wide transition-all duration-200 ${
                                    isActive(to)
                                        ? 'bg-gold/15 text-gold border border-gold/30'
                                        : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                                }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}

                        {/* Admin Link - Desktop */}
                        {isAuthenticated && isAdmin && (
                            <Link
                                to="/admin"
                                className={`flex items-center gap-2 px-4 py-2 rounded-md font-heading font-semibold text-sm tracking-wide transition-all duration-200 ${
                                    isActive('/admin')
                                        ? 'bg-gold/15 text-gold border border-gold/30'
                                        : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                                }`}
                            >
                                <Shield size={16} />
                                Admin
                            </Link>
                        )}

                        {/* Auth Links - Desktop */}
                        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gold/20">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-heading font-semibold text-gold/80">
                                        <User size={15} />
                                        <span className="max-w-[120px] truncate">
                                            {userProfile?.username ?? 'Player'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 rounded-md font-heading font-semibold text-sm tracking-wide text-foreground/70 hover:text-brand-red hover:bg-brand-red/10 transition-all duration-200"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-heading font-semibold text-sm tracking-wide transition-all duration-200 ${
                                            isActive('/login')
                                                ? 'bg-gold/15 text-gold border border-gold/30'
                                                : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                                        }`}
                                    >
                                        <LogIn size={16} />
                                        Login
                                    </Link>
                                    <Link
                                        to="/otp-login"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-heading font-semibold text-sm tracking-wide transition-all duration-200 ${
                                            isActive('/otp-login')
                                                ? 'bg-gold/15 text-gold border border-gold/30'
                                                : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                                        }`}
                                    >
                                        <Smartphone size={16} />
                                        OTP Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center gap-2 px-4 py-2 rounded-md font-heading font-semibold text-sm tracking-wide bg-gold text-brand-dark hover:bg-gold-light transition-all duration-200"
                                    >
                                        <UserPlus size={16} />
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Hamburger */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-gold hover:bg-gold/10"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gold/20 bg-brand-dark/98">
                    <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-md font-heading font-semibold text-base tracking-wide transition-all duration-200 ${
                                    isActive(to)
                                        ? 'bg-gold/15 text-gold border border-gold/30'
                                        : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                                }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        ))}

                        {/* Admin Link - Mobile */}
                        {isAuthenticated && isAdmin && (
                            <Link
                                to="/admin"
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-md font-heading font-semibold text-base tracking-wide transition-all duration-200 ${
                                    isActive('/admin')
                                        ? 'bg-gold/15 text-gold border border-gold/30'
                                        : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                                }`}
                            >
                                <Shield size={18} />
                                Admin
                            </Link>
                        )}

                        {/* Auth Links - Mobile */}
                        <div className="mt-2 pt-2 border-t border-gold/20 flex flex-col gap-1">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-2 text-sm font-heading font-semibold text-gold/80">
                                        <User size={16} />
                                        <span>{userProfile?.username ?? 'Player'}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-4 py-3 rounded-md font-heading font-semibold text-base tracking-wide text-foreground/70 hover:text-brand-red hover:bg-brand-red/10 transition-all duration-200 text-left"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-md font-heading font-semibold text-base tracking-wide transition-all duration-200 ${
                                            isActive('/login')
                                                ? 'bg-gold/15 text-gold border border-gold/30'
                                                : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                                        }`}
                                    >
                                        <LogIn size={18} />
                                        Login
                                    </Link>
                                    <Link
                                        to="/otp-login"
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-md font-heading font-semibold text-base tracking-wide transition-all duration-200 ${
                                            isActive('/otp-login')
                                                ? 'bg-gold/15 text-gold border border-gold/30'
                                                : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                                        }`}
                                    >
                                        <Smartphone size={18} />
                                        OTP Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-md font-heading font-semibold text-base tracking-wide bg-gold text-brand-dark hover:bg-gold-light transition-all duration-200"
                                    >
                                        <UserPlus size={18} />
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
