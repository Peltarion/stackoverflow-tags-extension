const deploymentUrlInput = document.querySelector('input[name="url"]');
const deploymentTokenInput = document.querySelector('input[name="token"]');
const deploymentParamInput = document.querySelector('input[name="param"]');
const saveButton = document.querySelector('.save-btn');
const resetButton = document.querySelector('.reset-btn');

// initial deployment fill
chrome.storage.sync.get('deployment', (data) => {
  updateInputFieldsWithDeployment(data.deployment);
});

// messageing
const messagePort = chrome.runtime.connect({ name: 'pelt-suggest-popup' });
messagePort.onMessage.addListener(action => {

  if (action.type === 'DEPLOYMENT-UPDATED') {
    updateInputFieldsWithDeployment(action.payload);
  }

});

function updateInputFieldsWithDeployment(deployment) {
  const { url, token, inputParam } = deployment;
  deploymentUrlInput.value = url;
  deploymentTokenInput.value = token;
  deploymentParamInput.value = inputParam;
}


// ev listeners
saveButton.addEventListener('click', (ev) => {
  ev.preventDefault();
  messagePort.postMessage({ type: 'SAVE-DEPLOYMENT', payload: {
    url: deploymentUrlInput.value,
    token: deploymentTokenInput.value,
    inputParam: deploymentParamInput.value
  }});
})

resetButton.addEventListener('click', (ev) => {
  ev.preventDefault();
  messagePort.postMessage({ type: 'RESET-DEPLOYMENT' });
})
