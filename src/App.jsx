import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Apple, TrendingUp, Calendar, Menu, X, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Diet from './pages/Diet';
import Progress from './pages/Progress';
import './App.css';

function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const { user, signOut, isAdmin } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Calendar },
        { path: '/workouts', label: 'Workouts', icon: Dumbbell },
        { path: '/diet', label: 'Diet', icon: Apple },
        { path: '/progress', label: 'Progress', icon: TrendingUp },
    ];

    return (
        <nav className="nav">
            <div className="nav-container">
                <Link to="/" className="logo">
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <Dumbbell size={32} strokeWidth={2.5} />
                    </motion.div>
                    <span>IRON<span className="logo-accent">TRACK</span></span>
                </Link>

                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    {navItems.map((item, idx) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        className="nav-indicator"
                                        layoutId="nav-indicator"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    <div className="nav-user">
                        <div className="user-info">
                            <div className="user-email">{user?.email}</div>
                            <div className="user-role">{isAdmin ? 'ADMIN' : 'USER'}</div>
                        </div>
                        <button className="btn-logout" onClick={() => signOut()}>
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function ProtectedApp() {
    const { user, loading } = useAuth();
    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        fetch('/api/_wake').catch(() => { });
        setTimeout(() => setAppLoading(false), 800);
    }, []);

    if (loading || appLoading) {
        return (
            <div className="loading-screen">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Dumbbell size={64} className="loading-icon" />
                    <h1>IRONTRACK</h1>
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return (
        <div className="app">
            <Navigation />
            <main className="main-content">
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/workouts" element={<Workouts />} />
                        <Route path="/diet" element={<Diet />} />
                        <Route path="/progress" element={<Progress />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AnimatePresence>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ProtectedApp />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;