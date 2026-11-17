import React, { useState, useEffect } from 'react';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Dashboard } from './components/Dashboard';
import { WorkoutManager } from './components/WorkoutManager';
import { NutritionTracker } from './components/NutritionTracker';
import { ProgressTracker } from './components/ProgressTracker';
import { PersonalRecords } from './components/PersonalRecords';
import { RecoveryTracker } from './components/RecoveryTracker';
import { ProfileAudit } from './components/ProfileAudit';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Flame, 
  TrendingUp, 
  Trophy, 
  HeartPulse, 
  UserCheck, 
  Timer,
  MoreHorizontal,
  X,
  Sun,
  Moon
} from 'lucide-react';

const NAME_OPTIONS = ['Aaduu', 'Aadesh', 'Handsome', 'Aadyy'];

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [moreSheetOpen, setMoreSheetOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Random / anonymous selection without dropdown
  const [selectedName, setSelectedName] = useState<string>(() => {
    const randomIndex = Math.floor(Math.random() * NAME_OPTIONS.length);
    return NAME_OPTIONS[randomIndex];
  });

  const { restTimerSeconds, stopRestTimer, startRestTimer } = useFitness();

  // Subtle periodic change every 45 seconds or on page visit
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedName(prev => {
        const remaining = NAME_OPTIONS.filter(n => n !== prev);
        const next = remaining[Math.floor(Math.random() * remaining.length)];
        return next;
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Flame },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'prs', label: 'Records', icon: Trophy },
    { id: 'recovery', label: 'Recovery', icon: HeartPulse },
    { id: 'profile', label: 'Specs/Audit', icon: UserCheck }
  ];

  // Primary 4 items shown on mobile bottom bar
  const bottomBarItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workout', icon: Dumbbell },
    { id: 'nutrition', label: 'Diet', icon: Flame },
    { id: 'progress', label: 'Body', icon: TrendingUp }
  ];

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'theme-light bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col md:flex-row antialiased selection:bg-amber-500 selection:text-slate-950 transition-colors duration-200`}>
      {/* Sidebar for Desktop & Tablets (>= 768px) */}
      <aside className={`hidden md:flex flex-col w-64 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'} border-r p-4 justify-between shrink-0 sticky top-0 h-screen`}>
        <div>
          {/* Header: Anonymous greeting without select dropdown + Theme switch */}
          <div className={`px-2 py-4 mb-6 border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Hello, welcome back
              </span>

              {/* Theme Toggle Icon Button */}
              <button
                onClick={toggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                className={`p-2 rounded-xl transition ${
                  theme === 'dark' 
                    ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' 
                    : 'bg-slate-200 text-indigo-600 hover:bg-slate-300'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Clean Anonymous Name (No dropdown) */}
            <div className="mt-1.5 px-0.5">
              <span className="font-extrabold text-xl text-amber-400 tracking-tight transition-all duration-300">
                {selectedName}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
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

        {/* Bottom Sidebar: Mini Athlete Status Card & Rest Timer */}
        <div className={`space-y-3 pt-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
          {restTimerSeconds !== null && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase">
                <span className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Rest Timer
                </span>
                <button onClick={stopRestTimer} className="text-[10px] hover:underline text-slate-400">Dismiss</button>
              </div>
              <div className="text-xl font-bold font-mono mt-1 text-center">
                {Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}

          <div className={`p-3 rounded-xl ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'} border text-[11px] text-slate-400`}>
            <div className="flex justify-between items-center font-semibold mb-1">
              <span className={theme === 'light' ? 'text-slate-800' : 'text-slate-300'}>Athlete: {selectedName}</span>
              <span className="text-emerald-500 font-mono">84 kg</span>
            </div>
            <div>Split: 6-Day 2-Muscle Routine</div>
            <div className="text-[10px] text-amber-500 mt-1">Goal: Cutting Deficit (1,940 kcal)</div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className={`md:hidden ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-slate-900/95 border-slate-800'} backdrop-blur-md border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40`} style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Hello, welcome back</div>
          <div className="text-base font-extrabold text-amber-400 leading-tight">
            {selectedName}
          </div>
        </div>

        {/* Quick mobile rest timer & theme switch trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition ${
              theme === 'dark' 
                ? 'bg-slate-800 text-amber-400' 
                : 'bg-slate-200 text-indigo-600'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {restTimerSeconds !== null ? (
            <button
              onClick={stopRestTimer}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold animate-pulse"
            >
              <Timer className="w-3.5 h-3.5 animate-spin" />
              <span>{Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}</span>
            </button>
          ) : (
            <button
              onClick={() => startRestTimer(90)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium"
            >
              <Timer className="w-3.5 h-3.5 text-indigo-400" />
              <span>90s</span>
            </button>
          )}

          <div className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-bold">
            84kg
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-3 sm:p-4 md:p-8 max-w-7xl mx-auto w-full pb-28 md:pb-8">
        {activeTab === 'dashboard' && <Dashboard onNavigateTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'workouts' && <WorkoutManager />}
        {activeTab === 'nutrition' && <NutritionTracker />}
        {activeTab === 'progress' && <ProgressTracker />}
        {activeTab === 'prs' && <PersonalRecords />}
        {activeTab === 'recovery' && <RecoveryTracker />}
        {activeTab === 'profile' && <ProfileAudit />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-slate-900/95 border-slate-800/80'} backdrop-blur-lg border-t px-2 py-1 shadow-2xl`}
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-5 items-center">
          {bottomBarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMoreSheetOpen(false);
                }}
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

          {/* "More" button */}
          <button
            onClick={() => setMoreSheetOpen(!moreSheetOpen)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition duration-150 touch-manipulation active:scale-95 ${
              moreSheetOpen || ['prs', 'recovery', 'profile'].includes(activeTab)
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${moreSheetOpen || ['prs', 'recovery', 'profile'].includes(activeTab) ? 'bg-indigo-500/10' : ''}`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile "More" Drawer Modal */}
      {moreSheetOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setMoreSheetOpen(false)}
        >
          <div 
            className={`${theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'} border-t rounded-t-3xl p-5 shadow-2xl space-y-4`}
            style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between pb-3 border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">More Fitness Modules</span>
              <button 
                onClick={() => setMoreSheetOpen(false)}
                className={`p-1 rounded-full ${theme === 'light' ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'prs', label: 'Hall of PRs', icon: Trophy, desc: '30kg DB, 260kg Press' },
                { id: 'recovery', label: 'Recovery & Stack', icon: HeartPulse, desc: 'Sleep & Creatine' },
                { id: 'profile', label: 'Athlete Audit', icon: UserCheck, desc: 'Specs & Missing Info' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMoreSheetOpen(false);
                    }}
                    className={`flex flex-col items-center p-3 rounded-2xl border text-center transition ${
                      isActive 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-bold' 
                        : `${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'}`
                    }`}
                  >
                    <Icon className="w-6 h-6 text-amber-400 mb-1" />
                    <span className="text-xs font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
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
