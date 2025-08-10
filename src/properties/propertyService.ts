/**
 * Manages Google Apps Script Properties Service
 * https://developers.google.com/apps-script/reference/properties?hl=ja
 */

class ScriptPropertiesManager {
  private properties: GoogleAppsScript.Properties.Properties;

  constructor() {
    this.properties = PropertiesService.getScriptProperties();
  }

  get(key: string): string | null {
    return this.properties.getProperty(key);
  }

  set(key: string, value: string): void {
    this.properties.setProperty(key, value);
  }

  delete(key: string): void {
    this.properties.deleteProperty(key);
  }

  setIfNotExists(key: string, value: string, logMessage?: string): boolean {
    if (this.properties.getProperty(key) === null) {
      if (logMessage) {
        console.log(logMessage);
      }
      this.properties.setProperty(key, value);
      return true;
    }
    return false;
  }

  exists(key: string): boolean {
    return this.properties.getProperty(key) !== null;
  }
}

class ZaimConfigService {
  private propertiesManager: ScriptPropertiesManager;

  constructor() {
    this.propertiesManager = new ScriptPropertiesManager();
  }

  registerApiCredentials(): void {
    try {
      this.validateConfig();

      this.propertiesManager.setIfNotExists(
        'ClientId',
        (OAUTH_CONFIG as any).CLIENT_ID,
        'Register ClientId'
      );

      this.propertiesManager.setIfNotExists(
        'ClientSecret',
        (OAUTH_CONFIG as any).CLIENT_SECRET,
        'Register ClientSecret'
      );
    } catch (error) {
      console.error('Zaim config registration error:', error);
      throw error;
    }
  }

  private validateConfig(): void {
    if (typeof OAUTH_CONFIG === 'undefined') {
      throw new Error('config.ts not found. Please copy config.template.ts to config.ts and set appropriate values.');
    }
  }

  getClientId(): string | null {
    return this.propertiesManager.get('ClientId');
  }

  getClientSecret(): string | null {
    return this.propertiesManager.get('ClientSecret');
  }

  hasCredentials(): boolean {
    return this.propertiesManager.exists('ClientId') && this.propertiesManager.exists('ClientSecret');
  }
}
