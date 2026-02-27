import { useState } from 'react';
import { useAddPlayerScore } from '../hooks/useQueries';
import { SportCategory } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CheckCircle, AlertCircle, Loader2, Send, Trophy } from 'lucide-react';

const sportOptions = [
    { value: SportCategory.Cricket, label: '🏏 Cricket' },
    { value: SportCategory.Football, label: '⚽ Football' },
    { value: SportCategory.Basketball, label: '🏀 Basketball' },
    { value: SportCategory.Tennis, label: '🎾 Tennis' },
];

export default function ScoreSubmissionForm() {
    const [username, setUsername] = useState('');
    const [score, setScore] = useState('');
    const [category, setCategory] = useState<SportCategory | ''>('');
    const [submitted, setSubmitted] = useState(false);

    const addScore = useAddPlayerScore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !score || !category) return;

        const scoreNum = parseInt(score, 10);
        if (isNaN(scoreNum) || scoreNum < 0) return;

        try {
            await addScore.mutateAsync({
                username: username.trim(),
                score: BigInt(scoreNum),
                category: category as SportCategory,
            });
            setSubmitted(true);
            setUsername('');
            setScore('');
            setCategory('');
            setTimeout(() => setSubmitted(false), 5000);
        } catch {
            // error handled by mutation state
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success message */}
            {submitted && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-900/30 border border-emerald-500/50 text-emerald-300 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-heading font-bold text-emerald-200">Score Submitted! 🎉</p>
                        <p className="text-xs text-emerald-400 mt-0.5">
                            Your score has been added to the leaderboard.
                        </p>
                    </div>
                </div>
            )}

            {/* Error message */}
            {addScore.isError && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-brand-red/15 border border-brand-red/50 text-red-300 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                        <p className="font-heading font-bold text-red-200">Submission Failed</p>
                        <p className="text-xs text-red-400 mt-0.5">
                            {addScore.error instanceof Error
                                ? addScore.error.message.includes('not registered')
                                    ? 'You must be registered to submit scores.'
                                    : addScore.error.message.includes('Unauthorized')
                                    ? 'Please log in to submit your score.'
                                    : 'Failed to submit score. Please try again.'
                                : 'Failed to submit score. Please try again.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-heading font-semibold text-gold/80">
                    Player Name
                </Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background border-border focus:border-gold/60 focus:ring-gold/20 text-foreground placeholder:text-muted-foreground"
                    disabled={addScore.isPending}
                    maxLength={30}
                />
            </div>

            {/* Score */}
            <div className="space-y-1.5">
                <Label htmlFor="score" className="text-sm font-heading font-semibold text-gold/80">
                    Your Score
                </Label>
                <Input
                    id="score"
                    type="number"
                    placeholder="e.g. 5000"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="bg-background border-border focus:border-gold/60 focus:ring-gold/20 text-foreground placeholder:text-muted-foreground"
                    disabled={addScore.isPending}
                    min={0}
                    max={9999999}
                />
            </div>

            {/* Sport Category */}
            <div className="space-y-1.5">
                <Label className="text-sm font-heading font-semibold text-gold/80">Sport</Label>
                <Select
                    value={category}
                    onValueChange={(val) => setCategory(val as SportCategory)}
                    disabled={addScore.isPending}
                >
                    <SelectTrigger className="bg-background border-border focus:border-gold/60 text-foreground">
                        <SelectValue placeholder="Select sport..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        {sportOptions.map((opt) => (
                            <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className="text-foreground hover:bg-gold/10 focus:bg-gold/10"
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={addScore.isPending || !username.trim() || !score || !category}
                className="w-full bg-gold text-brand-dark font-heading font-bold tracking-wide hover:bg-gold-light glow-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {addScore.isPending ? (
                    <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Trophy size={16} className="mr-2" />
                        Submit Score
                        <Send size={14} className="ml-2 opacity-70" />
                    </>
                )}
            </Button>
        </form>
    );
}
