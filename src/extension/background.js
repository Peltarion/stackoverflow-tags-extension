
const defaultDeployment = Object.freeze({
  url: 'https://a.gcp-eu-west-1.platform.peltarion.com/deployment/cca1630b-1737-4da8-9b4f-f12aef489f04/forward',
  token: 'ca7ffe43-e7bc-48b7-b9be-e1d3b9016016',
  inputParam: 'content'
});

chrome.runtime.onInstalled.addListener(function() {

  // set default deployment on install
  resetDeployment();

  // show popup on stackoverflow.
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'stackoverflow.com' },
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});


const allowedPorts = ['pelt-suggest-popup', 'pelt-suggest-content']
const ports = {};
chrome.runtime.onConnect.addListener(function(port) {

  if (!allowedPorts.includes(port.name)) {
    return;
  }

  ports[port.name] = port;

  port.onMessage.addListener(async (action) => {
    const { type, payload } = action;

    switch (type) {
      case 'RESET-DEPLOYMENT':
        await resetDeployment();
        broadcastAction(ports, { type: 'DEPLOYMENT-UPDATED', payload: await getDeployment() });
        break;
      case 'SAVE-DEPLOYMENT':
        await setDeployment(payload);
        broadcastAction(ports, { type: 'DEPLOYMENT-UPDATED', payload: await getDeployment() });
        break;
    }

  });
});

function broadcastAction(ports = {}, action) {
  Object.values(ports).forEach(port => {
    port.postMessage(action);
  });
}

async function resetDeployment() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ deployment: defaultDeployment }, () => resolve());
  });
}

async function setDeployment(deployment) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ deployment }, () => resolve());
  });
}

async function getDeployment() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('deployment', (data) => resolve(data.deployment));
  });
}
