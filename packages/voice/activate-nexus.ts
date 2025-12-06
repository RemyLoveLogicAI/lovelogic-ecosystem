import { VoiceOps } from './src/index';

async function activateNexus() {
  console.log('🔌 Activating Hyper-Spec Nexus...');
  console.log('-----------------------------------');

  const voiceOps = new VoiceOps();

  // 1. Ping System
  console.log('\n🎤 Voice Command: "Ping the system"');
  const result1 = await voiceOps.processText('Ping the system');
  console.log('🤖 Nexus Response:', result1.result.output);
  console.log('🔊 Audio Response (Mock):', result1.audioResponse.toString());

  // 2. Check API Health
  // Note: This requires the API to be running. If not, it might fail or show connection error.
  console.log('\n🎤 Voice Command: "Check API health"');
  const result2 = await voiceOps.processText('Check API health');

  if (result2.result.success) {
    console.log('🤖 Nexus Response:', result2.result.output);
  } else {
    console.log('❌ Nexus Error:', result2.result.error);
  }
  console.log('🔊 Audio Response (Mock):', result2.audioResponse.toString());

  console.log('\n-----------------------------------');
  console.log('✅ Nexus Activation Complete');
}

activateNexus().catch(console.error);
