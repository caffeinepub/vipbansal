import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { UserPlus, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRegisterUser, useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
    const { login, loginStatus, identity } = useInternetIdentity();
    const navigate = useNavigate();
    const { data: userProfile, isFetched } = useGetCallerUserProfile();
    const registerUser = useRegisterUser();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');

    const isAuthenticated = !!identity;
    const isLoggingIn = loginStatus === 'logging-in';

    // If already registered, redirect to home
    useEffect(() => {
        if (isAuthenticated && isFetched && userProfile !== null && userProfile !== undefined) {
            navigate({ to: '/' });
        }
    }, [isAuthenticated, isFetched, userProfile, navigate]);

    const handleConnectIdentity = async () => {
        try {
            await login();
        } catch (error: unknown) {
            const err = error as Error;
            if (err?.message === 'User is already authenticated') {
                // already logged in, continue
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!name.trim()) {
            setFormError('Name zaroori hai');
            return;
        }
        if (!username.trim()) {
            setFormError('Username zaroori hai');
            return;
        }
        if (!email.trim()) {
            setFormError('Email zaroori hai');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setFormError('Valid email address daalen');
            return;
        }

        try {
            await registerUser.mutateAsync({
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
            });
        } catch (error: unknown) {
            const err = error as Error;
            const msg = err?.message ?? '';
            if (msg.includes('already registered')) {
                setFormError('Yeh account pehle se registered hai. Login karein.');
            } else if (msg.includes('empty')) {
                setFormError('Name, username aur email empty nahi ho sakte.');
            } else {
                setFormError('Registration fail hui. Dobara try karein.');
            }
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-red/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-brand-surface border border-gold/20 rounded-2xl p-8 shadow-gold-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30 mb-4">
                            <UserPlus size={28} className="text-gold" />
                        </div>
                        <h1 className="font-brand text-3xl font-bold text-gold tracking-wider mb-2">
                            Join VIPbansal
                        </h1>
                        <p className="text-foreground/60 font-body text-sm">
                            Naya account banayein aur khel shuru karein
                        </p>
                    </div>

                    {/* Success State */}
                    {registerUser.isSuccess && (
                        <div className="mb-6 flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                            <CheckCircle size={18} className="text-green-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-green-400 font-heading font-semibold text-sm">
                                    Registration successful! 🎉
                                </p>
                                <p className="text-green-400/70 text-xs mt-1 font-body">
                                    Welcome to VIPbansal! Home page par ja rahe hain...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Connect Internet Identity */}
                    {!isAuthenticated && (
                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/20 rounded-xl mb-4">
                                <Shield size={18} className="text-gold shrink-0" />
                                <p className="text-foreground/70 text-sm font-body">
                                    Pehle apni Internet Identity se connect karein, phir account details bharein.
                                </p>
                            </div>
                            <Button
                                onClick={handleConnectIdentity}
                                disabled={isLoggingIn}
                                className="w-full h-11 bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30 font-heading font-bold text-sm tracking-wide rounded-xl transition-all duration-200"
                            >
                                {isLoggingIn ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                                        Connecting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Shield size={16} />
                                        Connect Internet Identity
                                    </span>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Registration Form */}
                    {isAuthenticated && !registerUser.isSuccess && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Identity Connected Badge */}
                            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <CheckCircle size={15} className="text-green-400 shrink-0" />
                                <span className="text-green-400 text-xs font-heading font-semibold">
                                    Internet Identity connected ✓
                                </span>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground/80 font-heading font-semibold text-sm">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Apna poora naam daalen"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={registerUser.isPending}
                                    className="bg-background/50 border-gold/20 focus:border-gold/50 text-foreground placeholder:text-foreground/30 rounded-xl h-11"
                                    maxLength={60}
                                />
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-foreground/80 font-heading font-semibold text-sm">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Apna username daalen"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={registerUser.isPending}
                                    className="bg-background/50 border-gold/20 focus:border-gold/50 text-foreground placeholder:text-foreground/30 rounded-xl h-11"
                                    maxLength={30}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground/80 font-heading font-semibold text-sm">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="apka@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={registerUser.isPending}
                                    className="bg-background/50 border-gold/20 focus:border-gold/50 text-foreground placeholder:text-foreground/30 rounded-xl h-11"
                                />
                            </div>

                            {/* Error Message */}
                            {(formError || registerUser.isError) && (
                                <div className="flex items-start gap-2 p-3 bg-brand-red/10 border border-brand-red/30 rounded-xl">
                                    <AlertCircle size={16} className="text-brand-red shrink-0 mt-0.5" />
                                    <p className="text-brand-red text-sm font-body">
                                        {formError || 'Registration fail hui. Dobara try karein.'}
                                    </p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={registerUser.isPending}
                                className="w-full h-12 bg-gold hover:bg-gold-light text-brand-dark font-heading font-bold text-base tracking-wide rounded-xl transition-all duration-200 shadow-gold-sm hover:shadow-gold disabled:opacity-60"
                            >
                                {registerUser.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-brand-dark/40 border-t-brand-dark rounded-full animate-spin" />
                                        Registering...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <UserPlus size={18} />
                                        Account Banayein
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gold/15" />
                        <span className="text-foreground/40 text-xs font-body">ALREADY MEMBER?</span>
                        <div className="flex-1 h-px bg-gold/15" />
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm font-body text-foreground/60">
                        Pehle se account hai?{' '}
                        <Link
                            to="/login"
                            className="text-gold hover:text-gold-light font-semibold transition-colors"
                        >
                            Login karein
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
