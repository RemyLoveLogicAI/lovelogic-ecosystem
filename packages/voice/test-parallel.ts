// Test parallel vs sequential processing
import { VoiceOps } from './src/index';

async function testSequentialProcessing(audioBuffers: Buffer[]) {
  const voiceOps = new VoiceOps();

  console.log('\n=== Sequential Processing ===');
  console.time('Sequential Processing Time');
  const results = [];
  for (const buffer of audioBuffers) {
    const result = await voiceOps.processAudio(buffer);
    results.push(result);
  }
  console.timeEnd('Sequential Processing Time');
  return results;
}

async function testParallelProcessing(audioBuffers: Buffer[]) {
  const voiceOps = new VoiceOps();

  console.log('\n=== Parallel Processing ===');
  console.time('Parallel Processing Time');
  const results = await voiceOps.processAudios(audioBuffers);
  console.timeEnd('Parallel Processing Time');

  results.forEach((result, index) => {
    console.log(`Audio ${index + 1}:`);
    console.log(`  Transcript: ${result.transcript}`);
    console.log(`  Intent: ${result.intent}`);
    console.log(`  Success: ${result.result.success}`);
    console.log(`  Output: ${result.result.output}`);
    console.log(`  Duration: ${result.result.duration}ms`);
    console.log('---');
  });

  console.log(`Total results processed: ${results.length}`);
  return results;
}

async function main() {
  // Create mock audio buffers (containing text for MockSTT)
  const audioBuffers = [
    Buffer.from('check API health', 'utf-8'),
    Buffer.from('ping the system', 'utf-8'),
    Buffer.from('check API health', 'utf-8'),
    Buffer.from('ping the system', 'utf-8'),
  ];

  try {
    // Test sequential processing
    await testSequentialProcessing(audioBuffers);

    // Test parallel processing
    await testParallelProcessing(audioBuffers);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();
