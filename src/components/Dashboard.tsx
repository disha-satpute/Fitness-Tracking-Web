import React, { useState, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Dumbbell, 
  Flame, 
  Moon, 
  TrendingUp, 
  Trophy, 
  Target, 
  Calendar, 
  Timer,
  CheckCircle2, 
  ChevronRight, 
  Info,
  Clock,
  Sparkles,
  ChevronLeft,
  BedDouble
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getFormattedDate, getFormattedTime, getISODate, getDayName } from '../utils/dateUtils';

export const Dashboard: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { 
    profile, 
    calorieProfile, 
    weightRecords, 
    prs, 
    todaysWorkout, 
    nutritionLogs, 
    recoveryLogs, 
    restTimerSeconds, 
    startRestTimer, 
    stopRestTimer,
    selectedDate,
    setSelectedDate,
    currentDaySchedule
  } = useFitness();

  const [weightFilter, setWeightFilter] = useState<'all' | '90d' | '30d'>('all');
  const [liveTime, setLiveTime] = useState<string>(getFormattedTime());

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(getFormattedTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick Date Navigator: Previous day / Next day / Today
  const handleShiftDay = (delta: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    setSelectedDate(getISODate(d));
  };

  const isToday = selectedDate === getISODate(new Date());

  // Calculate selected date's logged nutrition metrics
  const dateLog = nutritionLogs.find(l => l.date === selectedDate) || nutritionLogs[0];
  let loggedCalories = 0;
  let loggedProtein = 0;
  if (dateLog) {
    dateLog.meals.forEach(m => {
      m.items.forEach(i => {
        loggedCalories += i.calories || 0;
        loggedProtein += i.protein || 0;
      });
    });
  }

  // Calculate completed sets in selected date's workout
  const totalSets = todaysWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = todaysWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 
    0
  );

  // Latest recovery
  const latestRecovery = recoveryLogs[0] || {
    sleepHours: 6.9,
    energy: 8,
    readiness: 8,
    soreness: 4,
    sleepQuality: 'Good'
  };

  const chartData = weightRecords.map(w => ({
    date: w.periodLabel,
    weight: w.weight,
    notes: w.notes,
    status: w.status
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Real-Time Status & Date Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono font-bold text-white tracking-wider">{liveTime}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleShiftDay(-1)}
              className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">
                {getFormattedDate(new Date(selectedDate + 'T12:00:00'))}
              </span>
              {isToday && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold ml-1">
                  TODAY
                </span>
              )}
            </div>
            <button
              onClick={() => handleShiftDay(1)}
              className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(getISODate(new Date()))}
                className="text-[11px] px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition font-medium"
              >
                Jump to Today
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Scheduled:</span>
          <span className={`px-2.5 py-1 rounded-xl font-bold border ${
            currentDaySchedule.isRest 
              ? 'bg-purple-950/60 text-purple-300 border-purple-800/40' 
              : 'bg-indigo-950/60 text-indigo-300 border-indigo-800/40'
          }`}>
            {currentDaySchedule.dayName}: {currentDaySchedule.splitTitle}
          </span>
        </div>
      </div>

      {/* Top Banner: Real Calendar Awareness & Philosophy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-900/40 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Training & Nutrition Tracker
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                Trainer Split (6 Days Heavy Compound + 1 Rest)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-950/60 text-purple-300 border border-purple-800/40">
                Current: 84 kg (from 90 kg start → 80 kg low)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {currentDaySchedule.isRest ? (
                <>
                  <BedDouble className="w-7 h-7 text-purple-400" />
                  Sunday Active Recovery Window
                </>
              ) : (
                <>
                  <Dumbbell className="w-7 h-7 text-indigo-400" />
                  {currentDaySchedule.dayName}'s Focus: {currentDaySchedule.splitTitle}
                </>
              )}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Targeting <span className="text-amber-400 font-semibold">{currentDaySchedule.muscleGroups}</span>. 
              The system synchronizes your real daily calendar with progressive loading (Incline DB 30kg × 9, Leg Press 250kg), 
              caloric deficit (1,940 kcal), and budget-aware protein adherence (130–150g).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            {restTimerSeconds !== null ? (
              <div className="flex items-center gap-3 bg-amber-500/20 border border-amber-500/40 px-4 py-2.5 rounded-xl animate-pulse text-amber-300">
                <Timer className="w-5 h-5 text-amber-400 animate-spin" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider">Rest Running</div>
                  <div className="text-xl font-bold font-mono">{Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}</div>
                </div>
                <button 
                  onClick={stopRestTimer} 
                  className="ml-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
                >
                  Skip
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-400">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Quick Rest:</span>
                <button onClick={() => startRestTimer(60)} className="hover:text-amber-400 px-1.5 py-0.5 bg-slate-800/80 rounded">60s</button>
                <button onClick={() => startRestTimer(90)} className="hover:text-amber-400 px-1.5 py-0.5 bg-slate-800/80 rounded">90s</button>
                <button onClick={() => startRestTimer(120)} className="hover:text-amber-400 px-1.5 py-0.5 bg-slate-800/80 rounded">120s</button>
              </div>
            )}
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weight & Body Dynamics */}
        <div 
          onClick={() => onNavigateTab('progress')} 
          className="cursor-pointer group bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl transition duration-200 hover:shadow-lg hover:shadow-indigo-500/5"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Weight Dynamics
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              84.0 KG
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{profile.currentWeight}</span>
            <span className="text-sm font-semibold text-slate-400">kg</span>
            <span className="ml-auto text-xs text-slate-400">Latest: 12 Nov 2026</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
            <div>Start: <span className="text-slate-200 font-semibold">~90 kg</span></div>
            <div>Low: <span className="text-slate-200 font-semibold">~80 kg</span></div>
            <div>Recent: <span className="text-slate-200 font-semibold">82–83 kg</span></div>
          </div>
        </div>

        {/* Cutting Calories Card */}
        <div 
          onClick={() => onNavigateTab('nutrition')} 
          className="cursor-pointer group bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition duration-200 hover:shadow-lg hover:shadow-amber-500/5"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" /> Caloric Deficit
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
              TARGET 1,940
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {loggedCalories > 0 ? loggedCalories.toLocaleString() : '1,940'}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 1,940 kcal</span>
          </div>
          <div className="mt-3">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, ((loggedCalories || 1940) / 1940) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
              <span>Maint: 2,200 (Stated) | 3,000 (App)</span>
              <span>BMR: ~1,840</span>
            </div>
          </div>
        </div>

        {/* Protein Adherence Card */}
        <div 
          onClick={() => onNavigateTab('nutrition')} 
          className="cursor-pointer group bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition duration-200 hover:shadow-lg hover:shadow-cyan-500/5"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-400" /> Protein Adherence
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
              130–150g GOAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {loggedProtein > 0 ? Math.round(loggedProtein) : '138'}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 140 g target</span>
          </div>
          <div className="mt-3">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 rounded-full transition-all" 
                style={{ width: `${Math.min(100, ((loggedProtein || 138) / 140) * 100)}%` }} 
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
              <span>Budget: Soybean, Milk, 1x Whey</span>
              <span className="text-cyan-400 font-medium">98% hit</span>
            </div>
          </div>
        </div>

        {/* Recovery & Sleep Readiness */}
        <div 
          onClick={() => onNavigateTab('recovery')} 
          className="cursor-pointer group bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl transition duration-200 hover:shadow-lg hover:shadow-purple-500/5"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-purple-400" /> Sleep & Recovery
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-800/40">
              6.5–7.5h RANGE
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{latestRecovery.sleepHours}</span>
            <span className="text-sm font-semibold text-slate-400">hrs logged</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded bg-purple-900/50 text-purple-300 font-medium">
              Readiness: {latestRecovery.readiness}/10
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
            <div>Soreness: <span className="text-slate-200 font-semibold">{latestRecovery.soreness}/10</span></div>
            <div>Energy: <span className="text-slate-200 font-semibold">{latestRecovery.energy}/10</span></div>
            <div>Hydration: <span className="text-cyan-400 font-semibold">3.5L</span></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Today's Scheduled Session + Weight Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workout Plan for Selected Real Date (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    REAL CALENDAR SESSION
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {selectedDate} ({todaysWorkout.dayName})
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-indigo-400" />
                  {todaysWorkout.splitName}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gym: <span className="text-slate-200 font-medium">New Gym (Up to 40 kg DBs, No Smith Machine)</span>
                </p>
              </div>

              {totalSets > 0 && (
                <div className="text-right">
                  <div className="text-xs text-slate-400">Sets Completed</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {completedSets} / {totalSets}
                  </div>
                </div>
              )}
            </div>

            {/* Exercise List preview or Rest Day Message */}
            {currentDaySchedule.isRest ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-950/60 border border-purple-800/40 flex items-center justify-center mx-auto text-purple-400">
                  <BedDouble className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Full Recovery Day</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  No heavy lifting scheduled today. Focus on systemic central nervous system recovery, 3.5L hydration, and high-protein meal prep.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {todaysWorkout.exercises.map((exercise, index) => {
                  const totalExSets = exercise.sets.length;
                  const doneSets = exercise.sets.filter(s => s.completed).length;
                  const isAllDone = doneSets === totalExSets;

                  return (
                    <div 
                      key={exercise.id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <h4 className="font-semibold text-white text-sm">{exercise.name}</h4>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                            {exercise.muscleGroup}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isAllDone 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {doneSets}/{totalExSets} sets
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 mb-2">
                        <div>
                          Historical Best: <span className="text-amber-400 font-medium">{exercise.historicalBest || 'Not Available'}</span>
                        </div>
                        <div>
                          Previous Session: <span className="text-indigo-300 font-medium">{exercise.lastPerformance || 'Not Available'}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/50">
                        {exercise.sets.map((set) => (
                          <div 
                            key={set.setNumber}
                            className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono ${
                              set.completed 
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' 
                                : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            {set.completed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            <span>Set {set.setNumber}:</span>
                            <span className="font-bold text-slate-200">{set.weight}kg × {set.reps}</span>
                            {set.rir !== undefined && set.rir !== null && (
                              <span className="text-[10px] text-amber-400/90">@{set.rir}RIR</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Avg Session: <span className="text-slate-200 font-medium">~120 min total gym time</span>
            </div>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
            >
              Open Live Workout Logger <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weight Progression Chart & Historical Context (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Weight Progression Arc
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real timeline: ~90 kg start → 80 kg low → 84 kg (12 Nov 2026)
                </p>
              </div>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button 
                  onClick={() => setWeightFilter('all')} 
                  className={`px-2 py-0.5 rounded ${weightFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  All Time
                </button>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis domain={[75, 95]} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    formatter={(val: any) => [`${val} kg`, 'Weight']}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#weightGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                <Info className="w-3.5 h-3.5" /> Recomposition Dynamics Note:
              </div>
              The weight increase from <span className="text-white font-bold">80 kg → 84 kg</span> is preserved without assumptions. 
              The athlete maintains strength progression (Incline DB 30kg × 9, Leg Press 250kg × 7) while pursuing simultaneous fat reduction and muscle fullness.
            </div>
          </div>

          {/* Hall of PRs snapshot */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Key Historical Personal Records
              </h3>
              <button 
                onClick={() => onNavigateTab('prs')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View all ({prs.length}) →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {prs.slice(0, 4).map((pr) => (
                <div key={pr.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 truncate">{pr.exerciseName}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{pr.recordValue}</div>
                  <div className="text-[10px] text-amber-400/90 mt-1 flex items-center gap-1 truncate">
                    <span>{pr.gymName}</span> • <span className="text-slate-400">{pr.romContext}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
