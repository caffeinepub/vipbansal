import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PasswordResetPage from './pages/PasswordResetPage';
import AdminPage from './pages/AdminPage';

// Top loading progress bar
function TopProgressBar() {
    const routerState = useRouterState();
    const isLoading = routerState.status === 'pending';
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isLoading) {
            setVisible(true);
            setProgress(10);
            timerRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 85) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        return 85;
                    }
                    return prev + Math.random() * 15;
                });
            }, 300);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            setProgress(100);
            hideTimerRef.current = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 400);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        };
    }, [isLoading]);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent pointer-events-none">
            <div
                className="h-full bg-gradient-to-r from-gold via-gold-light to-brand-red transition-all duration-300 ease-out"
                style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
            />
        </div>
    );
}

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <div className="page-transition-enter">
            {children}
        </div>
    );
}

// Layout component with Navbar and Footer
function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <TopProgressBar />
            <Navbar />
            <div className="flex-1">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </div>
            <Footer />
        </div>
    );
}

// Routes
const rootRoute = createRootRoute({
    component: Layout,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
});

const gamesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/games',
    component: GamesPage,
});

const leaderboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/leaderboard',
    component: LeaderboardPage,
});

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
});

const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signup',
    component: SignUpPage,
});

const passwordResetRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/reset-password',
    component: PasswordResetPage,
});

const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminPage,
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    gamesRoute,
    leaderboardRoute,
    loginRoute,
    signupRoute,
    passwordResetRoute,
    adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <RouterProvider router={router} />;
}
