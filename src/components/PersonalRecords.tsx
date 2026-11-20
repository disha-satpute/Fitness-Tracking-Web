import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Trophy, 
  Plus, 
  MapPin, 
  Award, 
  Filter, 
  CheckCircle2, 
  Info,
  Edit2,
  Trash2,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PersonalRecord } from '../types/fitness';

export const PersonalRecords: React.FC = () => {
  const { prs, addPr, updatePr, deletePr, gyms } = useFitness();

  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingPr, setEditingPr] = useState<PersonalRecord | null>(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // Form states for Add / Edit
  const [exName, setExName] = useState('');
  const [muscle, setMuscle] = useState('Chest');
  const [weightKg, setWeightKg] = useState('');
  const [reps, setReps] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [notes, setNotes] = useState('');

  const muscles = ['All', 'Chest', 'Back', 'Quads', 'Legs', 'Shoulders'];

  const filteredPrs = selectedMuscle === 'All' 
    ? prs 
    : prs.filter(p => p.muscle.toLowerCase().includes(selectedMuscle.toLowerCase()));

  const handleOpenAdd = () => {
    setEditingPr(null);
    setExName('');
    setMuscle('Chest');
    setWeightKg('');
    setReps('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (pr: PersonalRecord) => {
    setEditingPr(pr);
    setExName(pr.exerciseName);
    setMuscle(pr.muscle);
    setWeightKg(pr.rawWeightKg.toString());
    setReps(pr.reps.toString());
    setDate(pr.date || new Date().toISOString().split('T')[0]);
    setNotes(pr.notes);
    setShowAddModal(true);
  };

  const handleSavePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName || !weightKg || !reps) return;

    const parsedWeight = parseFloat(weightKg);
    const newRecordValue = `${weightKg} kg × ${reps}`;

    if (editingPr) {
      // Check if previous performance differs; if so, push into history to track journey
      const existingHistory = editingPr.history ? [...editingPr.history] : [];
      const hasChanged = 
        editingPr.rawWeightKg !== parsedWeight || 
        editingPr.reps.toString() !== reps.toString();

      if (hasChanged) {
        existingHistory.unshift({
          id: `hist-${Date.now()}`,
          date: editingPr.date,
          weightKg: editingPr.rawWeightKg,
          reps: editingPr.reps,
          notes: editingPr.notes || 'Previous record'
        });
      }

      updatePr({
        ...editingPr,
        exerciseName: exName,
        muscle,
        recordValue: newRecordValue,
        rawWeightKg: parsedWeight,
        reps,
        date,
        notes: notes || 'Updated PR',
        history: existingHistory
      });
    } else {
      const defaultGym = gyms[1] || gyms[0];
      addPr({
        exerciseName: exName,
        muscle,
        recordValue: newRecordValue,
        rawWeightKg: parsedWeight,
        reps,
        date,
        gymId: defaultGym ? defaultGym.id : 'gym-main',
        gymName: defaultGym ? defaultGym.name : 'Gym',
        romContext: 'Standard PR',
        isPR: true,
        notes: notes || 'New PR logged',
        history: []
      });
    }

    setShowAddModal(false);
  };

  const toggleHistory = (id: string) => {
    setExpandedHistoryId(prev => (prev === id ? null : id));
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
            Tracking personal bests, progression history, and strength journey
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
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
        {filteredPrs.map((pr) => {
          const hasHistory = Boolean(pr.history && pr.history.length > 0);
          const isHistoryExpanded = expandedHistoryId === pr.id;

          return (
            <div 
              key={pr.id} 
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition duration-200 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    {pr.muscle}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">
                      {pr.date}
                    </span>
                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(pr)}
                      title="Edit this PR"
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mt-1 pr-6">
                  {pr.exerciseName}
                </h3>

                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Current All-Time Record</div>
                    <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
                      {pr.recordValue}
                    </div>
                  </div>
                  {hasHistory && (
                    <button
                      onClick={() => toggleHistory(pr.id)}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] text-indigo-400 font-semibold border border-indigo-900/50 flex items-center gap-1 transition"
                    >
                      <History className="w-3 h-3" />
                      <span>{pr.history!.length} Past PRs</span>
                      {isHistoryExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {/* Past PRs Journey (Collapsible) */}
                {hasHistory && isHistoryExpanded && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-indigo-950 space-y-1.5">
                    <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                      <History className="w-3 h-3" /> Progression Journey
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {pr.history!.map((h) => (
                        <div key={h.id} className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-slate-900 border border-slate-800/60">
                          <div>
                            <span className="font-mono font-bold text-amber-300">{h.weightKg} kg × {h.reps}</span>
                            {h.notes && <span className="text-slate-400 ml-2 text-[10px]">({h.notes})</span>}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{h.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context Badges */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ROM / Form: <strong className="text-slate-200">{pr.romContext}</strong></span>
                  </div>
                  {pr.notes && (
                    <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/50 italic">
                      "{pr.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Lift
                </span>
                <span className="font-mono">{pr.rawWeightKg} kg load</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preservation Principle Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white">Integrity Principle for Personal Records:</div>
          <p className="text-slate-400 leading-relaxed">
            Record milestones with strict form and full range of motion. Track weight, reps, and past progression to monitor true progressive overload over time.
          </p>
        </div>
      </div>

      {/* Add / Edit PR Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              {editingPr ? 'Edit Personal Record' : 'Add Personal Record (PR)'}
            </h3>

            <form onSubmit={handleSavePr} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Exercise Name</label>
                <input
                  type="text"
                  placeholder="e.g. Incline Dumbbell Press / Flat Bench"
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Target Muscle</label>
                  <select
                    value={muscle}
                    onChange={(e) => setMuscle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Quads">Quads</option>
                    <option value="Legs">Legs</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Arms">Arms</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Date Achieved</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              {editingPr && (
                <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-900/50 text-[11px] text-indigo-300">
                  Updating weight or reps will automatically save the previous record into your <strong>Past PRs Journey</strong>!
                </div>
              )}

              <div className="flex gap-2 pt-3">
                {editingPr && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this PR?')) {
                        deletePr(editingPr.id);
                        setShowAddModal(false);
                      }
                    }}
                    className="p-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl"
                    title="Delete PR"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                >
                  {editingPr ? 'Save Changes' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
