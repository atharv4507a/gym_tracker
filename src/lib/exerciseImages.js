const exerciseImageMap = {
  'bench press': '/exercises/bench-press.png',
  'dumbbell press': '/exercises/dumbbell-press.png',
  'cable crossover': '/exercises/cable-crossover.png',
  'push-ups': '/exercises/push-ups.png',
  'deadlift': '/exercises/deadlift.png',
  'pull-ups': '/exercises/pull-ups.png',
  'barbell rows': '/exercises/barbell-rows.png',
  'lat pulldown': '/exercises/lat-pulldown.png',
  'squats': '/exercises/squats.png',
  'leg press': '/exercises/leg-press.png',
  'lunges': '/exercises/lunges.png',
  'calf raises': '/exercises/calf-raises.png',
  'shoulder press': '/exercises/shoulder-press.png',
  'lateral raises': '/exercises/lateral-raises.png',
  'front raises': '/exercises/front-raises.png',
  'face pulls': '/exercises/face-pulls.png',
  'bicep curls': '/exercises/bicep-curls.png',
  'hammer curls': '/exercises/hammer-curls.png',
  'tricep dips': '/exercises/tricep-dips.png',
  'tricep pushdown': '/exercises/tricep-pushdown.png',
  'plank': '/exercises/plank.png',
  'crunches': '/exercises/crunches.png',
  'russian twists': '/exercises/russian-twists.png',
  'running': '/exercises/running.png',
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