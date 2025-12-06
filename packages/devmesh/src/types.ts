export interface DevMeshConfig {
  apiBaseUrl: string;
  authToken?: string;
  verbose: boolean;
}

export interface CommandOptions {
  verbose?: boolean;
  config?: string;
}

export interface HealthResponse {
  service: string;
  status: string;
  timestamp: string;
  version: string;
}

// Plugin interface for future platform integrations
export interface PlatformPlugin {
  name: string;
  version: string;
  commands: PluginCommand[];
  initialize: () => Promise<void>;
}

export interface PluginCommand {
  name: string;
  description: string;
  execute: (args: string[], options: CommandOptions) => Promise<void>;
}
