import { Link } from '@tanstack/react-router';
import { KeyRound, Shield, Smartphone, RefreshCw, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
    {
        icon: Shield,
        title: 'Internet Identity Portal Kholen',
        description: 'https://identity.ic0.app par jayein — yahan aap apna account manage kar sakte hain.',
    },
    {
        icon: Smartphone,
        title: 'Devices Manage Karein',
        description: 'Naye devices add karein ya purane remove karein. Backup devices set up karein future access ke liye.',
    },
    {
        icon: RefreshCw,
        title: 'Recovery Phrase Set Karein',
        description: 'Ek secure recovery phrase set karein taaki aap kabhi bhi apna account recover kar sakein.',
    },
];

export default function PasswordResetPage() {
    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-red/5 blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-gold/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-lg">
                {/* Back Link */}
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-foreground/50 hover:text-gold text-sm font-heading font-semibold transition-colors mb-6"
                >
                    <ArrowLeft size={16} />
                    Login page par wapas jayein
                </Link>

                {/* Card */}
                <div className="bg-brand-surface border border-gold/20 rounded-2xl p-8 shadow-gold-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-red/10 border border-brand-red/30 mb-4">
                            <KeyRound size={28} className="text-brand-red" />
                        </div>
                        <h1 className="font-brand text-3xl font-bold text-gold tracking-wider mb-2">
                            Account Access
                        </h1>
                        <p className="text-foreground/60 font-body text-sm leading-relaxed">
                            VIPbansal mein traditional password nahi hota. Hum{' '}
                            <span className="text-gold font-semibold">Internet Identity</span> use karte hain —
                            ek secure, password-free authentication system.
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl mb-6">
                        <p className="text-foreground/70 text-sm font-body leading-relaxed">
                            <span className="text-gold font-semibold">Internet Identity</span> aapke device ke
                            biometric ya security key se kaam karta hai. Koi password yaad nahi rakhna padta.
                            Agar aap apna access kho dete hain, toh neeche diye steps follow karein.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4 mb-8">
                        {steps.map(({ icon: Icon, title, description }, index) => (
                            <div
                                key={title}
                                className="flex items-start gap-4 p-4 bg-background/40 border border-gold/10 rounded-xl"
                            >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 border border-gold/20 shrink-0">
                                    <span className="text-gold font-brand font-bold text-xs">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon size={15} className="text-gold/70" />
                                        <h3 className="text-foreground/90 font-heading font-semibold text-sm">
                                            {title}
                                        </h3>
                                    </div>
                                    <p className="text-foreground/50 text-xs font-body leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <a
                        href="https://identity.ic0.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <Button className="w-full h-12 bg-gold hover:bg-gold-light text-brand-dark font-heading font-bold text-base tracking-wide rounded-xl transition-all duration-200 shadow-gold-sm hover:shadow-gold">
                            <span className="flex items-center gap-2">
                                <ExternalLink size={18} />
                                Internet Identity Portal Kholen
                            </span>
                        </Button>
                    </a>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gold/15" />
                        <span className="text-foreground/40 text-xs font-body">ALREADY HAVE ACCESS?</span>
                        <div className="flex-1 h-px bg-gold/15" />
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm font-body text-foreground/60">
                        Access mil gaya?{' '}
                        <Link
                            to="/login"
                            className="text-gold hover:text-gold-light font-semibold transition-colors"
                        >
                            Login karein
                        </Link>
                        {' '}ya{' '}
                        <Link
                            to="/signup"
                            className="text-gold hover:text-gold-light font-semibold transition-colors"
                        >
                            Sign Up karein
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
