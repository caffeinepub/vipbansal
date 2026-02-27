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
export interface WithdrawRequest {
    status: Variant_pending_approved;
    requestId: bigint;
    userId: bigint;
    upiId: string;
    amount: string;
}
export interface Coins {
    irn: number;
    usdt: number;
}
export interface UserProfile {
    username: string;
    balance: Coins;
    userId: bigint;
    name: string;
    role: Variant_admin_user;
    email: string;
}
export enum SportCategory {
    Basketball = "Basketball",
    Tennis = "Tennis",
    Shooting = "Shooting",
    Football = "Football",
    Cricket = "Cricket",
    Badminton = "Badminton",
    Racing = "Racing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_admin_user {
    admin = "admin",
    user = "user"
}
export enum Variant_pending_approved {
    pending = "pending",
    approved = "approved"
}
export interface backendInterface {
    addGame(name: string, category: SportCategory, thumbnail: ExternalBlob, description: string, gameUrl: string): Promise<void>;
    addPlayerScore(username: string, score: bigint, category: SportCategory): Promise<void>;
    approveWithdrawRequest(requestId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteWithdrawRequest(requestId: bigint): Promise<void>;
    getAllGames(): Promise<Array<Game>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getAllWithdrawRequests(): Promise<Array<WithdrawRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGameById(id: bigint): Promise<Game>;
    getMyProfile(userId: bigint): Promise<UserProfile>;
    getTopScores(): Promise<Array<PlayerScore>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdminCaller(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(name: string, username: string, email: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitWithdrawRequest(userId: bigint, amount: string, upiId: string): Promise<bigint>;
    updateProfile(userId: bigint, newName: string, newUsername: string, newEmail: string): Promise<void>;
    updateUserProfile(userId: bigint, newName: string, newUsername: string, newEmail: string): Promise<void>;
}
