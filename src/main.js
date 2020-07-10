(() => {

  const postTitleInputElem = document.querySelector('.js-post-title-field');
  const postContentPreviwElem = document.querySelector('#wmd-preview');

  const tagsContainer = document.querySelector('.js-tag-editor-container');
  const tagEditorElem = document.querySelector('.js-tag-editor');
  const tagEditorInputElem = document.querySelector('#tageditor-replacing-tagnames--input');

  const autoTagButton = document.createElement('button');
  autoTagButton.innerText = 'Auto tag';
  autoTagButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();

    const title = postTitleInputElem.value;
    const content = postContentPreviwElem.innerHTML;

    console.log();

    const url = 'https://a.gcp-eu-west-1.platform.peltarion.com/deployment/cca1630b-1737-4da8-9b4f-f12aef489f04/forward';
    const token = 'ca7ffe43-e7bc-48b7-b9be-e1d3b9016016'
    const inputParam = 'content';

    const body = {
      rows: [
        [ { [inputParam]: `${title}\n${content}` } ]
      ]
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(resp => resp.ok ? resp : new Error('opps!'))
      .then(resp => resp.json())
      .then(json => console.log(json));

    tagEditorInputElem.focus();
    tagEditorInputElem.value = 'javascript golang java';
    tagEditorElem.click();

  })

  tagsContainer.appendChild(autoTagButton);

})();

