import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  TrendingUp, 
  Plus, 
  Calendar, 
  Trophy
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
  const { weightRecords, addWeightRecord, prs } = useFitness();

  const [activeTab, setActiveTab] = useState<'weight' | 'prs'>('weight');

  // Form states
  const [newDate, setNewDate] = useState('2026-11-20');
  const [newWeight, setNewWeight] = useState('');

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    addWeightRecord({
      date: newDate,
      periodLabel: newDate,
      weight: parseFloat(newWeight),
      status: 'CONFIRMED',
      notes: 'Logged update'
    });
    setNewWeight('');
  };

  const chartData = weightRecords.map(w => ({
    date: w.periodLabel,
    weight: w.weight
  }));

  return (
    <div className="space-y-4 pb-8">
      {/* Header Tabs: Weight vs PRs */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
        <h1 className="text-lg font-bold text-white flex items-center gap-1.5 px-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Progress & Records
        </h1>

        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              activeTab === 'weight' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Scale Weight
          </button>
          <button
            onClick={() => setActiveTab('prs')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              activeTab === 'prs' ? 'bg-amber-600 text-white' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-3 h-3" /> Hall of PRs
          </button>
        </div>
      </div>

      {activeTab === 'weight' && (
        <div className="space-y-4">
          {/* Weight Card with Clean Line Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Current: <strong className="text-white text-base">84.0 kg</strong></span>
              <span className="text-xs font-mono text-emerald-400">Low: 80.0 kg | Start: 90 kg</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 9 }} />
                  <YAxis domain={[78, 92]} stroke="#64748b" tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val} kg`, 'Weight']}
                  />
                  <ReferenceLine y={84} stroke="#f59e0b" strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Log Weight Inline Form */}
          <form onSubmit={handleAddWeight} className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              required
            />
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 83.5"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
              required
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-xs rounded-xl"
            >
              Save Weight
            </button>
          </form>

          {/* Clean History List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1.5">
            <span className="text-xs font-bold text-white block mb-1">Recent Weight Entries</span>
            {weightRecords.slice(-4).reverse().map((w) => (
              <div key={w.id} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 text-xs">
                <span className="text-slate-400">{w.periodLabel}</span>
                <span className="font-bold text-white font-mono">{w.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'prs' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {prs.map((pr) => (
              <div key={pr.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-medium">
                    {pr.muscle}
                  </span>
                  <div className="font-bold text-white text-sm mt-1">{pr.exerciseName}</div>
                  <div className="text-[11px] text-slate-400">{pr.romContext}</div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-amber-400 font-mono text-base">{pr.recordValue}</div>
                  <div className="text-[10px] text-slate-500">{pr.gymName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
