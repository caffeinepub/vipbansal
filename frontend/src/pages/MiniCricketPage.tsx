import { useState } from 'react';
import { RotateCcw, Zap } from 'lucide-react';

type BallResult = {
    run: number;
    isOut: boolean;
};

const RUN_LABELS: Record<number, string> = {
    1: '1 Run',
    2: '2 Runs',
    3: '3 Runs',
    4: 'FOUR! 🏏',
    5: '5 Runs',
    6: 'SIX! 🔥',
};

function BallDot({ result }: { result: BallResult | null }) {
    if (!result) {
        return (
            <div className="w-9 h-9 rounded-full border-2 border-gold/30 bg-brand-surface flex items-center justify-center text-xs font-bold text-foreground/30">
                •
            </div>
        );
    }
    if (result.isOut) {
        return (
            <div className="w-9 h-9 rounded-full border-2 border-brand-red bg-brand-red/20 flex items-center justify-center text-xs font-bold text-brand-red">
                W
            </div>
        );
    }
    const run = result.run;
    const isBig = run === 4 || run === 6;
    return (
        <div
            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                isBig
                    ? 'border-gold bg-gold/20 text-gold'
                    : 'border-gold/50 bg-gold/10 text-gold-light'
            }`}
        >
            {run}
        </div>
    );
}

export default function MiniCricketPage() {
    const [score, setScore] = useState(0);
    const [ballsLeft, setBallsLeft] = useState(6);
    const [ballHistory, setBallHistory] = useState<(BallResult | null)[]>(Array(6).fill(null));
    const [lastResult, setLastResult] = useState<string | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const currentBallIndex = 6 - ballsLeft;

    const hitBall = () => {
        if (ballsLeft <= 0 || isGameOver || isAnimating) return;

        setIsAnimating(true);
        const run = Math.floor(Math.random() * 7); // 0–6
        const isOut = run === 0;
        const newBallsLeft = ballsLeft - 1;
        const newScore = isOut ? score : score + run;
        const newHistory = [...ballHistory];
        newHistory[currentBallIndex] = { run, isOut };

        setTimeout(() => {
            setBallHistory(newHistory);
            setBallsLeft(newBallsLeft);

            if (isOut) {
                setLastResult('OUT! 😢');
            } else {
                setLastResult(`You scored ${run} run${run !== 1 ? 's' : ''}! ${run === 6 ? '🔥' : run === 4 ? '🏏' : '✨'}`);
                setScore(newScore);
            }

            if (newBallsLeft === 0) {
                setIsGameOver(true);
            }

            setIsAnimating(false);
        }, 300);
    };

    const playAgain = () => {
        setScore(0);
        setBallsLeft(6);
        setBallHistory(Array(6).fill(null));
        setLastResult(null);
        setIsGameOver(false);
        setIsAnimating(false);
    };

    const getRating = (s: number) => {
        if (s >= 30) return { label: 'Champion! 🏆', color: 'text-gold' };
        if (s >= 20) return { label: 'Great Innings! 🌟', color: 'text-gold-light' };
        if (s >= 10) return { label: 'Decent Play 👍', color: 'text-foreground/80' };
        return { label: 'Better Luck Next Time 💪', color: 'text-foreground/60' };
    };

    const rating = getRating(score);

    return (
        <main className="min-h-screen bg-background py-8 px-4">
            {/* Header */}
            <div className="max-w-lg mx-auto text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/30 rounded-full px-4 py-1.5 mb-4">
                    <span className="text-brand-red text-sm font-heading font-semibold tracking-wider uppercase">Mini Game</span>
                </div>
                <h1 className="font-brand text-4xl md:text-5xl font-bold text-gold tracking-wider mb-2">
                    🏏 Cricket
                </h1>
                <p className="text-foreground/60 font-body text-sm">
                    6 balls. Score as many runs as you can. Don't get OUT!
                </p>
            </div>

            {/* Game Card */}
            <div className="max-w-lg mx-auto">
                <div className="bg-brand-surface border border-gold/20 rounded-2xl overflow-hidden shadow-gold-glow">

                    {/* Score Board */}
                    <div className="bg-gradient-to-r from-brand-dark via-brand-surface to-brand-dark border-b border-gold/20 p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-foreground/50 font-heading text-xs uppercase tracking-widest mb-1">Score</p>
                                <p className="font-brand text-5xl font-bold text-gold leading-none">{score}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-foreground/50 font-heading text-xs uppercase tracking-widest mb-1">Balls Left</p>
                                <p className={`font-brand text-5xl font-bold leading-none ${ballsLeft <= 2 ? 'text-brand-red' : 'text-foreground/80'}`}>
                                    {ballsLeft}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ball History */}
                    <div className="px-6 py-4 border-b border-gold/10">
                        <p className="text-foreground/40 font-heading text-xs uppercase tracking-widest mb-3 text-center">Ball by Ball</p>
                        <div className="flex justify-center gap-2">
                            {ballHistory.map((result, i) => (
                                <BallDot key={i} result={result} />
                            ))}
                        </div>
                    </div>

                    {/* Result Message */}
                    <div className="px-6 py-4 min-h-[72px] flex items-center justify-center">
                        {lastResult && !isGameOver && (
                            <div className={`text-center font-heading font-bold text-lg ${
                                lastResult.startsWith('OUT') ? 'text-brand-red' : 'text-gold'
                            }`}>
                                {lastResult}
                            </div>
                        )}
                        {isGameOver && (
                            <div className="text-center">
                                <p className="font-brand text-2xl font-bold text-gold mb-1">
                                    Game Over!
                                </p>
                                <p className="font-heading text-foreground/70 text-sm mb-1">
                                    Final Score: <span className="text-gold font-bold">{score}</span>
                                </p>
                                <p className={`font-heading text-sm font-semibold ${rating.color}`}>
                                    {rating.label}
                                </p>
                            </div>
                        )}
                        {!lastResult && !isGameOver && (
                            <p className="text-foreground/30 font-body text-sm italic">Hit the ball to start scoring!</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-6 flex flex-col gap-3">
                        {!isGameOver ? (
                            <button
                                onClick={hitBall}
                                disabled={isGameOver || isAnimating}
                                className={`w-full py-4 rounded-xl font-brand text-xl font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-3 ${
                                    isAnimating
                                        ? 'bg-gold/50 text-brand-dark cursor-wait scale-95'
                                        : 'bg-gold hover:bg-gold-light text-brand-dark hover:scale-[1.02] active:scale-95 shadow-gold-glow'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isAnimating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-brand-dark/40 border-t-brand-dark rounded-full animate-spin" />
                                        Bowling...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={22} />
                                        Hit Ball 🏏
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={playAgain}
                                className="w-full py-4 rounded-xl font-brand text-xl font-bold tracking-wider bg-brand-red hover:bg-brand-red/80 text-white transition-all duration-200 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 shadow-red-glow"
                            >
                                <RotateCcw size={22} />
                                Play Again
                            </button>
                        )}
                    </div>
                </div>

                {/* How to Play */}
                <div className="mt-6 bg-brand-surface/50 border border-gold/10 rounded-xl p-5">
                    <h3 className="font-heading font-bold text-gold text-sm uppercase tracking-widest mb-3">How to Play</h3>
                    <ul className="space-y-2">
                        {[
                            { icon: '🏏', text: 'You get 6 balls per innings' },
                            { icon: '🎲', text: 'Each hit gives 0–6 random runs' },
                            { icon: '❌', text: 'Roll 0 = OUT! No runs scored' },
                            { icon: '🔥', text: 'Score 30+ to become Champion!' },
                        ].map(({ icon, text }) => (
                            <li key={text} className="flex items-center gap-3 text-foreground/60 font-body text-sm">
                                <span className="text-base">{icon}</span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
