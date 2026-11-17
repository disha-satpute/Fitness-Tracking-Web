import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { AFFORDABLE_PROTEIN_PILLARS } from '../data/historicalData';
import { 
  Flame, 
  Target, 
  Droplets, 
  Plus, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Calendar,
  Utensils,
  Sparkles
} from 'lucide-react';
import { FoodItem } from '../types/fitness';

export const NutritionTracker: React.FC = () => {
  const { calorieProfile, updateCalorieProfile, nutritionLogs, addFoodLog } = useFitness();

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'daily' | 'budget' | 'estimates'>('daily');

  // New item modal/form states
  const [newMeal, setNewMeal] = useState<'Breakfast' | 'Lunch' | 'Post-Workout' | 'Dinner'>('Post-Workout');
  const [foodName, setFoodName] = useState('');
  const [foodQty, setFoodQty] = useState('');
  const [foodUnit, setFoodUnit] = useState('g');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodRawCooked, setFoodRawCooked] = useState<'raw' | 'cooked' | 'na'>('cooked');

  const currentDay = nutritionLogs[selectedDayIndex] || nutritionLogs[0];

  // Calculate totals
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (currentDay) {
    currentDay.meals.forEach(m => {
      m.items.forEach(i => {
        totalCalories += i.calories || 0;
        totalProtein += i.protein || 0;
        totalCarbs += i.carbs || 0;
        totalFat += i.fat || 0;
      });
    });
  }

  const handleQuickAddAffordable = (pillar: typeof AFFORDABLE_PROTEIN_PILLARS[0]) => {
    let newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: pillar.food,
      quantity: 100,
      unit: 'g',
      calories: 180,
      protein: 20,
      carbs: 10,
      fat: 5,
      rawOrCooked: 'raw',
      affordablePillar: true
    };

    if (pillar.food.includes('Soybean')) {
      newItem.calories = 215;
      newItem.protein = 18;
      newItem.carbs = 15;
      newItem.fat = 9.5;
      newItem.quantity = 49;
    } else if (pillar.food.includes('Eggs')) {
      newItem.calories = 210;
      newItem.protein = 18;
      newItem.carbs = 1.2;
      newItem.fat = 14;
      newItem.quantity = 3;
      newItem.unit = 'eggs';
      newItem.rawOrCooked = 'cooked';
    } else if (pillar.food.includes('Milk')) {
      newItem.calories = 195;
      newItem.protein = 10;
      newItem.carbs = 15;
      newItem.fat = 10;
      newItem.quantity = 315;
      newItem.unit = 'ml';
      newItem.rawOrCooked = 'na';
    }

    addFoodLog(currentDay.date, 'Dinner', newItem);
  };

  const handleAddManualFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !foodCalories || !foodProtein) return;

    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: foodName,
      quantity: parseFloat(foodQty) || 1,
      unit: foodUnit,
      calories: parseFloat(foodCalories) || 0,
      protein: parseFloat(foodProtein) || 0,
      carbs: 0,
      fat: 0,
      rawOrCooked: foodRawCooked
    };

    addFoodLog(currentDay.date, newMeal, newItem);
    setFoodName('');
    setFoodQty('');
    setFoodCalories('');
    setFoodProtein('');
  };

  const proteinRemaining = Math.max(0, calorieProfile.proteinTargetMin - totalProtein);
  const caloriesRemaining = Math.max(0, calorieProfile.cuttingTarget - totalCalories);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            Nutrition & Protein Command
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking cutting deficit (1,940 kcal), protein target (130–150g), budget pillars & historical days
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'daily' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Log
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'budget' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Affordable Protein Stack
          </button>
          <button
            onClick={() => setActiveTab('estimates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'estimates' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Energy & BMR Models
          </button>
        </div>
      </div>

      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Day Selector & Historical Notes */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-4 h-4 text-indigo-400" /> Logged Days:
              </span>
              {nutritionLogs.map((day, idx) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                    selectedDayIndex === idx
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {day.date}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              Status: {currentDay.estimatedStatus || 'CONFIRMED'}
            </span>
          </div>

          {/* Today's Adherence Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Calories Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" /> Calorie Consumption
                </span>
                <span className="text-xs font-mono text-amber-400">
                  {caloriesRemaining > 0 ? `${caloriesRemaining} kcal left` : 'Target reached'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{totalCalories}</span>
                <span className="text-slate-400 text-sm">/ {calorieProfile.cuttingTarget} kcal</span>
              </div>
              <div className="mt-3">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalCalories / calorieProfile.cuttingTarget) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>Target: 1,940 kcal</span>
                  <span>{Math.round((totalCalories / calorieProfile.cuttingTarget) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Protein Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-cyan-400" /> Protein Adherence
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {proteinRemaining > 0 ? `${Math.round(proteinRemaining)}g remaining` : 'Target crushed!'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{Math.round(totalProtein)}</span>
                <span className="text-slate-400 text-sm">/ {calorieProfile.proteinTargetMin}–{calorieProfile.proteinTargetMax} g</span>
              </div>
              <div className="mt-3">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalProtein / calorieProfile.proteinTargetMin) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>Target: ~130–150g</span>
                  <span>{Math.round((totalProtein / calorieProfile.proteinTargetMin) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Water Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-400" /> Daily Hydration
                </span>
                <span className="text-xs font-mono text-blue-400">3–4 L / day</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">{currentDay.waterIntakeL}</span>
                <span className="text-slate-400 text-sm">/ {currentDay.waterTargetL} L</span>
              </div>
              <div className="mt-3">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (currentDay.waterIntakeL / currentDay.waterTargetL) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>Target: 3.5 Liters</span>
                  <span>{Math.round((currentDay.waterIntakeL / currentDay.waterTargetL) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          {currentDay.notes && (
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Historical Log Notes ({currentDay.date}):</strong> {currentDay.notes}
              </div>
            </div>
          )}

          {/* Meals Breakdown & Quick Add Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Meals Logged (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {currentDay.meals.map((meal, mIdx) => {
                const mealCals = meal.items.reduce((s, i) => s + (i.calories || 0), 0);
                const mealProt = meal.items.reduce((s, i) => s + (i.protein || 0), 0);

                return (
                  <div key={mIdx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-white text-base">{meal.mealName}</h3>
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        <span className="text-white font-bold">{mealCals} kcal</span> • <span className="text-cyan-400 font-bold">{Math.round(mealProt)}g protein</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {meal.items.map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              {item.name}
                              {item.brand && (
                                <span className="text-[10px] text-slate-400">({item.brand})</span>
                              )}
                              {item.affordablePillar && (
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/40">
                                  Affordable Staple
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {item.quantity} {item.unit} • {item.rawOrCooked !== 'na' ? `${item.rawOrCooked}` : ''}
                            </div>
                          </div>

                          <div className="text-right font-mono">
                            <div className="font-bold text-slate-200">{item.calories} kcal</div>
                            <div className="text-cyan-400 text-[11px]">{item.protein}g protein</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Food Item & Budget Staple inserter (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
                <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  Log Food Entry
                </h3>

                <form onSubmit={handleAddManualFood} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Target Meal</label>
                    <select
                      value={newMeal}
                      onChange={(e) => setNewMeal(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Post-Workout">Post-Workout</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Food Name & Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. Saffola Oats / Raw Soybean"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Quantity</label>
                      <input
                        type="number"
                        placeholder="50"
                        value={foodQty}
                        onChange={(e) => setFoodQty(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Unit</label>
                      <select
                        value={foodUnit}
                        onChange={(e) => setFoodUnit(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                      >
                        <option value="g">grams (g)</option>
                        <option value="ml">ml</option>
                        <option value="scoop">scoop</option>
                        <option value="eggs">eggs</option>
                        <option value="rotis">rotis</option>
                        <option value="plate">plate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Calories</label>
                      <input
                        type="number"
                        placeholder="kcal"
                        value={foodCalories}
                        onChange={(e) => setFoodCalories(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Protein (g)</label>
                      <input
                        type="number"
                        placeholder="grams"
                        value={foodProtein}
                        onChange={(e) => setFoodProtein(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Raw vs Cooked</label>
                    <select
                      value={foodRawCooked}
                      onChange={(e) => setFoodRawCooked(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      <option value="cooked">Cooked</option>
                      <option value="raw">Raw (e.g. 49g raw soybean)</option>
                      <option value="na">Not applicable</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-amber-600 hover:bg-amber-500 font-bold text-white rounded-xl shadow-lg transition mt-2"
                  >
                    Add Food to Log
                  </button>
                </form>
              </div>

              {/* 1-Click Add Affordable Staples */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
                <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  Quick-Log Budget Staples
                </h3>
                <p className="text-[11px] text-slate-400 mb-3">
                  Click to insert user's core affordable protein staples directly into dinner/post-workout:
                </p>

                <div className="space-y-2 text-xs">
                  {AFFORDABLE_PROTEIN_PILLARS.slice(0, 4).map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAddAffordable(p)}
                      className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{p.food}</div>
                        <div className="text-[10px] text-slate-400">{p.proteinPer100g}</div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        {p.costPer100g}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  Affordable Protein Nutrition Architecture
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Designed around the user's explicit cost constraints: Whey capped at 1 scoop/day, high reliance on soybean and milk
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="pb-3 pl-3">Food Staple</th>
                    <th className="pb-3">Estimated Cost</th>
                    <th className="pb-3">Protein Yield</th>
                    <th className="pb-3">Affordability Tier</th>
                    <th className="pb-3 pr-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {AFFORDABLE_PROTEIN_PILLARS.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/60 transition">
                      <td className="py-3 pl-3 font-semibold text-white">
                        {p.food}
                      </td>
                      <td className="py-3 font-mono text-emerald-400">
                        {p.costPer100g}
                      </td>
                      <td className="py-3 font-mono text-cyan-400">
                        {p.proteinPer100g}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {p.affordability}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-right">
                        <button
                          onClick={() => handleQuickAddAffordable(p)}
                          className="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition text-xs font-semibold"
                        >
                          Quick Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Historical Budget Rule:
              </div>
              <p>
                The user stated they cannot comfortably afford high-protein oats + peanut butter + whey twice every day. 
                The system intentionally maintains a 1x daily cap for whey (~₹70/serving) and prioritizes raw soybeans (₹10 for ~18g protein) 
                and whole cow milk (₹15 for ~18g protein) to hit 130–150g protein reliably under budget.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'estimates' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Conflicting Calorie & Energy Expenditure Models
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Data Principle: Do not hard-code or silently reconcile conflicting energy values. Display user statement vs app estimates vs plausible physiology side-by-side.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40">
                <div className="text-xs text-amber-400 font-bold uppercase">Cutting Target (Active)</div>
                <div className="text-2xl font-extrabold text-white mt-1 font-mono">1,940 kcal</div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Source: <strong>User Explicit Target</strong>. Consistently used as daily cutting benchmark.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-indigo-400 font-bold uppercase">User-Stated Maintenance</div>
                <div className="text-2xl font-extrabold text-white mt-1 font-mono">~2,200 kcal</div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Source: <strong>User Stated</strong>. Believed maintenance before app discrepancy.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/50">
                <div className="text-xs text-rose-400 font-bold uppercase">3rd-Party App Estimate</div>
                <div className="text-2xl font-extrabold text-white mt-1 font-mono">~3,000 kcal</div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Source: <strong>External Tracker</strong> (Claimed BMR 2,852 kcal; questioned by user as inflated).
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/50">
                <div className="text-xs text-emerald-400 font-bold uppercase">Plausible Calculated BMR</div>
                <div className="text-2xl font-extrabold text-white mt-1 font-mono">~1,840 kcal</div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Source: <strong>Physiological Formula</strong> (Mifflin-St Jeor for 84kg, 180cm, 24yo male).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
