import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Game, type PlayerScore, type UserProfile, SportCategory } from '../backend';
import { Principal } from '@dfinity/principal';

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
        mutationFn: async ({
            username,
            score,
            category,
        }: {
            username: string;
            score: bigint;
            category: SportCategory;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
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
        mutationFn: async ({ username, email }: { username: string; email: string }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.registerUser(username, email);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
        },
    });
}

// ===== ADMIN HOOKS =====

export function useIsCallerAdmin() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<boolean>({
        queryKey: ['isCallerAdmin'],
        queryFn: async () => {
            if (!actor) return false;
            return actor.isAdmin();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });
}

export function useGetAllUsers() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<UserProfile[]>({
        queryKey: ['allUsers'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllUsers();
        },
        enabled: !!actor && !actorFetching,
        retry: false,
    });
}

export function useUpdateUserProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            user,
            newUsername,
            newEmail,
        }: {
            user: Principal;
            newUsername: string;
            newEmail: string;
        }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.updateUserProfile(user, newUsername, newEmail);
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
        mutationFn: async (user: Principal) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.deleteUser(user);
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
        mutationFn: async (user: Principal) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.resetUserData(user);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['topScores'] });
            queryClient.invalidateQueries({ queryKey: ['allUsers'] });
        },
    });
}

export { SportCategory };
