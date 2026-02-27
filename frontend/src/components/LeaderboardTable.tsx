import { type PlayerScore, SportCategory } from '../backend';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardTableProps {
    scores: PlayerScore[];
}

const categoryEmoji: Record<string, string> = {
    [SportCategory.Cricket]: '🏏',
    [SportCategory.Football]: '⚽',
    [SportCategory.Basketball]: '🏀',
    [SportCategory.Tennis]: '🎾',
};

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) {
        return (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 border border-gold/50">
                <Trophy size={16} className="text-gold" />
            </div>
        );
    }
    if (rank === 2) {
        return (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-400/20 border border-slate-400/50">
                <Medal size={16} className="text-slate-300" />
            </div>
        );
    }
    if (rank === 3) {
        return (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/20 border border-amber-700/50">
                <Medal size={16} className="text-amber-600" />
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 border border-border">
            <span className="text-sm font-bold text-muted-foreground">{rank}</span>
        </div>
    );
}

export default function LeaderboardTable({ scores }: LeaderboardTableProps) {
    if (scores.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <Trophy size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-heading text-lg">No scores yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl overflow-hidden border border-border">
            <Table>
                <TableHeader>
                    <TableRow className="border-border bg-brand-surface hover:bg-brand-surface">
                        <TableHead className="w-16 text-gold font-heading font-bold text-sm">Rank</TableHead>
                        <TableHead className="text-gold font-heading font-bold text-sm">Player</TableHead>
                        <TableHead className="text-gold font-heading font-bold text-sm">Sport</TableHead>
                        <TableHead className="text-right text-gold font-heading font-bold text-sm">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scores.slice(0, 10).map((score, index) => {
                        const rank = index + 1;
                        const categoryKey = score.category as unknown as string;
                        const emoji = categoryEmoji[categoryKey] || '🎮';
                        const isTop3 = rank <= 3;

                        return (
                            <TableRow
                                key={`${score.username}-${index}`}
                                className={`border-border transition-colors ${
                                    isTop3
                                        ? 'bg-gold/5 hover:bg-gold/10'
                                        : 'hover:bg-muted/30'
                                }`}
                            >
                                <TableCell className="py-3">
                                    <RankBadge rank={rank} />
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className={`font-heading font-semibold text-base ${isTop3 ? 'text-gold' : 'text-foreground'}`}>
                                        {score.username}
                                    </span>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-sm text-muted-foreground">
                                        {emoji} {categoryKey}
                                    </span>
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <span className={`font-brand font-bold text-lg ${isTop3 ? 'text-gold' : 'text-foreground'}`}>
                                        {Number(score.score).toLocaleString()}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
