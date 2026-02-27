import { ShieldX, Home } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function AccessDeniedScreen() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-brand-red/10 border-2 border-brand-red/30 flex items-center justify-center">
                    <ShieldX size={48} className="text-brand-red" />
                </div>
                <div className="absolute inset-0 rounded-full animate-ping bg-brand-red/10" style={{ animationDuration: '2s' }} />
            </div>

            <h1 className="font-brand text-3xl md:text-4xl font-bold text-brand-red mb-3 tracking-wider">
                Access Denied
            </h1>
            <p className="font-body text-foreground/60 text-lg mb-2 max-w-md">
                You don't have permission to access this page.
            </p>
            <p className="font-body text-foreground/40 text-sm mb-8 max-w-sm">
                This area is restricted to administrators only. Please log in with an admin account.
            </p>

            <Link to="/">
                <Button className="bg-gold text-brand-dark hover:bg-gold-light font-heading font-bold tracking-wide gap-2">
                    <Home size={16} />
                    Back to Home
                </Button>
            </Link>
        </div>
    );
}
