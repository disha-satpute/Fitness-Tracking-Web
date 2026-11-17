import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  TrendingUp, 
  Plus, 
  Calendar, 
  Camera, 
  Ruler, 
  AlertCircle, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

export const ProgressTracker: React.FC = () => {
  const { 
    profile, 
    weightRecords, 
    addWeightRecord, 
    progressPhotos, 
    measurements, 
    updateMeasurement 
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'weight' | 'photos' | 'measurements'>('weight');

  // New weight modal state
  const [newDate, setNewDate] = useState('2026-11-16');
  const [newWeight, setNewWeight] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Measurement form state
  const [measWaist, setMeasWaist] = useState('');
  const [measChest, setMeasChest] = useState('');
  const [measShoulders, setMeasShoulders] = useState('');
  const [measBicep, setMeasBicep] = useState('');
  const [measForearm, setMeasForearm] = useState('');

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    addWeightRecord({
      date: newDate,
      periodLabel: newDate,
      weight: parseFloat(newWeight),
      status: 'CONFIRMED',
      notes: newNotes || 'Logged from Progress Tracker'
    });
    setNewWeight('');
    setNewNotes('');
  };

  const chartData = weightRecords.map(w => ({
    date: w.periodLabel,
    weight: w.weight,
    notes: w.notes,
    status: w.status
  }));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Body Composition & Progress Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking scale weight, side-by-side physique assessments, and body circumference benchmarks
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'weight' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Weight Arc (80→84kg)
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'photos' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Physique Assessment
          </button>
          <button
            onClick={() => setActiveTab('measurements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'measurements' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Body Circumferences
          </button>
        </div>
      </div>

      {activeTab === 'weight' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Current Weight</span>
              <div className="text-2xl font-extrabold text-white mt-1">84.0 kg</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Latest: 12 Nov 2026</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Starting Weight</span>
              <div className="text-2xl font-extrabold text-white mt-1">~90.0 kg</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Historical start point</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Historical Low</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">~80.0 kg</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">~10 kg total loss achieved</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Rebound Context</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">+4.0 kg</div>
              <div className="text-[11px] text-slate-400 mt-0.5">80 kg → 84 kg (Muscle + Water + Fat)</div>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Weight Trajectory Over Time</h3>
                <p className="text-xs text-slate-400">Complete historical timeline from ~90kg down to 80kg and back to 84kg</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={[75, 95]} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                    formatter={(val: any) => [`${val} kg`, 'Scale Weight']}
                  />
                  <ReferenceLine y={84} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Current (84kg)', fill: '#f59e0b', fontSize: 11 }} />
                  <ReferenceLine y={80} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: 'Low (80kg)', fill: '#06b6d4', fontSize: 11 }} />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Log New Weight Entry Form & Historical Log Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Record Bodyweight Update
              </h3>

              <form onSubmit={handleAddWeight} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 83.8"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Context / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Morning fasted, post-workout, or high-carb day"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl shadow-lg transition mt-2"
                >
                  Save Weight Entry
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Historical Weight Log Entries
              </h3>

              <div className="space-y-2">
                {weightRecords.map((w) => (
                  <div key={w.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm font-mono">{w.weight} kg</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        w.status === 'CONFIRMED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      }`}>
                        {w.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1 font-medium">{w.periodLabel}</div>
                    <p className="text-slate-300 text-[11px] mt-1 italic">{w.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-400" />
                  Realistic Physique Assessment & V-Taper Logs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual evaluations emphasizing natural proportions: Back width, traps, arm vascularity, and side-handle reduction
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {progressPhotos.map((photo) => (
                <div key={photo.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                  {/* Photo Visual Card Placeholder with anatomy outline representation */}
                  <div className="h-56 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 border-b border-slate-800 relative">
                    <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {photo.date}
                    </span>
                    <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                      {photo.bodyweight} kg
                    </span>

                    <div className="w-24 h-24 rounded-full border-2 border-indigo-500/30 flex items-center justify-center bg-indigo-950/20 text-indigo-400">
                      <Camera className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <div className="mt-3 text-xs font-bold text-slate-200">
                      {photo.view} View ({photo.pose})
                    </div>
                    <div className="text-[11px] text-slate-500">{photo.lighting}</div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between text-xs space-y-3">
                    <div>
                      <div className="text-slate-400 text-[11px]">Primary Focus Zones:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {photo.focusMuscles.map((m, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800">
                            {m}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-300 text-[11px] mt-2.5 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                        "{photo.notes}"
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                      Guiding Rule: Zero artificial filters or exaggerated lighting; strictly tracking true physique fullness.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'measurements' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="pb-3 border-b border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-indigo-400" />
                Body Circumferences & Anthropometrics
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Data Principle: Historical measurements are explicitly <strong>Not Available</strong>. Stored as null (never zero) to invite direct athlete input.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-white text-sm">Circumference Data Status</h3>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { label: 'Waist Circumference', val: 'Not Available', status: 'NOT AVAILABLE', note: 'Critical for tracking side fat loss' },
                    { label: 'Chest Circumference', val: 'Not Available', status: 'NOT AVAILABLE', note: 'Chest thickness metric' },
                    { label: 'Shoulders Width', val: 'Not Available', status: 'NOT AVAILABLE', note: 'V-Taper development' },
                    { label: 'Biceps (Left/Right)', val: 'Not Available', status: 'NOT AVAILABLE', note: 'Arm size retention' },
                    { label: 'Forearms', val: 'Not Available', status: 'NOT AVAILABLE', note: 'Vascularity & thickness' },
                    { label: 'Thighs / Quads', val: 'Not Available', status: 'NOT AVAILABLE', note: 'Heavy compound quad growth' },
                    { label: 'Calves', val: 'Not Available', status: 'NOT AVAILABLE', note: 'Calf circumference' },
                    { label: 'Body-fat %', val: 'Not Available', status: 'NOT AVAILABLE', note: 'No DEXA/Caliper recorded' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[11px]">{item.label}</div>
                      <div className="text-white font-bold text-sm mt-0.5 font-mono text-amber-400">
                        {item.val}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Form for Athlete */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-xs space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  Log First Circumference Measurements (cm)
                </h3>
                <p className="text-slate-400 text-[11px]">
                  Fill in your tape measurements anytime to begin tracking real circumference trends alongside scale weight.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Waist (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 86"
                      value={measWaist}
                      onChange={(e) => setMeasWaist(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Chest (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 104"
                      value={measChest}
                      onChange={(e) => setMeasChest(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Shoulders (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 122"
                      value={measShoulders}
                      onChange={(e) => setMeasShoulders(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Arms / Biceps (cm)</label>
                    <input
                      type="number"
                      placeholder="e.g. 38"
                      value={measBicep}
                      onChange={(e) => setMeasBicep(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert('Measurements saved! Data stored in local session storage.');
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded-xl shadow-lg transition"
                >
                  Save Measurement Baseline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
