/**
 * https://github.com/googleworkspace/apps-script-oauth1
 */

// @ts-ignore
declare var OAuth1: any;

function getServiceOauth1_(): any {
  try {
    const manager = new ScriptPropertiesManager();
    const clientId = manager.get('ClientId');
    const clientSecret = manager.get('ClientSecret');

    if (!clientId || !clientSecret) {
      throw new Error('OAuth settings not found. Please run registerZaimApiKey() first.');
    }

    return (OAuth1 as any).createService('Zaim')
      .setAccessTokenUrl(API_ENDPOINTS.ACCESS_TOKEN)
      .setRequestTokenUrl(API_ENDPOINTS.REQUEST_TOKEN)
      .setAuthorizationUrl(API_ENDPOINTS.AUTHORIZATION)
      .setConsumerKey(clientId)
      .setConsumerSecret(clientSecret)
      .setCallbackFunction('authCallback')
      .setPropertyStore(PropertiesService.getUserProperties());
  } catch (error) {
    console.error('OAuth service initialization error:', error);
    throw error;
  }
}

function authCallback(request: any): GoogleAppsScript.HTML.HtmlOutput {
  try {
    const service = getServiceOauth1_();
    const isAuthorized = service.handleCallback(request);

    if (isAuthorized) {
      return HtmlService.createHtmlOutput('Success! You can close this tab.');
    } else {
      return HtmlService.createHtmlOutput('Denied. You can close this tab');
    }
  } catch (error) {
    console.error('Authentication callback error:', error);
    return HtmlService.createHtmlOutput('Error occurred during authentication. Please try again.');
  }
}

function logout(): void {
  try {
    const service = getServiceOauth1_();
    service.reset();
    console.log('Logout completed');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
