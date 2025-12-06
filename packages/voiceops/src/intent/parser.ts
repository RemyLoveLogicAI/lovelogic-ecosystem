import { Intent, IntentParser } from '../types';

export class BasicIntentParser implements IntentParser {
  async parse(transcript: string): Promise<Intent> {
    const normalized = transcript.toLowerCase().trim();

    // Basic keyword matching
    if (normalized.includes('health') || normalized.includes('status')) {
      return {
        intent: 'api.health',
        command: 'll',
        args: ['api', 'health'],
        options: {},
        confidence: 0.9,
        requiresConfirmation: false
      };
    }

    if (normalized.includes('ping')) {
      return {
        intent: 'system.ping',
        command: 'll',
        args: ['ping'],
        options: {},
        confidence: 0.95,
        requiresConfirmation: false
      };
    }

    // Browser intents
    if (normalized.includes('open') || normalized.includes('go to')) {
      const url = normalized.replace('open', '').replace('go to', '').trim();
      return {
        intent: 'browser.open',
        command: 'll',
        args: ['browser', 'open', url],
        options: {},
        confidence: 0.9,
        requiresConfirmation: false
      };
    }

    if (normalized.includes('search for') || normalized.includes('google')) {
       const query = normalized.replace('search for', '').replace('google', '').trim();
       return {
         intent: 'browser.search',
         command: 'll',
        args: ['browser', 'search', query],
         options: {},
         confidence: 0.85,
         requiresConfirmation: false
       };
    }

    if (normalized.includes('click')) {
        // Extract selector
        let selector = normalized.split('click ')[1]?.trim() || 'body';

        // Intelligent ARIA Inference
        // If it doesn't look like a CSS ID (#) or Class (.), treat as a Semantic Label
        if (!selector.startsWith('#') && !selector.startsWith('.') && selector !== 'body') {
            selector = `aria/${selector}`;
        }

        return {
            intent: 'browser.click',
            command: 'll',
            args: ['browser', 'click', selector],
            options: {},
            confidence: 0.85,
            requiresConfirmation: false
        };
    }

    if (normalized.includes('read')) {
        const selector = normalized.split('read ')[1]?.trim() || 'body';
        return {
            intent: 'browser.read',
            command: 'll',
            args: ['browser', 'read', selector],
            options: {},
            confidence: 0.85,
            requiresConfirmation: false
        };
    }

    if (normalized.includes('screenshot') || normalized.includes('capture')) {
      return {
        intent: 'browser.screenshot',
        command: 'll',
        args: ['browser', 'screenshot'],
        options: {},
        confidence: 0.9,
        requiresConfirmation: false
      };
    }

    if (normalized.includes('analyze') || (normalized.includes('what') && (normalized.includes('screen') || normalized.includes('see')))) {
       return {
         intent: 'browser.analyze',
         command: 'll',
         args: ['browser', 'analyze'],
         options: {},
         confidence: 0.9,
         requiresConfirmation: false
       };
    }

    if (normalized.includes('type')) {
        // Naive parsing: "type [text] into [selector]"
        // For MVP, we might just assume "type [text]" types into currently focused or body?
        // Or strictly "type hello world" -> types "hello world" into a default input?
        // Let's go with "type [text] into [selector]" if 'into' exists, else type into 'input'.

        let text = '';
        let selector = 'input'; // Default

        if (normalized.includes(' into ')) {
            const parts = normalized.split(' into ');
            text = parts[0].replace('type', '').trim();
            selector = parts[1].trim();
        } else {
             text = normalized.replace('type', '').trim();
        }

        return {
            intent: 'browser.type',
            command: 'll',
            args: ['browser', 'type', selector, text],
            options: {},
            confidence: 0.8,
            requiresConfirmation: false
        };
    }

    if (normalized.includes('read')) {
        const selector = normalized.replace('read', '').trim() || 'body';
        return {
            intent: 'browser.read',
            command: 'll',
            args: ['browser', 'read', selector],
            options: {},
            confidence: 0.8,
            requiresConfirmation: false
        };
    }

    // Default fallback
    return {
      intent: 'unknown',
      command: '',
      args: [],
      options: {},
      confidence: 0.0,
      requiresConfirmation: false
    };
  }
}
