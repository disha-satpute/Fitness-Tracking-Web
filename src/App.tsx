import React, { useState, useEffect } from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Dashboard } from './components/Dashboard';
import { WorkoutManager } from './components/WorkoutManager';
import { NutritionTracker } from './components/NutritionTracker';
import { ProgressTracker } from './components/ProgressTracker';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Flame, 
  TrendingUp, 
  Sun, 
  Moon,
  Download
} from 'lucide-react';

const NAME_OPTIONS = ['Aaduu', 'Aadesh', 'Handsome', 'Aadyy'];

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [progressSubTab, setProgressSubTab] = useState<'weight' | 'prs'>('weight');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // PWA Install prompt listener for Android / Chrome
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  // Random / anonymous name rotation without select dropdown
  const [selectedName, setSelectedName] = useState<string>(() => {
    const randomIndex = Math.floor(Math.random() * NAME_OPTIONS.length);
    return NAME_OPTIONS[randomIndex];
  });

  const { restTimerSeconds, stopRestTimer, startRestTimer } = useFitness();

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedName(prev => {
        const remaining = NAME_OPTIONS.filter(n => n !== prev);
        return remaining[Math.floor(Math.random() * remaining.length)];
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigateTab = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    if (tab === 'progress' && subTab) {
      setProgressSubTab(subTab as 'weight' | 'prs');
    }
  };

  // 4 Core Actionable Tabs
  const navTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workout', icon: Dumbbell },
    { id: 'nutrition', label: 'Diet', icon: Flame },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'theme-light bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col md:flex-row antialiased selection:bg-amber-500 selection:text-slate-950`}>
      {/* Sidebar for Desktop / Tablet */}
      <aside className={`hidden md:flex flex-col w-56 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'} border-r p-4 justify-between shrink-0 sticky top-0 h-screen`}>
        <div>
          {/* Header */}
          <div className={`px-2 py-3 mb-5 border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Hello, welcome back
              </span>
              <button
                onClick={toggleTheme}
                className={`p-1.5 rounded-xl transition ${
                  theme === 'dark' ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-indigo-600'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="mt-1 font-extrabold text-lg text-amber-400">
              {selectedName}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigateTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Quick Rest Timer */}
        {restTimerSeconds !== null && (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-center">
            <div className="text-[10px] uppercase font-mono">Rest Timer</div>
            <div className="text-lg font-bold font-mono">
              {Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}
            </div>
            <button onClick={stopRestTimer} className="text-[10px] text-slate-400 hover:underline">Dismiss</button>
          </div>
        )}
      </aside>

      {/* Mobile Top Header */}
      <header className={`md:hidden ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-slate-900/95 border-slate-800'} backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between sticky top-0 z-40`}>
        <div>
          <div className="text-[10px] uppercase text-slate-400">Hello, welcome back</div>
          <div className="text-base font-extrabold text-amber-400 leading-tight">{selectedName}</div>
        </div>

        <div className="flex items-center gap-2">
          {showInstallBanner && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-amber-500/20 active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5" /> Install
            </button>
          )}

          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-xl transition ${
              theme === 'dark' ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-indigo-600'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {restTimerSeconds !== null ? (
            <button
              onClick={stopRestTimer}
              className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold animate-pulse"
            >
              {Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}
            </button>
          ) : (
            <button
              onClick={() => startRestTimer(90)}
              className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono"
            >
              90s
            </button>
          )}

          <span className="text-[11px] font-mono font-bold text-emerald-400">84kg</span>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-3 sm:p-5 max-w-5xl mx-auto w-full pb-20 md:pb-6">
        {activeTab === 'dashboard' && <Dashboard onNavigateTab={handleNavigateTab} />}
        {activeTab === 'workouts' && <WorkoutManager />}
        {activeTab === 'nutrition' && <NutritionTracker />}
        {activeTab === 'progress' && <ProgressTracker key={progressSubTab} initialSubTab={progressSubTab} />}
      </main>

      {/* Mobile Bottom Navigation Bar (4 Core Tabs) */}
      <nav 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-slate-900/95 border-slate-800'} backdrop-blur-lg border-t px-2 py-1 shadow-2xl`}
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-4 items-center">
          {navTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigateTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition duration-150 touch-manipulation active:scale-95 ${
                  isActive ? 'text-amber-500 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-amber-500/10' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <FitnessProvider>
      <MainApp />
    </FitnessProvider>
  );
}
