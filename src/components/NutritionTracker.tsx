import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { AFFORDABLE_PROTEIN_PILLARS } from '../data/historicalData';
import { 
  Flame, 
  ChevronLeft,
  ChevronRight,
  Calendar, 
  Sparkles,
  Camera,
  Trash2
} from 'lucide-react';
import { FoodItem } from '../types/fitness';
import { parseQuickIndianMeal } from '../utils/aiAdvisor';
import { getFormattedDate, getISODate } from '../utils/dateUtils';

export const NutritionTracker: React.FC = () => {
  const { calorieProfile, nutritionLogs, addFoodLog, selectedDate, setSelectedDate } = useFitness();

  const [activeTab, setActiveTab] = useState<'daily' | 'ai-scanner'>('daily');

  // Manual food form state
  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');

  // AI Meal parser state
  const [aiMealPrompt, setAiMealPrompt] = useState('');
  const [aiDetectedMeal, setAiDetectedMeal] = useState<any>(null);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [targetMealSlot, setTargetMealSlot] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Post-Workout' | 'Snacks'>('Lunch');

  // Day-wise Navigation
  const handleShiftDay = (delta: number) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + delta);
    setSelectedDate(getISODate(d));
  };

  const isToday = selectedDate === getISODate(new Date());

  // Find the exact log for the selected calendar day
  const currentDay = nutritionLogs.find(l => l.date === selectedDate) || {
    id: `nutr-${selectedDate}`,
    date: selectedDate,
    targetCalories: calorieProfile.cuttingTarget,
    targetProtein: calorieProfile.proteinTargetMin,
    waterIntakeL: 2.5,
    waterTargetL: 3.5,
    meals: []
  };

  // Calculate day-specific totals
  let totalCalories = 0;
  let totalProtein = 0;

  currentDay.meals.forEach(m => {
    m.items.forEach(i => {
      totalCalories += i.calories || 0;
      totalProtein += i.protein || 0;
    });
  });

  const proteinRemaining = Math.max(0, calorieProfile.proteinTargetMin - totalProtein);
  const caloriesRemaining = Math.max(0, calorieProfile.cuttingTarget - totalCalories);

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

    addFoodLog(selectedDate, 'Dinner', newItem);
  };

  const handleAddManualFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !foodCalories || !foodProtein) return;

    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: foodName,
      quantity: 1,
      unit: 'serving',
      calories: parseFloat(foodCalories) || 0,
      protein: parseFloat(foodProtein) || 0,
      carbs: 0,
      fat: 0,
      rawOrCooked: 'cooked'
    };

    addFoodLog(selectedDate, 'Dinner', newItem);
    setFoodName('');
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
    }, 350);
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
      rawOrCooked: 'cooked'
    };

    addFoodLog(selectedDate, targetMealSlot, newItem);
    setAiDetectedMeal(null);
    setAiMealPrompt('');
    setActiveTab('daily');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Day-Wise Real Calendar Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleShiftDay(-1)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl text-xs font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{getFormattedDate(new Date(selectedDate + 'T12:00:00'))}</span>
            {isToday && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                TODAY
              </span>
            )}
          </div>
          <button
            onClick={() => handleShiftDay(1)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'daily' ? 'bg-amber-600 text-white' : 'text-slate-400'
            }`}
          >
            Day's Diet
          </button>
          <button
            onClick={() => setActiveTab('ai-scanner')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              activeTab === 'ai-scanner' ? 'bg-indigo-600 text-white' : 'text-amber-400'
            }`}
          >
            <Sparkles className="w-3 h-3" /> AI Scan
          </button>
        </div>
      </div>

      {/* 3 Day-Specific Score Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[11px] text-slate-400 font-medium">Calories</div>
          <div className="text-xl font-extrabold text-white font-mono">{totalCalories}</div>
          <div className="text-[10px] text-amber-400">{caloriesRemaining} kcal left</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[11px] text-slate-400 font-medium">Protein</div>
          <div className="text-xl font-extrabold text-cyan-400 font-mono">{Math.round(totalProtein)}g</div>
          <div className="text-[10px] text-slate-400">/ 140g target</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[11px] text-slate-400 font-medium">Water</div>
          <div className="text-xl font-extrabold text-blue-400 font-mono">{currentDay.waterIntakeL}L</div>
          <div className="text-[10px] text-slate-400">/ 3.5L goal</div>
        </div>
      </div>

      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Quick-Log Affordable Staples (1-Tap into Selected Day) */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
              1-Tap Quick Staples
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AFFORDABLE_PROTEIN_PILLARS.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAddAffordable(p)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition active:scale-95"
                >
                  <div className="text-xs font-bold text-white truncate">{p.food}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{p.proteinPer100g}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Day's Meals List */}
          <div className="space-y-2.5">
            {currentDay.meals.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
                No meals logged yet for this date. Tap staples above or enter below.
              </div>
            ) : (
              currentDay.meals.map((meal, mIdx) => (
                <div key={mIdx} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="font-bold text-sm text-white">{meal.mealName}</span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {Math.round(meal.items.reduce((s, i) => s + (i.protein || 0), 0))}g protein
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {meal.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-200 font-medium truncate">{item.name}</span>
                        <span className="font-mono text-slate-400">
                          {item.calories} kcal • <strong className="text-cyan-400">{item.protein}g P</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Add Food Simple Form for this selected date */}
          <form onSubmit={handleAddManualFood} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap gap-2 items-center">
            <input
              type="text"
              placeholder="Food name (e.g. Boiled eggs / Oats)"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="flex-1 min-w-[140px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              required
            />
            <input
              type="number"
              placeholder="Cals"
              value={foodCalories}
              onChange={(e) => setFoodCalories(e.target.value)}
              className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
              required
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={foodProtein}
              onChange={(e) => setFoodProtein(e.target.value)}
              className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
              required
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
            >
              Add to Day
            </button>
          </form>
        </div>
      )}

      {/* AI Food Scan & Macro Parser Tab */}
      {activeTab === 'ai-scanner' && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-sm">Smart Indian Meal & Macro Scanner</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
              Auto-Quantity AI
            </span>
          </div>

          {/* Quick-Prompt Preset Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400">Quick Examples (Tap to test):</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                '3 rotis + 1 bowl dal + 100g paneer',
                '150g chicken breast + 1 bowl rice + salad',
                '3 boiled eggs + 250ml milk',
                '50g soya chunks + 2 rotis + curd',
                '1 scoop whey + 50g oats'
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAiMealPrompt(sample);
                    handleScanAiMeal(sample);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Type what you ate with quantities: e.g. '2 rotis + 150g chicken breast + 1 bowl curd' or '3 boiled eggs + milk'"
            value={aiMealPrompt}
            onChange={(e) => setAiMealPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
          />

          {/* Meal Slot Selection */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Log into:</span>
            {(['Breakfast', 'Lunch', 'Post-Workout', 'Dinner', 'Snacks'] as const).map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTargetMealSlot(slot)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  targetMealSlot === slot
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleScanAiMeal()}
            disabled={isAiScanning || !aiMealPrompt}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-slate-950 text-xs transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            {isAiScanning ? 'Analyzing Macros...' : 'Calculate Exact Macros ✨'}
          </button>

          {aiDetectedMeal && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-white text-sm block">{aiDetectedMeal.name}</span>
                  <div className="text-[11px] text-emerald-400 font-mono font-bold mt-1">
                    {aiDetectedMeal.calories} kcal • {aiDetectedMeal.protein}g Protein • {aiDetectedMeal.carbs}g Carbs • {aiDetectedMeal.fat}g Fat
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold text-[10px] border border-indigo-800/40">
                  {targetMealSlot}
                </span>
              </div>

              {/* Recognized Items breakdown */}
              <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detected Breakdown:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {aiDetectedMeal.recognizedItems?.map((item: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] font-mono">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleApplyAiMealToLog}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/20"
              >
                Save to {selectedDate} ({targetMealSlot})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
