# VoiceOps

**Voice-driven development and agent control for LoveLogic AI**

## Overview

VoiceOps enables developers to control DevMesh CLI and LogicStarter agents using natural voice commands. This package contains the architecture design and type definitions for the voice-to-CLI integration layer.

## Status

🚧 **Architecture Phase** - This package currently contains design documentation and TypeScript interfaces. Full implementation is planned for Phase 2.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the complete system design, including:

- Voice-to-CLI flow diagram
- STT/TTS backend options
- Intent parsing strategies
- Safety and confirmation patterns
- DevMesh integration approaches

## Core Concepts

### Voice Flow

```
Voice Input → STT → Intent Parser → Safety Check → DevMesh CLI → Result → TTS → Voice Output
```

### Voice-Safe Commands

Commands that can be auto-executed without confirmation:

- `ll ping`
- `ll api health`
- `ll config show`

### Confirmation Required

Commands that require explicit user confirmation:

- `ll api set-url <url>`
- `ll config reset`
- Any deployment or destructive operations

## Planned Features

### Phase 1 (Design - Current)

- ✅ Architecture documentation
- ✅ TypeScript interfaces
- ✅ Integration patterns

### Phase 2 (Implementation - Future)

- [ ] Whisper STT integration
- [ ] Coqui TTS integration
- [ ] Intent parser implementation
- [ ] DevMesh CLI integration
- [ ] Safety and confirmation system
- [ ] Session management

### Phase 3 (Advanced - Future)

- [ ] Multi-turn conversations
- [ ] Context awareness
- [ ] Voice-driven code editing
- [ ] Mobile app integration

## Technology Stack

### STT (Speech-to-Text)

- **Primary:** Whisper (OpenAI) - Open-source, highly accurate
- **Alternative:** Coqui STT - Privacy-focused
- **Browser:** Web Speech API - Quick prototyping
- **Premium:** ElevenLabs (optional)

### TTS (Text-to-Speech)

- **Primary:** Coqui TTS - Natural voices, open-source
- **Alternative:** Bark - Very natural, multilingual
- **Browser:** Web Speech API - Quick prototyping
- **Premium:** ElevenLabs (optional)

## Type Definitions

See [src/types.ts](./src/types.ts) for complete TypeScript interfaces:

- `VoiceCommand` - Voice input structure
- `IntentParseResult` - Parsed command intent
- `ExecutionResult` - Command execution result
- `STTProvider` - Speech-to-text interface
- `TTSProvider` - Text-to-speech interface
- `VoiceSession` - Session management

## Integration with DevMesh

VoiceOps will integrate with DevMesh in two ways:

### 1. DevMesh Plugin

```bash
ll voice listen          # Start voice session
ll voice configure       # Configure STT/TTS
```

### 2. Standalone Mode

```bash
voiceops start          # Continuous voice loop
```

## Example Usage (Future)

```typescript
import { VoiceOps } from '@lovelogic/voiceops';

const voiceOps = new VoiceOps({
  stt: 'whisper',
  tts: 'coqui',
  confirmDestructive: true
});

await voiceOps.start();

// User says: "Check API health"
// VoiceOps: Executes `ll api health`
// VoiceOps: Speaks "API is healthy, version 0.1.0"
```

## Security

- **Local Processing:** Whisper/Coqui run on-device (no cloud)
- **Command Whitelist:** Only predefined commands allowed
- **Confirmation Required:** For destructive operations
- **Session Timeout:** Auto-logout after inactivity

## Development Roadmap

1. **Q1 2025:** Complete architecture design ✅
2. **Q2 2025:** Implement STT/TTS integrations
3. **Q3 2025:** Build intent parser and safety system
4. **Q4 2025:** DevMesh integration and testing

## Contributing

This is currently in the design phase. Implementation will begin in Phase 2.

## License

UNLICENSED - Proprietary software for LoveLogic AI
