import * as fs from 'fs-extra';

export class ImageProcessor {
  /**
   * Reads an image file and converts it to a Base64 string.
   * @param path Absolute path to the image file.
   */
  static async toBase64(path: string): Promise<string> {
    if (!await fs.pathExists(path)) {
      throw new Error(`Image file not found: ${path}`);
    }
    const buffer = await fs.readFile(path);
    return buffer.toString('base64');
  }
}
