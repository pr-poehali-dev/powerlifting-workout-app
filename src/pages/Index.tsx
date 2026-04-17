import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import HomePage from './HomePage';
import WorkoutsPage from './WorkoutsPage';
import CalculatorPage from './CalculatorPage';
import TechniquePage from './TechniquePage';
import ProgressPage from './ProgressPage';
import ProfilePage from './ProfilePage';

type Tab = 'home' | 'workouts' | 'calculator' | 'technique' | 'progress' | 'profile';

export default function Index() {
  const [tab, setTab] = useState<Tab>('home');

  const renderPage = () => {
    switch (tab) {
      case 'home': return <HomePage />;
      case 'workouts': return <WorkoutsPage />;
      case 'calculator': return <CalculatorPage />;
      case 'technique': return <TechniquePage />;
      case 'progress': return <ProgressPage />;
      case 'profile': return <ProfilePage />;
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
