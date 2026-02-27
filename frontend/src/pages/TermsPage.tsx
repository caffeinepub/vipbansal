import { Link } from '@tanstack/react-router';
import { ScrollText, ChevronRight, Mail } from 'lucide-react';

const sections = [
    {
        id: 1,
        title: '1. Acceptance of Terms',
        content: `By downloading, installing, or using R2S Sports Champion Pro ("the App"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the App. These terms apply to all users of the App, including visitors, registered users, and others who access or use the App.`,
    },
    {
        id: 2,
        title: '2. Use of the App',
        content: null,
        subsections: [
            {
                subtitle: 'Permitted Uses',
                text: 'You may use the App for personal, non-commercial entertainment purposes. You may participate in games, submit scores, and interact with the leaderboard features as intended by the App.',
            },
            {
                subtitle: 'Prohibited Uses',
                text: 'You must not: (a) use the App for any unlawful purpose; (b) attempt to hack, reverse-engineer, or exploit any part of the App; (c) use bots, scripts, or automated tools to manipulate scores or leaderboards; (d) harass, abuse, or harm other users; (e) upload or transmit any malicious code or content; (f) impersonate any person or entity; (g) attempt to gain unauthorized access to any part of the App or its servers.',
            },
        ],
    },
    {
        id: 3,
        title: '3. User Accounts and Registration',
        content: `To access certain features of the App, you may be required to create an account. You agree to provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these Terms & Conditions.`,
    },
    {
        id: 4,
        title: '4. In-App Coins and Rewards',
        content: `The App may feature virtual currency ("Coins"), rewards, and other in-app items. These virtual items have no real monetary value unless explicitly stated otherwise by R2S Sports Champion Pro. Virtual coins and rewards are non-transferable, non-refundable, and cannot be exchanged for real money or real-world goods except where explicitly permitted by the App. We reserve the right to modify, suspend, or discontinue any virtual currency or reward system at any time without prior notice.`,
    },
    {
        id: 5,
        title: '5. Leaderboard and Fair Play',
        content: `R2S Sports Champion Pro is committed to fair play. All users are expected to compete honestly and in good faith. Any attempt to manipulate leaderboard rankings through cheating, exploiting bugs, or using unauthorized tools is strictly prohibited. We reserve the right to remove scores, suspend, or permanently ban users found to be engaging in unfair play. Decisions regarding fair play violations are final and at our sole discretion.`,
    },
    {
        id: 6,
        title: '6. Intellectual Property',
        content: `All content within the App, including but not limited to graphics, logos, game designs, text, sounds, and software, is the intellectual property of R2S Sports Champion Pro or its licensors and is protected by applicable copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any content from the App without our prior written consent.`,
    },
    {
        id: 7,
        title: '7. Disclaimer of Warranties',
        content: `The App is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or free of viruses or other harmful components. We disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. Your use of the App is at your sole risk.`,
    },
    {
        id: 8,
        title: '8. Limitation of Liability',
        content: `To the fullest extent permitted by applicable law, R2S Sports Champion Pro and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of or in connection with your use of or inability to use the App. Our total liability to you for any claims arising from your use of the App shall not exceed the amount you paid us in the twelve (12) months preceding the claim.`,
    },
    {
        id: 9,
        title: '9. Changes to Terms',
        content: `We reserve the right to modify these Terms & Conditions at any time. We will notify users of significant changes by updating the "Last Updated" date at the bottom of this page or through in-app notifications. Your continued use of the App after any changes constitutes your acceptance of the new Terms & Conditions. We encourage you to review these terms periodically.`,
    },
    {
        id: 10,
        title: '10. Contact Us',
        content: null,
        isContact: true,
        email: 'mjkjbansal@gmail.com',
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen">
            {/* Page Header */}
            <section className="relative py-14 bg-brand-surface/60 border-b border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-brand-red/5" />
                <div className="relative container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-sm font-heading font-semibold mb-4">
                        <ScrollText size={14} />
                        Legal
                    </div>
                    <h1 className="font-brand text-4xl md:text-5xl font-black text-gold tracking-wider mb-3">
                        Terms & Conditions
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Please read these terms carefully before using R2S Sports Champion Pro.
                    </p>
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
                        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span className="text-gold">Terms & Conditions</span>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Intro box */}
                        <div className="rounded-xl border border-gold/20 bg-gold/5 p-5 mb-10">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                These Terms & Conditions govern your use of <span className="text-gold font-semibold">R2S Sports Champion Pro</span> — the ultimate multi-sports gaming experience. By accessing or using the App, you agree to comply with and be bound by the following terms.
                            </p>
                        </div>

                        {/* Sections */}
                        <div className="space-y-8">
                            {sections.map((section) => (
                                <article key={section.id} className="rounded-xl border border-border bg-card/50 p-6 hover:border-gold/20 transition-colors duration-200">
                                    <h2 className="font-heading font-bold text-xl text-gold mb-4 flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red-bright text-xs font-black shrink-0">
                                            {section.id}
                                        </span>
                                        {section.title.replace(/^\d+\.\s/, '')}
                                    </h2>

                                    {section.content && (
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {section.content}
                                        </p>
                                    )}

                                    {section.subsections && (
                                        <div className="space-y-4">
                                            {section.subsections.map((sub) => (
                                                <div key={sub.subtitle}>
                                                    <h3 className="font-heading font-semibold text-foreground text-sm mb-1.5">
                                                        {sub.subtitle}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {sub.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {section.isContact && (
                                        <div>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                                If you have any questions, concerns, or feedback regarding these Terms & Conditions or the App, please do not hesitate to reach out to us. We are happy to assist you.
                                            </p>
                                            <a
                                                href={`mailto:${section.email}`}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold/10 border border-gold/30 text-gold font-heading font-semibold text-sm hover:bg-gold/20 hover:border-gold/50 transition-all duration-200"
                                            >
                                                <Mail size={16} />
                                                {section.email}
                                            </a>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>

                        {/* Privacy Policy link */}
                        <div className="mt-8 rounded-xl border border-border bg-brand-surface/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-heading font-semibold text-foreground text-sm mb-1">Privacy Policy</p>
                                <p className="text-xs text-muted-foreground">
                                    Your privacy is our priority. Read our full Privacy Policy to understand how we handle your data.
                                </p>
                            </div>
                            <a
                                href="/privacypolicy.htm"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gold/30 text-gold text-sm font-heading font-semibold hover:bg-gold/10 transition-all duration-200"
                            >
                                View Policy
                                <ChevronRight size={14} />
                            </a>
                        </div>

                        {/* Last Updated footer note */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-muted-foreground">
                                <span className="text-gold font-semibold">Last Updated: 2026</span>
                                {' '}— R2S Sports Champion Pro. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
