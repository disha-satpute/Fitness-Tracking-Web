import React, { useState } from 'react';
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
  Trophy,
  Footprints,
  CheckCircle2,
  Edit2,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { getFormattedDate, getISODate } from '../utils/dateUtils';

export const Dashboard: React.FC<{ 
  onNavigateTab: (tab: string, subTab?: string) => void 
}> = ({ onNavigateTab }) => {
  const { 
    profile, 
    calorieProfile,
    weightRecords, 
    prs, 
    todaysWorkout, 
    nutritionLogs, 
    dailySteps,
    updateDailySteps,
    restTimerSeconds, 
    startRestTimer, 
    stopRestTimer,
    selectedDate,
    setSelectedDate,
    currentDaySchedule
  } = useFitness();

  const [showStepModal, setShowStepModal] = useState(false);
  const [stepInputValue, setStepInputValue] = useState('');

  const handleShiftDay = (delta: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    setSelectedDate(getISODate(d));
  };

  const isToday = selectedDate === getISODate(new Date());

  // Current selected day's steps
  const todayStepRecord = dailySteps.find(s => s.date === selectedDate);
  const currentSteps = todayStepRecord ? todayStepRecord.steps : 0;
  const stepTarget = calorieProfile.stepsTargetMin || 8000;
  const stepPercent = Math.min(100, Math.round((currentSteps / stepTarget) * 100));
  const isTargetAchieved = currentSteps >= stepTarget;

  // Past 7 days step data for weekly chart
  const last7DaysSteps = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() - (6 - i));
    const iso = getISODate(d);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const rec = dailySteps.find(s => s.date === iso);
    return {
      date: iso,
      day: dayName,
      steps: rec ? rec.steps : 0,
      isSelected: iso === selectedDate
    };
  });

  const handleOpenStepModal = () => {
    setStepInputValue(currentSteps > 0 ? currentSteps.toString() : '');
    setShowStepModal(true);
  };

  const handleSaveSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(stepInputValue, 10);
    if (!isNaN(val) && val >= 0) {
      updateDailySteps(selectedDate, val);
    }
    setShowStepModal(false);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
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

          {/* Quick Step Pill in Date Bar */}
          <button
            onClick={handleOpenStepModal}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/40 rounded-xl text-xs text-indigo-300 transition"
          >
            <Footprints className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono font-bold">{currentSteps.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400">steps</span>
          </button>
        </div>

        {restTimerSeconds !== null ? (
          <button 
            onClick={stopRestTimer}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold animate-pulse self-start sm:self-auto"
          >
            <Timer className="w-3.5 h-3.5 animate-spin" />
            <span>{Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 text-xs self-start sm:self-auto">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Rest:</span>
            <button onClick={() => startRestTimer(60)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono">60s</button>
            <button onClick={() => startRestTimer(90)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono">90s</button>
          </div>
        )}
      </div>

      {/* 4 Core Hero Metrics: Workout, Calories, Weight, Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

        {/* Bodyweight */}
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
            <span className="ml-auto text-xs text-slate-500">90kg → 80kg</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            Compound strength maintained
          </div>
        </div>

        {/* Daily Steps Tracker Card */}
        <div 
          onClick={handleOpenStepModal}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl transition group relative"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1 text-cyan-400">
              <Footprints className="w-4 h-4" /> Daily Steps
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-cyan-300">
              <Edit2 className="w-3 h-3" /> Log
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-white font-mono">{currentSteps.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/ {stepTarget.toLocaleString()}</span>
            </div>
            {isTargetAchieved ? (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Met
              </span>
            ) : (
              <span className="text-[10px] font-mono text-amber-400">{stepPercent}%</span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isTargetAchieved ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${stepPercent}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Main Action Area: Today's Active Session + Quick PRs & Step Trend */}
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

        {/* Right Column: Step Trend, Weight Curve & PR snapshot (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Past 7 Days Weekly Step Trend */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" /> Weekly Steps (7-Day Trend)
              </span>
              <button
                onClick={handleOpenStepModal}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
              >
                + Log Steps
              </button>
            </div>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7DaysSteps} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 12000]} stroke="#64748b" tick={{ fontSize: 9 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val.toLocaleString()} steps`, 'Steps']}
                  />
                  <Bar dataKey="steps" radius={[4, 4, 0, 0]}>
                    {last7DaysSteps.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isSelected ? '#38bdf8' : entry.steps >= stepTarget ? '#10b981' : '#334155'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
              <span>Goal: {stepTarget.toLocaleString()}+ steps/day</span>
              <span className="text-cyan-400">Blue bar = Selected Date</span>
            </div>
          </div>

          {/* Simple Weight Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Weight Timeline
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">84.0 kg</span>
            </div>
            <div className="h-32 w-full">
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

      {/* Quick Step Log Modal */}
      {showStepModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Footprints className="w-5 h-5 text-cyan-400" />
              Log Daily Steps
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Recording steps for {getFormattedDate(new Date(selectedDate + 'T12:00:00'))}
            </p>

            <form onSubmit={handleSaveSteps} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Step Count</label>
                <div className="relative">
                  <input
                    type="number"
                    step="50"
                    placeholder="e.g. 8420"
                    value={stepInputValue}
                    onChange={(e) => setStepInputValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-base focus:border-cyan-500 focus:outline-none"
                    autoFocus
                    required
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-500 font-mono">steps</span>
                </div>
              </div>

              {/* Quick increment buttons */}
              <div className="flex gap-2 text-xs">
                {[5000, 7500, 8500, 10000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStepInputValue(val.toString())}
                    className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition"
                  >
                    {(val / 1000).toFixed(1)}k
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStepModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20"
                >
                  Save Steps
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
