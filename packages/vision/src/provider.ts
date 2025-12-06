export interface VisionResponse {
  description: string;
  elements?: { label: string; box?: [number, number, number, number] }[];
}

export interface VisionProvider {
  analyze(base64Image: string, prompt?: string): Promise<VisionResponse>;
}

export class MockVisionProvider implements VisionProvider {
  async analyze(base64Image: string, prompt: string = 'Describe this screen'): Promise<VisionResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      description: `[MOCK VLM] I see a screenshot (Base64 length: ${base64Image.length}). It looks like a web page.`,
      elements: [
        { label: 'Login Button', box: [100, 100, 200, 150] }
      ]
    };
  }
}
