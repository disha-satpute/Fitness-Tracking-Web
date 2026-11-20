import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Dumbbell, 
  Flame, 
  TrendingUp, 
  Calendar, 
  Timer, 
  ChevronRight, 
  ChevronLeft,
  BedDouble,
  Trophy
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { getFormattedDate, getISODate } from '../utils/dateUtils';

export const Dashboard: React.FC<{ 
  onNavigateTab: (tab: string, subTab?: string) => void 
}> = ({ onNavigateTab }) => {
  const { 
    profile, 
    weightRecords, 
    prs, 
    todaysWorkout, 
    nutritionLogs, 
    restTimerSeconds, 
    startRestTimer, 
    stopRestTimer,
    selectedDate,
    setSelectedDate,
    currentDaySchedule
  } = useFitness();

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

  // Calculate completed sets
  const totalSets = todaysWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = todaysWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 
    0
  );

  const chartData = weightRecords.map(w => ({
    date: w.periodLabel,
    weight: w.weight
  }));

  return (
    <div className="space-y-5 pb-8">
      {/* Date & Rest Timer Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleShiftDay(-1)}
            className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 rounded-xl text-xs font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{getFormattedDate(new Date(selectedDate + 'T12:00:00'))}</span>
            {isToday && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-bold">
                TODAY
              </span>
            )}
          </div>
          <button
            onClick={() => handleShiftDay(1)}
            className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {restTimerSeconds !== null ? (
          <button 
            onClick={stopRestTimer}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold animate-pulse"
          >
            <Timer className="w-3.5 h-3.5 animate-spin" />
            <span>{Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Rest:</span>
            <button onClick={() => startRestTimer(60)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono">60s</button>
            <button onClick={() => startRestTimer(90)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono">90s</button>
          </div>
        )}
      </div>

      {/* 3 Core Hero Metrics: Workout, Calories, Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Today's Workout Focus */}
        <div 
          onClick={() => onNavigateTab('workouts')} 
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-2xl transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Dumbbell className="w-4 h-4 text-indigo-400" /> Workout
            </span>
            <span className="font-mono text-emerald-400">{completedSets}/{totalSets} sets</span>
          </div>
          <div className="text-lg font-bold text-white truncate">
            {currentDaySchedule.isRest ? 'Sunday Recovery' : currentDaySchedule.splitTitle}
          </div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            {currentDaySchedule.isRest ? 'Full rest day' : currentDaySchedule.muscleGroups}
          </div>
        </div>

        {/* Calories & Protein Ring */}
        <div 
          onClick={() => onNavigateTab('nutrition')} 
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> Diet Deficit
            </span>
            <span className="font-mono text-amber-400">{loggedCalories || 1940} / 1940 kcal</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white font-mono">{Math.round(loggedProtein) || 138}g</span>
            <span className="text-xs text-slate-400">/ 140g protein</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-cyan-500 rounded-full" 
              style={{ width: `${Math.min(100, ((loggedProtein || 138) / 140) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Weight */}
        <div 
          onClick={() => onNavigateTab('progress', 'weight')} 
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Bodyweight
            </span>
            <span className="font-mono text-emerald-400">Recomp Cut</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">{profile.currentWeight}</span>
            <span className="text-sm font-semibold text-slate-400">kg</span>
            <span className="ml-auto text-xs text-slate-500">From 90kg → 80kg</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Heavy compound strength maintained
          </div>
        </div>
      </div>

      {/* Main Action Area: Today's Active Session + Quick PRs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Live Workout Sets Checklist (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-indigo-400" />
                {todaysWorkout.splitName}
              </h2>
              <span className="text-xs text-slate-400">Heavy Compound Overload</span>
            </div>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
            >
              Full Logger <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {currentDaySchedule.isRest ? (
            <div className="py-8 text-center space-y-2">
              <BedDouble className="w-8 h-8 text-purple-400 mx-auto" />
              <div className="text-sm font-bold text-white">Full Recovery Day</div>
              <p className="text-xs text-slate-400">Zero lifting today. CNS recovery & hydration focus.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todaysWorkout.exercises.slice(0, 4).map((ex) => (
                <div key={ex.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-white">{ex.name}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {ex.sets.filter(s => s.completed).length}/{ex.sets.length} done
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {ex.sets.map((s) => (
                      <span
                        key={s.setNumber}
                        className={`text-xs px-2 py-0.5 rounded font-mono ${
                          s.completed 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {s.weight}kg × {s.reps}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clean Weight Curve & PR snapshot (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Simple Weight Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Weight Timeline
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">84.0 kg</span>
            </div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                  <YAxis domain={[78, 92]} stroke="#64748b" tick={{ fontSize: 9 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val} kg`, 'Weight']}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key PR Highlights with direct redirect to Hall of PRs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Key Personal Records
              </span>
              <button 
                onClick={() => onNavigateTab('progress', 'prs')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
              >
                All →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {prs.slice(0, 4).map((pr) => (
                <div 
                  key={pr.id} 
                  onClick={() => onNavigateTab('progress', 'prs')}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-amber-500/50 transition"
                >
                  <div className="text-[10px] text-slate-400 truncate">{pr.exerciseName}</div>
                  <div className="font-bold text-amber-400 font-mono mt-0.5">{pr.recordValue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
