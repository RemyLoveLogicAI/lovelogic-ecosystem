import { STTProvider, TTSProvider, TranscriptionResult } from '../types';

export class MockSTT implements STTProvider {
  async transcribe(audioBuffer: Buffer): Promise<TranscriptionResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // For mock purposes, we'll assume the audio buffer contains a string command
    // In a real scenario, this would be actual audio data
    const text = audioBuffer.toString('utf-8');

    return {
      text,
      confidence: 0.99,
      language: 'en',
      duration: 1.0
    };
  }
}

export class MockTTS implements TTSProvider {
  async synthesize(text: string): Promise<Buffer> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return the text as a buffer (mock audio)
    return Buffer.from(text, 'utf-8');
  }
}
