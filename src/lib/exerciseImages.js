const exerciseImageMap = {
  // Chest
  'bench press': '/exercises/bench-press.png',
  'bench': '/exercises/bench-press.png',
  'dumbbell press': '/exercises/dumbbell-press.png',
  'cable crossover': '/exercises/cable-crossover.png',
  'pec deck': '/exercises/cable-crossover.png',
  'push-ups': '/exercises/push-ups.png',
  'push-up': '/exercises/push-ups.png',
  'dips': '/exercises/tricep-dips.png',
  
  // Back
  'deadlift': '/exercises/deadlift.png',
  'pull-ups': '/exercises/pull-ups.png',
  'barbell rows': '/exercises/barbell-rows.png',
  'row': '/exercises/barbell-rows.png',
  'lat pulldown': '/exercises/lat-pulldown.png',
  
  // Legs
  'squats': '/exercises/squats.png',
  'squat': '/exercises/squats.png',
  'leg press': '/exercises/leg-press.png',
  'leg extension': '/exercises/leg-press.png',
  'leg curl': '/exercises/leg-press.png',
  'lunges': '/exercises/lunges.png',
  'lunge': '/exercises/lunges.png',
  'calf raises': '/exercises/calf-raises.png',
  'glute': '/exercises/deadlift.png',
  'wall sit': '/exercises/leg-press.png',
  
  // Shoulders
  'shoulder press': '/exercises/shoulder-press.png',
  'military press': '/exercises/shoulder-press.png',
  'overhead press': '/exercises/shoulder-press.png',
  'lateral raises': '/exercises/lateral-raises.png',
  'front raises': '/exercises/front-raises.png',
  'upright row': '/exercises/lateral-raises.png',
  'shrugs': '/exercises/lateral-raises.png',
  'face pulls': '/exercises/face-pulls.png',
  
  // Arms
  'bicep curls': '/exercises/bicep-curls.png',
  'hammer curls': '/exercises/hammer-curls.png',
  'curl': '/exercises/bicep-curls.png',
  'tricep dips': '/exercises/tricep-dips.png',
  'tricep pushdown': '/exercises/tricep-pushdown.png',
  'skull crushers': '/exercises/tricep-pushdown.png',
  
  // Core
  'plank': '/exercises/plank.png',
  'crunches': '/exercises/crunches.png',
  'crunch': '/exercises/crunches.png',
  'bicycle crunches': '/exercises/bicycle-crunches.png',
  'russian twists': '/exercises/russian-twists.png',
  'leg raises': '/exercises/crunches.png',
  
  // Cardio & Full Body
  'running': '/exercises/running.png',
  'jumping jacks': '/exercises/jumping-jacks.png',
  'burpees': '/exercises/deadlift.png',
  'mountain climbers': '/exercises/plank.png',
  'high knees': '/exercises/lunges.png',
  'jump rope': '/exercises/jump-rope.png',
  'skipping': '/exercises/jump-rope.png',
  'shadow boxing': '/exercises/front-raises.png',
  'jogging': '/exercises/running.png',
  'walking': '/exercises/running.png',
  'cycling': '/exercises/running.png',
  
  // Stretches
  'stretch': '/exercises/default.png',
  'yoga': '/exercises/default.png',
  'pose': '/exercises/crunches.png',
  'cat-cow': '/exercises/plank.png',
  'downward dog': '/exercises/push-ups.png',
  'foam rolling': '/exercises/default.png',
};

export function getExerciseImage(exerciseName) {
  if (!exerciseName) return '/exercises/default.png';
  
  const normalized = exerciseName.toLowerCase().trim();
  
  // Check for exact match
  if (exerciseImageMap[normalized]) {
    return exerciseImageMap[normalized];
  }
  
  // Check for partial match
  for (const [key, value] of Object.entries(exerciseImageMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // Default image
  return '/exercises/default.png';
}