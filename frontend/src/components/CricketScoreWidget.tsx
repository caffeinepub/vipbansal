import React, { useState, useEffect } from 'react';
import { Radio, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── Types ────────────────────────────────────────────────────────────────────
type MatchStatus = 'Live' | 'Result' | 'Upcoming';

interface TeamScore {
  name: string;
  flag: string;
  runs?: number;
  wickets?: number;
  overs?: string;
}

interface CricketMatch {
  id: number;
  status: MatchStatus;
  series: string;
  team1: TeamScore;
  team2: TeamScore;
  result?: string;
  venue?: string;
  time?: string;
}

// ─── Simulated Match Data ─────────────────────────────────────────────────────
const MATCHES: CricketMatch[] = [
  {
    id: 1,
    status: 'Result',
    series: 'ICC Champions Trophy 2025',
    team1: {
      name: 'England',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      runs: 248,
      wickets: 6,
      overs: '48.2',
    },
    team2: {
      name: 'Australia',
      flag: '🇦🇺',
      runs: 244,
      wickets: 10,
      overs: '49.3',
    },
    result: 'England won by 4 wickets',
    venue: 'Lord\'s Cricket Ground, London',
  },
  {
    id: 2,
    status: 'Live',
    series: 'IND vs PAK — Asia Cup 2025',
    team1: {
      name: 'India',
      flag: '🇮🇳',
      runs: 187,
      wickets: 3,
      overs: '32.4',
    },
    team2: {
      name: 'Pakistan',
      flag: '🇵🇰',
      runs: 210,
      wickets: 8,
      overs: '45.0',
    },
    result: 'India need 24 runs in 17.2 overs',
    venue: 'Dubai International Stadium',
  },
  {
    id: 3,
    status: 'Upcoming',
    series: 'T20 World Cup 2025 — Group A',
    team1: {
      name: 'South Africa',
      flag: '🇿🇦',
    },
    team2: {
      name: 'New Zealand',
      flag: '🇳🇿',
    },
    venue: 'SuperSport Park, Centurion',
    time: 'Today, 7:00 PM IST',
  },
  {
    id: 4,
    status: 'Result',
    series: 'IPL 2025 — Final',
    team1: {
      name: 'Mumbai Indians',
      flag: '🔵',
      runs: 195,
      wickets: 4,
      overs: '20.0',
    },
    team2: {
      name: 'Chennai Super Kings',
      flag: '🟡',
      runs: 189,
      wickets: 7,
      overs: '20.0',
    },
    result: 'Mumbai Indians won by 6 runs',
    venue: 'Narendra Modi Stadium, Ahmedabad',
  },
  {
    id: 5,
    status: 'Upcoming',
    series: 'Test Series — 1st Test',
    team1: {
      name: 'India',
      flag: '🇮🇳',
    },
    team2: {
      name: 'West Indies',
      flag: '🇯🇲',
    },
    venue: 'Sabina Park, Kingston',
    time: 'Tomorrow, 9:30 AM IST',
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: MatchStatus }) {
  if (status === 'Live') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-orbitron font-bold bg-green-500/20 text-green-400 border border-green-500/40">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        LIVE
      </span>
    );
  }
  if (status === 'Result') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-orbitron font-bold bg-gold/20 text-gold border border-gold/40">
        <CheckCircle2 className="w-3 h-3" />
        RESULT
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-orbitron font-bold bg-white/10 text-white/50 border border-white/20">
      <Calendar className="w-3 h-3" />
      UPCOMING
    </span>
  );
}

