import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUDIO_DIR = path.resolve(__dirname, '../public/assets/audio');
const MAP_FILE = path.resolve(__dirname, '../src/utils/audioMap.js');

async function cleanAudio() {
  if (!fs.existsSync(AUDIO_DIR)) {
    console.log("Audio directory does not exist. Nothing to clean.");
    return;
  }

  let audioMap = {};
  if (fs.existsSync(MAP_FILE)) {
    try {
      const existing = fs.readFileSync(MAP_FILE, 'utf-8');
      const jsonMatch = existing.match(/export default (\{[\s\S]*\});/);
      if (jsonMatch) {
        audioMap = JSON.parse(jsonMatch[1]);
      }
    } catch(e) {
      console.error("Failed to parse audioMap.js", e);
      return;
    }
  }

  const validPaths = new Set(Object.values(audioMap).map(p => path.basename(p)));
  const files = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.mp3'));

  let deleted = 0;
  for (const file of files) {
    if (!validPaths.has(file)) {
      console.log(`Deleting orphan audio file: ${file}`);
      fs.unlinkSync(path.join(AUDIO_DIR, file));
      deleted++;
    }
  }

  console.log(`Cleaned up ${deleted} orphan audio files.`);
}

cleanAudio().catch(console.error);
