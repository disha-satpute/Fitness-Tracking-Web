export interface OverloadPrediction {
  exerciseName: string;
  recommendedAction: 'PROGRESS_LOAD' | 'PROGRESS_REPS' | 'HOLD_FORM' | 'RECOVERY_DELOAD';
  headline: string;
  targetWeight: number;
  targetReps: string;
  targetRir: number;
  fatigueInsight: string;
  reasoning: string;
}

export const getSmartOverloadPrediction = (
  exerciseName: string,
  lastBest: string | undefined,
  recoveryRating: number = 7, // 1-10
  sleepHours: number = 6.5
): OverloadPrediction => {
  const isHighFatigue = recoveryRating < 6 || sleepHours < 6.0;

  if (isHighFatigue) {
    return {
      exerciseName,
      recommendedAction: 'RECOVERY_DELOAD',
      headline: 'Fatigue Flagged: Focus on Tension & Clean RIR 2-3',
      targetWeight: 27.5,
      targetReps: '8-10 reps',
      targetRir: 2,
      fatigueInsight: `Recent recovery score is ${recoveryRating}/10 (${sleepHours}h sleep). Central nervous system reserve is moderate.`,
      reasoning: 'Hold current load. Do not attempt failure sets today to prevent connective tissue fatigue.'
    };
  }

  if (exerciseName.toLowerCase().includes('incline dumbbell')) {
    return {
      exerciseName,
      recommendedAction: 'PROGRESS_REPS',
      headline: "Today's AI Target: 30 kg × 10 reps (or 32.5 kg × 6–7)",
      targetWeight: 30.0,
      targetReps: '10 clean reps',
      targetRir: 1,
      fatigueInsight: `Recovery solid (${recoveryRating}/10). Previous session logged 30 kg × 9 reps @ 1 RIR.`,
      reasoning: 'You completed 9 unassisted reps last time. Push for rep #10 unassisted, then step up to 32.5kg dumbbells.'
    };
  }

  if (exerciseName.toLowerCase().includes('leg press')) {
    return {
      exerciseName,
      recommendedAction: 'PROGRESS_LOAD',
      headline: "Today's AI Target: 250 kg × 8 reps @ 2 RIR (or 260 kg × 6)",
      targetWeight: 250.0,
      targetReps: '8 reps',
      targetRir: 2,
      fatigueInsight: 'Quad recovery is adequate. Remember to maintain full depth without bouncing.',
      reasoning: 'Historical mark was 250 kg × 7 with 2 RIR in reserve. Adding 1 rep reaches progressive overload standard.'
    };
  }

  if (exerciseName.toLowerCase().includes('lat pulldown')) {
    return {
      exerciseName,
      recommendedAction: 'PROGRESS_REPS',
      headline: "Today's AI Target: 75 kg × 4–5 controlled reps",
      targetWeight: 75.0,
      targetReps: '4–5 reps',
      targetRir: 1,
      fatigueInsight: 'Lats and upper back recovery peak after adequate sleep.',
      reasoning: 'Previous personal record was 75 kg × 3. Progressing by 1-2 reps with a full 2-second eccentric stretch.'
    };
  }

  if (exerciseName.toLowerCase().includes('squat')) {
    return {
      exerciseName,
      recommendedAction: 'PROGRESS_LOAD',
      headline: "Today's AI Target: 65 kg total (Bar + 22.5kg/side) × 6–7 reps",
      targetWeight: 65.0,
      targetReps: '6–7 reps',
      targetRir: 2,
      fatigueInsight: 'Keep lumbar spine braced; Olympic barbell depth prioritized.',
      reasoning: 'Last session logged 60 kg total × 7 reps. Safe overload is +2.5kg per side.'
    };
  }

  if (exerciseName.toLowerCase().includes('shoulder')) {
    return {
      exerciseName,
      recommendedAction: 'PROGRESS_REPS',
      headline: "Today's AI Target: 22.5 kg each × 7 reps",
      targetWeight: 22.5,
      targetReps: '7 reps',
      targetRir: 1,
      fatigueInsight: 'Delts respond best to controlled tempo without excessive arching.',
      reasoning: 'Historical benchmark is 22.5 kg × 5-6 reps. Secure 7 reps before testing 25 kg dumbbells.'
    };
  }

  return {
    exerciseName,
    recommendedAction: 'PROGRESS_REPS',
    headline: "Today's AI Target: +1 Rep at current load or +2.5 kg",
    targetWeight: 20.0,
    targetReps: '8–10 reps',
    targetRir: 2,
    fatigueInsight: 'Maintain 1–2 RIR in reserve for clean hypertrophy stimulus.',
    reasoning: 'Incremental overload will maintain muscle fullness while in a cutting deficit.'
  };
};

