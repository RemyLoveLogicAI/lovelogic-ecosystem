import Conf from 'conf';
import { DevMeshConfig } from './types';

const configStore = new Conf<DevMeshConfig>({
  projectName: 'lovelogic-devmesh',
  defaults: {
    apiBaseUrl: 'http://localhost:3000',
    verbose: false,
  },
});

export class Config {
  static get(key: keyof DevMeshConfig): any {
    return configStore.get(key);
  }

  static set(key: keyof DevMeshConfig, value: any): void {
    configStore.set(key, value);
  }

  static getAll(): DevMeshConfig {
    return configStore.store;
  }

  static setApiUrl(url: string): void {
    configStore.set('apiBaseUrl', url);
  }

  static setAuthToken(token: string): void {
    configStore.set('authToken', token);
  }

  static getApiUrl(): string {
    return configStore.get('apiBaseUrl');
  }

  static getAuthToken(): string | undefined {
    return configStore.get('authToken');
  }

  static reset(): void {
    configStore.clear();
  }
}
