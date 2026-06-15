import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configure dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const AUDIO_DIR = path.resolve(__dirname, '../public/assets/audio');
const MAP_FILE = path.resolve(__dirname, '../src/utils/audioMap.ts');

const phrases = [
  { text: "Welcome to Multiplication Tables!", style: 'encouragement' },
  { text: "Today we will master the times tables for six, seven, eight, and nine.", style: 'statement' },
  { text: "Can you spot patterns and solve multiplication facts quickly?", style: 'question' },
  { text: "Are you ready to explore four amazing worlds and become a multiplication master? Let us begin!", style: 'encouragement' },
  { text: "Sarah explores the coral reef and discovers rows of six colourful fish.", style: 'statement' },
  { text: "How many fish are there when there are four rows of six?", style: 'question' },
  { text: "That is what the six times table helps us find out!", style: 'statement' },
  { text: "Miguel swings through the jungle canopy counting groups of seven.", style: 'statement' },
  { text: "Seven is tricky, but patterns and practice make it easier!", style: 'emphasis' },
  { text: "John floats in the space station. Each fuel pod holds eight litres.", style: 'statement' },
  { text: "Eight is double-double — a handy trick for the eights!", style: 'emphasis' },
  { text: "Aiko unlocks the ancient temple and learns the nine times table.", style: 'statement' },
  { text: "The digits of nine times facts always add up to nine!", style: 'emphasis' },
  { text: "You have met all four table worlds!", style: 'encouragement' },
  { text: "Now it is time to practice building arrays and solving challenges!", style: 'statement' },
  { text: "Tap each circle to build equal rows for multiplication!", style: 'instruction' },
  { text: "Put the same number in every group. Can you fill them all?", style: 'question' },
  { text: "Look at these multiplication arrays. Which one matches the sentence?", style: 'instruction' },
  { text: "Tap the correct arrangement!", style: 'question' },
  { text: "Fill in the missing number. Use the number pad!", style: 'question' },
  { text: "Welcome to Coral Reef!", style: 'celebration' },
  { text: "Welcome to Jungle Canopy!", style: 'celebration' },
  { text: "Welcome to Space Station!", style: 'celebration' },
  { text: "Welcome to Ancient Temple!", style: 'celebration' },
  { text: "Coral Reef Complete!", style: 'statement' },
  { text: "Jungle Canopy Complete!", style: 'statement' },
  { text: "Space Station Complete!", style: 'statement' },
  { text: "Ancient Temple Complete!", style: 'statement' },
  { text: "What did you learn about multiplication tables?", style: 'question' },
  { text: "How confident do you feel about times tables six through nine?", style: 'question' }
];

const getElevenLabsSettings = (speechStyle) => {
  switch (speechStyle) {
    case 'celebration':
      return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement':
      return { stability: 0.16, similarity_boost: 0.5, style: 0.65, use_speaker_boost: true };
    case 'question':
      return { stability: 0.2, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':
      return { stability: 0.16, similarity_boost: 0.5, style: 0.6, use_speaker_boost: true };
    case 'thinking':
      return { stability: 0.24, similarity_boost: 0.6, style: 0.35, use_speaker_boost: true };
    default:
      return { stability: 0.2, similarity_boost: 0.55, style: 0.5, use_speaker_boost: true };
  }
};

const sanitizeFileName = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 40) + '_' + Math.random().toString(36).substring(2, 7);
};

async function generateAudio() {
  if (!API_KEY) {
    console.error("VITE_ELEVENLABS_API_KEY is missing from .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  let audioMap = {};
  if (fs.existsSync(MAP_FILE)) {
    // Try to parse existing map if we want to avoid regenerating
    try {
      const existing = fs.readFileSync(MAP_FILE, 'utf-8');
      const jsonMatch = existing.match(/export default (\{[\s\S]*\});/);
      if (jsonMatch) {
        audioMap = JSON.parse(jsonMatch[1]);
      }
    } catch(e) {}
  }

  let newlyGenerated = 0;

  for (const phrase of phrases) {
    if (audioMap[phrase.text]) {
      console.log(`Skipping already generated: "${phrase.text}"`);
      continue;
    }

    console.log(`Generating: "${phrase.text}" (${phrase.style})`);
    
    const settings = getElevenLabsSettings(phrase.style);
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY
        },
        body: JSON.stringify({
          text: phrase.text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: settings
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API Error: ${response.status} ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const filename = `audio_${sanitizeFileName(phrase.text)}.mp3`;
      const filePath = path.join(AUDIO_DIR, filename);
      
      fs.writeFileSync(filePath, Buffer.from(buffer));
      audioMap[phrase.text] = `/assets/audio/${filename}`;
      newlyGenerated++;
      
    } catch (e) {
      console.error(`Failed to generate: ${phrase.text}`, e);
    }
  }

  // Write map file
  const mapFileContent = `// Auto-generated. Do not edit directly.\nexport default ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(MAP_FILE, mapFileContent);
  console.log(`\nGenerated ${newlyGenerated} new audio files.`);
  console.log(`Updated audioMap at ${MAP_FILE}`);
}

generateAudio().catch(console.error);
