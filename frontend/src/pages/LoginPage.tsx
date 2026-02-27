import { useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { LogIn, Shield, Zap, KeyRound } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
    const { login, loginStatus, identity } = useInternetIdentity();
    const navigate = useNavigate();

    const isLoggingIn = loginStatus === 'logging-in';
    const isAuthenticated = !!identity;

    useEffect(() => {
        if (isAuthenticated) {
            navigate({ to: '/' });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        try {
            await login();
        } catch (error: unknown) {
            const err = error as Error;
            if (err?.message === 'User is already authenticated') {
                navigate({ to: '/' });
            }
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-brand-red/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-brand-surface border border-gold/20 rounded-2xl p-8 shadow-gold-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30 mb-4">
                            <LogIn size={28} className="text-gold" />
                        </div>
                        <h1 className="font-brand text-3xl font-bold text-gold tracking-wider mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-foreground/60 font-body text-sm">
                            VIPbansal Sports Gaming mein login karein
                        </p>
                    </div>

                    {/* Login Button */}
                    <Button
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        className="w-full h-12 bg-gold hover:bg-gold-light text-brand-dark font-heading font-bold text-base tracking-wide rounded-xl transition-all duration-200 shadow-gold-sm hover:shadow-gold disabled:opacity-60"
                    >
                        {isLoggingIn ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-brand-dark/40 border-t-brand-dark rounded-full animate-spin" />
                                Logging in...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Shield size={18} />
                                Login with Internet Identity
                            </span>
                        )}
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gold/15" />
                        <span className="text-foreground/40 text-xs font-body">OR</span>
                        <div className="flex-1 h-px bg-gold/15" />
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm font-body text-foreground/60">
                        Naya account banayein?{' '}
                        <Link
                            to="/signup"
                            className="text-gold hover:text-gold-light font-semibold transition-colors"
                        >
                            Sign Up karein
                        </Link>
                    </p>

                    {/* Password Reset Link */}
                    <p className="text-center text-xs font-body text-foreground/40 mt-3">
                        Account access mein problem?{' '}
                        <Link
                            to="/reset-password"
                            className="text-brand-red/80 hover:text-brand-red font-semibold transition-colors"
                        >
                            Manage Account / Reset Access
                        </Link>
                    </p>
                </div>

                {/* Features */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                        { icon: Shield, label: 'Secure Login' },
                        { icon: Zap, label: 'Instant Access' },
                        { icon: KeyRound, label: 'No Password' },
                    ].map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center gap-2 p-3 bg-brand-surface/50 border border-gold/10 rounded-xl"
                        >
                            <Icon size={18} className="text-gold/70" />
                            <span className="text-xs font-heading text-foreground/50 text-center">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