// ─── Score Display ────────────────────────────────────────────────────────────
function ScoreDisplay({ team, isWinner }: { team: TeamScore; isWinner?: boolean }) {
  const hasScore = team.runs !== undefined;
  return (
    <div className={`flex items-center justify-between gap-2 ${isWinner ? 'opacity-100' : 'opacity-70'}`}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xl leading-none">{team.flag}</span>
        <span className={`font-rajdhani font-bold text-sm truncate ${isWinner ? 'text-white' : 'text-white/70'}`}>
          {team.name}
        </span>
        {isWinner && (
          <span className="text-gold text-xs">★</span>
        )}
      </div>
      {hasScore && (
        <div className="text-right flex-shrink-0">
          <span className={`font-orbitron font-black text-base ${isWinner ? 'text-gold' : 'text-white/60'}`}>
            {team.runs}/{team.wickets}
          </span>
          <span className="text-white/40 font-rajdhani text-xs ml-1">
            ({team.overs} ov)
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Match Card ───────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: CricketMatch }) {
  const isEnglandWinner = match.result?.toLowerCase().includes('england won');
  const isMumbaiWinner = match.result?.toLowerCase().includes('mumbai');
  const team1Wins = isEnglandWinner || isMumbaiWinner;
  const team2Wins = match.result?.toLowerCase().includes('pakistan') ||
    match.result?.toLowerCase().includes('chennai') ||
    match.result?.toLowerCase().includes('australia');

  return (
    <div className={`
      bg-brand-dark/60 border rounded-xl p-4 transition-all duration-200 hover:border-gold/30 hover:bg-brand-dark/80
      ${match.status === 'Live' ? 'border-green-500/30 shadow-[0_0_12px_rgba(34,197,94,0.1)]' : 'border-white/10'}
    `}>
      {/* Series + Status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-white/40 font-rajdhani text-xs leading-tight flex-1 min-w-0 truncate">
          {match.series}
        </p>
        <StatusBadge status={match.status} />
      </div>

      {/* Teams & Scores */}
      <div className="space-y-2 mb-3">
        <ScoreDisplay team={match.team1} isWinner={team1Wins} />
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 font-rajdhani text-xs">VS</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <ScoreDisplay team={match.team2} isWinner={!!team2Wins} />
      </div>

      {/* Result / Venue / Time */}
      {match.result && (
        <div className={`
          rounded-lg px-3 py-2 text-xs font-rajdhani font-semibold
          ${match.status === 'Live'
            ? 'bg-green-500/10 text-green-300 border border-green-500/20'
            : 'bg-gold/10 text-gold border border-gold/20'
          }
        `}>
          {match.status === 'Live' ? '🔴 ' : '🏆 '}{match.result}
        </div>
      )}
      {match.status === 'Upcoming' && match.time && (
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
          <Clock className="w-3 h-3 text-white/40 flex-shrink-0" />
          <span className="text-white/50 font-rajdhani text-xs">{match.time}</span>
          {match.venue && (
            <>
              <span className="text-white/20">·</span>
              <span className="text-white/30 font-rajdhani text-xs truncate">{match.venue}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Live Ticker ──────────────────────────────────────────────────────────────
function LiveTicker() {
  const [tick, setTick] = useState(0);
  const updates = [
    '🏏 IND vs PAK — Rohit Sharma hits a SIX! India 187/3 (32.4 ov)',
    '⚡ England won by 4 wickets vs Australia — Champions Trophy',
    '🔥 Virat Kohli: 67* off 54 balls — Asia Cup 2025',
    '📢 MI vs CSK Final — Mumbai Indians win by 6 runs!',
    '🎯 Jasprit Bumrah takes 3rd wicket — PAK 210/8 (45.0 ov)',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % updates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-red/20 border border-brand-red/30 rounded-lg px-4 py-2 mb-4 overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Radio className="w-3.5 h-3.5 text-brand-red animate-pulse" />
          <span className="text-brand-red font-orbitron text-xs font-bold">LIVE</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <p
            key={tick}
            className="text-white/70 font-rajdhani text-sm truncate animate-in fade-in duration-500"
          >
            {updates[tick]}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
export default function CricketScoreWidget() {
  const [filter, setFilter] = useState<'All' | MatchStatus>('All');

  const filtered = filter === 'All' ? MATCHES : MATCHES.filter((m) => m.status === filter);

  const counts = {
    Live: MATCHES.filter((m) => m.status === 'Live').length,
    Result: MATCHES.filter((m) => m.status === 'Result').length,
    Upcoming: MATCHES.filter((m) => m.status === 'Upcoming').length,
  };

  return (
    <div className="bg-brand-surface rounded-2xl border border-gold/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏏</span>
          <div>
            <h2 className="font-orbitron text-xl text-gold leading-tight">Match Center</h2>
            <p className="text-white/40 font-rajdhani text-xs">Live Cricket Scores</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-green-400 font-rajdhani text-xs font-semibold">{counts.Live} Live</span>
        </div>
      </div>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(['All', 'Live', 'Result', 'Upcoming'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-lg font-rajdhani font-semibold text-xs transition-all duration-150
              ${filter === tab
                ? tab === 'Live'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : tab === 'Result'
                  ? 'bg-gold/20 text-gold border border-gold/40'
                  : tab === 'Upcoming'
                  ? 'bg-white/10 text-white/70 border border-white/20'
                  : 'bg-brand-red/20 text-brand-red border border-brand-red/40'
                : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white/60'
              }
            `}
          >
            {tab}
            {tab !== 'All' && (
              <span className="ml-1.5 opacity-70">
                ({counts[tab as MatchStatus]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-white/30 font-rajdhani">
            No matches found
          </div>
        ) : (
          filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>

      {/* Footer note */}
      <p className="text-white/20 font-rajdhani text-xs text-center mt-4">
        Simulated scores for entertainment purposes only
      </p>
    </div>
  );
}
