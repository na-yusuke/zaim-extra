/**
 * Register constants to Script Properties
 * https://developers.google.com/apps-script/reference/properties?hl=ja
 */

// TODO: class化する

// Manage Properties Service instance globally for efficiency
const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();

function registerZaimApiKey(): void {
  try {
    if (typeof OAUTH_CONFIG === 'undefined') {
      throw new Error('config.ts not found. Please copy config.template.ts to config.ts and set appropriate values.');
    }

    registerPropertyIfNotExists(
      'ClientId',
      (OAUTH_CONFIG as any).CLIENT_ID,
      'Register ClientId'
    );

    registerPropertyIfNotExists(
      'ClientSecret',
      (OAUTH_CONFIG as any).CLIENT_SECRET,
      'Register ClientSecret'
    );
  } catch (error) {
    console.error('Property registration error:', error);
    throw error;
  }
}

function registerPropertyIfNotExists(
  key: string,
  value: string,
  logMessage: string
): void {
  if (SCRIPT_PROPERTIES.getProperty(key) === null) {
    console.log(logMessage);
    SCRIPT_PROPERTIES.setProperty(key, value);
  }
}

function getScriptProperty(key: string): string | null {
  return SCRIPT_PROPERTIES.getProperty(key);
}

function setScriptProperty(key: string, value: string): void {
  SCRIPT_PROPERTIES.setProperty(key, value);
}

function deleteScriptProperty(key: string): void {
  SCRIPT_PROPERTIES.deleteProperty(key);
}
