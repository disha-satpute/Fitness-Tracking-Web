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

  // Exercise specific historical progression logic
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
      reasoning: 'Historical mark was 250 kg × 7 in the New Gym with 2 RIR in reserve. Adding 1 rep reaches progressive overload standard.'
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
      reasoning: 'Last session logged 60 kg total (20kg bar + 20kg/side) × 7 reps. Safe overload is +2.5kg per side.'
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

  // Generic progressive overload recommendation
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
  estimatedCost: string;
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
      title: 'Raw Soybean Curry + Cow Milk (Ultra Value Champion)',
      estimatedCost: '₹22 - ₹28',
      proteinYield: 26,
      calories: 370,
      items: [
        '50g Raw Soybean (boiled & cooked into curry) → ~18g Protein',
        '250ml Whole Cow Milk → ~8g Protein'
      ],
      explanation: 'Delivers 26g complete protein for under ₹30 without spending on expensive whey powder.'
    },
    {
      id: 'opt-2',
      title: 'Boiled Eggs & Whole Cow Milk Fast Prep',
      estimatedCost: '₹30 - ₹35',
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
      estimatedCost: '₹40 - ₹45',
      proteinYield: 22,
      calories: 340,
      items: [
        '60g High-Protein Oats (Pinola) → ~13g Protein',
        '200g Fresh Dahi / Curd → ~8-9g Protein'
      ],
      explanation: 'Easily digestible post-workout carbohydrate + casein/whey combo.'
    }
  ];
};

export const parseQuickIndianMeal = (text: string) => {
  const lower = text.toLowerCase();
  let estCals = 0;
  let estProtein = 0;
  let estCarbs = 0;
  let estFat = 0;
  const recognizedItems: string[] = [];

  if (lower.includes('roti') || lower.includes('chapati')) {
    const match = lower.match(/(\d+)\s*(?:roti|chapati)/);
    const count = match ? parseInt(match[1]) : 2;
    estCals += count * 85;
    estProtein += count * 2.8;
    estCarbs += count * 16;
    estFat += count * 1;
    recognizedItems.push(`${count} Chapatis (~${(count * 2.8).toFixed(1)}g P)`);
  }

  if (lower.includes('paneer')) {
    estCals += 240;
    estProtein += 16;
    estCarbs += 4;
    estFat += 18;
    recognizedItems.push('Paneer preparation (~16g P)');
  }

  if (lower.includes('soybean') || lower.includes('soya')) {
    estCals += 215;
    estProtein += 18;
    estCarbs += 14;
    estFat += 9.5;
    recognizedItems.push('Soybean Sabji (~18g P)');
  }

  if (lower.includes('curd') || lower.includes('dahi')) {
    estCals += 120;
    estProtein += 7;
    estCarbs += 8;
    estFat += 6;
    recognizedItems.push('Curd / Dahi (~7g P)');
  }

  if (lower.includes('rice')) {
    estCals += 180;
    estProtein += 3.5;
    estCarbs += 38;
    estFat += 0.5;
    recognizedItems.push('Cooked Rice (~3.5g P)');
  }

  if (lower.includes('egg') || lower.includes('omelette')) {
    const match = lower.match(/(\d+)\s*(?:egg|boiled egg|eggs)/);
    const count = match ? parseInt(match[1]) : 2;
    estCals += count * 72;
    estProtein += count * 6;
    estFat += count * 5;
    recognizedItems.push(`${count} Eggs (~${count * 6}g P)`);
  }

  if (lower.includes('dal') || lower.includes('daal')) {
    estCals += 150;
    estProtein += 8;
    estCarbs += 22;
    estFat += 3;
    recognizedItems.push('1 Bowl Dal (~8g P)');
  }

  if (lower.includes('milk')) {
    estCals += 160;
    estProtein += 8.5;
    estCarbs += 12;
    estFat += 8.5;
    recognizedItems.push('Cow Milk (~8.5g P)');
  }

  if (recognizedItems.length === 0) {
    return {
      name: text,
      calories: 250,
      protein: 12,
      carbs: 30,
      fat: 7,
      recognizedItems: ['Custom mixed meal estimate (~12g P)']
    };
  }

  return {
    name: text,
    calories: Math.round(estCals),
    protein: Math.round(estProtein),
    carbs: Math.round(estCarbs),
    fat: Math.round(estFat),
    recognizedItems
  };
};
