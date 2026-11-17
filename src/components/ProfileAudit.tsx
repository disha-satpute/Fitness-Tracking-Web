import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  UserCheck, 
  Target, 
  HelpCircle, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Info,
  Sparkles
} from 'lucide-react';

export const ProfileAudit: React.FC = () => {
  const { profile, updateProfile, calorieProfile, updateCalorieProfile } = useFitness();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [age, setAge] = useState(profile.age.toString());
  const [currentWeight, setCurrentWeight] = useState(profile.currentWeight.toString());
  const [targetWeight, setTargetWeight] = useState(profile.targetWeight ? profile.targetWeight.toString() : '');
  const [gymStartDate, setGymStartDate] = useState('2025-11-17');

  const handleSave = () => {
    updateProfile({
      age: parseInt(age) || 24,
      currentWeight: parseFloat(currentWeight) || 84,
      targetWeight: targetWeight ? parseFloat(targetWeight) : null
    });
    setIsEditing(false);
    alert('User profile updated.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-400" />
            Athlete Identity & Historical Specification Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data integrity status: Confirmed vs Estimated vs Conflicting vs Not Available parameters
          </p>
        </div>

        <button
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition self-start sm:self-center ${
            isEditing 
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isEditing ? <><Check className="w-4 h-4" /> Save Profile</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
        </button>
      </div>

      {/* Profile Parameters Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4">Core Anthropometric & Training Attributes</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 font-mono">
              <tr>
                <th className="pb-3 pl-3">Field</th>
                <th className="pb-3">Value</th>
                <th className="pb-3">Data Status</th>
                <th className="pb-3 pr-3">Specification Context & Rules</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Age</td>
                <td className="py-3 font-mono text-indigo-300">
                  {isEditing ? (
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-white"
                    />
                  ) : `${profile.age} years`}
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    CONFIRMED
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  Confirmed when stated; editable as date of birth / birthday progression was not recorded.
                </td>
              </tr>

              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Gender</td>
                <td className="py-3 font-mono text-slate-200">Male</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    CONFIRMED
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  Explicitly confirmed.
                </td>
              </tr>

              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Height</td>
                <td className="py-3 font-mono text-slate-200">5.9 ft (~180 cm)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    CONFIRMED
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  5.9 ft stated by user; ~180 cm is an inferred metric conversion.
                </td>
              </tr>

              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Current Weight</td>
                <td className="py-3 font-mono text-amber-400 font-bold">
                  {isEditing ? (
                    <input
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-white"
                    />
                  ) : `${profile.currentWeight} kg`}
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                    CONFIRMED
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  Explicit statement: 12 Nov 2026. Preceded by 80 kg low and 82–83 kg in late Oct/early Nov.
                </td>
              </tr>

              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Target Weight</td>
                <td className="py-3 font-mono text-slate-400">
                  {profile.targetWeight ? `${profile.targetWeight} kg` : 'Not Available'}
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                    NOT AVAILABLE
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  No fixed target weight established. Goal is body recomposition and visual definition, not a specific scale number.
                </td>
              </tr>

              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Body-Fat % / Muscle Mass</td>
                <td className="py-3 font-mono text-slate-400">Not Available</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                    NOT AVAILABLE
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  No DEXA scan or hydrostatic test provided. Stored strictly as null (never fabricated as zero).
                </td>
              </tr>

              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Body Type Classification</td>
                <td className="py-3 font-mono text-amber-300">Not Confirmed</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/40">
                    NOT CONFIRMED
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  User inquired about Ecto/Meso/Endomorph; scientifically unvalidated, never permanently assigned.
                </td>
              </tr>

              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Gym Start Date</td>
                <td className="py-3 font-mono text-rose-300">
                  June 2025 vs 17 Nov 2025
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800/40">
                    CONFLICTING
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  Conflicting claims across historical sessions (~9 mos consistent vs June 2025 vs 17 Nov 2025). Stored as historical claims without silent reconciliation.
                </td>
              </tr>

              <tr>
                <td className="py-3 pl-3 font-semibold text-white">Fitness Level</td>
                <td className="py-3 font-mono text-cyan-300">Intermediate (Inferred)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800/40">
                    INFERRED
                  </span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-[11px]">
                  Inferred from regular heavy compound training (250kg leg press, 30kg incline DB, 110kg deadlift, RIR awareness).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Missing Information Onboarding Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          Specification Missing Information Audit Checklist
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          The following parameters were identified in Section 13 of the specification to be collected whenever the athlete wishes to refine tracking:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h3 className="font-bold text-amber-400 mb-2">1. Personal & Biometrics</h3>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Exact Date of Birth (for auto age updates)</li>
              <li>• Official confirmed gym start date</li>
              <li>• Optional target weight if desired</li>
              <li>• Target body fat percentage (if formal goal exists)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h3 className="font-bold text-indigo-400 mb-2">2. Body Circumferences</h3>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Waist & hip circumference (side handles tracking)</li>
              <li>• Chest circumference at full expansion</li>
              <li>• Shoulder width & circumference</li>
              <li>• Arm & forearm tape measurements (L/R)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-2">3. Nutrition & Laboratory</h3>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Confirmed current brand nutrition labels</li>
              <li>• Follow-up Vitamin B12 lab test values</li>
              <li>• Daily carbohydrate & healthy fat thresholds</li>
              <li>• Exact cooked vs raw soybean ratio adjustments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
