import React, { useState } from 'react';
import { Shield, Users, Trophy, Loader2, Pencil, Trash2, Check, X, Banknote } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import {
  useIsCallerAdmin,
  useGetAllUsers,
  useGetTopScores,
  useUpdateUserProfile,
  useGetAllWithdrawRequests,
  useApproveWithdrawRequest,
  useDeleteWithdrawRequest,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { UserProfile } from '../backend';
import { Variant_pending_approved } from '../backend';

interface EditState {
  userId: bigint;
  name: string;
  username: string;
  email: string;
}

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const { data: scores, isLoading: scoresLoading } = useGetTopScores();
  const { data: withdrawRequests, isLoading: withdrawLoading } = useGetAllWithdrawRequests();

  const updateUserProfile = useUpdateUserProfile();
  const approveWithdrawRequest = useApproveWithdrawRequest();
  const deleteWithdrawRequest = useDeleteWithdrawRequest();

  const [editState, setEditState] = useState<EditState | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleEditStart = (user: UserProfile) => {
    setEditState({
      userId: user.userId,
      name: user.name,
      username: user.username,
      email: user.email,
    });
  };

  const handleEditSave = async () => {
    if (!editState) return;
    try {
      await updateUserProfile.mutateAsync({
        userId: editState.userId,
        newName: editState.name,
        newUsername: editState.username,
        newEmail: editState.email,
      });
      showToast('User profile updated successfully!', 'success');
      setEditState(null);
    } catch (err: any) {
      showToast(err?.message || 'Failed to update user profile', 'error');
    }
  };

  const handleApproveWithdraw = async (requestId: bigint) => {
    try {
      await approveWithdrawRequest.mutateAsync(requestId);
      showToast(`Request #${requestId} approved successfully!`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to approve request', 'error');
    }
  };

  const handleDeleteWithdraw = async (requestId: bigint) => {
    try {
      await deleteWithdrawRequest.mutateAsync(requestId);
      showToast(`Request #${requestId} deleted successfully!`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete request', 'error');
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  if (!identity) {
    return <AccessDeniedScreen />;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg font-rajdhani font-semibold text-sm transition-all ${
            toast.type === 'success'
              ? 'bg-green-700 text-green-100 border border-green-500'
              : 'bg-red-800 text-red-100 border border-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-brand-surface border-b border-gold/20 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Shield className="w-7 h-7 text-gold" />
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-gold">Admin Panel</h1>
            <p className="text-white/50 text-sm font-rajdhani">VIPbansal Management Console</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="users">
          <TabsList className="bg-brand-surface border border-gold/20 mb-6">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gold data-[state=active]:text-brand-dark font-rajdhani font-semibold"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="scores"
              className="data-[state=active]:bg-gold data-[state=active]:text-brand-dark font-rajdhani font-semibold"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Scores
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="data-[state=active]:bg-gold data-[state=active]:text-brand-dark font-rajdhani font-semibold"
            >
              <Banknote className="w-4 h-4 mr-2" />
              Withdraw Requests
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-brand-surface rounded-xl border border-gold/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-gold/10">
                <h2 className="font-orbitron text-lg text-gold">Registered Users</h2>
                <p className="text-white/40 text-sm font-rajdhani">{users?.length ?? 0} total users</p>
              </div>
              {usersLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold/10 hover:bg-transparent">
                        <TableHead className="text-gold/70 font-rajdhani">User ID</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Name</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Username</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Email</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Role</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Coins (USDT)</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(users ?? []).map((user) => (
                        <TableRow key={user.userId.toString()} className="border-gold/10 hover:bg-white/5">
                          <TableCell className="text-white/60 font-mono text-xs">
                            {user.userId.toString()}
                          </TableCell>
                          <TableCell>
                            {editState?.userId === user.userId ? (
                              <Input
                                value={editState.name}
                                onChange={(e) => setEditState({ ...editState, name: e.target.value })}
                                className="bg-white/10 border-gold/30 text-white h-8 text-sm"
                              />
                            ) : (
                              <span className="text-white font-rajdhani">{user.name}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editState?.userId === user.userId ? (
                              <Input
                                value={editState.username}
                                onChange={(e) =>
                                  setEditState({ ...editState, username: e.target.value })
                                }
                                className="bg-white/10 border-gold/30 text-white h-8 text-sm"
                              />
                            ) : (
                              <span className="text-white font-rajdhani">{user.username}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editState?.userId === user.userId ? (
                              <Input
                                value={editState.email}
                                onChange={(e) =>
                                  setEditState({ ...editState, email: e.target.value })
                                }
                                className="bg-white/10 border-gold/30 text-white h-8 text-sm"
                              />
                            ) : (
                              <span className="text-white/70 font-rajdhani text-sm">{user.email}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                (user.role as any) === 'admin'
                                  ? 'bg-gold text-brand-dark font-bold'
                                  : 'bg-white/10 text-white/70'
                              }
                            >
                              {(user.role as any) === 'admin' ? 'Admin' : 'User'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/70 font-rajdhani">
                            {user.balance.usdt.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {editState?.userId === user.userId ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={handleEditSave}
                                  disabled={updateUserProfile.isPending}
                                  className="bg-green-700 hover:bg-green-600 text-white h-7 px-2"
                                >
                                  {updateUserProfile.isPending ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditState(null)}
                                  className="text-white/50 hover:text-white h-7 px-2"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditStart(user)}
                                className="text-gold/70 hover:text-gold h-7 px-2"
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {(users ?? []).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center text-white/40 py-8 font-rajdhani"
                          >
                            No users registered yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Scores Tab */}
          <TabsContent value="scores">
            <div className="bg-brand-surface rounded-xl border border-gold/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-gold/10">
                <h2 className="font-orbitron text-lg text-gold">Player Scores</h2>
                <p className="text-white/40 text-sm font-rajdhani">
                  {scores?.length ?? 0} total score entries
                </p>
              </div>
              {scoresLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold/10 hover:bg-transparent">
                        <TableHead className="text-gold/70 font-rajdhani">Rank</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Username</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Category</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(scores ?? []).map((score, idx) => (
                        <TableRow key={idx} className="border-gold/10 hover:bg-white/5">
                          <TableCell className="text-white/60 font-mono">#{idx + 1}</TableCell>
                          <TableCell className="text-white font-rajdhani">{score.username}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-gold/30 text-gold/80 font-rajdhani"
                            >
                              {score.category as unknown as string}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gold font-orbitron font-bold">
                            {Number(score.score).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {(scores ?? []).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-white/40 py-8 font-rajdhani"
                          >
                            No scores recorded yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Withdraw Requests Tab */}
          <TabsContent value="withdrawals">
            <div className="bg-brand-surface rounded-xl border border-gold/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-gold/10">
                <h2 className="font-orbitron text-lg text-gold">Withdraw Requests</h2>
                <p className="text-white/40 text-sm font-rajdhani">
                  {withdrawRequests?.length ?? 0} total requests
                </p>
              </div>
              {withdrawLoading ? (
                <div className="p-6 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold/10 hover:bg-transparent">
                        <TableHead className="text-gold/70 font-rajdhani">Request ID</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">User ID</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Amount</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">UPI ID</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Status</TableHead>
                        <TableHead className="text-gold/70 font-rajdhani">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(withdrawRequests ?? []).map((req) => (
                        <TableRow key={req.requestId.toString()} className="border-gold/10 hover:bg-white/5">
                          <TableCell className="text-white/60 font-mono text-xs">
                            #{req.requestId.toString()}
                          </TableCell>
                          <TableCell className="text-white/60 font-mono text-xs">
                            {req.userId.toString()}
                          </TableCell>
                          <TableCell className="text-gold font-rajdhani font-semibold">
                            {req.amount}
                          </TableCell>
                          <TableCell className="text-white/70 font-rajdhani">{req.upiId}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                (req.status as any) === Variant_pending_approved.approved ||
                                (req.status as any) === 'approved'
                                  ? 'bg-green-700/80 text-green-100 border-green-600'
                                  : 'bg-yellow-700/80 text-yellow-100 border-yellow-600'
                              }
                            >
                              {(req.status as any) === Variant_pending_approved.approved ||
                              (req.status as any) === 'approved'
                                ? 'Approved'
                                : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {((req.status as any) === Variant_pending_approved.pending ||
                                (req.status as any) === 'pending') && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveWithdraw(req.requestId)}
                                  disabled={approveWithdrawRequest.isPending}
                                  className="bg-green-700 hover:bg-green-600 text-white h-7 px-3 text-xs font-rajdhani"
                                >
                                  {approveWithdrawRequest.isPending ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <>
                                      <Check className="w-3 h-3 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30 h-7 px-2"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-brand-surface border-gold/20 text-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="font-orbitron text-gold">
                                      Delete Request?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-white/60 font-rajdhani">
                                      This will permanently delete withdraw request #
                                      {req.requestId.toString()}. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteWithdraw(req.requestId)}
                                      className="bg-red-700 hover:bg-red-600 text-white"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(withdrawRequests ?? []).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center text-white/40 py-8 font-rajdhani"
                          >
                            No withdraw requests found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
