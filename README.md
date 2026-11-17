# Fitness-Tracking-Web — Personalized Gym, Workout, Nutrition & Body Progress Tracking Web Application

A personalized, real-time fitness command platform designed around real-world training history, body recomposition, set-level progressive loading, and budget-aware nutrition.

## Features

- **Progress ≠ Scale Weight Alone**: Real-time tracking of bodyweight dynamics (90 kg → 80 kg → 84 kg recomposition arc) combined with compound strength output.
- **Set-Level Workout Manager**: Live exercise logging with RIR (0–5), set types (Warm-up, Working, PR, Drop, Failure), and total volume calculation (`Sum(Weight × Reps)`).
- **Real Calendar & Live Clock Synchronization**: Active daily schedules automatically mapped to the trainer's 6-day split (Chest+Triceps, Back+Biceps, Legs+Shoulders, and Sunday Active Recovery).
- **Hall of Personal Records (PRs)**: Clean, streamlined PR logger preserving historical milestones (e.g. Incline DB 30kg × 9, Leg Press 250kg × 7 @ 2 RIR, Deadlift 110kg).
- **Budget-Aware Nutrition Tracker**: Deficit counter (1,940 kcal cutting target) and protein adherence (130–150g) emphasizing cost-effective staples (raw soybean, milk, eggs, high-protein oats, 1 scoop whey/day cap).
- **Recovery & Supplement Stack**: Practical sleep window monitoring (6.0–7.5 hrs), muscle soreness, readiness scoring, and supplement logging.
- **Mobile First (iOS & Android Compatible)**: Bottom tab navigation, safe area inset adaptation (Dynamic Island & Home Bar), touch-optimized controls, and home-screen installable PWA behavior.
- **Theme & Personalization**: Light / Dark mode toggle and dynamic athlete identity selector.

## Tech Stack

- **React 19 & TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Recharts**
- **Lucide Icons**

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
