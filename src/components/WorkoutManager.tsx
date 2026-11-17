import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { WORKOUT_SPLITS, HISTORICAL_EXERCISE_PROGRESSION } from '../data/historicalData';
import { 
  Dumbbell, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  ChevronLeft,
  ChevronRight,
  Clock,
  BedDouble,
  Sparkles,
  Zap,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SetEntry } from '../types/fitness';
import { getFormattedDate, getISODate } from '../utils/dateUtils';
import { getSmartOverloadPrediction } from '../utils/aiAdvisor';

export const WorkoutManager: React.FC = () => {
  const { 
    todaysWorkout, 
    updateTodaysWorkout, 
    gyms, 
    activeGymId, 
    setActiveGymId,
    startRestTimer,
    restTimerSeconds,
    stopRestTimer,
    selectedDate,
    setSelectedDate,
    currentDaySchedule,
    recoveryLogs
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'logger' | 'splits' | 'progression'>('logger');
  const [selectedSplitId, setSelectedSplitId] = useState<string>('trainer-split');
  const [expandedAiExerciseId, setExpandedAiExerciseId] = useState<string | null>(null);

  const latestRecovery = recoveryLogs[0] || { readiness: 8, sleepHours: 6.8 };

  // Toggle set completed
  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    const updated = { ...todaysWorkout };
    const ex = updated.exercises.find(e => e.id === exerciseId);
    if (ex && ex.sets[setIndex]) {
      const isNowCompleted = !ex.sets[setIndex].completed;
      ex.sets[setIndex].completed = isNowCompleted;
      updateTodaysWorkout(updated);

      if (isNowCompleted && restTimerSeconds === null) {
        startRestTimer(90);
      }
    }
  };

  // Update set weight or reps
  const handleUpdateSet = (
    exerciseId: string, 
    setIndex: number, 
    field: keyof SetEntry, 
    val: any
  ) => {
    const updated = { ...todaysWorkout };
    const ex = updated.exercises.find(e => e.id === exerciseId);
    if (ex && ex.sets[setIndex]) {
      (ex.sets[setIndex] as any)[field] = val;
      updateTodaysWorkout(updated);
    }
  };

  // Add new set to exercise
  const handleAddSet = (exerciseId: string) => {
    const updated = { ...todaysWorkout };
    const ex = updated.exercises.find(e => e.id === exerciseId);
    if (ex) {
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSetNumber = ex.sets.length + 1;
      ex.sets.push({
        setNumber: newSetNumber,
        weight: lastSet ? lastSet.weight : 20,
        unit: 'kg',
        reps: lastSet ? lastSet.reps : 10,
        rir: 2,
        setType: 'working',
        completed: false
      });
      updateTodaysWorkout(updated);
    }
  };

  // Total session volume
  const totalVolume = todaysWorkout.exercises.reduce((sum, ex) => {
    return sum + ex.sets.reduce((setSum, s) => {
      if (s.completed && s.weight && s.reps) {
        return setSum + (s.weight * s.reps);
      }
      return setSum;
    }, 0);
  }, 0);

  const handleShiftDay = (delta: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    setSelectedDate(getISODate(d));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Real Calendar Date Strip for Workouts */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShiftDay(-1)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white">
              {getFormattedDate(new Date(selectedDate + 'T12:00:00'))}
            </span>
            <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {todaysWorkout.dayName}
            </span>
          </div>
          <button
            onClick={() => handleShiftDay(1)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('logger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'logger' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Session Logger
          </button>
          <button
            onClick={() => setActiveTab('splits')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'splits' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Schedules
          </button>
          <button
            onClick={() => setActiveTab('progression')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'progression' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Progression Arcs
          </button>
        </div>
      </div>

      {activeTab === 'logger' && (
        <div className="space-y-6">
          {/* Top Session Stats & Rest Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Scheduled Target</span>
              <div className="text-lg font-bold text-white mt-1 truncate">{todaysWorkout.splitName}</div>
              <div className="text-xs text-indigo-400 mt-0.5">{currentDaySchedule.muscleGroups}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Session Total Volume</span>
              <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                {totalVolume > 0 ? `${totalVolume.toLocaleString()} kg` : '0 kg'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Sum(Weight × Reps completed)</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Gym Facility</span>
              <select 
                value={activeGymId} 
                onChange={(e) => setActiveGymId(e.target.value)}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {gyms.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.maxDumbbell})</option>
                ))}
              </select>
              <div className="text-[11px] text-amber-400/90 mt-1">
                {activeGymId === 'gym-new' ? 'Up to 40kg DBs, No Smith machine' : 'Capped at 50lb DBs, Smith machine present'}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Rest Timer</span>
                {restTimerSeconds !== null && (
                  <button onClick={stopRestTimer} className="text-[11px] text-rose-400 hover:underline">
                    Reset
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-extrabold font-mono text-amber-400">
                  {restTimerSeconds !== null 
                    ? `${Math.floor(restTimerSeconds / 60)}:${(restTimerSeconds % 60).toString().padStart(2, '0')}`
                    : 'Ready'}
                </span>
                <div className="flex gap-1 text-xs">
                  <button onClick={() => startRestTimer(60)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">60s</button>
                  <button onClick={() => startRestTimer(90)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">90s</button>
                  <button onClick={() => startRestTimer(120)} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded">120s</button>
                </div>
              </div>
            </div>
          </div>

          {/* Exercise Set-by-Set Cards or Rest message */}
          {currentDaySchedule.isRest ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-lg space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-950/60 border border-purple-800/40 flex items-center justify-center mx-auto text-purple-400">
                <BedDouble className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Sunday Active Recovery Day</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No resistance training scheduled for Sunday. Recommended activity: light 2km walk, stretching, high hydration (3.5L+), and complete central nervous system recovery.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysWorkout.exercises.map((exercise) => {
                const ai = getSmartOverloadPrediction(
                  exercise.name, 
                  exercise.lastPerformance, 
                  latestRecovery.readiness, 
                  latestRecovery.sleepHours
                );
                const isExpanded = expandedAiExerciseId === exercise.id;

                return (
                  <div 
                    key={exercise.id} 
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                            {exercise.muscleGroup}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {exercise.equipment}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                          <div>
                            Historical Milestone: <span className="text-amber-400 font-medium">{exercise.historicalBest}</span>
                          </div>
                          <div>
                            Previous Session: <span className="text-indigo-300 font-medium">{exercise.lastPerformance}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddSet(exercise.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition self-start sm:self-center"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Set
                      </button>
                    </div>

                    {/* Flawless, Lightweight AI Overload Predictor Pill */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-transparent border border-amber-500/25 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                            <Zap className="w-3.5 h-3.5 fill-amber-400" />
                          </span>
                          <span className="font-bold text-amber-400">AI Overload Target:</span>
                          <span className="font-semibold text-slate-200">{ai.headline}</span>
                        </div>

                        <button
                          onClick={() => setExpandedAiExerciseId(isExpanded ? null : exercise.id)}
                          className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-amber-300 ml-2 shrink-0 font-medium"
                        >
                          <span>{isExpanded ? 'Less' : 'Why'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-300 space-y-1 animate-fadeIn">
                          <p><strong className="text-indigo-300">Fatigue & Readiness:</strong> {ai.fatigueInsight}</p>
                          <p><strong className="text-emerald-400">Strategy:</strong> {ai.reasoning}</p>
                        </div>
                      )}
                    </div>

                    {/* Set Row Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800/60 font-mono">
                          <tr>
                            <th className="pb-2 pl-2">Set</th>
                            <th className="pb-2">Type</th>
                            <th className="pb-2">Weight (kg)</th>
                            <th className="pb-2">Reps</th>
                            <th className="pb-2">RIR (0–5)</th>
                            <th className="pb-2">Notes / Context</th>
                            <th className="pb-2 pr-2 text-right">Done</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {exercise.sets.map((set, sIdx) => (
                            <tr 
                              key={set.setNumber} 
                              className={`hover:bg-slate-800/30 transition ${
                                set.completed ? 'bg-emerald-950/20' : ''
                              }`}
                            >
                              <td className="py-2.5 pl-2 font-mono font-bold text-slate-400">
                                #{set.setNumber}
                              </td>
                              <td className="py-2.5">
                                <select
                                  value={set.setType}
                                  onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'setType', e.target.value)}
                                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                                >
                                  <option value="warmup">Warm-up</option>
                                  <option value="working">Working</option>
                                  <option value="pr">PR Attempt</option>
                                  <option value="drop">Drop Set</option>
                                  <option value="failure">To Failure</option>
                                  <option value="assisted">Assisted</option>
                                </select>
                              </td>
                              <td className="py-2.5">
                                <input
                                  type="number"
                                  value={set.weight ?? ''}
                                  onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'weight', parseFloat(e.target.value) || null)}
                                  className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                                  placeholder="kg"
                                />
                              </td>
                              <td className="py-2.5">
                                <input
                                  type="number"
                                  value={set.reps ?? ''}
                                  onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'reps', parseInt(e.target.value) || null)}
                                  className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                                  placeholder="reps"
                                />
                              </td>
                              <td className="py-2.5">
                                <select
                                  value={set.rir ?? ''}
                                  onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'rir', e.target.value === '' ? null : parseInt(e.target.value))}
                                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-amber-400 font-mono focus:outline-none"
                                >
                                  <option value="">NA</option>
                                  <option value="0">0 RIR (Failure)</option>
                                  <option value="1">1 RIR</option>
                                  <option value="2">2 RIR</option>
                                  <option value="3">3 RIR</option>
                                  <option value="4">4 RIR</option>
                                </select>
                              </td>
                              <td className="py-2.5">
                                <input
                                  type="text"
                                  value={set.notes || ''}
                                  onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'notes', e.target.value)}
                                  placeholder="e.g. good stretch, 100% effort, slight spotter touch"
                                  className="w-full min-w-[180px] bg-slate-950/60 border border-slate-800/80 rounded px-2 py-1 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
                                />
                              </td>
                              <td className="py-2.5 pr-2 text-right">
                                <button
                                  onClick={() => handleToggleSet(exercise.id, sIdx)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    set.completed 
                                      ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                                      : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                  }`}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'splits' && (
        <div className="space-y-6">
          <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            {WORKOUT_SPLITS.map((split) => (
              <button
                key={split.id}
                onClick={() => setSelectedSplitId(split.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedSplitId === split.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {split.name}
              </button>
            ))}
          </div>

          {WORKOUT_SPLITS.filter(s => s.id === selectedSplitId).map((split) => (
            <div key={split.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      split.status === 'ACTIVE_PREFERENCE' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {split.status === 'ACTIVE_PREFERENCE' ? 'Current Preferred Architecture' : 'Historical Archive'}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{split.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{split.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {split.schedule.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-400 text-sm">{item.day}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                        Day {idx + 1}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">{item.muscle}</div>
                    <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-900">
                      Focus: <span className="text-slate-300">{item.focus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'progression' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Documented Historical Performance & Overload Milestones
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Tracked progression milestones from explicit workout discussions without guessing missing sets.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HISTORICAL_EXERCISE_PROGRESSION.map((item, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <h3 className="font-bold text-white text-base mb-3 flex items-center justify-between">
                    <span>{item.exercise}</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                      Documented Arc
                    </span>
                  </h3>

                  <div className="space-y-2.5">
                    {item.history.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{h.date}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{h.note}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold font-mono text-amber-400 text-sm">
                            {h.weightKg} kg
                          </span>
                          <span className="text-slate-400 ml-1">× {h.reps} reps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
