import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import HomePage from './HomePage';
import WorkoutsPage from './WorkoutsPage';
import CalculatorPage from './CalculatorPage';
import TechniquePage from './TechniquePage';
import ProgressPage from './ProgressPage';
import ProfilePage from './ProfilePage';
import AuthPage from './AuthPage';
import { api } from '@/lib/api';

type Tab = 'home' | 'workouts' | 'calculator' | 'technique' | 'progress' | 'profile';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  body_weight?: number | null;
  gender?: string;
  weight_category?: string;
}

export default function Index() {
  const [tab, setTab] = useState<Tab>('home');
  const [user, setUser] = useState<AppUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    api.auth.me().then(res => {
      if (res.user) setUser(res.user);
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  const handleAuth = (_token: string, u: AppUser) => {
    setUser(u);
  };

  const handleLogout = () => {
    api.clearToken();
    setUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-5xl">🏋️</div>
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  const renderPage = () => {
    switch (tab) {
      case 'home': return <HomePage user={user} />;
      case 'workouts': return <WorkoutsPage />;
      case 'calculator': return <CalculatorPage />;
      case 'technique': return <TechniquePage />;
      case 'progress': return <ProgressPage user={user} />;
      case 'profile': return <ProfilePage user={user} onLogout={handleLogout} onUserUpdate={setUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <div className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </div>
      <BottomNav active={tab} onChange={(t) => setTab(t as Tab)} />
    </div>
  );
}
