import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { AFFORDABLE_PROTEIN_PILLARS } from '../data/historicalData';
import { 
  Flame, 
  Target, 
  Droplets, 
  Plus, 
  Wallet, 
  Calendar, 
  Utensils, 
  Sparkles,
  Camera,
  Bot,
  Check,
  ArrowRight,
  Info
} from 'lucide-react';
import { FoodItem } from '../types/fitness';
import { getSmartBudgetMealSuggestions, parseQuickIndianMeal } from '../utils/aiAdvisor';

export const NutritionTracker: React.FC = () => {
  const { calorieProfile, nutritionLogs, addFoodLog } = useFitness();

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'daily' | 'ai-optimizer' | 'budget' | 'estimates'>('daily');

  // Manual food form state
  const [newMeal, setNewMeal] = useState<'Breakfast' | 'Lunch' | 'Post-Workout' | 'Dinner'>('Post-Workout');
  const [foodName, setFoodName] = useState('');
  const [foodQty, setFoodQty] = useState('');
  const [foodUnit, setFoodUnit] = useState('g');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodRawCooked, setFoodRawCooked] = useState<'raw' | 'cooked' | 'na'>('cooked');

  // AI Meal / Photo Scan simulator state
  const [aiMealPrompt, setAiMealPrompt] = useState('');
  const [aiDetectedMeal, setAiDetectedMeal] = useState<any>(null);
  const [isAiScanning, setIsAiScanning] = useState(false);

  const currentDay = nutritionLogs[selectedDayIndex] || nutritionLogs[0];

  // Calculate totals
  let totalCalories = 0;
  let totalProtein = 0;

  if (currentDay) {
    currentDay.meals.forEach(m => {
      m.items.forEach(i => {
        totalCalories += i.calories || 0;
        totalProtein += i.protein || 0;
      });
    });
  }

  const proteinRemaining = Math.max(0, calorieProfile.proteinTargetMin - totalProtein);
  const caloriesRemaining = Math.max(0, calorieProfile.cuttingTarget - totalCalories);

  // AI Meal suggestions based on remaining protein
  const aiBudgetSuggestions = getSmartBudgetMealSuggestions(
    proteinRemaining > 0 ? proteinRemaining : 25,
    caloriesRemaining > 0 ? caloriesRemaining : 400
  );

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

  const handleScanAiMeal = (sampleText?: string) => {
    const textToScan = sampleText || aiMealPrompt;
    if (!textToScan.trim()) return;

    setIsAiScanning(true);
    setTimeout(() => {
      const parsed = parseQuickIndianMeal(textToScan);
      setAiDetectedMeal(parsed);
      setIsAiScanning(false);
    }, 450);
  };

  const handleApplyAiMealToLog = () => {
    if (!aiDetectedMeal) return;

    const newItem: FoodItem = {
      id: `food-ai-${Date.now()}`,
      name: aiDetectedMeal.name,
      quantity: 1,
      unit: 'serving',
      calories: aiDetectedMeal.calories,
      protein: aiDetectedMeal.protein,
      carbs: aiDetectedMeal.carbs,
      fat: aiDetectedMeal.fat,
      rawOrCooked: 'cooked',
      notes: 'AI Indian Meal Macro Parser'
    };

    addFoodLog(currentDay.date, 'Dinner', newItem);
    setAiDetectedMeal(null);
    setAiMealPrompt('');
    setActiveTab('daily');
  };

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
            Tracking cutting deficit (1,940 kcal), protein target (130–150g), budget pillars & AI optimizations
          </p>
        </div>

        {/* Navigation Sub-Tabs */}
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
            onClick={() => setActiveTab('ai-optimizer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'ai-optimizer' 
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-sm' 
                : 'text-amber-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Budget & Macro Optimizer
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'budget' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Affordable Pillars
          </button>
          <button
            onClick={() => setActiveTab('estimates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'estimates' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            BMR Models
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

          {/* AI Optimizer shortcut banner */}
          <div 
            onClick={() => setActiveTab('ai-optimizer')}
            className="cursor-pointer p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-slate-900 border border-amber-500/30 flex items-center justify-between hover:border-amber-400 transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Bot className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  AI Macro & Budget Optimizer Available
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-extrabold">NEW</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  {proteinRemaining > 0 
                    ? `Need ${Math.round(proteinRemaining)}g protein? AI calculated 3 budget combos under ₹30 without whey.` 
                    : 'Analyze Indian meals or estimate macros from photo text.'}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
              Open <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

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

            {/* Quick Add Food Item (4 cols) */}
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

      {/* AI Budget & Macro Optimizer Tab */}
      {activeTab === 'ai-optimizer' && (
        <div className="space-y-6">
          {/* Top AI Status Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-slate-900 border border-amber-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" /> AI Nutrition Intelligence
                </span>
                <h2 className="text-xl font-bold text-white mt-1">Budget Macro & Indian Meal Scanner</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Solves your remaining protein deficit without exceeding your ₹30–40 budget, respecting the 1 scoop/day whey cap.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Current Deficit</div>
                <div className="text-lg font-bold font-mono text-cyan-400">
                  {proteinRemaining > 0 ? `${Math.round(proteinRemaining)}g protein left` : 'Protein Hit!'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Instant Budget Combos under ₹30-40 */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                AI Suggested Budget Protein Combos (Under ₹35)
              </h3>

              <div className="space-y-3">
                {aiBudgetSuggestions.map((sug) => (
                  <div 
                    key={sug.id} 
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{sug.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold font-mono text-xs border border-emerald-800/40">
                        {sug.estimatedCost}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                      {sug.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="text-slate-400 font-mono">
                        Yield: <strong className="text-cyan-400 font-bold">{sug.proteinYield}g protein</strong> • <strong className="text-amber-400">{sug.calories} kcal</strong>
                      </div>

                      <button
                        onClick={() => {
                          const newItem: FoodItem = {
                            id: `food-ai-${Date.now()}`,
                            name: sug.title,
                            quantity: 1,
                            unit: 'combo',
                            calories: sug.calories,
                            protein: sug.proteinYield,
                            carbs: 20,
                            fat: 10,
                            rawOrCooked: 'cooked',
                            affordablePillar: true
                          };
                          addFoodLog(currentDay.date, 'Dinner', newItem);
                          alert('Added AI combo to Dinner!');
                          setActiveTab('daily');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                      >
                        Log to Dinner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Quick Photo Scan / Natural Language Meal Parser */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">Quick Scan Indian Meal</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Type what you ate or what is visible on your plate (e.g. <em>"2 rotis + palak paneer + 1 bowl curd"</em>). AI parses calories & protein in 1 tap.
                </p>

                <div className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder="e.g. 2 chapatis + soybean curry + 1 cup dahi"
                    value={aiMealPrompt}
                    onChange={(e) => setAiMealPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />

                  {/* Sample presets for quick testing */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="text-slate-500 self-center">Try:</span>
                    <button 
                      onClick={() => {
                        setAiMealPrompt('2 rotis + palak paneer + 1 bowl curd');
                        handleScanAiMeal('2 rotis + palak paneer + 1 bowl curd');
                      }}
                      className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    >
                      2 rotis + paneer + curd
                    </button>
                    <button 
                      onClick={() => {
                        setAiMealPrompt('49g soybean + 2 rotis + 3 boiled eggs');
                        handleScanAiMeal('49g soybean + 2 rotis + 3 boiled eggs');
                      }}
                      className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    >
                      Soybean + eggs
                    </button>
                  </div>

                  <button
                    onClick={() => handleScanAiMeal()}
                    disabled={isAiScanning || !aiMealPrompt}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                  >
                    {isAiScanning ? 'AI Analyzing Indian Nutrition...' : 'Parse Indian Meal Macros ✨'}
                  </button>
                </div>

                {/* Parsed Meal Result */}
                {aiDetectedMeal && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-white">AI Meal Analysis Result</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">PARSED</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono">
                        <div className="text-[10px] text-slate-400">Calories</div>
                        <div className="text-base font-bold text-amber-400">{aiDetectedMeal.calories} kcal</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono">
                        <div className="text-[10px] text-slate-400">Protein</div>
                        <div className="text-base font-bold text-cyan-400">{aiDetectedMeal.protein}g P</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1">
                      {aiDetectedMeal.recognizedItems.map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5 text-slate-400">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleApplyAiMealToLog}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
                    >
                      Confirm & Add to Today's Food Log
                    </button>
                  </div>
                )}
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
