import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  HeartPulse, 
  Moon, 
  Pill, 
  Activity, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

export const RecoveryTracker: React.FC = () => {
  const { supplements, recoveryLogs, addRecoveryLog } = useFitness();

  const [activeTab, setActiveTab] = useState<'recovery' | 'supplements'>('recovery');

  // New recovery entry form
  const [sleepHours, setSleepHours] = useState('6.5');
  const [sleepQuality, setSleepQuality] = useState<'Poor' | 'Fair' | 'Good' | 'Excellent'>('Fair');
  const [soreness, setSoreness] = useState('5');
  const [energy, setEnergy] = useState('8');
  const [readiness, setReadiness] = useState('7');
  const [notes, setNotes] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    addRecoveryLog({
      date: '2026-11-16',
      sleepHours: parseFloat(sleepHours) || 6.5,
      sleepQuality,
      soreness: parseInt(soreness) || 5,
      fatigue: 5,
      energy: parseInt(energy) || 8,
      readiness: parseInt(readiness) || 7,
      restDay: false,
      sleepNotes: notes || 'Practical 6-7 hours sleep logged'
    });
    setNotes('');
    alert('Recovery session logged!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-purple-400" />
            Recovery, Sleep & Supplement Stack
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking practical sleep windows (6–7.5 hrs), muscle soreness, training readiness, and active supplements
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'recovery' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sleep & Readiness
          </button>
          <button
            onClick={() => setActiveTab('supplements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'supplements' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Supplement Protocol
          </button>
        </div>
      </div>

      {activeTab === 'recovery' && (
        <div className="space-y-6">
          {/* Sleep Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Historical Average</span>
              <div className="text-2xl font-extrabold text-white mt-1">6.5–7.5 hrs</div>
              <div className="text-[11px] text-purple-300 mt-0.5">Frequent practical sleep window</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Practical Constraint</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">~6.0 hrs</div>
              <div className="text-[11px] text-slate-400 mt-0.5">User acknowledged 7 hrs not always achievable</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Historical Lows</span>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">~3 hrs</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Occasional 2-night stress period logged</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Readiness Benchmark</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">100% on 26 Oct</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Felt peak energy during Back & Biceps</div>
            </div>
          </div>

          {/* Form & Historical Recovery List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Log Daily Recovery & Soreness
              </h3>

              <form onSubmit={handleAddLog} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Sleep Duration (hrs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Sleep Quality</label>
                    <select
                      value={sleepQuality}
                      onChange={(e) => setSleepQuality(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      <option value="Poor">Poor</option>
                      <option value="Fair">Fair</option>
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Soreness (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={soreness}
                      onChange={(e) => setSoreness(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Energy (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={energy}
                      onChange={(e) => setEnergy(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Readiness (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={readiness}
                      onChange={(e) => setReadiness(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Recovery & Sleep Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Woke up at 2am, back asleep in 5 mins. Hamstring soreness improving."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 font-bold text-white rounded-xl shadow-lg transition mt-2"
                >
                  Save Recovery Status
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Historical Recovery Observations
              </h3>

              <div className="space-y-3">
                {recoveryLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> {log.date}
                      </span>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono text-[10px]">
                          Sleep: {log.sleepHours}h ({log.sleepQuality})
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px]">
                          Readiness: {log.readiness}/10
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-slate-300 text-[11px] space-y-1">
                      {log.sleepNotes && <p><strong>Sleep:</strong> {log.sleepNotes}</p>}
                      {log.sorenessNotes && <p className="text-amber-300/90"><strong>Soreness/Readiness:</strong> {log.sorenessNotes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'supplements' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="pb-3 border-b border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-indigo-400" />
                Historical & Active Supplement Stack
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact products, dosages, brand contexts, and medical distinctions recorded from user profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplements.map((supp) => (
                <div key={supp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        supp.status === 'Daily Active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : supp.status === 'Medical/Doctor Advised'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      }`}>
                        {supp.status}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{supp.time}</span>
                    </div>

                    <h3 className="font-bold text-white text-base mt-1">{supp.name}</h3>
                    <div className="text-slate-400 text-xs mt-0.5">Brand: <strong className="text-slate-200">{supp.brand}</strong></div>

                    <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-amber-400">
                      Dose: {supp.dose} • {supp.frequency}
                    </div>

                    <p className="text-slate-300 text-[11px] mt-2.5 leading-relaxed bg-slate-900/40 p-2 rounded border border-slate-800/40 italic">
                      "{supp.notes}"
                    </p>
                  </div>

                  {supp.status === 'Medical/Doctor Advised' && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-blue-300 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Medical integrity: Preserved as clinical guidance, not algorithmic fitness advice.
                    </div>
                  )}

                  {supp.status === 'Historical/Pre-workout' && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-amber-400/90 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Stored as historical user event without automatic medical diagnosis.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
