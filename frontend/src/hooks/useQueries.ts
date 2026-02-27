import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, PlayerScore, Game, WithdrawRequest } from '../backend';

export function useGetAllGames() {
  const { actor, isFetching } = useActor();

  return useQuery<Game[]>({
    queryKey: ['games'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTopScores() {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerScore[]>({
    queryKey: ['topScores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPlayerScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, score, category }: { username: string; score: bigint; category: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPlayerScore(username, score, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topScores'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, username, email }: { name: string; username: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(name, username, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdminCaller();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newName,
      newUsername,
      newEmail,
    }: {
      userId: bigint;
      newName: string;
      newUsername: string;
      newEmail: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfile(userId, newName, newUsername, newEmail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // Use assignCallerUserRole or similar — delete not directly available, use a workaround
      throw new Error('Delete user not supported by backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useResetUserData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Reset user data not supported by backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topScores'] });
    },
  });
}

// Withdraw Request Hooks

export function useGetAllWithdrawRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawRequest[]>({
    queryKey: ['withdrawRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWithdrawRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveWithdrawRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveWithdrawRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawRequests'] });
    },
  });
}

export function useDeleteWithdrawRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteWithdrawRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawRequests'] });
    },
  });
}

export function useSubmitWithdrawRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      amount,
      upiId,
    }: {
      userId: bigint;
      amount: string;
      upiId: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWithdrawRequest(userId, amount, upiId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawRequests'] });
    },
  });
}
