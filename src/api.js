
export default class ApiClient {

  static getInstance() {
    if (!ApiClient._instance) {
      ApiClient._instance = new ApiClient();
    }
    return ApiClient._instance;
  }

  constructor() {
    this._setupDefaultConfig();
    this._setupMessaging();
  }

  _setupDefaultConfig() {
    chrome.storage.sync.get('deployment', (data) => {
      this._config = data.deployment;
    });
  }

  _setupMessaging() {
    this._messagePort = chrome.runtime.connect({ name: 'pelt-suggest-content' });
    this._messagePort.onMessage.addListener(action => {

      if (action.type === 'DEPLOYMENT-UPDATED') {
        this._config = action.payload;
      }

    });
  }

  async request(url, method = 'GET', body, headers = {}) {

    const response = await fetch(url, {
        method,
        headers: { ...headers },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error('Error ' + response.status + ': ' + response.statusText);
    }

    return response.json();
}

  async requestTags(title, content) {
    const { url, token, inputParam } = this._config;
    const body = { rows: [ { [inputParam]: `${title}\n${content}` } ] };
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.request(url, 'POST', body, headers);
  }

}
