import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Coins, Zap, Trophy, User, Star, DollarSign, Loader2, X, CreditCard, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetCallerUserProfile, useSubmitWithdrawRequest } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Variant_admin_user } from '../backend';
import CricketScoreWidget from '../components/CricketScoreWidget';

// ─── Types ────────────────────────────────────────────────────────────────────
type GameStatus = 'idle' | 'bowling' | 'hit' | 'miss' | 'gameover';

interface FeedbackPopup {
  text: string;
  color: string;
  key: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const BALL_SPEED_MS = 2200;       // time for ball to cross the pitch
const HIT_WINDOW_MS = 500;        // how long the hit window stays open
const MAX_WICKETS = 3;
const COINS_PER_RUN = 2;

const RUN_LABELS: Record<number, string> = {
  0: 'OUT! 💀',
  1: '1 Run!',
  2: '2 Runs!',
  3: '3 Runs!',
  4: '4! 🔥',
  6: '6! 🚀',
};

function getRandomRun(): number {
  const options = [1, 1, 2, 2, 3, 4, 4, 6, 6];
  return options[Math.floor(Math.random() * options.length)];
}

// ─── CricketGame Component ────────────────────────────────────────────────────
function CricketGame({ onCoinsEarned }: { onCoinsEarned: (n: number) => void }) {
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [ballPos, setBallPos] = useState(0);
  const [wickets, setWickets] = useState(MAX_WICKETS);
  const [score, setScore] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackPopup | null>(null);
  const [hitWindowOpen, setHitWindowOpen] = useState(false);
  const [lastRun, setLastRun] = useState<number | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const hitWindowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackKeyRef = useRef(0);

  const startBowling = useCallback(() => {
    if (gameStatus === 'bowling' || gameStatus === 'gameover') return;

    setGameStatus('bowling');
    setHitWindowOpen(false);
    setBallPos(0);
    setLastRun(null);
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / BALL_SPEED_MS, 1);
      setBallPos(progress * 100);

      if (progress < 1) {
        if (progress >= 0.35 && progress < 0.65) {
          setHitWindowOpen(true);
        } else if (progress >= 0.65) {
          setHitWindowOpen(false);
        }
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setHitWindowOpen(false);
        handleMiss();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [gameStatus]);

  const handleMiss = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setHitWindowOpen(false);

    setWickets((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setGameStatus('gameover');
      } else {
        setGameStatus('miss');
        setTimeout(() => setGameStatus('idle'), 900);
      }
      return next;
    });

    feedbackKeyRef.current += 1;
    setFeedback({ text: 'MISS! 🏏', color: 'text-red-400', key: feedbackKeyRef.current });
    setTimeout(() => setFeedback(null), 1200);
  }, []);

  const handleHitShot = useCallback(() => {
    if (gameStatus !== 'bowling' || !hitWindowOpen) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (hitWindowTimerRef.current) clearTimeout(hitWindowTimerRef.current);
    setHitWindowOpen(false);

    const run = getRandomRun();
    const earned = run * COINS_PER_RUN;

    setLastRun(run);
    setScore((prev) => prev + run);
    setSessionCoins((prev) => prev + earned);
    onCoinsEarned(earned);

    feedbackKeyRef.current += 1;
    const label = RUN_LABELS[run] ?? `${run} Runs!`;
    const color = run >= 6 ? 'text-yellow-300' : run >= 4 ? 'text-orange-400' : 'text-green-400';
    setFeedback({ text: label, color, key: feedbackKeyRef.current });
    setTimeout(() => setFeedback(null), 1200);

    setGameStatus('hit');
    setTimeout(() => setGameStatus('idle'), 900);
  }, [gameStatus, hitWindowOpen, onCoinsEarned]);

  const handlePlayAgain = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setGameStatus('idle');
    setBallPos(0);
    setWickets(MAX_WICKETS);
    setScore(0);
    setSessionCoins(0);
    setLastRun(null);
    setFeedback(null);
    setHitWindowOpen(false);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (hitWindowTimerRef.current) clearTimeout(hitWindowTimerRef.current);
    };
  }, []);

  const isGameOver = gameStatus === 'gameover';
  const isBowling = gameStatus === 'bowling';
  const canBowl = gameStatus === 'idle' || gameStatus === 'hit' || gameStatus === 'miss';

  return (
    <div className="bg-brand-surface rounded-2xl border border-gold/20 p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-gold" />
          <h2 className="font-orbitron text-xl text-gold">Cricket Batting</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-white/40 text-xs font-rajdhani uppercase tracking-wider">Score</p>
            <p className="font-orbitron text-xl font-black text-gold">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-xs font-rajdhani uppercase tracking-wider">Wickets</p>
            <div className="flex gap-1 justify-center mt-0.5">
              {Array.from({ length: MAX_WICKETS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    i < wickets
                      ? 'bg-green-500 border-green-400'
                      : 'bg-red-900/60 border-red-700/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pitch / Game Area */}
      <div className="relative bg-gradient-to-b from-green-950/60 to-green-900/30 border border-green-800/30 rounded-xl h-28 mb-5 overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-green-700/20" />
        </div>
        <div className="absolute left-[35%] top-0 bottom-0 w-px bg-yellow-500/20" />
        <div className="absolute left-[65%] top-0 bottom-0 w-px bg-yellow-500/20" />
        <div className="absolute left-[35%] right-[35%] top-1 flex justify-center">
          <span className="text-yellow-500/50 text-xs font-rajdhani">HIT ZONE</span>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1 h-10 bg-amber-200/80 rounded-sm" />
          ))}
        </div>

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl select-none">🏃</div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-2xl select-none">🏏</div>

        {isBowling && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-red-600 border-2 border-red-400 shadow-lg flex items-center justify-center transition-none"
            style={{
              left: `calc(${ballPos}% - 14px)`,
              boxShadow: '0 0 8px rgba(220,38,38,0.6)',
            }}
          >
            <div className="w-3 h-px bg-red-300/60 rotate-45" />
          </div>
        )}

        {gameStatus === 'hit' && (
          <div className="absolute inset-0 bg-gold/10 animate-pulse rounded-xl" />
        )}
        {gameStatus === 'miss' && (
          <div className="absolute inset-0 bg-red-900/20 animate-pulse rounded-xl" />
        )}
      </div>

      {/* Feedback Popup */}
      <div className="h-10 flex items-center justify-center mb-3">
        {feedback && (
          <span
            key={feedback.key}
            className={`font-orbitron text-2xl font-black ${feedback.color} animate-bounce`}
          >
            {feedback.text}
          </span>
        )}
        {!feedback && lastRun !== null && !isBowling && !isGameOver && (
          <span className="font-rajdhani text-white/50 text-sm">
            {lastRun === 0 ? '' : `+${lastRun * COINS_PER_RUN} coins earned`}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={startBowling}
          disabled={!canBowl || isGameOver}
          className="bg-brand-red hover:bg-brand-red/90 text-white font-orbitron font-bold py-5 rounded-xl disabled:opacity-40"
        >
          {isBowling ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Bowling...
            </>
          ) : (
            '⚾ Bowl'
          )}
        </Button>

        <Button
          onClick={handleHitShot}
          disabled={!hitWindowOpen}
          className={`font-orbitron font-bold py-5 rounded-xl transition-all duration-150 ${
            hitWindowOpen
              ? 'bg-gold text-brand-dark shadow-gold scale-105 animate-pulse'
              : 'bg-gold/30 text-gold/50 cursor-not-allowed'
          }`}
        >
          🏏 Hit Shot!
        </Button>
      </div>

      {!isBowling && !isGameOver && (
        <p className="text-white/30 text-xs font-rajdhani text-center mt-3">
          Bowl first, then hit when the ball enters the <span className="text-yellow-500/60">HIT ZONE</span>
        </p>
      )}

      {sessionCoins > 0 && !isGameOver && (
        <div className="mt-3 text-center">
          <span className="text-gold/70 font-rajdhani text-sm">
            Session: +{sessionCoins} coins earned
          </span>
        </div>
      )}

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 p-6">
          <div className="text-6xl mb-3">🏏</div>
          <h3 className="font-orbitron text-2xl font-black text-brand-red mb-1">GAME OVER</h3>
          <p className="text-white/50 font-rajdhani mb-5">All wickets lost!</p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/40 text-xs font-rajdhani uppercase tracking-wider mb-1">Final Score</p>
              <p className="font-orbitron text-3xl font-black text-gold">{score}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-white/40 text-xs font-rajdhani uppercase tracking-wider mb-1">Coins Earned</p>
              <p className="font-orbitron text-3xl font-black text-gold">{sessionCoins}</p>
            </div>
          </div>

          <Button
            onClick={handlePlayAgain}
            className="bg-gold hover:bg-gold/90 text-brand-dark font-orbitron font-bold px-8 py-5 rounded-xl shadow-gold"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function R2SGamePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const submitWithdrawRequest = useSubmitWithdrawRequest();

  const [coins, setCoins] = useState(0);
  const [tapMessage, setTapMessage] = useState('');

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('₹100');
  const [withdrawSuccess, setWithdrawSuccess] = useState<{ requestId: bigint } | null>(null);

  const handleCoinsEarned = useCallback((n: number) => {
    setCoins((prev) => prev + n);
  }, []);

  const handleTap = () => {
    setCoins((prev) => prev + 5);
    setTapMessage('+5 coins!');
    setTimeout(() => setTapMessage(''), 1000);
  };

  const handleWithdraw = () => {
    if (coins < 1000) {
      setWithdrawError('Minimum 1000 coins required!');
      setWithdrawOpen(false);
      return;
    }
    setWithdrawError('');
    setWithdrawSuccess(null);
    setUpiId('');
    setSelectedAmount('₹100');
    setWithdrawOpen(true);
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) {
      setWithdrawError('Please enter your UPI ID.');
      return;
    }
    if (!userProfile) {
      setWithdrawError('User profile not loaded. Please log in.');
      return;
    }
    setWithdrawError('');
    try {
      const requestId = await submitWithdrawRequest.mutateAsync({
        userId: userProfile.userId,
        amount: selectedAmount,
        upiId: upiId.trim(),
      });
      setWithdrawSuccess({ requestId });
    } catch (err: any) {
      setWithdrawError(err?.message || 'Failed to submit withdraw request. Please try again.');
    }
  };

  const profileRole =
    userProfile?.role === Variant_admin_user.admin || (userProfile?.role as any) === 'admin'
      ? 'Admin'
      : 'User';

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-brand-dark via-brand-surface to-brand-dark border-b border-gold/20 py-10 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="cricket-ball" />
        </div>
        <h1 className="font-orbitron text-3xl md:text-4xl font-black text-gold mb-2 relative z-10">
          R2S Play & Earn
        </h1>
        <p className="text-white/60 font-rajdhani text-lg relative z-10">
          Play cricket, earn coins, withdraw real rewards!
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Game Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Cricket Game */}
          <CricketGame onCoinsEarned={handleCoinsEarned} />

          {/* Cricket Score Widget */}
          <CricketScoreWidget />

          {/* Tap & Earn */}
          <div className="bg-brand-surface rounded-2xl border border-gold/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-gold" />
              <h2 className="font-orbitron text-xl text-gold">Tap & Earn</h2>
            </div>
            <p className="text-white/50 font-rajdhani mb-4">Tap the button to earn +5 coins instantly!</p>
            <div className="relative">
              <Button
                onClick={handleTap}
                className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-orbitron font-bold text-lg py-6 rounded-xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                TAP TO EARN
              </Button>
              {tapMessage && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold text-brand-dark font-orbitron font-bold px-3 py-1 rounded-full text-sm animate-bounce">
                  {tapMessage}
                </div>
              )}
            </div>
          </div>

          {/* Coins & Withdraw */}
          <div className="bg-brand-surface rounded-2xl border border-gold/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Coins className="w-6 h-6 text-gold" />
                <h2 className="font-orbitron text-xl text-gold">Your Coins</h2>
              </div>
              <span className="font-orbitron text-3xl font-black text-gold">{coins.toLocaleString()}</span>
            </div>

            {withdrawError && !withdrawOpen && (
              <div className="mb-4 bg-red-900/40 border border-red-500/40 rounded-lg px-4 py-3 text-red-300 font-rajdhani text-sm flex items-center gap-2">
                <X className="w-4 h-4 flex-shrink-0" />
                {withdrawError}
              </div>
            )}

            <Button
              onClick={handleWithdraw}
              className="w-full bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-400 text-brand-dark font-orbitron font-bold py-5 rounded-xl"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Withdraw Coins
            </Button>
            <p className="text-white/30 text-xs font-rajdhani text-center mt-3">
              Minimum 1000 coins required to withdraw
            </p>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-brand-surface rounded-2xl border border-gold/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-gold" />
              <h2 className="font-orbitron text-lg text-gold">Profile</h2>
            </div>
            {profileLoading ? (
              <div className="flex items-center gap-2 text-white/40 font-rajdhani">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            ) : userProfile ? (
              <div className="space-y-3">
                <div>
                  <p className="text-white/40 text-xs font-rajdhani uppercase tracking-wider">Name</p>
                  <p className="text-white font-rajdhani font-semibold">{userProfile.name}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-rajdhani uppercase tracking-wider">Username</p>
                  <p className="text-white font-rajdhani">@{userProfile.username}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-rajdhani uppercase tracking-wider">Role</p>
                  <Badge className="bg-gold/20 text-gold border-gold/40 font-rajdhani">
                    {profileRole}
                  </Badge>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-rajdhani uppercase tracking-wider">Balance</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-white/70 font-rajdhani text-sm">
                      USDT: <span className="text-gold font-bold">{userProfile.balance.usdt.toFixed(2)}</span>
                    </span>
                    <span className="text-white/70 font-rajdhani text-sm">
                      IRN: <span className="text-gold font-bold">{userProfile.balance.irn.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white/40 font-rajdhani text-sm">
                {identity ? 'No profile found. Please register.' : 'Please log in to view your profile.'}
              </div>
            )}
          </div>

          {/* How to Play */}
          <div className="bg-brand-surface rounded-2xl border border-gold/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-gold" />
              <h2 className="font-orbitron text-lg text-gold">How to Play</h2>
            </div>
            <ol className="space-y-3">
              {[
                { step: '1', text: 'Click "Bowl" to start a delivery' },
                { step: '2', text: 'Watch the ball — hit when it enters the HIT ZONE' },
                { step: '3', text: 'Score runs to earn coins (2 coins per run)' },
                { step: '4', text: 'You have 3 wickets — don\'t miss!' },
                { step: '5', text: 'Collect 1000+ coins to withdraw' },
              ].map(({ step, text }) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gold/20 border border-gold/40 text-gold font-orbitron text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step}
                  </span>
                  <span className="text-white/60 font-rajdhani text-sm">{text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Rewards Info */}
          <div className="bg-brand-surface rounded-2xl border border-gold/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-gold" />
              <h2 className="font-orbitron text-lg text-gold">Rewards</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: '1 Run', value: '2 Coins' },
                { label: '4 Runs (Boundary)', value: '8 Coins' },
                { label: '6 Runs (Six!)', value: '12 Coins' },
                { label: 'Tap & Earn', value: '5 Coins/tap' },
                { label: 'Min Withdraw', value: '1000 Coins' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-white/50 font-rajdhani text-sm">{label}</span>
                  <span className="text-gold font-orbitron text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="bg-brand-surface border-gold/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-gold text-xl">
              {withdrawSuccess ? '✅ Request Submitted!' : 'Withdraw Coins'}
            </DialogTitle>
            <DialogDescription className="text-white/50 font-rajdhani">
              {withdrawSuccess
                ? `Your withdrawal request #${withdrawSuccess.requestId.toString()} has been submitted. Admin will process it shortly.`
                : 'Enter your UPI ID to withdraw your earned coins.'}
            </DialogDescription>
          </DialogHeader>

          {withdrawSuccess ? (
            <div className="space-y-4">
              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-green-400 font-rajdhani text-sm">
                  Request ID: <span className="font-orbitron font-bold">#{withdrawSuccess.requestId.toString()}</span>
                </p>
                <p className="text-white/50 font-rajdhani text-xs mt-1">
                  Amount: <span className="text-gold font-bold">{selectedAmount}</span>
                </p>
              </div>
              <Button
                onClick={() => setWithdrawOpen(false)}
                className="w-full bg-gold hover:bg-gold/90 text-brand-dark font-orbitron font-bold py-4 rounded-xl"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleWithdrawSubmit} className="space-y-5">
              {/* Amount Selection */}
              <div>
                <Label className="text-white/70 font-rajdhani text-sm mb-2 block">Select Amount</Label>
                <RadioGroup
                  value={selectedAmount}
                  onValueChange={setSelectedAmount}
                  className="grid grid-cols-3 gap-2"
                >
                  {['₹100', '₹250', '₹500'].map((amt) => (
                    <div key={amt} className="flex items-center">
                      <RadioGroupItem value={amt} id={`amt-${amt}`} className="sr-only" />
                      <Label
                        htmlFor={`amt-${amt}`}
                        className={`w-full text-center py-2.5 rounded-lg border font-orbitron text-sm cursor-pointer transition-all ${
                          selectedAmount === amt
                            ? 'bg-gold/20 border-gold text-gold'
                            : 'bg-white/5 border-white/20 text-white/50 hover:border-gold/40'
                        }`}
                      >
                        {amt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* UPI ID */}
              <div>
                <Label htmlFor="upi-id" className="text-white/70 font-rajdhani text-sm mb-2 block">
                  UPI ID
                </Label>
                <Input
                  id="upi-id"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/30 font-rajdhani focus:border-gold/50"
                />
              </div>

              {withdrawError && (
                <div className="bg-red-900/40 border border-red-500/40 rounded-lg px-4 py-3 text-red-300 font-rajdhani text-sm flex items-center gap-2">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {withdrawError}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWithdrawOpen(false)}
                  className="flex-1 border-white/20 text-white/60 hover:bg-white/5 font-rajdhani"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitWithdrawRequest.isPending}
                  className="flex-1 bg-gold hover:bg-gold/90 text-brand-dark font-orbitron font-bold rounded-xl"
                >
                  {submitWithdrawRequest.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
