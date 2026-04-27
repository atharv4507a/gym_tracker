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

const images = {
  'bench-press': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg',
  'dumbbell-press': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Press/0.jpg',
  'deadlift': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg',
  'pull-ups': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/0.jpg',
  'barbell-rows': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Barbell_Row/0.jpg',
  'squats': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Full_Squat/0.jpg',
  'leg-press': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg',
  'shoulder-press': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Barbell_Military_Press/0.jpg',
  'lateral-raises': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Power_Partials/0.jpg',
  'bicep-curls': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bicep_Curl/0.jpg',
  'tricep-dips': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dips_-_Triceps_Version/0.jpg',
  'plank': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg',
  'running': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Jog_In_Place/0.jpg',
  'default': 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg'
};

Object.keys(images).forEach(name => {
  const file = fs.createWriteStream(path.join(dir, `${name}.png`));
  https.get(images[name], function(response) {
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => file.close());
    } else {
      console.error('Failed to download', name, response.statusCode);
      // fallback to placeholder
      https.get(`https://placehold.co/400x300/1a1a26/ffffff?text=${name}`, (res2) => {
        res2.pipe(file);
        file.on('finish', () => file.close());
      });
    }
  });
});

console.log('Exact Exercise Images downloaded to public/exercises/');
