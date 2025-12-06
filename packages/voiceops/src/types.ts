export interface TranscriptionResult {
  text: string;
  confidence: number;
  language?: string;
  duration?: number;
}

export interface Intent {
  intent: string;
  command: string;
  args: string[];
  options: Record<string, any>;
  confidence: number;
  requiresConfirmation: boolean;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  duration: number;
}

export interface STTProvider {
  transcribe(audioBuffer: Buffer): Promise<TranscriptionResult>;
}

export interface TTSProvider {
  synthesize(text: string): Promise<Buffer>;
}

export interface IntentParser {
  parse(transcript: string): Promise<Intent>;
}

export interface ParallelProcessor {
  processAudios(audioBuffers: Buffer[]): Promise<Array<{
    transcript: string;
    intent: string;
    result: ExecutionResult;
    audioResponse: Buffer;
  }>>;
}
