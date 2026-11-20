import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Dumbbell, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Zap,
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
    <div className="space-y-4 pb-8">
      {/* Date Header & Quick Rest Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleShiftDay(-1)}
            className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-xl text-xs font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{getFormattedDate(new Date(selectedDate + 'T12:00:00'))}</span>
            <span className="text-[10px] text-amber-400 font-mono px-1.5 py-0.2 rounded bg-amber-500/10">
              {todaysWorkout.dayName}
            </span>
          </div>
          <button
            onClick={() => handleShiftDay(1)}
            className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-400">
            Vol: <span className="text-emerald-400 font-bold">{totalVolume.toLocaleString()} kg</span>
          </div>

          {restTimerSeconds !== null ? (
            <button
              onClick={stopRestTimer}
              className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full font-mono text-xs font-bold animate-pulse"
            >
              Rest: {Math.floor(restTimerSeconds / 60)}:{(restTimerSeconds % 60).toString().padStart(2, '0')}
            </button>
          ) : (
            <button
              onClick={() => startRestTimer(90)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-xs font-mono"
            >
              90s Rest
            </button>
          )}
        </div>
      </div>

      {/* Routine Title */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-indigo-400" />
            {todaysWorkout.splitName}
          </h1>
          <p className="text-xs text-slate-400">{currentDaySchedule.muscleGroups}</p>
        </div>
        <select 
          value={activeGymId} 
          onChange={(e) => setActiveGymId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300"
        >
          {gyms.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* Exercise Set Cards */}
      {currentDaySchedule.isRest ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-2">
          <BedDouble className="w-8 h-8 text-purple-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Sunday Active Recovery Day</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No resistance training today. 3.5L water & clean rest.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
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
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{exercise.name}</h3>
                    <div className="text-[11px] text-slate-400">
                      Prev: <span className="text-indigo-300">{exercise.lastPerformance || 'N/A'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddSet(exercise.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Set
                  </button>
                </div>

                {/* Minimal AI Overload Pill */}
                <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                    <span className="font-semibold text-slate-200 truncate">{ai.headline}</span>
                  </div>
                  <button
                    onClick={() => setExpandedAiExerciseId(isExpanded ? null : exercise.id)}
                    className="text-[10px] text-amber-400 shrink-0 font-medium ml-2"
                  >
                    {isExpanded ? 'Less' : 'Why'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-2 rounded-lg bg-slate-950 text-[11px] text-slate-300 space-y-0.5">
                    <p><strong className="text-indigo-300">Readiness:</strong> {ai.fatigueInsight}</p>
                    <p><strong className="text-emerald-400">Target:</strong> {ai.reasoning}</p>
                  </div>
                )}

                {/* Minimal Set Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800 pb-1">
                      <tr>
                        <th className="pb-1 pl-1">Set</th>
                        <th className="pb-1">Weight</th>
                        <th className="pb-1">Reps</th>
                        <th className="pb-1">RIR</th>
                        <th className="pb-1 pr-1 text-right">Check</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 font-mono">
                      {exercise.sets.map((set, sIdx) => (
                        <tr key={set.setNumber} className={set.completed ? 'bg-emerald-950/20' : ''}>
                          <td className="py-2 pl-1 text-slate-400 font-bold">#{set.setNumber}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              value={set.weight ?? ''}
                              onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'weight', parseFloat(e.target.value) || null)}
                              className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-white font-bold text-xs"
                            />
                            <span className="text-[10px] text-slate-500 ml-1">kg</span>
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              value={set.reps ?? ''}
                              onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'reps', parseInt(e.target.value) || null)}
                              className="w-12 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-white font-bold text-xs"
                            />
                          </td>
                          <td className="py-2">
                            <select
                              value={set.rir ?? ''}
                              onChange={(e) => handleUpdateSet(exercise.id, sIdx, 'rir', e.target.value === '' ? null : parseInt(e.target.value))}
                              className="bg-slate-950 border border-slate-800 rounded px-1 py-1 text-xs text-amber-400"
                            >
                              <option value="0">0 (Fail)</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>
                          </td>
                          <td className="py-2 pr-1 text-right">
                            <button
                              onClick={() => handleToggleSet(exercise.id, sIdx)}
                              className={`p-1 rounded-lg border transition ${
                                set.completed 
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                                  : 'bg-slate-950 border-slate-800 text-slate-500'
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
  );
};
