import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'public', 'exercises');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error('Failed with status ' + response.statusCode));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

const map = {
  // Chest
  'bench-press': 'bench press',
  'dumbbell-press': 'incline dumbbell press',
  'cable-crossover': 'cable crossover',
  'push-ups': 'push up',
  // Back
  'deadlift': 'deadlift',
  'pull-ups': 'pull up',
  'barbell-rows': 'barbell row',
  'lat-pulldown': 'lat pulldown',
  // Legs
  'squats': 'squat',
  'leg-press': 'leg press',
  'lunges': 'lunge',
  'calf-raises': 'calf raise',
  // Shoulders
  'shoulder-press': 'shoulder press',
  'lateral-raises': 'lateral raise',
  'front-raises': 'front raise',
  'face-pulls': 'face pull',
  // Arms
  'bicep-curls': 'bicep curl',
  'hammer-curls': 'hammer curl',
  'tricep-dips': 'tricep dip',
  'tricep-pushdown': 'triceps pushdown',
  // Core/Cardio
  'plank': 'plank',
  'crunches': 'crunch',
  'russian-twists': 'russian twist',
  'running': 'run'
};

https.get('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    const exercises = JSON.parse(data);
    
    for (const [filename, searchTerm] of Object.entries(map)) {
      let match = exercises.find(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Fallbacks
      if (filename === 'running') match = exercises.find(e => e.name.toLowerCase().includes('treadmill') || e.name.toLowerCase().includes('run'));
      if (filename === 'plank') match = exercises.find(e => e.name.toLowerCase() === 'front plank' || e.name.toLowerCase().includes('plank'));
      if (filename === 'dumbbell-press') match = exercises.find(e => e.name.toLowerCase() === 'incline dumbbell press');
      if (filename === 'tricep-dips') match = exercises.find(e => e.name.toLowerCase().includes('dips - triceps version'));
      if (filename === 'pull-ups') match = exercises.find(e => e.name.toLowerCase() === 'pullups');
      if (filename === 'barbell-rows') match = exercises.find(e => e.name.toLowerCase() === 'bent over barbell row');
      if (filename === 'push-ups') match = exercises.find(e => e.name.toLowerCase() === 'push-ups');
      if (filename === 'lat-pulldown') match = exercises.find(e => e.name.toLowerCase() === 'cable pulldown');
      
      if (!match && exercises.length > 0) match = exercises[0]; 
      
      if (match && match.images && match.images.length > 0) {
        const imgUrl = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + match.images[0];
        const dest = path.join(dir, `${filename}.png`);
        try {
          await download(imgUrl, dest);
          console.log(`✅ Success: ${filename}`);
        } catch (err) {
          console.error(`❌ Error downloading ${filename}: ${err.message}`);
        }
      }
    }
  });
});
