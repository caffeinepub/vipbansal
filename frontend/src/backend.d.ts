import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Game {
    id: bigint;
    thumbnail: ExternalBlob;
    name: string;
    description: string;
    gameUrl: string;
    category: SportCategory;
}
export interface PlayerScore {
    username: string;
    score: bigint;
    category: SportCategory;
}
export interface UserProfile {
    principal: Principal;
    username: string;
    email: string;
}
export enum SportCategory {
    Basketball = "Basketball",
    Tennis = "Tennis",
    Football = "Football",
    Cricket = "Cricket"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGame(name: string, category: SportCategory, thumbnail: ExternalBlob, description: string, gameUrl: string): Promise<void>;
    addPlayerScore(username: string, score: bigint, category: SportCategory): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteUser(user: Principal): Promise<void>;
    getAllGames(): Promise<Array<Game>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGameById(id: bigint): Promise<Game>;
    getMyProfile(): Promise<UserProfile>;
    getTopScores(): Promise<Array<PlayerScore>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(username: string, email: string): Promise<void>;
    resetUserData(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProfile(newUsername: string, newEmail: string): Promise<void>;
    updateUserProfile(user: Principal, newUsername: string, newEmail: string): Promise<void>;
}
