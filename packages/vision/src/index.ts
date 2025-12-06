import { ImageProcessor } from './image';
import { VisionProvider, MockVisionProvider, VisionResponse } from './provider';

export class VisionClient {
  private provider: VisionProvider;

  constructor(provider?: VisionProvider) {
    this.provider = provider || new MockVisionProvider();
  }

  async analyze(imagePath: string, prompt: string = "What do you see?"): Promise<VisionResponse> {
    console.log(`[VisionClient] Analyzing image: ${imagePath}`);
    const base64 = await ImageProcessor.toBase64(imagePath);
    return this.provider.analyze(base64, prompt);
  }
}

export * from './provider';
export * from './image';
