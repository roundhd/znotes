import { TranscriptSegment } from '../types';

const LOREM_IPSUM = [
  "I have now for the last several weeks switched over from cursors agent to claude code and I'm not looking back at all.",
  "Here's how I use cloud code and my best tips. First, I install the extension which works with VS Code.",
  "I still use Cursor by default because every once in a while it's nice to use command K and their tab completions.",
  "But the only time I've touched the agent sidebar is when Cloud was down. What the extension does do is it...",
  "So I can run things in parallel as long as they're working on different parts of the codebase and different files.",
  "And if I have a file open, it'll automatically pull that into the context. Now Claude uses a terminal UI which I was very skeptical about.",
  "Ideally, we want a seamless integration between the editor and the AI, allowing for rapid iteration.",
  "Let's look at the configuration files. You can see here that we're defining the TypeScript interfaces.",
  "Performance is key when dealing with large React applications. Memoization helps reduce re-renders.",
  "Using Tailwind CSS allows us to rapidly prototype without leaving the HTML structure.",
  "The Gemini API offers multimodal capabilities, meaning it can understand images and audio natively.",
  "Finally, when we deploy this chrome extension, we need to ensure the manifest permissions are correct."
];

export const generateMockTranscript = (durationInSeconds: number = 600): TranscriptSegment[] => {
  const segments: TranscriptSegment[] = [];
  let currentTime = 0;

  let index = 0;
  while (currentTime < durationInSeconds) {
    const text = LOREM_IPSUM[index % LOREM_IPSUM.length];
    // Estimate duration based on word count (approx 2 words per second)
    const wordCount = text.split(' ').length;
    const segmentDuration = Math.max(2, wordCount / 2.5);

    segments.push({
      id: `seg-${index}`,
      start: parseFloat(currentTime.toFixed(2)),
      duration: parseFloat(segmentDuration.toFixed(2)),
      text: text
    });

    currentTime += segmentDuration;
    index++;
  }

  return segments;
};