export interface MealRecommendation {
  id: string;
  title: string;
  proteinYield: number;
  calories: number;
  items: string[];
  explanation: string;
}

export const getSmartBudgetMealSuggestions = (
  proteinDeficit: number = 25,
  calorieBudget: number = 400
): MealRecommendation[] => {
  return [
    {
      id: 'opt-1',
      title: 'Raw Soybean Curry + Whole Cow Milk',
      proteinYield: 26,
      calories: 370,
      items: [
        '50g Raw Soybean (boiled & cooked into curry) → ~18g Protein',
        '250ml Whole Cow Milk → ~8g Protein'
      ],
      explanation: 'High bio-available plant protein + milk casein without needing costly whey powder.'
    },
    {
      id: 'opt-2',
      title: 'Boiled Eggs & Whole Cow Milk Fast Prep',
      proteinYield: 26,
      calories: 365,
      items: [
        '3 Whole Boiled Eggs → ~18g Protein',
        '250ml Cow Milk → ~8g Protein'
      ],
      explanation: 'Zero preparation hassle with high biological value protein and essential fats for hormone balance.'
    },
    {
      id: 'opt-3',
      title: 'High-Protein Oats + Curd Bowl',
      proteinYield: 22,
      calories: 340,
      items: [
        '60g High-Protein Oats (Pinola) → ~13g Protein',
        '200g Fresh Dahi / Curd → ~8-9g Protein'
      ],
      explanation: 'Easily digestible carbohydrate + casein combo for sustained muscle replenishment.'
    }
  ];
};

export interface ParsedMealResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  recognizedItems: string[];
}

