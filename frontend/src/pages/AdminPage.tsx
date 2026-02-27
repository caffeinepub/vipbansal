import { useState } from 'react';
import { Shield, Users, Trophy, Pencil, Trash2, RotateCcw, Check, X, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
    useIsCallerAdmin,
    useGetAllUsers,
    useGetTopScores,
    useUpdateUserProfile,
    useDeleteUser,
    useResetUserData,
} from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { type UserProfile, type PlayerScore } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

const sportEmoji: Record<string, string> = {
    Cricket: '🏏',
    Football: '⚽',
    Basketball: '🏀',
    Tennis: '🎾',
};

// ---- Inline Edit Row for Users ----
function UserRow({ user, onDeleted }: { user: UserProfile; onDeleted?: () => void }) {
    const [editing, setEditing] = useState(false);
    const [editUsername, setEditUsername] = useState(user.username);
    const [editEmail, setEditEmail] = useState(user.email);

    const updateMutation = useUpdateUserProfile();
    const deleteMutation = useDeleteUser();
    const resetMutation = useResetUserData();

    const handleSave = async () => {
        if (!editUsername.trim() || !editEmail.trim()) {
            toast.error('Username and email cannot be empty.');
            return;
        }
        try {
            await updateMutation.mutateAsync({
                user: user.principal as unknown as Principal,
                newUsername: editUsername.trim(),
                newEmail: editEmail.trim(),
            });
            toast.success(`User "${editUsername}" updated successfully.`);
            setEditing(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to update user.';
            toast.error(msg);
        }
    };

    const handleCancel = () => {
        setEditUsername(user.username);
        setEditEmail(user.email);
        setEditing(false);
    };

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(user.principal as unknown as Principal);
            toast.success(`User "${user.username}" deleted.`);
            onDeleted?.();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to delete user.';
            toast.error(msg);
        }
    };

    const handleReset = async () => {
        try {
            await resetMutation.mutateAsync(user.principal as unknown as Principal);
            toast.success(`Score data for "${user.username}" has been reset.`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to reset user data.';
            toast.error(msg);
        }
    };

    const isBusy = updateMutation.isPending || deleteMutation.isPending || resetMutation.isPending;

    return (
        <TableRow className="border-gold/10 hover:bg-gold/5 transition-colors">
            <TableCell className="font-mono text-xs text-foreground/40 max-w-[120px] truncate">
                {user.principal.toString().slice(0, 12)}…
            </TableCell>
            <TableCell>
                {editing ? (
                    <Input
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="h-8 text-sm bg-brand-surface border-gold/30 text-foreground"
                        disabled={isBusy}
                    />
                ) : (
                    <span className="font-heading font-semibold text-gold">{user.username}</span>
                )}
            </TableCell>
            <TableCell>
                {editing ? (
                    <Input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="h-8 text-sm bg-brand-surface border-gold/30 text-foreground"
                        disabled={isBusy}
                    />
                ) : (
                    <span className="text-sm text-foreground/70">{user.email}</span>
                )}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    {editing ? (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                onClick={handleSave}
                                disabled={isBusy}
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Check size={14} />
                                )}
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-foreground/50 hover:text-foreground hover:bg-foreground/10"
                                onClick={handleCancel}
                                disabled={isBusy}
                            >
                                <X size={14} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-gold/70 hover:text-gold hover:bg-gold/10"
                                onClick={() => setEditing(true)}
                                disabled={isBusy}
                                title="Edit user"
                            >
                                <Pencil size={14} />
                            </Button>

                            {/* Reset Scores */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-foreground/50 hover:text-yellow-400 hover:bg-yellow-400/10"
                                        disabled={isBusy}
                                        title="Reset scores"
                                    >
                                        {resetMutation.isPending ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <RotateCcw size={14} />
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-brand-surface border-gold/20">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-gold font-brand">Reset Score Data?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-foreground/60">
                                            This will permanently delete all score records for{' '}
                                            <strong className="text-foreground">{user.username}</strong>. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="border-gold/20 text-foreground/70 hover:bg-gold/10">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleReset}
                                            className="bg-yellow-600 hover:bg-yellow-500 text-white"
                                        >
                                            Reset Scores
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            {/* Delete User */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-foreground/50 hover:text-brand-red hover:bg-brand-red/10"
                                        disabled={isBusy}
                                        title="Delete user"
                                    >
                                        {deleteMutation.isPending ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-brand-surface border-gold/20">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-brand-red font-brand">Delete User?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-foreground/60">
                                            This will permanently delete the account for{' '}
                                            <strong className="text-foreground">{user.username}</strong>. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="border-gold/20 text-foreground/70 hover:bg-gold/10">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-brand-red hover:bg-brand-red/80 text-white"
                                        >
                                            Delete User
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

// ---- Score Row ----
function ScoreRow({ score, index }: { score: PlayerScore; index: number }) {
    const emoji = sportEmoji[score.category as unknown as string] ?? '🏅';

    return (
        <TableRow className="border-gold/10 hover:bg-gold/5 transition-colors">
            <TableCell className="text-foreground/50 font-mono text-sm w-12">{index + 1}</TableCell>
            <TableCell>
                <span className="font-heading font-semibold text-gold">{score.username}</span>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="border-gold/30 text-foreground/70 text-xs gap-1">
                    {emoji} {score.category as unknown as string}
                </Badge>
            </TableCell>
            <TableCell className="text-right font-mono font-bold text-gold">
                {Number(score.score).toLocaleString()}
            </TableCell>
        </TableRow>
    );
}

// ---- Main Admin Page ----
export default function AdminPage() {
    const { identity } = useInternetIdentity();
    const isAuthenticated = !!identity;

    const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
    const { data: users, isLoading: usersLoading } = useGetAllUsers();
    const { data: scores, isLoading: scoresLoading } = useGetTopScores();

    // Show loading while checking admin status
    if (!isAuthenticated || adminLoading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-64 bg-brand-surface" />
                    <Skeleton className="h-6 w-48 bg-brand-surface" />
                    <Skeleton className="h-64 w-full bg-brand-surface" />
                </div>
            </div>
        );
    }

    // Not admin → access denied
    if (!isAdmin) {
        return <AccessDeniedScreen />;
    }

    return (
        <main className="container mx-auto px-4 py-10 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Shield size={24} className="text-gold" />
                </div>
                <div>
                    <h1 className="font-brand text-3xl font-bold text-gold tracking-wider">Admin Panel</h1>
                    <p className="text-foreground/50 font-body text-sm mt-0.5">
                        Manage users, scores, and platform data
                    </p>
                </div>
                <Badge className="ml-auto bg-gold/20 text-gold border border-gold/30 font-heading">
                    Administrator
                </Badge>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users">
                <TabsList className="bg-brand-surface border border-gold/20 mb-6">
                    <TabsTrigger
                        value="users"
                        className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold font-heading font-semibold gap-2"
                    >
                        <Users size={15} />
                        Users
                        {users && (
                            <span className="ml-1 text-xs bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">
                                {users.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="scores"
                        className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold font-heading font-semibold gap-2"
                    >
                        <Trophy size={15} />
                        Scores
                        {scores && (
                            <span className="ml-1 text-xs bg-gold/20 text-gold px-1.5 py-0.5 rounded-full">
                                {scores.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users">
                    <div className="rounded-xl border border-gold/20 bg-brand-surface overflow-hidden">
                        <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between">
                            <h2 className="font-heading font-bold text-foreground tracking-wide">
                                Registered Users
                            </h2>
                            <span className="text-xs text-foreground/40 font-body">
                                Click the pencil icon to edit inline
                            </span>
                        </div>

                        {usersLoading ? (
                            <div className="p-6 flex flex-col gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full bg-background/50" />
                                ))}
                            </div>
                        ) : !users || users.length === 0 ? (
                            <div className="p-12 text-center text-foreground/40 font-body">
                                <Users size={40} className="mx-auto mb-3 opacity-30" />
                                <p>No registered users yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gold/10 hover:bg-transparent">
                                            <TableHead className="text-foreground/50 font-heading text-xs uppercase tracking-wider w-32">
                                                Principal
                                            </TableHead>
                                            <TableHead className="text-foreground/50 font-heading text-xs uppercase tracking-wider">
                                                Username
                                            </TableHead>
                                            <TableHead className="text-foreground/50 font-heading text-xs uppercase tracking-wider">
                                                Email
                                            </TableHead>
                                            <TableHead className="text-foreground/50 font-heading text-xs uppercase tracking-wider text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <UserRow
                                                key={user.principal.toString()}
                                                user={user}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Scores Tab */}
                <TabsContent value="scores">
                    <div className="rounded-xl border border-gold/20 bg-brand-surface overflow-hidden">
                        <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between">
                            <h2 className="font-heading font-bold text-foreground tracking-wide">
                                All Leaderboard Scores
                            </h2>
                            <span className="text-xs text-foreground/40 font-body">
                                Sorted by highest score
                            </span>
                        </div>

                        {scoresLoading ? (
                            <div className="p-6 flex flex-col gap-3">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full bg-background/50" />
                                ))}
                            </div>
                        ) : !scores || scores.length === 0 ? (
                            <div className="p-12 text-center text-foreground/40 font-body">
                                <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                                <p>No scores recorded yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gold/10 hover:bg-transparent">
                                            <TableHead className="text-foreground/50 font-heading text-xs uppercase tracking-wider w-12">
                                                #
                                            </TableHead>
                                            <TableHead className="text-foreground/50 font-heading text-xs uppercase tracking-wider">
                                                Player
                                            </TableHead>
                                            <TableHead className="text-foreground/50 font-heading text-xs uppercase tracking-wider">
                                                Sport
                                            </TableHead>
                                            <TableHead className="text-foreground/50 font-heading text-xs uppercase tracking-wider text-right">
                                                Score
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scores.map((score, index) => (
                                            <ScoreRow
                                                key={`${score.username}-${index}`}
                                                score={score}
                                                index={index}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    );
}
