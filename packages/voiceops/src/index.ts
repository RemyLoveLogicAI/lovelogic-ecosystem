import { STTProvider, TTSProvider, IntentParser, ExecutionResult, ParallelProcessor } from './types';
import { BasicIntentParser } from './intent/parser';
import { MockSTT, MockTTS } from './stt/mock';

export interface VoiceOpsConfig {
  stt?: STTProvider;
  tts?: TTSProvider;
  parser?: IntentParser;
}

export class VoiceOps implements ParallelProcessor {
  private stt: STTProvider;
  private tts: TTSProvider;
  private parser: IntentParser;

  constructor(config: VoiceOpsConfig = {}) {
    this.stt = config.stt || new MockSTT();
    this.tts = config.tts || new MockTTS();
    this.parser = config.parser || new BasicIntentParser();
  }

  /**
   * Process a voice command from audio buffer
   */
  async processAudio(audioBuffer: Buffer): Promise<{
    transcript: string;
    intent: string;
    result: ExecutionResult;
    audioResponse: Buffer;
  }> {
    // 1. Transcribe
    const transcription = await this.stt.transcribe(audioBuffer);

    // 2. Parse Intent
    const intent = await this.parser.parse(transcription.text);

    // 3. Execute (Mock execution for now, will connect to DevMesh later)
    const result = await this.executeIntent(intent);

    // 4. Format Response (Simple echo for now)
    const responseText = result.success
      ? `Executed ${intent.intent}: ${result.output}`
      : `Failed to execute ${intent.intent}: ${result.error}`;

    // 5. Synthesize Response
    const audioResponse = await this.tts.synthesize(responseText);

    return {
      transcript: transcription.text,
      intent: intent.intent,
      result,
      audioResponse
    };
  }

  /**
   * Process a text command directly (bypass STT)
   */
  async processText(text: string): Promise<{
    intent: string;
    result: ExecutionResult;
    audioResponse: Buffer;
  }> {
    // 1. Parse Intent
    const intent = await this.parser.parse(text);

    // 2. Execute
    const result = await this.executeIntent(intent);

    // 3. Format Response
    const responseText = result.success
      ? `Executed ${intent.intent}: ${result.output}`
      : `Failed to execute ${intent.intent}: ${result.error}`;

    // 4. Synthesize Response
    const audioResponse = await this.tts.synthesize(responseText);

    return {
      intent: intent.intent,
      result,
      audioResponse
    };
  }

  /**
   * Process multiple voice commands in parallel
   */
  async processAudios(audioBuffers: Buffer[]): Promise<Array<{
    transcript: string;
    intent: string;
    result: ExecutionResult;
    audioResponse: Buffer;
  }>> {
    console.log(`[VoiceOps] Processing ${audioBuffers.length} audio buffers in parallel`);

    // Parallelize STT transcription
    const transcriptionPromises = audioBuffers.map(audioBuffer =>
      this.stt.transcribe(audioBuffer)
    );
    const transcriptions = await Promise.all(transcriptionPromises);

    // Parallelize intent parsing
    const intentPromises = transcriptions.map(transcription =>
      this.parser.parse(transcription.text)
    );
    const intents = await Promise.all(intentPromises);

    // Execute intents in parallel if independent, or sequentially if dependent
    const resultPromises = intents.map(intent => this.executeIntent(intent));
    const results = await Promise.all(resultPromises);

    // Format responses in parallel
    const responseTexts = results.map((result, index) => {
      const intent = intents[index];
      return result.success
        ? `Executed ${intent.intent}: ${result.output}`
        : `Failed to execute ${intent.intent}: ${result.error}`;
    });

    // Parallelize TTS synthesis
    const ttsPromises = responseTexts.map(text => this.tts.synthesize(text));
    const audioResponses = await Promise.all(ttsPromises);

    // Combine results
    return transcriptions.map((transcription, index) => ({
      transcript: transcription.text,
      intent: intents[index].intent,
      result: results[index],
      audioResponse: audioResponses[index]
    }));
  }

  private async executeIntent(intent: any): Promise<ExecutionResult> {
    const startTime = Date.now();

    console.log(`[VoiceOps] Executing intent: ${intent.intent}`);

    // Map intent to CLI command
    // In a real system, this would be dynamic or config-driven
    let commandToRun = '';

    if (intent.intent === 'api.health') {
      commandToRun = 'npx tsx ../devmesh/src/index.ts api health';
    } else if (intent.intent === 'system.ping') {
      commandToRun = 'npx tsx ../devmesh/src/index.ts ping';
    } else {
      return {
        success: false,
        output: '',
        error: `Unknown intent: ${intent.intent}`,
        duration: 0
      };
    }

    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);

      const { stdout, stderr } = await execAsync(commandToRun);

      // Strip ANSI codes for cleaner TTS
      // eslint-disable-next-line no-control-regex
      const cleanOutput = stdout.replace(/\u001b\[.*?m/g, '').trim();

      return {
        success: true,
        output: cleanOutput,
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }
}