export const parseQuickIndianMeal = (text: string): ParsedMealResult => {
  const lower = text.toLowerCase();
  let estCals = 0;
  let estProtein = 0;
  let estCarbs = 0;
  let estFat = 0;
  const recognizedItems: string[] = [];

  // Helper number extractor
  const getQty = (regex: RegExp, defaultVal: number = 1): number => {
    const m = lower.match(regex);
    if (!m) return defaultVal;
    return parseFloat(m[1]) || defaultVal;
  };

  // 1. Roti / Chapati / Phulka / Paratha
  if (lower.includes('roti') || lower.includes('chapati') || lower.includes('phulka')) {
    const count = getQty(/(\d+(?:\.\d+)?)\s*(?:roti|chapati|phulka)/, 2);
    estCals += count * 85;
    estProtein += count * 3;
    estCarbs += count * 16;
    estFat += count * 0.5;
    recognizedItems.push(`${count} Roti (~${(count * 3).toFixed(1)}g P)`);
  } else if (lower.includes('paratha')) {
    const count = getQty(/(\d+(?:\.\d+)?)\s*paratha/, 1);
    estCals += count * 220;
    estProtein += count * 5;
    estCarbs += count * 28;
    estFat += count * 10;
    recognizedItems.push(`${count} Paratha (~${count * 5}g P)`);
  }

  // 2. Eggs (boiled / omelette / bhurji / egg white)
  if (lower.includes('egg') || lower.includes('omelet') || lower.includes('bhurji') || lower.includes('anda')) {
    const isEggWhite = lower.includes('white');
    const count = getQty(/(\d+(?:\.\d+)?)\s*(?:egg|anda|boiled)/, 2);
    if (isEggWhite) {
      estCals += count * 18;
      estProtein += count * 3.8;
      estFat += 0;
      estCarbs += count * 0.3;
      recognizedItems.push(`${count} Egg Whites (~${(count * 3.8).toFixed(1)}g P)`);
    } else {
      estCals += count * 75;
      estProtein += count * 6.2;
      estFat += count * 5;
      estCarbs += count * 0.6;
      recognizedItems.push(`${count} Whole Eggs (~${(count * 6.2).toFixed(1)}g P)`);
    }
  }

  // 3. Chicken (chicken breast, curry, tandoori, grilled)
  if (lower.includes('chicken') || lower.includes('murgh')) {
    const grams = getQty(/(\d+(?:\.\d+)?)\s*g(?:m|ram)?\s*chicken/, 150);
    const proteinRatio = lower.includes('breast') || lower.includes('grilled') ? 0.31 : 0.22;
    const p = Math.round(grams * proteinRatio);
    const cals = Math.round(grams * (proteinRatio === 0.31 ? 1.65 : 2.1));
    estCals += cals;
    estProtein += p;
    estCarbs += 2;
    estFat += Math.round(grams * 0.05);
    recognizedItems.push(`${grams}g Chicken (~${p}g P)`);
  }

  // 4. Paneer (Cottage cheese)
  if (lower.includes('paneer')) {
    const grams = getQty(/(\d+(?:\.\d+)?)\s*g(?:m|ram)?\s*paneer/, 100);
    const p = Math.round(grams * 0.18);
    const f = Math.round(grams * 0.20);
    const c = Math.round(grams * 0.04);
    const cals = Math.round(grams * 2.65);
    estCals += cals;
    estProtein += p;
    estCarbs += c;
    estFat += f;
    recognizedItems.push(`${grams}g Paneer (~${p}g P)`);
  }

  // 5. Soya / Soybean
  if (lower.includes('soya') || lower.includes('soybean')) {
    const grams = getQty(/(\d+(?:\.\d+)?)\s*g(?:m|ram)?\s*(?:soya|soybean)/, 50);
    const isChunks = lower.includes('chunk') || lower.includes('wadi');
    const p = Math.round(grams * (isChunks ? 0.52 : 0.36));
    const cals = Math.round(grams * (isChunks ? 3.4 : 4.4));
    estCals += cals;
    estProtein += p;
    estCarbs += Math.round(grams * 0.3);
    estFat += Math.round(grams * 0.05);
    recognizedItems.push(`${grams}g Soya (~${p}g P)`);
  }

  // 6. Whey Protein
  if (lower.includes('whey') || lower.includes('protein powder')) {
    const scoops = getQty(/(\d+(?:\.\d+)?)\s*scoop/, 1);
    estCals += Math.round(scoops * 125);
    estProtein += Math.round(scoops * 25);
    estCarbs += Math.round(scoops * 2.5);
    estFat += Math.round(scoops * 1.5);
    recognizedItems.push(`${scoops} scoop Whey (~${Math.round(scoops * 25)}g P)`);
  }

  // 7. Rice (cooked rice / jeera rice / biryani)
  if (lower.includes('rice') || lower.includes('chawal')) {
    const bowls = getQty(/(\d+(?:\.\d+)?)\s*(?:bowl|katori|plate)/, 1);
    estCals += Math.round(bowls * 180);
    estProtein += Math.round(bowls * 3.5);
    estCarbs += Math.round(bowls * 40);
    estFat += Math.round(bowls * 0.5);
    recognizedItems.push(`${bowls} bowl Rice (~${(bowls * 3.5).toFixed(1)}g P)`);
  }

  // 8. Dal / Lentils / Sambar / Chole / Rajma
  if (lower.includes('dal') || lower.includes('daal') || lower.includes('sambar')) {
    const bowls = getQty(/(\d+(?:\.\d+)?)\s*(?:bowl|katori)/, 1);
    estCals += Math.round(bowls * 150);
    estProtein += Math.round(bowls * 8);
    estCarbs += Math.round(bowls * 22);
    estFat += Math.round(bowls * 3);
    recognizedItems.push(`${bowls} bowl Dal (~${bowls * 8}g P)`);
  } else if (lower.includes('chole') || lower.includes('chana') || lower.includes('rajma')) {
    const bowls = getQty(/(\d+(?:\.\d+)?)\s*(?:bowl|katori|plate)/, 1);
    estCals += Math.round(bowls * 240);
    estProtein += Math.round(bowls * 12);
    estCarbs += Math.round(bowls * 36);
    estFat += Math.round(bowls * 5);
    recognizedItems.push(`${bowls} bowl Chole/Rajma (~${bowls * 12}g P)`);
  }

  // 9. Curd / Dahi / Greek Yogurt
  if (lower.includes('curd') || lower.includes('dahi') || lower.includes('yogurt')) {
    const grams = getQty(/(\d+(?:\.\d+)?)\s*g(?:m|ram)?/, 150);
    const p = Math.round(grams * 0.04);
    const cals = Math.round(grams * 0.65);
    estCals += cals;
    estProtein += p;
    estCarbs += Math.round(grams * 0.045);
    estFat += Math.round(grams * 0.035);
    recognizedItems.push(`${grams}g Curd (~${p}g P)`);
  }

  // 10. Milk / Doodh
  if (lower.includes('milk') || lower.includes('doodh')) {
    const ml = getQty(/(\d+(?:\.\d+)?)\s*ml/, 250);
    const p = Math.round(ml * 0.033);
    const cals = Math.round(ml * 0.65);
    estCals += cals;
    estProtein += p;
    estCarbs += Math.round(ml * 0.05);
    estFat += Math.round(ml * 0.035);
    recognizedItems.push(`${ml}ml Milk (~${p}g P)`);
  }

  // 11. Oats / Oatmeal
  if (lower.includes('oats') || lower.includes('oatmeal')) {
    const grams = getQty(/(\d+(?:\.\d+)?)\s*g(?:m|ram)?/, 50);
    const p = Math.round(grams * 0.13);
    const cals = Math.round(grams * 3.8);
    estCals += cals;
    estProtein += p;
    estCarbs += Math.round(grams * 0.65);
    estFat += Math.round(grams * 0.07);
    recognizedItems.push(`${grams}g Oats (~${p}g P)`);
  }

  // 12. Peanut Butter / Nuts (Almonds / Kaju)
  if (lower.includes('peanut butter')) {
    const tbsp = getQty(/(\d+(?:\.\d+)?)\s*(?:tbsp|spoon)/, 1);
    estCals += tbsp * 95;
    estProtein += tbsp * 4;
    estCarbs += tbsp * 3;
    estFat += tbsp * 8;
    recognizedItems.push(`${tbsp} tbsp Peanut Butter (~${tbsp * 4}g P)`);
  } else if (lower.includes('almond') || lower.includes('badam') || lower.includes('kaju') || lower.includes('nuts')) {
    const count = getQty(/(\d+(?:\.\d+)?)\s*(?:almond|badam|nuts|kaju)/, 10);
    estCals += count * 7;
    estProtein += count * 0.25;
    estFat += count * 0.6;
    estCarbs += count * 0.25;
    recognizedItems.push(`${count} Nuts (~${(count * 0.25).toFixed(1)}g P)`);
  }

  // Fallback for unlisted foods
  if (recognizedItems.length === 0) {
    return {
      name: text,
      calories: 280,
      protein: 14,
      carbs: 34,
      fat: 9,
      recognizedItems: ['Balanced Indian Meal Estimate (~14g Protein)']
    };
  }

  return {
    name: text,
    calories: Math.round(estCals),
    protein: Math.round(estProtein * 10) / 10,
    carbs: Math.round(estCarbs),
    fat: Math.round(estFat),
    recognizedItems
  };
};
