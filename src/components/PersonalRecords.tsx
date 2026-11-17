import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Trophy, 
  Plus, 
  MapPin, 
  Award, 
  Filter, 
  CheckCircle2, 
  Info
} from 'lucide-react';

export const PersonalRecords: React.FC = () => {
  const { prs, addPr, gyms } = useFitness();

  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states - removed gymId and romContext from manual input per user request
  const [exName, setExName] = useState('');
  const [muscle, setMuscle] = useState('Chest');
  const [weightKg, setWeightKg] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');

  const muscles = ['All', 'Chest', 'Back', 'Quads', 'Legs', 'Shoulders'];

  const filteredPrs = selectedMuscle === 'All' 
    ? prs 
    : prs.filter(p => p.muscle.toLowerCase().includes(selectedMuscle.toLowerCase()));

  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName || !weightKg || !reps) return;

    // Default to active facility
    const defaultGym = gyms[1] || gyms[0];

    addPr({
      exerciseName: exName,
      muscle,
      recordValue: `${weightKg} kg × ${reps}`,
      rawWeightKg: parseFloat(weightKg),
      reps,
      date: '2026-11-17',
      gymId: defaultGym ? defaultGym.id : 'gym-new',
      gymName: defaultGym ? defaultGym.name : 'Gym',
      romContext: 'Standard PR',
      isPR: true,
      notes: notes || 'New PR logged'
    });

    setExName('');
    setWeightKg('');
    setReps('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Hall of Personal Records (PRs)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking true strength progression with preserved gym context, stance variations, and ROM details
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Log New PR
        </button>
      </div>

      {/* Filter Tabs by Muscle */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-500 mr-1 shrink-0" />
        {muscles.map(m => (
          <button
            key={m}
            onClick={() => setSelectedMuscle(m)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              selectedMuscle === m
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* PR Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrs.map((pr) => (
          <div 
            key={pr.id} 
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                  {pr.muscle}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {pr.date}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mt-1">
                {pr.exerciseName}
              </h3>

              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Record Performance</div>
                <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
                  {pr.recordValue}
                </div>
              </div>

              {/* Context Badges */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Facility: <strong className="text-slate-200">{pr.gymName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ROM / Stance: <strong className="text-slate-200">{pr.romContext}</strong></span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 italic">
                  "{pr.notes}"
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Historical Lift
              </span>
              <span className="font-mono">{pr.rawWeightKg} kg load</span>
            </div>
          </div>
        ))}
      </div>

      {/* Preservation Principle Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white">Integrity Principle for Personal Records:</div>
          <p className="text-slate-400 leading-relaxed">
            Historical milestones record performance differences between gyms and mechanics: 260 kg leg press (Old Gym half-ROM) vs 250 kg × 7 (New Gym full depth @ 2 RIR).
          </p>
        </div>
      </div>

      {/* Add PR Modal - Gym facility & ROM context removed as requested */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Add Personal Record (PR)
            </h3>

            <form onSubmit={handleCreatePr} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Incline Dumbbell Press / Flat Bench"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Muscle</label>
                <select
                  value={muscle}
                  onChange={(e) => setMuscle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                >
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Quads">Quads</option>
                  <option value="Legs">Legs</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Arms">Arms</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 30"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Reps / Notation</label>
                  <input
                    type="text"
                    placeholder="e.g. 9 or 9+1"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Clean reps, new dumbbell weight"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
